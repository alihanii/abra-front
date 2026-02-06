"use client";

import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";

/**
 * Breadcrumbs Component
 * Displays navigation breadcrumbs for product pages
 *
 * @param {Object} props
 * @param {Array} props.items - Array of breadcrumb items [{label, href}]
 * @param {string} props.className - Additional CSS classes
 */
export default function Breadcrumbs({ items = [], className }) {
  if (!items || items.length === 0) return null;

  return (
    <div className={cn("flex items-center gap-2 text-sm text-gray-600 mb-6", className)}>
      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-2"
        >
          {index > 0 && <i className="ri-arrow-right-s-line"></i>}
          {item.href && index < items.length - 1 ? (
            <Link
              href={item.href}
              className="hover:text-gray-900 cursor-pointer transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className={index === items.length - 1 ? "text-gray-900" : ""}>{item.label}</span>
          )}
        </div>
      ))}
    </div>
  );
}
