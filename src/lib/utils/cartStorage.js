/**
 * Cart Storage Utilities
 * Handles cart persistence in localStorage with minimal data
 */

const STORAGE_KEY = "abraa_cart";

/**
 * Generate a unique key for a cart item based on id, color, and size
 * @param {string} id - Product ID
 * @param {string} color - Selected color
 * @param {string} size - Selected size
 * @returns {string} Unique cart item key
 */
export const generateCartItemKey = (id, color, size) => {
  return `${id}::${color}::${size}`;
};

/**
 * Get cart items from localStorage
 * @returns {Array} Array of minimal cart items [{id, color, size, quantity}]
 */
export const getCartFromStorage = () => {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/**
 * Save cart items to localStorage (minimal data only)
 * @param {Array} items - Full cart items array
 */
export const saveCartToStorage = (items) => {
  if (typeof window === "undefined") return;

  try {
    const minimal = items.map(({ id, color, size, quantity }) => ({
      id,
      color,
      size,
      quantity
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(minimal));
  } catch {
    // Silently fail if localStorage is unavailable
  }
};

/**
 * Clear cart from localStorage
 */
export const clearCartStorage = () => {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silently fail
  }
};

/**
 * Extract unique product IDs from stored cart items
 * @param {Array} storedItems - Items from localStorage
 * @returns {Array<string>} Unique product IDs
 */
export const getUniqueProductIds = (storedItems) => {
  return [...new Set(storedItems.map((item) => item.id))];
};

