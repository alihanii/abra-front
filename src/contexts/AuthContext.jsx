"use client";

import { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef } from "react";
import { getCookie, setCookie, removeCookie } from "@/lib/utils/cookies";
import { useProfile } from "@/hooks/useApi";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

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

  // Listen for logout events from axios interceptor (401 errors)
  useEffect(() => {
    const handleLogout = () => {
      logoutRef.current();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("auth:logout", handleLogout);
      return () => {
        window.removeEventListener("auth:logout", handleLogout);
      };
    }
  }, []); // Empty dependency array - event listener only added once

  // Fetch user profile when token exists
  const { data: profileData, isLoading: isProfileLoading, error: profileError } = useProfile({
    enabled: !!token && !isLoading,
    retry: false,
  });

  // Update user data when profile is fetched
  useEffect(() => {
    if (profileData) {
      setUser(profileData);
    }
  }, [profileData]);

  // Handle profile fetch errors
  useEffect(() => {
    if (profileError) {
      console.error("Failed to fetch user profile:", profileError);
      // If profile fetch fails (e.g., token expired), clear token
      if (profileError?.response?.status === 401) {
        removeCookie(TOKEN_KEY);
        removeCookie(REFRESH_TOKEN_KEY);
        setToken(null);
        setUser(null);
      }
    }
  }, [profileError]);

  /**
   * Login user
   * @param {string} accessToken - Access token
   * @param {string} refreshToken - Refresh token (optional)
   * @param {Object} userData - User data object (optional, will be fetched from API)
   */
  const login = useCallback(async (accessToken, userData = null, refreshToken = null) => {
    try {
      // Save tokens in cookies (7 days expiry)
      setCookie(TOKEN_KEY, accessToken, { days: 7 });
      if (refreshToken) {
        setCookie(REFRESH_TOKEN_KEY, refreshToken, { days: 30 });
      }
      
      setToken(accessToken);
      
      // Invalidate and refetch profile query to get fresh user data
      try {
        await queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
        const profileResponse = await queryClient.fetchQuery({
          queryKey: ["auth", "profile"],
          queryFn: async () => {
            const { getProfile } = await import("@/lib/api/services/auth");
            return await getProfile();
          },
        });
        
        if (profileResponse) {
          setUser(profileResponse);
        }
      } catch (profileError) {
        console.error("Failed to fetch user profile after login:", profileError);
        // If profile fetch fails, use provided userData as fallback
        if (userData) {
          setUser(userData);
        }
      }
    } catch (error) {
      console.error("Failed to save auth data:", error);
    }
  }, [queryClient]);

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    try {
      removeCookie(TOKEN_KEY);
      removeCookie(REFRESH_TOKEN_KEY);
      setToken(null);
      setUser(null);
      queryClient.removeQueries({ queryKey: ["auth"] });
    } catch (error) {
      console.error("Failed to remove auth data:", error);
    }
  }, [queryClient]);

  // Keep logout function reference for event listener
  const logoutRef = useRef(logout);
  useEffect(() => {
    logoutRef.current = logout;
  }, [logout]);

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

  /**
   * Calculate final loading state
   * Loading is true if:
   * - Initial token check is in progress, OR
   * - We have a token but profile is still loading, OR
   * - We have a token but no user yet (and no error) - profile is being fetched
   */
  const finalIsLoading = useMemo(() => {
    const result = (() => {
      if (isLoading) return { loading: true, reason: 'initial token check' };

      if (token && !user && !profileError) return { loading: true, reason: 'waiting for profile (token exists, no user yet)' };

      if (token && isProfileLoading) return { loading: true, reason: 'profile actively loading' };

      return { loading: false, reason: 'auth check complete' };
    })();

    return result.loading;
  }, [isLoading, token, user, profileError, isProfileLoading]);

  const value = {
    token,
    user,
    isLoading: finalIsLoading,
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
