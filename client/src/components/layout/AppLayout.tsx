import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  MessageSquare,
  FolderPlus,
  FileText,
  CreditCard,
  Menu,
  X,
  Trash2,
  ReceiptText,
} from 'lucide-react';
import UserMenu from './UserMenu';
import CreditBalance from '../CreditBalance';
import { useGetChatsQuery, useDeleteChatMutation } from '../../store/rtkquery/api';
import { useAuth } from '../auth/AuthProvider';

const navItems = [
  { to: '/chat', icon: MessageSquare, label: 'Chat' },
  { to: '/knowledge-bases', icon: FolderPlus, label: 'Knowledge Base' },
  { to: '/files', icon: FileText, label: 'My Files' },
  { to: '/pricing', icon: CreditCard, label: 'Pricing' },
  { to: '/transactions', icon: ReceiptText, label: 'Transactions' },
];

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { data: chatsData, isLoading: chatsLoading } = useGetChatsQuery(undefined, { skip: !isAuthenticated });
  const [deleteChat] = useDeleteChatMutation();
  const chats = chatsData?.chats ?? [];
  const isOnChatPage = location.pathname.startsWith('/chat');

  const handleDeleteChat = async (chatId: string) => {
    try {
      await deleteChat(chatId).unwrap();
    } catch {
      // silently fail, toast could be added
    }
  };

  return (
    <div className="flex h-screen bg-[#fafafa] text-zinc-950">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-zinc-200 flex flex-col transition-transform duration-200 ease-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-zinc-200 px-5">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-xs font-bold text-white">
              K
            </div>
            <span className="text-sm font-semibold">Knowbase</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                    isActive
                      ? 'bg-zinc-100 font-medium text-zinc-950'
                      : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'
                  }`}
                >
                  <Icon size={17} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Recent chats - show on chat pages */}
          {isOnChatPage && (
            <div className="mt-6">
              <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                Recent chats
              </p>
              <div className="mt-2 space-y-0.5">
                {chatsLoading && (
                  <p className="px-3 py-2 text-xs text-zinc-400">Loading...</p>
                )}
                {!chatsLoading && chats.length === 0 && (
                  <p className="px-3 py-2 text-xs text-zinc-400">No chats yet</p>
                )}
                {chats.map((chat) => {
                  const isActive = location.pathname === `/chat/${chat.id}`;
                  return (
                    <div
                      key={chat.id}
                      className={`group flex items-center rounded-lg text-sm transition ${
                        isActive
                          ? 'bg-zinc-100 text-zinc-950'
                          : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'
                      }`}
                    >
                      <Link
                        to={`/chat/${chat.id}`}
                        onClick={() => setSidebarOpen(false)}
                        className="min-w-0 flex-1 truncate px-3 py-2"
                      >
                        {chat.title || 'Untitled chat'}
                      </Link>
                      <button
                        type="button"
                        aria-label={`Delete ${chat.title || 'chat'}`}
                        title="Delete chat"
                        onClick={() => void handleDeleteChat(chat.id)}
                        className="mr-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-400 opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 focus:opacity-100"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </nav>

        {/* Bottom */}
        <div className="border-t border-zinc-200 p-3">
          <CreditBalance />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu size={18} />
          </button>
          <div className="lg:hidden" /> {/* spacer */}
          <div className="ml-auto">
            <UserMenu />
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
