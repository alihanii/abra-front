"use client";

import { forwardRef, useId } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Input variants using class-variance-authority
 */
const inputVariants = cva(
  // Base styles
  "w-full rounded-full font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border-2",
  {
    variants: {
      variant: {
        primary:
          "bg-white text-gray-900 border-gray-300 focus:border-gray-900 focus:ring-gray-900 placeholder:text-gray-400 hover:border-gray-400",
        secondary:
          "bg-gray-50 text-gray-900 border-gray-300 focus:border-gray-900 focus:ring-gray-900 placeholder:text-gray-400 hover:border-gray-400",
        outline:
          "bg-transparent text-gray-900 border-gray-300 focus:border-gray-900 focus:ring-gray-900 placeholder:text-gray-400 hover:border-gray-400",
        ghost:
          "bg-transparent text-gray-700 border-transparent focus:border-gray-300 focus:ring-gray-900 placeholder:text-gray-400 hover:border-gray-200"
      },
      size: {
        sm: "px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm",
        md: "px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base",
        lg: "px-5 py-3 text-base sm:px-6 sm:py-4 sm:text-lg"
      },
      fullWidth: {
        true: "w-full",
        false: "w-auto"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: true
    }
  }
);

/**
 * BaseInput Component
 * Reusable input component with variants matching BaseButton styles
 *
 * @param {Object} props
 * @param {string} props.label - Label text for the input
 * @param {string} props.variant - Input variant: 'primary' | 'secondary' | 'outline' | 'ghost'
 * @param {string} props.size - Input size: 'sm' | 'md' | 'lg'
 * @param {boolean} props.fullWidth - Make input full width (default: true)
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.inputClassName - Additional CSS classes for input element
 * @param {string} props.type - Input type (text, email, password, etc.)
 * @param {string} props.id - Input id (auto-generated if not provided)
 */
const BaseInput = forwardRef(
  (
    {
      label,
      variant = "primary",
      size = "md",
      fullWidth = true,
      className,
      inputClassName,
      type = "text",
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    const inputClasses = cn(inputVariants({ variant, size, fullWidth }), inputClassName);

    const wrapperClasses = cn("w-full", className);

    return (
      <div className={wrapperClasses}>
        {label && (
          <label
            htmlFor={inputId}
            className="block mb-2 text-sm font-semibold text-gray-900"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={inputClasses}
          {...props}
        />
      </div>
    );
  }
);

BaseInput.displayName = "BaseInput";

export default BaseInput;
export { inputVariants };
