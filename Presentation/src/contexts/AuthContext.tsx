// src/contexts/AuthContext.tsx

import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import { fetchWithRefresh } from "../api/backendClient";

interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  id: string;
  name: string;
  email: string;
  simulationsId: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserData: () => Promise<void>;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  // On mount, try to load /api/me
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchWithRefresh("http://localhost:5000/api/me", {
          credentials: "include",
        });
        if (res.ok) {
          const data: User = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Failed to fetch /api/me:", err);
        setUser(null);
      }
    })();
  }, []);

  // Periodic refresh every 4 minutes
  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const res = await fetch("http://localhost:5000/api/refresh", {
          method: "POST",
          credentials: "include",
        });
        if (!res.ok) {
          // If refresh fails, log out
          await logout();
        } else {
          // Optionally update user data after refreshing
          await updateUserData();
        }
      } catch (err) {
        console.error("Auto-refresh failed:", err);
        await logout();
      }
    }, 1000 * 60 * 4); // every 4 minutes

    return () => clearInterval(intervalId);
  }, [user]); // only start/stop if `user` changes

  const updateUserData = async () => {
    try {
      const res = await fetchWithRefresh("http://localhost:5000/api/me", {
        credentials: "include",
      });
      if (res.ok) {
        const data: User = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Failed to update user data:", err);
      setUser(null);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Signup failed: ${errText}`);
      }
      // Immediately fetch /api/me to update user state
      await updateUserData();
    } catch (err) {
      console.error("Signup error:", err);
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Login failed: ${errText}`);
      }
      // Immediately fetch /api/me to update user state
      await updateUserData();
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await fetch("http://localhost:5000/api/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      setUser(null);
    }
  };

  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, updateUserData, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}
