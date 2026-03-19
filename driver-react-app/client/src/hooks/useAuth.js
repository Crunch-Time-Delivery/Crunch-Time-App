import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('driverEmail') && localStorage.getItem('driverPassword');
    setIsAuthenticated(!!loggedIn);
  }, []);

  const login = (email, password) => {
    // Here you can add real authentication logic
    localStorage.setItem('driverEmail', email);
    localStorage.setItem('driverPassword', password);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('driverEmail');
    localStorage.removeItem('driverPassword');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
};