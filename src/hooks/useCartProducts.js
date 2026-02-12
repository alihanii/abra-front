"use client";

import { useMemo } from "react";
import { useCartProductsList } from "@/hooks/useApi";
import {
  getCartFromStorage,
  getUniqueProductIds,
  generateCartItemKey
} from "@/lib/utils/cartStorage";

/**
 * useCartProducts Hook
 * Reads cart data from localStorage, fetches full product details from API,
 * and merges them into complete cart items.
 *
 * @returns {Object} Hydrated cart items, loading state, and error
 */
export function useCartProducts() {
  // Read minimal cart data from localStorage
  const storedItems = useMemo(() => getCartFromStorage(), []);

  // Extract unique product IDs for API call
  const productIds = useMemo(
    () => getUniqueProductIds(storedItems),
    [storedItems]
  );

  // Fetch product details from API
  const {
    data: productsResponse,
    isLoading,
    isError,
    error
  } = useCartProductsList(productIds);

  // Merge API product data with localStorage cart preferences
  const hydratedItems = useMemo(() => {
    if (!productsResponse || !storedItems.length) return [];

    // Normalize API response (handle both array and paginated responses)
    const products = Array.isArray(productsResponse)
      ? productsResponse
      : productsResponse?.results || [];

    // Create a map of products by ID for fast lookup
    const productsMap = new Map();
    products.forEach((product) => {
      productsMap.set(String(product.id), product);
    });

    // Merge each stored cart item with its corresponding product data
    return storedItems
      .map((storedItem) => {
        const product = productsMap.get(String(storedItem.id));
        if (!product) return null; // Product no longer exists

        return {
          id: String(product.id),
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.images?.[0]?.url || "",
          color: storedItem.color,
          size: storedItem.size,
          quantity: storedItem.quantity,
          // Keep full product data for stock checks etc.
          _product: product
        };
      })
      .filter(Boolean);
  }, [productsResponse, storedItems]);

  return {
    items: hydratedItems,
    isLoading,
    isError,
    error,
    hasStoredItems: storedItems.length > 0
  };
}

