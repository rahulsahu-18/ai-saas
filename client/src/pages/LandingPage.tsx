import ApiKeySection from "../components/ApiKeySection";
import Features from "../components/Features";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-950">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <ApiKeySection />

        {/* CTA */}
        <section className="px-5 py-24 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-3xl bg-zinc-950 px-6 py-20 text-center text-white">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Your documents already have the answers.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-zinc-400">
              Give them a place where you can actually talk to them.
            </p>
            <Link to="/register">
              <button className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-zinc-950 transition hover:bg-zinc-100">
                Create your knowledge base
                <ArrowRight size={15} />
              </button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-950 text-xs font-bold text-white">K</div>
              <span className="text-sm font-semibold">Knowbase</span>
            </Link>
            <nav className="flex flex-wrap items-center gap-6">
              <a href="#features" className="text-sm text-zinc-500 hover:text-zinc-950">Features</a>
              <Link to="/pricing" className="text-sm text-zinc-500 hover:text-zinc-950">Pricing</Link>
              <Link to="/login" className="text-sm text-zinc-500 hover:text-zinc-950">Log in</Link>
            </nav>
            <p className="text-xs text-zinc-400">&copy; {new Date().getFullYear()} Knowbase. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}