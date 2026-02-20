"use client";

import Image from "next/image";
import BaseButton from "@/components/ui/BaseButton";

/**
 * Hero Slide Component
 * Individual slide for hero slider with optional background image
 *
 * @param {Object} props
 * @param {string} props.title - Slide title
 * @param {string} props.subtitle - Slide subtitle
 * @param {string} props.buttonText - Button text
 * @param {string} props.buttonHref - Button link
 * @param {string} props.gradientFrom - Gradient start color (hex, rgb, etc.)
 * @param {string} props.gradientTo - Gradient end color (hex, rgb, etc.)
 * @param {Object} props.image - Image object with sm, md, lg for responsive images
 * @param {boolean} props.isActive - Whether slide is active
 */
export default function HeroSlide({
  title,
  subtitle,
  buttonText,
  buttonHref,
  gradientFrom = "#eff6ff",
  gradientTo = "#dbeafe",
  image,
  isActive = false
}) {
  // Determine which image to use based on screen size
  const getImageSrc = () => {
    if (!image) return null;

    // Use responsive images: sm for mobile, md for tablet, lg for desktop
    // Fallback to lg if available, then md, then sm
    return image.lg || image.md || image.sm || null;
  };

  const imageSrc = getImageSrc();
  const hasImage = Boolean(imageSrc);

  return (
    <div
      className={`
        absolute inset-0 transition-opacity duration-1000
        ${isActive ? "opacity-100" : "opacity-0"}
      `}
    >
      <div className="relative h-full w-full">
        {/* Background Image - Behind everything */}
        {hasImage && (
          <div className="absolute inset-0 z-0">
            {/* Mobile Image */}
            {image.sm && (
              <Image
                src={image.sm}
                alt={title}
                fill
                unoptimized
                className="object-cover md:hidden"
                priority={isActive}
                sizes="100vw"
              />
            )}

            {/* Tablet Image */}
            {image.md && (
              <Image
                src={image.md}
                alt={title}
                fill
                unoptimized
                className="hidden object-cover md:block lg:hidden"
                priority={isActive}
                sizes="100vw"
              />
            )}

            {/* Desktop Image */}
            {image.lg && (
              <Image
                src={image.lg}
                alt={title}
                fill
                unoptimized
                className="hidden object-cover lg:block"
                priority={isActive}
                sizes="100vw"
              />
            )}

            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/20" />
          </div>
        )}

        {/* Gradient Background - inline style for dynamic colors */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background: `linear-gradient(to bottom right, ${gradientFrom}, ${gradientTo})`,
            opacity: hasImage ? 0.6 : 1
          }}
        />

        {/* Content */}
        <div className="relative z-20 h-full flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2
              className={`
                text-5xl md:text-6xl font-bold text-gray-900 mb-4
                ${isActive ? "animate-fadeIn" : ""}
              `}
            >
              {title}
            </h2>
            <p
              className={`
                text-2xl text-gray-700 mb-8
                ${isActive ? "animate-fadeIn" : ""}
              `}
            >
              {subtitle}
            </p>
            <BaseButton
              href={buttonHref}
              variant="primary"
              size="lg"
              className={isActive ? "animate-fadeIn" : ""}
            >
              {buttonText}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  );
}
