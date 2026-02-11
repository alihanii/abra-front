/**
 * Auth API Service
 * Authentication related API calls
 */

import { post } from "../http";
import { API_ROUTES } from "@/config/apiRoutes";

/**
 * Login user
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.phone_number - User phone number
 * @param {string} credentials.password - User password
 * @param {Object} options - Request options
 * @returns {Promise} Login response with access token, refresh token, and user data
 */
export const login = async (credentials, options = {}) => {
  const { phone_number, password } = credentials;
  
  const response = await post(
    API_ROUTES.AUTH.LOGIN,
    {
      phone_number,
      password
    },
    {
      requireAuth: false,
      ...options
    }
  );
  
  return response.data;
};

