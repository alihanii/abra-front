"use client";

import { ROUTES } from "@/config/routes";
import BaseButton from "@/components/ui/BaseButton";
import PaymentResultCard from "@/components/payment/PaymentResultCard";

export default function PaymentFailurePage() {
  return (
    <div className="w-full min-h-[60vh] flex flex-col justify-center bg-white">
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
        <PaymentResultCard
          variant="failure"
          title="پرداخت ناموفق"
          message="پرداخت ناموفق بود"
          action={
            <BaseButton href={ROUTES.PAYMENT} variant="primary" size="md">
              <i className="ri-shopping-cart-line ml-2" aria-hidden />
              بازگشت به سبد خرید و تلاش مجدد
            </BaseButton>
          }
        />
      </div>
    </div>
  );
}
