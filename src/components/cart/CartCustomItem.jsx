"use client";

import { useTranslations } from "next-intl";
import { useCart } from "@/contexts/CartContext";
import QuantityControl from "@/components/ui/QuantityControl";
import BaseImage from "@/components/ui/BaseImage";
import { container } from "@/lib/styles";
import { formatPrice } from "@/lib/utils/formatPrice";

/**
 * Cart Custom Item Component
 * Displays a single custom product in cart with quantity controls and remove option
 *
 * @param {Object} props
 * @param {Object} props.item - Custom cart item { id, custom_product_id, name, price, image, quantity, size, color }
 */
export default function CartCustomItem({ item }) {
  const t = useTranslations();
  const { updateCustomQuantity, removeCustomItem } = useCart();

  const handleDecrease = () => {
    updateCustomQuantity(item.custom_product_id, item.quantity - 1);
  };

  const availableStock = item.availableStock ?? 99;
  const maxQuantity = Math.max(1, availableStock);

  const handleIncrease = () => {
    if (item.quantity >= maxQuantity) return;
    updateCustomQuantity(item.custom_product_id, item.quantity + 1);
  };

  const handleRemove = () => {
    removeCustomItem(item.custom_product_id);
  };

  const displayPrice = item.price ?? 0;

  return (
    <div className={container}>
      <div className="flex gap-4">
        <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
          <BaseImage
            src={item.image}
            alt={item.name}
            width={96}
            height={96}
            className="rounded-lg"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-1 truncate text-sm md:text-base">{item.name}</h3>

          <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-2">
            {item.size && (
              <span className="text-sm">
                {t("cart.size")}: {item.size}
              </span>
            )}
            {item.size && item.color && <span className="hidden md:block">{t("cart.separator")}</span>}
            {item.color && (
              <span className="text-sm">
                {t("cart.color")}: {item.color}
              </span>
            )}
          </div>

          <div className="flex md:items-center items-end md:gap-10 gap-1 flex-col md:flex-row justify-between absolute left-6 md:bottom-6 bottom-5 ">

            <QuantityControl
              value={item.quantity}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              min={1}
              max={maxQuantity}
              size="xs"
            />
            <span className="text-sm md:text-lg font-bold text-gray-900">
              {formatPrice(displayPrice)}
            </span>
          </div>
        </div>

        <button
          onClick={handleRemove}
          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all cursor-pointer shrink-0"
          aria-label={t("cart.removeItem")}
        >
          <i className="ri-delete-bin-line text-lg"></i>
        </button>
      </div>
    </div>
  );
}
