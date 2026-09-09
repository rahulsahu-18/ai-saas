import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Play, Globe } from "lucide-react";
import DocumentForm from "../../components/knowledge-base/DocumentForm";
import YouTubeForm from "../../components/knowledge-base/YouTubeForm";
import WebsiteForm from "../../components/knowledge-base/WebsiteForm";
import CreditBalance from "../../components/CreditBalance";

type TabType = "document" | "youtube" | "website";

interface Tab {
  id: TabType;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const tabs: Tab[] = [
  {
    id: "document",
    label: "Document",
    icon: <FileText size={20} />,
    color: "blue",
  },
  {
    id: "youtube",
    label: "YouTube",
    icon: <Play size={20} />,
    color: "red",
  },
  {
    id: "website",
    label: "Website",
    icon: <Globe size={20} />,
    color: "cyan",
  },
];

export default function KnowledgeBase() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("document");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <main className="min-h-screen bg-[#fafafa] text-zinc-950">
      <div className="mx-auto max-w-4xl px-5 py-10 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="rounded-lg p-2 transition-colors hover:bg-zinc-200"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold">Knowledge Base</h1>
              <p className="text-sm text-zinc-600">
                Add documents, YouTube videos, and websites to your knowledge base
              </p>
            </div>
          </div>
        </div>

        {/* Credit Balance */}
        <div className="mb-8">
          <CreditBalance key={refreshKey} />
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-3 border-b border-zinc-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 border-b-2 px-4 py-4 font-medium transition-colors ${
                activeTab === tab.id
                  ? `border-${tab.color}-600 text-${tab.color}-600`
                  : "border-transparent text-zinc-600 hover:text-zinc-900"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="rounded-lg bg-white p-8 shadow-sm">
          {activeTab === "document" && (
            <DocumentForm onUploadSuccess={handleUploadSuccess} />
          )}

          {activeTab === "youtube" && (
            <YouTubeForm onUploadSuccess={handleUploadSuccess} />
          )}

          {activeTab === "website" && (
            <WebsiteForm onUploadSuccess={handleUploadSuccess} />
          )}
        </div>

        {/* Info Section */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold">Documents</h3>
            </div>
            <p className="text-sm text-zinc-600">
              Upload PDF, DOCX, or TXT files up to 10 MB
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <Play className="h-5 w-5 text-red-600" />
              <h3 className="font-semibold">YouTube Videos</h3>
            </div>
            <p className="text-sm text-zinc-600">
              Add any YouTube video to extract and analyze transcripts
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <Globe className="h-5 w-5 text-cyan-600" />
              <h3 className="font-semibold">Websites</h3>
            </div>
            <p className="text-sm text-zinc-600">
              Scrape any website to analyze and search its content
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
