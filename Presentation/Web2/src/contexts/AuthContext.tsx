import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => {
    console.log('User logged in');
    setIsAuthenticated(true);
  };
  const logout = () => {
    console.log('User logged out');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
