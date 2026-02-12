/**
 * Banners API Service
 * Banner/slider related API calls
 */

import { get } from "../http";
import { API_ROUTES } from "@/config/apiRoutes";

/**
 * Get banners list
 * @param {Object} options - Request options
 * @returns {Promise} Banners list response
 */
export const getBanners = async (options = {}) => {
  const response = await get(API_ROUTES.BANNERS.LIST, {}, {
    requireAuth: false,
    ...options
  });
  return response.data;
};

