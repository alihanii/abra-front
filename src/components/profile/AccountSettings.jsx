'use client';

import { useState, useEffect } from 'react';
import BaseInput from '@/components/ui/BaseInput';
import BaseButton from '@/components/ui/BaseButton';
import ScrollReveal from '@/components/ui/ScrollReveal';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

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
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

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
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      updateUser(formData);
      setIsEditing(false);
      if (onUpdate) {
        onUpdate(formData);
      }
    } catch (error) {
      console.error('Failed to update user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSave = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('رمز عبور جدید و تأیید آن مطابقت ندارند');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('رمز عبور باید حداقل ۶ کاراکتر باشد');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      alert('رمز عبور با موفقیت تغییر کرد');
    } catch (error) {
      console.error('Failed to change password:', error);
      alert('خطا در تغییر رمز عبور');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Personal Information Section */}
      <ScrollReveal animation="fadeUp" delay={0} threshold={0.1}>
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
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              نام و نام خانوادگی
            </label>
            <BaseInput
              variant="primary"
              size="md"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              disabled={!isEditing}
              placeholder="نام و نام خانوادگی خود را وارد کنید"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              شماره تماس
            </label>
            <BaseInput
              variant="primary"
              size="md"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              disabled={!isEditing}
              placeholder="شماره تماس خود را وارد کنید"
            />
          </div>

          {isEditing && (
            <div className="flex gap-3 pt-2">
              <BaseButton
                variant="primary"
                size="md"
                onClick={handleSave}
                disabled={isLoading}
                fullWidth
              >
                {isLoading ? (
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
                  setFormData({
                    name: user?.name || '',
                    phone: user?.phone || '',
                  });
                }}
                disabled={isLoading}
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
      <ScrollReveal animation="fadeUp" delay={100} threshold={0.1}>
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
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
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
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
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
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
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
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
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

