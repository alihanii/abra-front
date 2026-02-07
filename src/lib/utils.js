import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx and tailwind-merge for optimal class merging
 *
 * @param {...any} inputs - Class names to merge
 * @returns {string} Merged class names
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Decode URL to handle encoded characters
 * @param {string} url - URL string to decode
 * @returns {string} Decoded URL or original if decoding fails
 */
export function decodeImageUrl(url) {
  if (!url || typeof url !== "string") return url;
  
  try {
    const parsedUrl = new URL(url);
    parsedUrl.pathname = decodeURIComponent(parsedUrl.pathname);
    return parsedUrl.toString();
  } catch {
    try {
      return decodeURIComponent(url);
    } catch {
      return url;
    }
  }
}