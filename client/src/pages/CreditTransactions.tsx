import { ArrowDownLeft, ArrowUpRight, Loader2, ReceiptText, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import {
  useGetCreditBalanceQuery,
  useGetCreditTransactionsQuery,
} from "../store/rtkquery/api";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const formatType = (type: "PURCHASE" | "USAGE") =>
  type === "PURCHASE" ? "Purchase" : "Usage";

export default function CreditTransactions() {
  const { data: balanceData } = useGetCreditBalanceQuery(undefined);
  const {
    data,
    isLoading,
    isError,
  } = useGetCreditTransactionsQuery(undefined);

  const transactions = data?.transactions ?? [];
  const totalPurchased = transactions
    .filter((tx) => tx.type === "PURCHASE")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const totalSpent = Math.abs(
    transactions
      .filter((tx) => tx.type === "USAGE")
      .reduce((sum, tx) => sum + tx.amount, 0),
  );

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-950 text-white">
            <ReceiptText size={18} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
              Credit Transactions
            </h1>
            <p className="text-sm text-zinc-500">
              Track every credit purchase and usage in one place.
            </p>
          </div>
        </div>

        <Link
          to="/pricing"
          className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
        >
          Buy credits
        </Link>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="mb-2 flex items-center gap-2 text-sm text-zinc-500">
            <Wallet size={15} className="text-zinc-400" />
            Available balance
          </div>
          <div className="text-2xl font-semibold text-zinc-950">
            {balanceData ? balanceData.balance : 0} credits
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="mb-2 flex items-center gap-2 text-sm text-zinc-500">
            <ArrowDownLeft size={15} className="text-emerald-500" />
            Purchased
          </div>
          <div className="text-2xl font-semibold text-emerald-600">
            +{totalPurchased} credits
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="mb-2 flex items-center gap-2 text-sm text-zinc-500">
            <ArrowUpRight size={15} className="text-amber-500" />
            Used
          </div>
          <div className="text-2xl font-semibold text-amber-600">
            -{totalSpent} credits
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
          <h2 className="text-base font-semibold text-zinc-950">Recent activity</h2>
          <span className="text-sm text-zinc-500">{transactions.length} entries</span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center gap-2 px-5 py-12 text-sm text-zinc-500">
            <Loader2 size={16} className="animate-spin" />
            Loading transactions...
          </div>
        ) : isError ? (
          <div className="px-5 py-12 text-center text-sm text-red-600">
            Could not load credit transactions. Please try again.
          </div>
        ) : transactions.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-zinc-500">
            No credit activity yet. Your purchases and usage will appear here.
          </div>
        ) : (
          <div className="divide-y divide-zinc-200">
            {transactions.map((transaction) => {
              const isPurchase = transaction.type === "PURCHASE";
              const amountLabel = `${isPurchase ? "+" : "-"}${Math.abs(transaction.amount)} credits`;

              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between gap-4 px-5 py-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        isPurchase
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {isPurchase ? (
                        <ArrowDownLeft size={17} />
                      ) : (
                        <ArrowUpRight size={17} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-zinc-900">
                        {transaction.description}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                        <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 font-medium text-zinc-600">
                          {formatType(transaction.type)}
                        </span>
                        <span>{formatDate(transaction.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`text-sm font-semibold ${
                      isPurchase ? "text-emerald-600" : "text-zinc-900"
                    }`}
                  >
                    {amountLabel}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
