'use client';

import { createContext, useContext, useState, useCallback } from 'react';

/**
 * Profile Context
 * Manages profile drawer state and operations
 */

const ProfileContext = createContext(undefined);

/**
 * Profile Provider Component
 * Provides profile drawer state and methods to children
 */
export function ProfileProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Open profile drawer
   */
  const openProfile = useCallback(() => {
    setIsOpen(true);
  }, []);

  /**
   * Close profile drawer
   */
  const closeProfile = useCallback(() => {
    setIsOpen(false);
  }, []);

  /**
   * Toggle profile drawer
   */
  const toggleProfile = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const value = {
    isOpen,
    openProfile,
    closeProfile,
    toggleProfile,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

/**
 * Hook to use profile context
 * @returns {Object} Profile context value
 */
export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}

