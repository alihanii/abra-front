"use client";

import ProductCard from "./ProductCard";
import { cn } from "@/lib/utils";

/**
 * ProductGrid Component (Molecule)
 * Grid layout for displaying products
 *
 * @param {Object} props
 * @param {Array} props.products - Array of product objects
 * @param {string} props.className - Additional CSS classes
 */
export default function ProductGrid({ products = [], className }) {
  if (products.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-20", className)}>
        <i className="ri-shopping-bag-line text-6xl text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
        <p className="text-gray-500 text-center">
          Try adjusting your filters to see more products.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 md:gap-4 lg:gap-6",
        className
      )}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          {...product}
        />
      ))}
    </div>
  );
}
