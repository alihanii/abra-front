"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/routes";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useCalculateCartPricing, useCreateOrder } from "@/hooks/useApi";
import { promiseToast, showInfo, showError } from "@/lib/utils/toast";
import BaseButton from "@/components/ui/BaseButton";
import BaseSkeleton from "@/components/ui/BaseSkeleton";
import Alert from "@/components/ui/Alert";
import { PaymentCartList, PricingSummary, OrderForm } from "@/components/payment";

export default function PaymentPage() {
  const router = useRouter();
  const { isAuthenticated, user, logout, isLoading: isAuthLoading } = useAuth();
  const { items, customItems, clearCart, isLoading: isCartLoading } = useCart();

  // Prepare payload for backend API (regular products)
  const minimalItemsForBackend = useMemo(() => {
    return items.map((item) => ({
      id: String(item.id),
      color: item.color,
      size: item.size,
      quantity: item.quantity,
      unit_price: item.price
    }));
  }, [items]);

  // Prepare payload for backend API (custom products)
  const minimalCustomItemsForBackend = useMemo(() => {
    return customItems.map((item) => ({
      custom_product_id: item.custom_product_id,
      quantity: item.quantity,
      unit_price: item.price
    }));
  }, [customItems]);

  // Pricing state
  const [pricing, setPricing] = useState(null);

  // Calculate cart pricing mutation
  const { mutate: calculatePricing, isPending: isPricingLoading } = useCalculateCartPricing({
    onSuccess: (data) => {
      setPricing(data);
    },
    onError: () => {
      setPricing(null);
    }
  });

  const redirectedRef = useRef(false);

  const createOrderMutation = useCreateOrder();

  const handleSubmitOrder = useCallback(
    async (payload) => {
      const req = createOrderMutation.mutateAsync(payload);
      const result = await promiseToast(req, {
        loading: "در حال ثبت سفارش...",
        success: "سفارش با موفقیت ثبت شد",
        error: (err) =>
          err?.response?.data?.message || err?.message || "ثبت سفارش ناموفق بود"
      });
      clearCart();
      router.replace(ROUTES.HOME);
      return result;
    },
    [createOrderMutation, clearCart, router]
  );

  const handleEmptyCart = useCallback(() => {
    // showInfo("سبد خرید شما خالی است.");
    clearCart();
    router.replace(ROUTES.HOME);
  }, [clearCart, router]);

  // If cart empty while on payment, redirect home (no logout - user may have just placed order)
  useEffect(() => {
    if (!isCartLoading && items.length === 0 && customItems.length === 0) {
      handleEmptyCart();
    }
  }, [items.length, customItems.length, isCartLoading, handleEmptyCart]);

  // If user is not authenticated on payment, redirect home and open ProfileDrawer there.
  useEffect(() => {
    if (isAuthLoading) return;
    if (isAuthenticated) return;
    if (redirectedRef.current) return; // Already redirected, don't redirect again

    redirectedRef.current = true;
    showInfo("برای ادامه پرداخت، لطفاً ابتدا وارد حساب کاربری شوید.");
    // Open drawer via query flag; Header will open ProfileDrawer and then clean the URL.
    router.replace(`${ROUTES.HOME}?open_profile=1`);
  }, [isAuthLoading, isAuthenticated, router]);

  // Fetch pricing whenever cart items change (regular + custom)
  useEffect(() => {
    const hasItems = minimalItemsForBackend.length > 0 || minimalCustomItemsForBackend.length > 0;
    if (!hasItems || isCartLoading) return;

    const payload = {
      items: [...minimalItemsForBackend, ...minimalCustomItemsForBackend]
    };

    calculatePricing(payload);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minimalItemsForBackend, minimalCustomItemsForBackend, isCartLoading]);


  // Reusable loading skeleton component
  const PaymentLoadingSkeleton = () => (
    <div className="w-full bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-6 sm:mb-8">
          <BaseSkeleton isLoading={true} variant="text" className="h-8 w-32 mb-2">
            <div className="h-8" />
          </BaseSkeleton>
          <BaseSkeleton isLoading={true} variant="text" className="h-4 w-64">
            <div className="h-4" />
          </BaseSkeleton>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Form skeleton */}
          <div className="lg:col-span-2 space-y-12">
            <BaseSkeleton isLoading={true} variant="text" className="h-8 w-30">
              <div className="h-4" />
            </BaseSkeleton>
            <div className="border border-gray-200 rounded-2xl bg-white p-5 sm:p-8 shadow-sm">
              <BaseSkeleton isLoading={true} variant="text" className="h-6 w-40 mb-6">
                <div className="h-6" />
              </BaseSkeleton>

              <div className="space-y-4">
                {/* Full name field */}
                <BaseSkeleton isLoading={true} className="h-11 w-full">
                  <div className="h-11" />
                </BaseSkeleton>
                {/* Phone field */}
                <BaseSkeleton isLoading={true} className="h-11 w-full">
                  <div className="h-11" />
                </BaseSkeleton>
                {/* Email field */}
                <BaseSkeleton isLoading={true} className="h-11 w-full">
                  <div className="h-11" />
                </BaseSkeleton>
                {/* Address field */}
                <BaseSkeleton isLoading={true} className="h-24 w-full">
                  <div className="h-24" />
                </BaseSkeleton>
                {/* Submit button */}
                <BaseSkeleton isLoading={true} className="h-11 w-full mt-6">
                  <div className="h-11" />
                </BaseSkeleton>
              </div>
            </div>
          </div>

          {/* Right column - Pricing skeleton */}
          <div className="lg:col-span-1 space-y-6">
            <BaseSkeleton isLoading={true} variant="text" className="h-8 w-20">
              <div className="h-4" />
            </BaseSkeleton>
            <div className="border border-gray-200 rounded-2xl bg-white p-5 sm:p-8 shadow-sm">

              <div className="space-y-2">
                {/* Discount */}
                <BaseSkeleton isLoading={true} variant="text" className="h-5 w-full">
                  <div className="h-5" />
                </BaseSkeleton>
                {/* Subtotal without discount */}
                <BaseSkeleton isLoading={true} variant="text" className="h-5 w-full">
                  <div className="h-5" />
                </BaseSkeleton>
                {/* Subtotal with discount */}
                <BaseSkeleton isLoading={true} variant="text" className="h-5 w-full">
                  <div className="h-5" />
                </BaseSkeleton>
                {/* Shipping */}
                <BaseSkeleton isLoading={true} variant="text" className="h-5 w-full">
                  <div className="h-5" />
                </BaseSkeleton>
                {/* Total */}
                <div className="border-t border-gray-200 pt-3">
                  <BaseSkeleton isLoading={true} variant="text" className="h-6 w-full">
                    <div className="h-6" />
                  </BaseSkeleton>
                </div>
              </div>
            </div>

            {/* Info box */}
            <div className="border border-gray-200 rounded-2xl bg-white p-4 sm:p-5">
              <BaseSkeleton isLoading={true} className="h-16 w-full mb-4">
                <div className="h-16" />
              </BaseSkeleton>
              <BaseSkeleton isLoading={true} className="h-11 w-full">
                <div className="h-11" />
              </BaseSkeleton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Show loading state while checking authentication
  if (isAuthLoading) {
    return <PaymentLoadingSkeleton />;
  }

  // Show loading state while cart is being hydrated
  if (isCartLoading) {
    return <PaymentLoadingSkeleton />;
  }

  // Cart is empty - will be handled by useEffect redirect
  if (items.length === 0 && customItems.length === 0) {
    return null;
  }

  return (
    <div className="w-full  bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">پرداخت</h1>
          <p className="text-sm text-gray-600 mt-2">اطلاعات سفارش خود را بررسی و تکمیل کنید.</p>
        </div>

        {!isAuthenticated ? (
          <div className="border border-gray-200 rounded-2xl bg-white p-5 sm:p-8 shadow-sm">
            <div className="text-sm text-gray-600">در حال انتقال به صفحه اصلی...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* <PaymentCartList items={items} isLoading={isCartLoading} /> */}

              <OrderForm
                user={user}
                items={minimalItemsForBackend}
                custom_items={minimalCustomItemsForBackend}
                pricing={pricing}
                onSubmit={handleSubmitOrder}
                isSubmitting={createOrderMutation.isPending}
              />
            </div>

            <div className="lg:col-span-1 space-y-6">
              <PricingSummary pricing={pricing} isLoading={isPricingLoading} />

              {/* <div className="border border-gray-200 rounded-2xl bg-white p-4 sm:p-5">
                <Alert
                  variant="info"
                  size="md"
                  message="در صورت نیاز می‌توانید قبل از ثبت سفارش، سبد خرید را از آیکون سبد در هدر ویرایش کنید."
                />
                <div className="mt-4">
                  <BaseButton
                    href={ROUTES.HOME}
                    variant="outline"
                    size="md"
                    fullWidth
                  >
                    بازگشت به صفحه اصلی
                  </BaseButton>
                </div>
              </div> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


