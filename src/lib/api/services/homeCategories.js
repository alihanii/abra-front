/**
 * Home Categories API Service
 * Home page category cards API calls
 */

import { get } from "../http";
import { API_ROUTES } from "@/config/apiRoutes";

/**
 * Get home categories list
 * @param {Object} options - Request options
 * @returns {Promise} Home categories list response
 */
export const getHomeCategories = async (options = {}) => {
  const response = await get(API_ROUTES.HOME_CATEGORIES.LIST, {}, {
    requireAuth: false,
    ...options
  });
  return response.data;
};
