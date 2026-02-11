"use client";

import { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { getCookie, setCookie, removeCookie } from "@/lib/utils/cookies";

/**
 * Auth Context
 * Manages authentication state and token operations
 */

const AuthContext = createContext(undefined);

/**
 * Token storage key
 */
const TOKEN_KEY = "abra_auth_token";
const REFRESH_TOKEN_KEY = "abra_refresh_token";

/**
 * Auth Provider Component
 * Provides authentication state and methods to children
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token from cookies on mount
  useEffect(() => {
    try {
      const storedToken = getCookie(TOKEN_KEY);

      if (storedToken) {
        setToken(storedToken);
      }
    } catch (error) {
      console.error("Failed to load auth data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Login user
   * @param {string} accessToken - Access token
   * @param {string} refreshToken - Refresh token (optional)
   * @param {Object} userData - User data object
   */
  const login = useCallback((accessToken, userData, refreshToken = null) => {
    try {
      // Save tokens in cookies (7 days expiry)
      setCookie(TOKEN_KEY, accessToken, { days: 7 });
      if (refreshToken) {
        setCookie(REFRESH_TOKEN_KEY, refreshToken, { days: 30 });
      }
      
      setToken(accessToken);
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
      removeCookie(TOKEN_KEY);
      removeCookie(REFRESH_TOKEN_KEY);
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
