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

/**
 * Product Card Component
 * Card component for displaying products with add to cart functionality
 *
 * @param {Object} props
 * @param {string} props.id - Product ID
 * @param {string} props.slug - Product slug
 * @param {string} props.name - Product name
 * @param {number} props.price - Product price
 * @param {string} props.image - Product image URL
 * @param {string} props.badge - Badge text (e.g., "Bestseller", "New", "Popular")
 * @param {string} props.href - Product detail page URL
 * @param {string} props.size - Size variant: 'sm' | 'md' (default: 'md')
 * @param {string} props.className - Additional CSS classes
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
  className
}) {
  const router = useRouter();
  const { items, addItem, updateQuantity, removeItem, openCart } = useCart();

  // Use useProduct hook similar to page.js
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
  } = useProduct(slug);

  // Check if product is in cart using the same ID format as page.js
  const cartItemId = useMemo(() => {
    if (!product || !selectedColor || !selectedSize) return null;
    return `${product.id}-${selectedColor}-${selectedSize}`;
  }, [product, selectedColor, selectedSize]);

  const cartItem = useMemo(() => {
    if (!cartItemId) return null;
    return items.find((item) => item.id === cartItemId);
  }, [items, cartItemId]);

  const handleCardClick = (e) => {
    // Don't navigate if clicking on button or quantity control
    if (e.target.closest("button") || e.target.closest("[data-product-action]")) {
      return;
    }
    // Navigate to product detail page
    if (href) {
      router.push(href);
    } else if (slug) {
      router.push(`${ROUTES.PRODUCTS}/${slug}`);
    }
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
      id: `${product.id}-${selectedColor}-${selectedSize}`,
      slug: product.slug,
      name: product.name,
      price: finalPrice,
      image: product.images?.[0]?.url || "",
      size: selectedSizeData?.name || selectedSize,
      color: selectedColorData?.name || selectedColor,
      quantity: quantity
    });

    // Open cart drawer
    openCart();
  };

  const handleQuantityChange = (newQuantity) => {
    if (!cartItemId) return;

    if (newQuantity === 0) {
      removeItem(cartItemId);
    } else {
      updateQuantity(cartItemId, newQuantity);
    }
  };

  const isMobile = size === "sm";
  const isInCart = Boolean(cartItem);

  // Use product data if available, otherwise fallback to props
  const displayName = product?.name || name;
  const displayPrice = product ? finalPrice : price;
  const displayImage = product?.images?.[0]?.url || image;

  const maxQuantity =
    product && availableStock !== undefined ? cartItem?.quantity + availableStock : availableStock;

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        "bg-white overflow-hidden shadow-lg group cursor-pointer hover:shadow-2xl transition-all duration-300",
        "flex flex-row md:flex-col",
        "w-full md:w-auto",
        "border-b md:border-b-0 border-gray-200 last:border-b-0",
        "rounded-none md:rounded-2xl",
        isMobile ? "p-3" : "p-5",
        className
      )}
    >
      {/* Image Container */}
      <div
        className={cn(
          "relative overflow-hidden rounded-lg shrink-0",
          "w-24 h-24 md:w-full md:h-auto",
          "md:aspect-5/6 md:mb-4"
        )}
      >
        <BaseImage
          src={displayImage}
          alt={displayName}
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
        className={cn("flex flex-col flex-1", "ml-3 md:ml-0", "justify-between md:justify-start")}
      >
        <div className="flex-1">
          <h3
            className={cn(
              "font-bold text-gray-900 mb-1 md:mb-2",
              "text-xs md:text-lg",
              "line-clamp-2 md:line-clamp-none"
            )}
          >
            {displayName}
          </h3>

          {/* Price */}
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <span className={cn("font-bold text-gray-900", "text-base md:text-2xl")}>
              ${displayPrice.toFixed(2)}
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
                className="w-full justify-center mb-3"
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
