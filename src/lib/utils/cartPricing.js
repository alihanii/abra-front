/**
 * Cart Pricing Utilities
 * Handles price calculations for cart items based on color and size selections
 */

/**
 * Calculate final price for a product based on selected color and size
 * @param {Object} product - Full product object from API
 * @param {string} colorName - Selected color display name
 * @param {string} sizeName - Selected size display name
 * @returns {number} Final calculated price
 */
export const calculateFinalPrice = (product, colorName, sizeName) => {
  if (!product) return 0;

  // Get base price from product
  let basePrice = product.price || 0;

  // Find color key by display name
  const colorKey = Object.keys(product.colors || {}).find(
    (key) => product.colors[key]?.name === colorName
  );

  // If color has specific price, use it instead of base price
  if (colorKey && product.colors[colorKey]?.price !== undefined) {
    basePrice = product.colors[colorKey].price;
  }

  // Find size key by display name
  const sizeKey = Object.keys(product.sizes || {}).find(
    (key) => product.sizes[key]?.name === sizeName
  );

  // Apply size price modifier if it exists
  if (sizeKey && product.sizes[sizeKey]?.priceModifier !== undefined) {
    const modifier = product.sizes[sizeKey].priceModifier || 0;
    basePrice = basePrice + modifier;
  }

  // Ensure price is not negative
  return Math.max(0, basePrice);
};

/**
 * Calculate original price (before discount) for a product based on selected color and size
 * @param {Object} product - Full product object from API
 * @param {string} colorName - Selected color display name
 * @param {string} sizeName - Selected size display name
 * @returns {number|null} Original price or null if no original price exists
 */
export const calculateOriginalPrice = (product, colorName, sizeName) => {
  if (!product) return null;

  // Get base original price from product
  let baseOriginalPrice = product.originalPrice || null;

  // Find color key by display name
  const colorKey = Object.keys(product.colors || {}).find(
    (key) => product.colors[key]?.name === colorName
  );

  // If color has specific original price, use it
  if (colorKey && product.colors[colorKey]?.originalPrice !== undefined) {
    baseOriginalPrice = product.colors[colorKey].originalPrice;
  }

  // Find size key by display name
  const sizeKey = Object.keys(product.sizes || {}).find(
    (key) => product.sizes[key]?.name === sizeName
  );

  // Apply size price modifier to original price if it exists
  if (
    baseOriginalPrice &&
    sizeKey &&
    product.sizes[sizeKey]?.priceModifier !== undefined
  ) {
    const modifier = product.sizes[sizeKey].priceModifier || 0;
    baseOriginalPrice = baseOriginalPrice + modifier;
  }

  return baseOriginalPrice;
};

