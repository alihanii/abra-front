/**
 * Custom Products API Service
 * Custom product related API calls
 */

import { get } from "../http";
import axiosInstance from "../axios";
import { API_ROUTES } from "@/config/apiRoutes";

/**
 * Create a custom product
 * @param {FormData} formData - Form data with template_type, color, size, and images
 * @param {Object} options - Request options
 * @returns {Promise} Custom product response
 */
/**
 * Get custom products by IDs (for cart hydration)
 * @param {Array<number>} ids - Custom product IDs
 * @param {Object} options - Request options
 * @returns {Promise} Response with results array
 */
export const getCustomProductsByIds = async (ids = [], options = {}) => {
  if (!ids.length) return { results: [], count: 0 };

  const response = await get(
    API_ROUTES.CUSTOM_PRODUCTS.LIST,
    { id: ids },
    { requireAuth: false, ...options }
  );

  return response.data;
};

export const createCustomProduct = async (formData, options = {}) => {
  const response = await axiosInstance.post(
    "/custom-products/create/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        ...options.headers
      },
      _requireAuth: true,
      ...options
    }
  );
  
  return response.data;
};

