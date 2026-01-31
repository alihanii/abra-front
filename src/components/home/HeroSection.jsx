'use client';

import BaseButton from '@/components/ui/BaseButton';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { ROUTES } from '@/config/routes';

/**
 * Hero Section Component
 * Large hero section with background image and call-to-action buttons
 */
export default function HeroSection() {

  return (
    <section
      className="relative min-h-[400px] sm:min-h-[500px] md:min-h-[600px] flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(var(--color-sky-light-rgb), 0.95) 0%, rgba(var(--color-sky-light-rgb), 0.95) 50%, var(--color-white) 100%)`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 w-full">
        <div className="max-w-xl">
          <ScrollReveal animation="slideRight" delay={0}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Design Your Dream Clothing
            </h1>
          </ScrollReveal>
          <ScrollReveal animation="fadeIn" delay={50}>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 sm:mb-8 md:mb-10 leading-relaxed">
              Create custom designs or choose from our ready-made collection.
              Premium quality cotton clothing with professional printing.
            </p>
          </ScrollReveal>
          <ScrollReveal animation="fadeUp" delay={100}>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <BaseButton
                href={ROUTES.DESIGN_STUDIO}
                variant="primary"
                size="lg"
                className="shadow-lg hover:shadow-xl"
              >
                Start Custom Design
              </BaseButton>
              <BaseButton
                href={ROUTES.PRODUCTS}
                variant="secondary"
                size="lg"
                className="shadow-lg hover:shadow-xl"
                >
                Buy Ready Designs
              </BaseButton>
            </div>
                </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

