import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { string, success } from "better-auth";
interface ISavedAPI {
    id:string
  name: string;
  provider: string;
  apiKey: string;
}
export const addApi = async (req: Request, res: Response) => {
  const { userId, apiKey, name, provider } = req.body;

  if (!userId) {
    return res.status(403).json({
      message: "Forbidden request",
      success: false,
    });
  }

  if (!apiKey || !name || !provider) {
    return res.status(400).json({
      message: "Fields are required",
      success: false,
    });
  }

  try {
    const savedApi = await prisma.apiKey.create({
      data: {
        userId,
        apiKey,
        name,
        provider,
      },
    });

    const savedApiKey: ISavedAPI = {
        id:savedApi.id,
      name: savedApi.name as string,
      provider: savedApi.provider,
      apiKey: "*****",
    };

    return res.status(201).json({
      message: "API key added successfully",
      success: true,
      data: savedApiKey,
    });
  } catch (error) {
    console.error("Error while saving API key:", error);

    return res.status(500).json({
      message: "Failed to save API key",
      success: false,
    });
  }
};

export const deleteApi = async (req: Request, res: Response) => {
  const { id } = req.body;

  if (!id) {
    return res.status(403).json({
      message: "Forbidden request",
      success: false,
    });
  }

  try {
    const result = await prisma.apiKey.deleteMany({
      where: {
        id,
      },
    });

    return res.status(200).json({
      message: "API key deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting API keys:", error);

    return res.status(500).json({
      message: "Failed to delete API keys",
      success: false,
    });
  }
};

export const updateApi = async (req: Request, res: Response) => {
  const { userId, id, name, apiKey, provider } = req.body;

  if (!userId) {
    return res.status(403).json({
      message: "Forbidden request",
      success: false,
    });
  }

  if (!id) {
    return res.status(400).json({
      message: "API key id is required",
      success: false,
    });
  }

  try {
    await prisma.apiKey.update({
      where: {
        id: id,
      },
      data: {
        name,
        apiKey,
        provider,
      },
    });

    return res.status(200).json({
      message: "API updated successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error updating API:", error);

    return res.status(500).json({
      message: "Failed to update API",
      success: false,
    });
  }
};
