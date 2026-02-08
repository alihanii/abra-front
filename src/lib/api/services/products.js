/**
 * Products API Service
 * Product related API calls
 */

import { get } from "../http";
import { API_ROUTES } from "@/config/apiRoutes";

/**
 * Build query parameters for products API
 * Handles array parameters (color, size) and other filters
 * @param {Object} params - Filter parameters
 * @returns {Object} Formatted query parameters
 */
const buildProductsQueryParams = (params = {}) => {
  const queryParams = {};

  // Category filter
  if (params.category && params.category !== "all") {
    queryParams.category = params.category;
  }

  // Color filter (array)
  if (params.color && params.color !== "all") {
    queryParams.color = Array.isArray(params.color) ? params.color : [params.color];
  }

  // Size filter (array)
  if (params.size && params.size !== "all") {
    queryParams.size = Array.isArray(params.size) ? params.size : [params.size];
  }

  // Price filters
  if (params.min_price !== undefined && params.min_price !== null) {
    queryParams.min_price = params.min_price;
  }
  if (params.max_price !== undefined && params.max_price !== null) {
    queryParams.max_price = params.max_price;
  }

  // Search
  if (params.search && params.search.trim()) {
    queryParams.search = params.search.trim();
  }

  // ID/Slug filter
  if (params.id) {
    queryParams.id = params.id;
  }

  // Sorting
  if (params.order_by) {
    queryParams.order_by = params.order_by;
  }
  if (params.order) {
    queryParams.order = params.order;
  }

  // Pagination
  if (params.page) {
    queryParams.page = params.page;
  }
  if (params.page_size) {
    queryParams.page_size = Math.min(params.page_size, 100); // Max 100
  }

  return queryParams;
};

/**
 * Get products list
 * @param {Object} params - Query parameters
 * @param {string} params.category - Category slug filter
 * @param {string|Array<string>} params.color - Color filter(s)
 * @param {string|Array<string>} params.size - Size filter(s)
 * @param {number} params.min_price - Minimum price
 * @param {number} params.max_price - Maximum price
 * @param {string} params.search - Search query
 * @param {string} params.id - Product ID/slug filter
 * @param {string} params.order_by - Sort field (price, name, created_at)
 * @param {string} params.order - Sort direction (asc, desc)
 * @param {number} params.page - Page number
 * @param {number} params.page_size - Items per page (max: 100)
 * @param {Object} options - Request options
 * @returns {Promise} Products list response
 */
export const getProducts = async (params = {}, options = {}) => {
  const queryParams = buildProductsQueryParams(params);
  const response = await get(API_ROUTES.PRODUCTS.LIST, queryParams, {
    requireAuth: false,
    ...options
  });
  return response.data;
};

/**
 * Get product by slug
 * @param {string} slug - Product slug
 * @param {Object} options - Request options
 * @returns {Promise} Product detail response
 */
export const getProductBySlug = async (slug, options = {}) => {
  const response = await get(API_ROUTES.PRODUCTS.DETAIL(slug), {}, {
    requireAuth: false,
    ...options
  });
  return response.data;
};

