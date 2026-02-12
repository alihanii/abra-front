"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import CartItem from "./CartItem";
import EmptyCart from "./EmptyCart";
import CartSummary from "./CartSummary";

/**
 * Cart Drawer Component
 * Side drawer for shopping cart with backdrop and smooth animations
 */
export default function CartDrawer() {
  const { isOpen, closeCart, items } = useCart();
  const [isMounted, setIsMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle mount/unmount with animation delay
  useEffect(() => {
    if (isOpen) {
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => {
        setIsMounted(true);
        // Small delay to trigger animation
        setTimeout(() => setIsAnimating(true), 10);
      }, 0);
    } else {
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => setIsAnimating(false), 0);
      // Wait for animation to complete before unmounting
      const timer = setTimeout(() => setIsMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        closeCart();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, closeCart]);

  if (!isMounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 bg-black/50 backdrop-blur-sm z-40
          transition-opacity duration-300 ease-in-out
          ${isAnimating ? "opacity-100" : "opacity-0"}
        `}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`
          fixed top-0 right-0 h-full w-full md:w-[480px] bg-white shadow-2xl z-50
          transform transition-transform duration-300 ease-out
          ${isAnimating ? "translate-x-0" : "translate-x-full"}
        `}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <i className="ri-shopping-cart-line text-2xl text-gray-900"></i>
              <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
            </div>

            <button
              onClick={closeCart}
              className="w-10 h-10 flex items-center justify-center text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all cursor-pointer"
              aria-label="Close cart"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {items.length === 0 ? (
              <EmptyCart />
            ) : (
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={item.id+ "-" + item.size + "-" + item.color}
                    className={`
                      transition-all duration-300 ease-out
                      ${isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
                    `}
                    style={{
                      transitionDelay: `${index * 50}ms`
                    }}
                  >
                    <CartItem item={item} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Summary */}
          {items.length > 0 && (
            <div
              className={`
                transition-all duration-300 ease-out
                ${isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
              `}
              style={{
                transitionDelay: `${items.length * 50}ms`
              }}
            >
              <CartSummary />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
