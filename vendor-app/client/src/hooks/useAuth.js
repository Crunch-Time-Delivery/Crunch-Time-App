import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem('vendorEmail');
    const pass = localStorage.getItem('vendorPassword');
    setIsAuthenticated(!!(email && pass));
  }, []);

  const login = (email, password) => {
    localStorage.setItem('vendorEmail', email);
    localStorage.setItem('vendorPassword', password);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('vendorEmail');
    localStorage.removeItem('vendorPassword');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
};