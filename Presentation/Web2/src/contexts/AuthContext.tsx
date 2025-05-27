import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

// Provide a default value for context
export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/me', { credentials: 'include' })
      .then(res => (res.ok ? res.json() : Promise.reject('Not authenticated')))
      .then(data => setUser(data))
      .catch(() => setUser(null));
  }, []); 

  const signup = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) throw new Error('Signup failed');
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error('Login failed');

      const meRes = await fetch('http://localhost:5000/api/me', { credentials: 'include' });
      if (meRes.ok) setUser(await meRes.json());
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const logout = async () => {
    await fetch('http://localhost:5000/api/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
  };

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
