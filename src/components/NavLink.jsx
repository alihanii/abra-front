'use client';

import Link from 'next/link';
import { useNavigation } from '@/hooks/useNavigation';

/**
 * Navigation Link Component
 * Reusable navigation link with active state detection
 * 
 * @param {Object} props
 * @param {string} props.href - Route path
 * @param {string} props.label - Link label
 * @param {string} props.icon - Optional icon class name
 * @param {Function} props.onClick - Optional click handler
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.showActiveIndicator - Show active indicator line
 */
export default function NavLink({
  href,
  label,
  icon,
  onClick,
  className = '',
  showActiveIndicator = true,
  ...props
}) {
  const { checkActiveRoute, getRouteClassName } = useNavigation();
  const isActive = checkActiveRoute(href);

  const baseClasses = 'transition-all duration-200 cursor-pointer';
  const activeClasses = isActive 
    ? 'text-gray-900 font-semibold' 
    : 'text-gray-700 hover:text-gray-900';

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Link
      href={href}
      className={`${baseClasses} ${activeClasses} ${className}`}
      onClick={handleClick}
      {...props}
    >
      <div className="flex items-center gap-2">
        {icon && <i className={icon}></i>}
        <span className="relative">
          {label}
          {isActive && showActiveIndicator && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full" />
          )}
        </span>
      </div>
    </Link>
  );
}

