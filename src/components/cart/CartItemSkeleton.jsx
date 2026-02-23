"use client";

import { BaseSkeleton } from "@/components/ui";
import { container } from "@/lib/styles";

/**
 * Cart Item Skeleton
 * Atomic skeleton that matches CartItem/CartCustomItem layout exactly
 */
export default function CartItemSkeleton() {
  return (
    <div className={container}>
      <div className="flex gap-4">
        <BaseSkeleton
          isLoading={true}
          variant="rectangular"
          className="w-24 h-24 shrink-0 rounded-lg"
        />
        <div className="flex-1 min-w-0 space-y-2">
          <BaseSkeleton isLoading={true} variant="text" className="h-4 w-3/4" />
          <div className="flex gap-2">
            <BaseSkeleton isLoading={true} variant="text" className="h-3 w-16" />
            <BaseSkeleton isLoading={true} variant="text" className="h-3 w-14" />
          </div>
          <div className="flex items-center gap-4 pt-2">
            <BaseSkeleton isLoading={true} variant="rectangular" className="h-8 w-24 rounded" />
            <BaseSkeleton isLoading={true} variant="text" className="h-5 w-16" />
          </div>
        </div>
        <BaseSkeleton
          isLoading={true}
          variant="circular"
          className="w-8 h-8 shrink-0"
        />
      </div>
    </div>
  );
}
