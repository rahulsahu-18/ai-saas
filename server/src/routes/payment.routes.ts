import express from "express";
import {
  createPaymentOrder,
  verifyPayment,
  getPricingInfo,
} from "../controllers/payment.controller.js";

const paymentRoutes = express.Router();

/**
 * Create a payment order (returns Razorpay orderId)
 * POST /api/v1/payment/create-order
 * Body: { credits: 10 }
 */
paymentRoutes.post("/create-order", createPaymentOrder);

/**
 * Verify payment signature and add credits
 * POST /api/v1/payment/verify
 * Body: { orderId, paymentId, signature }
 */
paymentRoutes.post("/verify", verifyPayment);

/**
 * Get pricing information
 * GET /api/v1/payment/pricing
 */
paymentRoutes.get("/pricing", getPricingInfo);

export default paymentRoutes;
