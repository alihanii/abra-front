"use client";

import { useTranslations } from 'next-intl';
import { ROUTES } from "@/config/routes";
import BaseButton from "@/components/ui/BaseButton";

/**
 * Empty Cart Component
 * Displays when cart is empty
 */
export default function EmptyCart() {
  const t = useTranslations();
  
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <i className="ri-shopping-cart-line text-5xl text-gray-400"></i>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2">{t('emptyCart.title')}</h3>

      <p className="text-gray-600 mb-6">{t('emptyCart.message')}</p>

      <BaseButton
        href={ROUTES.PRODUCTS}
        variant="primary"
        size="md"
      >
        {t('emptyCart.browseProducts')}
      </BaseButton>
    </div>
  );
}
