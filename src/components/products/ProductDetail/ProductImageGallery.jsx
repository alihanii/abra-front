"use client";

import { useState } from "react";
import BaseImage from "@/components/ui/BaseImage";
import { cn } from "@/lib/utils";

/**
 * ProductImageGallery Component
 * Displays product images with thumbnail navigation
 *
 * @param {Object} props
 * @param {Array} props.images - Array of image objects [{id, url, alt}]
 * @param {number} props.selectedIndex - Currently selected image index
 * @param {Function} props.onImageSelect - Callback when image is selected
 * @param {string} props.className - Additional CSS classes
 */
export default function ProductImageGallery({
  images = [],
  selectedIndex = 0,
  onImageSelect,
  className
}) {
  const [isZoomed, setIsZoomed] = useState(false);

  if (!images || images.length === 0) return null;

  const handleThumbnailClick = (index) => {
    if (onImageSelect) {
      onImageSelect(index);
    }
  };

  const handleZoomClick = () => {
    setIsZoomed(!isZoomed);
  };

  const currentImage = images[selectedIndex] || images[0];

  return (
    <div className={cn("flex flex-row gap-3", className)}>
      {/* Thumbnail Grid - Vertical */}
      {images.length > 1 && (
        <div className="flex flex-col gap-2 order-2 lg:order-1 max-h-[240px] lg:max-h-[400px] overflow-y-auto overflow-x-hidden pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-400"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#d1d5db transparent'
          }}
        >
          {images.map((image, index) => (
            <button
              key={image.id || image.url || index}
              onClick={() => handleThumbnailClick(index)}
              className={cn(
                "w-16 h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 relative",
                index === selectedIndex
                  ? "border-gray-900"
                  : "border-transparent hover:border-gray-300"
              )}
              aria-label={`View image ${index + 1}`}
            >
              <BaseImage
                src={image.url || image}
                alt={image.alt || `View ${index + 1}`}
                fill
                className="object-cover object-top"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg flex-1 order-1 lg:order-2">
        <div className="aspect-square relative group">
          <BaseImage
            src={currentImage?.url || currentImage}
            alt={currentImage?.alt || "Product image"}
            fill
            className="object-cover object-top"
          />
          {/* <button
            onClick={handleZoomClick}
            className="absolute top-3 right-3 w-10 h-10 lg:w-12 lg:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors cursor-pointer z-20"
            aria-label="Zoom image"
          >
            <i className="ri-zoom-in-line text-lg lg:text-xl text-gray-900"></i>
          </button> */}
        </div>
      </div>
    </div>
  );
}
