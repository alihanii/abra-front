'use client';

import { useState, useMemo } from 'react';
import { ProductFilters, ProductGrid } from '@/components/products';
import { ROUTES } from '@/config/routes';

/**
 * Mock Products Data
 * Extended list for products page
 */
const MOCK_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Classic Black Hoodie',
    price: 34.99,
    image:
      'https://readdy.ai/api/search-image?query=Premium%20black%20hoodie%20mockup%20on%20clean%20white%20background%2C%20minimalist%20product%20photography%2C%20soft%20natural%20lighting%2C%20professional%20e-commerce%20style%2C%20centered%20composition%2C%20high%20resolution%2C%20modern%20casual%20wear%2C%20cotton%20fabric%20texture%20visible%2C%20front%20view%2C%20no%20wrinkles%2C%20studio%20shot%2C%20commercial%20photography&width=500&height=600&seq=prod1&orientation=portrait',
    badge: 'Bestseller',
    href: `${ROUTES.PRODUCTS}/classic-black-hoodie`,
    category: 'hoodies',
    color: 'black',
  },
  {
    id: 'prod-2',
    name: 'White Cotton T-Shirt',
    price: 19.99,
    image:
      'https://readdy.ai/api/search-image?query=Premium%20white%20t-shirt%20mockup%20on%20clean%20white%20background%2C%20minimalist%20product%20photography%2C%20soft%20natural%20lighting%2C%20professional%20e-commerce%20style%2C%20centered%20composition%2C%20high%20resolution%2C%20modern%20casual%20wear%2C%20cotton%20fabric%20texture%20visible%2C%20front%20view%2C%20no%20wrinkles%2C%20studio%20shot%2C%20commercial%20photography&width=500&height=600&seq=prod2&orientation=portrait',
    badge: 'Popular',
    href: `${ROUTES.PRODUCTS}/white-cotton-tshirt`,
    category: 'tshirts',
    color: 'white',
  },
  {
    id: 'prod-3',
    name: 'Navy Blue Sweatshirt',
    price: 29.99,
    image:
      'https://readdy.ai/api/search-image?query=Premium%20navy%20blue%20sweatshirt%20mockup%20on%20clean%20white%20background%2C%20minimalist%20product%20photography%2C%20soft%20natural%20lighting%2C%20professional%20e-commerce%20style%2C%20centered%20composition%2C%20high%20resolution%2C%20modern%20casual%20wear%2C%20cotton%20fabric%20texture%20visible%2C%20front%20view%2C%20no%20wrinkles%2C%20studio%20shot%2C%20commercial%20photography&width=500&height=600&seq=prod3&orientation=portrait',
    badge: 'New',
    href: `${ROUTES.PRODUCTS}/navy-blue-sweatshirt`,
    category: 'sweatshirts',
    color: 'navy',
  },
  {
    id: 'prod-4',
    name: 'Gray Hoodie Premium',
    price: 39.99,
    image:
      'https://readdy.ai/api/search-image?query=Premium%20gray%20hoodie%20mockup%20on%20clean%20white%20background%2C%20minimalist%20product%20photography%2C%20soft%20natural%20lighting%2C%20professional%20e-commerce%20style%2C%20centered%20composition%2C%20high%20resolution%2C%20modern%20casual%20wear%2C%20cotton%20fabric%20texture%20visible%2C%20front%20view%2C%20no%20wrinkles%2C%20studio%20shot%2C%20commercial%20photography&width=500&height=600&seq=prod4&orientation=portrait',
    badge: 'Trending',
    href: `${ROUTES.PRODUCTS}/gray-hoodie-premium`,
    category: 'hoodies',
    color: 'gray',
  },
  {
    id: 'prod-5',
    name: 'Olive Green T-Shirt',
    price: 22.99,
    image:
      'https://readdy.ai/api/search-image?query=Premium%20olive%20green%20t-shirt%20mockup%20on%20clean%20white%20background%2C%20minimalist%20product%20photography%2C%20soft%20natural%20lighting%2C%20professional%20e-commerce%20style%2C%20centered%20composition%2C%20high%20resolution%2C%20modern%20casual%20wear%2C%20cotton%20fabric%20texture%20visible%2C%20front%20view%2C%20no%20wrinkles%2C%20studio%20shot%2C%20commercial%20photography&width=500&height=600&seq=prod5&orientation=portrait',
    badge: 'New',
    href: `${ROUTES.PRODUCTS}/olive-green-tshirt`,
    category: 'tshirts',
    color: 'olive',
  },
  {
    id: 'prod-6',
    name: 'Burgundy Sweatshirt',
    price: 32.99,
    image:
      'https://readdy.ai/api/search-image?query=Premium%20burgundy%20sweatshirt%20mockup%20on%20clean%20white%20background%2C%20minimalist%20product%20photography%2C%20soft%20natural%20lighting%2C%20professional%20e-commerce%20style%2C%20centered%20composition%2C%20high%20resolution%2C%20modern%20casual%20wear%2C%20cotton%20fabric%20texture%20visible%2C%20front%20view%2C%20no%20wrinkles%2C%20studio%20shot%2C%20commercial%20photography&width=500&height=600&seq=prod6&orientation=portrait',
    badge: 'Popular',
    href: `${ROUTES.PRODUCTS}/burgundy-sweatshirt`,
    category: 'sweatshirts',
    color: 'burgundy',
  },
  {
    id: 'prod-7',
    name: 'Black Premium T-Shirt',
    price: 24.99,
    image:
      'https://readdy.ai/api/search-image?query=Premium%20black%20t-shirt%20mockup%20on%20clean%20white%20background%2C%20minimalist%20product%20photography%2C%20soft%20natural%20lighting%2C%20professional%20e-commerce%20style%2C%20centered%20composition%2C%20high%20resolution%2C%20modern%20casual%20wear%2C%20cotton%20fabric%20texture%20visible%2C%20front%20view%2C%20no%20wrinkles%2C%20studio%20shot%2C%20commercial%20photography&width=500&height=600&seq=prod7&orientation=portrait',
    badge: 'Bestseller',
    href: `${ROUTES.PRODUCTS}/black-premium-tshirt`,
    category: 'tshirts',
    color: 'black',
  },
  {
    id: 'prod-8',
    name: 'White Comfort Hoodie',
    price: 36.99,
    image:
      'https://readdy.ai/api/search-image?query=Premium%20white%20hoodie%20mockup%20on%20clean%20white%20background%2C%20minimalist%20product%20photography%2C%20soft%20natural%20lighting%2C%20professional%20e-commerce%20style%2C%20centered%20composition%2C%20high%20resolution%2C%20modern%20casual%20wear%2C%20cotton%20fabric%20texture%20visible%2C%20front%20view%2C%20no%20wrinkles%2C%20studio%20shot%2C%20commercial%20photography&width=500&height=600&seq=prod8&orientation=portrait',
    badge: 'New',
    href: `${ROUTES.PRODUCTS}/white-comfort-hoodie`,
    category: 'hoodies',
    color: 'white',
  },
  {
    id: 'prod-9',
    name: 'Navy Classic Hoodie',
    price: 35.99,
    image:
      'https://readdy.ai/api/search-image?query=Premium%20navy%20hoodie%20mockup%20on%20clean%20white%20background%2C%20minimalist%20product%20photography%2C%20soft%20natural%20lighting%2C%20professional%20e-commerce%20style%2C%20centered%20composition%2C%20high%20resolution%2C%20modern%20casual%20wear%2C%20cotton%20fabric%20texture%20visible%2C%20front%20view%2C%20no%20wrinkles%2C%20studio%20shot%2C%20commercial%20photography&width=500&height=600&seq=prod9&orientation=portrait',
    badge: 'Popular',
    href: `${ROUTES.PRODUCTS}/navy-classic-hoodie`,
    category: 'hoodies',
    color: 'navy',
  },
  {
    id: 'prod-10',
    name: 'Gray Premium Sweatshirt',
    price: 31.99,
    image:
      'https://readdy.ai/api/search-image?query=Premium%20gray%20sweatshirt%20mockup%20on%20clean%20white%20background%2C%20minimalist%20product%20photography%2C%20soft%20natural%20lighting%2C%20professional%20e-commerce%20style%2C%20centered%20composition%2C%20high%20resolution%2C%20modern%20casual%20wear%2C%20cotton%20fabric%20texture%20visible%2C%20front%20view%2C%20no%20wrinkles%2C%20studio%20shot%2C%20commercial%20photography&width=500&height=600&seq=prod10&orientation=portrait',
    badge: 'Trending',
    href: `${ROUTES.PRODUCTS}/gray-premium-sweatshirt`,
    category: 'sweatshirts',
    color: 'gray',
  },
  {
    id: 'prod-11',
    name: 'Black Classic Sweatshirt',
    price: 28.99,
    image:
      'https://readdy.ai/api/search-image?query=Premium%20black%20sweatshirt%20mockup%20on%20clean%20white%20background%2C%20minimalist%20product%20photography%2C%20soft%20natural%20lighting%2C%20professional%20e-commerce%20style%2C%20centered%20composition%2C%20high%20resolution%2C%20modern%20casual%20wear%2C%20cotton%20fabric%20texture%20visible%2C%20front%20view%2C%20no%20wrinkles%2C%20studio%20shot%2C%20commercial%20photography&width=500&height=600&seq=prod11&orientation=portrait',
    badge: 'Bestseller',
    href: `${ROUTES.PRODUCTS}/black-classic-sweatshirt`,
    category: 'sweatshirts',
    color: 'black',
  },
  {
    id: 'prod-12',
    name: 'White Premium T-Shirt',
    price: 21.99,
    image:
      'https://readdy.ai/api/search-image?query=Premium%20white%20t-shirt%20mockup%20on%20clean%20white%20background%2C%20minimalist%20product%20photography%2C%20soft%20natural%20lighting%2C%20professional%20e-commerce%20style%2C%20centered%20composition%2C%20high%20resolution%2C%20modern%20casual%20wear%2C%20cotton%20fabric%20texture%20visible%2C%20front%20view%2C%20no%20wrinkles%2C%20studio%20shot%2C%20commercial%20photography&width=500&height=600&seq=prod12&orientation=portrait',
    badge: 'New',
    href: `${ROUTES.PRODUCTS}/white-premium-tshirt`,
    category: 'tshirts',
    color: 'white',
  },
];

/**
 * Filter products based on filter criteria
 * @param {Array} products - Products array
 * @param {Object} filters - Filter object
 * @returns {Array} Filtered products
 */
const filterProducts = (products, filters) => {
  return products.filter((product) => {
    // Category filter
    if (filters.category && filters.category !== 'all') {
      if (product.category !== filters.category) return false;
    }

    // Color filter
    if (filters.color && filters.color !== 'all') {
      if (product.color !== filters.color) return false;
    }

    // Price filter
    if (filters.price && filters.price !== 'all') {
      const [min, max] = filters.price.split('-').map((v) => {
        if (v.endsWith('+')) return [parseFloat(v), Infinity];
        return parseFloat(v);
      });
      if (max === Infinity) {
        if (product.price < min) return false;
      } else {
        if (product.price < min || product.price > max) return false;
      }
    }

    return true;
  });
};

/**
 * Sort products based on sort criteria
 * @param {Array} products - Products array
 * @param {string} sortBy - Sort criteria
 * @returns {Array} Sorted products
 */
const sortProducts = (products, sortBy) => {
  const sorted = [...products];

  switch (sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'newest':
      // For mock data, reverse the array
      return sorted.reverse();
    default:
      return sorted;
  }
};

/**
 * Products Page
 * Displays products with filtering and sorting capabilities
 */
export default function ProductsPage() {
  const [filters, setFilters] = useState({});

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let result = filterProducts(MOCK_PRODUCTS, filters);
    result = sortProducts(result, filters.sort || 'default');
    return result;
  }, [filters]);

  return (
    <main className="min-h-screen bg-[var(--color-sky-light)]">
      {/* Page Header
      <div className="bg-white border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            All Products
          </h1>
          <p className="text-lg text-gray-700">
            Discover our complete collection of premium clothing
          </p>
        </div>
      </div> */}

      {/* Filters Section */}
      <ProductFilters filters={filters} onFiltersChange={setFilters} />

      {/* Products Grid Section */}
      <div className="max-w-7xl mx-auto px-1 sm:px-6 pt-2 sm:py-8">
        {/* Results Count */}
        <div className="mb-6 md:px-0 px-4 ">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 mt-4">
            Products
          </h1>
          <p className="text-gray-700">
            Showing <span className="font-semibold">{filteredAndSortedProducts.length}</span>{' '}
            {filteredAndSortedProducts.length === 1 ? 'product' : 'products'}
          </p>
        </div>

        {/* Products Grid */}
        <ProductGrid products={filteredAndSortedProducts} />
      </div>
    </main>
  );
}

