import { FileText, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function ChatSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-zinc-200 bg-white lg:flex lg:flex-col">

      {/* Logo */}
      <div className="flex h-16 items-center border-b border-zinc-200 px-5">

        <a
          href="/"
          className="flex items-center gap-2.5"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-xs font-bold text-white">
            K
          </div>

          <span className="text-sm font-semibold">
            Knowbase
          </span>
        </a>

      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">

        <Link
          to="/files"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
        >
          <FileText size={17} />
          Documents
        </Link>

        <a
          href="/chat"
          className="mt-1 flex items-center gap-3 rounded-lg bg-zinc-100 px-3 py-2.5 text-sm font-medium text-zinc-950"
        >
          <Sparkles size={17} />
          Chat
        </a>

      </nav>

      {/* Bottom */}
      <div className="border-t border-zinc-200 p-3">

        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900">
          Settings
        </button>

      </div>

    </aside>
  );
}


export function LoadingMessage() {
  return (
    <div className="mb-8 flex items-start gap-2">

      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-950 text-white">
        <Sparkles size={14} />
      </div>

      <div className="flex items-center gap-1 rounded-xl bg-white px-4 py-3">

        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400" />

        <span
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400"
          style={{ animationDelay: "100ms" }}
        />

        <span
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400"
          style={{ animationDelay: "200ms" }}
        />

      </div>

    </div>
  );
}