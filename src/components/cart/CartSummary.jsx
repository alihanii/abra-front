"use client";

import { useTranslations } from 'next-intl';
import { useCart } from "@/contexts/CartContext";
import { ROUTES } from "@/config/routes";
import BaseButton from "@/components/ui/BaseButton";
import { formatPrice } from "@/lib/utils/formatPrice";
/**
 * Cart Summary Component
 * Displays cart totals and checkout actions
 */
export default function CartSummary() {
  const t = useTranslations();
  const { totals, closeCart } = useCart();

  return (
    <div className="border-t border-gray-200 px-6 py-6 bg-gray-50">
      {/* Totals */}
      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-gray-700">
          <span>{t('cartSummary.subtotal')}</span>
          <span className="font-semibold">{formatPrice(totals.subtotal)}</span>
        </div>

        {/* <div className="flex justify-between text-gray-700">
          <span>{t('cartSummary.shipping')}</span>
          <span className="font-semibold">{t('cartSummary.free')}</span>
        </div> */}

        <div className="border-t border-gray-300 pt-3 flex justify-between text-lg font-bold text-gray-900">
          <span>{t('cartSummary.total')}</span>
          <span>{formatPrice(totals.total)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <BaseButton
          href={ROUTES.PAYMENT || "/payment"}
          onClick={closeCart}
          variant="primary"
          size="lg"
          fullWidth
        >
          {t('cartSummary.proceedToCheckout')}
        </BaseButton>

        <BaseButton
          onClick={closeCart}
          variant="secondary"
          size="md"
          fullWidth
        >
          {t('cartSummary.continueShopping')}
        </BaseButton>
      </div>
    </div>
  );
}
