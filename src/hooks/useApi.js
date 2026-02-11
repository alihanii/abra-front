/**
 * Custom React Query Hooks
 * Example hooks for using API with TanStack Query
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as categoryService from "@/lib/api/services/categories";
import * as productService from "@/lib/api/services/products";
import * as authService from "@/lib/api/services/auth";

// Query Keys - Centralized query key factory
export const queryKeys = {
  categories: {
    all: ["categories"],
    list: (params) => ["categories", "list", params],
  },
  products: {
    all: ["products"],
    list: (params) => ["products", "list", params],
    detail: (slug) => ["products", "detail", slug],
  },
  auth: {
    all: ["auth"],
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

// Product Hooks
export const useProducts = (params = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: () => productService.getProducts(params),
    ...options
  });
};

/**
 * Get product by slug using TanStack Query
 * @param {string} slug - Product slug
 * @param {Object} options - Query options
 * @returns {Object} Query result with product data
 */
export const useProductBySlug = (slug, options = {}) => {
  return useQuery({
    queryKey: queryKeys.products.detail(slug),
    queryFn: () => productService.getProductBySlug(slug),
    enabled: !!slug,
    ...options
  });
};

/**
 * Login mutation using TanStack Query
 * @param {Object} options - Mutation options (onSuccess, onError)
 * @returns {Object} Mutation object with mutate function
 */
export const useLogin = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials) => authService.login(credentials),
    onSuccess: (data, variables, context) => {
      // Invalidate auth queries
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
      
      // Call custom onSuccess if provided
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      // Call custom onError if provided
      if (options.onError) {
        options.onError(error, variables, context);
      }
    },
    ...options
  });
};
