import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { getAuthenticatedUserId } from "../utils/utils.js";

export const getCreditBalance = async (req: Request, res: Response) => {
  try {
    const userId = await getAuthenticatedUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    const creditAccount = await prisma.creditAccount.findUnique({
      where: { userId },
      select: {
        balance: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      balance: creditAccount?.balance ?? 0,
      updatedAt: creditAccount?.updatedAt ?? null,
    });
  } catch (error) {
    console.error("Failed to fetch credit balance:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to fetch credit balance",
    });
  }
};

export const getAllCreditTransactions = async (req: Request, res: Response) => {
  try {
    const userId = await getAuthenticatedUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    const transactions = await prisma.creditTransaction.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        amount: true,
        type: true,
        description: true,
        createdAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      transactions,
    });
  } catch (error) {
    console.error("Failed to fetch credit transactions:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to fetch credit transactions",
    });
  }
};
