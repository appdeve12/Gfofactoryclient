import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuth = !!localStorage.getItem('token');
  console.log("isAuth", isAuth);

  return isAuth ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
