'use client';

import { useState, useRef, useEffect } from 'react';
import BaseButton from '@/components/ui/BaseButton';
import { cn } from '@/lib/utils';

/**
 * FilterDropdown Component (Atomic)
 * Reusable dropdown component for filters
 * 
 * @param {Object} props
 * @param {string} props.label - Filter label
 * @param {Array} props.options - Array of filter options {value, label}
 * @param {string|Array} props.value - Selected value(s)
 * @param {Function} props.onChange - Callback when selection changes
 * @param {boolean} props.multiple - Allow multiple selections
 * @param {string} props.className - Additional CSS classes
 */
export default function FilterDropdown({
  label,
  options = [],
  value,
  onChange,
  multiple = false,
  className,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  // Calculate if should open upward
  useEffect(() => {
    if (isOpen && buttonRef.current && menuRef.current) {
      const checkPosition = () => {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - buttonRect.bottom;
        const estimatedMenuHeight = Math.min(256, options.length * 40 + 16); // max-h-64 = 256px
        
        // Open upward if not enough space below but enough space above
        const shouldOpenUp = spaceBelow < estimatedMenuHeight && buttonRect.top > estimatedMenuHeight;
        setOpenUp(shouldOpenUp);
      };

      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(checkPosition);
      
      // Update position on scroll and resize
      window.addEventListener('scroll', checkPosition, true);
      window.addEventListener('resize', checkPosition);
      
      return () => {
        window.removeEventListener('scroll', checkPosition, true);
        window.removeEventListener('resize', checkPosition);
      };
    }
  }, [isOpen, options.length]);

  // Close dropdown when clicking outside or scrolling
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, true);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (optionValue) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter((v) => v !== optionValue)
        : [...currentValues, optionValue];
      onChange?.(newValues);
    } else {
      onChange?.(optionValue);
      setIsOpen(false);
    }
  };

  const isSelected = (optionValue) => {
    if (multiple) {
      return Array.isArray(value) && value.includes(optionValue);
    }
    return value === optionValue;
  };

  const displayValue = () => {
    if (multiple) {
      const selectedCount = Array.isArray(value) ? value.length : 0;
      if (selectedCount === 0) return label;
      if (selectedCount === 1) {
        const selectedOption = options.find((opt) => opt.value === value[0]);
        return selectedOption?.label || label;
      }
      return `${selectedCount} selected`;
    }
    const selectedOption = options.find((opt) => opt.value === value);
    return selectedOption?.label || label;
  };

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      {/* Dropdown Button */}
      <BaseButton
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        variant="outline"
        size="sm"
        fullWidth
        className={cn(
          '!rounded-lg !font-medium',
          'flex items-center justify-between gap-2',
          '!text-xs',
          '!border-2 !border-gray-200',
          'hover:!border-gray-900',
          isOpen && '!border-gray-900'
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="truncate">{displayValue()}</span>
        <i
          className={cn(
            'ri-arrow-down-s-line text-base transition-transform duration-200 shrink-0',
            isOpen && openUp && 'transform rotate-180'
          )}
        />
      </BaseButton>

      {/* Dropdown Menu - Absolute Position with Auto Positioning */}
      {isOpen && (
        <div
          ref={menuRef}
          className={cn(
            'absolute left-0 right-0 z-[9999]',
            openUp ? 'bottom-full mb-2' : 'top-full mt-2',
            'bg-white border-2 border-gray-200 rounded-lg shadow-xl',
            'max-h-64 overflow-y-auto',
            'animate-fadeIn'
          )}
          role="listbox"
        >
          {options.length === 0 ? (
            <div className="px-3 py-2 text-gray-500 text-xs text-center">
              No options available
            </div>
          ) : (
            <ul className="py-2">
              {options.map((option) => {
                const selected = isSelected(option.value);
                return (
                  <li key={option.value} role="option" aria-selected={selected}>
                    <button
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      className={cn(
                        'w-full px-3 py-1.5 text-left text-xs cursor-pointer',
                        'flex items-center gap-2',
                        'hover:bg-gray-50 transition-colors duration-150',
                        selected && 'bg-gray-100 font-semibold'
                      )}
                    >
                      {multiple && (
                        <i
                          className={cn(
                            'ri-checkbox-blank-line text-base shrink-0',
                            selected && 'ri-checkbox-line text-gray-900'
                          )}
                        />
                      )}
                      {!multiple && selected && (
                        <i className="ri-check-line text-base text-gray-900 shrink-0" />
                      )}
                      {!multiple && !selected && <span className="w-4 shrink-0" />}
                      <span className={cn('flex-1 text-gray-900', selected && 'text-gray-900')}>
                        {option.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

