"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from 'next-intl';
import FilterDropdown from "./FilterDropdown";
import BaseInput from "@/components/ui/BaseInput";
import { useCategories } from "@/hooks/useApi";
import { cn } from "@/lib/utils";

/**
 * ProductFilters Component (Molecule)
 * Filter section for products page with multiple filter dropdowns
 *
 * @param {Object} props
 * @param {Object} props.filters - Current filter values
 * @param {Function} props.onFiltersChange - Callback when filters change
 * @param {string} props.className - Additional CSS classes
 */
export default function ProductFilters({ filters = {}, onFiltersChange, className }) {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);

  // Fetch categories from API
  const { data: categoriesResponse, isLoading: isLoadingCategories } = useCategories(
    { page: 1 },
    {
      staleTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false
    }
  );

  // Use filters.search directly instead of local state
  const searchValue = filters.search || "";

  const handleFilterChange = (filterKey, value) => {
    const newFilters = {
      ...filters,
      [filterKey]: value
    };
    onFiltersChange?.(newFilters);
  };

  const handleSearchChange = (value) => {
    const newFilters = {
      ...filters,
      search: value.trim() || undefined
    };
    onFiltersChange?.(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {};
    onFiltersChange?.(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some((value) => {
    if (Array.isArray(value)) return value.length > 0;
    return value !== null && value !== undefined && value !== "";
  });

  const toggleFilters = () => {
    setIsOpen((prev) => !prev);
  };

  // Build category options from API response
  const categoryOptions = useMemo(() => {
    const options = [{ value: "all", label: t('filters.allCategories') }];

    if (categoriesResponse?.results) {
      categoriesResponse.results.forEach((category) => {
        options.push({
          value: category.slug,
          label: category.label || category.name
        });
      });
    }

    return options;
  }, [categoriesResponse, t]);

  const priceOptions = [
    { value: "all", label: t('filters.allPrices') },
    { value: "0-1000000", label: "0 - 100,000" },
    { value: "1000000-6000000", label: "100,000 - 600,000" },
    { value: "6000000-11000000", label: "600,000 - 1,100,000" },
    { value: "11000000+", label: "1100,000+" }
  ];

  const sizeOptions = [
    { value: "all", label: t('filters.allSizes') },
    { value: "xs", label: "XS" },
    { value: "s", label: "S" },
    { value: "m", label: "M" },
    { value: "l", label: "L" },
    { value: "xl", label: "XL" },
    { value: "xxl", label: "XXL" }
  ];

  const colorOptions = [
    { value: "all", label: t('filters.allColors') },
    { value: "black", label: t('filters.colorBlack') },
    { value: "white", label: t('filters.colorWhite') },
    { value: "gray", label: t('filters.colorGray') },
    { value: "navy", label: t('filters.colorNavy') },
    { value: "olive", label: t('filters.colorOlive') },
    { value: "red", label: t('filters.red') },
    { value: "burgundy", label: t('filters.colorBurgundy') }
  ];

  const sortOptions = [
    { value: "default", label: t('filters.default') },
    { value: "price-low", label: t('filters.priceLowToHigh') },
    { value: "price-high", label: t('filters.priceHighToLow') },
    { value: "name-asc", label: t('filters.nameAToZ') },
    { value: "name-desc", label: t('filters.nameZToA') },
    { value: "newest", label: t('filters.newestFirst') }
  ];

  // Map sort value to API format
  const getSortParams = (sortValue) => {
    switch (sortValue) {
      case "price-low":
        return { order_by: "price", order: "asc" };
      case "price-high":
        return { order_by: "price", order: "desc" };
      case "name-asc":
        return { order_by: "name", order: "asc" };
      case "name-desc":
        return { order_by: "name", order: "desc" };
      case "newest":
        return { order_by: "created_at", order: "desc" };
      default:
        return { order_by: "name", order: "asc" };
    }
  };

  return (
    <div
      className={cn(
        "bg-white border-b-2 border-gray-200 sticky top-[72px] z-40",
        "overflow-visible",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-6 overflow-visible">
        {/* Filter Toggle Button */}
        <div className="flex items-center justify-between py-2 border-b border-gray-200 md:border-0 md:py-0 overflow-visible">
          <button
            type="button"
            onClick={toggleFilters}
            className={cn(
              "flex items-center gap-1 px-2 py-1",
              "text-gray-900 font-semibold text-xs",
              "border-2 border-gray-200 rounded-lg",
              "hover:bg-gray-50 hover:border-gray-900",
              "transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2",
              "md:hidden"
            )}
            aria-expanded={isOpen}
            aria-label={t('filters.toggleFilters')}
          >
            <i className="ri-filter-3-line text-base" />
            <span>{t('filters.toggleFilters')}</span>
            <i
              className={cn(
                "ri-arrow-down-s-line text-base transition-transform duration-200",
                isOpen && "transform rotate-180"
              )}
            />
          </button>

          {/* Desktop: Always visible filters */}
          <div className="hidden md:flex items-center gap-4 flex-1 py-4 overflow-visible">
            {/* Search Input */}
            <div className="min-w-[200px] max-w-[300px]">
              <BaseInput
                type="text"
                placeholder={t('filters.searchProducts')}
                value={searchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                variant="primary"
                size="sm"
                className="mb-0"
                inputClassName="rounded-lg"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 flex-1 overflow-visible relative">
              <FilterDropdown
                label={t('filters.category')}
                options={categoryOptions}
                value={filters.category || "all"}
                onChange={(value) => handleFilterChange("category", value)}
                className="min-w-[120px]"
              />

              <FilterDropdown
                label={t('filters.price')}
                options={priceOptions}
                value={filters.price || "all"}
                onChange={(value) => handleFilterChange("price", value)}
                className="min-w-[120px]"
              />

              <FilterDropdown
                label={t('filters.size')}
                options={sizeOptions}
                value={filters.size || "all"}
                onChange={(value) => handleFilterChange("size", value)}
                className="min-w-[100px]"
              />

              <FilterDropdown
                label={t('filters.color')}
                options={colorOptions}
                value={filters.color || "all"}
                onChange={(value) => handleFilterChange("color", value)}
                className="min-w-[120px]"
              />

              <FilterDropdown
                label={t('filters.sortBy')}
                options={sortOptions}
                value={filters.sort || "default"}
                onChange={(value) => handleFilterChange("sort", value)}
                className="min-w-[140px]"
              />
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium text-gray-700",
                  "border-2 border-gray-300 rounded-lg",
                  "hover:bg-gray-50 hover:border-gray-900",
                  "transition-colors duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2",
                  "whitespace-nowrap"
                )}
              >
                <i className="ri-close-line mr-1 text-xs" />
                {t('filters.clearFilters')}
              </button>
            )}
          </div>

          {/* Mobile: Clear Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className={cn(
                "px-3 py-1.5 text-xs font-medium text-gray-700",
                "border-2 border-gray-300 rounded-lg",
                "hover:bg-gray-50 hover:border-gray-900",
                "transition-colors duration-200",
                "focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2",
                "whitespace-nowrap",
                "md:hidden"
              )}
            >
              <i className="ri-close-line mr-1 text-xs" />
              {t('filters.clear')}
            </button>
          )}
        </div>

        {/* Mobile: Collapsible Filter Panel */}
        <div
          className={cn(
            "md:hidden overflow-visible transition-all duration-300 ease-in-out",
            isOpen ? "max-h-[800px] opacity-100 pb-4" : "max-h-0 opacity-0 overflow-hidden"
          )}
        >
          <div className="flex flex-col gap-3 pt-4 mx-1 overflow-visible relative">
            {/* Search Input */}
            <BaseInput
              type="text"
              placeholder={t('filters.searchProducts')}
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              variant="primary"
              size="sm"
              className="mb-0"
              inputClassName="rounded-lg"
            />

            <FilterDropdown
              label={t('filters.category')}
              options={categoryOptions}
              value={filters.category || "all"}
              onChange={(value) => handleFilterChange("category", value)}
            />

            <FilterDropdown
              label={t('filters.price')}
              options={priceOptions}
              value={filters.price || "all"}
              onChange={(value) => handleFilterChange("price", value)}
            />

            <FilterDropdown
              label={t('filters.size')}
              options={sizeOptions}
              value={filters.size || "all"}
              onChange={(value) => handleFilterChange("size", value)}
            />

            <FilterDropdown
              label={t('filters.color')}
              options={colorOptions}
              value={filters.color || "all"}
              onChange={(value) => handleFilterChange("color", value)}
            />

            <FilterDropdown
              label={t('filters.sortBy')}
              options={sortOptions}
              value={filters.sort || "default"}
              onChange={(value) => handleFilterChange("sort", value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
