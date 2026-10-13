import { useEffect } from "react";
import { Coins } from "lucide-react";
import { useGetCreditBalanceQuery } from "../store/rtkquery/api";
import { useAuth } from "./auth/AuthProvider";

export const notifyCreditsUpdated = () => {
  window.dispatchEvent(new CustomEvent("credit-balance-updated"));
};

export default function CreditBalance() {
  const { isAuthenticated } = useAuth();
  const { data, refetch } = useGetCreditBalanceQuery(undefined, {
    skip: !isAuthenticated,
  });

  useEffect(() => {
    if (!isAuthenticated) return;

    const handleCreditsUpdated = () => {
      void refetch();
    };

    window.addEventListener("credit-balance-updated", handleCreditsUpdated);

    return () => {
      window.removeEventListener("credit-balance-updated", handleCreditsUpdated);
    };
  }, [isAuthenticated, refetch]);

  return (
    <div className="flex items-center gap-2 rounded-lg bg-zinc-100 px-3 py-2.5 text-sm font-medium text-zinc-700">
      <Coins size={16} className="text-zinc-500" />
      <span>{data ? `${data.balance} credits` : "Credits"}</span>
    </div>
  );
}
