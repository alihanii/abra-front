"use client";

import { createContext, useContext, useState, useCallback } from "react";

/**
 * Auth Modal Context
 * Manages authentication modal state
 */

const AuthModalContext = createContext(undefined);

/**
 * Auth Modal Provider Component
 * Provides auth modal state and methods to children
 */
export function AuthModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Open auth modal
   */
  const openAuthModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  /**
   * Close auth modal
   */
  const closeAuthModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  /**
   * Toggle auth modal
   */
  const toggleAuthModal = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const value = {
    isOpen,
    openAuthModal,
    closeAuthModal,
    toggleAuthModal
  };

  return <AuthModalContext.Provider value={value}>{children}</AuthModalContext.Provider>;
}

/**
 * Hook to use auth modal context
 * @returns {Object} Auth modal context value
 */
export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (context === undefined) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
}
