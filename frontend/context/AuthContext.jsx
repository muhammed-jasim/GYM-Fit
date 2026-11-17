'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  demoLogin: async () => {},
  continueWithGoogle: async () => {},
  logout: () => {},
  updateProfile: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const stored = authService.getStoredUser();
      if (stored) {
        setUser(stored);
      }
      if (authService.isAuthenticated()) {
        try {
          const freshUser = await authService.getCurrentUser();
          setUser(freshUser);
        } catch (err) {
          console.warn('Could not refresh user session', err);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (username, password) => {
    const loggedInUser = await authService.login(username, password);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = async (data) => {
    const newUser = await authService.register(data);
    setUser(newUser);
    return newUser;
  };

  const demoLogin = async () => {
    const demoUser = await authService.demoLogin();
    setUser(demoUser);
    return demoUser;
  };

  const continueWithGoogle = async (googleData) => {
    const googleUser = await authService.continueWithGoogle(googleData);
    setUser(googleUser);
    return googleUser;
  };

  const logout = () => {
    setUser(null);
    authService.logout();
  };

  const updateProfile = async (profileData) => {
    const updated = await authService.updateProfile(profileData);
    setUser(updated);
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        demoLogin,
        continueWithGoogle,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
