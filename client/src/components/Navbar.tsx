import { useState, useEffect } from "react";
import { ArrowUpRight, Coins, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "../store/store";
import { api } from "../store/rtkquery/api";
import UserMenu from "./layout/UserMenu";

export default function Navbar() {
  const user = useSelector((state: RootState) => state.user);
  const creditBalance = useSelector((state: RootState) =>
    api.endpoints.getCreditBalance.select()(state).data,
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 z-50 w-full transition-all duration-200 ${
      scrolled
        ? 'border-b border-zinc-200/80 bg-white/90 backdrop-blur-xl shadow-sm'
        : 'border-b border-transparent bg-white/60 backdrop-blur-sm'
    }`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-xs font-bold text-white">
            K
          </div>
          <span className="text-[17px] font-semibold tracking-tight">Knowbase</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 md:flex">
          <a href="#features" className="text-sm text-zinc-600 transition-colors hover:text-zinc-950">Features</a>
          <a href="#how-it-works" className="text-sm text-zinc-600 transition-colors hover:text-zinc-950">How it works</a>
          <Link to="/pricing" className="text-sm text-zinc-600 transition-colors hover:text-zinc-950">Pricing</Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user.isLoggedIn ? (
            <>
              <Link
                to="/pricing"
                className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
              >
                <Coins size={15} className="text-zinc-400" />
                {creditBalance ? `${creditBalance.balance} credits` : 'Credits'}
              </Link>
              <UserMenu />
            </>
          ) : (
            <>
              <Link to="/login" className="hidden text-sm font-medium text-zinc-600 hover:text-zinc-950 sm:block">
                Log in
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1.5 rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                Get started
                <ArrowUpRight size={15} />
              </Link>
            </>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="ml-1 rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-zinc-200 bg-white px-5 pb-4 pt-3 md:hidden animate-fade-in-down">
          <nav className="space-y-1">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950">Features</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950">How it works</a>
            <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950">Pricing</Link>
            {!user.isLoggedIn && (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950">Log in</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
