'use client';

import { cn } from '@/lib/utils';

/**
 * Loading Spinner Component
 * Small loading component with typewriter effect for inline use
 * 
 * @param {Object} props
 * @param {boolean} props.isLoading - Whether loading is active
 * @param {string} props.text - Text to display (default: "در حال بارگذاری...")
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.size - Size: 'sm' | 'md' | 'lg' (default: 'md')
 */
export default function LoadingSpinner({
  isLoading = true,
  text = 'در حال بارگذاری...',
  className,
  size = 'md',
}) {
  if (!isLoading) return null;

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-6',
        className
      )}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-gray-900 rounded-full animate-spin"></div>
        </div>
        
        {/* Text */}
        <p className={cn('text-gray-600 font-medium', sizeClasses[size])}>
          {text}
        </p>
      </div>
    </div>
  );
}

