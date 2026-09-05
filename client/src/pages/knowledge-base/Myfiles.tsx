import {
  Download,
  FileText,
  Trash2,
  File,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";

interface KnowledgeFile {
  id: string;
  name: string;
  type: "PDF" | "DOC" | "DOCX" | "TXT";
  size: number;
  uploadedAt: string;
}

export default function MyFiles() {
  const [files, setFiles] = useState<KnowledgeFile[]>([]);

  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadFiles = async () => {
      const response = await fetch("http://localhost:5000/api/v1/get-all", {
        credentials: "include",
      });
      const result = await response.json();

      if (!response.ok) return;

      setFiles(
        result.documents.map((file: {
          id: string;
          fileName: string;
          fileType: string;
          fileSize: number | null;
          createdAt: string;
        }) => ({
          id: file.id,
          name: file.fileName,
          type: file.fileType.toUpperCase(),
          size: file.fileSize ?? 0,
          uploadedAt: new Date(file.createdAt).toLocaleDateString(),
        }))
      );
    };

    void loadFiles();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this file?"
    );

    if (!confirmed) return;

    const response = await fetch(
      `http://localhost:5000/api/v1/delete-document/${id}`,
      { method: "DELETE", credentials: "include" }
    );

    if (response.ok) {
      setFiles((prev) => prev.filter((file) => file.id !== id));
    }
  };

  const handleDownload = async (_file: KnowledgeFile) => {
    /*
     * Later connect this to your Express backend.
     *
     * Example:
     *
     * const response = await fetch(
     *   `/api/files/${file.id}/download`
     * );
     *
     * const blob = await response.blob();
     * const url = URL.createObjectURL(blob);
     *
     * const a = document.createElement("a");
     * a.href = url;
     * a.download = file.name;
     * a.click();
     *
     * URL.revokeObjectURL(url);
     */
  };

  const filteredFiles = files.filter((file) =>
    file.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#fafafa] text-zinc-950">
      <div className="mx-auto max-w-5xl px-5 py-10 lg:px-8">

        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

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
              My files
            </h1>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              View and manage all the documents in your
              knowledge base.
            </p>
          </div>

          {/* Upload */}
          <a
            href="/knowledge-base"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Add document
          </a>

        </div>

        {/* Search */}
        {files.length > 0 && (
          <div className="relative mt-8 max-w-md">

            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
            />

            <input
              type="text"
              placeholder="Search files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-lg border border-zinc-200 bg-white pl-10 pr-4 text-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
            />

          </div>
        )}

        {/* Files */}
        {filteredFiles.length > 0 ? (
          <div className="mt-6 space-y-3">

            {filteredFiles.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                onDelete={handleDelete}
                onDownload={handleDownload}
              />
            ))}

          </div>
        ) : (
          <EmptyState
            hasFiles={files.length > 0}
            search={search}
          />
        )}

      </div>
    </main>
  );
}


interface FileCardProps {
  file: KnowledgeFile;
  onDelete: (id: string) => void;
  onDownload: (file: KnowledgeFile) => void;
}

function FileCard({
  file,
  onDelete,
  onDownload,
}: FileCardProps) {
  return (
    <div className="group flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-zinc-300 hover:shadow-sm sm:flex-row sm:items-center">

      {/* File info */}
      <div className="flex min-w-0 flex-1 items-center gap-4">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-zinc-100">
          <File size={19} className="text-zinc-600" />
        </div>

        <div className="min-w-0">

          <p
            title={file.name}
            className="truncate text-sm font-medium text-zinc-900"
          >
            {file.name}
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-400">

            <span>{file.type}</span>

            <span className="h-1 w-1 rounded-full bg-zinc-300" />

            <span>{formatFileSize(file.size)}</span>

            <span className="h-1 w-1 rounded-full bg-zinc-300" />

            <span>{file.uploadedAt}</span>

          </div>

        </div>

      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:shrink-0">

        {/* Download */}
        <button
          type="button"
          onClick={() => onDownload(file)}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-zinc-200 px-3 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-950"
        >
          <Download size={15} />
          <span>Download</span>
        </button>

        {/* Delete */}
        <button
          type="button"
          onClick={() => onDelete(file.id)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          aria-label={`Delete ${file.name}`}
        >
          <Trash2 size={16} />
        </button>

      </div>

    </div>
  );
}


interface EmptyStateProps {
  hasFiles: boolean;
  search: string;
}

function EmptyState({
  hasFiles,
  search,
}: EmptyStateProps) {
  if (hasFiles && search) {
    return (
      <div className="mt-10 rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
        <Search
          size={22}
          className="mx-auto text-zinc-400"
        />

        <h2 className="mt-4 text-sm font-semibold">
          No files found
        </h2>

        <p className="mt-1 text-sm text-zinc-500">
          Try searching with a different filename.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10 rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">

      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50">
        <FileText
          size={21}
          className="text-zinc-500"
        />
      </div>

      <h2 className="mt-5 text-lg font-semibold">
        No documents yet
      </h2>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-500">
        Upload your first document to start building your
        knowledge base.
      </p>

      <a
        href="/knowledge-base"
        className="mt-6 inline-flex h-10 items-center rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800"
      >
        Add document
      </a>

    </div>
  );
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}