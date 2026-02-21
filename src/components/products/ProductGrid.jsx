"use client";

import { useTranslations } from 'next-intl';
import { useRef, useState, useEffect, useCallback } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import ProductCard from "./ProductCard";
import { cn } from "@/lib/utils";

const MOBILE_CARD_HEIGHT = 146;
const MOBILE_GAP = 0;

/**
 * ProductGrid Component (Molecule)
 * Grid layout for displaying products. Uses virtual scroll on mobile only.
 *
 * @param {Object} props
 * @param {Array} props.products - Array of product objects
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.isLoading - Whether to show skeleton loading state
 * @param {number} props.skeletonCount - Number of skeleton cards to show when loading (default: 8)
 */
export default function ProductGrid({ products = [], className, isLoading = false, skeletonCount = 8 }) {
  const t = useTranslations();
  const parentRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = () => setIsMobile(mq.matches);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const rowVirtualizer = useVirtualizer({
    count: products.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => MOBILE_CARD_HEIGHT,
    overscan: 2,
    gap: MOBILE_GAP,
    isRtl: true,
    getItemKey: useCallback((index) => products[index]?.id ?? index, [products]),
    enabled: isMobile && products.length > 0
  });

  // Show skeleton cards when loading
  if (isLoading) {
    return (
      <div
        className={cn(
          "flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 md:gap-4 lg:gap-6",
          className
        )}
      >
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <ProductCard key={`skeleton-${index}`} isLoading={true} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-20", className)}>
        <i className="ri-shopping-bag-line text-6xl text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">{t('products.notFound')}</h3>
        <p className="text-gray-500 text-center">
          {t('products.adjustFilters')}
        </p>
      </div>
    );
  }

  // Mobile: virtual scroll
  if (isMobile) {
    const virtualItems = rowVirtualizer.getVirtualItems();
    return (
      <div
        ref={parentRef}
        className={cn(
          "scrollbar-hide overflow-auto min-h-[500px] max-h-[65vh] -mx-1",
          className
        )}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative"
          }}
        >
          {virtualItems.map((virtualRow) => {
            const product = products[virtualRow.index];
            if (!product) return null;
            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  left: 0,
                  transform: `translateY(${virtualRow.start}px)`
                }}
              >
                <ProductCard {...product} product={product} />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Desktop: normal grid
  return (
    <div
      className={cn(
        "grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6",
        className
      )}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          {...product}
          product={product}
        />
      ))}
    </div>
  );
}
