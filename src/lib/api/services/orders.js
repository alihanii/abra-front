/**
 * Orders API Service
 * Order related API calls
 */

import { get, post } from "../http";
import { API_ROUTES } from "@/config/apiRoutes";

/**
 * Get paginated orders list
 * @param {Object} params - Query params
 * @param {number} [params.page=1] - Page number
 * @param {Object} options - Request options
 * @returns {Promise<{count: number, next: string|null, previous: string|null, results: Array}>}
 */
export const getOrders = async (params = {}, options = {}) => {
  const response = await get(API_ROUTES.ORDERS.LIST, params, {
    requireAuth: true,
    ...options
  });
  return response.data;
};

/**
 * Create order
 * @param {Object} payload - Order payload
 * @param {string} payload.full_name
 * @param {string} payload.phone_number
 * @param {string} payload.postal_code
 * @param {string} payload.address
 * @param {string} [payload.details]
 * @param {Array} payload.items - [{id,color,size,quantity,unit_price}] or [{custom_product_id,quantity,unit_price}]
 * @param {Object} options - Request options
 * @returns {Promise} Order creation response
 */
export const createOrder = async (payload, options = {}) => {
  const response = await post(
    API_ROUTES.ORDERS.CREATE,
    payload,
    { requireAuth: true, ...options }
  );
  return response.data;
};
