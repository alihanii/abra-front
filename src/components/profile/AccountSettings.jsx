"use client";

import { useState, useEffect } from "react";
import BaseInput from "@/components/ui/BaseInput";
import BaseButton from "@/components/ui/BaseButton";
import ScrollReveal from "@/components/ui/ScrollReveal";
import LoadingScreen from "@/components/ui/LoadingScreen";
import Alert from "@/components/ui/Alert";
import { useAuth } from "@/contexts/AuthContext";
import { useUpdateProfile } from "@/hooks/useApi";
import { cn } from "@/lib/utils";

/**
 * Account Settings Component
 * Form for managing user account details (name, phone, password)
 *
 * @param {Object} props.user - Current user object
 * @param {Function} props.onUpdate - Callback when user data is updated
 * @param {boolean} props.isLoading - Whether user data is loading
 */
export default function AccountSettings({ user, onUpdate, isLoading: externalLoading = false }) {
  const { updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    email: user?.email || ""
  });

  // Update profile mutation
  const updateProfileMutation = useUpdateProfile({
    onSuccess: (data) => {
      // Update user in AuthContext
      updateUser(data);
      setIsEditing(false);
      setSuccessMessage("اطلاعات با موفقیت به‌روزرسانی شد");
      setError(null);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
      if (onUpdate) {
        onUpdate(data);
      }
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.detail || 
                         error?.response?.data?.message ||
                         error?.message ||
                         "خطا در به‌روزرسانی اطلاعات. لطفاً دوباره تلاش کنید.";
      setError(errorMessage);
      setSuccessMessage(null);
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Update form data when user changes (only when not editing)
  useEffect(() => {
    if (user && !isEditing) {
      setFormData({
        full_name: user.full_name || "",
        email: user.email || ""
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, isEditing]);

  // Show loading screen if user data is not available
  if (externalLoading || !user) {
    return (
      <div className="relative min-h-[400px]">
        <LoadingScreen
          isLoading={true}
          logoText="Abra"
          typingSpeed={100}
          minDisplayTime={800}
          className="relative inset-auto z-0 bg-transparent"
        />
      </div>
    );
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setError(null);
    setSuccessMessage(null);
    
    // Validate email format if provided
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("فرمت ایمیل معتبر نیست");
      return;
    }

    // Prepare data for API (only send fields that have values)
    const updateData = {};
    if (formData.full_name) {
      updateData.full_name = formData.full_name;
    }
    if (formData.email) {
      updateData.email = formData.email;
    }

    // Call mutation
    updateProfileMutation.mutate(updateData);
  };

  const handlePasswordSave = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("رمز عبور جدید و تأیید آن مطابقت ندارند");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("رمز عبور باید حداقل ۶ کاراکتر باشد");
      return;
    }

    // TODO: Implement password change API
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      alert("رمز عبور با موفقیت تغییر کرد");
    } catch (error) {
      console.error("Failed to change password:", error);
      alert("خطا در تغییر رمز عبور");
    }
  };

  return (
    <div className="space-y-6">
      {/* Personal Information Section */}
      <ScrollReveal
        animation="fadeUp"
        delay={0}
        threshold={0.1}
      >
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <i className="ri-user-line text-xl"></i>
              اطلاعات شخصی
            </h3>
            {!isEditing && (
              <BaseButton
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <i className="ri-edit-line ml-2"></i>
                ویرایش
              </BaseButton>
            )}
          </div>

          <div className="space-y-4">
            {error && (
              <Alert
                variant="error"
                size="md"
                message={error}
                className="mb-4"
              />
            )}

            {successMessage && (
              <Alert
                variant="success"
                size="md"
                message={successMessage}
                className="mb-4"
              />
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                نام و نام خانوادگی
              </label>
              <BaseInput
                variant="primary"
                size="md"
                value={formData.full_name || ""}
                onChange={(e) => handleInputChange("full_name", e.target.value)}
                disabled={!isEditing}
                placeholder="نام و نام خانوادگی خود را وارد کنید"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ایمیل
              </label>
              <BaseInput
                variant="primary"
                size="md"
                type="email"
                value={formData.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={!isEditing}
                placeholder="ایمیل خود را وارد کنید"
              />
            </div>

            {/* <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">شماره تماس</label>
              <BaseInput
                variant="primary"
                size="md"
                type="tel"
                value={formData.phone_number}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                disabled={!isEditing}
                placeholder="شماره تماس خود را وارد کنید"
              />
            </div> */}

            {isEditing && (
              <div className="flex gap-3 pt-2">
                <BaseButton
                  variant="primary"
                  size="md"
                  onClick={handleSave}
                  disabled={updateProfileMutation.isPending}
                  fullWidth
                >
                  {updateProfileMutation.isPending ? (
                    <>
                      <i className="ri-loader-4-line animate-spin ml-2"></i>
                      در حال ذخیره...
                    </>
                  ) : (
                    <>
                      <i className="ri-save-line ml-2"></i>
                      ذخیره تغییرات
                    </>
                  )}
                </BaseButton>
                <BaseButton
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setIsEditing(false);
                    setError(null);
                    setSuccessMessage(null);
                    setFormData({
                      full_name: user?.full_name || "",
                      email: user?.email || ""
                    });
                  }}
                  disabled={updateProfileMutation.isPending}
                  fullWidth
                >
                  انصراف
                </BaseButton>
              </div>
            )}
          </div>
        </div>
      </ScrollReveal>

      {/* Password Section */}
      <ScrollReveal
        animation="fadeUp"
        delay={100}
        threshold={0.1}
      >
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <i className="ri-lock-line text-xl"></i>
              تغییر رمز عبور
            </h3>
            {!isChangingPassword && (
              <BaseButton
                variant="outline"
                size="sm"
                onClick={() => setIsChangingPassword(true)}
              >
                <i className="ri-key-line ml-2"></i>
                تغییر رمز عبور
              </BaseButton>
            )}
          </div>

          {isChangingPassword && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  رمز عبور فعلی
                </label>
                <BaseInput
                  variant="primary"
                  size="md"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                  placeholder="رمز عبور فعلی را وارد کنید"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  رمز عبور جدید
                </label>
                <BaseInput
                  variant="primary"
                  size="md"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                  placeholder="رمز عبور جدید را وارد کنید"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  تأیید رمز عبور جدید
                </label>
                <BaseInput
                  variant="primary"
                  size="md"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                  placeholder="رمز عبور جدید را مجدداً وارد کنید"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <BaseButton
                  variant="primary"
                  size="md"
                  onClick={handlePasswordSave}
                  disabled={isLoading}
                  fullWidth
                >
                  {isLoading ? (
                    <>
                      <i className="ri-loader-4-line animate-spin ml-2"></i>
                      در حال تغییر...
                    </>
                  ) : (
                    <>
                      <i className="ri-check-line ml-2"></i>
                      تغییر رمز عبور
                    </>
                  )}
                </BaseButton>
                <BaseButton
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: ""
                    });
                  }}
                  disabled={isLoading}
                  fullWidth
                >
                  انصراف
                </BaseButton>
              </div>
            </div>
          )}

          {!isChangingPassword && (
            <p className="text-sm text-gray-600">
              برای امنیت بیشتر حساب کاربری خود، رمز عبور قوی انتخاب کنید.
            </p>
          )}
        </div>
      </ScrollReveal>
    </div>
  );
}
