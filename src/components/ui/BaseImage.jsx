"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import emptyPhoto from "@/assets/images/EmptyPhoto.png";

/**
 * Validate if a string is a valid URL
 * @param {string} url - URL string to validate
 * @returns {boolean}
 */
function isValidUrl(url) {
  if (!url || typeof url !== "string") {
    return false;
  }

  // Check if it's a relative path (starts with /)
  if (url.startsWith("/")) {
    return true;
  }

  // Check if it's a data URL
  if (url.startsWith("data:")) {
    return true;
  }

  // Check if it's an imported image (object with src property)
  if (typeof url === "object" && url.src) {
    return true;
  }

  // Try to construct URL for absolute URLs
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * BaseImage Component
 * Image component with loading placeholder, error handling, and fallback
 *
 * @param {Object} props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alt text for image
 * @param {number} props.width - Image width (required if fill is false)
 * @param {number} props.height - Image height (required if fill is false)
 * @param {boolean} props.fill - Use fill layout (default: false)
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.fallback - Fallback image source (default: EmptyPhoto)
 * @param {Object} props.imageProps - Additional props to pass to Next.js Image component
 */
export default function BaseImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = "",
  fallback = emptyPhoto,
  ...imageProps
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Validate URL and determine initial source
  const validatedSrc = useMemo(() => {
    if (!src) {
      return null;
    }

    if (!isValidUrl(src)) {
      return null;
    }

    return src;
  }, [src]);

  // Determine the source to use
  const finalSrc = hasError || !validatedSrc ? fallback : (validatedSrc || fallback);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };
  
  // Reset loading when src changes - using key prop on Image component instead
  // This will cause component to remount when src changes

  // Check if we should use unoptimized (for localhost/127.0.0.1 URLs)
  // Next.js Image Optimization doesn't work well with localhost URLs
  const shouldUnoptimize = typeof finalSrc === "string" && 
    (finalSrc.includes("127.0.0.1") || 
     (finalSrc.includes("localhost") && finalSrc.includes(":8000")));

  // Check if fill prop is provided (from props or imageProps)
  const useFill = fill || imageProps.fill || false;

  // If fill is true, render without wrapper div (for absolute positioning)
  if (useFill) {
    return (
      <>
        {/* Loading Placeholder */}
        {isLoading && (
          <div
            className="absolute inset-0 bg-gray-100 animate-pulse z-0"
            aria-hidden="true"
          />
        )}

        {/* Image */}
        <Image
          src={finalSrc}
          alt={alt || "Image"}
          fill
          unoptimized={shouldUnoptimize}
          className={`
            relative z-10 object-cover transition-opacity duration-300
            ${isLoading ? "opacity-0" : "opacity-100"}
            ${className}
          `}
          onLoad={handleLoad}
          onError={handleError}
          {...imageProps}
        />
      </>
    );
  }

  // Default layout with width/height
  return (
    <div
      className={`
        relative bg-gray-100 overflow-hidden
        before:content-[''] before:absolute before:inset-0 before:bg-gray-100 before:z-0
        ${isLoading ? "before:block" : "before:hidden"}
        ${className}
      `}
      style={{
        width: width || "100%",
        height: height || "100%",
        aspectRatio: width && height ? `${width} / ${height}` : undefined
      }}
    >
      {/* Image */}
      <Image
        src={finalSrc}
        alt={alt || "Image"}
        width={width || 400}
        height={height || 400}
        unoptimized={shouldUnoptimize}
        className={`
          relative z-10 w-full h-full object-cover object-top transition-opacity duration-300
          ${isLoading ? "opacity-0" : "opacity-100"}
        `}
        onLoad={handleLoad}
        onError={handleError}
        {...imageProps}
      />
    </div>
  );
}
