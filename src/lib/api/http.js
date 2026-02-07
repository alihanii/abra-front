/**
 * HTTP Request Functions
 * Wrapper functions for common HTTP methods with token support
 */

import axiosInstance from "./axios";
import qs from "qs";

/**
 * GET request
 * @param {string} url - API endpoint
 * @param {Object} params - Query parameters
 * @param {Object} options - Request options (requireAuth, headers)
 * @returns {Promise} Axios response
 */
export const get = async (url, params = {}, options = {}) => {
  const { requireAuth = true, headers = {} } = options;
  return axiosInstance.get(url, {
    params,
    paramsSerializer: (params) => {
      // Use qs to serialize arrays as ?key=value1&key=value2
      return qs.stringify(params, {
        arrayFormat: 'repeat', // ?color=black&color=white
        skipNulls: true, // Skip null values
        encode: true
      });
    },
    headers,
    _requireAuth: requireAuth // Custom property for interceptor
  });
};

/**
 * POST request
 * @param {string} url - API endpoint
 * @param {Object} data - Request body
 * @param {Object} options - Request options (requireAuth, headers)
 * @returns {Promise} Axios response
 */
export const post = async (url, data = {}, options = {}) => {
  const { requireAuth = true, headers = {} } = options;
  return axiosInstance.post(url, data, {
    headers,
    _requireAuth: requireAuth // Custom property for interceptor
  });
};

/**
 * PUT request
 * @param {string} url - API endpoint
 * @param {Object} data - Request body
 * @param {Object} options - Request options (requireAuth, headers)
 * @returns {Promise} Axios response
 */
export const put = async (url, data = {}, options = {}) => {
  const { requireAuth = true, headers = {} } = options;
  return axiosInstance.put(url, data, {
    headers,
    _requireAuth: requireAuth // Custom property for interceptor
  });
};

/**
 * PATCH request
 * @param {string} url - API endpoint
 * @param {Object} data - Request body
 * @param {Object} options - Request options (requireAuth, headers)
 * @returns {Promise} Axios response
 */
export const patch = async (url, data = {}, options = {}) => {
  const { requireAuth = true, headers = {} } = options;
  return axiosInstance.patch(url, data, {
    headers,
    _requireAuth: requireAuth // Custom property for interceptor
  });
};

/**
 * DELETE request
 * @param {string} url - API endpoint
 * @param {Object} options - Request options (requireAuth, headers)
 * @returns {Promise} Axios response
 */
export const del = async (url, options = {}) => {
  const { requireAuth = true, headers = {} } = options;
  return axiosInstance.delete(url, {
    headers,
    _requireAuth: requireAuth // Custom property for interceptor
  });
};

// Export delete as both 'del' and 'delete' for convenience
export { del as delete };

