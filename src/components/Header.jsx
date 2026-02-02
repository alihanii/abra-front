'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { NAVIGATION_ITEMS, ROUTES } from '@/config/routes';
import { useNavigation } from '@/hooks/useNavigation';
import { useCart } from '@/contexts/CartContext';
import { useProfile } from '@/contexts/ProfileContext';

/**
 * Header Component
 * Professional header with active route detection, mobile menu, and cart integration
 * 
 * @param {Object} props
 * @param {Function} props.onUserClick - Callback when user button is clicked
 */
export default function Header({ 
  onUserClick 
}) {
  const { totalItems, openCart } = useCart();
  const { openProfile } = useProfile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { getRouteClassName, checkActiveRoute } = useNavigation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [checkActiveRoute]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleCartClick = () => {
    openCart();
  };

  const handleUserClick = () => {
    if (onUserClick) {
      onUserClick();
    } else {
      // Open profile drawer
      openProfile();
    }
  };

  return (
    <header 
      className={`bg-white sticky top-0 z-50 transition-shadow duration-200 ${
        isScrolled ? 'shadow-md' : 'shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            href={ROUTES.HOME} 
            className="flex items-center cursor-pointer group"
            aria-label="Abra Home"
          >
            <h1 
              className="text-2xl sm:text-3xl font-bold text-gray-900 transition-transform group-hover:scale-105" 
              style={{ fontFamily: 'var(--font-pacifico), serif' }}
            >
              Abra
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {NAVIGATION_ITEMS.map((item) => {
              const isActive = checkActiveRoute(item.href);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`
                    relative px-3 py-2 font-medium transition-all duration-200 cursor-pointer whitespace-nowrap
                    ${isActive 
                      ? 'text-gray-900 font-semibold' 
                      : 'text-gray-700 hover:text-gray-900'
                    }
                  `}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Cart Button */}
            <button
              onClick={handleCartClick}
              className="w-10 h-10 flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors cursor-pointer relative group"
              aria-label={`Shopping cart${totalItems > 0 ? ` with ${totalItems} items` : ''}`}
            >
              <i className="ri-shopping-cart-line text-2xl transition-transform group-hover:scale-110"></i>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gray-900 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            {/* User Button */}
            <button
              onClick={handleUserClick}
              className="w-10 h-10 flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors cursor-pointer group"
              aria-label="User account"
            >
              <i className="ri-user-line text-2xl transition-transform group-hover:scale-110"></i>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden w-10 h-10 flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              <i 
                className={`text-2xl transition-transform duration-300 ${
                  isMobileMenuOpen ? 'ri-close-line rotate-90' : 'ri-menu-line'
                }`}
              ></i>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav 
          className={`
            md:hidden overflow-hidden transition-all duration-300 ease-in-out
            ${isMobileMenuOpen 
              ? 'max-h-96 opacity-100 mt-4 pb-4 border-t border-gray-200 pt-4' 
              : 'max-h-0 opacity-0'
            }
          `}
        >
          <div className="flex flex-col gap-2">
            {NAVIGATION_ITEMS.map((item, index) => {
              const isActive = checkActiveRoute(item.href);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`
                    px-4 py-3 rounded-lg font-medium transition-all duration-200 cursor-pointer
                    ${isActive 
                      ? 'text-gray-900 font-semibold bg-gray-50' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    {item.icon && <i className={`${item.icon} text-xl`}></i>}
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
}

