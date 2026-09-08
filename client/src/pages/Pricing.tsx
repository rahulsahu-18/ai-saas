import { ArrowRight, CirclePlus, MessageCircle, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

const pricingItems = [
  {
    label: "Add credits",
    description: "Add credits to your balance for uploads and conversations.",
    credits: "Credit balance",
    icon: CirclePlus,
  },
  {
    label: "Ask your assistant",
    description: "Send one question and get an answer from your documents.",
    credits: "2 credits",
    icon: MessageCircle,
  },
];

export default function Pricing() {
  return (
    <main className="min-h-screen bg-[#fafafa] text-zinc-950">
      <header className="border-b border-zinc-200/70 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-sm font-bold text-white">
              K
            </div>
            <span className="text-[17px] font-semibold tracking-tight">Knowbase</span>
          </Link>

          <Link
            to="/"
            className="text-sm font-medium text-zinc-600 transition hover:text-zinc-950"
          >
            Back to home
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-16 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-950 text-white">
            <Wallet size={20} />
          </div>
          <p className="mt-6 text-sm font-medium text-zinc-500">Simple credit pricing</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Pay only for what you use.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-zinc-500">
            Add credits to your balance and use them for document uploads and
            conversations.
          </p>
        </div>

        <section className="mt-12 grid gap-5 md:grid-cols-2">
          {pricingItems.map(({ label, description, credits, icon: Icon }) => (
            <article key={label} className="rounded-2xl border border-zinc-200 bg-white p-7">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100">
                  <Icon size={19} className="text-zinc-700" />
                </div>
                <span className="rounded-full bg-zinc-950 px-3 py-1 text-xs font-medium text-white">
                  {credits}
                </span>
              </div>
              <h2 className="mt-7 text-xl font-semibold">{label}</h2>
              <p className="mt-3 min-h-12 text-sm leading-6 text-zinc-500">{description}</p>
              <div className="mt-8 border-t border-zinc-100 pt-5 text-sm text-zinc-500">
                Credits are deducted when you use the service.
              </div>
            </article>
          ))}
        </section>

        <section className="mt-5 flex flex-col gap-5 rounded-2xl bg-zinc-950 p-7 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Ready to build your knowledge base?</h2>
            <p className="mt-2 text-sm text-zinc-400">Choose a credit amount to get started.</p>
          </div>
          <Link
            to="/files"
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
          >
            Add credits
            <ArrowRight size={16} />
          </Link>
        </section>
      </div>
    </main>
  );
}