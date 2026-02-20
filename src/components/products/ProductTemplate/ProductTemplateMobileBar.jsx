"use client";

import { useTranslations } from "next-intl";
import BaseButton from "@/components/ui/BaseButton";
import { cn } from "@/lib/utils";

/**
 * ProductTemplateMobileBar Component
 * Mobile bottom bar for product template page
 *
 * @param {Object} props
 * @param {Object} props.template - Product template data
 * @param {string} props.selectedSize - Selected size
 * @param {Object} props.selectedSizeData - Selected size data
 * @param {number} props.quantity - Current quantity
 * @param {number} props.finalPrice - Final price
 * @param {boolean} props.isInStock - Whether item is in stock
 * @param {Function} props.onAddToCart - Callback when add to cart is clicked
 */
export default function ProductTemplateMobileBar({
    template,
    selectedSize,
    selectedSizeData,
    quantity,
    finalPrice,
    isInStock,
    onAddToCart
}) {
    const t = useTranslations();

    if (!template) return null;

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <p className="text-xs text-gray-500 mb-1">{t("designStudio.price")}</p>
                        <p className="text-xl font-bold text-gray-900">${finalPrice.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1">{t("designStudio.size")}</p>
                        <p className="text-sm font-semibold text-gray-900 uppercase">
                            {selectedSizeData?.name || selectedSize || "—"}
                        </p>
                    </div>
                </div>
                <BaseButton
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={onAddToCart}
                    disabled={!isInStock || !selectedSize}
                >
                    <i className="ri-shopping-cart-line mr-2"></i>
                    {isInStock ? t("designStudio.addToCart") : t("designStudio.outOfStock")}
                </BaseButton>
                <div className="h-2" />
            </div>
        </div>
    );
}

