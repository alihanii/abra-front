"use client";

import { useTranslations } from "next-intl";
import CategoryCard from "./CategoryCard";
import { useHomeCategories } from "@/hooks/useApi";

/**
 * Category Grid Component
 * Grid layout for displaying category cards (fetched from API)
 */
export default function CategoryGrid() {
  const t = useTranslations();
  const { data, isLoading, isError } = useHomeCategories({
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  const categories = data?.results ?? [];

  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ animationDelay: `100ms` }}
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[280px] rounded-2xl bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.id}
              href={category.href}
              image={category.image}
              alt={t(category.title)}
              title={t(category.title)}
              description={t(category.description)}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
