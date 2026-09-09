import axios from "axios";
import {
  FileText,
  Trash2,
  File,
  Search,
  ArrowLeft,
  Globe,
  Play,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface KnowledgeFile {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number | null;
  createdAt: string;
  sourceType?: "DOCUMENT" | "YOUTUBE" | "WEBSITE";
}

interface KnowledgeFilesResponse {
  success: boolean;
  documents: KnowledgeFile[];
}

type SourceType = "all" | "document" | "youtube" | "website";

// Helper to get normalized sourceType
const getNormalizedSourceType = (sourceType?: string): "DOCUMENT" | "YOUTUBE" | "WEBSITE" => {
  if (sourceType === "YOUTUBE") return "YOUTUBE";
  if (sourceType === "WEBSITE") return "WEBSITE";
  return "DOCUMENT";
};

export default function MyFiles() {
  const navigate = useNavigate();
  const [files, setFiles] = useState<KnowledgeFile[]>([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<SourceType>("all");

  const loadFiles = async () => {
    try {
      const { data }: { data: KnowledgeFilesResponse } = await axios.get(
        "http://localhost:5000/api/v1/get-all",
        { withCredentials: true }
      );

      // Normalize sourceType - default to DOCUMENT if not specified
      const normalizedFiles = data.documents.map(file => ({
        ...file,
        sourceType: getNormalizedSourceType(file.sourceType)
      }));

      setFiles(normalizedFiles);
    } catch (error) {
      toast.error("Failed to load files");
      console.error(error);
    }
  };

  useEffect(() => {
    void loadFiles();
  }, []);

  const handleDelete = async (id: string, sourceType?: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (!confirmed) return;

    try {
      let endpoint = `http://localhost:5000/api/v1/delete-document/${id}`;

      if (sourceType === "YOUTUBE") {
        await axios.delete(`http://localhost:5000/api/v1/delete-youtube`, {
          data: { id },
          withCredentials: true,
        });
      } else if (sourceType === "WEBSITE") {
        await axios.delete(`http://localhost:5000/api/v1/delete-webdata`, {
          data: { id },
          withCredentials: true,
        });
      } else {
        await axios.delete(endpoint, { withCredentials: true });
      }

      await loadFiles();
      toast.success("Item deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete item");
      console.error(error);
    }
  };

  const getSourceIcon = (sourceType?: string) => {
    const type = getNormalizedSourceType(sourceType);
    switch (type) {
      case "YOUTUBE":
        return <Play className="h-5 w-5 text-red-600"/>;
      case "WEBSITE":
        return <Globe className="h-5 w-5 text-cyan-600" />;
      default:
        return <FileText className="h-5 w-5 text-blue-600" />;
    }
  };

  const getSourceLabel = (sourceType?: string) => {
    const type = getNormalizedSourceType(sourceType);
    switch (type) {
      case "YOUTUBE":
        return "YouTube";
      case "WEBSITE":
        return "Website";
      default:
        return "Document";
    }
  };

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.fileName
      .toLowerCase()
      .includes(search.toLowerCase());

    const sourceType = getNormalizedSourceType(file.sourceType);

    if (activeFilter === "all") return matchesSearch;
    if (activeFilter === "document") return matchesSearch && sourceType === "DOCUMENT";
    if (activeFilter === "youtube") return matchesSearch && sourceType === "YOUTUBE";
    if (activeFilter === "website") return matchesSearch && sourceType === "WEBSITE";

    return matchesSearch;
  });

  const counts = {
    all: files.length,
    document: files.filter((f) => getNormalizedSourceType(f.sourceType) === "DOCUMENT").length,
    youtube: files.filter((f) => getNormalizedSourceType(f.sourceType) === "YOUTUBE").length,
    website: files.filter((f) => getNormalizedSourceType(f.sourceType) === "WEBSITE").length,
  };

  return (
    <main className="min-h-screen bg-[#fafafa] text-zinc-950">
      <div className="mx-auto max-w-5xl px-5 py-10 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/knowledge-bases")}
              className="rounded-lg p-2 transition-colors hover:bg-zinc-200"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold">My Knowledge Base</h1>
              <p className="text-sm text-zinc-600">
                View all your documents, YouTube videos, and websites
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/knowledge-bases")}
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            <FileText size={18} />
            Add Document
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {(
            [
              { id: "all", label: "All", icon: null },
              { id: "document", label: "Documents", icon: <FileText size={16} /> },
              { id: "youtube", label: "YouTube", icon: <Play size={16} /> },
              { id: "website", label: "Websites", icon: <Globe size={16} /> },
            ] as const
          ).map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeFilter === filter.id
                  ? "bg-zinc-950 text-white"
                  : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
              }`}
            >
              {filter.icon}
              {filter.label}{" "}
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  activeFilter === filter.id
                    ? "bg-white text-zinc-950"
                    : "bg-zinc-100 text-zinc-600"
                }`}
              >
                {counts[filter.id as SourceType]}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Files Grid */}
        {filteredFiles.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-12 text-center">
            <File className="mx-auto mb-4 h-12 w-12 text-zinc-400" />
            <p className="text-sm font-medium text-zinc-600">
              {search ? "No results found" : "No items yet"}
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              {search
                ? "Try a different search term"
                : "Add documents, YouTube videos, or websites to get started"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className="group rounded-lg border border-zinc-200 bg-white p-4 hover:border-zinc-300 hover:shadow-md transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100">
                      {getSourceIcon(file.sourceType)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-sm text-zinc-900">
                        {file.fileName}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {getSourceLabel(file.sourceType)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(file.id, file.sourceType)}
                    className="ml-2 rounded-lg p-2 text-zinc-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Footer */}
                <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
                  {file.fileSize && (
                    <span>{(file.fileSize / (1024 * 1024)).toFixed(2)} MB</span>
                  )}
                  <span>
                    {new Date(file.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}