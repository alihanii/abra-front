"use client";

/**
 * TanStack Query Provider
 * Wraps the app with QueryClientProvider for React Query
 */

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/api/queryClient";

export function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

