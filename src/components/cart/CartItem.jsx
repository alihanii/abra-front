"use client";

import { useMemo, useEffect } from "react";
import { useTranslations } from 'next-intl';
import { useCart } from "@/contexts/CartContext";
import { useProduct } from "@/hooks/useProduct";
import QuantityControl from "@/components/ui/QuantityControl";
import BaseImage from "@/components/ui/BaseImage";
import { container } from "@/lib/styles";

/**
 * Cart Item Component
 * Displays a single cart item with quantity controls and remove option
 *
 * @param {Object} props
 * @param {Object} props.item - Cart item object
 */
export default function CartItem({ item }) {
  const t = useTranslations();
  const { updateQuantity, removeItem } = useCart();

  // Pass full product data if available (from API hydration), otherwise slug
  const productInput = useMemo(() => {
    return item._product || item.slug || item.id || null;
  }, [item._product, item.id, item.slug]);

  // Use useProduct hook - accepts product object or slug string
  const {
    product,
    selectedColor,
    selectedSize,
    selectedColorData,
    selectedSizeData,
    availableStock,
    isInStock,
    finalPrice,
    selectColor,
    selectSize
  } = useProduct(productInput);

  // Find color and size keys from item.color and item.size (display names)
  // and set them in useProduct hook
  useEffect(() => {
    if (!product || !item.color || !item.size) return;

    // Find color key by matching display name
    const colorKey = Object.keys(product.colors || {}).find(
      (key) => product.colors[key]?.name === item.color
    );

    // Find size key by matching display name
    const sizeKey = Object.keys(product.sizes || {}).find(
      (key) => product.sizes[key]?.name === item.size
    );

    // Set color and size if found and different from current selection
    if (colorKey && colorKey !== selectedColor) {
      selectColor(colorKey);
    }
    if (sizeKey && sizeKey !== selectedSize) {
      selectSize(sizeKey);
    }
  }, [product, item.color, item.size, selectedColor, selectedSize, selectColor, selectSize]);

  const handleDecrease = () => {
    updateQuantity(item.id, item.color, item.size, item.quantity - 1);
  };

  const handleIncrease = () => {
    // Limit increase based on available stock
    const maxQuantity =
      product && availableStock !== undefined ? item.quantity + availableStock : item.quantity + 1;
    updateQuantity(item.id, item.color, item.size, Math.min(item.quantity + 1, maxQuantity));
  };

  const handleRemove = () => {
    removeItem(item.id, item.color, item.size);
  };

  // Use finalPrice from useProduct (includes color/size modifiers), fallback to item.price
  const displayPrice = product && finalPrice > 0 ? finalPrice : item.price;
  const maxQuantity = product && availableStock !== undefined ? item.quantity + availableStock : 99;

  return (
    <div className={container}>
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
          <BaseImage
            src={item.image}
            alt={item.name}
            width={96}
            height={96}
            className="rounded-lg"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-1 truncate">{item.name}</h3>

          {/* Product Variants */}
          <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-2">
            {item.size && <span>{t('cart.size')}: {item.size}</span>}
            {item.size && item.color && <span>{t('cart.separator')}</span>}
            {item.color && <span>{t('cart.color')}: {item.color}</span>}
          </div>

          {/* Price and Quantity Controls */}
          <div className="flex items-end gap-2 justify-between flex-col">
            <span className="text-lg font-bold text-gray-900">${displayPrice.toFixed(2)}</span>

            {/* Quantity Controls */}
            <QuantityControl
              value={item.quantity}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              min={1}
              max={maxQuantity}
              size="xs"
            />
          </div>
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all cursor-pointer shrink-0"
          aria-label={t('cart.removeItem')}
        >
          <i className="ri-delete-bin-line text-lg"></i>
        </button>
      </div>
    </div>
  );
}
