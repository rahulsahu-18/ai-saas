import { KeyRound, Zap } from "lucide-react";

const options = [
  {
    icon: KeyRound,
    title: "Bring your own key",
    description: "Connect your own AI provider (OpenAI, Groq, Google) and keep full control over your model selection and API usage costs.",
    badge: "Any provider",
  },
  {
    icon: Zap,
    title: "Use our managed API",
    description: "Start instantly without any configuration. Your usage is deducted from your available credits at a flat rate.",
    badge: "2 credits per task",
  },
];

export default function ApiKeySection() {
  return (
    <section className="border-b border-zinc-200 bg-zinc-50 py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-medium text-zinc-500">Flexible AI usage</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
            Use your API key or ours.
          </h2>
          <p className="mt-4 text-base leading-7 text-zinc-500">
            Choose how you want to power your knowledge bases.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 max-w-3xl mx-auto">
          {options.map((option) => {
            const Icon = option.icon;
            return (
              <div
                key={option.title}
                className="group rounded-2xl border border-zinc-200 bg-white p-8 transition hover:border-zinc-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-950 text-white">
                    <Icon size={20} />
                  </div>
                  <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600">
                    {option.badge}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-semibold">{option.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-500">{option.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}