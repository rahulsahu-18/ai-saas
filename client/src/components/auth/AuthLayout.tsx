import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
}

export default function AuthLayout({
  children,
  title,
  description,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#fafafa]">

      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-5">

        {/* Logo */}
        <div className="mb-10 flex justify-center">
          <a
            href="/"
            className="flex items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-950 text-sm font-bold text-white">
              K
            </div>

            <span className="text-lg font-semibold tracking-tight">
              Knowbase
            </span>
          </a>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">

          <div className="text-center">

            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
              {title}
            </h1>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              {description}
            </p>

          </div>

          <div className="mt-8">
            {children}
          </div>

        </div>

        <p className="mt-6 text-center text-xs leading-5 text-zinc-400">
          By continuing, you agree to our{" "}
          <a
            href="/terms"
            className="text-zinc-600 hover:text-zinc-950"
          >
            Terms
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            className="text-zinc-600 hover:text-zinc-950"
          >
            Privacy Policy
          </a>
          .
        </p>

      </div>
    </div>
  );
}