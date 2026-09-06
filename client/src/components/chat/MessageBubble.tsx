import { Sparkles, UserRound } from "lucide-react";
import { Sources } from "./Sources";
import type { Message } from "../../pages/chat/Chat";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({
  message,
}: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`mb-8 flex ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={
          isUser
            ? "flex max-w-[80%] items-end gap-2"
            : "w-full max-w-2xl"
        }
      >
        {isUser ? (
          <>
            <div className="rounded-2xl rounded-br-md bg-zinc-950 px-4 py-3 text-sm leading-6 text-white shadow-sm">
              <div className="mb-1 text-[11px] font-semibold text-zinc-400">
                You
              </div>
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-zinc-600">
              <UserRound size={15} />
            </div>
          </>
        ) : (
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-950 text-white">
              <Sparkles size={14} />
            </div>
            <span className="text-xs font-semibold text-zinc-700">
              Assistant
            </span>
          </div>
        )}

        {!isUser && (
          <div className="whitespace-pre-wrap text-sm leading-7 text-zinc-800">
            {message.content}
          </div>
        )}

        {/* Sources */}
        {!isUser &&
          message.sources &&
          message.sources.length > 0 && (
            <Sources
              sources={message.sources}
            />
          )}

      </div>

    </div>
  );
}