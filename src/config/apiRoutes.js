/**
 * API Routes Configuration
 * Centralized API endpoint names for better maintainability
 */

export const API_ROUTES = {
  // Auth endpoints
  AUTH: {
    LOGIN: "/accounts/login/",
    PROFILE: "/accounts/profile/",
    UPDATE_PROFILE: "/accounts/profile/update/",
    CHANGE_PASSWORD: "/accounts/change-password/",
  },

  // Products endpoints
  PRODUCTS: {
    BASE: "/products",
    LIST: "/products",
    DETAIL: (slug) => `/products/${slug}/`,
    SEARCH: "/products/search",
    FEATURED: "/products/featured",
    BY_CATEGORY: (category) => `/products/category/${category}`,
    RELATED: (id) => `/products/${id}/related`
  },

  // Categories endpoints
  CATEGORIES: {
    BASE: "/categories",
    LIST: "/categories",
  },

  // Cart endpoints
  CART: {
    BASE: "/cart",
    GET: "/cart",
    ADD_ITEM: "/cart/items",
    UPDATE_ITEM: (itemId) => `/cart/items/${itemId}`,
    REMOVE_ITEM: (itemId) => `/cart/items/${itemId}`,
    CLEAR: "/cart/clear",
    APPLY_COUPON: "/cart/coupon"
  },

  // Orders endpoints
  ORDERS: {
    BASE: "/orders",
    LIST: "/orders",
    CREATE: "/orders",
    DETAIL: (id) => `/orders/${id}`,
    CANCEL: (id) => `/orders/${id}/cancel`,
    TRACK: (id) => `/orders/${id}/track`
  },

  // User/Profile endpoints
  USER: {
    BASE: "/user",
    PROFILE: "/user/profile",
    UPDATE_PROFILE: "/user/profile",
    ADDRESSES: "/user/addresses",
    ADD_ADDRESS: "/user/addresses",
    UPDATE_ADDRESS: (id) => `/user/addresses/${id}`,
    DELETE_ADDRESS: (id) => `/user/addresses/${id}`,
    CHANGE_PASSWORD: "/user/change-password"
  },

  // Payment endpoints
  PAYMENT: {
    BASE: "/payment",
    CREATE_INTENT: "/payment/intent",
    CONFIRM: "/payment/confirm",
    METHODS: "/payment/methods"
  },

  // Shipping endpoints
  SHIPPING: {
    BASE: "/shipping",
    CALCULATE: "/shipping/calculate",
    METHODS: "/shipping/methods",
    TRACK: (trackingNumber) => `/shipping/track/${trackingNumber}`
  },

  // Reviews endpoints
  REVIEWS: {
    BASE: "/reviews",
    LIST: (productId) => `/reviews/product/${productId}`,
    CREATE: "/reviews",
    UPDATE: (id) => `/reviews/${id}`,
    DELETE: (id) => `/reviews/${id}`
  },

  // Wishlist endpoints
  WISHLIST: {
    BASE: "/wishlist",
    GET: "/wishlist",
    ADD: "/wishlist",
    REMOVE: (productId) => `/wishlist/${productId}`,
    CLEAR: "/wishlist/clear"
  }
};

