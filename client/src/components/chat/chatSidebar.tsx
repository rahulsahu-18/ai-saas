import { FileText, Sparkles, Tag, Trash2 } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CreditBalance from "../CreditBalance";
import { useDeleteChatMutation, useGetChatsQuery } from "../../store/rtkquery/api";

export function ChatSidebar() {
  const { data, isLoading } = useGetChatsQuery();
  const [deleteChat] = useDeleteChatMutation();
  const chatSidebar = data?.chats ?? [];
  const location = useLocation();
  const navigate = useNavigate();

  async function handleDelete(chatId: string) {
    try {
      await deleteChat(chatId).unwrap();

      if (location.pathname === `/chat/${chatId}`) {
        navigate("/chat");
      }
    } catch (error) {
      console.error("Failed to delete chat", error);
    }
  }

  return (
    <aside className="hidden w-64 shrink-0 border-r border-zinc-200 bg-white lg:flex lg:flex-col">

      {/* Logo */}
      <div className="flex h-16 items-center border-b border-zinc-200 px-5">

        <a
          href="/"
          className="flex items-center gap-2.5"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-xs font-bold text-white">
            K
          </div>

          <span className="text-sm font-semibold">
            Knowledgebase
          </span>
        </a>

      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">

        <Link
          to="/files"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
        >
          <FileText size={17} />
          Documents
        </Link>

        <Link
          to="/chat"
          className="mt-1 flex items-center gap-3 rounded-lg bg-zinc-100 px-3 py-2.5 text-sm font-medium text-zinc-950"
        >
          <Sparkles size={17} />
          Chat
        </Link>

        <Link
          to="/pricing"
          className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
        >
          <Tag size={17} />
          Pricing
        </Link>

        <div className="mt-5">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
            Recent chats
          </p>

          <div className="mt-2 space-y-1">
            {isLoading && (
              <p className="px-3 py-2 text-xs text-zinc-400">Loading chats...</p>
            )}

            {!isLoading && chatSidebar.length === 0 && (
              <p className="px-3 py-2 text-xs text-zinc-400">No chats yet</p>
            )}

            {chatSidebar.map((chat) => {
              const isActive = location.pathname === `/chat/${chat.id}`;

              return (
                <div
                  key={chat.id}
                  className={`group flex items-center rounded-lg text-sm transition ${
                    isActive
                      ? "bg-zinc-100 text-zinc-950"
                      : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                  }`}
                >
                  <Link
                    to={`/chat/${chat.id}`}
                    className="min-w-0 flex-1 truncate px-3 py-2.5"
                  >
                    {chat.title || "Untitled chat"}
                  </Link>

                  <button
                    type="button"
                    aria-label={`Delete ${chat.title || "chat"}`}
                    title="Delete chat"
                    onClick={() => void handleDelete(chat.id)}
                    className="mr-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-400 opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 focus:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </nav>

      {/* Bottom */}
      <div className="border-t border-zinc-200 p-3">

        <CreditBalance />

        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900">
          Settings
        </button>

      </div>

    </aside>
  );
}


export function LoadingMessage() {
  return (
    <div className="mb-8 flex items-start gap-2">

      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-950 text-white">
        <Sparkles size={14} />
      </div>

      <div className="flex items-center gap-1 rounded-xl bg-white px-4 py-3">

        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400" />

        <span
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400"
          style={{ animationDelay: "100ms" }}
        />

        <span
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400"
          style={{ animationDelay: "200ms" }}
        />

      </div>

    </div>
  );
}