"use client";

import { cn } from "@/lib/utils";

/**
 * ProductShippingInfo Component
 * Displays shipping and guarantee information
 *
 * @param {Object} props
 * @param {string} props.className - Additional CSS classes
 */
export default function ProductShippingInfo({ className }) {
  const features = [
    {
      icon: "ri-truck-line",
      title: "Fast Delivery",
      description: "Free shipping on orders over $50"
    },
    {
      icon: "ri-shield-check-line",
      title: "Quality Guarantee",
      description: "Premium materials and printing"
    },
    {
      icon: "ri-arrow-go-back-line",
      title: "Easy Returns",
      description: "30-day return policy"
    }
  ];

  return (
    <div className={cn("mt-12 grid grid-cols-1 md:grid-cols-3 gap-6", className)}>
      {features.map((feature, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <div className="w-12 h-12 bg-[#E6F3FA] rounded-full flex items-center justify-center mb-4">
            <i className={`${feature.icon} text-2xl text-gray-900`}></i>
          </div>
          <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
          <p className="text-gray-600 text-sm">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}
