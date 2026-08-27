import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminUser } from '../types';
import { validateClientMasterAuth } from '../utils/clientStorage';

interface AuthContextType {
  token: string | null;
  adminUser: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'scc_admin_auth_token';
const OFFLINE_USER_KEY = 'scc_admin_offline_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_KEY);
  });
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const raw = localStorage.getItem(OFFLINE_USER_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {}
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkAuth = async () => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    if (!savedToken) {
      setAdminUser(null);
      setToken(null);
      setIsLoading(false);
      return;
    }

    // If static / client fallback token, validate directly
    if (savedToken.startsWith('scc_static_token_')) {
      const fallbackUser: AdminUser = {
        id: 'admin-primary-1',
        email: 'mohdshahnawaz.afaque@gmail.com',
        role: 'superadmin',
        createdAt: '2026-01-01T00:00:00.000Z',
      };
      setAdminUser(fallbackUser);
      setToken(savedToken);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${savedToken}`,
        },
      });

      let data: any = {};
      try {
        const text = await res.text();
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {};
      }

      if (res.ok && data.authenticated && data.user) {
        setAdminUser(data.user);
        setToken(savedToken);
        localStorage.setItem(OFFLINE_USER_KEY, JSON.stringify(data.user));
      } else if (res.status === 404 || res.status === 502 || res.status === 503) {
        // Server not available (e.g. Netlify static hosting)
        const fallbackUser: AdminUser = {
          id: 'admin-primary-1',
          email: 'mohdshahnawaz.afaque@gmail.com',
          role: 'superadmin',
          createdAt: '2026-01-01T00:00:00.000Z',
        };
        setAdminUser(fallbackUser);
        setToken(savedToken);
      } else {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(OFFLINE_USER_KEY);
        setToken(null);
        setAdminUser(null);
      }
    } catch {
      // Offline / Netlify fallback
      const rawUser = localStorage.getItem(OFFLINE_USER_KEY);
      if (rawUser) {
        try {
          setAdminUser(JSON.parse(rawUser));
          setToken(savedToken);
        } catch {
          setAdminUser({
            id: 'admin-primary-1',
            email: 'mohdshahnawaz.afaque@gmail.com',
            role: 'superadmin',
            createdAt: '2026-01-01T00:00:00.000Z',
          });
          setToken(savedToken);
        }
      } else {
        setAdminUser({
          id: 'admin-primary-1',
          email: 'mohdshahnawaz.afaque@gmail.com',
          role: 'superadmin',
          createdAt: '2026-01-01T00:00:00.000Z',
        });
        setToken(savedToken);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      let data: any = {};
      try {
        const text = await res.text();
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {};
      }

      if (res.ok && data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(OFFLINE_USER_KEY, JSON.stringify(data.user));
        setToken(data.token);
        setAdminUser(data.user);
        return { success: true };
      }

      // If server responded with 401 or 404, check client master fallback (e.g. Netlify)
      const clientAuth = validateClientMasterAuth(cleanEmail, password);
      if (clientAuth.success && clientAuth.token && clientAuth.user) {
        localStorage.setItem(TOKEN_KEY, clientAuth.token);
        localStorage.setItem(OFFLINE_USER_KEY, JSON.stringify(clientAuth.user));
        setToken(clientAuth.token);
        setAdminUser(clientAuth.user);
        return { success: true };
      }

      if (!res.ok) {
        return {
          success: false,
          error: data.error || 'Invalid email or password. Please verify credentials.',
        };
      }

      return { success: false, error: 'Authentication token not received.' };
    } catch {
      // Network error or static hosting (Netlify) fallback
      const clientAuth = validateClientMasterAuth(cleanEmail, password);
      if (clientAuth.success && clientAuth.token && clientAuth.user) {
        localStorage.setItem(TOKEN_KEY, clientAuth.token);
        localStorage.setItem(OFFLINE_USER_KEY, JSON.stringify(clientAuth.user));
        setToken(clientAuth.token);
        setAdminUser(clientAuth.user);
        return { success: true };
      }

      return { success: false, error: 'Invalid email or password. Please verify credentials.' };
    }
  };

  const logout = async () => {
    try {
      if (token && !token.startsWith('scc_static_token_')) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch {}
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(OFFLINE_USER_KEY);
    setToken(null);
    setAdminUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        adminUser,
        isAuthenticated: !!token && !!adminUser,
        isLoading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
