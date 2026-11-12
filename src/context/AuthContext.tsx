import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/index.js';
import { apiRequest, setAuthToken, clearAuthToken, getAuthToken } from '../api/client.js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<User>;
  register: (data: any) => Promise<any>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  quickLogin: (email: string) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const token = getAuthToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await apiRequest<{ user: User }>('/auth/me');
      setUser(res.user);
    } catch (err: any) {
      console.warn('Session verification failed:', err.message);
      clearAuthToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password = 'IeltsMaster2026!') => {
    setLoading(true);
    try {
      const res = await apiRequest<{ token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      setAuthToken(res.token);
      setUser(res.user);
      return res.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: any) => {
    return await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  const logout = async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    } finally {
      clearAuthToken();
      setUser(null);
    }
  };

  const quickLogin = async (email: string) => {
    // Determine default password
    let pwd = 'IeltsMaster2026!';
    if (email.includes('@example.kz')) {
      pwd = 'Student2026!';
    }
    return login(email, pwd);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, quickLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
