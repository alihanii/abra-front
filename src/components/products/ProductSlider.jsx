'use client';

import { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import ProductCard from './ProductCard';

/**
 * Product Slider Component
 * Horizontal scrolling product slider
 * 
 * @param {Object} props
 * @param {Array} props.products - Array of product objects
 */
const ProductSlider = forwardRef(({ products }, ref) => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const itemWidth = container.scrollWidth / products.length;
    const scrollDistance = itemWidth;

    container.scrollBy({
      left: direction === 'left' ? -scrollDistance : scrollDistance,
      behavior: 'smooth',
    });
  };

  // Expose scroll methods to parent
  useImperativeHandle(ref, () => ({
    scrollLeft: () => scroll('left'),
    scrollRight: () => scroll('right'),
    canScrollLeft: () => {
      if (!scrollContainerRef.current) return false;
      return scrollContainerRef.current.scrollLeft > 0;
    },
    canScrollRight: () => {
      if (!scrollContainerRef.current) return false;
      const container = scrollContainerRef.current;
      return (
        container.scrollLeft <
        container.scrollWidth - container.clientWidth - 10
      );
    },
  }));

  return (
    <div className="hidden md:block relative overflow-hidden">
      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="flex-shrink-0 w-[calc(25%-18px)]"
          >
            <ProductCard {...product} size="md" />
          </div>
        ))}
      </div>
    </div>
  );
});

ProductSlider.displayName = 'ProductSlider';

export default ProductSlider;

