"use client";

import CategoryCard from "./CategoryCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { BaseSkeleton } from "@/components/ui";
import { useHomeCategories } from "@/hooks/useApi";

/**
 * Category Grid Component
 * Grid layout for displaying category cards (fetched from API)
 */
export default function CategoryGrid() {
  const { data, isLoading, isError } = useHomeCategories({
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  const categories = data?.results ?? [];

  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <BaseSkeleton
                key={i}
                isLoading
                variant="rectangular"
                className="h-[280px] w-full rounded-2xl"
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
            <ScrollReveal
              key={category.id}
              animation="fadeUp"
              delay={index * 100}
              className="overflow-hidden rounded-2xl"
            >
              <CategoryCard
                href={category.href}
                image={category.image}
                alt={category.title}
                title={category.title}
                description={category.description}
                delay={index * 100}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
