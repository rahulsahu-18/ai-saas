import { useState } from "react";
import { FileText, Play, Globe, Plus } from "lucide-react";
import DocumentForm from "../../components/knowledge-base/DocumentForm";
import YouTubeForm from "../../components/knowledge-base/YouTubeForm";
import WebsiteForm from "../../components/knowledge-base/WebsiteForm";

type TabType = "document" | "youtube" | "website";

const tabs: { id: TabType; label: string; Icon: React.ComponentType<{size?: number; className?: string}>; description: string }[] = [
  { id: "document", label: "Document", Icon: FileText, description: "PDF, DOCX, TXT up to 10 MB" },
  { id: "youtube", label: "YouTube", Icon: Play, description: "Video transcript" },
  { id: "website", label: "Website", Icon: Globe, description: "Scrape any URL" },
];

export default function KnowledgeBase() {
  const [activeTab, setActiveTab] = useState<TabType>("document");
  const activeTabInfo = tabs.find(t => t.id === activeTab)!;
  const ActiveIcon = activeTabInfo.Icon;

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-950 text-white">
            <Plus size={18} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Add to Knowledge Base</h1>
        </div>
        <p className="text-sm text-zinc-500 ml-12">Upload documents, YouTube videos, or websites to train your AI assistant.</p>
      </div>

      <div className="mb-6 flex gap-2 rounded-xl border border-zinc-200 bg-zinc-50 p-1.5">
        {tabs.map((tab) => {
          const Icon = tab.Icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200' : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mb-5 flex items-center gap-2 text-sm text-zinc-600">
        <ActiveIcon size={15} className="text-zinc-400" />
        <span className="font-medium">{activeTabInfo.label}</span>
        <span className="text-zinc-300">|</span>
        <span className="text-zinc-400">{activeTabInfo.description}</span>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        {activeTab === "document" && <DocumentForm />}
        {activeTab === "youtube" && <YouTubeForm />}
        {activeTab === "website" && <WebsiteForm />}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[{Icon: FileText, color: 'text-blue-600', label: 'Documents', sub: '2 credits per upload'},
          {Icon: Play, color: 'text-red-600', label: 'YouTube', sub: '2 credits per video'},
          {Icon: Globe, color: 'text-cyan-600', label: 'Websites', sub: '2 credits per URL'}]
          .map(({Icon, color, label, sub}) => (
            <div key={label} className="rounded-xl border border-zinc-200 bg-white p-4">
              <div className="flex items-center gap-2 mb-1">
                <Icon size={15} className={color} />
                <h3 className="text-sm font-semibold">{label}</h3>
              </div>
              <p className="text-xs text-zinc-500">{sub}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
