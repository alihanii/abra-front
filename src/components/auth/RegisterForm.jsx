'use client';

import { useState } from 'react';
import BaseInput from '@/components/ui/BaseInput';
import BaseButton from '@/components/ui/BaseButton';
import Alert from '@/components/ui/Alert';
import { cn } from '@/lib/utils';

/**
 * Register Form Component
 * Form for user registration with phone and password
 * 
 * @param {Object} props
 * @param {Function} props.onRegister - Callback when register is submitted
 * @param {Function} props.onLogin - Callback to switch to login form
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.error - Error message to display
 */
export default function RegisterForm({
  onRegister,
  onLogin,
  isLoading = false,
  error = null,
}) {
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return;
    }

    if (onRegister && formData.phone && formData.password) {
      onRegister({
        phone: formData.phone,
        password: formData.password,
      });
    }
  };

  const isFormValid =
    formData.phone.length >= 10 &&
    formData.password.length >= 6 &&
    formData.password === formData.confirmPassword;

  const passwordMismatch = formData.confirmPassword && formData.password !== formData.confirmPassword;

  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">ثبت نام</h2>
        <p className="text-sm text-gray-600">حساب کاربری جدید ایجاد کنید</p>
      </div>

      {error && (
        <Alert variant="error" size="md" message={error} className="mb-4" />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <BaseInput
          label="شماره تماس"
          type="tel"
          variant="primary"
          size="md"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="09123456789"
          disabled={isLoading}
          required
          inputMode="numeric"
        />

        <div className="relative">
          <BaseInput
            label="رمز عبور"
            type={showPassword ? 'text' : 'password'}
            variant="primary"
            size="md"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder="حداقل ۶ کاراکتر"
            disabled={isLoading}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 top-9 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <i className={cn('text-xl', showPassword ? 'ri-eye-off-line' : 'ri-eye-line')}></i>
          </button>
        </div>

        <div className="relative">
          <BaseInput
            label="تأیید رمز عبور"
            type={showConfirmPassword ? 'text' : 'password'}
            variant="primary"
            size="md"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            placeholder="رمز عبور را مجدداً وارد کنید"
            disabled={isLoading}
            required
            className={passwordMismatch ? 'border-red-300' : ''}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute left-3 top-9 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            <i className={cn('text-xl', showConfirmPassword ? 'ri-eye-off-line' : 'ri-eye-line')}></i>
          </button>
          {passwordMismatch && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
              <i className="ri-error-warning-line"></i>
              رمز عبور و تأیید آن مطابقت ندارند
            </p>
          )}
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
              در حال ثبت نام...
            </>
          ) : (
            <>
              <i className="ri-user-add-line ml-2"></i>
              ثبت نام
            </>
          )}
        </BaseButton>
      </form>

      <div className="mt-4 text-center text-sm text-gray-600">
        <span>قبلاً ثبت نام کرده‌اید؟ </span>
        <button
          type="button"
          onClick={onLogin}
          className="text-gray-900 font-semibold hover:underline cursor-pointer"
          disabled={isLoading}
        >
          وارد شوید
        </button>
      </div>
    </div>
  );
}

