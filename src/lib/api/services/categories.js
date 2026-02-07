/**
 * Categories API Service
 * Category related API calls
 */

import { get } from "../http";
import { API_ROUTES } from "@/config/apiRoutes";

/**
 * Get categories list
 * @param {Object} params - Query parameters (page, page_size, etc.)
 * @param {Object} options - Request options
 * @returns {Promise} Categories list response
 */
export const getCategories = async (params = {}, options = {}) => {
  const response = await get(API_ROUTES.CATEGORIES.LIST, params, {
    requireAuth: false,
    ...options
  });
  return response.data;
};
