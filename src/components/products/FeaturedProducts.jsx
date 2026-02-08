"use client";

import { useRef, useMemo } from "react";
import ProductSlider from "./ProductSlider";
import ProductCard from "./ProductCard";
import BaseButton from "@/components/ui/BaseButton";
import ScrollNavigation from "@/components/ui/ScrollNavigation";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { ROUTES } from "@/config/routes";
import { useProducts } from "@/hooks/useApi";

/**
 * Mock Products Data
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
//   },
//   {
//     id: 'prod-2',
//     name: 'White Cotton T-Shirt',
//     price: 19.99,
//     image:
//       'https://readdy.ai/api/search-image?query=Premium%20white%20t-shirt%20mockup%20on%20clean%20white%20background%2C%20minimalist%20product%20photography%2C%20soft%20natural%20lighting%2C%20professional%20e-commerce%20style%2C%20centered%20composition%2C%20high%20resolution%2C%20modern%20casual%20wear%2C%20cotton%20fabric%20texture%20visible%2C%20front%20view%2C%20no%20wrinkles%2C%20studio%20shot%2C%20commercial%20photography&width=500&height=600&seq=prod2&orientation=portrait',
//     badge: 'Popular',
//     href: `${ROUTES.PRODUCTS}/white-cotton-tshirt`,
//   },
//   {
//     id: 'prod-3',
//     name: 'Navy Blue Sweatshirt',
//     price: 29.99,
//     image:
//       'https://readdy.ai/api/search-image?query=Premium%20navy%20blue%20sweatshirt%20mockup%20on%20clean%20white%20background%2C%20minimalist%20product%20photography%2C%20soft%20natural%20lighting%2C%20professional%20e-commerce%20style%2C%20centered%20composition%2C%20high%20resolution%2C%20modern%20casual%20wear%2C%20cotton%20fabric%20texture%20visible%2C%20front%20view%2C%20no%20wrinkles%2C%20studio%20shot%2C%20commercial%20photography&width=500&height=600&seq=prod3&orientation=portrait',
//     badge: 'New',
//     href: `${ROUTES.PRODUCTS}/navy-blue-sweatshirt`,
//   },
//   {
//     id: 'prod-4',
//     name: 'Gray Hoodie Premium',
//     price: 39.99,
//     image:
//       'https://readdy.ai/api/search-image?query=Premium%20gray%20hoodie%20mockup%20on%20clean%20white%20background%2C%20minimalist%20product%20photography%2C%20soft%20natural%20lighting%2C%20professional%20e-commerce%20style%2C%20centered%20composition%2C%20high%20resolution%2C%20modern%20casual%20wear%2C%20cotton%20fabric%20texture%20visible%2C%20front%20view%2C%20no%20wrinkles%2C%20studio%20shot%2C%20commercial%20photography&width=500&height=600&seq=prod4&orientation=portrait',
//     badge: 'Trending',
//     href: `${ROUTES.PRODUCTS}/gray-hoodie-premium`,
//   },
//   {
//     id: 'prod-5',
//     name: 'Olive Green T-Shirt',
//     price: 22.99,
//     image:
//       'https://readdy.ai/api/search-image?query=Premium%20olive%20green%20t-shirt%20mockup%20on%20clean%20white%20background%2C%20minimalist%20product%20photography%2C%20soft%20natural%20lighting%2C%20professional%20e-commerce%20style%2C%20centered%20composition%2C%20high%20resolution%2C%20modern%20casual%20wear%2C%20cotton%20fabric%20texture%20visible%2C%20front%20view%2C%20no%20wrinkles%2C%20studio%20shot%2C%20commercial%20photography&width=500&height=600&seq=prod5&orientation=portrait',
//     badge: 'New',
//     href: `${ROUTES.PRODUCTS}/olive-green-tshirt`,
//   },
//   {
//     id: 'prod-6',
//     name: 'Burgundy Sweatshirt',
//     price: 32.99,
//     image:
//       'https://readdy.ai/api/search-image?query=Premium%20burgundy%20sweatshirt%20mockup%20on%20clean%20white%20background%2C%20minimalist%20product%20photography%2C%20soft%20natural%20lighting%2C%20professional%20e-commerce%20style%2C%20centered%20composition%2C%20high%20resolution%2C%20modern%20casual%20wear%2C%20cotton%20fabric%20texture%20visible%2C%20front%20view%2C%20no%20wrinkles%2C%20studio%20shot%2C%20commercial%20photography&width=500&height=600&seq=prod6&orientation=portrait',
//     badge: 'Popular',
//     href: `${ROUTES.PRODUCTS}/burgundy-sweatshirt`,
//   },
// ];

/**
 * Map API product response to component format
 * @param {Object} apiProduct - Product from API
 * @returns {Object} Mapped product for component
 */
const mapApiProductToComponent = (apiProduct) => {
  return {
    id: apiProduct.id || apiProduct.slug,
    slug: apiProduct.slug,
    name: apiProduct.name,
    price: apiProduct.price,
    image: apiProduct.images?.[0] || "",
    href: `${ROUTES.PRODUCTS}/${apiProduct.slug}`,
    badge: null, // Can be added based on product data if needed
    category: apiProduct.category,
    color: Object.keys(apiProduct.colors || {})[0] || null,
    // Include full product data for ProductCard component
    product: apiProduct
  };
};

/**
 * Featured Products Section
 * Displays featured products with slider on desktop and grid on mobile
 */
export default function FeaturedProducts() {
  const sliderRef = useRef(null);

  // Fetch featured products from API
  // Using limited page_size to get featured products
  const {
    data: productsResponse,
    isLoading,
    isError
  } = useProducts(
    {
      page: 1,
      page_size: 8, // Get 8 featured products
      order_by: "created_at",
      order: "desc"
    },
    {
      staleTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false
    }
  );

  // Map API products to component format
  const products = useMemo(() => {
    if (!productsResponse?.results) return [];
    return productsResponse.results.map(mapApiProductToComponent);
  }, [productsResponse]);

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

  return (
    <section className="py-16 bg-[var(--color-sky-light)]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <ScrollReveal
          animation="slideRight"
          delay={0}
        >
          <div className="flex items-center justify-between mb-8">
            <ScrollReveal
              animation="fadeIn"
              delay={100}
            >
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-2">Featured Products</h2>
                <p className="text-lg text-gray-700">Bestsellers & new arrivals</p>
              </div>
            </ScrollReveal>

            {/* Navigation Buttons */}
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
          </div>
        </ScrollReveal>

        {/* Desktop Slider */}
        {isLoading ? (
          <>
            {/* Desktop Skeleton Slider */}
            <div className="hidden md:block relative overflow-hidden">
              <div className="flex gap-6 overflow-x-auto scrollbar-hide">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="shrink-0 w-[calc(25%-18px)]"
                  >
                    <ProductCard isLoading={true} size="md" />
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Skeleton Grid */}
            <div className="md:hidden grid grid-cols-1 gap-0.5">
              {Array.from({ length: 4 }).map((_, index) => (
                <ProductCard
                  key={`skeleton-mobile-${index}`}
                  isLoading={true}
                  size="sm"
                />
              ))}
            </div>
          </>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20">
            <i className="ri-error-warning-line text-6xl text-red-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Error loading products</h3>
            <p className="text-gray-500 text-center">Please try again later.</p>
          </div>
        ) : products.length > 0 ? (
          <>
            <ProductSlider
              ref={sliderRef}
              products={products}
            />

            {/* Mobile Grid */}
            <div className="md:hidden grid md:grid-cols-2 grid-cols-1 md:gap-4 gap-0.5">
              {products.slice(0, 4).map((product) => (
                <ProductCard
                  key={product.slug}
                  {...product}
                  size="sm"
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <i className="ri-shopping-bag-line text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No featured products</h3>
            <p className="text-gray-500 text-center">Check back later for featured products.</p>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-8">
          <BaseButton
            href={ROUTES.PRODUCTS}
            variant="secondary"
            size="md"
            className="shadow-md hover:shadow-lg"
          >
            View All Products
          </BaseButton>
        </div>
      </div>
    </section>
  );
}
