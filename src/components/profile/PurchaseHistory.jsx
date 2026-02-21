"use client";

import { useRef, useMemo, useCallback, useState, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useOrdersList } from "@/hooks/useApi";
import OrderCard from "./OrderCard";
import LoadingScreen from "@/components/ui/LoadingScreen";
import BaseButton from "@/components/ui/BaseButton";

const ITEM_HEIGHT_ESTIMATE = 140;
const GAP_MOBILE = 26;
const GAP_DESKTOP = 0;

export default function PurchaseHistory() {
  const parentRef = useRef(null);
  const [gap, setGap] = useState(GAP_MOBILE);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = () => setGap(mq.matches ? GAP_DESKTOP : GAP_MOBILE);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage
  } = useOrdersList();

  const orders = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.results ?? []);
  }, [data]);

  const totalCount = data?.pages?.[0]?.count ?? 0;
  const canShowMore = hasNextPage && !isFetchingNextPage;

  const rowVirtualizer = useVirtualizer({
    count: orders.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ITEM_HEIGHT_ESTIMATE,
    overscan: 3,
    gap,
    isRtl: true,
    getItemKey: useCallback((index) => orders[index]?.id ?? index, [orders])
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  if (isLoading) {
    return (
      <div className="relative min-h-[300px] flex items-center justify-center">
        <LoadingScreen
          isLoading
          logoText="Abra"
          typingSpeed={100}
          minDisplayTime={800}
          size="md"
          loop
          className="relative inset-auto z-0 bg-transparent"
        />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <i className="ri-shopping-bag-line text-3xl text-gray-400" aria-hidden />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">تاریخچه خرید خالی است</h3>
        <p className="text-gray-600 text-sm">شما هنوز خریدی انجام نداده‌اید.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={parentRef}
        className="scrollbar-hide overflow-auto min-h-[200px] max-h-[35vh] sm:min-h-[240px] sm:max-h-[42vh] md:min-h-[280px] md:max-h-[50vh] rounded-xl"
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative"
          }}
        >
          {virtualItems.map((virtualRow) => {
            const order = orders[virtualRow.index];
            if (!order) return null;
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
                <OrderCard order={order} />
              </div>
            );
          })}
        </div>
      </div>

      {canShowMore && (
        <BaseButton
          variant="outline"
          size="md"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? (
            <>
              <i className="ri-loader-4-line animate-spin ml-2" aria-hidden />
              در حال بارگذاری...
            </>
          ) : (
            <>
              <i className="ri-add-line ml-2" aria-hidden />
              نمایش بیشتر ({orders.length} از {totalCount})
            </>
          )}
        </BaseButton>
      )}

      {isFetchingNextPage && !canShowMore && (
        <div className="flex justify-center py-2">
          <i className="ri-loader-4-line animate-spin text-2xl text-gray-400" aria-hidden />
        </div>
      )}
    </div>
  );
}
