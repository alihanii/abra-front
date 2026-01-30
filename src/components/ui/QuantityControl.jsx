'use client';

import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Quantity Control Button Variants
 */
const quantityButtonVariants = cva(
  'flex items-center justify-center rounded-full transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      size: {
        xs: 'w-6 h-6',
        sm: 'w-7 h-7',
        md: 'w-8 h-8',
        lg: 'w-10 h-10',
      },
      variant: {
        default: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
        ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);

/**
 * Quantity Display Variants
 */
const quantityDisplayVariants = cva(
  'text-center font-semibold text-gray-900 select-none',
  {
    variants: {
      size: {
        xs: 'w-4 text-xs',
        sm: 'w-6 text-sm',
        md: 'w-8 text-base',
        lg: 'w-10 text-lg',
      },
    },
    defaultVariants: {
      size: 'sm',
    },
  }
);

/**
 * QuantityControl Component
 * Reusable quantity control with increase/decrease buttons
 * 
 * @param {Object} props
 * @param {number} props.value - Current quantity value
 * @param {Function} props.onIncrease - Callback when increase button is clicked
 * @param {Function} props.onDecrease - Callback when decrease button is clicked
 * @param {number} props.min - Minimum quantity (default: 1)
 * @param {number} props.max - Maximum quantity (default: 99)
 * @param {string} props.size - Size variant: 'sm' | 'md' | 'lg' (default: 'md')
 * @param {string} props.variant - Button variant: 'default' | 'ghost' (default: 'default')
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.disabled - Disable all controls
 */
export default function QuantityControl({
  value,
  onIncrease,
  onDecrease,
  min = 1,
  max = 99,
  size = 'md',
  variant = 'default',
  className,
  disabled = false,
}) {
  const isMinReached = value <= min;
  const isMaxReached = value >= max;

  const handleDecrease = () => {
    if (!disabled && !isMinReached && onDecrease) {
      onDecrease();
    }
  };

  const handleIncrease = () => {
    if (!disabled && !isMaxReached && onIncrease) {
      onIncrease();
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Decrease Button */}
      <button
        type="button"
        onClick={handleDecrease}
        disabled={disabled || isMinReached}
        className={cn(
          quantityButtonVariants({ size, variant }),
          (disabled || isMinReached) && 'opacity-50 cursor-not-allowed'
        )}
        aria-label="Decrease quantity"
        aria-disabled={disabled || isMinReached}
      >
        <i className="ri-subtract-line text-gray-700"></i>
      </button>

      {/* Quantity Display */}
      <span className={quantityDisplayVariants({ size })}>
        {value}
      </span>

      {/* Increase Button */}
      <button
        type="button"
        onClick={handleIncrease}
        disabled={disabled || isMaxReached}
        className={cn(
          quantityButtonVariants({ size, variant }),
          (disabled || isMaxReached) && 'opacity-50 cursor-not-allowed'
        )}
        aria-label="Increase quantity"
        aria-disabled={disabled || isMaxReached}
      >
        <i className="ri-add-line text-gray-700"></i>
      </button>
    </div>
  );
}

