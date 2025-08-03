// src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api'; // We'll create a simple API wrapper

// Define the shape of your user and auth context
interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for the provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // On initial load, check for a token and fetch user data
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const responseData = await api.get('/auth/me');
          setUser(responseData.user);
        } catch (error) {
          console.error('Failed to fetch user', error);
          localStorage.removeItem('token'); // Clear invalid token
          router.push('/login');
        }
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, [router]);

  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    setUser(userData);
    router.push('/');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};