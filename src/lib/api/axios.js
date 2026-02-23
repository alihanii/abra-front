/**
 * Axios Instance Configuration
 * Centralized axios setup with token handling
 */

import axios from "axios";
import { getCookie, removeCookie } from "@/lib/utils/cookies";

// Get base URL from environment variables
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Create axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json"
  }
});

// Request interceptor to add token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get requireAuth from config (default: true)
    const requireAuth = config._requireAuth !== false;
    
    // Get token from cookies
    if (typeof window !== "undefined" && requireAuth) {
      const token = getCookie("abra_auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // Remove custom property before sending request
    delete config._requireAuth;
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Token expired or invalid
      if (error.response.status === 401) {
        // Clear token from cookies
        if (typeof window !== "undefined") {
          removeCookie("abra_auth_token");
          removeCookie("abra_refresh_token");
          
          // Dispatch logout event to trigger logout in AuthContext
          window.dispatchEvent(new CustomEvent("auth:logout", { 
            detail: { reason: "unauthorized" } 
          }));
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

