// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { MOCK_USER } from '../data/mockData';
import { displayNameFromEmail, userIdFromEmail } from '../utils/userIdentity';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(r => setTimeout(r, 1200));
      if (!email || !password) throw new Error('Please fill in all fields.');
      if (!email.includes('@')) throw new Error('Please enter a valid email address.');
      if (password.length < 6) throw new Error('Password must be at least 6 characters.');
      const emailTrim = email.trim();
      setUser({
        ...MOCK_USER,
        id: userIdFromEmail(emailTrim),
        name: displayNameFromEmail(emailTrim),
        email: emailTrim,
      });
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(r => setTimeout(r, 1400));
      if (!name || !email || !password) throw new Error('Please fill in all fields.');
      if (!email.includes('@')) throw new Error('Please enter a valid email address.');
      if (password.length < 6) throw new Error('Password must be at least 6 characters.');
      const emailTrim = email.trim();
      const newUser = {
        ...MOCK_USER,
        id: userIdFromEmail(emailTrim),
        name: name.trim(),
        email: emailTrim,
        joinDate: new Date().toISOString().split('T')[0],
        stats: { recipesGenerated: 0, savedMeals: 0, cookingStreak: 0, ingredientsScanned: 0 },
      };
      setUser(newUser);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const forgotPassword = useCallback(async (email) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(r => setTimeout(r, 1000));
      if (!email || !email.includes('@')) throw new Error('Please enter a valid email address.');
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
  }, []);

  const updateUser = useCallback((updates) => {
    setUser(prev => prev ? { ...prev, ...updates } : prev);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      isAuthenticated: !!user,
      login,
      signUp,
      forgotPassword,
      logout,
      updateUser,
      clearError,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
