/**
 * Product Templates API Service
 * Product template related API calls
 */

import { get } from "../http";
import { API_ROUTES } from "@/config/apiRoutes";

/**
 * Get product templates list
 * @param {Object} params - Query parameters
 * @param {Object} options - Request options
 * @returns {Promise} Product templates list response
 */
export const getProductTemplates = async (params = {}, options = {}) => {
  const response = await get(API_ROUTES.PRODUCT_TEMPLATES.LIST, params, {
    requireAuth: false,
    ...options
  });
  return response.data;
};

