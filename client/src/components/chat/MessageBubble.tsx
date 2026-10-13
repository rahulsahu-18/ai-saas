import { useState } from "react";
import { Sparkles, UserRound, Copy, Check } from "lucide-react";
import { Sources } from "./Sources";
import type { Message } from "../../pages/chat/Chat";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`mb-7 flex animate-fade-in-up ${isUser ? "justify-end" : "justify-start"}`}>
      {isUser ? (
        <div className="flex max-w-[80%] items-end gap-2.5">
          <div className="rounded-2xl rounded-br-md bg-zinc-950 px-4 py-3 text-sm leading-7 text-white shadow-sm">
            {message.content}
          </div>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-zinc-600">
            <UserRound size={14} />
          </div>
        </div>
      ) : (
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-950 text-white">
                <Sparkles size={14} />
              </div>
              <span className="text-xs font-semibold text-zinc-600">Assistant</span>
            </div>
            {message.content && (
              <button
                onClick={() => void handleCopy()}
                title="Copy response"
                className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600"
              >
                {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>

          {/* Content — render newlines properly */}
          <div className="prose-sm text-sm leading-7 text-zinc-800 whitespace-pre-wrap">
            {message.content}
          </div>

          {/* Sources */}
          {message.sources && message.sources.length > 0 && (
            <Sources sources={message.sources} />
          )}
        </div>
      )}
    </div>
  );
}