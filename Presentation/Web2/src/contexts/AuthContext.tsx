import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    fetch('http://localhost:5000/api/me', { 
      credentials: 'include'  // include JWT cookie
    })
    .then(res => {
      if (res.ok) return res.json();
      throw new Error('Not authenticated');
    })
    .then(data => {
      setUser(data);  // set user if token was valid
    })
    .catch(() => setUser(null));
  }, []);

  // Signup function
  const signup = async (name, email, password) => {
    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({ name, email, password })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.msg || 'Signup failed');
      }
      // On success, optionally auto-login or prompt user to login
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',  // important to include the cookie
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.msg || 'Login failed');
      }
      // Fetch the user info after login
      const meRes = await fetch('http://localhost:5000/api/me', {
        credentials: 'include'
      });
      if (meRes.ok) {
        const userData = await meRes.json();
        setUser(userData);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // Logout function
  const logout = async () => {
    await fetch('http://localhost:5000/api/logout', {
      method: 'POST',
      credentials: 'include'
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
