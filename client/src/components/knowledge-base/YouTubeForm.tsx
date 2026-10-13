import { useState } from "react";
import { Play, Loader2, X, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { useIngestYouTubeMutation } from "../../store/rtkquery/api";

interface YouTubeFormProps { onUploadSuccess?: () => void; }

export default function YouTubeForm({ onUploadSuccess }: YouTubeFormProps) {
  const [ingestYouTube] = useIngestYouTubeMutation();
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validate = (u: string) => {
    try {
      const p = new URL(u);
      return ['youtube.com', 'youtu.be', 'www.youtube.com'].some(d => p.hostname.includes(d));
    } catch { return false; }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!url.trim()) { setError("Please enter a YouTube URL"); return; }
    if (!validate(url)) { setError("Please enter a valid YouTube URL"); return; }
    setIsLoading(true);
    try {
      const data = await ingestYouTube({ url }).unwrap();
      if (data.success) { toast.success("YouTube video added!"); setUrl(""); onUploadSuccess?.(); }
      else setError(data.message || "Failed to add video");
    } catch {
      const msg = "Failed to add video. Try again.";
      setError(msg); toast.error(msg);
    } finally { setIsLoading(false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center text-center py-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 mb-3">
          <Play size={20} className="text-red-600" />
        </div>
        <h3 className="text-base font-semibold">Add a YouTube video</h3>
        <p className="mt-1 text-sm text-zinc-500">We'll extract the transcript and index it.</p>
      </div>
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
        <div className="relative">
          <Play size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input type="url" placeholder="https://www.youtube.com/watch?v=..." value={url} onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading} className="w-full rounded-xl border border-zinc-200 pl-10 pr-4 py-3 text-sm focus:border-zinc-400 focus:outline-none disabled:opacity-50" />
        </div>
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <X size={13} className="shrink-0" />{error}
          </div>
        )}
        <button type="submit" disabled={isLoading || !url.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50">
          {isLoading ? <><Loader2 size={15} className="animate-spin" /> Processing...</> : <><ArrowRight size={15} /> Add YouTube Video</>}
        </button>
      </form>
    </div>
  );
}
