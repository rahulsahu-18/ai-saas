import { useEffect, useRef, useState } from "react";
import { ArrowUp, Sparkles, FileText, Globe, Play } from "lucide-react";
import { MessageBubble } from "../../components/chat/MessageBubble";
import { useNavigate, useParams } from "react-router-dom";
import { useGetChatMessagesQuery } from "../../store/rtkquery/api";
import { api } from "../../store/rtkquery/api";
import { useDispatch } from "react-redux";

const API_BASE = (import.meta.env.VITE_API_URL ?? 'http://localhost:5000').replace(/\/$/, '');

const EXAMPLE_PROMPTS = [
  { icon: FileText, text: "Summarize the key points from my documents" },
  { icon: Sparkles, text: "What are the main topics covered?" },
  { icon: Globe, text: "Find all mentions of a specific concept" },
  { icon: Play, text: "Explain a technical concept from my files" },
];

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}

interface ApiMessage {
  id: string;
  role: "USER" | "ASSISTANT" | "user" | "assistant";
  content: string;
  sources?: string[];
}

function normalizeMessage(message: ApiMessage): Message {
  return {
    id: message.id,
    role: message.role.toLowerCase() === "user" ? "user" : "assistant",
    content: message.content,
    sources: message.sources ?? [],
  };
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const { chatId } = useParams<{ chatId: string | undefined }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: chatData } = useGetChatMessagesQuery(chatId ?? "", {
    skip: !chatId,
  });

  useEffect(() => {
    setMessages(chatData?.chat.toReversed().map(normalizeMessage) ?? []);
  }, [chatData]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const ta = e.target;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
  };

  const handleSubmit = async (questionOverride?: string) => {
    const question = (questionOverride ?? input).trim();
    if (!question || isStreaming) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: question,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setIsStreaming(true);

    const assistantId = crypto.randomUUID();

    try {
      const response = await fetch(
        `${API_BASE}/api/v1/chat/message${chatId ? `/${chatId}` : ""}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ message: question }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message ?? "Failed to send message");
      }

      if (!response.body) throw new Error("ReadableStream not supported");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantContent = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const event of events) {
          if (!event.trim()) continue;
          const eventType = event.match(/^event:\s*(.+)$/m)?.[1];
          const dataLine = event.match(/^data:\s*(.+)$/m)?.[1];
          if (!dataLine) continue;

          const data = JSON.parse(dataLine) as { chatId?: string; sources?: string[]; text?: string; message?: string };

          if (eventType === "chat_created") {
            navigate(`/chat/${data.chatId}`, { replace: true });
            // Invalidate chats list to show new chat in sidebar
            dispatch(api.util.invalidateTags(["Chats"]));
          }

          if (eventType === "sources") {
            setMessages((prev) => [
              ...prev,
              { id: assistantId, role: "assistant", content: "", sources: data.sources },
            ]);
          }

          if (eventType === "token") {
            assistantContent += data.text ?? "";
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, content: assistantContent } : m,
              ),
            );
          }

          if (eventType === "done") {
            // Invalidate credits after chat completes
            dispatch(api.util.invalidateTags(["Credits"]));
          }

          if (eventType === "error") {
            throw new Error(data.message ?? "Unable to complete chat");
          }
        }
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Something went wrong. Please try again.";
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: errMsg },
      ]);
    } finally {
      setIsStreaming(false);
    }
  };

  const isEmpty = messages.length === 0 && !isStreaming;

  return (
    <div className="flex h-full flex-col">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
          // Empty state
          <div className="flex h-full flex-col items-center justify-center px-5 py-16 text-center animate-fade-in">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-950 text-white mb-5">
              <Sparkles size={24} />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">What would you like to know?</h2>
            <p className="mt-2 text-sm text-zinc-500 max-w-md">
              Ask anything about your uploaded documents, websites, or YouTube videos.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 max-w-lg w-full">
              {EXAMPLE_PROMPTS.map((prompt) => {
                const Icon = prompt.icon;
                return (
                  <button
                    key={prompt.text}
                    onClick={() => void handleSubmit(prompt.text)}
                    className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 text-left text-sm text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900"
                  >
                    <Icon size={16} className="shrink-0 text-zinc-400" />
                    {prompt.text}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          // Messages
          <div className="mx-auto w-full max-w-3xl px-5 py-8">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isStreaming && messages[messages.length - 1]?.role !== "assistant" && (
              <TypingIndicator />
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input composer */}
      <div className="shrink-0 px-4 pb-4 pt-2">
        <div className="mx-auto max-w-3xl">
          <div className="relative transition focus-within:border-zinc-400 focus-within:shadow-md">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void handleSubmit();
                }
              }}
              placeholder="Ask something about your documents..."
              rows={1}
              disabled={isStreaming}
              className="max-h-40 min-h-[52px] w-full resize-none bg-transparent px-4 py-3.5 pr-14 text-sm outline-none placeholder:text-zinc-400 disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={!input.trim() || isStreaming}
              className="absolute bottom-2.5 right-2.5 flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-950 text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-30 active:scale-95"
            >
              <ArrowUp size={16} />
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] text-zinc-400">
            Each question uses 1 credit · Answers are grounded in your knowledge base
          </p>
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="mb-8 flex items-start gap-3 animate-fade-in">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-zinc-950 text-white">
        <Sparkles size={14} />
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl bg-white border border-zinc-100 px-4 py-3 shadow-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 animate-bounce" />
        <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '100ms' }} />
        <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '200ms' }} />
      </div>
    </div>
  );
}
