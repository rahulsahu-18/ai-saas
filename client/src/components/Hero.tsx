import { ArrowRight, FileText, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="overflow-hidden pt-32 pb-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* Hero content */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-xs font-medium text-zinc-600 shadow-sm animate-fade-in">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Your documents. Your knowledge.
          </div>

          <h1 className="text-balance text-5xl font-semibold tracking-[-0.04em] text-zinc-950 sm:text-6xl lg:text-7xl animate-fade-in-up animate-delay-75">
            Chat with your documents
            <span className="block text-zinc-400">
              like you already know them.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-500 animate-fade-in-up animate-delay-150">
            Upload your documents, create a private knowledge base, and ask
            questions in natural language. Get answers grounded in your
            own information.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row animate-fade-in-up animate-delay-200">
            <Link to="/chat">
              <button className="group flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-zinc-950 px-6 text-sm font-medium text-white transition hover:bg-zinc-800 sm:w-auto">
                Get started
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            </Link>
            <a href="#how-it-works">
              <button className="h-11 w-full rounded-lg border border-zinc-200 bg-white px-6 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 sm:w-auto">
                See how it works
              </button>
            </a>
          </div>
        </div>

        {/* Product preview */}
        <div className="relative mx-auto mt-20 max-w-5xl animate-fade-in-up animate-delay-300">
          <div className="absolute left-1/2 top-10 -z-10 h-72 w-3/4 -translate-x-1/2 rounded-full bg-indigo-100/60 blur-3xl" />

          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_20px_60px_-20px_rgba(0,0,0,0.2)]">
            {/* Browser bar */}
            <div className="flex h-11 items-center border-b border-zinc-100 px-4 bg-zinc-50">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
              </div>
              <div className="mx-auto flex items-center gap-2 rounded-md bg-white border border-zinc-200 px-3 py-1">
                <span className="text-xs text-zinc-400">knowbase.app/chat</span>
              </div>
            </div>

            {/* App mockup */}
            <div className="grid min-h-[420px] grid-cols-12">
              {/* Sidebar */}
              <aside className="col-span-3 hidden border-r border-zinc-100 bg-zinc-50/80 p-4 md:flex md:flex-col">
                <div className="mb-5 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-950 text-xs font-bold text-white">K</div>
                  <span className="text-sm font-semibold">Knowbase</span>
                </div>
                <div className="space-y-1">
                  {['Chat', 'Knowledge Base', 'My Files', 'Pricing'].map((item, i) => (
                    <div key={item} className={`rounded-lg px-3 py-2 text-xs ${
                      i === 0 ? 'bg-zinc-950 text-white font-medium' : 'text-zinc-500'
                    }`}>{item}</div>
                  ))}
                </div>
                <div className="mt-4 space-y-1">
                  <p className="px-1 text-[9px] font-semibold uppercase tracking-wider text-zinc-400 mb-2">Recent</p>
                  {['API architecture', 'Auth flow', 'Data models'].map(title => (
                    <div key={title} className="rounded-lg px-3 py-1.5 text-xs text-zinc-500 truncate hover:bg-zinc-100">{title}</div>
                  ))}
                </div>
              </aside>

              {/* Chat */}
              <div className="col-span-12 flex flex-col md:col-span-9">
                <div className="border-b border-zinc-100 px-5 py-3 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-950 text-white">
                    <Sparkles size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Knowledge Base</p>
                    <p className="text-xs text-zinc-400">Document assistant</p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-end gap-4 p-5">
                  <div className="flex justify-end">
                    <div className="max-w-sm rounded-2xl rounded-br-md bg-zinc-950 px-4 py-3 text-sm leading-6 text-white">
                      How does authentication work in the API?
                    </div>
                  </div>

                  <div className="max-w-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-950 text-white">
                        <Sparkles size={11} />
                      </div>
                      <span className="text-xs font-semibold text-zinc-500">Assistant</span>
                    </div>
                    <p className="text-sm leading-7 text-zinc-700">
                      Authentication uses JWT tokens. After signing in, the API returns a short-lived access token and a refresh token stored in an HTTP-only cookie.
                    </p>
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] text-zinc-400">
                      <FileText size={11} />
                      Based on 3 documents
                    </div>
                  </div>

                  <div className="relative rounded-xl border border-zinc-200 bg-white shadow-sm">
                    <div className="px-4 py-3 text-sm text-zinc-400">Ask anything about your documents...</div>
                    <div className="absolute right-2 bottom-2 flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-white">
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}