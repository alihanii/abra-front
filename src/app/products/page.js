"use client";

import { useState, useMemo } from "react";
import { ProductFilters, ProductGrid } from "@/components/products";
import { ROUTES } from "@/config/routes";
import { useProducts } from "@/hooks/useApi";

/**
 * Mock Products Data
 * Extended list for products page
 */
// const MOCK_PRODUCTS = [
//   {
//     id: 'prod-1',
//     name: 'Classic Black Hoodie',
//     price: 34.99,
//     image:
//       'https://readdy.ai/api/search-image?query=Premium%20black%20hoodie%20mockup%20on%20clean%20white%20background%2C%20minimalist%20product%20photography%2C%20soft%20natural%20lighting%2C%20professional%20e-commerce%20style%2C%20centered%20composition%2C%20high%20resolution%2C%20modern%20casual%20wear%2C%20cotton%20fabric%20texture%20visible%2C%20front%20view%2C%20no%20wrinkles%2C%20studio%20shot%2C%20commercial%20photography&width=500&height=600&seq=prod1&orientation=portrait',
//     badge: 'Bestseller',
//     href: `${ROUTES.PRODUCTS}/classic-black-hoodie`,
//     category: 'hoodies',
//     color: 'black',
//   },
//   {
//     id: 'prod-2',
//     name: 'White Cotton T-Shirt',
//     price: 19.99,
//     image:
//       'https://readdy.ai/api/search-image?query=Premium%20white%20t-shirt%20mockup%20on%20clean%20white%20background%2C%20minimalist%20product%20photography%2C%20soft%20natural%20lighting%2C%20professional%20e-commerce%20style%2C%20centered%20composition%2C%20high%20resolution%2C%20modern%20casual%20wear%2C%20cotton%20fabric%20texture%20visible%2C%20front%20view%2C%20no%20wrinkles%2C%20studio%20shot%2C%20commercial%20photography&width=500&height=600&seq=prod2&orientation=portrait',
//     badge: 'Popular',
//     href: `${ROUTES.PRODUCTS}/white-cotton-tshirt`,
//     category: 'tshirts',
//     color: 'white',
//   },
//   {
//     id: 'prod-3',
//     name: 'Navy Blue Sweatshirt',
//     price: 29.99,
//     image:
//       'https://readdy.ai/api/search-image?query=Premium%20navy%20blue%20sweatshirt%20mockup%20on%20clean%20white%20background%2C%20minimalist%20product%20photography%2C%20soft%20natural%20lighting%2C%20professional%20e-commerce%20style%2C%20centered%20composition%2C%20high%20resolution%2C%20modern%20casual%20wear%2C%20cotton%20fabric%20texture%20visible%2C%20front%20view%2C%20no%20wrinkles%2C%20studio%20shot%2C%20commercial%20photography&width=500&height=600&seq=prod3&orientation=portrait',
//     badge: 'New',
//     href: `${ROUTES.PRODUCTS}/navy-blue-sweatshirt`,
//     category: 'sweatshirts',
//     color: 'navy',
//   },
//   {
//     id: 'prod-4',
//     name: 'Gray Hoodie Premium',
//     price: 39.99,
//     image:
//       'https://readdy.ai/api/search-image?query=Premium%20gray%20hoodie%20mockup%20on%20clean%20white%20background%2C%20minimalist%20product%20photography%2C%20soft%20natural%20lighting%2C%20professional%20e-commerce%20style%2C%20centered%20composition%2C%20high%20resolution%2C%20modern%20casual%20wear%2C%20cotton%20fabric%20texture%20visible%2C%20front%20view%2C%20no%20wrinkles%2C%20studio%20shot%2C%20commercial%20photography&width=500&height=600&seq=prod4&orientation=portrait',
//     badge: 'Trending',
//     href: `${ROUTES.PRODUCTS}/gray-hoodie-premium`,
//     category: 'hoodies',
//     color: 'gray',
//   },
//   {
//     id: 'prod-5',
//     name: 'Olive Green T-Shirt',
//     price: 22.99,
//     image:
//       'https://readdy.ai/api/search-image?query=Premium%20olive%20green%20t-shirt%20mockup%20on%20clean%20white%20background%2C%20minimalist%20product%20photography%2C%20soft%20natural%20lighting%2C%20professional%20e-commerce%20style%2C%20centered%20composition%2C%20high%20resolution%2C%20modern%20casual%20wear%2C%20cotton%20fabric%20texture%20visible%2C%20front%20view%2C%20no%20wrinkles%2C%20studio%20shot%2C%20commercial%20photography&width=500&height=600&seq=prod5&orientation=portrait',
//     badge: 'New',
//     href: `${ROUTES.PRODUCTS}/olive-green-tshirt`,
//     category: 'tshirts',
//     color: 'olive',
//   },
//   {
//     id: 'prod-6',
//     name: 'Burgundy Sweatshirt',
//     price: 32.99,
//     image:
//       'https://readdy.ai/api/search-image?query=Premium%20burgundy%20sweatshirt%20mockup%20on%20clean%20white%20background%2C%20minimalist%20product%20photography%2C%20soft%20natural%20lighting%2C%20professional%20e-commerce%20style%2C%20centered%20composition%2C%20high%20resolution%2C%20modern%20casual%20wear%2C%20cotton%20fabric%20texture%20visible%2C%20front%20view%2C%20no%20wrinkles%2C%20studio%20shot%2C%20commercial%20photography&width=500&height=600&seq=prod6&orientation=portrait',
//     badge: 'Popular',
//     href: `${ROUTES.PRODUCTS}/burgundy-sweatshirt`,
//     category: 'sweatshirts',
//     color: 'burgundy',
//   },
//   {
//     id: 'prod-7',
//     name: 'Black Premium T-Shirt',
//     price: 24.99,
//     image:
//       'https://readdy.ai/api/search-image?query=Premium%20black%20t-shirt%20mockup%20on%20clean%20white%20background%2C%20minimalist%20product%20photography%2C%20soft%20natural%20lighting%2C%20professional%20e-commerce%20style%2C%20centered%20composition%2C%20high%20resolution%2C%20modern%20casual%20wear%2C%20cotton%20fabric%20texture%20visible%2C%20front%20view%2C%20no%20wrinkles%2C%20studio%20shot%2C%20commercial%20photography&width=500&height=600&seq=prod7&orientation=portrait',
//     badge: 'Bestseller',
//     href: `${ROUTES.PRODUCTS}/black-premium-tshirt`,
//     category: 'tshirts',
//     color: 'black',
//   },
//   {
//     id: 'prod-8',
//     name: 'White Comfort Hoodie',
//     price: 36.99,
//     image:
//       'https://readdy.ai/api/search-image?query=Premium%20white%20hoodie%20mockup%20on%20clean%20white%20background%2C%20minimalist%20product%20photography%2C%20soft%20natural%20lighting%2C%20professional%20e-commerce%20style%2C%20centered%20composition%2C%20high%20resolution%2C%20modern%20casual%20wear%2C%20cotton%20fabric%20texture%20visible%2C%20front%20view%2C%20no%20wrinkles%2C%20studio%20shot%2C%20commercial%20photography&width=500&height=600&seq=prod8&orientation=portrait',
//     badge: 'New',
//     href: `${ROUTES.PRODUCTS}/white-comfort-hoodie`,
//     category: 'hoodies',
//     color: 'white',
//   },
//   {
//     id: 'prod-9',
//     name: 'Navy Classic Hoodie',
//     price: 35.99,
//     image:
//       'https://readdy.ai/api/search-image?query=Premium%20navy%20hoodie%20mockup%20on%20clean%20white%20background%2C%20minimalist%20product%20photography%2C%20soft%20natural%20lighting%2C%20professional%20e-commerce%20style%2C%20centered%20composition%2C%20high%20resolution%2C%20modern%20casual%20wear%2C%20cotton%20fabric%20texture%20visible%2C%20front%20view%2C%20no%20wrinkles%2C%20studio%20shot%2C%20commercial%20photography&width=500&height=600&seq=prod9&orientation=portrait',
//     badge: 'Popular',
//     href: `${ROUTES.PRODUCTS}/navy-classic-hoodie`,
//     category: 'hoodies',
//     color: 'navy',
//   },
//   {
//     id: 'prod-10',
//     name: 'Gray Premium Sweatshirt',
//     price: 31.99,
//     image:
//       'https://readdy.ai/api/search-image?query=Premium%20gray%20sweatshirt%20mockup%20on%20clean%20white%20background%2C%20minimalist%20product%20photography%2C%20soft%20natural%20lighting%2C%20professional%20e-commerce%20style%2C%20centered%20composition%2C%20high%20resolution%2C%20modern%20casual%20wear%2C%20cotton%20fabric%20texture%20visible%2C%20front%20view%2C%20no%20wrinkles%2C%20studio%20shot%2C%20commercial%20photography&width=500&height=600&seq=prod10&orientation=portrait',
//     badge: 'Trending',
//     href: `${ROUTES.PRODUCTS}/gray-premium-sweatshirt`,
//     category: 'sweatshirts',
//     color: 'gray',
//   },
//   {
//     id: 'prod-11',
//     name: 'Black Classic Sweatshirt',
//     price: 28.99,
//     image:
//       'https://readdy.ai/api/search-image?query=Premium%20black%20sweatshirt%20mockup%20on%20clean%20white%20background%2C%20minimalist%20product%20photography%2C%20soft%20natural%20lighting%2C%20professional%20e-commerce%20style%2C%20centered%20composition%2C%20high%20resolution%2C%20modern%20casual%20wear%2C%20cotton%20fabric%20texture%20visible%2C%20front%20view%2C%20no%20wrinkles%2C%20studio%20shot%2C%20commercial%20photography&width=500&height=600&seq=prod11&orientation=portrait',
//     badge: 'Bestseller',
//     href: `${ROUTES.PRODUCTS}/black-classic-sweatshirt`,
//     category: 'sweatshirts',
//     color: 'black',
//   },
//   {
//     id: 'prod-12',
//     name: 'White Premium T-Shirt',
//     price: 21.99,
//     image:
//       'https://readdy.ai/api/search-image?query=Premium%20white%20t-shirt%20mockup%20on%20clean%20white%20background%2C%20minimalist%20product%20photography%2C%20soft%20natural%20lighting%2C%20professional%20e-commerce%20style%2C%20centered%20composition%2C%20high%20resolution%2C%20modern%20casual%20wear%2C%20cotton%20fabric%20texture%20visible%2C%20front%20view%2C%20no%20wrinkles%2C%20studio%20shot%2C%20commercial%20photography&width=500&height=600&seq=prod12&orientation=portrait',
//     badge: 'New',
//     href: `${ROUTES.PRODUCTS}/white-premium-tshirt`,
//     category: 'tshirts',
//     color: 'white',
//   },
// ];

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
 * Products Page
 * Displays products with filtering and sorting capabilities
 */
export default function ProductsPage() {
  const [filters, setFilters] = useState({});

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
      <ProductFilters filters={filters} onFiltersChange={setFilters} />

      {/* Products Grid Section */}
      <div className="max-w-7xl mx-auto px-1 sm:px-6 pt-2 sm:py-8">
        {/* Results Count */}
        <div className="mb-6 md:px-0 px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 mt-4">Products</h1>
          {isLoading ? (
            <p className="text-gray-700">Loading products...</p>
          ) : isError ? (
            <p className="text-red-600">
              Error loading products: {error?.message || "Unknown error"}
            </p>
          ) : (
            <p className="text-gray-700">
              Showing <span className="font-semibold">{products.length}</span> of{" "}
              <span className="font-semibold">{totalCount}</span>{" "}
              {totalCount === 1 ? "product" : "products"}
            </p>
          )}
        </div>

        {/* Products Grid */}
        {isError ? (
          <div className="flex flex-col items-center justify-center py-20">
            <i className="ri-error-warning-line text-6xl text-red-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Error loading products</h3>
            <p className="text-gray-500 text-center">
              {error?.message || "Please try again later."}
            </p>
          </div>
        ) : (
          <ProductGrid products={products} isLoading={isLoading} skeletonCount={12} />
        )}
      </div>
    </main>
  );
}
