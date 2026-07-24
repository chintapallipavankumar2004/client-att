import { fetchJson } from './api';
import type { AdminSessionUser } from '../types';

export interface AdminLoginPayload {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface AdminSessionResponse {
  authenticated: boolean;
  admin: AdminSessionUser | null;
}

interface AdminLoginResponse {
  message: string;
  admin: AdminSessionUser;
}

export const adminAuthService = {
  getSession() {
    return fetchJson<AdminSessionResponse>('/api/admin/session');
  },

  login(payload: AdminLoginPayload) {
    return fetchJson<AdminLoginResponse>('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  logout() {
    return fetchJson<{ message: string }>('/api/admin/logout', {
      method: 'POST',
      body: JSON.stringify({}),
    });
  },
};
