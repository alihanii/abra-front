'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Profile Tabs Component
 * Tab navigation for profile sections
 * 
 * @param {Object} props
 * @param {string} props.activeTab - Currently active tab
 * @param {Function} props.onTabChange - Callback when tab changes
 */
export default function ProfileTabs({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'history', label: 'تاریخچه خرید', icon: 'ri-history-line' },
    { id: 'settings', label: 'مشخصات حساب', icon: 'ri-user-settings-line' },
  ];

  return (
    <div className="flex gap-2 border-b border-gray-200 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            'flex-1 px-4 py-3 font-semibold transition-all duration-200 cursor-pointer relative',
            'flex items-center justify-center gap-2',
            activeTab === tab.id
              ? 'text-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          )}
          aria-selected={activeTab === tab.id}
          role="tab"
        >
          <i className={cn('text-xl', tab.icon)}></i>
          <span className="hidden sm:inline">{tab.label}</span>
          {activeTab === tab.id && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
}

