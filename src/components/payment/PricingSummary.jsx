"use client";

import { container } from "@/lib/styles";
import BaseSkeleton from "@/components/ui/BaseSkeleton";

const formatMoney = (value) => {
  const num = Number(value || 0);
  if (Number.isNaN(num)) return "$0.00";
  return `$${num.toFixed(2)}`;
};

/**
 * PricingSummary
 * Displays pricing details from pricing API.
 *
 * @param {Object} props
 * @param {Object|null} props.pricing
 * @param {boolean} props.isLoading
 */
export default function PricingSummary({ pricing, isLoading = false }) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-gray-900">خلاصه قیمت</h3>

      <div className={container}>
        {isLoading ? (
          <div className="space-y-3">
            <BaseSkeleton isLoading={true} variant="text" className="h-5">
              <div className="h-5" />
            </BaseSkeleton>
            <BaseSkeleton isLoading={true} variant="text" className="h-5">
              <div className="h-5" />
            </BaseSkeleton>
            <BaseSkeleton isLoading={true} variant="text" className="h-5">
              <div className="h-5" />
            </BaseSkeleton>
            <BaseSkeleton isLoading={true} variant="text" className="h-5">
              <div className="h-5" />
            </BaseSkeleton>
            <div className="border-t border-gray-200 pt-3">
              <BaseSkeleton isLoading={true} variant="text" className="h-6">
                <div className="h-6" />
              </BaseSkeleton>
            </div>
          </div>
        ) : !pricing ? (
          <div className="text-sm text-gray-600">برای مشاهده قیمت، منتظر بمانید.</div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-700">
              <span>تخفیف</span>
              <span className="font-semibold text-green-700">
                {formatMoney(pricing.discount_amount)}
              </span>
            </div>

            <div className="flex justify-between text-sm text-gray-700">
              <span>جمع محصولات (بدون تخفیف)</span>
              <span className="font-semibold">
                {formatMoney(pricing.subtotal_without_discount)}
              </span>
            </div>

            <div className="flex justify-between text-sm text-gray-700">
              <span>جمع محصولات (با تخفیف)</span>
              <span className="font-semibold">
                {formatMoney(pricing.products_total_after_discount)}
              </span>
            </div>

            <div className="flex justify-between text-sm text-gray-700">
              <span>هزینه ارسال</span>
              <span className="font-semibold">{formatMoney(pricing.shipping_cost)}</span>
            </div>

            <div className="border-t border-gray-200 pt-3 flex justify-between text-base font-bold text-gray-900">
              <span>جمع کل</span>
              <span>{formatMoney(pricing.grand_total)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


