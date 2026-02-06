"use client";

import Link from "next/link";
import BaseImage from "@/components/ui/BaseImage";
import { cn } from "@/lib/utils";

/**
 * Shop Category Card Component
 * Simple category card for Shop by Category section
 *
 * @param {Object} props
 * @param {string} props.href - Link destination
 * @param {string} props.image - Image URL
 * @param {string} props.alt - Image alt text
 * @param {string} props.title - Card title
 * @param {string} props.className - Additional CSS classes
 */
export default function ShopCategoryCard({ href, image, alt, title, className }) {
  // Fallback href if not provided
  const linkHref = href || "#";

  return (
    <Link
      href={linkHref}
      className={cn("group cursor-pointer block", className)}
    >
      <div className="bg-white rounded-3xl overflow-hidden  transition-all duration-300 transform hover:-translate-y-2">
        {/* Image Container */}
        <div className="aspect-[6/7] overflow-hidden relative">
          <BaseImage
            src={image}
            alt={alt || title}
            fill
            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 450px) 100vw, (max-width: 600px) 50vw, 33vw"
          />
        </div>

        {/* Title */}
        <div className="p-4 text-center">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        </div>
      </div>
    </Link>
  );
}
