import { useState } from "react";
import { Play, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

interface YouTubeFormProps {
  userId?: string;
  onUploadSuccess?: () => void;
}

export default function YouTubeForm({ userId, onUploadSuccess }: YouTubeFormProps) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validateYoutubeUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      const validDomains = ["youtube.com", "youtu.be", "www.youtube.com"];
      return validDomains.some(domain => urlObj.hostname.includes(domain));
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!url.trim()) {
      setError("Please enter a YouTube URL");
      return;
    }

    if (!validateYoutubeUrl(url)) {
      setError("Please enter a valid YouTube URL");
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/v1/add-youtube",
        { url, userId },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success("YouTube video added successfully!");
        setUrl("");
        onUploadSuccess?.();
      } else {
        setError(data.message || "Failed to add YouTube video");
        toast.error(data.message || "Failed to add YouTube video");
      }
    } catch (err) {
      const errorMsg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to add YouTube video. Please try again.";

      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Area */}
      <div className="rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 p-8 transition-colors hover:border-zinc-400 hover:bg-zinc-100">
        <Play className="mx-auto mb-4 h-12 w-12 text-red-500" />

        <h3 className="mb-2 text-lg font-semibold text-zinc-900">
          Add YouTube Video
        </h3>

        <p className="mb-6 text-sm text-zinc-600">
          Paste the YouTube video link to extract and analyze its transcript
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
            className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-600 py-2 text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Add YouTube Video
              </>
            )}
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <X className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
          <div>
            <p className="font-medium text-red-900">Error</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
