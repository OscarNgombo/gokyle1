import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@/api/client';
import { adminMeQueryOptions, authQueryKeys, useAdminMeQuery } from '@/api/queries';
import { loginAdminUser } from '@/api/services';
import type { AdminLoginInput } from '@/api/types';
import { AuthContext, type AuthContextValue } from '@/contexts/auth-context';
import {
  clearStoredAdminAuthSession,
  createStoredAdminAuthSession,
  getStoredAdminAuthSession,
  setStoredAdminAuthSession,
  type StoredAdminAuthSession,
} from '@/lib/auth-storage';

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<StoredAdminAuthSession | null>(() => getStoredAdminAuthSession());

  const clearSession = useCallback(() => {
    clearStoredAdminAuthSession();
    setSession(null);
    queryClient.removeQueries({ queryKey: authQueryKeys.all });
  }, [queryClient]);

  const meQuery = useAdminMeQuery(session?.accessToken, {
    retry: false,
  });

  useEffect(() => {
    if (meQuery.error instanceof ApiError && [401, 403].includes(meQuery.error.status)) {
      clearSession();
    }
  }, [clearSession, meQuery.error]);

  const login = useCallback(
    async (input: AdminLoginInput) => {
      const response = await loginAdminUser(input);
      const nextSession = createStoredAdminAuthSession(response);

      setStoredAdminAuthSession(nextSession);
      setSession(nextSession);
      queryClient.setQueryData(authQueryKeys.me(nextSession.accessToken), response.user);

      return response;
    },
    [queryClient],
  );

  const refreshCurrentUser = useCallback(async () => {
    if (!session?.accessToken) {
      return undefined;
    }

    return queryClient.fetchQuery(adminMeQueryOptions(session.accessToken));
  }, [queryClient, session?.accessToken]);

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken: session?.accessToken ?? null,
      authError: meQuery.error ?? null,
      hasStoredSession: Boolean(session?.accessToken),
      isAuthenticated: Boolean(session?.accessToken && meQuery.data),
      isBootstrapping: Boolean(session?.accessToken) && meQuery.isPending,
      login,
      logout: clearSession,
      refreshCurrentUser,
      session,
      user: meQuery.data ?? null,
    }),
    [clearSession, login, meQuery.data, meQuery.error, meQuery.isPending, refreshCurrentUser, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
