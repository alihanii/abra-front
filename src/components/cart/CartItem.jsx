'use client';

import { useCart } from '@/contexts/CartContext';
import QuantityControl from '@/components/ui/QuantityControl';
import BaseImage from '@/components/ui/BaseImage';
import { container } from '@/lib/styles';

/**
 * Cart Item Component
 * Displays a single cart item with quantity controls and remove option
 * 
 * @param {Object} props
 * @param {Object} props.item - Cart item object
 */
export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();

  const handleDecrease = () => {
    updateQuantity(item.id, item.quantity - 1);
  };

  const handleIncrease = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleRemove = () => {
    removeItem(item.id);
  };

  return (
    <div className={container}>
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
          <BaseImage
            src={item.image}
            alt={item.name}
            width={96}
            height={96}
            className="rounded-lg"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-1 truncate">
            {item.name}
          </h3>
          
          {/* Product Variants */}
          <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-2">
            {item.size && <span>Size: {item.size}</span>}
            {item.size && item.color && <span>•</span>}
            {item.color && <span>Color: {item.color}</span>}
          </div>

          {/* Price and Quantity Controls */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">
              ${item.price.toFixed(2)}
            </span>
            
            {/* Quantity Controls */}
            <QuantityControl
              value={item.quantity}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              min={1}
              max={99}
              size="xs"
            />
          </div>
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all cursor-pointer shrink-0"
          aria-label="Remove item"
        >
          <i className="ri-delete-bin-line text-lg"></i>
        </button>
      </div>
    </div>
  );
}

