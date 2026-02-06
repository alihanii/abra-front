"use client";

import Link from "next/link";
import BaseImage from "@/components/ui/BaseImage";
import { cn } from "@/lib/utils";

/**
 * Category Card Component
 * Card component for category display with image, title, and description
 *
 * @param {Object} props
 * @param {string} props.href - Link destination
 * @param {string} props.image - Image URL
 * @param {string} props.alt - Image alt text
 * @param {string} props.title - Card title
 * @param {string} props.description - Card description
 * @param {number} props.delay - Animation delay in milliseconds
 * @param {string} props.className - Additional CSS classes
 */
export default function CategoryCard({
  href,
  image,
  alt,
  title,
  description,
  delay = 0,
  className
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group cursor-pointer  relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative h-[280px] overflow-hidden">
        {/* Image */}
        {image ? (
          <BaseImage
            src={image}
            alt={alt || title}
            fill
            className="object-cover object-center group-hover:scale-110 transition-transform duration-700 z-0"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <i className="ri-image-line text-5xl text-gray-400"></i>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20">
          <h3 className="text-2xl font-bold mb-1">{title}</h3>
          <p className="text-sm opacity-90">{description}</p>
        </div>
      </div>
    </Link>
  );
}
