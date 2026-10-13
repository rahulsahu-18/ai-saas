import { useState } from "react";
import { FileText, Trash2, Search, Globe, Play, Plus, File } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { Skeleton } from "../../components/ui/Skeleton";
import {
  useDeleteDocumentMutation,
  useDeleteWebsiteMutation,
  useDeleteYouTubeMutation,
  useGetDocumentsQuery,
  type Document,
} from "../../store/rtkquery/api";

type SourceFilter = "all" | "FILE" | "YOUTUBE" | "WEBSITE";

export default function MyFiles() {
  const { data, isLoading } = useGetDocumentsQuery();
  const [deleteDocument] = useDeleteDocumentMutation();
  const [deleteWebsite] = useDeleteWebsiteMutation();
  const [deleteYouTube] = useDeleteYouTubeMutation();
  const files = (data?.documents ?? []) as Document[];
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<SourceFilter>("all");
  const [deleteTarget, setDeleteTarget] = useState<Document | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      if (deleteTarget.sourceType === "YOUTUBE") await deleteYouTube(deleteTarget.id).unwrap();
      else if (deleteTarget.sourceType === "WEBSITE") await deleteWebsite(deleteTarget.id).unwrap();
      else await deleteDocument(deleteTarget.id).unwrap();
      toast.success("Deleted successfully");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete item");
    } finally {
      setIsDeleting(false);
    }
  };

  const getIcon = (sourceType: string) => {
    if (sourceType === "YOUTUBE") return <Play size={15} className="text-red-600" />;
    if (sourceType === "WEBSITE") return <Globe size={15} className="text-cyan-600" />;
    return <FileText size={15} className="text-blue-600" />;
  };

  const getLabel = (sourceType: string) => {
    if (sourceType === "YOUTUBE") return "YouTube";
    if (sourceType === "WEBSITE") return "Website";
    return "Document";
  };

  const filteredFiles = files.filter((f) => {
    const matchSearch = f.fileName.toLowerCase().includes(search.toLowerCase());
    if (activeFilter === "all") return matchSearch;
    return matchSearch && f.sourceType === activeFilter;
  });

  const counts = {
    all: files.length,
    FILE: files.filter(f => f.sourceType === "FILE").length,
    YOUTUBE: files.filter(f => f.sourceType === "YOUTUBE").length,
    WEBSITE: files.filter(f => f.sourceType === "WEBSITE").length,
  };

  const filters: { id: SourceFilter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "FILE", label: "Documents" },
    { id: "YOUTUBE", label: "YouTube" },
    { id: "WEBSITE", label: "Websites" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My Knowledge Base</h1>
          <p className="mt-1 text-sm text-zinc-500">{files.length} {files.length === 1 ? 'item' : 'items'} in your knowledge base</p>
        </div>
        <Link to="/knowledge-bases" className="inline-flex items-center gap-2 rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800">
          <Plus size={16} />Add content
        </Link>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                activeFilter === filter.id ? 'bg-zinc-950 text-white' : 'border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              {filter.label}
              <span className={`rounded-full px-1.5 py-0.5 text-xs ${
                activeFilter === filter.id ? 'bg-white/20 text-white' : 'bg-zinc-100 text-zinc-500'
              }`}>{counts[filter.id]}</span>
            </button>
          ))}
        </div>
        <div className="relative ml-auto">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-48 rounded-lg border border-zinc-200 bg-white pl-9 pr-4 py-2 text-sm focus:border-zinc-400 focus:outline-none" />
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white py-16 text-center">
          <File size={36} className="mx-auto mb-4 text-zinc-300" />
          <p className="text-sm font-medium text-zinc-600">{search ? 'No results found' : 'No items yet'}</p>
          <p className="mt-1 text-xs text-zinc-400">{search ? 'Try a different search term' : 'Add documents, videos, or websites'}</p>
          {!search && (
            <Link to="/knowledge-bases" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800">
              <Plus size={15} />Add your first item
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredFiles.map((file) => (
            <div key={file.id} className="group rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-zinc-300 hover:shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100">{getIcon(file.sourceType)}</div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-900">{file.fileName}</p>
                    <p className="text-xs text-zinc-400">{getLabel(file.sourceType)}</p>
                  </div>
                </div>
                <button onClick={() => setDeleteTarget(file)}
                  className="shrink-0 rounded-lg p-1.5 text-zinc-300 opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 focus:opacity-100"
                  aria-label={`Delete ${file.fileName}`}>
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-3 text-xs text-zinc-400">
                {file.fileSize ? <span>{(file.fileSize / (1024 * 1024)).toFixed(2)} MB</span> : <span />}
                <span>{new Date(file.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete item"
        description={`Are you sure you want to delete "${deleteTarget?.fileName}"? This cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={isDeleting}
        onConfirm={() => void handleDeleteConfirm()}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}