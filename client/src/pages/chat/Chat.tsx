import { useState } from "react";
import { ArrowUp, FileText, Menu } from "lucide-react";
import { ChatSidebar, LoadingMessage } from "../../components/chat/chatSidebar";
import { MessageBubble } from "../../components/chat/MessageBubble";
import { useNavigate, useParams } from "react-router-dom";

export interface Source {
  id: string;
  filename: string;
  page?: number;
  snippet?: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { chatId } = useParams<{chatId:string|undefined}>();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const question = input.trim();

    if (!question || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: question,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // temporary ID for the assistant message
    const assistantId = crypto.randomUUID();

    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/chat/message${
          chatId ? `/${chatId}` : ""
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            message: question,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      if (!response.body) {
        throw new Error("ReadableStream not supported");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let buffer = "";
      let assistantContent = "";

      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // SSE events are separated by \n\n
        const events = buffer.split("\n\n");

        // Keep incomplete event for next chunk
        buffer = events.pop() ?? "";

        for (const event of events) {
          if (!event.trim()) continue;

          const eventType = event.match(/^event:\s*(.+)$/m)?.[1];

          const dataLine = event.match(/^data:\s*(.+)$/m)?.[1];

          if (!dataLine) continue;

          const data = JSON.parse(dataLine);

          // -------------------------
          // New chat created
          // -------------------------
          if (eventType === "chat_created") {
            console.log("Chat created:", data.chatId);
            navigate(`/chat/${data.chatId}`, {
              replace: true,
            });
          }
          
          if (eventType === "sources") {
            console.log("Sources:", data.sources);

            setMessages((prev) => [
              ...prev,
              {
                id: assistantId,
                role: "assistant",
                content: "",
                sources: data.sources.map((filename: string) => ({
                  id: crypto.randomUUID(),
                  filename,
                })),
              },
            ]);
          }

          // -------------------------
          // Token
          // -------------------------
          if (eventType === "token") {
            assistantContent += data.text;

            setMessages((prev) =>
              prev.map((message) =>
                message.id === assistantId
                  ? {
                      ...message,
                      content: assistantContent,
                    }
                  : message,
              ),
            );
          }
          if (eventType === "done") {
            console.log("Streaming completed");
          }
        }
      }
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#fafafa] text-zinc-950">
      {/* Sidebar */}
      <ChatSidebar />

      {/* Chat */}
      <main className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center border-b border-zinc-200 bg-white px-5">
          <button className="mr-3 flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 lg:hidden">
            <Menu size={19} />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-950 text-white">
              <FileText size={17} />
            </div>

            <div>
              <h1 className="text-sm font-semibold">Knowledge Base</h1>

              <p className="text-xs text-zinc-400">Document Assistant</p>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-3xl px-5 py-10">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {isLoading && <LoadingMessage />}
          </div>
        </div>

        {/* Input */}
        <div className="shrink-0 bg-[#fafafa] px-5 pb-5">
          <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
            <div className="relative rounded-2xl border border-zinc-300 bg-white shadow-sm focus-within:border-zinc-400">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();

                    handleSubmit(e as unknown as React.FormEvent);
                  }
                }}
                placeholder="Ask something about your documents..."
                rows={1}
                className="max-h-40 min-h-[56px] w-full resize-none bg-transparent px-4 py-4 pr-14 text-sm outline-none placeholder:text-zinc-400"
              />

              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute bottom-2.5 right-2.5 flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-950 text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ArrowUp size={17} />
              </button>
            </div>

            <p className="mt-2 text-center text-[11px] text-zinc-400">
              Answers are generated from your uploaded documents.
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
