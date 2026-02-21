"use client";

import { useTranslations } from "next-intl";
import BaseButton from "@/components/ui/BaseButton";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils/formatPrice";

/**
 * ProductMobileBar Component
 * Mobile bottom bar for product page with price and add to cart
 *
 * @param {Object} props
 * @param {Object} props.product - Product data object
 * @param {string} props.selectedSize - Selected size key
 * @param {Object} props.selectedSizeData - Selected size data object
 * @param {number} props.quantity - Current quantity
 * @param {number} props.finalPrice - Final calculated price
 * @param {boolean} props.isInStock - Whether selected combination is in stock
 * @param {Function} props.onAddToCart - Callback when add to cart is clicked
 * @param {string} props.className - Additional CSS classes
 */
export default function ProductMobileBar({
  product,
  selectedSize,
  selectedSizeData,
  quantity,
  finalPrice,
  isInStock,
  onAddToCart,
  className
}) {
  const t = useTranslations();

  if (!product) return null;

  return (
    <div
      className={cn(
        "lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl",
        className
      )}
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-gray-600">{t("product.totalPrice")}</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatPrice(finalPrice ?? product.price)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-600">{t("product.size")}: {selectedSizeData?.name || t("product.notAvailable")}</p>
            <p className="text-sm text-gray-700">{t("product.quantity")}: {quantity}</p>
          </div>
        </div>
        <BaseButton
          onClick={onAddToCart}
          variant="primary"
          size="lg"
          fullWidth
          className="active:scale-[0.98]"
          disabled={!isInStock}
        >
          <i className="ri-shopping-cart-line text-xl"></i>
          <span>{!isInStock ? t("product.outOfStock") : t("product.addToCart")}</span>
        </BaseButton>
        <div className="h-2"></div>
      </div>
    </div>
  );
}
