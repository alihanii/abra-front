"use client";

import { useMemo, useEffect } from "react";
import { useTranslations } from 'next-intl';
import { useCart } from "@/contexts/CartContext";
import { useProduct } from "@/hooks/useProduct";
import QuantityControl from "@/components/ui/QuantityControl";
import BaseImage from "@/components/ui/BaseImage";
import { container } from "@/lib/styles";
import { formatPrice } from "@/lib/utils/formatPrice";

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

  // Find color and size keys from item.color (id) and item.size (id)
  // and set them in useProduct hook
  useEffect(() => {
    if (!product || !item.color || !item.size) return;

    // Find color key by id first, then fallback to display name (legacy)
    const colorKey = Object.keys(product.colors || {}).find(
      (key) =>
        String(product.colors[key]?.id) === String(item.color) ||
        product.colors[key]?.name === item.color
    );

    // Find size key by id first, then fallback to display name (legacy)
    const sizeKey = Object.keys(product.sizes || {}).find(
      (key) =>
        String(product.sizes[key]?.id) === String(item.size) ||
        product.sizes[key]?.name === item.size
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

  // Resolve color display name from product (item.color is id)
  const colorDisplayName = useMemo(() => {
    if (!item.color) return null;
    if (!product?.colors) return item.color;
    const colorKey = Object.keys(product.colors).find(
      (k) =>
        String(product.colors[k]?.id) === String(item.color) ||
        product.colors[k]?.name === item.color
    );
    return product.colors?.[colorKey]?.name ?? item.color;
  }, [product, item.color]);

  // Resolve size display name from product (item.size is id)
  const sizeDisplayName = useMemo(() => {
    if (!item.size) return null;
    if (!product?.sizes) return item.size;
    const sizeKey = Object.keys(product.sizes).find(
      (k) =>
        String(product.sizes[k]?.id) === String(item.size) ||
        product.sizes[k]?.name === item.size
    );
    return product.sizes?.[sizeKey]?.name ?? item.size;
  }, [product, item.size]);

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
          <h3 className="font-semibold text-gray-900 mb-1 truncate text-sm md:text-base">{item.name}</h3>

          {/* Product Variants */}
          <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-2">
            {sizeDisplayName && <span className="text-sm">{t('cart.size')}: {sizeDisplayName}</span>}
            {sizeDisplayName && colorDisplayName && <span className="hidden md:block">{t('cart.separator')}</span>}
            {colorDisplayName && (
              <span className="text-sm">{t('cart.color')}: {colorDisplayName}</span>
            )}
          </div>

          {/* Price and Quantity Controls */}
          <div className="flex md:items-center items-end md:gap-10 gap-1 flex-col md:flex-row justify-between absolute left-6 md:bottom-6 bottom-5 ">

            {/* Quantity Controls */}
            <QuantityControl
              value={item.quantity}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              min={1}
              max={maxQuantity}
              size="xs"
            />
            <span className="text-sm md:text-lg font-bold text-gray-900">{formatPrice(displayPrice)}</span>
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
