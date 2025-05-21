import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default PrivateRoute;
