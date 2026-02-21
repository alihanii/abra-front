"use client";

import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Payment result card variants (success / failure)
 */
const resultCardVariants = cva(
  "w-full max-w-lg mx-auto rounded-2xl border p-6 sm:p-8 shadow-sm text-center transition-all",
  {
    variants: {
      variant: {
        success:
          "bg-green-50 border-green-200 text-green-800",
        failure:
          "bg-red-50 border-red-200 text-red-800"
      }
    },
    defaultVariants: {
      variant: "success"
    }
  }
);

const iconVariants = cva("text-5xl sm:text-6xl mb-4", {
  variants: {
    variant: {
      success: "text-green-600",
      failure: "text-red-600"
    }
  },
  defaultVariants: {
    variant: "success"
  }
});

const iconMap = {
  success: "ri-checkbox-circle-fill",
  failure: "ri-close-circle-fill"
};

/**
 * PaymentResultCard - Atomic result display for payment success/failure
 * @param {Object} props
 * @param {'success'|'failure'} props.variant - Visual theme
 * @param {string} props.message - Main message text
 * @param {string} [props.title] - Optional heading (sr-only by default for accessibility)
 * @param {React.ReactNode} [props.action] - Optional CTA (e.g. retry button)
 * @param {string} [props.className] - Additional classes
 */
export default function PaymentResultCard({
  variant = "success",
  message,
  title,
  action,
  className
}) {
  return (
    <article
      className={cn(resultCardVariants({ variant }), className)}
      aria-live="polite"
      role="status"
    >
      {title && (
        <h1 className="sr-only">{title}</h1>
      )}
      <i
        className={cn(iconMap[variant], iconVariants({ variant }))}
        aria-hidden
      />
      <p className="text-lg sm:text-xl font-semibold leading-relaxed">
        {message}
      </p>
      {action && (
        <div className="mt-6 flex justify-center">
          {action}
        </div>
      )}
    </article>
  );
}
