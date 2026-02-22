"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import BaseImage from "@/components/ui/BaseImage";
import BaseButton from "@/components/ui/BaseButton";
import QuantityControl from "@/components/ui/QuantityControl";
import { useProduct } from "@/hooks/useProduct";
import { useCart } from "@/contexts/CartContext";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils/formatPrice";

/**
 * Product Card Component
 * Card component for displaying products with add to cart functionality
 *
 * @param {Object} props
 * @param {string} props.id - Product ID
 * @param {string} props.slug - Product slug (required if product prop is not provided)
 * @param {string} props.name - Product name
 * @param {number} props.price - Product price
 * @param {string|Object} props.image - Product image URL or image object
 * @param {string} props.badge - Badge text (e.g., "Bestseller", "New", "Popular")
 * @param {string} props.href - Product detail page URL
 * @param {string} props.size - Size variant: 'sm' | 'md' (default: 'md')
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.product - Full product data object (optional, if provided, useProduct won't be called)
 * @param {boolean} props.isLoading - Whether to show skeleton loading state
 */
export default function ProductCard({
  id,
  slug,
  name,
  price,
  image,
  badge,
  href,
  size = "md",
  className,
  product: productData, // Full product data from API
  isLoading = false
}) {
  const router = useRouter();
  const { items, addItem, updateQuantity, removeItem, openCart } = useCart();

  // Use useProduct hook - it accepts either slug (string) or product object
  // If productData is provided, pass it directly to avoid API call
  // If only slug is provided, hook will fetch from mock data
  const {
    product,
    selectedColor,
    selectedSize,
    selectedColorData,
    selectedSizeData,
    quantity,
    availableStock,
    isInStock,
    finalPrice
  } = useProduct(productData || slug);

  // Check if product is in cart by matching (id, color id, size id)
  const cartItemColor = selectedColorData?.id ?? selectedColor;
  const cartItemSize = selectedSizeData?.id ?? selectedSize;

  const cartItem = useMemo(() => {
    if (!product || !cartItemColor || !cartItemSize) return null;
    return items.find(
      (item) =>
        String(item.id) === String(product.id) &&
        String(item.color) === String(cartItemColor) &&
        String(item.size) === String(cartItemSize)
    );
  }, [items, product, cartItemColor, cartItemSize]);

  const handleCardClick = (e) => {
    // Don't navigate if clicking on button or quantity control
    if (e.target.closest("button") || e.target.closest("[data-product-action]")) {
      return;
    }
    // Navigate to product detail page
    // if (href) {
    //   router.push(href);
    // } else if (slug) {
    router.push(`${ROUTES.PRODUCTS}/${slug}`);
    // }
  };

  // Handle add to cart - same logic as page.js
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product || !selectedColor || !selectedSize || !isInStock) {
      // Show error or validation message
      return;
    }

    addItem({
      id: `${product.id}`,
      slug: product.slug,
      name: product.name,
      price: finalPrice,
      image: product.images?.[0]?.url || "",
      size: selectedSizeData?.id ?? selectedSize,
      color: selectedColorData?.id ?? selectedColor,
      quantity: quantity
    });

    // Open cart drawer
    openCart();
  };

  const handleQuantityChange = (newQuantity) => {
    if (!product || !cartItemColor || !cartItemSize) return;

    if (newQuantity === 0) {
      removeItem(String(product.id), cartItemColor, cartItemSize);
    } else {
      updateQuantity(String(product.id), cartItemColor, cartItemSize, newQuantity);
    }
  };

  const isMobile = size === "sm";
  const isInCart = Boolean(cartItem);

  const colorSwatches = useMemo(() => {
    if (!product?.colors || Object.keys(product.colors).length === 0) return [];
    return Object.entries(product.colors).filter(
      ([_, c]) => c?.available !== false
    );
  }, [product?.colors]);

  // Use product data if available, otherwise fallback to props
  const displayName = name;
  const displayPrice = price;
  const displayImage = image;

  const maxQuantity =
    product && availableStock !== undefined ? cartItem?.quantity + availableStock : availableStock;

  // Show skeleton loading state
  if (isLoading) {
    return (
      <div
        className={cn(
          "bg-white overflow-hidden shadow-lg",
          "flex flex-row md:flex-col",
          "w-full md:w-auto",
          "border-b md:border-b-0 border-gray-200 last:border-b-0",
          "rounded-none md:rounded-2xl",
          isMobile ? "p-3" : "p-5 gap-2",
          className
        )}
      >
        {/* Image Skeleton */}
        <div
          className={cn(
            "relative overflow-hidden rounded-lg shrink-0 bg-gray-200 animate-pulse",
            "w-20 h-20 md:w-full md:h-auto",
            "md:aspect-6/6 md:mb-4"
          )}
        />

        {/* Product Info Skeleton */}
        <div
          className={cn(
            "flex flex-col flex-1",
            "ml-3 md:ml-0",
            "justify-between md:justify-start"
          )}
        >
          <div className="flex-1 flex flex-col items-start ml-2">
            <div className="mb-1 md:mb-2 h-3 md:h-6 w-full bg-gray-200 rounded animate-pulse" />
            <div className="mb-2 md:hidden h-3 w-2/3 bg-gray-200 rounded animate-pulse" />

            <div className="flex gap-1.5 mt-1 md:mt-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-4 h-4 rounded-full bg-gray-200 animate-pulse" />
              ))}
            </div>

            <div className="mb-2 md:mb-4 h-4 md:h-6 w-16 md:w-24 mt-0.5 bg-gray-200 rounded animate-pulse self-end" />
          </div>

          <div className="mt-auto md:mt-0 h-8 md:h-12 w-full rounded-full bg-gray-200 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        "bg-white overflow-hidden shadow-lg group cursor-pointer hover:shadow-2xl transition-all duration-300",
        "flex flex-row md:flex-col",
        "w-full md:w-auto",
        "border-b md:border-b-0 border-gray-200 last:border-b-0",
        "rounded-none md:rounded-2xl",
        isMobile ? "p-3" : "p-5 gap-2",
        className
      )}
    >
      {/* Image Container */}
      <div
        className={cn(
          "relative overflow-hidden rounded-lg shrink-0",
          "w-20 h-20 md:w-full md:h-auto",
          "md:aspect-6/6 md:mb-4"
        )}
      >
        <BaseImage
          src={displayImage?.url}
          alt={displayName?.alt}
          fill
          className="object-cover object-top group-hover:scale-105 transition-transform duration-500 rounded-lg"
        />

        {/* Badge */}
        {badge && (
          <span
            className={cn(
              "absolute top-1 left-1 md:top-3 md:left-3 px-1.5 py-0.5 md:px-2 md:py-1",
              "bg-gray-900 text-white text-[10px] md:text-xs font-semibold rounded-full z-10"
            )}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Product Info */}
      <div
        className={cn("flex flex-col flex-1", "mr-3 md:ml-0", "justify-between md:justify-start")}
      >
        <div className="flex-1 items-start flex flex-col ml-2">
          <h3
            className={cn(
              "font-bold text-gray-900 mb-1 md:mb-2",
              "text-xs md:text-lg",
              "line-clamp-2 md:line-clamp-none"
            )}
          >
            {displayName}
          </h3>
          {/* Color swatches */}
          {colorSwatches.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1 md:mt-2">
              {colorSwatches.map(([key, color]) => (
                <span
                  key={key}
                  className={cn(
                    "w-4 h-4 rounded-full border border-gray-300 shrink-0",
                    selectedColor === key && "ring-2 ring-gray-900 ring-offset-1"
                  )}
                  style={{ backgroundColor: color.value || "#e5e7eb" }}
                  title={color.name}
                  aria-hidden
                />
              ))}
            </div>
          )}

          {/* Price */}
          <div className="text-left mb-2 md:mb-4 w-full">
            <span className={cn("font-bold text-gray-900", "text-base md:text-lg")}>
              {formatPrice(displayPrice)}
            </span>
          </div>
        </div>

        {/* Add to Cart or Quantity Control */}
        <div className="mt-auto md:mt-0">
          {isInCart && cartItem ? (
            <div
              data-product-action
              onClick={(e) => e.stopPropagation()}
            >
              <QuantityControl
                value={cartItem.quantity}
                onIncrease={() => handleQuantityChange(cartItem.quantity + 1)}
                onDecrease={() => handleQuantityChange(cartItem.quantity - 1)}
                min={1}
                max={maxQuantity || 99}
                size={"md"}
                className="w-full justify-end md:mb-2 mb-0"
              />
            </div>
          ) : (
            <BaseButton
              onClick={handleAddToCart}
              variant="primary"
              size={isMobile ? "xs" : "md"}
              fullWidth
              className="whitespace-nowrap text-xs md:text-sm"
              data-product-action
            >
              Add to Cart
            </BaseButton>
          )}
          {/* <BaseButton
            onClick={isInCart && cartItem  ?  openCart:handleAddToCart  }
            variant="primary"
            size={isMobile ? 'xs' : 'md'}
            fullWidth
            className="whitespace-nowrap text-xs md:text-sm"
              data-product-action
              >
                { isInCart && cartItem ? 'is in cart' : 'Add to Cart'}
            </BaseButton> */}
        </div>
      </div>
    </div>
  );
}
