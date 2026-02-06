"use client";

import { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { initializeMockUsers } from "@/lib/mockData";

/**
 * Auth Context
 * Manages authentication state and token operations
 */

const AuthContext = createContext(undefined);

/**
 * Token storage key
 */
const TOKEN_KEY = "abra_auth_token";
const USER_KEY = "abra_user_data";

/**
 * Auth Provider Component
 * Provides authentication state and methods to children
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize mock users and load token/user from localStorage on mount
  useEffect(() => {
    try {
      // Initialize mock users for development/testing
      initializeMockUsers();

      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (storedToken) {
        setToken(storedToken);
      }

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse user data:", e);
        }
      }
    } catch (error) {
      console.error("Failed to load auth data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Login user
   * @param {string} authToken - Authentication token
   * @param {Object} userData - User data object
   */
  const login = useCallback((authToken, userData) => {
    try {
      localStorage.setItem(TOKEN_KEY, authToken);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      setToken(authToken);
      setUser(userData);
    } catch (error) {
      console.error("Failed to save auth data:", error);
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error("Failed to remove auth data:", error);
    }
  }, []);

  /**
   * Update user data
   * @param {Object} userData - Updated user data
   */
  const updateUser = useCallback(
    (userData) => {
      try {
        const updatedUser = { ...user, ...userData };
        localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
        setUser(updatedUser);
      } catch (error) {
        console.error("Failed to update user data:", error);
      }
    },
    [user]
  );

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = useMemo(() => {
    return !!token && !!user;
  }, [token, user]);

  const value = {
    token,
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 * @returns {Object} Auth context value
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
