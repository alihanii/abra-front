"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthModal } from "@/contexts/AuthModalContext";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import OTPVerification from "./OTPVerification";

/**
 * Auth Modal Component
 * Modal for authentication (login, register, OTP verification)
 */
export default function AuthModal() {
  const { login } = useAuth();
  const { isOpen, closeAuthModal } = useAuthModal();
  const [currentView, setCurrentView] = useState("login"); // 'login' | 'register' | 'otp'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [phone, setPhone] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle mount/unmount with animation delay
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setIsMounted(false);
        setCurrentView("login");
        setError(null);
        setPhone("");
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        closeAuthModal();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, closeAuthModal]);

  // Handle login
  const handleLogin = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock: Check if user exists (in real app, this would be an API call)
      const mockUsers = JSON.parse(localStorage.getItem("mock_users") || "[]");
      const user = mockUsers.find((u) => u.phone === formData.phone);

      if (!user || user.password !== formData.password) {
        throw new Error("شماره تماس یا رمز عبور اشتباه است");
      }

      // Login successful
      const token = `mock_token_${Date.now()}`;
      login(token, {
        id: user.id,
        name: user.name || "",
        phone: user.phone
      });

      closeAuthModal();
    } catch (err) {
      setError(err.message || "خطا در ورود. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle SMS login
  const handleSMSLogin = async (phoneNumber) => {
    setPhone(phoneNumber);
    setIsLoading(true);
    setError(null);

    try {
      // Simulate sending OTP
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock: Check if user exists
      const mockUsers = JSON.parse(localStorage.getItem("mock_users") || "[]");
      const userExists = mockUsers.some((u) => u.phone === phoneNumber);

      if (!userExists) {
        // User doesn't exist, go to register
        setCurrentView("register");
        setError("حساب کاربری با این شماره تماس یافت نشد. لطفاً ثبت نام کنید.");
      } else {
        // User exists, go to OTP verification
        setCurrentView("otp");
      }
    } catch (err) {
      setError(err.message || "خطا در ارسال کد. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle register
  const handleRegister = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock: Check if user already exists
      const mockUsers = JSON.parse(localStorage.getItem("mock_users") || "[]");
      const userExists = mockUsers.some((u) => u.phone === formData.phone);

      if (userExists) {
        throw new Error("حساب کاربری با این شماره تماس قبلاً ثبت شده است");
      }

      // Save user and go to OTP verification
      const newUser = {
        id: `user_${Date.now()}`,
        phone: formData.phone,
        password: formData.password,
        name: ""
      };
      mockUsers.push(newUser);
      localStorage.setItem("mock_users", JSON.stringify(mockUsers));

      setPhone(formData.phone);
      setCurrentView("otp");
    } catch (err) {
      setError(err.message || "خطا در ثبت نام. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP verification
  const handleOTPVerify = async (code) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock: Verify OTP (in real app, this would verify with backend)
      if (code !== "12345") {
        throw new Error("کد تأیید اشتباه است");
      }

      // Get user from mock storage
      const mockUsers = JSON.parse(localStorage.getItem("mock_users") || "[]");
      const user = mockUsers.find((u) => u.phone === phone);

      if (!user) {
        throw new Error("کاربر یافت نشد");
      }

      // Login successful
      const token = `mock_token_${Date.now()}`;
      login(token, {
        id: user.id,
        name: user.name || "",
        phone: user.phone
      });

      closeAuthModal();
    } catch (err) {
      setError(err.message || "خطا در تأیید کد. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate sending OTP
      await new Promise((resolve) => setTimeout(resolve, 500));
      setError(null);
    } catch (err) {
      setError("خطا در ارسال مجدد کد. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 bg-black/50 backdrop-blur-sm z-50
          transition-opacity duration-300 ease-in-out
          ${isAnimating ? "opacity-100" : "opacity-0"}
        `}
        onClick={closeAuthModal}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className={`
          fixed inset-0 z-50 flex items-center justify-center p-4
          transition-opacity duration-300 ease-in-out
          ${isAnimating ? "opacity-100" : "opacity-0"}
        `}
        role="dialog"
        aria-modal="true"
        aria-label="Authentication"
      >
        <div
          className={`
            bg-white rounded-2xl shadow-2xl w-full max-w-md
            transform transition-all duration-300 ease-out
            ${isAnimating ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 sm:p-8">
            {/* Close Button */}
            <button
              onClick={closeAuthModal}
              className="absolute top-4 left-4 w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all cursor-pointer"
              aria-label="Close modal"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>

            {/* Content */}
            {currentView === "login" && (
              <LoginForm
                onLogin={handleLogin}
                onSMSLogin={handleSMSLogin}
                onRegister={() => {
                  setCurrentView("register");
                  setError(null);
                }}
                isLoading={isLoading}
                error={error}
              />
            )}

            {currentView === "register" && (
              <RegisterForm
                onRegister={handleRegister}
                onLogin={() => {
                  setCurrentView("login");
                  setError(null);
                }}
                isLoading={isLoading}
                error={error}
              />
            )}

            {currentView === "otp" && (
              <OTPVerification
                phone={phone}
                onVerify={handleOTPVerify}
                onResend={handleResendOTP}
                onBack={() => {
                  setCurrentView("login");
                  setError(null);
                }}
                isLoading={isLoading}
                error={error}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
