import { MessageCircle, Wallet, FileText, Globe, Play, Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import BuyCredits from "../components/BuyCredits";

const pricingItems = [
  { label: "Document upload", description: "Add PDF, DOCX, TXT to knowledge base.", credits: "2 credits", icon: FileText, color: "bg-blue-50 text-blue-600" },
  { label: "Website ingestion", description: "Scrape any public URL and index content.", credits: "2 credits", icon: Globe, color: "bg-cyan-50 text-cyan-600" },
  { label: "YouTube ingestion", description: "Extract and index a YouTube transcript.", credits: "2 credits", icon: Play, color: "bg-red-50 text-red-600" },
  { label: "Ask your assistant", description: "Get a RAG-powered answer from your knowledge base.", credits: "1 credit", icon: MessageCircle, color: "bg-violet-50 text-violet-600" },
];

export default function Pricing() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-10 lg:px-8">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-950 text-white">
            <Wallet size={18} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Credits & Pricing</h1>
        </div>
        <p className="text-sm text-zinc-500 ml-12">Pay only for what you use. Credits never expire.</p>
      </div>

      <div className="mb-10 grid gap-4 sm:grid-cols-2">
        {pricingItems.map(({ label, description, credits, icon: Icon, color }) => (
          <article key={label} className="rounded-2xl border border-zinc-200 bg-white p-6 transition hover:border-zinc-300 hover:shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
                <Icon size={18} />
              </div>
              <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold text-zinc-700">{credits}</span>
            </div>
            <h2 className="mt-5 text-base font-semibold text-zinc-900">{label}</h2>
            <p className="mt-1.5 text-sm leading-6 text-zinc-500">{description}</p>
          </article>
        ))}
      </div>

      <div className="my-8 flex items-center gap-3">
        <div className="h-px flex-1 bg-zinc-200" />
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-500">
          <Zap size={14} className="text-amber-500" />
          Buy Credits
        </div>
        <div className="h-px flex-1 bg-zinc-200" />
      </div>

      <div className="mb-6 flex justify-end">
        <Link
          to="/transactions"
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
        >
          View transaction history
          <ArrowRight size={15} />
        </Link>
      </div>

      <BuyCredits />
    </div>
  );
}