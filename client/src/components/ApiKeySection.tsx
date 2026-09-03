import { KeyRound, Zap } from "lucide-react";

export default function ApiKeySection() {
  return (
    <section className="border-b border-zinc-200 bg-zinc-50 py-28">

      <div className="mx-auto max-w-7xl px-5 lg:px-8">

        <div className="mx-auto max-w-3xl text-center">

          <span className="text-sm font-medium text-zinc-500">
            Flexible AI usage
          </span>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
            Use your API key or ours.
          </h2>

          <p className="mt-4 text-base leading-7 text-zinc-500">
            Choose how you want to power your knowledge bases.
            Bring your own provider key or use our managed API
            with a simple credit system.
          </p>

        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">

          <div className="rounded-2xl border border-zinc-200 bg-white p-8">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-950 text-white">
              <KeyRound size={18} />
            </div>

            <h3 className="mt-6 text-lg font-semibold">
              Bring your own key
            </h3>

            <p className="mt-3 text-sm leading-6 text-zinc-500">
              Connect your own AI provider and keep control over
              your model and API usage.
            </p>

          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-8">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-950 text-white">
              <Zap size={18} />
            </div>

            <h3 className="mt-6 text-lg font-semibold">
              Use our API
            </h3>

            <p className="mt-3 text-sm leading-6 text-zinc-500">
              Start instantly without configuring a provider.
              Your usage is deducted from your available credits.
            </p>

          </div>

        </div>

      </div>
    </section>
  );
}