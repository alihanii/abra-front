"use client";

import { useMemo } from "react";
import { useTranslations } from 'next-intl';
import { useCategories } from "@/hooks/useApi";
import { ROUTES } from "@/config/routes";
import ShopCategoryCard from "@/components/home/ShopCategoryCard";
import { BaseSkeleton } from "@/components/ui";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { decodeImageUrl } from "@/lib/utils";

/**
 * Categories Page
 * Displays all categories in a grid layout
 */
export default function CategoriesPage() {
  const t = useTranslations();
  
  // Fetch categories from API
  const { data: categoriesResponse, isLoading, error } = useCategories({
    page: 1,
    page_size: 100, // Get all categories
  });

  // Transform API data to component format
  const categories = useMemo(() => {
    if (!categoriesResponse?.results) return [];

    return categoriesResponse.results.map((category) => ({
      id: category.id,
      title: category.label || category.name,
      href: `${ROUTES.PRODUCTS}?category=${category.slug}`,
      image: decodeImageUrl(category.image || ""),
      slug: category.slug,
      name: category.name,
      label: category.label
    }));
  }, [categoriesResponse]);

  return (
    <main className="min-h-screen bg-[var(--color-sky-light)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <ScrollReveal animation="fadeUp" delay={0}>
          <div className="mb-8 md:mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('categories.title', { defaultValue: 'دسته‌بندی‌ها' })}
            </h1>
            <p className="text-lg md:text-xl text-gray-700">
              {t('categories.subtitle', { defaultValue: 'تمام دسته‌بندی‌های محصولات ما' })}
            </p>
          </div>
        </ScrollReveal>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <ShopCategoryCard key={`skeleton-${index}`} isLoading={true} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-20">
            <i className="ri-error-warning-line text-6xl text-red-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {t('categories.errorTitle', { defaultValue: 'خطا در بارگذاری دسته‌بندی‌ها' })}
            </h3>
            <p className="text-gray-500 text-center">
              {t('categories.errorMessage', { defaultValue: 'لطفاً دوباره تلاش کنید.' })}
            </p>
          </div>
        )}

        {/* Categories Grid */}
        {!isLoading && !error && categories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {categories.map((category, index) => {
              const animations = ["fadeUp", "slideLeft", "slideRight"];
              const animation = animations[index % animations.length];

              return (
                <ScrollReveal
                  key={category.id}
                  animation={animation}
                  delay={index * 100}
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
        )}

        {/* Empty State */}
        {!isLoading && !error && categories.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <i className="ri-folder-line text-6xl text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {t('categories.emptyTitle', { defaultValue: 'دسته‌بندی‌ای وجود ندارد' })}
            </h3>
            <p className="text-gray-500 text-center">
              {t('categories.emptyMessage', { defaultValue: 'در حال حاضر دسته‌بندی‌ای برای نمایش وجود ندارد.' })}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

