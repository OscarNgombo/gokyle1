import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  clearStoredAdminAuthSession,
  createStoredAdminAuthSession,
  getStoredAdminAuthSession,
  setStoredAdminAuthSession,
} from '@/lib/auth-storage';

describe('admin auth storage', () => {
  afterEach(() => {
    clearStoredAdminAuthSession();
    vi.useRealTimers();
  });

  it('stores and restores a valid admin session', () => {
    const session = createStoredAdminAuthSession({
      accessToken: 'jwt-token',
      tokenType: 'bearer',
      expiresIn: 600,
      user: {
        id: 'admin-1',
        email: 'admin@example.com',
        fullName: 'Admin User',
        role: 'admin',
        isActive: true,
        lastLoginAt: null,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      },
    });

    setStoredAdminAuthSession(session);

    expect(getStoredAdminAuthSession()).toEqual(session);
  });

  it('clears expired sessions when reading storage', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01T00:00:00Z'));

    window.localStorage.setItem(
      'gokyle.admin.auth',
      JSON.stringify({
        accessToken: 'expired-token',
        expiresAt: '2024-12-31T23:59:59Z',
      }),
    );

    expect(getStoredAdminAuthSession()).toBeNull();
    expect(window.localStorage.getItem('gokyle.admin.auth')).toBeNull();
  });
});
