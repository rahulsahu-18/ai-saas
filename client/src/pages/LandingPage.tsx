import ApiKeySection from "../components/ApiKeySection";
import Features from "../components/Features";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import Navbar from "../components/Navbar";


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-950">

      <Navbar />

      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <ApiKeySection />

        {/* Pricing */}
        <section
          id="pricing"
          className="py-28"
        >
          <div className="mx-auto max-w-7xl px-5 text-center lg:px-8">

            <span className="text-sm font-medium text-zinc-500">
              Pricing
            </span>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Start free. Scale when you need to.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-zinc-500">
              Use your own API key or use our managed AI with
              credits.
            </p>

          </div>
        </section>

        {/* CTA */}
        <section className="px-5 pb-20 lg:px-8">

          <div className="mx-auto max-w-7xl rounded-3xl bg-zinc-950 px-6 py-20 text-center text-white">

            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Your documents already have the answers.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-zinc-400">
              Give them a place where you can actually talk to them.
            </p>

            <button className="mt-8 rounded-lg bg-white px-6 py-3 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200">
              Create your knowledge base
            </button>

          </div>

        </section>
      </main>

    </div>
  );
}