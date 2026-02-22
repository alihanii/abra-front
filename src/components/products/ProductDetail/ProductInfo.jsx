"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import BaseButton from "@/components/ui/BaseButton";
import QuantityControl from "@/components/ui/QuantityControl";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils/formatPrice";

/**
 * ProductInfo Component
 * Displays product information, variants, and add to cart functionality
 *
 * @param {Object} props
 * @param {Object} props.product - Product data object
 * @param {string} props.selectedColor - Selected color key
 * @param {string} props.selectedSize - Selected size key
 * @param {number} props.quantity - Current quantity
 * @param {Function} props.onColorSelect - Callback when color is selected
 * @param {Function} props.onSizeSelect - Callback when size is selected
 * @param {Function} props.onQuantityIncrease - Callback when quantity increases
 * @param {Function} props.onQuantityDecrease - Callback when quantity decreases
 * @param {Function} props.onAddToCart - Callback when add to cart is clicked
 * @param {boolean} props.isMobile - Whether to hide desktop add to cart button
 * @param {string} props.className - Additional CSS classes
 */
export default function ProductInfo({
  product,
  selectedColor,
  selectedSize,
  quantity,
  availableStock,
  isInStock,
  finalPrice,
  originalPrice,
  discountAmount,
  onColorSelect,
  onSizeSelect,
  onQuantityIncrease,
  onQuantityDecrease,
  onAddToCart,
  isMobile = false,
  className
}) {
  // Get selected color and size data
  const selectedColorData = useMemo(() => {
    if (!product || !selectedColor) return null;
    return product.colors?.[selectedColor] || null;
  }, [product, selectedColor]);

  const selectedSizeData = useMemo(() => {
    if (!product || !selectedSize) return null;
    return product.sizes?.[selectedSize] || null;
  }, [product, selectedSize]);

  const t = useTranslations();

  // Check if there's a discount
  const hasDiscount = originalPrice && originalPrice > finalPrice;

  if (!product) return null;

  return (
    <div className={cn("bg-white rounded-2xl p-6 lg:p-8 shadow-sm", className)}>
      {/* Title */}
      <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">{product.name}</h1>

      {/* Price */}
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-3xl font-bold text-gray-900">
          {formatPrice(finalPrice ?? product.price)}
        </span>
        {hasDiscount && discountAmount && (
          <>
            <span className="text-xl text-gray-500 line-through">{formatPrice(originalPrice)}</span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
              {t("product.saveAmount", { amount: formatPrice(discountAmount) })}
            </span>
          </>
        )}
      </div>

      {/* Description */}
      {product.description && (
        <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>
      )}

      {/* Color Selection */}
      {product.colors && Object.keys(product.colors).length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            {t("product.color")}: {selectedColorData?.id || t("product.selectColor")}
          </label>
          <div className="flex gap-3">
            {Object.entries(product.colors).map(([key, color]) => {
              // Check if this color has any available stock with any size
              const hasStock =
                product.stock &&
                Object.keys(product.stock).some(
                  (stockKey) => stockKey.startsWith(`${key}-`) && product.stock[stockKey] > 0
                );

              return (
                <BaseButton
                  key={key}
                  onClick={() => onColorSelect?.(key)}
                  title={color.name}
                  disabled={!hasStock}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-12 h-12 !rounded-lg !p-0 border-2 relative",
                    selectedColor === key
                      ? "border-gray-900 scale-105"
                      : "border-gray-300 hover:border-gray-500",
                    !hasStock && "opacity-50"
                  )}
                  style={{ backgroundColor: color.value }}
                  aria-label={`${t("product.selectColor")} ${color.name}${!hasStock ? ` (${t("product.outOfStock")})` : ""}`}
                >
                  {!hasStock && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <i className="ri-close-line text-white text-lg drop-shadow-lg"></i>
                    </span>
                  )}
                </BaseButton>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {product.sizes && Object.keys(product.sizes).length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-3">{t("product.size")}</label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(product.sizes).map(([key, size]) => {
              // Check if this size has stock for selected color
              const stockKey = selectedColor ? `${selectedColor}-${key}` : null;
              const sizeStock = stockKey && product.stock ? product.stock[stockKey] || 0 : 0;
              const hasStock = sizeStock > 0;

              return (
                <BaseButton
                  key={key}
                  onClick={() => onSizeSelect?.(key)}
                  disabled={selectedColor ? !hasStock : false}
                  variant={selectedSize === key ? "primary" : "outline"}
                  size="xs"
                  className={cn(
                    "!rounded-lg px-6 py-3 whitespace-nowrap relative",
                    selectedColor && !hasStock && "opacity-50"
                  )}
                  aria-label={`${t("product.size")} ${size.name}${selectedColor && !hasStock ? ` (${t("product.outOfStock")})` : ""}`}
                >
                  {size.name}
                  {/* {selectedColor && hasStock && (
                    <span className="ml-2 text-xs opacity-75">({sizeStock})</span>
                  )}
                  {selectedColor && !hasStock && (
                    <span className="absolute top-1 right-1 text-xs">×</span>
                  )} */}
                </BaseButton>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity Selection */}
      {selectedColor && selectedSize && (
        <div className="mb-6">
          {/* <label className="block text-sm font-semibold text-gray-900 mb-3">
            Quantity {availableStock > 0 && (
              <span className="text-xs font-normal text-gray-500">
                ({availableStock} available)
              </span>
            )}
          </label> */}
          {/* <div className="flex items-center gap-3">
            <QuantityControl
              value={quantity}
              onIncrease={onQuantityIncrease}
              onDecrease={onQuantityDecrease}
              min={1}
              max={availableStock}
              size="lg"
              disabled={!isInStock}
            />
          </div> */}
          {!isInStock && (
            <p className="text-sm text-red-600 mt-2">
              <i className="ri-error-warning-line mr-1"></i>
              {t("product.combinationOutOfStock")}
            </p>
          )}
        </div>
      )}

      {/* Add to Cart Button (Desktop) */}
      {!isMobile && (
        <BaseButton
          onClick={onAddToCart}
          variant="primary"
          size="lg"
          fullWidth
          className="hidden lg:flex"
          disabled={!isInStock || !selectedColor || !selectedSize}
        >
          <i className="ri-shopping-cart-line text-xl"></i>
          <span>{!isInStock ? t("product.outOfStock") : t("product.addToCart")}</span>
        </BaseButton>
      )}

      {/* Features List */}
      {product.features && product.features.length > 0 && (
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4">{t("product.whatsIncluded")}:</h3>
          <ul className="space-y-3">
            {product.features.map((feature, index) => (
              <li
                key={index}
                className="flex items-start gap-3"
              >
                <i className="ri-checkbox-circle-fill text-green-600 text-xl shrink-0 mt-0.5"></i>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
