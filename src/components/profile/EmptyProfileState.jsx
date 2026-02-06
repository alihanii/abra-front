"use client";

import BaseButton from "@/components/ui/BaseButton";
import { useAuthModal } from "@/contexts/AuthModalContext";

/**
 * Empty Profile State Component
 * Shows when user is not logged in
 */
export default function EmptyProfileState({ onLogin }) {
  const { openAuthModal } = useAuthModal();

  const handleLoginClick = () => {
    if (onLogin) {
      onLogin();
    } else {
      openAuthModal();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
        <i className="ri-user-line text-4xl text-gray-400"></i>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2">وارد حساب کاربری خود شوید</h3>

      <p className="text-gray-600 mb-6 max-w-sm">
        برای مشاهده تاریخچه خرید و مدیریت حساب کاربری خود، لطفاً وارد شوید.
      </p>

      <BaseButton
        variant="primary"
        size="md"
        onClick={handleLoginClick}
        className="min-w-[200px]"
      >
        <i className="ri-login-box-line ml-2"></i>
        ورود / ثبت نام
      </BaseButton>
    </div>
  );
}
