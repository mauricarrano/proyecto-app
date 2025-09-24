import React, { createContext, useState, useMemo, useEffect } from 'react';
import type { User, Theme, Career } from '../types';

interface AppContextType {
  user: User | null;
  theme: Theme;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => void;
}

const THEMES: Record<Career, Theme> = {
  software: {
    primary: '34 197 94', // green-500
    secondary: '2 132 199', // sky-600
    background: '15 23 42', // slate-900
    surface: '30 41 59', // slate-800
    textPrimary: '241 245 249', // slate-100
    textSecondary: '148 163 184', // slate-400
  },
  design: {
    primary: '234 88 12', // orange-600
    secondary: '168 85 247', // purple-500
    background: '17 24 39', // gray-900
    surface: '31 41 55', // gray-800
    textPrimary: '243 244 246', // gray-100
    textSecondary: '156 163 175', // gray-400
  },
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const theme = useMemo(() => {
    return user ? THEMES[user.career] : THEMES.software;
  }, [user]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-secondary', theme.secondary);
    root.style.setProperty('--color-background', theme.background);
    root.style.setProperty('--color-surface', theme.surface);
    root.style.setProperty('--color-text-primary', theme.textPrimary);
    root.style.setProperty('--color-text-secondary', theme.textSecondary);
  }, [theme]);

  const login = (userData: User) => {
    setUser(userData);
  };
  const logout = () => setUser(null);

  const updateUser = (updatedData: Partial<User>) => {
    setUser(prevUser => (prevUser ? { ...prevUser, ...updatedData } : null));
  };


  const value = { user, theme, login, logout, updateUser };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};