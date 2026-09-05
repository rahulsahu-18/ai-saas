import { authClient } from "../../utils/auth-client";
import { GithubIcon } from "../../utils/GithubIcon";

export default function SocialButtons() {
  const handleOAuth = async (
    provider: "google" | "github"
  ) => {
    await authClient.signIn.social({
      provider,
      callbackURL: "http://localhost:5173/",
    });
  };

  return (
    <div className="space-y-3">

      {/* Google */}
      <button
        type="button"
        onClick={() => handleOAuth("google")}
        className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-zinc-200 bg-white text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
      >
        <svg
          className="h-[18px] w-[18px]"
          viewBox="0 0 24 24"
        >
          <path
            fill="#4285F4"
            d="M21.35 12.27c0-.79-.07-1.55-.22-2.27H12v4.3h5.22a4.47 4.47 0 0 1-1.94 2.93v2.43h3.14c1.84-1.7 2.93-4.2 2.93-7.39Z"
          />
          <path
            fill="#34A853"
            d="M12 21.96c2.63 0 4.84-.87 6.45-2.35l-3.14-2.43c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.29v2.5A9.75 9.75 0 0 0 12 21.96Z"
          />
          <path
            fill="#FBBC05"
            d="M6.54 14.07A5.87 5.87 0 0 1 6.23 12c0-.72.12-1.42.31-2.07v-2.5H3.29A9.76 9.76 0 0 0 2.25 12c0 1.57.38 3.05 1.04 4.43l3.25-2.36Z"
          />
          <path
            fill="#EA4335"
            d="M12 5.9c1.43 0 2.72.49 3.73 1.45l2.8-2.8C16.84 2.99 14.63 2 12 2a9.75 9.75 0 0 0-8.71 5.43l3.25 2.5C7.31 7.62 9.46 5.9 12 5.9Z"
          />
        </svg>

        Continue with Google
      </button>

      {/* GitHub */}
      <button
        type="button"
        onClick={() => handleOAuth("github")}
        className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-zinc-200 bg-white text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
      >
        <GithubIcon size={18} />

        Continue with GitHub
      </button>

    </div>
  );
}