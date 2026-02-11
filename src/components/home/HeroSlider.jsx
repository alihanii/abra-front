"use client";

import { useState, useEffect } from "react";
import HeroSlide from "./HeroSlide";
import SliderDots from "./SliderDots";
import { ROUTES } from "@/config/routes";

/**
 * Hero Slider Data Configuration
 */
const SLIDES = [
  {
    id: 1,
    title: "Weekly Special: Couple Sets",
    subtitle: "Save 25% on matching couple designs",
    buttonText: "Shop Couples",
    buttonHref: ROUTES.MATCHING_SETS,
    gradientFrom: "from-blue-50",
    gradientTo: "to-blue-100",
    image: {
      // Add image URLs here for responsive images
      // sm: '/images/hero/couple-sets-sm.jpg',
      // md: '/images/hero/couple-sets-md.jpg',
      // lg: '/images/hero/couple-sets-lg.jpg',
    }
  },
  {
    id: 2,
    title: "New Arrivals: Spring Collection",
    subtitle: "Fresh designs for the new season",
    buttonText: "Explore Now",
    buttonHref: ROUTES.PRODUCTS,
    gradientFrom: "from-purple-50",
    gradientTo: "to-pink-50",
    image: {
      sm: "https://readdy.ai/api/search-image?query=Premium%20black%20hoodie%20front%20view%20mockup%20on%20clean%20white%20background%2C%20minimalist%20product%20photography%2C%20soft%20natural%20lighting%2C%20professional%20e-commerce%20style%2C%20centered%20composition%2C%20high%20resolution%2C%20modern%20casual%20wear%2C%20cotton%20fabric%20texture%20visible%2C%20no%20wrinkles%2C%20studio%20shot%2C%20commercial%20photography&width=400&height=500&seq=cart1&orientation=portrait",
      md: "https://readdy.ai/api/search-image?query=Premium%20black%20hoodie%20front%20view%20mockup%20on%20clean%20white%20background%2C%20minimalist%20product%20photography%2C%20soft%20natural%20lighting%2C%20professional%20e-commerce%20style%2C%20centered%20composition%2C%20high%20resolution%2C%20modern%20casual%20wear%2C%20cotton%20fabric%20texture%20visible%2C%20no%20wrinkles%2C%20studio%20shot%2C%20commercial%20photography&width=400&height=500&seq=cart1&orientation=portrait",
      lg: "https://readdy.ai/api/search-image?query=Premium%20black%20hoodie%20front%20view%20mockup%20on%20clean%20white%20background%2C%20minimalist%20product%20photography%2C%20soft%20natural%20lighting%2C%20professional%20e-commerce%20style%2C%20centered%20composition%2C%20high%20resolution%2C%20modern%20casual%20wear%2C%20cotton%20fabric%20texture%20visible%2C%20no%20wrinkles%2C%20studio%20shot%2C%20commercial%20photography&width=400&height=500&seq=cart1&orientation=portrait"

      // Add image URLs here for responsive images
      // sm: '/images/hero/spring-sm.jpg',
      // md: '/images/hero/spring-md.jpg',
      // lg: '/images/hero/spring-lg.jpg',
    }
  },
  {
    id: 3,
    title: "Limited Offer: Custom Design",
    subtitle: "Get 20% off your first custom order",
    buttonText: "Start Designing",
    buttonHref: ROUTES.DESIGN_STUDIO,
    gradientFrom: "from-green-50",
    gradientTo: "to-teal-50",
    image: {
      // Add image URLs here for responsive images
      // sm: '/images/hero/custom-sm.jpg',
      // md: '/images/hero/custom-md.jpg',
      // lg: '/images/hero/custom-lg.jpg',
    }
  }
];

/**
 * Hero Slider Component
 * Auto-playing hero slider with navigation dots
 */
export default function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-play slider
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDES.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="relative h-[400px] md:h-[500px] font-maneli" >
        {SLIDES.map((slide, index) => (
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
        totalSlides={SLIDES.length}
        activeIndex={activeIndex}
        onDotClick={handleDotClick}
      />
    </section>
  );
}
