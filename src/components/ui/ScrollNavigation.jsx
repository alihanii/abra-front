'use client';

import { useState, useEffect } from 'react';

/**
 * ScrollNavigation Component
 * Reusable navigation buttons for horizontal scrolling containers
 * 
 * @param {Object} props
 * @param {Object} props.scrollRef - Ref to the scrollable container (must expose canScrollLeft, canScrollRight, scrollLeft, scrollRight methods)
 * @param {Function} props.onScrollLeft - Callback when left button is clicked
 * @param {Function} props.onScrollRight - Callback when right button is clicked
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.size - Button size: 'sm' | 'md' | 'lg'
 * @param {boolean} props.showOnMobile - Show buttons on mobile devices (default: false)
 */
export default function ScrollNavigation({
  scrollRef,
  onScrollLeft,
  onScrollRight,
  className = '',
  size = 'md',
  showOnMobile = false,
}) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const checkScrollability = () => {
      if (scrollRef?.current) {
        setCanScrollLeft(scrollRef.current.canScrollLeft?.() || false);
        setCanScrollRight(scrollRef.current.canScrollRight?.() || false);
      }
    };

    // Check initially and periodically
    checkScrollability();
    const interval = setInterval(checkScrollability, 100);

    return () => clearInterval(interval);
  }, [scrollRef]);

  const handleScrollLeft = () => {
    if (scrollRef?.current && onScrollLeft) {
      onScrollLeft();
      // Update state after scroll animation
      setTimeout(() => {
        if (scrollRef?.current) {
          setCanScrollLeft(scrollRef.current.canScrollLeft?.() || false);
          setCanScrollRight(scrollRef.current.canScrollRight?.() || false);
        }
      }, 300);
    }
  };

  const handleScrollRight = () => {
    if (scrollRef?.current && onScrollRight) {
      onScrollRight();
      // Update state after scroll animation
      setTimeout(() => {
        if (scrollRef?.current) {
          setCanScrollLeft(scrollRef.current.canScrollLeft?.() || false);
          setCanScrollRight(scrollRef.current.canScrollRight?.() || false);
        }
      }, 300);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-14 h-14 text-3xl',
  };

  const displayClass = showOnMobile ? 'flex' : 'hidden md:flex';

  return (
    <div className={`${displayClass} gap-2 ${className}`}>
      <button
        onClick={handleScrollLeft}
        disabled={!canScrollLeft}
        className={`
          ${sizeClasses[size]} flex items-center justify-center bg-white rounded-full shadow-md
          hover:shadow-lg transition-all cursor-pointer
          ${!canScrollLeft ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        aria-label="Scroll left"
      >
        <i className="ri-arrow-left-s-line text-gray-900"></i>
      </button>
      <button
        onClick={handleScrollRight}
        disabled={!canScrollRight}
        className={`
          ${sizeClasses[size]} flex items-center justify-center bg-white rounded-full shadow-md
          hover:shadow-lg transition-all cursor-pointer
          ${!canScrollRight ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        aria-label="Scroll right"
      >
        <i className="ri-arrow-right-s-line text-gray-900"></i>
      </button>
    </div>
  );
}

