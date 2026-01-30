'use client';

import { useRef } from 'react';
import CategorySlider from './CategorySlider';
import ShopCategoryCard from './ShopCategoryCard';
import ScrollNavigation from '@/components/ui/ScrollNavigation';
import { ROUTES } from '@/config/routes';

/**
 * Categories Data Configuration
 */
const CATEGORIES = [
  {
    id: 'hoodies',
    title: 'Hoodies',
    href: `${ROUTES.PRODUCTS}?category=hoodies`,
    image:
      'https://readdy.ai/api/search-image?query=Premium%20quality%20blank%20hoodie%20mockup%20on%20clean%20white%20background%2C%20minimalist%20product%20photography%2C%20soft%20natural%20lighting%2C%20professional%20e-commerce%20style%2C%20centered%20composition%2C%20high%20resolution%2C%20modern%20casual%20wear%2C%20cotton%20fabric%20texture%20visible%2C%20front%20view%2C%20no%20wrinkles%2C%20studio%20shot%2C%20commercial%20photography&width=600&height=700&seq=cat1&orientation=portrait',
  },
  {
    id: 'tshirts',
    title: 'T-Shirts',
    href: `${ROUTES.PRODUCTS}?category=tshirts`,
    image:
      'https://readdy.ai/api/search-image?query=Premium%20quality%20blank%20t-shirt%20mockup%20on%20clean%20white%20background%2C%20minimalist%20product%20photography%2C%20soft%20natural%20lighting%2C%20professional%20e-commerce%20style%2C%20centered%20composition%2C%20high%20resolution%2C%20modern%20casual%20wear%2C%20cotton%20fabric%20texture%20visible%2C%20front%20view%2C%20no%20wrinkles%2C%20studio%20shot%2C%20commercial%20photography&width=600&height=700&seq=cat2&orientation=portrait',
  },
  {
    id: 'sweatshirts',
    title: 'Sweatshirts',
    href: `${ROUTES.PRODUCTS}?category=sweatshirts`,
    image:
      'https://readdy.ai/api/search-image?query=Premium%20quality%20blank%20sweatshirt%20mockup%20on%20clean%20white%20background%2C%20minimalist%20product%20photography%2C%20soft%20natural%20lighting%2C%20professional%20e-commerce%20style%2C%20centered%20composition%2C%20high%20resolution%2C%20modern%20casual%20wear%2C%20cotton%20fabric%20texture%20visible%2C%20front%20view%2C%20no%20wrinkles%2C%20studio%20shot%2C%20commercial%20photography&width=600&height=700&seq=cat3&orientation=portrait',
  },
  {
    id: 'swe4tshirts',
    title: 'Sweatshirts',
    href: `${ROUTES.PRODUCTS}?category=sweatshirts`,
    image:
      'https://readdy.ai/api/search-image?query=Premium%20quality%20blank%20sweatshirt%20mockup%20on%20clean%20white%20background%2C%20minimalist%20product%20photography%2C%20soft%20natural%20lighting%2C%20professional%20e-commerce%20style%2C%20centered%20composition%2C%20high%20resolution%2C%20modern%20casual%20wear%2C%20cotton%20fabric%20texture%20visible%2C%20front%20view%2C%20no%20wrinkles%2C%20studio%20shot%2C%20commercial%20photography&width=600&height=700&seq=cat3&orientation=portrait',
  },
  {
    id: 's3eatshirts',
    title: 'Sweatshirts',
    href: `${ROUTES.PRODUCTS}?category=sweatshirts`,
    image:
      'https://readdy.ai/api/search-image?query=Premium%20quality%20blank%20sweatshirt%20mockup%20on%20clean%20white%20background%2C%20minimalist%20product%20photography%2C%20soft%20natural%20lighting%2C%20professional%20e-commerce%20style%2C%20centered%20composition%2C%20high%20resolution%2C%20modern%20casual%20wear%2C%20cotton%20fabric%20texture%20visible%2C%20front%20view%2C%20no%20wrinkles%2C%20studio%20shot%2C%20commercial%20photography&width=600&height=700&seq=cat3&orientation=portrait',
  },
  {
    id: '2weatshirts',
    title: 'Sweatshirts',
    href: `${ROUTES.PRODUCTS}?category=sweatshirts`,
    image:
      'https://readdy.ai/api/search-image?query=Premium%20quality%20blank%20sweatshirt%20mockup%20on%20clean%20white%20background%2C%20minimalist%20product%20photography%2C%20soft%20natural%20lighting%2C%20professional%20e-commerce%20style%2C%20centered%20composition%2C%20high%20resolution%2C%20modern%20casual%20wear%2C%20cotton%20fabric%20texture%20visible%2C%20front%20view%2C%20no%20wrinkles%2C%20studio%20shot%2C%20commercial%20photography&width=600&height=700&seq=cat3&orientation=portrait',
  },
];

/**
 * Shop by Category Section
 * Displays categories with horizontal scroll on desktop and vertical grid on mobile
 */
export default function ShopByCategory() {
  const sliderRef = useRef(null);

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
    <section className="py-20 bg-[var(--color-sky-light)]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="text-center md:text-left flex-1">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg sm:text-xl text-gray-700">
              Choose your perfect canvas
            </p>
          </div>

          {/* Desktop Navigation Buttons */}
          <ScrollNavigation
            scrollRef={sliderRef}
            onScrollLeft={handleScrollLeft}
            onScrollRight={handleScrollRight}
          />
        </div>

        {/* Desktop Slider */}
        <div className="hidden md:block">
          <CategorySlider ref={sliderRef} categories={CATEGORIES} />
        </div>

        {/* Mobile Grid */}
        <div className="md:hidden grid grid-cols-1 gap-8">
          {CATEGORIES.map((category) => (
            <ShopCategoryCard
              key={category.id}
              href={category.href}
              image={category.image}
              alt={category.title}
              title={category.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

