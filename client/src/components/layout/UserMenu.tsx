import { useState, useRef, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { authClient } from '../../utils/auth-client';
import { clearUser } from '../../store/slice/userSlice';
import { api } from '../../store/rtkquery/api';
import { UserAvatar } from '../../utils/utils';
import { useAuth } from '../auth/AuthProvider';

export default function UserMenu() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await authClient.signOut();
      dispatch(api.util.resetApiState());
      dispatch(clearUser());
      setOpen(false);
      navigate('/', { replace: true });
    } catch {
      toast.error('Failed to log out. Please try again.');
      setLoggingOut(false);
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2"
        aria-label="User menu"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <UserAvatar image={user.image} name={user.name} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg z-50 transition-opacity"
          style={{ animation: 'fadeIn 0.15s ease-out' }}
        >
          {/* User info */}
          <div className="px-3 py-3 border-b border-zinc-100 mb-1">
            <p className="text-sm font-semibold text-zinc-900 truncate">{user.name}</p>
            <p className="text-xs text-zinc-500 truncate mt-0.5">{user.email}</p>
          </div>

          {/* Logout */}
          <button
            onClick={() => void handleLogout()}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-50"
          >
            <LogOut size={16} />
            {loggingOut ? 'Logging out...' : 'Log out'}
          </button>
        </div>
      )}
    </div>
  );
}
