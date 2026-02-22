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
  getCustomCartFromStorage,
  saveCustomCartToStorage,
  clearCustomCartStorage,
  getUniqueProductIds,
  getUniqueCustomProductIds,
  generateCartItemKey,
  decodeSharedCart,
  decodeSharedCustomCart,
  buildShareCartUrl
} from "@/lib/utils/cartStorage";
import { calculateFinalPrice } from "@/lib/utils/cartPricing";
import { useCartProductsList, useCartCustomProductsList } from "@/hooks/useApi";

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
    String(a.color) === String(b.color) &&
    String(a.size) === String(b.size)
  );
};

/**
 * Get available stock for a specific color-size combination
 * @param {Object} product - Full product object from API
 * @param {string|number} colorIdOrName - Selected color id (or legacy display name)
 * @param {string|number} sizeIdOrName - Selected size id (or legacy display name)
 * @returns {number} Available stock quantity
 */
const getAvailableStock = (product, colorIdOrName, sizeIdOrName) => {
  if (!product) return 0;

  // Find color key by id first, then fallback to display name (legacy)
  const colorKey = Object.keys(product.colors || {}).find(
    (key) =>
      String(product.colors[key]?.id) === String(colorIdOrName) ||
      product.colors[key]?.name === colorIdOrName
  );

  // Find size key by id first, then fallback to display name (legacy)
  const sizeKey = Object.keys(product.sizes || {}).find(
    (key) =>
      String(product.sizes[key]?.id) === String(sizeIdOrName) ||
      product.sizes[key]?.name === sizeIdOrName
  );

  if (!colorKey || !sizeKey) return 0;

  const stockKey = `${colorKey}-${sizeKey}`;
  return product.stock?.[stockKey] || 0;
};

/**
 * Get available stock for a custom product (template_stock keyed by color_key-size_key)
 * @param {Object} product - Custom product from API (color_key, size_key, template_stock)
 * @returns {number} Available stock quantity
 */
const getAvailableStockCustom = (product) => {
  if (!product?.template_stock || product.color_key == null || product.size_key == null)
    return 0;
  const stockKey = `${product.color_key}-${product.size_key}`;
  return Number(product.template_stock[stockKey]) || 0;
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

  // Custom products cart: [{ custom_product_id, quantity }]
  const [cartCustomEntries, setCartCustomEntries] = useState(() => {
    if (typeof window === "undefined") return getCustomCartFromStorage();

    const params = new URLSearchParams(window.location.search);
    const sharedCustomCart = params.get("shared_custom_cart");

    if (sharedCustomCart) {
      const decoded = decodeSharedCustomCart(sharedCustomCart);
      if (decoded.length > 0) {
        const url = new URL(window.location.href);
        url.searchParams.delete("shared_custom_cart");
        window.history.replaceState({}, "", url.pathname + url.search);
        saveCustomCartToStorage(decoded);
        return decoded;
      }
    }

    return getCustomCartFromStorage();
  });

  // Local cache for full item data (populated when user adds items during session)
  const [itemsCache, setItemsCache] = useState({});

  const [isOpen, setIsOpen] = useState(false);

  // Extract unique product IDs for API call
  const productIds = useMemo(
    () => getUniqueProductIds(cartEntries),
    [cartEntries]
  );
  const customProductIds = useMemo(
    () => getUniqueCustomProductIds(cartCustomEntries),
    [cartCustomEntries]
  );

  // Fetch full product details from API (enabled only when there are items)
  const { data: productsResponse, isLoading } = useCartProductsList(productIds);
  const { data: customProductsResponse, isLoading: isCustomProductsLoading } =
    useCartCustomProductsList(customProductIds);

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

  // Derive full custom cart items from cartCustomEntries + API data
  const customItems = useMemo(() => {
    if (cartCustomEntries.length === 0) return [];

    const apiResults = customProductsResponse?.results ?? [];
    const customProductsMap = new Map(
      apiResults.map((p) => [Number(p.id), p])
    );

    return cartCustomEntries
      .map((entry) => {
        const product = customProductsMap.get(entry.custom_product_id);
        if (!product) return null;

        const price = parseFloat(product.price) || 0;
        const image =
          product.custom_image_front?.[0]?.url ||
          product.custom_image_behind?.[0]?.url ||
          "";

        const availableStock = getAvailableStockCustom(product);

        return {
          id: String(product.id),
          custom_product_id: product.id,
          name: product.name || "Custom",
          price,
          image,
          size: product.size_name || "",
          color: product.color_name || "",
          quantity: entry.quantity,
          availableStock,
          _product: product
        };
      })
      .filter(Boolean);
  }, [cartCustomEntries, customProductsResponse]);

  // Hydration is complete when there are no stored items or API data has arrived
  const isHydrated =
    (cartEntries.length === 0 || !!productsResponse) &&
    (cartCustomEntries.length === 0 || !!customProductsResponse);

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

  // Validate custom product stock when API data arrives: adjust quantities or remove out-of-stock
  useEffect(() => {
    if (!customProductsResponse?.results?.length) return;

    const customProductsMap = new Map(
      customProductsResponse.results.map((p) => [Number(p.id), p])
    );

    const timer = setTimeout(() => {
      setCartCustomEntries((prev) => {
        if (prev.length === 0) return prev;

        let hasChanges = false;

        const adjusted = prev
          .map((entry) => {
            const product = customProductsMap.get(entry.custom_product_id);

            if (!product) {
              hasChanges = true;
              return null;
            }

            const stock = getAvailableStockCustom(product);

            if (stock <= 0) {
              hasChanges = true;
              return null;
            }

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
  }, [customProductsResponse]);

  // Sync cartEntries to localStorage on change
  useEffect(() => {
    saveCartToStorage(cartEntries);
  }, [cartEntries]);

  // Sync cartCustomEntries to localStorage on change
  useEffect(() => {
    saveCustomCartToStorage(cartCustomEntries);
  }, [cartCustomEntries]);

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
   * Add custom product to cart
   * @param {Object} item - { custom_product_id, quantity }
   */
  const addCustomItem = useCallback((item) => {
    const customProductId = Number(item.custom_product_id);
    const quantity = Number(item.quantity) || 1;

    setCartCustomEntries((prev) => {
      const existingIdx = prev.findIndex(
        (e) => e.custom_product_id === customProductId
      );
      if (existingIdx !== -1) {
        return prev.map((e, idx) =>
          idx === existingIdx
            ? { ...e, quantity: e.quantity + quantity }
            : e
        );
      }
      return [...prev, { custom_product_id: customProductId, quantity }];
    });
  }, []);

  /**
   * Remove custom product from cart by custom_product_id
   */
  const removeCustomItem = useCallback((customProductId) => {
    setCartCustomEntries((prev) =>
      prev.filter((e) => e.custom_product_id !== Number(customProductId))
    );
  }, []);

  /**
   * Update custom product quantity
   */
  const updateCustomQuantity = useCallback((customProductId, quantity) => {
    if (quantity <= 0) {
      removeCustomItem(customProductId);
      return;
    }
    setCartCustomEntries((prev) =>
      prev.map((e) =>
        e.custom_product_id === Number(customProductId)
          ? { ...e, quantity }
          : e
      )
    );
  }, [removeCustomItem]);

  /**
   * Clear all items from cart (regular + custom)
   */
  const clearCart = useCallback(() => {
    setCartEntries([]);
    setCartCustomEntries([]);
    setItemsCache({});
    clearCartStorage();
    clearCustomCartStorage();
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
   * Generate a shareable cart link and copy to clipboard (includes regular + custom cart)
   * @returns {Promise<string>} The shareable URL
   */
  const shareCart = useCallback(async () => {
    const url = buildShareCartUrl(cartEntries, cartCustomEntries);
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
  }, [cartEntries, cartCustomEntries]);

  // Calculate totals (regular + custom items)
  const totals = useMemo(() => {
    const regularSubtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const customSubtotal = customItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const subtotal = regularSubtotal + customSubtotal;
    const shipping = 0; // Free shipping
    const total = subtotal + shipping;

    return {
      subtotal: subtotal.toFixed(2),
      shipping: shipping.toFixed(2),
      total: total.toFixed(2)
    };
  }, [items, customItems]);

  // Calculate total items count (regular + custom)
  const totalItems = useMemo(() => {
    const regular = items.reduce((sum, item) => sum + item.quantity, 0);
    const custom = customItems.reduce((sum, item) => sum + item.quantity, 0);
    return regular + custom;
  }, [items, customItems]);

  const value = {
    items,
    customItems,
    isOpen,
    isLoading: !isHydrated && (isLoading || isCustomProductsLoading),
    isHydrated,
    totals,
    totalItems,
    addItem,
    addCustomItem,
    removeItem,
    removeCustomItem,
    updateQuantity,
    updateCustomQuantity,
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
