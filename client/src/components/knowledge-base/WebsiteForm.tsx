import { useState } from "react";
import { Globe, Loader2, X, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { useIngestWebsiteMutation } from "../../store/rtkquery/api";

interface WebsiteFormProps { onUploadSuccess?: () => void; }

export default function WebsiteForm({ onUploadSuccess }: WebsiteFormProps) {
  const [ingestWebsite] = useIngestWebsiteMutation();
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validate = (u: string) => { try { new URL(u); return true; } catch { return false; } };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!url.trim()) { setError("Please enter a URL"); return; }
    if (!validate(url)) { setError("Please enter a valid URL (include https://)"); return; }
    setIsLoading(true);
    try {
      const data = await ingestWebsite({ url }).unwrap();
      if (data.success) { toast.success("Website added!"); setUrl(""); onUploadSuccess?.(); }
      else setError(data.message || "Failed to add website");
    } catch {
      const msg = "Failed to add website. Try again.";
      setError(msg); toast.error(msg);
    } finally { setIsLoading(false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center text-center py-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-100 mb-3">
          <Globe size={20} className="text-cyan-600" />
        </div>
        <h3 className="text-base font-semibold">Add a website</h3>
        <p className="mt-1 text-sm text-zinc-500">We'll scrape and index the page content.</p>
      </div>
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
        <div className="relative">
          <Globe size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input type="url" placeholder="https://example.com" value={url} onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading} className="w-full rounded-xl border border-zinc-200 pl-10 pr-4 py-3 text-sm focus:border-zinc-400 focus:outline-none disabled:opacity-50" />
        </div>
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <X size={13} className="shrink-0" />{error}
          </div>
        )}
        <button type="submit" disabled={isLoading || !url.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50">
          {isLoading ? <><Loader2 size={15} className="animate-spin" /> Scraping...</> : <><ArrowRight size={15} /> Add Website</>}
        </button>
      </form>
    </div>
  );
}
