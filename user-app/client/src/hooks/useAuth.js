import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem('driverEmail');
    const password = localStorage.getItem('driverPassword');
    setIsAuthenticated(!!(email && password));
  }, []);

  const login = (email, password) => {
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