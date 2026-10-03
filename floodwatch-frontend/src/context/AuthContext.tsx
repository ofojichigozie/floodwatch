import { createContext, useContext, useState, ReactNode } from 'react';
import { Admin } from '../types';

interface AuthContextType {
  admin: Admin | null;
  token: string | null;
  login: (token: string, admin: Admin) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('fw_token'));
  const [admin, setAdmin] = useState<Admin | null>(() => {
    const storedAdmin = localStorage.getItem('fw_admin');
    if (!storedAdmin) return null;

    try {
      return JSON.parse(storedAdmin) as Admin;
    } catch {
      return null;
    }
  });

  const login = (token: string, admin: Admin) => {
    localStorage.setItem('fw_token', token);
    localStorage.setItem('fw_admin', JSON.stringify(admin));
    setToken(token);
    setAdmin(admin);
  };

  const logout = () => {
    localStorage.removeItem('fw_token');
    localStorage.removeItem('fw_admin');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
