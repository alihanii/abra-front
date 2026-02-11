/**
 * Auth API Service
 * Authentication related API calls
 */

import { post, get, patch } from "../http";
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

/**
 * Get user profile
 * @param {Object} options - Request options
 * @returns {Promise} User profile data
 */
export const getProfile = async (options = {}) => {
  const response = await get(
    API_ROUTES.AUTH.PROFILE,
    {},
    {
      requireAuth: true,
      ...options
    }
  );
  
  return response.data;
};

/**
 * Update user profile
 * @param {Object} profileData - Profile data to update
 * @param {string} profileData.full_name - User full name (optional)
 * @param {string} profileData.email - User email (optional)
 * @param {Object} options - Request options
 * @returns {Promise} Updated user profile data
 */
export const updateProfile = async (profileData, options = {}) => {
  const response = await patch(
    API_ROUTES.AUTH.UPDATE_PROFILE,
    profileData,
    {
      requireAuth: true,
      ...options
    }
  );
  
  return response.data;
};

