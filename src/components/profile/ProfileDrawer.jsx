"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";
import { useLogin } from "@/hooks/useApi";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ProfileTabs from "./ProfileTabs";
import PurchaseHistory from "./PurchaseHistory";
import AccountSettings from "./AccountSettings";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import OTPVerification from "@/components/auth/OTPVerification";

/**
 * Profile Drawer Component
 * Side drawer for user profile with tabs for purchase history and account settings
 */
export default function ProfileDrawer() {
  const { isAuthenticated, user, logout, login, isLoading: authLoading } = useAuth();
  const { isOpen, closeProfile } = useProfile();
  const [isMounted, setIsMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeTab, setActiveTab] = useState("history");

  // Auth form states
  const [authView, setAuthView] = useState("login"); // 'login' | 'register' | 'otp'
  const [error, setError] = useState(null);
  const [phone, setPhone] = useState("");

  // Login mutation hook
  const loginMutation = useLogin({
    onSuccess: (data) => {
      // Save tokens and user data
      login(data.access, data.user, data.refresh);
      setError(null);
      // Don't close drawer, just show authenticated content
    },
    onError: (error) => {
      // Extract error message from API response
      const errorMessage = error?.response?.data?.detail || 
                          error?.response?.data?.message ||
                          error?.message ||
                          "خطا در ورود. لطفاً دوباره تلاش کنید.";
      setError(errorMessage);
    }
  });

  // Handle mount/unmount with animation delay
  useEffect(() => {
    if (isOpen) {
      // Use requestAnimationFrame to avoid synchronous setState
      requestAnimationFrame(() => {
        setIsMounted(true);
        setTimeout(() => setIsAnimating(true), 10);
      });
    } else {
      // Use setTimeout to avoid synchronous setState
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setIsMounted(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Prevent body scroll when drawer is open
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
        closeProfile();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, closeProfile]);

  // Reset auth form when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setAuthView("login");
      setError(null);
      setPhone("");
    }
  }, [isOpen]);

  // Handle login
  const handleLogin = async (formData) => {
    setError(null);
    
    // Call login mutation with phone_number format
    loginMutation.mutate({
      phone_number: formData.phone,
      password: formData.password
    });
  };

  // Handle SMS login
  const handleSMSLogin = async (phoneNumber) => {
    setPhone(phoneNumber);
    setError(null);

    try {
      // TODO: Implement SMS login API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // For now, go to OTP verification
      setAuthView("otp");
    } catch (err) {
      setError(err.message || "خطا در ارسال کد. لطفاً دوباره تلاش کنید.");
    }
  };

  // Handle register
  const handleRegister = async (formData) => {
    setError(null);

    try {
      // TODO: Implement register API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setPhone(formData.phone);
      setAuthView("otp");
    } catch (err) {
      setError(err.message || "خطا در ثبت نام. لطفاً دوباره تلاش کنید.");
    }
  };

  // Handle OTP verification
  const handleOTPVerify = async (code) => {
    setError(null);

    try {
      // TODO: Implement OTP verification API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // TODO: Replace with actual API response handling
      throw new Error("OTP verification API not implemented yet");
    } catch (err) {
      setError(err.message || "خطا در تأیید کد. لطفاً دوباره تلاش کنید.");
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    setError(null);

    try {
      // Simulate sending OTP
      await new Promise((resolve) => setTimeout(resolve, 500));
      setError(null);
    } catch (err) {
      setError("خطا در ارسال مجدد کد. لطفاً دوباره تلاش کنید.");
    }
  };

  const handleLogout = () => {
    logout();
    setAuthView("login");
  };

  if (!isMounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 bg-black/50 backdrop-blur-sm z-40
          transition-opacity duration-300 ease-in-out
          ${isAnimating ? "opacity-100" : "opacity-0"}
        `}
        onClick={closeProfile}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`
          fixed top-0 right-0 h-full w-full md:w-[480px] bg-white shadow-2xl z-50
          transform transition-transform duration-300 ease-out
          ${isAnimating ? "translate-x-0" : "translate-x-full"}
        `}
        role="dialog"
        aria-modal="true"
        aria-label="User profile"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <i className="ri-user-line text-2xl text-gray-900"></i>
              <h2 className="text-2xl font-bold text-gray-900">حساب کاربری</h2>
            </div>

            <button
              onClick={closeProfile}
              className="w-10 h-10 flex items-center justify-center text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all cursor-pointer"
              aria-label="Close profile"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>

          {/* Profile Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {!isAuthenticated ? (
              <div
                className={`
                  transition-all duration-300 ease-out
                  ${isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
                `}
              >
                {authView === "login" && (
                  <LoginForm
                    onLogin={handleLogin}
                    onSMSLogin={handleSMSLogin}
                    onRegister={() => {
                      setAuthView("register");
                      setError(null);
                    }}
                    isLoading={loginMutation.isPending}
                    error={error}
                  />
                )}

                {authView === "register" && (
                  <RegisterForm
                    onRegister={handleRegister}
                    onLogin={() => {
                      setAuthView("login");
                      setError(null);
                    }}
                    isLoading={false}
                    error={error}
                  />
                )}

                {authView === "otp" && (
                  <OTPVerification
                    phone={phone}
                    onVerify={handleOTPVerify}
                    onResend={handleResendOTP}
                    onBack={() => {
                      setAuthView("login");
                      setError(null);
                    }}
                    isLoading={false}
                    error={error}
                  />
                )}
              </div>
            ) : (
              <>
                {/* User Info Card */}
                <ScrollReveal
                  animation="fadeUp"
                  delay={0}
                  threshold={0.1}
                >
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                        <i className="ri-user-fill text-3xl text-gray-600"></i>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg mb-1">
                          {user?.full_name || "کاربر"}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {user?.phone_number || "شماره تماس ثبت نشده"}
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-full transition-all cursor-pointer"
                        aria-label="Logout"
                      >
                        <i className="ri-logout-box-line ml-2"></i>
                        خروج
                      </button>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Tabs */}
                <ScrollReveal
                  animation="fadeUp"
                  delay={50}
                  threshold={0.1}
                >
                  <ProfileTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                  />
                </ScrollReveal>

                {/* Tab Content */}
                <ScrollReveal
                  animation="fadeUp"
                  delay={100}
                  threshold={0.1}
                >
                  {activeTab === "history" ? (
                    <PurchaseHistory
                      orders={user?.orders}
                      isLoading={authLoading}
                    />
                  ) : (
                    <AccountSettings
                      user={user}
                      isLoading={authLoading}
                    />
                  )}
                </ScrollReveal>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
