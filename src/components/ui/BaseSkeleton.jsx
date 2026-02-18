"use client";

import { useTranslations } from 'next-intl';
import { cn } from "@/lib/utils";

/**
 * BaseSkeleton Component
 * Wrapper component that shows skeleton loading state for its children
 *
 * @param {Object} props
 * @param {boolean} props.isLoading - Whether to show skeleton (default: true)
 * @param {React.ReactNode} props.children - Content to wrap with skeleton
 * @param {string} props.className - Additional CSS classes for skeleton wrapper
 * @param {string} props.skeletonClassName - Additional CSS classes for skeleton element
 * @param {string} props.variant - Skeleton variant: 'default' | 'text' | 'circular' | 'rectangular' (default: 'default')
 */
export default function BaseSkeleton({
  isLoading = true,
  children,
  className,
  skeletonClassName,
  variant = "default"
}) {
  const t = useTranslations();
  // If not loading, render children directly
  if (!isLoading) {
    return <div className={className}>{children}</div>;
  }

  // Variant classes for different skeleton shapes
  const variantClasses = {
    default: "rounded-lg",
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-none"
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Render children invisibly to preserve layout */}
      <div className="invisible absolute inset-0 pointer-events-none">
        {children}
      </div>
      
      {/* Skeleton element with shimmer animation */}
      <div
        className={cn(
          "bg-gray-200 relative overflow-hidden w-full h-full",
          variantClasses[variant],
          skeletonClassName
        )}
        style={{
          minHeight: "1rem"
        }}
        aria-label={t('ui.loading')}
      >
        {/* Shimmer effect overlay */}
        <div
          className="absolute inset-0 shimmer-animation"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)"
          }}
        />
      </div>
    </div>
  );
}

