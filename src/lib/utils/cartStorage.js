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

/**
 * Encode cart entries into a URL-safe string for sharing
 * @param {Array} entries - Minimal cart entries [{id, color, size, quantity}]
 * @returns {string} Base64-encoded cart string
 */
export const encodeCartForShare = (entries) => {
  if (!entries || entries.length === 0) return "";

  try {
    const minimal = entries.map(({ id, color, size, quantity }) => ({
      i: id,
      c: color,
      s: size,
      q: quantity
    }));
    const json = JSON.stringify(minimal);
    return btoa(unescape(encodeURIComponent(json)));
  } catch {
    return "";
  }
};

/**
 * Decode a shared cart string back into cart entries
 * @param {string} encoded - Base64-encoded cart string
 * @returns {Array} Cart entries [{id, color, size, quantity}] or empty array
 */
export const decodeSharedCart = (encoded) => {
  if (!encoded) return [];

  try {
    const json = decodeURIComponent(escape(atob(encoded)));
    const parsed = JSON.parse(json);

    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item) => item.i && item.c && item.s && item.q > 0)
      .map((item) => ({
        id: String(item.i),
        color: item.c,
        size: item.s,
        quantity: Number(item.q) || 1
      }));
  } catch {
    return [];
  }
};

/**
 * Build a shareable cart URL from current cart entries
 * @param {Array} entries - Minimal cart entries
 * @returns {string} Full shareable URL
 */
export const buildShareCartUrl = (entries) => {
  if (typeof window === "undefined") return "";

  const encoded = encodeCartForShare(entries);
  if (!encoded) return "";

  const url = new URL(window.location.origin);
  url.searchParams.set("shared_cart", encoded);
  return url.toString();
};

