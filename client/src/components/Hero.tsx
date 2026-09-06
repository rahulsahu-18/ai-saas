import {
  ArrowRight,
  Database,
  FileText,
  MessageSquare,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="overflow-hidden pt-32">

      <div className="mx-auto max-w-7xl px-5 lg:px-8">

        {/* Hero content */}
        <div className="mx-auto max-w-4xl text-center">

          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-medium text-zinc-600 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Your documents. Your knowledge.
          </div>

          <h1 className="text-balance text-5xl font-semibold tracking-[-0.04em] text-zinc-950 sm:text-6xl lg:text-7xl">
            Chat with your documents
            <span className="block text-zinc-400">
              like you already know them.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-zinc-500">
            Upload your documents, create a private knowledge base,
            and ask questions in natural language. Get answers grounded
            in your own information.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
           <Link to={"/chat"}>
            <button className="group flex h-11 items-center justify-center gap-2 rounded-lg bg-zinc-950 px-6 text-sm font-medium text-white transition hover:bg-zinc-800">
              Get started

              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>
           </Link>

            <button className="h-11 rounded-lg border border-zinc-200 bg-white px-6 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50">
              See how it works
            </button>

          </div>
        </div>

        {/* Product preview */}
        <div className="relative mx-auto mt-20 max-w-6xl">

          {/* subtle background glow */}
          <div className="absolute left-1/2 top-20 -z-10 h-72 w-3/4 -translate-x-1/2 rounded-full bg-zinc-200/50 blur-3xl" />

          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)]">

            {/* Browser bar */}
            <div className="flex h-12 items-center border-b border-zinc-200 px-4">

              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
              </div>

              <div className="mx-auto text-xs text-zinc-400">
                knowbase.app
              </div>

            </div>

            {/* Application */}
            <div className="grid min-h-[500px] grid-cols-12">

              {/* Sidebar */}
              <aside className="col-span-3 hidden border-r border-zinc-200 bg-zinc-50/60 p-5 md:block">

                <div className="mb-6 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-950 text-xs font-bold text-white">
                    K
                  </div>

                  <span className="text-sm font-semibold">
                    Knowbase
                  </span>
                </div>

                <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                  Knowledge bases
                </div>

                <div className="rounded-lg bg-white px-3 py-2.5 text-sm font-medium shadow-sm ring-1 ring-zinc-200">
                  Product Documentation
                </div>

                <div className="mt-1 rounded-lg px-3 py-2.5 text-sm text-zinc-500">
                  Research Papers
                </div>

                <div className="mt-1 rounded-lg px-3 py-2.5 text-sm text-zinc-500">
                  Company Wiki
                </div>

                <div className="mt-8 border-t border-zinc-200 pt-5">
                  <div className="text-xs text-zinc-400">
                    Storage
                  </div>

                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-200">
                    <div className="h-full w-[35%] rounded-full bg-zinc-900" />
                  </div>

                  <div className="mt-2 text-xs text-zinc-500">
                    3.4 GB of 10 GB
                  </div>
                </div>

              </aside>

              {/* Chat */}
              <div className="col-span-12 flex flex-col md:col-span-9">

                {/* Chat header */}
                <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">

                  <div>
                    <div className="text-sm font-semibold">
                      Product Documentation
                    </div>

                    <div className="mt-0.5 text-xs text-zinc-400">
                      24 documents
                    </div>
                  </div>

                  <button className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium">
                    Knowledge base
                  </button>

                </div>

                {/* Messages */}
                <div className="flex flex-1 flex-col justify-end gap-6 p-6">

                  <div className="ml-auto max-w-md rounded-xl bg-zinc-950 px-4 py-3 text-sm leading-6 text-white">
                    How does authentication work in the API?
                  </div>

                  <div className="max-w-xl">

                    <div className="rounded-xl border border-zinc-200 bg-white px-5 py-4 text-sm leading-6 text-zinc-700">
                      Authentication is handled using JWT tokens.
                      After signing in, the API returns a token that
                      can be included with subsequent requests.
                    </div>

                    <div className="mt-2 flex items-center gap-2 px-1 text-[11px] text-zinc-400">
                      <FileText size={12} />
                      Based on 3 documents
                    </div>

                  </div>

                  {/* Input */}
                  <div className="mt-4 flex items-center rounded-xl border border-zinc-200 bg-white p-2 shadow-sm">

                    <div className="flex-1 px-3 text-sm text-zinc-400">
                      Ask anything about your documents...
                    </div>

                    <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-950 text-white">
                      <ArrowRight size={15} />
                    </button>

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