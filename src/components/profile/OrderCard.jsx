"use client";

import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils/formatPrice";

const PAYMENT_STATUS_COLORS = {
  paid: "text-green-600 bg-green-50",
  pending: "text-amber-600 bg-amber-50",
  failed: "text-red-600 bg-red-50"
};

const getPaymentStatusColor = (status) =>
  PAYMENT_STATUS_COLORS[status] || "text-gray-600 bg-gray-50";

const formatDate = (isoString) => {
  if (!isoString) return "-";
  const d = new Date(isoString);
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(d);
};

/**
 * OrderCard - Single order row for purchase history
 * @param {Object} props.order - API order object
 */
export default function OrderCard({ order }) {
  if (!order) return null;

  const statusColor = getPaymentStatusColor(order.payment_status);

  return (
    <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">شماره سفارش:</span>
            <span className="font-semibold text-gray-900">{order.invoice_number}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <i className="ri-calendar-line" aria-hidden />
            <span>{formatDate(order.created_at)}</span>
          </div>
          <div className="text-sm text-gray-600">
            <i className="ri-shopping-bag-line ml-1" aria-hidden />
            {order.items_count} آیتم
          </div>
        </div>
        <div className="flex justify-between sm:flex-col sm:items-end gap-2">
          <div className="flex flex-col sm:items-end gap-2">
            <span
              className={cn(
                "inline-flex px-3 py-1 rounded-full text-xs font-semibold w-fit",
                statusColor
              )}
            >
              {order.payment_status_display}
            </span>
            <span className="text-xs text-gray-500">{order.delivery_status_display}</span>
          </div>
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(order.grand_total)}
          </span>
        </div>
      </div>
    </div>
  );
}
