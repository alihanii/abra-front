"use client";

import BaseImage from "@/components/ui/BaseImage";
import { container } from "@/lib/styles";
import { formatPrice } from "@/lib/utils/formatPrice";

/**
 * PaymentCartList
 * Read-only cart items list for payment page.
 *
 * @param {Object} props
 * @param {Array} props.items - Hydrated cart items [{id,name,image,color,size,quantity,unitPrice}]
 * @param {boolean} props.isLoading
 */
export default function PaymentCartList({ items = [], isLoading = false }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">محصولات</h3>
        <span className="text-sm text-gray-600">{items.length} آیتم</span>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className={container}>
            <div className="text-sm text-gray-600">در حال دریافت اطلاعات سبد خرید...</div>
          </div>
        ) : items.length === 0 ? (
          <div className={container}>
            <div className="text-sm text-gray-600">سبد خرید خالی است.</div>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={`${item.id}-${item.color}-${item.size}`}
              className={container}
            >
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-50">
                  <BaseImage
                    src={item.image || ""}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded-lg"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-semibold text-gray-900 truncate">{item.name}</h4>
                    <div className="text-sm font-bold text-gray-900 shrink-0">
                      {formatPrice(item.unitPrice ?? 0)}
                    </div>
                  </div>

                  <div className="mt-1 flex flex-wrap gap-2 text-sm text-gray-600">
                    {item.size ? <span>سایز: {item.size}</span> : null}
                    {item.size && item.color ? <span>•</span> : null}
                    {item.color ? <span>رنگ: {item.color}</span> : null}
                    {(item.size || item.color) ? <span>•</span> : null}
                    <span>تعداد: {item.quantity}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


