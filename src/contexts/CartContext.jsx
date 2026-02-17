"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect
} from "react";
import {
  getCartFromStorage,
  saveCartToStorage,
  clearCartStorage,
  getUniqueProductIds,
  generateCartItemKey,
  decodeSharedCart,
  buildShareCartUrl
} from "@/lib/utils/cartStorage";
import { calculateFinalPrice } from "@/lib/utils/cartPricing";
import { useCartProductsList } from "@/hooks/useApi";

/**
 * Cart Context
 * Manages shopping cart state with localStorage persistence and API hydration
 */
const CartContext = createContext(undefined);

/**
 * Check if two cart entries match by (id, color, size)
 */
const isSameEntry = (a, b) => {
  return (
    String(a.id) === String(b.id) &&
    a.color === b.color &&
    a.size === b.size
  );
};

/**
 * Get available stock for a specific color-size combination
 * @param {Object} product - Full product object from API
 * @param {string} colorName - Selected color display name
 * @param {string} sizeName - Selected size display name
 * @returns {number} Available stock quantity
 */
const getAvailableStock = (product, colorName, sizeName) => {
  if (!product) return 0;

  // Find color key by display name
  const colorKey = Object.keys(product.colors || {}).find(
    (key) => product.colors[key]?.name === colorName
  );

  // Find size key by display name
  const sizeKey = Object.keys(product.sizes || {}).find(
    (key) => product.sizes[key]?.name === sizeName
  );

  if (!colorKey || !sizeKey) return 0;

  const stockKey = `${colorKey}-${sizeKey}`;
  return product.stock?.[stockKey] || 0;
};

/**
 * Cart Provider Component
 * Persists minimal cart data (id, color, size, quantity) to localStorage.
 * On mount, fetches full product details from API and derives display items.
 */
export function CartProvider({ children }) {
  // On mount, check URL for shared cart data and use it if present
  const [cartEntries, setCartEntries] = useState(() => {
    if (typeof window === "undefined") return getCartFromStorage();

    const params = new URLSearchParams(window.location.search);
    const sharedCart = params.get("shared_cart");

    if (sharedCart) {
      const decoded = decodeSharedCart(sharedCart);
      if (decoded.length > 0) {
        // Clean the URL (remove shared_cart param) without reload
        const url = new URL(window.location.href);
        url.searchParams.delete("shared_cart");
        window.history.replaceState({}, "", url.pathname + url.search);

        // Save shared cart to localStorage and use it
        saveCartToStorage(decoded);
        return decoded;
      }
    }

    return getCartFromStorage();
  });

  // Local cache for full item data (populated when user adds items during session)
  const [itemsCache, setItemsCache] = useState({});

  const [isOpen, setIsOpen] = useState(false);

  // Extract unique product IDs for API call
  const productIds = useMemo(
    () => getUniqueProductIds(cartEntries),
    [cartEntries]
  );

  // Fetch full product details from API (enabled only when there are items)
  const { data: productsResponse, isLoading } = useCartProductsList(productIds);

  // Derive full cart items from cartEntries + API data + local cache
  const items = useMemo(() => {
    if (cartEntries.length === 0) return [];

    // Build products map from API response
    const apiProducts = productsResponse
      ? Array.isArray(productsResponse)
        ? productsResponse
        : productsResponse?.results || []
      : [];

    const productsMap = new Map();
    apiProducts.forEach((product) => {
      productsMap.set(String(product.id), product);
    });

    return cartEntries
      .map((entry) => {
        const key = generateCartItemKey(entry.id, entry.color, entry.size);

        // Prefer API data (always up-to-date)
        const product = productsMap.get(String(entry.id));
        if (product) {
          return {
            id: String(product.id),
            slug: product.slug,
            name: product.name,
            price: calculateFinalPrice(product, entry.color, entry.size),
            image: product.images?.[0]?.url || "",
            color: entry.color,
            size: entry.size,
            quantity: entry.quantity,
            _product: product // Full product data for price calculations
          };
        }

        // Fallback to locally cached data (from addItem during this session)
        const cached = itemsCache[key];
        if (cached) {
          return { ...cached, quantity: entry.quantity };
        }

        // No data yet (API still loading)
        return null;
      })
      .filter(Boolean);
  }, [cartEntries, productsResponse, itemsCache]);

  // Hydration is complete when there are no stored items or API data has arrived
  const isHydrated = cartEntries.length === 0 || !!productsResponse;

  // Validate stock when API data arrives: adjust quantities or remove out-of-stock items
  useEffect(() => {
    if (!productsResponse) return;

    const apiProducts = Array.isArray(productsResponse)
      ? productsResponse
      : productsResponse?.results || [];

    if (apiProducts.length === 0) return;

    const productsMap = new Map();
    apiProducts.forEach((product) => {
      productsMap.set(String(product.id), product);
    });

    // Defer state update to next tick to avoid synchronous cascading renders
    const timer = setTimeout(() => {
      setCartEntries((prev) => {
        if (prev.length === 0) return prev;

        let hasChanges = false;

        const adjusted = prev
          .map((entry) => {
            const product = productsMap.get(String(entry.id));

            // Product no longer exists in API — remove from cart
            if (!product) {
              hasChanges = true;
              return null;
            }

            const stock = getAvailableStock(product, entry.color, entry.size);

            // Out of stock — remove from cart
            if (stock <= 0) {
              hasChanges = true;
              return null;
            }

            // Quantity exceeds available stock — reduce to max available
            if (entry.quantity > stock) {
              hasChanges = true;
              return { ...entry, quantity: stock };
            }

            return entry;
          })
          .filter(Boolean);

        return hasChanges ? adjusted : prev;
      });
    }, 0);

    return () => clearTimeout(timer);
  }, [productsResponse]); // Only run when API data changes

  // Sync cartEntries to localStorage on change
  useEffect(() => {
    saveCartToStorage(cartEntries);
  }, [cartEntries]);

  /**
   * Add item to cart
   * If item with same (id, color, size) exists, increase its quantity
   * @param {Object} item - Full cart item {id, slug, name, price, image, color, size, quantity}
   */
  const addItem = useCallback((item) => {
    // Cache full item data for immediate display (before API refetch)
    const key = generateCartItemKey(item.id, item.color, item.size);
    setItemsCache((prev) => ({ ...prev, [key]: item }));

    // Update minimal cart entries
    setCartEntries((prev) => {
      const existingIdx = prev.findIndex((e) => isSameEntry(e, item));

      if (existingIdx !== -1) {
        return prev.map((e, idx) =>
          idx === existingIdx
            ? { ...e, quantity: e.quantity + (item.quantity || 1) }
            : e
        );
      }

      return [
        ...prev,
        {
          id: String(item.id),
          color: item.color,
          size: item.size,
          quantity: item.quantity || 1
        }
      ];
    });
  }, []);

  /**
   * Remove item from cart by (id, color, size)
   * @param {string} itemId - Product ID
   * @param {string} color - Item color
   * @param {string} size - Item size
   */
  const removeItem = useCallback((itemId, color, size) => {
    setCartEntries((prev) =>
      prev.filter((e) => !isSameEntry(e, { id: itemId, color, size }))
    );

    // Clean up cache
    const key = generateCartItemKey(itemId, color, size);
    setItemsCache((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  /**
   * Update item quantity by (id, color, size)
   * @param {string} itemId - Product ID
   * @param {string} color - Item color
   * @param {string} size - Item size
   * @param {number} quantity - New quantity
   */
  const updateQuantity = useCallback(
    (itemId, color, size, quantity) => {
      if (quantity <= 0) {
        removeItem(itemId, color, size);
        return;
      }

      setCartEntries((prev) =>
        prev.map((e) =>
          isSameEntry(e, { id: itemId, color, size })
            ? { ...e, quantity }
            : e
        )
      );
    },
    [removeItem]
  );

  /**
   * Clear all items from cart
   */
  const clearCart = useCallback(() => {
    setCartEntries([]);
    setItemsCache({});
    clearCartStorage();
  }, []);

  /**
   * Open cart drawer
   */
  const openCart = useCallback(() => {
    setIsOpen(true);
  }, []);

  /**
   * Close cart drawer
   */
  const closeCart = useCallback(() => {
    setIsOpen(false);
  }, []);

  /**
   * Toggle cart drawer
   */
  const toggleCart = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  /**
   * Generate a shareable cart link and copy to clipboard
   * @returns {Promise<string>} The shareable URL
   */
  const shareCart = useCallback(async () => {
    const url = buildShareCartUrl(cartEntries);
    if (!url) return "";

    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    return url;
  }, [cartEntries]);

  // Calculate totals
  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shipping = 0; // Free shipping
    const total = subtotal + shipping;

    return {
      subtotal: subtotal.toFixed(2),
      shipping: shipping.toFixed(2),
      total: total.toFixed(2)
    };
  }, [items]);

  // Calculate total items count
  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const value = {
    items,
    isOpen,
    isLoading: !isHydrated && isLoading,
    isHydrated,
    totals,
    totalItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
    shareCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/**
 * Hook to use cart context
 * @returns {Object} Cart context value
 */
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
