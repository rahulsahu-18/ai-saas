import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { authClient } from "../utils/auth-client";
import { UserAvatar } from "../utils/utils";

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  if(isPending)
  {
    return null;
  }
  return (
    <header className="fixed top-0 z-50 w-full border-b border-zinc-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-sm font-bold text-white">
            K
          </div>

          <span className="text-[17px] font-semibold tracking-tight">
            Knowbase
          </span>
        </a>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-sm text-zinc-600 transition-colors hover:text-zinc-950"
          >
            Features
          </a>

          <a
            href="#how-it-works"
            className="text-sm text-zinc-600 transition-colors hover:text-zinc-950"
          >
            How it works
          </a>

          <a
            href="#pricing"
            className="text-sm text-zinc-600 transition-colors hover:text-zinc-950"
          >
            Pricing
          </a>
        </nav>

        {session ? (
          <UserAvatar image={session.user.image} name={session.user.name} />
        ) : (
          <div className="flex items-center gap-3">
            <Link to={"/login"}>
              <button className="hidden text-sm font-medium text-zinc-600 hover:text-zinc-950 sm:block">
                Log in
              </button>
            </Link>
            <button className="flex items-center gap-1.5 rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800">
              Get started
              <ArrowUpRight size={15} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
