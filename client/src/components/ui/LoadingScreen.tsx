import { Loader2 } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div
      role="status"
      aria-label="Loading application"
      aria-live="polite"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#fafafa]"
    >
      {/* App Logo */}
      <div className="flex h-12 w-12 animate-pulse items-center justify-center rounded-xl bg-zinc-950 font-bold text-white shadow-sm">
        <span className="text-xl select-none">K</span>
      </div>

      {/* Subtle spinner below logo */}
      <div className="mt-4 flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-zinc-400" aria-hidden="true" />
      </div>

      {/* Loading text */}
      <p className="mt-2 text-sm font-medium text-zinc-400 select-none">Loading...</p>
    </div>
  );
}
