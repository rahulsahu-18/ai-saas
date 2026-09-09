import Razorpay from "razorpay";

// Initialize Razorpay with your API keys
// Get these from https://dashboard.razorpay.com/app/keys
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

// Credit pricing configuration
export const CREDIT_PRICING = {
  pricePerCredit: 2, // ₹2 per credit
  paiSePerCredit: 200, // 200 paise per credit
  currency: "INR",
  minCredits: 1,
  maxCredits: 10000, // Maximum credits per transaction
};
