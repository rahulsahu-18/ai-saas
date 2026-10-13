const steps = [
  {
    number: "01",
    title: "Upload",
    description: "Upload documents (PDF, DOCX, TXT), add YouTube videos, or scrape websites into your knowledge base.",
  },
  {
    number: "02",
    title: "Index",
    description: "We chunk, embed, and store your content in a private vector database — ready for instant semantic search.",
  },
  {
    number: "03",
    title: "Ask",
    description: "Ask questions in natural language. Get accurate, cited answers grounded in your knowledge base.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-zinc-950 py-24 text-white">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-sm text-zinc-400">How it works</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Simple enough to use in minutes.
          </h2>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="group">
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-zinc-700 tabular-nums">{ step.number }</span>
                <div className="h-px flex-1 bg-zinc-800" />
              </div>
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}