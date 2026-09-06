import { FileText } from "lucide-react";
import type { Source } from "../../pages/chat/Chat";

interface SourcesProps {
  sources: Source[];
}

export function Sources({ sources }: SourcesProps) {
  return (
    <div className="mt-5">

      <div className="mb-2 flex items-center gap-2">
        <div className="h-px flex-1 bg-zinc-200" />

        <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
          Sources
        </span>

        <div className="h-px flex-1 bg-zinc-200" />
      </div>

      <div className="grid gap-2 sm:grid-cols-2">

        {sources.map((source) => (
          <button
            key={source.id}
            type="button"
            className="group rounded-xl border border-zinc-200 bg-white p-2 text-left transition hover:border-zinc-300 hover:shadow-sm"
          >

            <div className="flex items-center gap-2 ">

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100">
                <FileText
                  size={14}
                  className="text-zinc-500"
                />
              </div>

              <div className="min-w-0">

                <p className="truncate text-xs font-semibold text-zinc-700">
                  {source.filename}
                </p>
              </div>
            </div>
          </button>
        ))}

      </div>

    </div>
  );
}