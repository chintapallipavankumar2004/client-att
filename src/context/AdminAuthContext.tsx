import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { adminAuthService, type AdminLoginPayload } from '../services/adminAuthService';
import { buildAdminLoginPath, navigateToPath } from '../lib/browserRouting';
import {
  type AdminPermission,
  type AdminRole,
  type AdminTab,
  getAdminPath,
  getAdminPermissionForTab,
  hasAdminPermission,
} from '../shared/adminAccess';
import type { AdminSessionUser } from '../types';

interface AdminAuthContextValue {
  adminUser: AdminSessionUser | null;
  loading: boolean;
  login: (payload: AdminLoginPayload) => Promise<AdminSessionUser>;
  logout: (redirectPath?: string) => Promise<void>;
  refreshSession: () => Promise<AdminSessionUser | null>;
  canAccessTab: (tab: AdminTab) => boolean;
  hasPermission: (permission: AdminPermission) => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminSessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const expiryTimerRef = useRef<number | null>(null);

  const clearExpiryTimer = () => {
    if (expiryTimerRef.current) {
      window.clearTimeout(expiryTimerRef.current);
      expiryTimerRef.current = null;
    }
  };

  const scheduleExpiry = (user: AdminSessionUser | null) => {
    clearExpiryTimer();

    if (!user || typeof window === 'undefined') {
      return;
    }

    const timeoutMs = user.expiresAt - Date.now();
    if (timeoutMs <= 0) {
      void logout(buildAdminLoginPath(window.location.pathname));
      return;
    }

    expiryTimerRef.current = window.setTimeout(() => {
      setAdminUser(null);
      navigateToPath(buildAdminLoginPath(window.location.pathname), { replace: true });
    }, timeoutMs);
  };

  const refreshSession = async () => {
    try {
      const response = await adminAuthService.getSession();
      const nextUser = response.authenticated ? response.admin : null;
      setAdminUser(nextUser);
      scheduleExpiry(nextUser);
      return nextUser;
    } catch {
      setAdminUser(null);
      clearExpiryTimer();
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshSession();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && window.location.pathname.startsWith('/admin')) {
        void refreshSession();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      clearExpiryTimer();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const login = async (payload: AdminLoginPayload) => {
    const response = await adminAuthService.login(payload);
    setAdminUser(response.admin);
    scheduleExpiry(response.admin);
    return response.admin;
  };

  const logout = async (redirectPath = '/admin/login') => {
    try {
      await adminAuthService.logout();
    } finally {
      setAdminUser(null);
      clearExpiryTimer();
      navigateToPath(redirectPath, { replace: true });
    }
  };

  const hasPermission = (permission: AdminPermission) => {
    if (!adminUser) {
      return false;
    }

    return hasAdminPermission(adminUser.role as AdminRole, permission);
  };

  const canAccessTab = (tab: AdminTab) => hasPermission(getAdminPermissionForTab(tab));

  const value = useMemo(
    () => ({
      adminUser,
      loading,
      login,
      logout,
      refreshSession,
      canAccessTab,
      hasPermission,
    }),
    [adminUser, loading],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider.');
  }

  return context;
};
