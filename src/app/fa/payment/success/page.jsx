"use client";

import { useEffect } from "react";
import { ROUTES } from "@/config/routes";
import { useCart } from "@/contexts/CartContext";
import BaseButton from "@/components/ui/BaseButton";
import PaymentResultCard from "@/components/payment/PaymentResultCard";

export default function PaymentSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);
  return (
    <div className="w-full min-h-[60vh] flex flex-col justify-center bg-white">
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
        <PaymentResultCard
          variant="success"
          title="پرداخت موفق"
          message="پرداخت با موفقیت انجام شد"
          action={
            <BaseButton href={ROUTES.HOME} variant="primary" size="md">
              <i className="ri-home-line ml-2" aria-hidden />
              بازگشت به صفحه اصلی
            </BaseButton>
          }
        />
      </div>
    </div>
  );
}
