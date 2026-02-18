"use client";

import { useRef, useMemo } from "react";
import { useTranslations } from 'next-intl';
import CategorySlider from "./CategorySlider";
import ShopCategoryCard from "./ShopCategoryCard";
import ScrollNavigation from "@/components/ui/ScrollNavigation";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { ROUTES } from "@/config/routes";
import { useCategories } from "@/hooks/useApi";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { decodeImageUrl } from "@/lib/utils";

/**
 * Shop by Category Section
 * Displays categories with horizontal scroll on desktop and vertical grid on mobile
 */
export default function ShopByCategory() {
  const t = useTranslations();
  const sliderRef = useRef(null);

  // Fetch categories from API
  const { data: categoriesResponse, isLoading, error } = useCategories({
    page: 1,
  });

  // Transform API data to component format
  const categories = useMemo(() => {
    if (!categoriesResponse?.results) return [];

    return categoriesResponse.results.map((category) => ({
      id: category.id,
      title: category.label || category.name,
      href: `${ROUTES.PRODUCTS}?category=${category.slug}`,
      image: decodeImageUrl(category.image || "")
    }));
  }, [categoriesResponse]);

  const handleScrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft();
    }
  };

  const handleScrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollRight();
    }
  };


  // Error state
  if (error) {
    return (
      <section className="py-20 bg-[var(--color-sky-light)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <p className="text-red-600">{t('shopByCategory.loadError')}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-[var(--color-sky-light)]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <ScrollReveal
          animation="fadeUp"
          delay={0}
        >
          <div className="flex items-center justify-between mb-12">
            <ScrollReveal
              animation="slideRight"
              delay={100}
            >
              <div className="text-start md:text-left flex-1">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  {t('shopByCategory.title')}
                </h2>
                <p className="text-lg sm:text-xl text-gray-700 text-start ">{t('shopByCategory.subtitle')}</p>
              </div>
            </ScrollReveal>

            {/* Desktop Navigation Buttons */}
            {!isLoading && (
              <ScrollReveal
                animation="slideLeft"
                delay={200}
              >
                <ScrollNavigation
                  scrollRef={sliderRef}
                  onScrollLeft={handleScrollLeft}
                  onScrollRight={handleScrollRight}
                />
              </ScrollReveal>
            )}
          </div>
        </ScrollReveal>

        {/* Loading State */}
        {isLoading ? (
          <>
            {/* Desktop Skeleton Slider */}
            <div className="hidden md:block relative overflow-hidden">
              <div className="flex gap-8 overflow-x-auto scrollbar-hide scroll-smooth pb-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="shrink-0 w-[calc(25%-18px)]"
                  >
                    <ShopCategoryCard isLoading={true} />
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Skeleton Grid */}
            <div className="md:hidden grid grid-cols-1 gap-8">
              {Array.from({ length: 4 }).map((_, index) => (
                <ShopCategoryCard
                  key={`skeleton-mobile-${index}`}
                  isLoading={true}
                />
              ))}
            </div>
          </>
        ) : categories && categories.length > 0 ? (
          <>
            {/* Desktop Slider */}
            <div className="hidden md:block">
              <CategorySlider
                ref={sliderRef}
                categories={categories}
              />
            </div>

            {/* Mobile Grid */}
            <div className="md:hidden grid grid-cols-1 gap-8">
              {categories.map((category, index) => {
                const animations = ["fadeUp", "slideLeft", "slideRight"];
                const animation = animations[index % animations.length];

                return (
                  <ScrollReveal
                    key={category.id}
                    animation={animation}
                    delay={index * 150}
                  >
                    <ShopCategoryCard
                      href={category.href}
                      image={category.image}
                      alt={category.title}
                      title={category.title}
                    />
                  </ScrollReveal>
                );
              })}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
