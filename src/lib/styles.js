import { cva } from "class-variance-authority";

/**
 * Container Variants
 * Reusable container styles with variants
 */
export const containerVariants = cva(
  // Base styles
  "bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow",
  {
    variants: {
      variant: {
        default: "bg-white border-gray-200",
        elevated: "bg-white border-gray-200 shadow-sm hover:shadow-lg",
        outlined: "bg-transparent border-gray-300",
        filled: "bg-gray-50 border-gray-200"
      },
      padding: {
        none: "p-0",
        sm: "p-2",
        md: "p-4",
        lg: "p-6",
        xl: "p-8"
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-lg",
        lg: "rounded-xl",
        full: "rounded-full"
      }
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
      rounded: "lg"
    }
  }
);

/**
 * Container class name helper
 * Quick access to default container styles
 */
export const container = containerVariants();
