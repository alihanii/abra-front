"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import BaseButton from "@/components/ui/BaseButton";
import QuantityControl from "@/components/ui/QuantityControl";
import { cn } from "@/lib/utils";

/**
 * ProductTemplateInfo Component
 * Displays product template information, variants, and add to cart functionality
 *
 * @param {Object} props
 * @param {Object} props.template - Product template data object
 * @param {Array} props.templates - Array of all available templates
 * @param {number} props.selectedTemplateIndex - Currently selected template index
 * @param {Function} props.onTemplateSelect - Callback when template is selected
 * @param {string} props.selectedColor - Selected color key
 * @param {string} props.selectedSize - Selected size key
 * @param {number} props.quantity - Current quantity
 * @param {number} props.availableStock - Available stock
 * @param {boolean} props.isInStock - Whether item is in stock
 * @param {number} props.finalPrice - Final price
 * @param {number} props.originalPrice - Original price
 * @param {string} props.discountAmount - Discount amount
 * @param {string} props.selectedView - Current view: "front" or "behind"
 * @param {Function} props.onColorSelect - Callback when color is selected
 * @param {Function} props.onSizeSelect - Callback when size is selected
 * @param {Function} props.onQuantityIncrease - Callback when quantity increases
 * @param {Function} props.onQuantityDecrease - Callback when quantity decreases
 * @param {Function} props.onViewSelect - Callback when view is selected
 * @param {Function} props.onAddToCart - Callback when add to cart is clicked
 * @param {boolean} props.isMobile - Whether to hide desktop add to cart button
 * @param {string} props.className - Additional CSS classes
 */
export default function ProductTemplateInfo({
    template,
    templates = [],
    selectedTemplateIndex = 0,
    onTemplateSelect,
    selectedColor,
    selectedSize,
    quantity,
    availableStock,
    isInStock,
    finalPrice,
    originalPrice,
    discountAmount,
    selectedView,
    onColorSelect,
    onSizeSelect,
    onQuantityIncrease,
    onQuantityDecrease,
    onViewSelect,
    onAddToCart,
    isMobile = false,
    className
}) {
    const t = useTranslations();

    // Get selected color and size data
    const selectedColorData = useMemo(() => {
        if (!template || !selectedColor) return null;
        return template.colors?.[selectedColor] || null;
    }, [template, selectedColor]);

    const selectedSizeData = useMemo(() => {
        if (!template || !selectedSize) return null;
        return template.sizes?.[selectedSize] || null;
    }, [template, selectedSize]);

    // Get available colors
    const availableColors = useMemo(() => {
        if (!template || !template.colors) return [];
        return Object.entries(template.colors)
            .filter(([_, color]) => color.available)
            .map(([key, color]) => ({ key, ...color }));
    }, [template]);

    // Get available sizes
    const availableSizes = useMemo(() => {
        if (!template || !template.sizes) return [];
        return Object.entries(template.sizes)
            .filter(([_, size]) => size.available)
            .map(([key, size]) => ({ key, ...size }));
    }, [template]);

    // Check if there's a discount
    const hasDiscount = originalPrice && originalPrice > finalPrice;

    if (!template) return null;

    return (
        <div className={cn("bg-white rounded-2xl p-6 lg:p-8 shadow-sm", className)} dir="rtl">
            {/* Template Selector */}
            {templates.length > 1 && (
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                        {t("designStudio.selectTemplate")}
                    </label>
                    <div className="flex flex-wrap gap-3">
                        {templates.map((templateItem, index) => (
                            <BaseButton
                                key={templateItem.type}
                                onClick={() => onTemplateSelect?.(index)}
                                variant={selectedTemplateIndex === index ? "primary" : "outline"}
                                size="sm"
                                className="capitalize"
                            >
                                {templateItem.type}
                            </BaseButton>
                        ))}
                    </div>
                </div>
            )}

            {/* Type/Title */}
            {/* <div className="mb-4">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 capitalize">
                    {template.type}
                </h1>
            </div> */}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
                <span className="text-lg lg:text-xl font-bold text-gray-900">
                    ${finalPrice.toFixed(2)}
                </span>
                {hasDiscount && (
                    <>
                        <span className="text-xl lg:text-xl text-gray-400 line-through">
                            ${originalPrice.toFixed(2)}
                        </span>
                        {discountAmount && (
                            <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                                {t("designStudio.save")} ${discountAmount}
                            </span>
                        )}
                    </>
                )}
            </div>

            {/* View Selection (Front/Behind) */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                    {t("designStudio.designView")}
                </label>
                <div className="flex gap-3">
                    <BaseButton
                        variant={selectedView === "front" ? "primary" : "outline"}
                        size="sm"
                        onClick={() => onViewSelect?.("front")}
                        className=""
                    >
                        <i className="ri-image-line ml-2"></i>
                        {t("designStudio.frontDesign")}
                    </BaseButton>
                    <BaseButton
                        variant={selectedView === "behind" ? "primary" : "outline"}
                        size="sm"
                        onClick={() => onViewSelect?.("behind")}
                        className=""
                    >
                        <i className="ri-image-2-line ml-2"></i>
                        {t("designStudio.behindDesign")}
                    </BaseButton>
                </div>
            </div>

            <div className="flex  gap-12">
                {/* Color Selection */}
                {availableColors.length > 0 && (
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                            {t("designStudio.color")}
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {availableColors.map((color) => (
                                <button
                                    key={color.key}
                                    onClick={() => onColorSelect?.(color.key)}
                                    className={cn(
                                        "w-6 h-6 lg:w-8 lg:h-8 rounded-full border-2 transition-all",
                                        selectedColor === color.key
                                            ? "border-gray-900 scale-110"
                                            : "border-gray-300 hover:border-gray-500",
                                        `bg-[${color.value}]`,
                                    )}
                                    style={{ backgroundColor: color.value }}
                                    aria-label={`Select color ${color.name}`}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Size Selection */}
                {availableSizes.length > 0 && (
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                            {t("designStudio.size")}
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {availableSizes.map((size) => (
                                <button
                                    key={size.key}
                                    onClick={() => onSizeSelect?.(size.key)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-full border-2 font-semibold text-xs transition-all uppercase min-w-10",
                                        selectedSize === size.key
                                            ? "border-gray-900 bg-gray-900 text-white"
                                            : "border-gray-300 text-gray-700 hover:border-gray-500"
                                    )}
                                >
                                    {size.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>



            {/* Stock Info */}
            <div className="mb-6">
                {isInStock ? (
                    // <p className="text-sm text-green-600 font-medium">
                    //     <i className="ri-checkbox-circle-line mr-1"></i>
                    //     {t("designStudio.inStock", { count: availableStock })}
                    // </p>
                    <></>
                ) : (
                    <p className="text-sm text-red-600 font-medium">
                        <i className="ri-close-circle-line mr-1"></i>
                        {t("designStudio.outOfStock")}
                    </p>
                )}
            </div>

            {/* Add to Cart Button */}
            {!isMobile && (
                <BaseButton
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={onAddToCart}
                    disabled={!isInStock || !selectedColor || !selectedSize}
                    className="mb-8 lg:inline-block hidden"
                >
                    <i className="ri-shopping-cart-line mr-2"></i>
                    {isInStock ? t("designStudio.addToCart") : t("designStudio.outOfStock")}
                </BaseButton>
            )}


        </div>
    );
}

