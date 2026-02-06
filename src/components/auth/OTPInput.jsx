"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

/**
 * OTP Input Component
 * Reusable component for entering OTP codes with individual character inputs
 *
 * @param {Object} props
 * @param {number} props.length - Number of OTP digits (default: 5)
 * @param {Function} props.onComplete - Callback when OTP is complete
 * @param {Function} props.onChange - Callback when OTP changes
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.disabled - Disable inputs
 * @param {boolean} props.autoFocus - Auto focus first input
 */
export default function OTPInput({
  length = 5,
  onComplete,
  onChange,
  className,
  disabled = false,
  autoFocus = true
}) {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputRefs = useRef([]);

  // Focus first input on mount if autoFocus is enabled
  useEffect(() => {
    if (autoFocus && inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus, disabled]);

  // Handle input change
  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Call onChange callback
    if (onChange) {
      onChange(newOtp.join(""));
    }

    // Move to next input if value entered
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Call onComplete if all inputs are filled
    if (newOtp.every((digit) => digit !== "") && onComplete) {
      onComplete(newOtp.join(""));
    }
  };

  // Handle key down
  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Handle arrow keys
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    if (/^\d+$/.test(pastedData)) {
      const pastedDigits = pastedData.slice(0, length).split("");
      const newOtp = [...otp];

      pastedDigits.forEach((digit, i) => {
        if (index + i < length) {
          newOtp[index + i] = digit;
        }
      });

      setOtp(newOtp);

      // Focus next empty input or last input
      const nextEmptyIndex = newOtp.findIndex((digit, i) => i >= index && digit === "");
      const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : length - 1;
      inputRefs.current[focusIndex]?.focus();

      if (onChange) {
        onChange(newOtp.join(""));
      }

      if (newOtp.every((digit) => digit !== "") && onComplete) {
        onComplete(newOtp.join(""));
      }
    }
  };

  // Clear OTP
  const clear = useCallback(() => {
    setOtp(Array(length).fill(""));
    inputRefs.current[0]?.focus();
  }, [length]);

  // Expose clear method
  useEffect(() => {
    if (inputRefs.current[0] && inputRefs.current[0].parentElement) {
      inputRefs.current[0].parentElement.clearOTP = clear;
    }
  }, [clear]);

  return (
    <div className={cn("flex gap-2 justify-center", className)}>
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={cn(
            "w-12 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-bold",
            "rounded-lg border-2 transition-all",
            "focus:outline-none focus:ring-2 focus:ring-offset-2",
            disabled
              ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white border-gray-300 text-gray-900 focus:border-gray-900 focus:ring-gray-900 hover:border-gray-400"
          )}
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  );
}
