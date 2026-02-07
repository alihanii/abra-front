/**
 * Custom React Query Hooks
 * Example hooks for using API with TanStack Query
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as categoryService from "@/lib/api/services/categories";

// Query Keys - Centralized query key factory
export const queryKeys = {
  categories: {
    all: ["categories"],
    list: (params) => ["categories", "list", params],
  },
};

// Category Hooks
export const useCategories = (params = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.categories.list(params),
    queryFn: () => categoryService.getCategories(params),
    ...options
  });
};
