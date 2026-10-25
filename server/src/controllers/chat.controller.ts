import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { vectorStore } from "../utils/pinecone.config.js";
import { model } from "../utils/model.js";
import { getAuthenticatedUserId, systemMessage } from "../utils/utils.js";
import { getRecentChatHistory } from "../utils/relevent.chat.js";

const CHAT_CREDIT_COST = 1;

export const allChat = async (req: Request, res: Response) => {
  const userId = await getAuthenticatedUserId(req);
  if (!userId)
    return res
      .status(403)
      .json({ success: false, message: "forbiden request userId not found" });
  try {
    const chats = await prisma.chatHistory.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({ success: true, chats });
  } catch (error) {
    return res.status(44).json({
      success: false,
      message: "something went worng while getting chats",
    });
  }
};

export const singleChat = async (req: Request, res: Response) => {
  const userId = await getAuthenticatedUserId(req);
  const chatId = req.params.id as string;

  if (!userId)
    return res
      .status(403)
      .json({ success: false, message: "forbiden request userId not found" });

  if (!chatId)
    return res
      .status(403)
      .json({ success: false, message: "forbiden request chatId not found" });

  try {
    const chat = await prisma.chatMessage.findMany({
      where: { chatId },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ chat, success: true });
  } catch (error) {
    return res
      .status(404)
      .json({
        success: false,
        message: "something went worng while get the chat",
      });
  }
};

export const deleteChat = async (req: Request, res: Response) => {
  const userId = await getAuthenticatedUserId(req);
  const chatId = req.params.id as string;

  if (!userId || !chatId) {
    return res.status(403).json({
      success: false,
      message: "Forbidden request",
    });
  }

  try {
    const deletedChat = await prisma.chatHistory.deleteMany({
      where: { id: chatId, userId },
    });

    if (deletedChat.count === 0) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the chat",
    });
  }
};

export const chat = async (req: Request, res: Response) => {
  const { message } = req.body;
  const chatId = req.params.id as string;
  const userId = await getAuthenticatedUserId(req);
  let currentChatId = chatId;

  if (!userId) {
    return res.status(403).json({
      success: false,
      message: "Forbidden request userId not found",
    });
  }

  if (!message) {
    return res.status(400).json({
      success: false,
      message: "Message is required",
    });
  }
    const creditAccount = await prisma.creditAccount.findUnique({
      where: { userId },
      select: { balance: true },
    });

    if (!creditAccount || creditAccount.balance < CHAT_CREDIT_COST) {
      return res.status(402).json({
        success: false,
        message: "Insufficient credits. Chatting requires 1 credit.",
      });
    }

    try {
      // Create chat only for the first message.
      if (!chatId) {
        const chat = await prisma.chatHistory.create({
          data: {
            id: crypto.randomUUID(),
            userId,
            title: message.slice(0, 15),
          },
        });

        currentChatId = chat.id;
      }
      const prevChat = await getRecentChatHistory(currentChatId,userId);

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      res.write(
        `event: chat_created\n` +
          `data: ${JSON.stringify({
            chatId: currentChatId,
          })}\n\n`,
      );

      await prisma.chatMessage.create({
        data: {
          id: crypto.randomUUID(),
          chatId: currentChatId,
          role: "USER",
          sources: [],
          content: message,
        },
      });

      const documents = await vectorStore.similaritySearch(message, 5, { userId });
      const context = documents.map((doc) => doc.pageContent).join("\n\n");
      const sources = [
        ...new Set(documents.map((doc) => doc.metadata.fileName as string)),
      ];
      console.log(prevChat)
      const humanMessage = `context :- [${context},${prevChat}] user question :- ${message}`;

      const stream = await model.stream([
        ["system", systemMessage],
        ["human", humanMessage],
      ]);

      res.write(
        `event: sources\n` +
          `data: ${JSON.stringify({ sources })}\n\n`,
      );

      let fullAnswer = "";

      for await (const chunk of stream) {
        const token = chunk.content;

        if (typeof token === "string" && token.length > 0) {
          fullAnswer += token;
          res.write(
            `event: token\n` +
              `data: ${JSON.stringify({ text: token })}\n\n`,
          );
        }
      }

      await prisma.chatMessage.create({
        data: {
          id: crypto.randomUUID(),
          chatId: currentChatId,
          role: "ASSISTANT",
          content: fullAnswer,
          sources,
        },
      });

      const charged = await prisma.$transaction(async (transaction) => {
        const result = await transaction.creditAccount.updateMany({
          where: {
            userId,
            balance: { gte: CHAT_CREDIT_COST },
          },
          data: {
            balance: { decrement: CHAT_CREDIT_COST },
          },
        });

        if (result.count === 0) {
          return false;
        }

        await transaction.creditTransaction.create({
          data: {
            id: crypto.randomUUID(),
            userId,
            amount: -CHAT_CREDIT_COST,
            type: "USAGE",
            description: `Chat message: ${message.slice(0, 100)}`,
          },
        });

        return true;
      });

      if (!charged) {
        res.write(
          `event: error\n` +
            `data: ${JSON.stringify({
              message: "Insufficient credits. Chatting requires 1 credit.",
            })}\n\n`,
        );
        return res.end();
      }

      res.write(`event: done\n` + `data: {}\n\n`);
      return res.end();
    } catch (error) {
      console.error("Chat error:", error);

      if (res.headersSent) {
        res.write(
          `event: error\n` +
            `data: ${JSON.stringify({ message: "Unable to complete chat" })}\n\n`,
        );
        return res.end();
      }

      return res.status(500).json({
        success: false,
        message: "Unable to complete chat",
      });
    }
return res.end();

};
