/**
 * Custom React Query Hooks
 * Example hooks for using API with TanStack Query
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as categoryService from "@/lib/api/services/categories";
import * as productService from "@/lib/api/services/products";
import * as authService from "@/lib/api/services/auth";
import * as bannerService from "@/lib/api/services/banners";
import * as cartService from "@/lib/api/services/cart";
import * as productTemplateService from "@/lib/api/services/productTemplates";
import * as customProductService from "@/lib/api/services/customProducts";
import * as orderService from "@/lib/api/services/orders";
import * as paymentService from "@/lib/api/services/payment";

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
  cart: {
    all: ["cart"],
    products: (ids) => ["cart", "products", ids],
    customProducts: (ids) => ["cart", "customProducts", ids],
    pricing: ["cart", "pricing"],
  },
  auth: {
    all: ["auth"],
    profile: ["auth", "profile"],
  },
  banners: {
    all: ["banners"],
    list: ["banners", "list"],
  },
  productTemplates: {
    all: ["productTemplates"],
    list: (params) => ["productTemplates", "list", params],
  },
  customProducts: {
    all: ["customProducts"],
    create: ["customProducts", "create"],
  },
  orders: {
    all: ["orders"],
    create: ["orders", "create"],
  },
  payment: {
    initiate: ["payment", "initiate"],
  },
};

// Banner Hooks
export const useBanners = (options = {}) => {
  return useQuery({
    queryKey: queryKeys.banners.list,
    queryFn: () => bannerService.getBanners(),
    ...options
  });
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
 * Fetch cart products by array of IDs
 * Used to hydrate cart items from localStorage on page refresh
 * @param {Array<string>} ids - Array of product IDs
 * @param {Object} options - Query options
 * @returns {Object} Query result with products data
 */
export const useCartProductsList = (ids = [], options = {}) => {
  return useQuery({
    queryKey: queryKeys.cart.products(ids),
    queryFn: () => productService.getProducts({ id: ids }),
    enabled: ids.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options
  });
};

/**
 * Fetch custom products by array of IDs (for cart custom items)
 * GET /api/custom-products/?id=35&id=36
 * @param {Array<number>} ids - Array of custom product IDs
 * @param {Object} options - Query options
 * @returns {Object} Query result with results array
 */
export const useCartCustomProductsList = (ids = [], options = {}) => {
  return useQuery({
    queryKey: queryKeys.cart.customProducts(ids),
    queryFn: () => customProductService.getCustomProductsByIds(ids),
    enabled: ids.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options
  });
};

/**
 * Get user profile using TanStack Query
 * @param {Object} options - Query options (enabled, onSuccess, onError)
 * @returns {Object} Query result with profile data
 */
export const useProfile = (options = {}) => {
  return useQuery({
    queryKey: queryKeys.auth.profile,
    queryFn: () => authService.getProfile(),
    ...options
  });
};

/**
 * Update user profile mutation using TanStack Query
 * @param {Object} options - Mutation options (onSuccess, onError)
 * @returns {Object} Mutation object with mutate function
 */
export const useUpdateProfile = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileData) => authService.updateProfile(profileData),
    onSuccess: (data, variables, context) => {
      // Update profile query cache with new data
      queryClient.setQueryData(queryKeys.auth.profile, data);
      // Invalidate auth queries to ensure consistency
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
      // Invalidate auth queries to refetch profile
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

/**
 * Change password mutation using TanStack Query
 * @param {Object} options - Mutation options (onSuccess, onError)
 * @returns {Object} Mutation object with mutate function
 */
export const useChangePassword = (options = {}) => {
  return useMutation({
    mutationFn: (passwordData) => authService.changePassword(passwordData),
    onSuccess: (data, variables, context) => {
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

/**
 * Calculate cart pricing mutation using TanStack Query
 * @param {Object} options - Mutation options (onSuccess, onError)
 * @returns {Object} Mutation object with mutate function
 */
export const useCalculateCartPricing = (options = {}) => {
  return useMutation({
    mutationFn: (cartData) => cartService.calculateCartPricing(cartData),
    onSuccess: (data, variables, context) => {
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

/**
 * Get product templates using TanStack Query
 * @param {Object} params - Query parameters
 * @param {Object} options - Query options
 * @returns {Object} Query result with product templates data
 */
export const useProductTemplates = (params = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.productTemplates.list(params),
    queryFn: () => productTemplateService.getProductTemplates(params),
    ...options
  });
};

/**
 * Create order mutation using TanStack Query
 * @param {Object} options - Mutation options (onSuccess, onError)
 * @returns {Object} Mutation object with mutate/mutateAsync function
 */
export const useCreateOrder = (options = {}) => {
  return useMutation({
    mutationFn: (payload) => orderService.createOrder(payload),
    onSuccess: (data, variables, context) => {
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      if (options.onError) {
        options.onError(error, variables, context);
      }
    },
    ...options
  });
};

/**
 * Initiate payment mutation - creates order and redirects to Zarinpal gateway
 * Response: { payment_url, order_id, invoice_number }
 * @param {Object} options - Mutation options (onSuccess, onError)
 * @returns {Object} Mutation object with mutate/mutateAsync, isPending
 */
export const useInitiatePayment = (options = {}) => {
  return useMutation({
    mutationFn: (payload) => paymentService.initiatePayment(payload),
    onSuccess: (data, variables, context) => {
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      if (options.onError) {
        options.onError(error, variables, context);
      }
    },
    ...options
  });
};

/**
 * Create custom product mutation using TanStack Query
 * @param {Object} options - Mutation options (onSuccess, onError)
 * @returns {Object} Mutation object with mutate function
 */
export const useCreateCustomProduct = (options = {}) => {
  return useMutation({
    mutationFn: (formData) => customProductService.createCustomProduct(formData),
    onSuccess: (data, variables, context) => {
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
