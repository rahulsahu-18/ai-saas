
import { useState } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "../../utils/auth-client";
import { GithubIcon } from "../../utils/GithubIcon";

type OAuthProvider = "google" | "github";

export default function SocialButtons() {
  const [loadingProvider, setLoadingProvider] =
    useState<OAuthProvider | null>(null);

  const handleOAuth = async (provider: OAuthProvider) => {
    if (loadingProvider) return;

    setLoadingProvider(provider);

    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: `${window.location.origin}/chat`,
      });

      if (result.error) {
        console.error(`${provider} sign-in error:`, result.error);
        toast.error(
          result.error.message || "Authentication failed. Please try again."
        );
        setLoadingProvider(null);
      }
    } catch (error) {
      console.error(`${provider} OAuth failed:`, error);

      toast.error("Authentication failed. Please try again.");
      setLoadingProvider(null);
    }
  };

  const isAnyLoading = loadingProvider !== null;

  return (
    <div className="space-y-3">
      {/* Google */}
      <button
        type="button"
        id="google-signin-btn"
        onClick={() => void handleOAuth("google")}
        disabled={isAnyLoading}
        className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loadingProvider === "google" ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <svg
            className="h-[18px] w-[18px] shrink-0"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.01 13.22l7.98 6.19C12.13 13.72 17.57 9.5 24 9.5Z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.72 7.18l7.66 5.94c4.48-4.14 7.1-10.24 7.1-17.59Z"
            />
            <path
              fill="#FBBC05"
              d="M9.99 28.59A14.4 14.4 0 0 1 9.22 24c0-1.59.27-3.13.76-4.59L2.01 13.22A23.8 23.8 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.43-6.19Z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.88-5.86l-7.66-5.94c-2.13 1.43-4.84 2.28-8.22 2.28-6.43 0-11.87-4.22-14.01-9.9l-7.98 6.2C6.51 42.62 14.62 48 24 48Z"
            />
          </svg>
        )}

        <span>
          {loadingProvider === "google"
            ? "Signing in..."
            : "Continue with Google"}
        </span>
      </button>

      {/* GitHub */}
      <button
        type="button"
        id="github-signin-btn"
        onClick={() => void handleOAuth("github")}
        disabled={isAnyLoading}
        className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loadingProvider === "github" ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <GithubIcon size={18} />
        )}

        <span>
          {loadingProvider === "github"
            ? "Signing in..."
            : "Continue with GitHub"}
        </span>
      </button>
    </div>
  );
}
