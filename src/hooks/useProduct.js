"use client";

import { useState, useMemo, useEffect } from "react";
import { getProductBySlug } from "@/lib/mockProducts";
import { useCart } from "@/contexts/CartContext";

/**
 * useProduct Hook
 * Composable hook for product data and state management
 *
 * @param {string|Object} slugOrProduct - Product slug (string) or product data object
 * @returns {Object} Product data and state management functions
 */
export function useProduct(slugOrProduct) {
  const { items } = useCart();

  // Get product data - accept either slug (string) or product object
  const product = useMemo(() => {
    // If product object is provided, use it directly
    console.log('123', slugOrProduct);

    if (slugOrProduct && typeof slugOrProduct === 'object') {
      return slugOrProduct;
    }
    // If slug is provided, fetch from mock data
    if (slugOrProduct && typeof slugOrProduct === 'string') {
      return getProductBySlug(slugOrProduct);
    }
    // Return null if neither is provided
    return null;
  }, [slugOrProduct]);

  // Get default color key
  const getDefaultColorKey = () => {
    if (!product) return null;
    const firstColorKey = Object.keys(product.colors || {})[0];
    return firstColorKey || null;
  };

  // Get default size key
  const getDefaultSizeKey = () => {
    if (!product) return null;
    const firstSizeKey = Object.keys(product.sizes || {})[0];
    return firstSizeKey || null;
  };

  // Initialize state with lazy initialization
  const [selectedColor, setSelectedColor] = useState(() => getDefaultColorKey());
  const [selectedSize, setSelectedSize] = useState(() => getDefaultSizeKey());
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Update defaults when product changes
  useEffect(() => {
    if (product) {
      const defaultColor = getDefaultColorKey();
      const defaultSize = getDefaultSizeKey();

      // Only set if not already set
      if (defaultColor && !selectedColor) {
        setSelectedColor(defaultColor);
      }
      if (defaultSize && !selectedSize) {
        setSelectedSize(defaultSize);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]); // Only depend on product ID to avoid infinite loops

  // Get selected color data
  const selectedColorData = useMemo(() => {
    if (!product || !selectedColor) return null;
    return product.colors?.[selectedColor] || null;
  }, [product, selectedColor]);

  // Get selected size data
  const selectedSizeData = useMemo(() => {
    if (!product || !selectedSize) return null;
    return product.sizes?.[selectedSize] || null;
  }, [product, selectedSize]);

  // Get available stock for selected color-size combination
  const baseStock = useMemo(() => {
    if (!product || !selectedColor || !selectedSize) return 0;
    const stockKey = `${selectedColor}-${selectedSize}`;
    return product.stock?.[stockKey] || 0;
  }, [product, selectedColor, selectedSize]);

  // Calculate quantity in cart for this specific combination
  const quantityInCart = useMemo(() => {
    if (!product || !selectedColor || !selectedSize) return 0;
    const itemId = `${product.id}-${selectedColor}-${selectedSize}`;
    const cartItem = items.find((item) => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  }, [product, selectedColor, selectedSize, items]);

  // Calculate remaining stock (base stock - quantity in cart)
  const availableStock = useMemo(() => {
    return Math.max(0, baseStock - quantityInCart);
  }, [baseStock, quantityInCart]);

  // Check if selected combination is in stock
  const isInStock = useMemo(() => {
    return availableStock > 0;
  }, [availableStock]);

  // Get current image
  const currentImage = useMemo(() => {
    if (!product || !product.images || product.images.length === 0) return null;
    return product.images[selectedImageIndex] || product.images[0];
  }, [product, selectedImageIndex]);

  // Calculate final price based on selected color and size
  const finalPrice = useMemo(() => {
    if (!product) return 0;

    // Get base price from color or product default
    let basePrice = product.price || 0;
    let baseOriginalPrice = product.originalPrice || null;

    // If color has specific price, use it
    if (selectedColor && product.colors?.[selectedColor]?.price !== undefined) {
      basePrice = product.colors[selectedColor].price;
      baseOriginalPrice = product.colors[selectedColor].originalPrice || null;
    }

    // Apply size modifier
    if (selectedSize && product.sizes?.[selectedSize]?.priceModifier !== undefined) {
      const modifier = product.sizes[selectedSize].priceModifier || 0;
      basePrice = basePrice + modifier;
      // Also apply modifier to original price if it exists
      if (baseOriginalPrice) {
        baseOriginalPrice = baseOriginalPrice + modifier;
      }
    }

    return Math.max(0, basePrice); // Ensure price is not negative
  }, [product, selectedColor, selectedSize]);

  // Calculate original price with modifiers
  const originalPrice = useMemo(() => {
    if (!product) return null;

    let basePrice = product.price || 0;
    let baseOriginalPrice = product.originalPrice || null;

    // If color has specific price, use it
    if (selectedColor && product.colors?.[selectedColor]?.price !== undefined) {
      basePrice = product.colors[selectedColor].price;
      baseOriginalPrice = product.colors[selectedColor].originalPrice || null;
    }

    // Apply size modifier
    if (selectedSize && product.sizes?.[selectedSize]?.priceModifier !== undefined) {
      const modifier = product.sizes[selectedSize].priceModifier || 0;
      if (baseOriginalPrice) {
        baseOriginalPrice = baseOriginalPrice + modifier;
      }
    }

    return baseOriginalPrice;
  }, [product, selectedColor, selectedSize]);

  // Calculate discount amount
  const discountAmount = useMemo(() => {
    if (!originalPrice || originalPrice <= finalPrice) return null;
    return (originalPrice - finalPrice).toFixed(2);
  }, [originalPrice, finalPrice]);

  // Calculate discount percentage
  const discountPercentage = useMemo(() => {
    if (!originalPrice || originalPrice <= finalPrice) return 0;
    return Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
  }, [originalPrice, finalPrice]);

  // Increase quantity (limited by available stock)
  const increaseQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, availableStock));
  };

  // Decrease quantity
  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  // Select color
  const selectColor = (colorKey) => {
    if (product?.colors?.[colorKey]?.available) {
      setSelectedColor(colorKey);
      // Reset quantity to 1 when color changes
      setQuantity(1);
    }
  };

  // Select size
  const selectSize = (sizeKey) => {
    if (product?.sizes?.[sizeKey]?.available) {
      setSelectedSize(sizeKey);
      // Reset quantity to 1 when size changes
      setQuantity(1);
    }
  };

  // Select image
  const selectImage = (index) => {
    if (product?.images && index >= 0 && index < product.images.length) {
      setSelectedImageIndex(index);
    }
  };

  // Reset selections
  const resetSelections = () => {
    const firstColorKey = Object.keys(product?.colors || {})[0];
    const firstSizeKey = Object.keys(product?.sizes || {})[0];
    setSelectedColor(firstColorKey || null);
    setSelectedSize(firstSizeKey || null);
    setSelectedImageIndex(0);
    setQuantity(1);
  };

  return {
    product,
    selectedColor,
    selectedSize,
    selectedColorData,
    selectedSizeData,
    selectedImageIndex,
    currentImage,
    quantity,
    availableStock,
    isInStock,
    finalPrice,
    originalPrice,
    discountAmount,
    discountPercentage,
    increaseQuantity,
    decreaseQuantity,
    selectColor,
    selectSize,
    selectImage,
    resetSelections
  };
}
