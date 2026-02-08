/**
 * Axios Instance Configuration
 * Centralized axios setup with token handling
 */

import axios from "axios";

// Get base URL from environment variables
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

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
    
    // Get token from localStorage or context
    // You can modify this to get token from your auth context
    if (typeof window !== "undefined" && requireAuth) {
      const token = localStorage.getItem("token");
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
        // Clear token and redirect to login
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          // You can add redirect logic here if needed
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

