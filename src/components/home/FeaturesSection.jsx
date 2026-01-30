'use client';

import FeatureCard from './FeatureCard';

/**
 * Features Data Configuration
 */
const FEATURES = [
  {
    id: 'print-guarantee',
    icon: 'ri-shield-check-line',
    title: 'Print Guarantee',
    description: 'High-quality printing that lasts',
  },
  {
    id: 'cotton-fabric',
    icon: 'ri-t-shirt-line',
    title: 'Cotton Fabric',
    description: '100% premium cotton material',
  },
  {
    id: 'fast-delivery',
    icon: 'ri-truck-line',
    title: 'Fast Delivery',
    description: 'Quick shipping to your door',
  },
];

/**
 * Features Section Component
 * Displays key features/benefits of the service
 */
export default function FeaturesSection() {
  return (
    <section className="bg-white py-12 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map((feature) => (
            <FeatureCard
              key={feature.id}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

