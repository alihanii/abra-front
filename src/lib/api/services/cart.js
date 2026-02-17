/**
 * Cart API Service
 * Cart related API calls
 */

import { post } from "../http";
import { API_ROUTES } from "@/config/apiRoutes";

/**
 * Calculate cart pricing
 * @param {Object} cartData - Cart items data
 * @param {Array} cartData.items - Array of cart items with id, color, size, quantity, unit_price
 * @param {Object} options - Request options
 * @returns {Promise} Pricing summary response
 */
export const calculateCartPricing = async (cartData, options = {}) => {
  const response = await post(
    API_ROUTES.CART.CALCULATE,
    cartData,
    {
      requireAuth: false,
      ...options
    }
  );
  
  return response.data;
};

