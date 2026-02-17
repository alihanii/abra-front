"use client";

import { useEffect, useState } from "react";
import { useLogin } from "@/hooks/useApi";
import { useAuth } from "@/contexts/AuthContext";
import LoginForm from "@/components/auth/LoginForm";
import { showInfo, showError } from "@/lib/utils/toast";

/**
 * PaymentLoginGate
 * Shows LoginForm for unauthenticated users and calls the real login mutation.
 *
 * @param {Object} props
 * @param {Function} props.onLoggedIn - Callback after successful login
 */
export default function PaymentLoginGate({ onLoggedIn }) {
  const { login } = useAuth();
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   showInfo("برای ادامه پرداخت، لطفاً ابتدا وارد حساب کاربری شوید.");
  // }, []);

  const loginMutation = useLogin({
    onSuccess: (data) => {
      login(data.access, data.user, data.refresh);
      setError(null);
      if (onLoggedIn) onLoggedIn();
    },
    onError: (err) => {
      const errorMessage =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "خطا در ورود. لطفاً دوباره تلاش کنید.";
      setError(errorMessage);
      showError(errorMessage);
    }
  });

  const handleLogin = (formData) => {
    setError(null);
    loginMutation.mutate({
      phone_number: formData.phone,
      password: formData.password
    });
  };

  const handleSMSLogin = () => {
    showInfo("ورود با پیامک هنوز پیاده‌سازی نشده است.");
  };

  const handleRegister = () => {
    showInfo("ثبت‌نام از این صفحه پشتیبانی نمی‌شود. از بخش حساب کاربری اقدام کنید.");
  };

  return (
    <div className="w-full max-w-[520px] mx-auto">
      <div className="border border-gray-200 rounded-2xl bg-white p-5 sm:p-8 shadow-sm">
        <LoginForm
          onLogin={handleLogin}
          onSMSLogin={handleSMSLogin}
          onRegister={handleRegister}
          isLoading={loginMutation.isPending}
          error={error}
        />
      </div>
    </div>
  );
}


