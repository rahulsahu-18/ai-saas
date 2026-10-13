import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { authClient } from '../../utils/auth-client';
import { updateCurrentUser, clearUser } from '../../store/slice/userSlice';
import LoadingScreen from '../ui/LoadingScreen';

type SessionUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
};

type AuthContextType = {
  user: SessionUser | null;
  isAuthenticated: boolean;
  isPending: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isPending: true,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const dispatch = useDispatch();

  const user = session?.user ?? null;
  const isAuthenticated = !!user;

  useEffect(() => {
    if (isPending) return;
    if (user) {
      dispatch(updateCurrentUser({
        isLoggedIn: true,
        name: user.name ?? null,
        image: user.image ?? null,
        email: user.email ?? null,
      }));
    } else {
      dispatch(clearUser());
    }
  }, [dispatch, user, isPending]);

  if (isPending) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext value={{ user: user as SessionUser | null, isAuthenticated, isPending }}>
      {children}
    </AuthContext>
  );
}
