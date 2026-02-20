"use client";

import { useMemo, useState } from "react";
import BaseInput from "@/components/ui/BaseInput";
import BaseButton from "@/components/ui/BaseButton";
import Alert from "@/components/ui/Alert";
import { container } from "@/lib/styles";

const digitsOnly = (value) => String(value || "").replace(/\D+/g, "");

const getFieldErrors = (data) => {
  const errors = {};

  const fullName = String(data.full_name || "").trim();
  if (!fullName) {
    errors.full_name = "نام الزامی است.";
  } else if (fullName.length < 3) {
    errors.full_name = "نام باید حداقل ۳ حرف باشد.";
  }

  const phone = digitsOnly(data.phone_number);
  if (!phone) {
    errors.phone_number = "شماره تماس الزامی است.";
  } else if (phone.length !== 11) {
    errors.phone_number = "شماره تماس باید دقیقاً ۱۱ رقم باشد.";
  } else if (!phone.startsWith("09")) {
    errors.phone_number = "شماره تماس باید با 09 شروع شود.";
  }

  const postal = digitsOnly(data.postal_code);
  if (!postal) {
    errors.postal_code = "کد پستی الزامی است.";
  } else if (postal.length !== 10) {
    errors.postal_code = "کد پستی باید دقیقاً ۱۰ رقم باشد.";
  }

  const address = String(data.address || "").trim();
  if (!address) {
    errors.address = "آدرس الزامی است.";
  } else if (address.length < 16) {
    errors.address = "آدرس باید حداقل ۱۶ حرف باشد.";
  }

  return errors;
};

/**
 * OrderForm
 * Collects shipping info and submits order.
 *
 * @param {Object} props
 * @param {Object|null} props.user - Auth user (for default values)
 * @param {Array} props.items - minimal items to send to backend [{id,color,size,quantity}]
 * @param {Array} props.custom_items - minimal custom items [{custom_product_id,quantity,unit_price}]
 * @param {Object|null} props.pricing - pricing summary (optional to send)
 * @param {Function} props.onSubmit - async (payload) => Promise
 * @param {boolean} props.isSubmitting
 */
export default function OrderForm({
  user,
  items = [],
  custom_items = [],
  pricing = null,
  onSubmit,
  isSubmitting = false
}) {
  const [form, setForm] = useState({
    full_name: "",
    phone_number: "",
    postal_code: "",
    address: "",
    details: ""
  });

  const [touched, setTouched] = useState({
    full_name: false,
    phone_number: false,
    postal_code: false,
    address: false
  });

  const [error, setError] = useState(null);

  const resolvedForm = useMemo(() => {
    const defaults = {
      full_name: user?.full_name || "",
      phone_number: user?.phone_number || ""
    };

    return {
      ...form,
      full_name: touched.full_name ? form.full_name : defaults.full_name,
      phone_number: touched.phone_number ? form.phone_number : defaults.phone_number
    };
  }, [form, touched.full_name, touched.phone_number, user?.full_name, user?.phone_number]);

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (error) setError(null);
  };

  const fieldErrors = useMemo(() => getFieldErrors(resolvedForm), [resolvedForm]);
  const hasErrors = Object.keys(fieldErrors).length > 0;

  const isValid =
    !hasErrors;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!items.length && !custom_items.length) {
      setError("سبد خرید خالی است.");
      return;
    }
    if (!isValid) {
      setTouched({
        full_name: true,
        phone_number: true,
        postal_code: true,
        address: true
      });
      setError("لطفاً اطلاعات را کامل و صحیح وارد کنید.");
      return;
    }
    if (!onSubmit) return;

    const payload = {
      ...resolvedForm,
      items: [...items, ...custom_items],
      // custom_items,
      // pricing
    };

    try {
      await onSubmit(payload);
    } catch (err) {
      setError(err?.message || "خطا در ثبت سفارش. لطفاً دوباره تلاش کنید.");
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-gray-900">اطلاعات ارسال</h3>

      <div className={container}>
        {error ? (
          <Alert
            variant="error"
            size="md"
            message={error}
            className="mb-4"
          />
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <BaseInput
                label="نام و نام خانوادگی"
                variant="primary"
                size="md"
                value={resolvedForm.full_name}
                onChange={(e) => {
                  setTouched((prev) => ({ ...prev, full_name: true }));
                  update("full_name", e.target.value);
                }}
                placeholder="مثلاً: علی رضایی"
                disabled={isSubmitting}
                required
                aria-invalid={touched.full_name && !!fieldErrors.full_name}
              />
              {touched.full_name && fieldErrors.full_name ? (
                <p className="mt-2 mr-1 text-xs text-red-600">
                  {fieldErrors.full_name}
                </p>
              ) : null}
            </div>

            <div>
              <BaseInput
                label="شماره تماس"
                type="tel"
                inputMode="numeric"
                variant="primary"
                size="md"
                value={resolvedForm.phone_number}
                onChange={(e) => {
                  setTouched((prev) => ({ ...prev, phone_number: true }));
                  update("phone_number", digitsOnly(e.target.value).slice(0, 11));
                }}
                placeholder="09123456789"
                disabled={isSubmitting}
                required
                maxLength={11}
                aria-invalid={touched.phone_number && !!fieldErrors.phone_number}
              />
              {touched.phone_number && fieldErrors.phone_number ? (
                <p className="mt-2 mr-1 text-xs text-red-600">
                  {fieldErrors.phone_number}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <BaseInput
                label="کد پستی"
                inputMode="numeric"
                variant="primary"
                size="md"
                value={resolvedForm.postal_code}
                onChange={(e) => {
                  setTouched((prev) => ({ ...prev, postal_code: true }));
                  update("postal_code", digitsOnly(e.target.value).slice(0, 10));
                }}
                placeholder="مثلاً: 1234567890"
                disabled={isSubmitting}
                required
                maxLength={10}
                aria-invalid={touched.postal_code && !!fieldErrors.postal_code}
              />
              {touched.postal_code && fieldErrors.postal_code ? (
                <p className="mt-2 mr-1 text-xs text-red-600">
                  {fieldErrors.postal_code}
                </p>
              ) : (
                <div className="hidden sm:block" />
              )}
            </div>
          </div>

          <BaseInput
            label="آدرس"
            variant="primary"
            size="md"
            value={resolvedForm.address}
            onChange={(e) => {
              setTouched((prev) => ({ ...prev, address: true }));
              update("address", e.target.value);
            }}
            placeholder="آدرس کامل خود را وارد کنید"
            disabled={isSubmitting}
            required
            aria-invalid={touched.address && !!fieldErrors.address}
          />
          {touched.address && fieldErrors.address ? (
            <p className="-mt-2 text-xs text-red-600">
              {fieldErrors.address}
            </p>
          ) : null}

          <BaseInput
            label="جزئیات (اختیاری)"
            variant="secondary"
            size="md"
            value={resolvedForm.details}
            onChange={(e) => update("details", e.target.value)}
            placeholder="مثلاً: زنگ واحد ۳"
            disabled={isSubmitting}
          />

          <div className="pt-2">
            <BaseButton
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={!isValid || isSubmitting || (!items.length && !custom_items.length)}
            >
              {isSubmitting ? (
                <>
                  <i className="ri-loader-4-line animate-spin ml-2"></i>
                  در حال ثبت سفارش...
                </>
              ) : (
                <>
                  <i className="ri-shopping-bag-3-line ml-2"></i>
                  ثبت سفارش
                </>
              )}
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  );
}


