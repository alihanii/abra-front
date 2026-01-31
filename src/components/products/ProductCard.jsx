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
        'bg-white overflow-hidden shadow-lg group cursor-pointer hover:shadow-2xl transition-all duration-300',
        'flex flex-row md:flex-col',
        'w-full md:w-auto',
        'border-b md:border-b-0 border-gray-200 last:border-b-0',
        'rounded-none md:rounded-2xl',
        isMobile ? 'p-3' : 'p-5',
        className
      )}
    >
      {/* Image Container */}
      <div className={cn(
        'relative overflow-hidden rounded-lg shrink-0',
        'w-24 h-24 md:w-full md:h-auto',
        'md:aspect-5/6 md:mb-4'
      )}>
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
              'absolute top-1 left-1 md:top-3 md:left-3 px-1.5 py-0.5 md:px-2 md:py-1',
              'bg-gray-900 text-white text-[10px] md:text-xs font-semibold rounded-full z-10'
            )}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className={cn(
        'flex flex-col flex-1',
        'ml-3 md:ml-0',
        'justify-between md:justify-start'
      )}>
        <div className="flex-1">
          <h3
            className={cn(
              'font-bold text-gray-900 mb-1 md:mb-2',
              'text-xs md:text-lg',
              'line-clamp-2 md:line-clamp-none'
            )}
          >
            {name}
          </h3>

          {/* Price */}
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <span
              className={cn(
                'font-bold text-gray-900',
                'text-base md:text-2xl'
              )}
            >
              ${price.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Add to Cart or Quantity Control */}
        <div className="mt-auto md:mt-0">
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
              size={isMobile ? 'xs' : 'md'}
              fullWidth
              className="whitespace-nowrap text-xs md:text-sm"
              data-product-action
            >
              Add to Cart
            </BaseButton>
          )}
        </div>
      </div>
    </div>
  );
}

