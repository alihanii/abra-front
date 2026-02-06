"use client";

import { useState } from "react";
import BaseImage from "@/components/ui/BaseImage";
import ScrollReveal from "@/components/ui/ScrollReveal";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { cn } from "@/lib/utils";

/**
 * Purchase History Component
 * Displays user's purchase history
 *
 * @param {Array} props.orders - Array of order objects
 * @param {boolean} props.isLoading - Whether data is loading
 */
export default function PurchaseHistory({ orders = [], isLoading = false }) {
  // Mock data for demonstration - replace with actual orders from props
  const mockOrders =
    orders.length > 0
      ? orders
      : [
          {
            id: "order-1",
            orderNumber: "ORD-2024-001",
            date: "2024-01-15",
            status: "delivered",
            total: 125.99,
            items: [
              {
                id: "item-1",
                name: "Classic Black Hoodie",
                image:
                  "https://readdy.ai/api/search-image?query=Premium%20black%20hoodie&width=200&height=200",
                quantity: 2,
                price: 45.99
              },
              {
                id: "item-2",
                name: "Couple Hoodies Set",
                image:
                  "https://readdy.ai/api/search-image?query=Couple%20hoodies&width=200&height=200",
                quantity: 1,
                price: 79.99
              }
            ]
          },
          {
            id: "order-2",
            orderNumber: "ORD-2024-002",
            date: "2024-01-20",
            status: "processing",
            total: 89.99,
            items: [
              {
                id: "item-3",
                name: "Premium T-Shirt",
                image:
                  "https://readdy.ai/api/search-image?query=Premium%20t-shirt&width=200&height=200",
                quantity: 1,
                price: 89.99
              }
            ]
          }
        ];

  const getStatusLabel = (status) => {
    const statusMap = {
      delivered: { label: "تحویل شده", color: "text-green-600 bg-green-50" },
      processing: { label: "در حال پردازش", color: "text-blue-600 bg-blue-50" },
      shipped: { label: "ارسال شده", color: "text-purple-600 bg-purple-50" },
      cancelled: { label: "لغو شده", color: "text-red-600 bg-red-50" }
    };
    return statusMap[status] || { label: status, color: "text-gray-600 bg-gray-50" };
  };

  // Show loading screen if data is loading
  if (isLoading) {
    return (
      <div className="relative min-h-[300px] flex items-center justify-center">
        <LoadingScreen
          isLoading={true}
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

  if (mockOrders.length === 0) {
    return (
      <ScrollReveal
        animation="fadeUp"
        delay={0}
      >
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <i className="ri-shopping-bag-line text-3xl text-gray-400"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">تاریخچه خرید خالی است</h3>
          <p className="text-gray-600 text-sm">شما هنوز خریدی انجام نداده‌اید.</p>
        </div>
      </ScrollReveal>
    );
  }

  return (
    <div className="space-y-4">
      {mockOrders.map((order, index) => {
        const statusInfo = getStatusLabel(order.status);
        return (
          <ScrollReveal
            key={order.id}
            animation="fadeUp"
            delay={index * 100}
            threshold={0.1}
          >
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-4 border-b border-gray-200">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">شماره سفارش:</span>
                    <span className="font-semibold text-gray-900">{order.orderNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <i className="ri-calendar-line"></i>
                    <span>{order.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={cn("px-3 py-1 rounded-full text-xs font-semibold", statusInfo.color)}
                  >
                    {statusInfo.label}
                  </span>
                  <span className="text-lg font-bold text-gray-900">${order.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                      <BaseImage
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="rounded-lg"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-1 truncate">{item.name}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">تعداد: {item.quantity}</span>
                        <span className="font-semibold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        );
      })}
    </div>
  );
}
