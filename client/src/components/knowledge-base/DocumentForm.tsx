import { useRef, useState } from "react";
import {
  ArrowUp,
  CheckCircle2,
  FileText,
  Loader2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = [".pdf", ".doc", ".docx", ".txt"];

type IngestResponse = {
  success: boolean;
  chunkSize: number;
  message: string;
};

interface DocumentFormProps {
  onUploadSuccess?: () => void;
}

export default function DocumentForm({ onUploadSuccess }: DocumentFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const validateFile = (file: File) => {
    const extension = "." + file.name.split(".").pop()?.toLowerCase();

    if (!ACCEPTED_FILE_TYPES.includes(extension)) {
      return "Unsupported file type. Please upload PDF, DOC, DOCX or TXT.";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "File size cannot exceed 10 MB.";
    }

    return null;
  };

  const handleFile = (file: File) => {
    setError("");

    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      return;
    }

    setSelectedFile(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      handleFile(file);
    }

    event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const file = event.dataTransfer.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setError("");
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const { data }: { data: IngestResponse } = await axios.post(
        "http://localhost:5000/api/v1/ingest",
        formData,
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(`Document uploaded successfully (${data.chunkSize} chunks)`);
        setSelectedFile(null);
        onUploadSuccess?.();
      } else {
        setError(data.message || "Upload failed");
        toast.error(data.message || "Upload failed");
      }
    } catch (err) {
      const errorMsg =
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : "Upload failed. Please try again.";

      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 p-8 text-center transition-colors hover:border-zinc-400 hover:bg-zinc-100"
      >
        <FileText className="mx-auto mb-4 h-12 w-12 text-zinc-400" />

        <h3 className="mb-2 text-lg font-semibold text-zinc-900">
          Upload a Document
        </h3>

        <p className="mb-4 text-sm text-zinc-600">
          Drag and drop your file here, or click to browse
        </p>

        <p className="mb-4 text-xs text-zinc-500">
          Supported formats: PDF, DOC, DOCX, TXT (Max 10 MB)
        </p>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="inline-block rounded-lg bg-zinc-950 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50"
        >
          {isUploading ? "Uploading..." : "Browse Files"}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_FILE_TYPES.join(",")}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <X className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
          <div>
            <p className="font-medium text-red-900">Upload Error</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Selected File Preview */}
      {selectedFile && (
        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-zinc-900">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-zinc-500">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>

            <button
              onClick={handleRemove}
              disabled={isUploading}
              className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <ArrowUp className="h-4 w-4" />
                Upload Document
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
