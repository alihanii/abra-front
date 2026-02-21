/**
 * Payment API Service
 * Payment initiation and related API calls
 */

import { post } from "../http";
import { API_ROUTES } from "@/config/apiRoutes";

/**
 * Initiate payment - creates order and returns Zarinpal gateway URL
 * @param {Object} payload - Order payload (same as order creation)
 * @param {string} payload.full_name
 * @param {string} payload.phone_number
 * @param {string} payload.postal_code
 * @param {string} payload.address
 * @param {string} [payload.details]
 * @param {Array} payload.items - [{id,color,size,quantity,unit_price}] or [{custom_product_id,quantity,unit_price}]
 * @param {Object} options - Request options
 * @returns {Promise<{payment_url: string, order_id: number, invoice_number: string}>}
 */
export const initiatePayment = async (payload, options = {}) => {
  const response = await post(
    API_ROUTES.PAYMENT.INITIATE,
    payload,
    { requireAuth: true, ...options }
  );
  return response.data;
};
