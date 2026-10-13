import { FileText, Globe, Play } from "lucide-react";

interface SourcesProps {
  sources: string[];
}

function getSourceIcon(source: string) {
  const lower = source.toLowerCase();
  if (lower.includes('youtube') || lower.includes('youtu.be')) return Play;
  if (lower.startsWith('http')) return Globe;
  return FileText;
}

export function Sources({ sources }: SourcesProps) {
  return (
    <div className="mt-5 border-t border-zinc-100 pt-4">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
        Sources
      </p>
      <div className="flex flex-wrap gap-2">
        {sources.map((source, index) => {
          const Icon = getSourceIcon(source);
          return (
            <div
              key={`${source}-${index}`}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-600 shadow-sm"
            >
              <Icon size={11} className="shrink-0 text-zinc-400" />
              <span className="max-w-[160px] truncate font-medium">{source}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}