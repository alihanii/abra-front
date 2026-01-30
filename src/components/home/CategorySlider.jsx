'use client';

import { useRef, useImperativeHandle, forwardRef } from 'react';
import ShopCategoryCard from './ShopCategoryCard';

/**
 * Category Slider Component
 * Horizontal scrolling category slider for desktop
 * 
 * @param {Object} props
 * @param {Array} props.categories - Array of category objects
 */
const CategorySlider = forwardRef(({ categories }, ref) => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const itemWidth = container.scrollWidth / categories.length;
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
    <div className="hidden md:block relative overflow-hidden max-h-[80vh]">
      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-8 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {categories.map((category) => (
          <div
            key={category.id}
            className="shrink-0 w-[calc(25%-18px)]"
          >
            <ShopCategoryCard
              href={category.href}
              image={category.image}
              alt={category.title}
              title={category.title}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

CategorySlider.displayName = 'CategorySlider';

export default CategorySlider;

