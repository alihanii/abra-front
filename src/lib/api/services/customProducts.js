/**
 * Custom Products API Service
 * Custom product related API calls
 */

import axiosInstance from "../axios";

/**
 * Create a custom product
 * @param {FormData} formData - Form data with template_type, color, size, and images
 * @param {Object} options - Request options
 * @returns {Promise} Custom product response
 */
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

