import { FileText, Database, MessageSquare, Globe, Play, Key } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Upload your documents",
    description: "Bring your PDFs, Word docs, and text files. Chunk and index them for instant semantic retrieval.",
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: Database,
    title: "Build a knowledge base",
    description: "Organize documents into a unified, searchable knowledge base tailored to your project.",
    color: "text-violet-600 bg-violet-50",
  },
  {
    icon: Globe,
    title: "Scrape websites",
    description: "Point to any public URL and automatically ingest its content into your knowledge base.",
    color: "text-cyan-600 bg-cyan-50",
  },
  {
    icon: Play,
    title: "YouTube transcripts",
    description: "Add YouTube videos and extract their full transcripts for AI-powered Q&A.",
    color: "text-red-600 bg-red-50",
  },
  {
    icon: MessageSquare,
    title: "Ask questions in chat",
    description: "Chat with your knowledge base in natural language. Get cited, grounded answers instantly.",
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    icon: Key,
    title: "Bring your own API key",
    description: "Connect your own AI provider key or use our managed API with a simple credit system.",
    color: "text-amber-600 bg-amber-50",
  },
];

export default function Features() {
  return (
    <section id="features" className="border-y border-zinc-200 bg-white py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-sm font-medium text-zinc-500">Everything you need</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
            From documents to answers.
          </h2>
          <p className="mt-4 text-base leading-7 text-zinc-500">
            A complete workflow for turning your existing information into something you can actually interact with.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-zinc-200 bg-white p-7 transition hover:border-zinc-300 hover:shadow-md"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${feature.color} transition group-hover:scale-110`}>
                  <Icon size={19} />
                </div>
                <h3 className="mt-5 text-base font-semibold text-zinc-950">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}