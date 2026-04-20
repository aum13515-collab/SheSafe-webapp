import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { storageService } from '../services/storageService';
import { ADMIN_CREDENTIALS } from '../utils/constants';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => storageService.getCurrentUser());
  const [isAdmin, setIsAdmin] = useState<boolean>(() => storageService.isAdminLoggedIn());

  const login = (username: string, password: string, isAdminLogin: boolean): boolean => {
    if (isAdminLogin) {
      if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        setIsAdmin(true);
        setUser(null);
        storageService.setAdminLoggedIn(true);
        storageService.setCurrentUser(null);
        return true;
      }
      return false;
    }

    const existingUser = storageService.getUserByUsername(username);
    if (existingUser) {
      const storedHash = btoa(password);
      if (existingUser.passwordHash === storedHash) {
        setUser(existingUser);
        setIsAdmin(false);
        storageService.setCurrentUser(existingUser);
        storageService.setAdminLoggedIn(false);
        return true;
      }
    }
    return false;
  };

  const register = (name: string, username: string, phone: string, password: string): boolean | string => {
    const existingUser = storageService.getUserByUsername(username);
    if (existingUser) {
      return 'Username already taken';
    }

    const newUser: User = {
      id: Date.now().toString(),
      username,
      name,
      phone,
      passwordHash: btoa(password),
      createdAt: new Date().toISOString()
    };

    storageService.saveUser(newUser);
    setUser(newUser);
    setIsAdmin(false);
    storageService.setCurrentUser(newUser);
    storageService.setAdminLoggedIn(false);
    return true;
  };

  const logout = (): void => {
    setUser(null);
    setIsAdmin(false);
    storageService.setCurrentUser(null);
    storageService.setAdminLoggedIn(false);
  };

  const value: AuthContextType = {
    user,
    isAdmin,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
