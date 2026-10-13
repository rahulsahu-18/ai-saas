import { useEffect, useState } from "react";
import { Loader2, Zap, Plus, Minus } from "lucide-react";
import toast from "react-hot-toast";
import { useCreatePaymentOrderMutation, useVerifyPaymentMutation } from "../store/rtkquery/api";

declare global {
  interface Window { Razorpay: any; }
}

interface BuyCreditsProps {
  onSuccess?: () => void;
}

const QUICK_AMOUNTS = [10, 25, 50, 100];
const PRICE_PER_CREDIT = 2;

export default function BuyCredits({ onSuccess }: BuyCreditsProps) {
  const [createPaymentOrder] = useCreatePaymentOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const [credits, setCredits] = useState(10);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { try { document.body.removeChild(script); } catch {} };
  }, []);

  const handleBuy = async () => {
    if (credits < 1) { toast.error("Select at least 1 credit"); return; }
    setLoading(true);
    try {
      const orderRes = await createPaymentOrder({ credits }).unwrap();
      if (!orderRes.success) throw new Error(orderRes.message);
      const order = orderRes.order;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Knowbase",
        description: `${order.credits} Credits`,
        order_id: order.id,
        handler: async (response: { razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            const res = await verifyPayment({ orderId: order.id, paymentId: response.razorpay_payment_id, signature: response.razorpay_signature }).unwrap();
            if (res.success) { toast.success(`Added ${credits} credits!`); setCredits(10); onSuccess?.(); }
            else toast.error(res.message || "Verification failed");
          } catch { toast.error("Failed to verify payment"); }
          finally { setLoading(false); }
        },
        theme: { color: "#09090b" },
        modal: { ondismiss: () => setLoading(false) },
      };
      new window.Razorpay(options).open();
    } catch {
      toast.error("Failed to create payment order");
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6">
      <h3 className="text-base font-semibold mb-5">Purchase Credits</h3>

      <div className="mb-5">
        <p className="text-xs font-medium text-zinc-500 mb-3">Quick select</p>
        <div className="flex flex-wrap gap-2">
          {QUICK_AMOUNTS.map((amt) => (
            <button key={amt} onClick={() => setCredits(amt)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                credits === amt ? 'border-zinc-950 bg-zinc-950 text-white' : 'border-zinc-200 text-zinc-700 hover:border-zinc-300'
              }`}>
              {amt} credits
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <p className="text-xs font-medium text-zinc-500 mb-3">Custom amount</p>
        <div className="flex items-center gap-3">
          <button onClick={() => setCredits(Math.max(1, credits - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 hover:bg-zinc-50">
            <Minus size={14} />
          </button>
          <input type="number" min="1" value={credits}
            onChange={(e) => setCredits(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-20 rounded-lg border border-zinc-200 px-3 py-2 text-center text-sm font-semibold focus:border-zinc-400 focus:outline-none" />
          <button onClick={() => setCredits(credits + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 hover:bg-zinc-50">
            <Plus size={14} />
          </button>
          <span className="text-sm text-zinc-500">x ₹{PRICE_PER_CREDIT} each</span>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-zinc-50 px-5 py-4 mb-4">
        <div>
          <p className="text-xs text-zinc-500">Total</p>
          <p className="text-2xl font-bold">₹{credits * PRICE_PER_CREDIT}</p>
        </div>
        <button onClick={() => void handleBuy()} disabled={loading || credits < 1}
          className="flex items-center gap-2 rounded-xl bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50">
          {loading ? <><Loader2 size={15} className="animate-spin" /> Processing...</> : <><Zap size={15} /> Buy {credits} credits</>}
        </button>
      </div>

      <p className="text-xs text-zinc-400">Credits are non-refundable and used when you add content or ask questions.</p>
    </div>
  );
}
