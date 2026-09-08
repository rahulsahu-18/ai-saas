import axios from "axios";
import { Coins } from "lucide-react";
import { useEffect, useState } from "react";

const CREDIT_UPDATED_EVENT = "credits-updated";

export function notifyCreditsUpdated() {
  window.dispatchEvent(new Event(CREDIT_UPDATED_EVENT));
}

export default function CreditBalance() {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    const loadBalance = async () => {
      try {
        const { data }: { data: { balance: number } } = await axios.get(
          "http://localhost:5000/api/v1/credit/balance",
          { withCredentials: true },
        );

        if (active) {
          setBalance(data.balance);
        }
      } catch (error) {
        console.error("Failed to load credit balance", error);
      }
    };

    void loadBalance();
    window.addEventListener(CREDIT_UPDATED_EVENT, loadBalance);

    return () => {
      active = false;
      window.removeEventListener(CREDIT_UPDATED_EVENT, loadBalance);
    };
  }, []);

  return (
    <div className="flex items-center gap-2 rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-700">
      <Coins size={16} />
      <span>{balance === null ? "Credits" : `${balance} credits`}</span>
    </div>
  );
}
