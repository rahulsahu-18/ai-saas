import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
}

export default function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      {/* Header */}
      <header className="flex h-16 items-center px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-xs font-bold text-white">
            K
          </div>
          <span className="text-sm font-semibold">Knowbase</span>
        </Link>
      </header>

      {/* Main */}
      <main className="flex flex-1 items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm animate-fade-in-up">
          {/* Card */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm">
            <div className="mb-7 text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
                {title}
              </h1>
              <p className="mt-2 text-sm leading-6 text-zinc-500">
                {description}
              </p>
            </div>
            {children}
          </div>

          <p className="mt-5 text-center text-xs leading-5 text-zinc-400">
            By continuing, you agree to our{" "}
            <a href="/terms" className="text-zinc-600 underline-offset-2 hover:underline">Terms</a>
            {" "}and{" "}
            <a href="/privacy" className="text-zinc-600 underline-offset-2 hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </main>
    </div>
  );
}