"use client";

import { useTranslations } from 'next-intl';
import WhyChooseCard from "./WhyChooseCard";
import ScrollReveal from "@/components/ui/ScrollReveal";

/**
 * Why Choose Section Component
 * Displays reasons to choose Abra
 */
export default function WhyChooseSection() {
  const t = useTranslations();
  
  const WHY_CHOOSE_ITEMS = [
    {
      id: "custom-designs",
      icon: "ri-palette-line",
      title: t('whyChoose.customDesigns'),
      description: t('whyChoose.customDesignsDesc')
    },
    {
      id: "premium-quality",
      icon: "ri-star-line",
      title: t('whyChoose.premiumQuality'),
      description: t('whyChoose.premiumQualityDesc')
    },
    {
      id: "fair-pricing",
      icon: "ri-price-tag-3-line",
      title: t('whyChoose.fairPricing'),
      description: t('whyChoose.fairPricingDesc')
    },
    {
      id: "support",
      icon: "ri-customer-service-2-line",
      title: t('whyChoose.support'),
      description: t('whyChoose.supportDesc')
    }
  ];
  
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{t('whyChoose.title')}</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
            {t('whyChoose.description')}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_CHOOSE_ITEMS.map((item, index) => (
            <ScrollReveal
              key={item.id}
              animation="fadeUp"
              delay={index * 100}
            >
              <WhyChooseCard
                icon={item.icon}
                title={item.title}
                description={item.description}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
