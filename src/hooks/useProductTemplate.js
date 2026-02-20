"use client";

import { useState, useMemo, useEffect } from "react";

/**
 * useProductTemplate Hook
 * Composable hook for product template data and state management
 *
 * @param {Object} templateData - Product template data object from API
 * @returns {Object} Template data and state management functions
 */
export function useProductTemplate(templateData) {
  // Get default color key
  const getDefaultColorKey = () => {
    if (!templateData) return null;
    const firstColorKey = Object.keys(templateData.colors || {})[0];
    return firstColorKey || null;
  };

  // Get default size key
  const getDefaultSizeKey = () => {
    if (!templateData) return null;
    const firstSizeKey = Object.keys(templateData.sizes || {})[0];
    return firstSizeKey || null;
  };

  // Initialize state with lazy initialization
  const [selectedColor, setSelectedColor] = useState(() => getDefaultColorKey());
  const [selectedSize, setSelectedSize] = useState(() => getDefaultSizeKey());
  const [quantity, setQuantity] = useState(1);
  const [selectedView, setSelectedView] = useState("front"); // "front" or "behind"
  const [frontImage, setFrontImage] = useState(null); // Uploaded front image
  const [behindImage, setBehindImage] = useState(null); // Uploaded behind image
  const [frontImageSize, setFrontImageSize] = useState(100); // Image size percentage (10-100)
  const [behindImageSize, setBehindImageSize] = useState(100); // Image size percentage (10-100)
  const [frontImagePosition, setFrontImagePosition] = useState({ x: 50, y: 50 }); // Position in percentage
  const [behindImagePosition, setBehindImagePosition] = useState({ x: 50, y: 50 }); // Position in percentage

  // Update defaults when template changes
  useEffect(() => {
    if (templateData) {
      const defaultColor = getDefaultColorKey();
      const defaultSize = getDefaultSizeKey();

      // Reset selections when template changes
      setSelectedColor(defaultColor);
      setSelectedSize(defaultSize);
      setQuantity(1);
      setSelectedView("front");
      // Reset images when template changes
      setFrontImage(null);
      setBehindImage(null);
      setFrontImageSize(100);
      setBehindImageSize(100);
      setFrontImagePosition({ x: 50, y: 50 });
      setBehindImagePosition({ x: 50, y: 50 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateData?.type]); // Only depend on template type to avoid infinite loops

  // Get selected color data
  const selectedColorData = useMemo(() => {
    if (!templateData || !selectedColor) return null;
    return templateData.colors?.[selectedColor] || null;
  }, [templateData, selectedColor]);

  // Get selected size data
  const selectedSizeData = useMemo(() => {
    if (!templateData || !selectedSize) return null;
    return templateData.sizes?.[selectedSize] || null;
  }, [templateData, selectedSize]);

  // Get available stock for selected color-size combination
  const availableStock = useMemo(() => {
    if (!templateData || !selectedColor || !selectedSize) return 0;
    const stockKey = `${selectedColor}-${selectedSize}`;
    return templateData.stock?.[stockKey] || 0;
  }, [templateData, selectedColor, selectedSize]);

  // Check if selected combination is in stock
  const isInStock = useMemo(() => {
    return availableStock > 0;
  }, [availableStock]);

  // Get current template image based on selected view
  const currentTemplateImage = useMemo(() => {
    if (!templateData) return null;
    return selectedView === "front" 
      ? templateData.imageFront 
      : templateData.imageBehind;
  }, [templateData, selectedView]);

  // Calculate final price based on selected color and size
  const finalPrice = useMemo(() => {
    if (!templateData) return 0;

    // Get base price from color or default
    let basePrice = 0;
    if (selectedColor && templateData.colors?.[selectedColor]?.price !== undefined) {
      basePrice = templateData.colors[selectedColor].price;
    }

    // Apply size modifier
    if (selectedSize && templateData.sizes?.[selectedSize]?.priceModifier !== undefined) {
      const modifier = templateData.sizes[selectedSize].priceModifier || 0;
      basePrice = basePrice + modifier;
    }

    return Math.max(0, basePrice); // Ensure price is not negative
  }, [templateData, selectedColor, selectedSize]);

  // Calculate original price with modifiers
  const originalPrice = useMemo(() => {
    if (!templateData) return null;

    let baseOriginalPrice = null;
    if (selectedColor && templateData.colors?.[selectedColor]?.originalPrice !== undefined) {
      baseOriginalPrice = templateData.colors[selectedColor].originalPrice;
    }

    // Apply size modifier
    if (baseOriginalPrice && selectedSize && templateData.sizes?.[selectedSize]?.priceModifier !== undefined) {
      const modifier = templateData.sizes[selectedSize].priceModifier || 0;
      baseOriginalPrice = baseOriginalPrice + modifier;
    }

    return baseOriginalPrice;
  }, [templateData, selectedColor, selectedSize]);

  // Calculate discount amount
  const discountAmount = useMemo(() => {
    if (!originalPrice || originalPrice <= finalPrice) return null;
    return (originalPrice - finalPrice).toFixed(2);
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
    if (templateData?.colors?.[colorKey]?.available) {
      setSelectedColor(colorKey);
      // Reset quantity to 1 when color changes
      setQuantity(1);
    }
  };

  // Select size
  const selectSize = (sizeKey) => {
    if (templateData?.sizes?.[sizeKey]?.available) {
      setSelectedSize(sizeKey);
      // Reset quantity to 1 when size changes
      setQuantity(1);
    }
  };

  // Select view (front or behind)
  const selectView = (view) => {
    if (view === "front" || view === "behind") {
      setSelectedView(view);
    }
  };

  // Handle image upload
  const handleImageUpload = (file, view) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target.result;
      if (view === "front") {
        setFrontImage(imageUrl);
      } else {
        setBehindImage(imageUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  // Remove uploaded image
  const removeImage = (view) => {
    if (view === "front") {
      setFrontImage(null);
      setFrontImageSize(100);
      setFrontImagePosition({ x: 50, y: 50 });
    } else {
      setBehindImage(null);
      setBehindImageSize(100);
      setBehindImagePosition({ x: 50, y: 50 });
    }
  };

  // Update image size
  const updateImageSize = (view, size) => {
    const clampedSize = Math.max(10, Math.min(100, size));
    if (view === "front") {
      setFrontImageSize(clampedSize);
    } else {
      setBehindImageSize(clampedSize);
    }
  };

  // Update image position
  const updateImagePosition = (view, position) => {
    if (view === "front") {
      setFrontImagePosition(position);
    } else {
      setBehindImagePosition(position);
    }
  };

  // Get current uploaded image based on view
  const currentUploadedImage = useMemo(() => {
    return selectedView === "front" ? frontImage : behindImage;
  }, [selectedView, frontImage, behindImage]);

  // Get current image size based on view
  const currentImageSize = useMemo(() => {
    return selectedView === "front" ? frontImageSize : behindImageSize;
  }, [selectedView, frontImageSize, behindImageSize]);

  // Get current image position based on view
  const currentImagePosition = useMemo(() => {
    return selectedView === "front" ? frontImagePosition : behindImagePosition;
  }, [selectedView, frontImagePosition, behindImagePosition]);

  return {
    template: templateData,
    selectedColor,
    selectedSize,
    selectedColorData,
    selectedSizeData,
    quantity,
    availableStock,
    isInStock,
    finalPrice,
    originalPrice,
    discountAmount,
    selectedView,
    currentTemplateImage,
    frontImage,
    behindImage,
    currentUploadedImage,
    frontImageSize,
    behindImageSize,
    currentImageSize,
    frontImagePosition,
    behindImagePosition,
    currentImagePosition,
    increaseQuantity,
    decreaseQuantity,
    selectColor,
    selectSize,
    selectView,
    handleImageUpload,
    removeImage,
    updateImageSize,
    updateImagePosition
  };
}

