'use client';

import { createContext, useContext, useState, useCallback, useMemo } from 'react';

/**
 * Cart Context
 * Manages shopping cart state and operations
 */

const CartContext = createContext(undefined);

/**
 * Mock initial cart items for development/testing
 */
const MOCK_CART_ITEMS = [
  {
    id: 'cart-item-1',
    name: 'Classic Black Hoodie',
    price: 45.99,
    image: 'https://readdy.ai/api/search-image?query=Premium%20black%20hoodie%20front%20view%20mockup%20on%20clean%20white%20background%2C%20minimalist%20product%20photography%2C%20soft%20natural%20lighting%2C%20professional%20e-commerce%20style%2C%20centered%20composition%2C%20high%20resolution%2C%20modern%20casual%20wear%2C%20cotton%20fabric%20texture%20visible%2C%20no%20wrinkles%2C%20studio%20shot%2C%20commercial%20photography&width=400&height=500&seq=cart1&orientation=portrait',
    size: 'L',
    color: 'Black',
    quantity: 1,
  },
  {
    id: 'cart-item-2',
    name: 'Couple Hoodies Set',
    price: 79.99,
    image: 'https://readdy.ai/api/search-image?query=Two%20matching%20navy%20blue%20hoodies%20side%20by%20side%20on%20clean%20white%20background%2C%20couple%20matching%20set%2C%20minimalist%20product%20photography%2C%20soft%20natural%20lighting%2C%20professional%20e-commerce%20style%2C%20centered%20composition%2C%20high%20resolution%2C%20modern%20casual%20wear&width=400&height=500&seq=cart2&orientation=portrait',
    size: 'M/L',
    color: 'Navy',
    quantity: 1,
  },
];

/**
 * Cart Provider Component
 * Provides cart state and methods to children
 * 
 * Note: MOCK_CART_ITEMS are initialized for development/testing purposes.
 * Remove MOCK_CART_ITEMS and use empty array [] in production.
 */
export function CartProvider({ children }) {
  // Initialize with mock items for development/testing
  // TODO: Change to useState([]) for production
  const [items, setItems] = useState(MOCK_CART_ITEMS);
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Add item to cart
   * @param {Object} item - Cart item object
   */
  const addItem = useCallback((item) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (i) => i.id === item.id && i.size === item.size && i.color === item.color
      );

      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id && i.size === item.size && i.color === item.color
            ? { ...i, quantity: i.quantity + (item.quantity || 1) }
            : i
        );
      }

      return [...prevItems, { ...item, quantity: item.quantity || 1 }];
    });
  }, []);

  /**
   * Remove item from cart
   * @param {string} itemId - Item ID to remove
   */
  const removeItem = useCallback((itemId) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  }, []);

  /**
   * Update item quantity
   * @param {string} itemId - Item ID
   * @param {number} quantity - New quantity
   */
  const updateQuantity = useCallback((itemId, quantity) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);

  /**
   * Clear all items from cart
   */
  const clearCart = useCallback(() => {
    setItems([]);
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

  // Calculate totals
  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shipping = subtotal > 0 ? 0 : 0; // Free shipping
    const total = subtotal + shipping;

    return {
      subtotal: subtotal.toFixed(2),
      shipping: shipping.toFixed(2),
      total: total.toFixed(2),
    };
  }, [items]);

  // Calculate total items count
  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const value = {
    items,
    isOpen,
    totals,
    totalItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
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
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

