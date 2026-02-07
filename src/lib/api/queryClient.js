/**
 * TanStack Query Client Configuration
 * Query client setup with default options
 */

import { QueryClient } from "@tanstack/react-query";

// Default query options
const defaultQueryOptions = {
  queries: {
    // Stale time: data is considered fresh for 5 minutes
    staleTime: 1000 * 60 * 5,
    // Cache time: unused data stays in cache for 10 minutes
    gcTime: 1000 * 60 * 10,
    // Retry failed requests 3 times
    retry: 3,
    // Retry delay increases exponentially
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // Refetch on window focus
    refetchOnWindowFocus: false,
    // Refetch on reconnect
    refetchOnReconnect: true,
    // Don't refetch on mount if data exists
    refetchOnMount: true
  },
  mutations: {
    // Retry failed mutations once
    retry: 1,
    // Retry delay
    retryDelay: 1000
  }
};

// Create query client instance
export const queryClient = new QueryClient({
  defaultOptions: defaultQueryOptions
});

