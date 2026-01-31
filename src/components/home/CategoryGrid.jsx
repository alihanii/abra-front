'use client';

import CategoryCard from './CategoryCard';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { ROUTES } from '@/config/routes';

/**
 * Category Grid Data Configuration
 */
const CATEGORIES = [
  {
    id: 1,
    title: '30% Off Hoodies',
    description: 'Limited time offer',
    href: `${ROUTES.PRODUCTS}?category=hoodies`,
    image: 'https://readdy.ai/api/search-image?query=Modern%20minimalist%20banner%20with%20premium%20hoodies%20displayed%20on%20soft%20pastel%20blue%20background%2C%20clean%20product%20photography%2C%20professional%20e-commerce%20style%2C%20elegant%20layout%2C%20high%20resolution%2C%20contemporary%20design%2C%20subtle%20shadows%2C%20commercial%20photography%2C%20lifestyle%20aesthetic&width=800&height=400&seq=banner1&orientation=landscape',
    delay: 0,
  },
  {
    id: 2,
    title: 'Couple Matching Sets',
    description: 'Perfect for partners',
    href: ROUTES.MATCHING_SETS,
    image: 'https://readdy.ai/api/search-image?query=Modern%20minimalist%20banner%20with%20matching%20couple%20clothing%20on%20soft%20pastel%20background%2C%20clean%20product%20photography%2C%20professional%20e-commerce%20style%2C%20elegant%20layout%2C%20high%20resolution%2C%20contemporary%20design%2C%20subtle%20shadows%2C%20commercial%20photography%2C%20romantic%20aesthetic&width=800&height=400&seq=banner2&orientation=landscape',
    delay: 100,
  },
  {
    id: 3,
    title: 'Design Your Own',
    description: 'Unleash creativity',
    href: ROUTES.DESIGN_STUDIO,
    image: 'https://readdy.ai/api/search-image?query=Modern%20minimalist%20banner%20with%20custom%20design%20concept%20on%20soft%20pastel%20background%2C%20clean%20artistic%20photography%2C%20professional%20e-commerce%20style%2C%20elegant%20layout%2C%20high%20resolution%2C%20contemporary%20design%2C%20subtle%20shadows%2C%20commercial%20photography%2C%20creative%20aesthetic&width=800&height=400&seq=banner3&orientation=landscape',
    delay: 200,
  },
];

/**
 * Category Grid Component
 * Grid layout for displaying category cards
 */
export default function CategoryGrid() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category.id}
              href={category.href}
              image={category.image}
              alt={category.title}
              title={category.title}
              description={category.description}
              delay={category.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

