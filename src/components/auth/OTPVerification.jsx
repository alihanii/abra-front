'use client';

import { useState, useEffect } from 'react';
import OTPInput from './OTPInput';
import BaseButton from '@/components/ui/BaseButton';
import Alert from '@/components/ui/Alert';

/**
 * OTP Verification Component
 * Component for verifying OTP code sent via SMS
 * 
 * @param {Object} props
 * @param {string} props.phone - Phone number OTP was sent to
 * @param {Function} props.onVerify - Callback when OTP is verified
 * @param {Function} props.onResend - Callback to resend OTP
 * @param {Function} props.onBack - Callback to go back
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.error - Error message to display
 */
export default function OTPVerification({
  phone,
  onVerify,
  onResend,
  onBack,
  isLoading = false,
  error = null,
}) {
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleOTPComplete = (code) => {
    setOtp(code);
    if (onVerify && code.length === 5) {
      onVerify(code);
    }
  };

  const handleOTPChange = (code) => {
    setOtp(code);
  };

  const handleResend = () => {
    if (canResend && onResend) {
      setResendTimer(60);
      setCanResend(false);
      onResend();
    }
  };

  const maskedPhone = phone ? `${phone.slice(0, 4)}***${phone.slice(-2)}` : '';

  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
          <i className="ri-message-3-line text-3xl text-blue-600"></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">تأیید شماره تماس</h2>
        <p className="text-sm text-gray-600 mb-1">
          کد تأیید به شماره <span className="font-semibold text-gray-900">{maskedPhone}</span> ارسال شد
        </p>
        <p className="text-xs text-gray-500">لطفاً کد ۵ رقمی را وارد کنید</p>
      </div>

      {error && (
        <Alert variant="error" size="md" message={error} className="mb-4" />
      )}

      <div className="mb-6">
        <OTPInput
          length={5}
          onComplete={handleOTPComplete}
          onChange={handleOTPChange}
          disabled={isLoading}
          autoFocus={true}
        />
      </div>

      <div className="space-y-3">
        <BaseButton
          type="button"
          variant="primary"
          size="md"
          fullWidth
          onClick={() => onVerify && onVerify(otp)}
          disabled={otp.length !== 5 || isLoading}
        >
          {isLoading ? (
            <>
              <i className="ri-loader-4-line animate-spin ml-2"></i>
              در حال تأیید...
            </>
          ) : (
            <>
              <i className="ri-check-line ml-2"></i>
              تأیید کد
            </>
          )}
        </BaseButton>

        <div className="flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer flex items-center gap-1"
            disabled={isLoading}
          >
            <i className="ri-arrow-right-line"></i>
            بازگشت
          </button>

          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              className="text-gray-900 font-semibold hover:underline cursor-pointer flex items-center gap-1"
              disabled={isLoading}
            >
              <i className="ri-refresh-line"></i>
              ارسال مجدد کد
            </button>
          ) : (
            <span className="text-gray-500">
              ارسال مجدد کد در {resendTimer} ثانیه
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

