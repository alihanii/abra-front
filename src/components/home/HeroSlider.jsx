"use client";

import { useState, useEffect } from "react";
import HeroSlide from "./HeroSlide";
import SliderDots from "./SliderDots";
import { useBanners } from "@/hooks/useApi";

/**
 * Hero Slider Component
 * Auto-playing hero slider with navigation dots
 * Fetches slides data from API using TanStack Query
 */
export default function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  const { data, isLoading, isError } = useBanners({
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  const slides = data?.results ?? [];

  // Auto-play slider
  useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const handleDotClick = (index) => {
    setActiveIndex(index);
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <section className="relative overflow-hidden bg-white">
        <div className="relative h-[400px] md:h-[500px] animate-pulse bg-gray-100" />
      </section>
    );
  }

  // Don't render if no slides or error
  if (isError || slides.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="relative h-[400px] md:h-[500px] font-maneli">
        {slides.map((slide, index) => (
          <HeroSlide
            key={slide.id}
            title={slide.title}
            subtitle={slide.subtitle}
            buttonText={slide.buttonText}
            buttonHref={slide.buttonHref}
            gradientFrom={slide.gradientFrom}
            gradientTo={slide.gradientTo}
            image={slide.image}
            isActive={index === activeIndex}
          />
        ))}
      </div>

      <SliderDots
        totalSlides={slides.length}
        activeIndex={activeIndex}
        onDotClick={handleDotClick}
      />
    </section>
  );
}
