import { Request, Response } from "express";
import crypto from "node:crypto";
import { razorpay } from "../utils/razorpay.config.js";
import { prisma } from "../lib/prisma.js";
import { getAuthenticatedUserId } from "../utils/utils.js";

/**
 * Create a Razorpay order for credit purchase
 * Frontend will use this orderId to initialize Razorpay checkout
 */
export const createPaymentOrder = async (req: Request, res: Response) => {
  try {
    const userId = await getAuthenticatedUserId(req);
    const { credits } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!credits || credits < 1 || !Number.isInteger(credits)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credit amount" });
    }

    const priceInPaise = credits * 200; // ₹2 per credit = 200 paise

    // Get user email for receipt
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: priceInPaise, // Amount in paise
      currency: "INR",
      receipt: `receipt_${userId}_${Date.now()}`,
      notes: {
        userId,
        credits,
        userEmail: user.email,
        userName: user.name,
      },
    });

    return res.status(200).json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        credits,
        displayPrice: `₹${credits * 2}`,
      },
    });
  } catch (error) {
    console.error("Error creating payment order:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create payment order" });
  }
};

/**
 * Verify payment and add credits to user account
 * Called after successful Razorpay payment
 */
export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const userId = await getAuthenticatedUserId(req);
    const { orderId, paymentId, signature } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification details",
      });
    }

    // Verify payment signature (Very Important - prevents fraud!)
    const shasum = crypto.createHmac(
      "sha256",
      process.env.RAZORPAY_KEY_SECRET || ""
    );
    shasum.update(`${orderId}|${paymentId}`);
    const digest = shasum.digest("hex");

    if (digest !== signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed - signature mismatch",
      });
    }

    // Fetch order details from Razorpay to get credits amount
    const order = await razorpay.orders.fetch(orderId);
    const creditsAmount = order.notes?.credits as number;

    if (!creditsAmount || creditsAmount < 1) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credit amount in order" });
    }

    // Add credits to user account in a transaction
    await prisma.$transaction(async (transaction) => {
      // Update or create credit account
      await transaction.creditAccount.upsert({
        where: { userId },
        update: {
          balance: {
            increment: creditsAmount,
          },
        },
        create: {
          userId,
          balance: creditsAmount,
        },
      });

      // Record the transaction
      await transaction.creditTransaction.create({
        data: {
          id: crypto.randomUUID(),
          userId,
          amount: creditsAmount,
          type: "PURCHASE",
          description: `Credit purchase via Razorpay - Order: ${orderId}, Payment: ${paymentId}`,
        },
      });
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified and credits added successfully",
      credits: creditsAmount,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to verify payment" });
  }
};

/**
 * Get pricing information
 */
export const getPricingInfo = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      pricePerCredit: 2,
      currency: "INR",
      message: "Each credit costs ₹2",
    });
  } catch (error) {
    console.error("Error fetching pricing info:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch pricing info" });
  }
};
