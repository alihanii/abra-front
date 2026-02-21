/**
 * Format price for display
 * @param {string|number} value - Raw price value
 * @returns {string} Formatted price with Persian locale and تومان suffix
 */
export function formatPrice(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return String(value ?? "0");
  return new Intl.NumberFormat("fa-IR").format(num / 10) + " تومان";
}
