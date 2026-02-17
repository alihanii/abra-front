"use client";

import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Alert variants using class-variance-authority
 */
const alertVariants = cva(
  // Base styles
  "w-full p-3 rounded-lg border flex items-start gap-2 transition-all",
  {
    variants: {
      variant: {
        error: "bg-red-50 border-red-200 text-red-600",
        warning: "bg-yellow-50 border-yellow-200 text-yellow-700",
        info: "bg-blue-50 border-blue-200 text-blue-600",
        success: "bg-green-50 border-green-200 text-green-600"
      },
      size: {
        sm: "p-2 text-xs",
        md: "p-3 text-sm",
        lg: "p-4 text-base"
      }
    },
    defaultVariants: {
      variant: "info",
      size: "md"
    }
  }
);

/**
 * Icon mapping for different alert types
 */
const iconMap = {
  error: "ri-error-warning-line",
  warning: "ri-alert-line",
  info: "ri-information-line",
  success: "ri-checkbox-circle-line"
};

/**
 * Alert Component
 * Reusable alert component for displaying messages (error, warning, info, success)
 *
 * @param {Object} props
 * @param {string} props.variant - Alert variant: 'error' | 'warning' | 'info' | 'success'
 * @param {string} props.size - Alert size: 'sm' | 'md' | 'lg'
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Alert content
 * @param {string} props.message - Alert message (alternative to children)
 * @param {boolean} props.showIcon - Show icon (default: true)
 * @param {string} props.icon - Custom icon class name
 */
export default function Alert({
  variant = "info",
  size = "md",
  className,
  children,
  message,
  showIcon = true,
  icon,
  ...props
}) {
  const alertClasses = cn(alertVariants({ variant, size }), className);
  const iconClass = icon || iconMap[variant] || iconMap.info;

  const content = message || children;

  return (
    <div
      className={alertClasses}
      role="alert"
      {...props}
    >
      {showIcon && <i className={cn("text-lg shrink-0 mt-0.5", iconClass)}></i>}
      <div className="flex-1 min-w-0">
        {typeof content === "string" ? <p className="leading-relaxed mt-1">{content}</p> : content}
      </div>
    </div>
  );
}

export { alertVariants };
