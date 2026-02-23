"use client";

import { useMemo } from "react";
import { useTranslations } from 'next-intl';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { ProductFilters, ProductGrid } from "@/components/products";
import { ROUTES } from "@/config/routes";
import { useProducts } from "@/hooks/useApi";


/**
 * Map API product response to component format
 * @param {Object} apiProduct - Product from API
 * @returns {Object} Mapped product for component
 */
const mapApiProductToComponent = (apiProduct) => {
  return {
    id: apiProduct.productId || apiProduct.slug,
    slug: apiProduct.productId,
    name: apiProduct.name,
    price: apiProduct.price,
    image: apiProduct.images?.[0] || [],
    href: `${ROUTES.PRODUCTS}/${apiProduct.productId}`,
    badge: null, // Can be added based on product data if needed
    category: apiProduct.category,
    color: Object.keys(apiProduct.colors || {})[0] || null,
    // Include full product data for ProductCard component
    ...apiProduct
  };
};

/**
 * Convert filter values to API parameters
 * Formats arrays correctly for axios (axios automatically converts arrays to ?key=value1&key=value2)
 * @param {Object} filters - Filter values from component
 * @returns {Object} API parameters
 */
const convertFiltersToApiParams = (filters) => {
  const params = {};

  // Pagination
  if (filters.page) {
    params.page = filters.page;
  } else {
    params.page = 1;
  }
  
  if (filters.page_size) {
    params.page_size = Math.min(filters.page_size, 100); // Max 100
  } else {
    params.page_size = 20;
  }

  // Category (string)
  if (filters.category && filters.category !== "all") {
    params.category = filters.category;
  }

  // Color (array) - axios will convert to ?color=black&color=white
  if (filters.color && filters.color !== "all") {
    if (Array.isArray(filters.color)) {
      // Filter out "all" values if any
      const validColors = filters.color.filter(c => c !== "all");
      if (validColors.length > 0) {
        params.color = validColors;
      }
    } else {
      params.color = [filters.color];
    }
  }

  // Size (array) - axios will convert to ?size=s&size=m
  if (filters.size && filters.size !== "all") {
    if (Array.isArray(filters.size)) {
      // Filter out "all" values if any
      const validSizes = filters.size.filter(s => s !== "all");
      if (validSizes.length > 0) {
        params.size = validSizes;
      }
    } else {
      params.size = [filters.size];
    }
  }

  // Price range
  if (filters.price && filters.price !== "all") {
    const priceRange = filters.price.split("-");
    if (priceRange.length === 2) {
      const min = parseFloat(priceRange[0]);
      const max = priceRange[1].endsWith("+")
        ? undefined
        : parseFloat(priceRange[1]);
      if (!isNaN(min)) {
        params.min_price = min;
      }
      if (max !== undefined && !isNaN(max)) {
        params.max_price = max;
      }
    } else if (priceRange[0].endsWith("+")) {
      // Handle "40+" case
      const min = parseFloat(priceRange[0].replace("+", ""));
      if (!isNaN(min)) {
        params.min_price = min;
      }
    }
  }

  // Search
  if (filters.search && filters.search.trim()) {
    params.search = filters.search.trim();
  }

  // ID filter (string)
  if (filters.id) {
    params.id = filters.id;
  }

  // ProductId (array) - if needed
  if (filters.productId) {
    if (Array.isArray(filters.productId)) {
      params.productId = filters.productId;
    } else {
      params.productId = [filters.productId];
    }
  }

  // Sort
  if (filters.sort && filters.sort !== "default") {
    switch (filters.sort) {
      case "price-low":
        params.order_by = "price";
        params.order = "asc";
        break;
      case "price-high":
        params.order_by = "price";
        params.order = "desc";
        break;
      case "name-asc":
        params.order_by = "name";
        params.order = "asc";
        break;
      case "name-desc":
        params.order_by = "name";
        params.order = "desc";
        break;
      case "newest":
        params.order_by = "created_at";
        params.order = "desc";
        break;
      default:
        params.order_by = "name";
        params.order = "asc";
    }
  } else {
    // Default sort
    params.order_by = "name";
    params.order = "asc";
  }

  return params;
};

/**
 * Filter configuration for URL sync
 * Defines how each filter should be handled when converting between URL and state
 */
const FILTER_CONFIG = {
  category: { 
    multiple: false, 
    defaultValue: 'all',
    transform: (val) => val 
  },
  color: { 
    multiple: true, 
    defaultValue: 'all',
    transform: (val) => val 
  },
  size: { 
    multiple: true, 
    defaultValue: 'all',
    transform: (val) => val 
  },
  price: { 
    multiple: false, 
    defaultValue: 'all',
    transform: (val) => val 
  },
  search: { 
    multiple: false, 
    defaultValue: '',
    transform: (val) => val?.trim() || '',
    skipIfEmpty: true
  },
  sort: { 
    multiple: false, 
    defaultValue: 'default',
    transform: (val) => val 
  },
  page: { 
    multiple: false, 
    defaultValue: 1,
    transform: (val) => parseInt(val, 10),
    skipIf: (val) => !val || val <= 1
  }
};

/**
 * Convert URL search params to filters object
 * @param {URLSearchParams} searchParams - URL search parameters
 * @returns {Object} Filters object
 */
const urlParamsToFilters = (searchParams) => {
  const filters = {};
  
  Object.entries(FILTER_CONFIG).forEach(([key, config]) => {
    if (config.multiple) {
      const values = searchParams.getAll(key);
      if (values.length > 0) {
        filters[key] = values.length === 1 ? config.transform(values[0]) : values.map(config.transform);
      }
    } else {
      const value = searchParams.get(key);
      if (value) {
        filters[key] = config.transform(value);
      }
    }
  });
  
  return filters;
};

/**
 * Convert filters object to URL search params
 * @param {Object} filters - Filters object
 * @returns {URLSearchParams} URL search parameters
 */
const filtersToUrlParams = (filters) => {
  const params = new URLSearchParams();
  
  Object.entries(FILTER_CONFIG).forEach(([key, config]) => {
    const value = filters[key];
    
    // Skip if value is default or empty
    if (value === undefined || value === null) return;
    if (value === config.defaultValue) return;
    if (config.skipIfEmpty && (!value || value === '')) return;
    if (config.skipIf && config.skipIf(value)) return;
    
    // Handle multiple values
    if (config.multiple && Array.isArray(value)) {
      value.forEach(v => {
        if (v && v !== 'all') {
          params.append(key, v);
        }
      });
    } else if (config.multiple && value !== 'all') {
      params.append(key, value);
    } else if (!config.multiple && value !== 'all') {
      params.set(key, value);
    }
  });
  
  return params;
};

/**
 * Products Page
 * Displays products with filtering and sorting capabilities
 */
export default function ProductsPage() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  // Derive filters directly from URL params (single source of truth)
  const filters = useMemo(() => urlParamsToFilters(searchParams), [searchParams]);
  
  // Update URL when filters change (user interaction)
  const handleFiltersChange = (newFilters) => {
    const params = filtersToUrlParams(newFilters);
    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(newUrl, { scroll: false });
  };

  // Convert filters to API parameters
  const apiParams = useMemo(() => {
    return convertFiltersToApiParams(filters);
  }, [filters]);

  // Fetch products from API
  const {
    data: productsResponse,
    isLoading,
    isError,
    error
  } = useProducts(apiParams, {
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false
  });

  // Map API products to component format
  const products = useMemo(() => {
    if (!productsResponse?.results) return [];
    return productsResponse.results.map(mapApiProductToComponent);
  }, [productsResponse]);

  // Get total count from API response
  const totalCount = productsResponse?.count || 0;

  return (
    <main className="min-h-screen bg-[var(--color-sky-light)]">
      {/* Filters Section */}
      <ProductFilters filters={filters} onFiltersChange={handleFiltersChange} />

      {/* Products Grid Section */}
      <div className="max-w-7xl mx-auto px-1 sm:px-6 pt-2 sm:py-8">
        {/* Results Count */}
        <div className="mb-6 md:px-0 px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 mt-4">{t('products.title')}</h1>
          {isLoading ? (
            <p className="text-gray-700">{t('products.loading')}</p>
          ) : isError ? (
            <p className="text-red-600">
              {t('products.errorMessage', { message: error?.message || t('products.unknownError') })}
            </p>
          ) : (
            <p className="text-gray-700">
              {t('products.showing', { count: products.length, total: totalCount })}
            </p>
          )}
        </div>

        {/* Products Grid */}
        {isError ? (
          <div className="flex flex-col items-center justify-center py-20">
            <i className="ri-error-warning-line text-6xl text-red-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">{t('products.errorTitle')}</h3>
            <p className="text-gray-500 text-center">
              {error?.message || t('products.tryAgain')}
            </p>
          </div>
        ) : (
          <ProductGrid products={products} isLoading={isLoading} skeletonCount={12} />
        )}
      </div>
    </main>
  );
}
