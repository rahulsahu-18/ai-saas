import {
  Database,
  FileText,
  MessageSquare,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Upload your documents",
    description:
      "Bring your PDFs, documents, text files, and other supported formats into one place.",
  },
  {
    icon: Database,
    title: "Create knowledge bases",
    description:
      "Organize documents into separate knowledge bases for different projects, products, or teams.",
  },
  {
    icon: MessageSquare,
    title: "Ask questions",
    description:
      "Ask natural-language questions and receive answers based on the information inside your documents.",
  },
];

export default function Features() {
  return (
    <section id="features" className="border-y border-zinc-200 bg-white py-28">

      <div className="mx-auto max-w-7xl px-5 lg:px-8">

        <div className="max-w-2xl">

          <span className="text-sm font-medium text-zinc-500">
            Everything you need
          </span>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
            From documents to answers.
          </h2>

          <p className="mt-4 text-base leading-7 text-zinc-500">
            A simple workflow for turning your existing information
            into something you can actually interact with.
          </p>

        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-200 md:grid-cols-3">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="bg-white p-8 transition hover:bg-zinc-50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50">
                  <Icon size={19} className="text-zinc-800" />
                </div>

                <h3 className="mt-6 text-base font-semibold text-zinc-950">
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