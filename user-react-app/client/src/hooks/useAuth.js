import { useState, useEffect, useCallback } from 'react';

export const useAuth = (options = { persist: true }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage or other storage
  useEffect(() => {
    const email = localStorage.getItem('driverEmail');
    const password = localStorage.getItem('driverPassword');
    if (options.persist) {
      setIsAuthenticated(!!(email && password));
    } else {
      setIsAuthenticated(false);
    }
  }, [options.persist]);

  // Login function
  const login = useCallback((email, password) => {
    if (options.persist) {
      localStorage.setItem('driverEmail', email);
      localStorage.setItem('driverPassword', password);
    }
    setIsAuthenticated(true);
  }, [options.persist]);

  // Logout function
  const logout = useCallback(() => {
    if (options.persist) {
      localStorage.removeItem('driverEmail');
      localStorage.removeItem('driverPassword');
    }
    setIsAuthenticated(false);
  }, [options.persist]);

  return { isAuthenticated, login, logout };
};