import { createContext } from 'react';
import type { AdminLoginInput, AdminLoginResponse, AdminUser } from '@/api/types';
import type { StoredAdminAuthSession } from '@/lib/auth-storage';

export interface AuthContextValue {
  accessToken: string | null;
  authError: Error | null;
  hasStoredSession: boolean;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  login: (input: AdminLoginInput) => Promise<AdminLoginResponse>;
  logout: () => void;
  refreshCurrentUser: () => Promise<AdminUser | undefined>;
  session: StoredAdminAuthSession | null;
  user: AdminUser | null;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
