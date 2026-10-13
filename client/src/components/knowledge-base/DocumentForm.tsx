import { useRef, useState } from "react";
import { Upload, FileText, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";
import { useIngestDocumentMutation } from "../../store/rtkquery/api";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED = [".pdf", ".doc", ".docx", ".txt"];

interface DocumentFormProps {
  onUploadSuccess?: () => void;
}

export default function DocumentForm({ onUploadSuccess }: DocumentFormProps) {
  const [ingestDocument] = useIngestDocumentMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const validate = (file: File) => {
    const ext = "." + (file.name.split(".").pop()?.toLowerCase() ?? "");
    if (!ACCEPTED.includes(ext)) return "Unsupported type. Use PDF, DOC, DOCX or TXT.";
    if (file.size > MAX_FILE_SIZE) return "File too large. Max 10 MB.";
    return null;
  };

  const handleFile = (file: File) => {
    setError("");
    const err = validate(file);
    if (err) { setError(err); return; }
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setError("");
    try {
      const data = await ingestDocument(selectedFile).unwrap();
      if (data.success) {
        toast.success(`Uploaded successfully (${data.chunkSize} chunks)`);
        setSelectedFile(null);
        onUploadSuccess?.();
      } else {
        setError(data.message || "Upload failed");
      }
    } catch {
      setError("Upload failed. Please try again.");
      toast.error("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => !selectedFile && !isUploading && fileInputRef.current?.click()}
        className={`flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition ${
          isDragging ? 'border-zinc-400 bg-zinc-50' :
          selectedFile ? 'border-zinc-200 bg-zinc-50 cursor-default' :
          'border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50'
        }`}
      >
        {selectedFile ? (
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
              <FileText size={20} className="text-blue-600" />
            </div>
            <p className="text-sm font-medium text-zinc-900">{selectedFile.name}</p>
            <p className="text-xs text-zinc-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            <button type="button" onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setError(""); }}
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-600 mt-1">
              <X size={11} /> Remove
            </button>
          </div>
        ) : (
          <>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 mb-3">
              <Upload size={20} className="text-zinc-500" />
            </div>
            <p className="text-sm font-medium text-zinc-900">Drag & drop a file here</p>
            <p className="mt-1 text-xs text-zinc-400">or click to browse</p>
            <p className="mt-3 text-[11px] text-zinc-400">PDF, DOC, DOCX, TXT · Max 10 MB</p>
          </>
        )}
        <input ref={fileInputRef} type="file" accept={ACCEPTED.join(",")}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
          className="hidden" />
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <X size={14} className="shrink-0" />{error}
        </div>
      )}

      {selectedFile && (
        <button onClick={() => void handleUpload()} disabled={isUploading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50">
          {isUploading ? <><Loader2 size={15} className="animate-spin" /> Uploading...</> : <><Upload size={15} /> Upload Document</>}
        </button>
      )}
    </div>
  );
}
