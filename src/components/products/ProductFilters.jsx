'use client';

import { useState } from 'react';
import FilterDropdown from './FilterDropdown';
import { cn } from '@/lib/utils';

/**
 * ProductFilters Component (Molecule)
 * Filter section for products page with multiple filter dropdowns
 * 
 * @param {Object} props
 * @param {Object} props.filters - Current filter values
 * @param {Function} props.onFiltersChange - Callback when filters change
 * @param {string} props.className - Additional CSS classes
 */
export default function ProductFilters({ filters = {}, onFiltersChange, className }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (filterKey, value) => {
    const newFilters = {
      ...filters,
      [filterKey]: value,
    };
    onFiltersChange?.(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {};
    onFiltersChange?.(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some((value) => {
    if (Array.isArray(value)) return value.length > 0;
    return value !== null && value !== undefined && value !== '';
  });

  const toggleFilters = () => {
    setIsOpen((prev) => !prev);
  };

  // Mock filter options
  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'hoodies', label: 'Hoodies' },
    { value: 'tshirts', label: 'T-Shirts' },
    { value: 'sweatshirts', label: 'Sweatshirts' },
    { value: 'jackets', label: 'Jackets' },
  ];

  const priceOptions = [
    { value: 'all', label: 'All Prices' },
    { value: '0-20', label: '$0 - $20' },
    { value: '20-30', label: '$20 - $30' },
    { value: '30-40', label: '$30 - $40' },
    { value: '40+', label: '$40+' },
  ];

  const sizeOptions = [
    { value: 'all', label: 'All Sizes' },
    { value: 'xs', label: 'XS' },
    { value: 's', label: 'S' },
    { value: 'm', label: 'M' },
    { value: 'l', label: 'L' },
    { value: 'xl', label: 'XL' },
    { value: 'xxl', label: 'XXL' },
  ];

  const colorOptions = [
    { value: 'all', label: 'All Colors' },
    { value: 'black', label: 'Black' },
    { value: 'white', label: 'White' },
    { value: 'gray', label: 'Gray' },
    { value: 'navy', label: 'Navy Blue' },
    { value: 'olive', label: 'Olive Green' },
    { value: 'burgundy', label: 'Burgundy' },
  ];

  const sortOptions = [
    { value: 'default', label: 'Default' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
    { value: 'newest', label: 'Newest First' },
  ];

  return (
    <div
      className={cn(
        'bg-white border-b-2 border-gray-200 sticky top-[72px] z-40',
        'overflow-visible',
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-6 overflow-visible">
        {/* Filter Toggle Button */}
        <div className="flex items-center justify-between py-2 border-b border-gray-200 md:border-0 md:py-0 overflow-visible">
          <button
            type="button"
            onClick={toggleFilters}
            className={cn(
              'flex items-center gap-1 px-2 py-1',
              'text-gray-900 font-semibold text-xs',
              'border-2 border-gray-200 rounded-lg',
              'hover:bg-gray-50 hover:border-gray-900',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2',
              'md:hidden'
            )}
            aria-expanded={isOpen}
            aria-label="Toggle filters"
          >
            <i className="ri-filter-3-line text-base" />
            <span>Filters</span>
            <i
              className={cn(
                'ri-arrow-down-s-line text-base transition-transform duration-200',
                isOpen && 'transform rotate-180'
              )}
            />
          </button>

          {/* Desktop: Always visible filters */}
          <div className="hidden md:flex items-center gap-4 flex-1 py-4 overflow-visible">
            <div className="flex flex-wrap items-center gap-3 flex-1 overflow-visible relative">
              <FilterDropdown
                label="Category"
                options={categoryOptions}
                value={filters.category || 'all'}
                onChange={(value) => handleFilterChange('category', value)}
                className="min-w-[120px]"
              />

              <FilterDropdown
                label="Price"
                options={priceOptions}
                value={filters.price || 'all'}
                onChange={(value) => handleFilterChange('price', value)}
                className="min-w-[120px]"
              />

              <FilterDropdown
                label="Size"
                options={sizeOptions}
                value={filters.size || 'all'}
                onChange={(value) => handleFilterChange('size', value)}
                className="min-w-[100px]"
              />

              <FilterDropdown
                label="Color"
                options={colorOptions}
                value={filters.color || 'all'}
                onChange={(value) => handleFilterChange('color', value)}
                className="min-w-[120px]"
              />

              <FilterDropdown
                label="Sort By"
                options={sortOptions}
                value={filters.sort || 'default'}
                onChange={(value) => handleFilterChange('sort', value)}
                className="min-w-[140px]"
              />
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium text-gray-700',
                  'border-2 border-gray-300 rounded-lg',
                  'hover:bg-gray-50 hover:border-gray-900',
                  'transition-colors duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2',
                  'whitespace-nowrap'
                )}
              >
                <i className="ri-close-line mr-1 text-xs" />
                Clear Filters
              </button>
            )}
          </div>

          {/* Mobile: Clear Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className={cn(
                'px-3 py-1.5 text-xs font-medium text-gray-700',
                'border-2 border-gray-300 rounded-lg',
                'hover:bg-gray-50 hover:border-gray-900',
                'transition-colors duration-200',
                'focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2',
                'whitespace-nowrap',
                'md:hidden'
              )}
            >
              <i className="ri-close-line mr-1 text-xs" />
              Clear
            </button>
          )}
        </div>

        {/* Mobile: Collapsible Filter Panel */}
        <div
          className={cn(
            'md:hidden overflow-visible transition-all duration-300 ease-in-out',
            isOpen ? 'max-h-[800px] opacity-100 pb-4' : 'max-h-0 opacity-0 overflow-hidden'
          )}
        >
          <div className="flex flex-col gap-3 pt-4 mx-1 overflow-visible relative">
            <FilterDropdown
              label="Category"
              options={categoryOptions}
              value={filters.category || 'all'}
              onChange={(value) => handleFilterChange('category', value)}
            />

            <FilterDropdown
              label="Price"
              options={priceOptions}
              value={filters.price || 'all'}
              onChange={(value) => handleFilterChange('price', value)}
            />

            <FilterDropdown
              label="Size"
              options={sizeOptions}
              value={filters.size || 'all'}
              onChange={(value) => handleFilterChange('size', value)}
            />

            <FilterDropdown
              label="Color"
              options={colorOptions}
              value={filters.color || 'all'}
              onChange={(value) => handleFilterChange('color', value)}
            />

            <FilterDropdown
              label="Sort By"
              options={sortOptions}
              value={filters.sort || 'default'}
              onChange={(value) => handleFilterChange('sort', value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

