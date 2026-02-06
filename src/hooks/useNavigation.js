"use client";

import { usePathname } from "next/navigation";
import { useCallback } from "react";
import { isActiveRoute } from "@/config/routes";

/**
 * Custom hook for navigation logic
 * Provides active route detection and navigation utilities
 */
export function useNavigation() {
  const pathname = usePathname();

  /**
   * Check if a route is currently active
   * @param {string} routePath - Route path to check
   * @returns {boolean}
   */
  const checkActiveRoute = useCallback(
    (routePath) => {
      return isActiveRoute(pathname, routePath);
    },
    [pathname]
  );

  /**
   * Get active route class names
   * @param {string} routePath - Route path to check
   * @param {string} activeClass - Class to apply when active
   * @param {string} defaultClass - Default class
   * @returns {string}
   */
  const getRouteClassName = useCallback(
    (routePath, activeClass = "text-gray-900 font-semibold", defaultClass = "text-gray-700") => {
      return checkActiveRoute(routePath) ? activeClass : defaultClass;
    },
    [checkActiveRoute]
  );

  return {
    pathname,
    checkActiveRoute,
    getRouteClassName
  };
}
