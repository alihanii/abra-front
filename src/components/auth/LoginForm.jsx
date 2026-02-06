"use client";

import { useState } from "react";
import BaseInput from "@/components/ui/BaseInput";
import BaseButton from "@/components/ui/BaseButton";
import Alert from "@/components/ui/Alert";
import { cn } from "@/lib/utils";

/**
 * Login Form Component
 * Form for user login with phone and password, or SMS login option
 *
 * @param {Object} props
 * @param {Function} props.onLogin - Callback when login is successful
 * @param {Function} props.onSMSLogin - Callback when SMS login is requested
 * @param {Function} props.onRegister - Callback to switch to register form
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.error - Error message to display
 */
export default function LoginForm({
  onLogin,
  onSMSLogin,
  onRegister,
  isLoading = false,
  error = null
}) {
  const [formData, setFormData] = useState({
    phone: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLogin && formData.phone && formData.password) {
      onLogin(formData);
    }
  };

  const handleSMSLogin = () => {
    if (onSMSLogin && formData.phone) {
      onSMSLogin(formData.phone);
    }
  };

  const isFormValid = formData.phone.length >= 10 && formData.password.length >= 6;

  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">ورود به حساب کاربری</h2>
        <p className="text-sm text-gray-600">لطفاً اطلاعات خود را وارد کنید</p>
      </div>

      {error && (
        <Alert
          variant="error"
          size="md"
          message={error}
          className="mb-4"
        />
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <BaseInput
          label="شماره تماس"
          type="tel"
          variant="primary"
          size="md"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          placeholder="09123456789"
          disabled={isLoading}
          required
          inputMode="numeric"
        />

        <div className="relative">
          <BaseInput
            label="رمز عبور"
            type={showPassword ? "text" : "password"}
            variant="primary"
            size="md"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder="رمز عبور خود را وارد کنید"
            disabled={isLoading}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-5 top-10 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <i className={cn("text-xl", showPassword ? "ri-eye-off-line" : "ri-eye-line")}></i>
          </button>
        </div>

        <BaseButton
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? (
            <>
              <i className="ri-loader-4-line animate-spin ml-2"></i>
              در حال ورود...
            </>
          ) : (
            <>
              <i className="ri-login-box-line ml-2"></i>
              ورود
            </>
          )}
        </BaseButton>
      </form>

      <div className="mt-4 space-y-3">
        <BaseButton
          type="button"
          variant="outline"
          size="md"
          fullWidth
          onClick={handleSMSLogin}
          disabled={!formData.phone || formData.phone.length < 10 || isLoading}
        >
          <i className="ri-message-3-line ml-2"></i>
          ورود با پیامک
        </BaseButton>

        <div className="text-center text-sm text-gray-600">
          <span>حساب کاربری ندارید؟ </span>
          <button
            type="button"
            onClick={onRegister}
            className="text-gray-900 font-semibold hover:underline cursor-pointer"
            disabled={isLoading}
          >
            ثبت نام کنید
          </button>
        </div>
      </div>
    </div>
  );
}
