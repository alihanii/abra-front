'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BaseImage from '@/components/ui/BaseImage';
import BaseButton from '@/components/ui/BaseButton';
import QuantityControl from '@/components/ui/QuantityControl';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

/**
 * Product Card Component
 * Card component for displaying products with add to cart functionality
 * 
 * @param {Object} props
 * @param {string} props.id - Product ID
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
  name,
  price,
  image,
  badge,
  href,
  size = 'md',
  className,
}) {
  const router = useRouter();
  const { items, addItem, updateQuantity, removeItem } = useCart();

  // Check if product is in cart
  const cartItem = useMemo(() => {
    return items.find((item) => item.id === id);
  }, [items, id]);

  const handleCardClick = (e) => {
    // Don't navigate if clicking on button or quantity control
    if (
      e.target.closest('button') ||
      e.target.closest('[data-product-action]')
    ) {
      return;
    }
    router.push(href);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id,
      name,
      price,
      image,
      size: 'M', // Default size
      color: 'Default', // Default color
      quantity: 1,
    });
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity === 0) {
      removeItem(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const isMobile = size === 'sm';
  const isInCart = Boolean(cartItem);

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        'bg-white rounded-2xl overflow-hidden shadow-lg group cursor-pointer hover:shadow-2xl transition-all duration-300',
        isMobile ? 'p-4' : 'p-5',
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-[5/6] overflow-hidden mb-4 rounded-lg">
        <BaseImage
          src={image}
          alt={name}
          fill
          className="object-cover object-top group-hover:scale-105 transition-transform duration-500 rounded-lg"
        />

        {/* Badge */}
        {badge && (
          <span
            className={cn(
              'absolute top-3 left-3 px-2 py-1 bg-gray-900 text-white text-xs font-semibold rounded-full z-10',
              isMobile ? 'top-3 left-3 px-2 py-1' : 'top-4 left-4 px-3 py-1'
            )}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className={isMobile ? 'p-0' : ''}>
        <h3
          className={cn(
            'font-bold text-gray-900 mb-2',
            isMobile ? 'text-sm' : 'text-lg'
          )}
        >
          {name}
        </h3>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={cn(
              'font-bold text-gray-900',
              isMobile ? 'text-xl' : 'text-2xl'
            )}
          >
            ${price.toFixed(2)}
          </span>
        </div>

        {/* Add to Cart or Quantity Control */}
        {isInCart ? (
          <div data-product-action onClick={(e) => e.stopPropagation()}>
            <QuantityControl
              value={cartItem.quantity}
              onIncrease={() => handleQuantityChange(cartItem.quantity + 1)}
              onDecrease={() => handleQuantityChange(cartItem.quantity - 1)}
              min={1}
              max={99}
              size={isMobile ? 'xs' : 'sm'}
              className="w-full justify-center"
            />
          </div>
        ) : (
          <BaseButton
            onClick={handleAddToCart}
            variant="primary"
            size={isMobile ? 'sm' : 'md'}
            fullWidth
            className="whitespace-nowrap"
            data-product-action
          >
            Add to Cart
          </BaseButton>
        )}
      </div>
    </div>
  );
}

