/**
 * Cart Storage Utilities
 * Handles cart persistence in localStorage with minimal data
 */

const STORAGE_KEY = "abraa_cart";
const CUSTOM_STORAGE_KEY = "abraa_cart_custom";

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
 * @param {Array} customEntries - Optional custom cart entries [{ custom_product_id, quantity }]
 * @returns {string} Full shareable URL
 */
export const buildShareCartUrl = (entries, customEntries = []) => {
  if (typeof window === "undefined") return "";

  const encoded = encodeCartForShare(entries);
  const customEncoded = encodeCustomCartForShare(customEntries);
  if (!encoded && !customEncoded) return "";

  const url = new URL(window.location.origin);
  if (encoded) url.searchParams.set("shared_cart", encoded);
  if (customEncoded) url.searchParams.set("shared_custom_cart", customEncoded);
  return url.toString();
};

// --- Custom cart (custom products) storage ---

/**
 * Get custom cart items from localStorage
 * @returns {Array} [{ custom_product_id, quantity }]
 */
export const getCustomCartFromStorage = () => {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(CUSTOM_STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item) => item?.custom_product_id != null && Number(item?.quantity) > 0)
      .map((item) => ({
        custom_product_id: Number(item.custom_product_id),
        quantity: Number(item.quantity) || 1
      }));
  } catch {
    return [];
  }
};

/**
 * Save custom cart items to localStorage
 * @param {Array} items - [{ custom_product_id, quantity }]
 */
export const saveCustomCartToStorage = (items) => {
  if (typeof window === "undefined") return;

  try {
    const minimal = items.map(({ custom_product_id, quantity }) => ({
      custom_product_id,
      quantity
    }));
    localStorage.setItem(CUSTOM_STORAGE_KEY, JSON.stringify(minimal));
  } catch {
    // Silently fail
  }
};

/**
 * Clear custom cart from localStorage
 */
export const clearCustomCartStorage = () => {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(CUSTOM_STORAGE_KEY);
  } catch {
    // Silently fail
  }
};

/**
 * Extract unique custom product IDs from stored custom cart items
 * @param {Array} storedItems - [{ custom_product_id, quantity }]
 * @returns {Array<number>} Unique custom product IDs
 */
export const getUniqueCustomProductIds = (storedItems) => {
  return [...new Set(storedItems.map((item) => item.custom_product_id).filter(Boolean))];
};

/**
 * Encode custom cart entries for URL sharing
 * @param {Array} entries - [{ custom_product_id, quantity }]
 * @returns {string} Base64-encoded string
 */
export const encodeCustomCartForShare = (entries) => {
  if (!entries || entries.length === 0) return "";

  try {
    const minimal = entries.map(({ custom_product_id, quantity }) => ({
      id: custom_product_id,
      q: quantity
    }));
    const json = JSON.stringify(minimal);
    return btoa(unescape(encodeURIComponent(json)));
  } catch {
    return "";
  }
};

/**
 * Decode shared custom cart string back into entries
 * @param {string} encoded - Base64-encoded string
 * @returns {Array} [{ custom_product_id, quantity }]
 */
export const decodeSharedCustomCart = (encoded) => {
  if (!encoded) return [];

  try {
    const json = decodeURIComponent(escape(atob(encoded)));
    const parsed = JSON.parse(json);

    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item) => item?.id != null && item?.q > 0)
      .map((item) => ({
        custom_product_id: Number(item.id),
        quantity: Number(item.q) || 1
      }));
  } catch {
    return [];
  }
};

