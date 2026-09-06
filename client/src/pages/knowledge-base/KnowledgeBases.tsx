import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUp,
  CheckCircle2,
  FileText,
  Files,
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

export default function KnowledgeBase() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

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

    // Allow selecting the same file again
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
        { withCredentials: true },
      );
      setSelectedFile(null);
      toast.success(data.message);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Something went wrong while uploading the file.",
      );
      toast.error("something went worng to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fafafa] text-zinc-950">
      <div className="mx-auto max-w-5xl px-5 py-10 lg:px-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          <ArrowLeft size={16} />
          Go back
        </button>

        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-950 text-white">
                <FileText size={18} />
              </div>

              <span className="text-sm font-medium text-zinc-500">
                Knowledge Base
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-semibold tracking-tight">
              Add your documents
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
              Upload documents to your knowledge base and use them to get
              answers from your AI assistant.
            </p>
          </div>

          {/* See all files */}
          <button
            onClick={() => {
              window.location.href = "/files";
            }}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
          >
            <Files size={16} />
            See my files
          </button>
        </div>

        {/* Upload area */}
        <section className="mt-10">
          {!selectedFile ? (
            <div
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="group flex min-h-[360px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center transition hover:border-zinc-400 hover:bg-zinc-50"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 transition group-hover:bg-white">
                <ArrowUp size={23} className="text-zinc-600" />
              </div>

              <h2 className="mt-6 text-base font-semibold">
                Upload a document
              </h2>

              <p className="mt-2 text-sm text-zinc-500">
                Drag and drop a file here, or choose a file
              </p>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="mt-6 h-10 rounded-lg bg-zinc-950 px-5 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                Choose file
              </button>

              <p className="mt-4 text-xs text-zinc-400">
                PDF, DOC, DOCX, TXT · Maximum 10 MB
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_FILE_TYPES.join(",")}
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-100">
                  <FileText size={21} className="text-zinc-600" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-zinc-900">
                    {selectedFile.name}
                  </p>

                  <p className="mt-1 text-xs text-zinc-400">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={isUploading}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
                >
                  <X size={17} />
                </button>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={isUploading}
                  className="h-10 rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 disabled:opacity-50"
                >
                  Choose another
                </button>

                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-zinc-950 px-5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      Add to knowledge base
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Error */}
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </section>

        {/* Supported files */}
        <section className="mt-12">
          <h2 className="text-sm font-semibold">Supported files</h2>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["PDF", "Portable Document Format"],
              ["DOC", "Microsoft Word"],
              ["DOCX", "Microsoft Word"],
              ["TXT", "Plain text"],
            ].map(([extension, description]) => (
              <div
                key={extension}
                className="rounded-xl border border-zinc-200 bg-white p-4"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-xs font-bold text-zinc-700">
                  {extension}
                </div>

                <p className="mt-3 text-sm font-medium">{extension}</p>

                <p className="mt-1 text-xs text-zinc-400">{description}</p>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-zinc-400">
            Maximum file size is 10 MB per document.
          </p>
        </section>
      </div>
    </main>
  );
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
