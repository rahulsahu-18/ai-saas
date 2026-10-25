import { prisma } from "../lib/prisma.js";

export const getRecentChatHistory = async (
  chatId: string,
  userId: string,
) => {
  const messages = await prisma.chatMessage.findMany({
    where: {
      chatId,
      chat: {
        userId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 8,
    select: {
      role: true,
      content: true,
    },
  });

  return messages.reverse();
};