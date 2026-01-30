'use client';

import { forwardRef } from 'react';
import Link from 'next/link';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Button variants using class-variance-authority
 */
const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center rounded-full font-semibold transition-all cursor-pointer whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:from-gray-800 hover:to-gray-700 shadow-lg hover:shadow-xl focus:ring-gray-900',
        secondary: 'bg-white text-gray-900 border-2 border-gray-900 hover:bg-gray-900 hover:text-white focus:ring-gray-900',
        outline: 'bg-transparent text-gray-900 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-900 focus:ring-gray-900',
        ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-900',
      },
      size: {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-6 py-4 text-lg',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

/**
 * BaseButton Component
 * Reusable button component with variants and Link support
 * 
 * @param {Object} props
 * @param {string} props.variant - Button variant: 'primary' | 'secondary' | 'outline' | 'ghost'
 * @param {string} props.size - Button size: 'sm' | 'md' | 'lg'
 * @param {boolean} props.fullWidth - Make button full width
 * @param {string} props.href - If provided, renders as Link instead of button
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Button content
 */
const BaseButton = forwardRef(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      href,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = cn(
      buttonVariants({ variant, size, fullWidth }),
      className
    );

    // If href is provided, render as Link
    if (href) {
      return (
        <Link
          ref={ref}
          href={href}
          className={baseClasses}
          {...props}
        >
          {children}
        </Link>
      );
    }

    // Otherwise render as button
    return (
      <button
        ref={ref}
        className={baseClasses}
        {...props}
      >
        {children}
      </button>
    );
  }
);

BaseButton.displayName = 'BaseButton';

export default BaseButton;
export { buttonVariants };

