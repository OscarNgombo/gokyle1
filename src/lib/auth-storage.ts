import type { AdminLoginResponse } from '@/api/types';

const ADMIN_AUTH_STORAGE_KEY = 'gokyle.admin.auth';

export interface StoredAdminAuthSession {
  accessToken: string;
  expiresAt: string;
}

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const isStoredAdminAuthSession = (value: unknown): value is StoredAdminAuthSession => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Partial<StoredAdminAuthSession>;
  return typeof candidate.accessToken === 'string' && typeof candidate.expiresAt === 'string';
};

export const createStoredAdminAuthSession = (response: AdminLoginResponse): StoredAdminAuthSession => ({
  accessToken: response.accessToken,
  expiresAt: new Date(Date.now() + response.expiresIn * 1000).toISOString(),
});

export const getStoredAdminAuthSession = (): StoredAdminAuthSession | null => {
  if (!canUseStorage()) {
    return null;
  }

  const rawValue = window.localStorage.getItem(ADMIN_AUTH_STORAGE_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(rawValue) as unknown;
    if (!isStoredAdminAuthSession(parsedValue)) {
      window.localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
      return null;
    }

    if (new Date(parsedValue.expiresAt).getTime() <= Date.now()) {
      window.localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
      return null;
    }

    return parsedValue;
  } catch {
    window.localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
    return null;
  }
};

export const setStoredAdminAuthSession = (session: StoredAdminAuthSession) => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, JSON.stringify(session));
};

export const clearStoredAdminAuthSession = () => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
};
