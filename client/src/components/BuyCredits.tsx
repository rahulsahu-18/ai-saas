import { useEffect, useState } from "react";
import { Loader2, Zap } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface BuyCreditsProps {
  onSuccess?: () => void;
}

const PRICE_PER_CREDIT = 2; // ₹2 per credit

export default function BuyCredits({ onSuccess }: BuyCreditsProps) {
  const [credits, setCredits] = useState(10);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCreditsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    if (value >= 0) {
      setCredits(value);
    }
  };

  const calculatePrice = () => {
    return credits * PRICE_PER_CREDIT;
  };

  const handleBuyCredits = async () => {
    if (credits < 1) {
      toast.error("Please enter at least 1 credit");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create payment order
      const orderResponse = await axios.post(
        "http://localhost:5000/api/v1/payment/create-order",
        { credits },
        { withCredentials: true }
      );

      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.message);
      }

      const order = orderResponse.data.order;

      // Step 2: Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Doc Helper",
        description: `Purchase ${order.credits} Credits`,
        order_id: order.id,
        handler: async (response: any) => {
          // Step 3: Verify payment on backend
          try {
            const verifyResponse = await axios.post(
              "http://localhost:5000/api/v1/payment/verify",
              {
                orderId: order.id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              },
              { withCredentials: true }
            );

            if (verifyResponse.data.success) {
              toast.success(
                `Successfully added ${credits} credits to your account!`
              );
              setCredits(10);
              onSuccess?.();
            } else {
              toast.error(
                verifyResponse.data.message || "Payment verification failed"
              );
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error("Failed to verify payment");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: "User",
          email: "user@example.com",
        },
        theme: {
          color: "#000000",
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.error("Payment cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error creating payment:", error);
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to process payment";
      toast.error(errorMsg);
      setLoading(false);
    }
  };

  const totalPrice = calculatePrice();

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-zinc-900">Buy Credits</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Purchase credits to upload documents, YouTube videos, and websites
        </p>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-6">
        <div className="space-y-4">
          {/* Credit Input */}
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Number of Credits
            </label>
            <p className="mt-1 text-xs text-zinc-500">
              ₹{PRICE_PER_CREDIT} per credit
            </p>
            <input
              type="number"
              min="1"
              value={credits}
              onChange={handleCreditsChange}
              className="mt-2 w-full rounded-lg border border-zinc-300 px-4 py-2 text-lg font-semibold text-zinc-900 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Price Breakdown */}
          <div className="rounded-lg bg-blue-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-700">{credits} credits ×</span>
              <span className="text-sm font-medium text-zinc-900">
                ₹{PRICE_PER_CREDIT}
              </span>
            </div>
            <div className="mt-2 border-t border-blue-200 pt-2 text-right">
              <p className="text-2xl font-bold text-zinc-900">₹{totalPrice}</p>
            </div>
          </div>

          {/* Buy Button */}
          <button
            onClick={handleBuyCredits}
            disabled={loading || credits < 1}
            className="w-full rounded-lg bg-blue-500 py-3 font-semibold text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing Payment...
              </div>
            ) : (
              `Buy ${credits} Credits for ₹${totalPrice}`
            )}
          </button>
        </div>

        {/* Info */}
        <div className="mt-4 space-y-2 border-t border-zinc-200 pt-4">
          <div className="flex items-center gap-2 text-xs text-zinc-600">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span>Use credits for document uploads</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-600">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span>Use credits for YouTube videos</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-600">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span>Use credits for website scraping</span>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm text-blue-900">
          💡 <strong>Tip:</strong> Credits are non-refundable. Each credit is
          used when you upload content to your knowledge base.
        </p>
      </div>
    </div>
  );
}
