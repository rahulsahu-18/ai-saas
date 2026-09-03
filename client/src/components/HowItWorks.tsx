const steps = [
  {
    number: "01",
    title: "Upload",
    description:
      "Upload the documents you want your AI to understand.",
  },
  {
    number: "02",
    title: "Organize",
    description:
      "Create a knowledge base and keep related documents together.",
  },
  {
    number: "03",
    title: "Ask",
    description:
      "Ask questions and get answers grounded in your knowledge base.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-zinc-950 py-28 text-white"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">

        <div className="max-w-2xl">

          <span className="text-sm text-zinc-400">
            How it works
          </span>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Simple enough to use in minutes.
          </h2>

        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-3">

          {steps.map((step) => (
            <div key={step.number}>

              <div className="text-sm font-medium text-zinc-500">
                {step.number}
              </div>

              <div className="mt-6 h-px bg-zinc-800" />

              <h3 className="mt-6 text-xl font-semibold">
                {step.title}
              </h3>

              <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-400">
                {step.description}
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}