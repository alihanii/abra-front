'use client';

import BaseButton from '@/components/ui/BaseButton';
import { cn } from '@/lib/utils';

/**
 * CTA Card Variants
 */
const ctaVariants = {
  primary: 'bg-gradient-to-br from-gray-900 to-gray-800',
  secondary: 'bg-gradient-to-br from-blue-600 to-blue-800',
  success: 'bg-gradient-to-br from-green-600 to-green-800',
};

/**
 * CTA Card Component
 * Dynamic call-to-action card with customizable content and actions
 * 
 * @param {Object} props
 * @param {string} props.title - Main heading text
 * @param {string} props.description - Description text below title
 * @param {string} props.buttonText - Button label text
 * @param {string} props.buttonHref - Button link destination (optional if onButtonClick provided)
 * @param {Function} props.onButtonClick - Button click handler (optional if buttonHref provided)
 * @param {string} props.variant - Card variant: 'primary' | 'secondary' | 'success'
 * @param {string} props.className - Additional CSS classes
 */
export default function CTACard({
  title,
  description,
  buttonText,
  buttonHref,
  onButtonClick,
  variant = 'primary',
  className,
}) {
  const cardClasses = cn(
    'rounded-3xl p-8 md:p-12 text-center shadow-2xl',
    ctaVariants[variant] || ctaVariants.primary,
    className
  );

  return (
    <div className={cardClasses}>
      {/* Title */}
      <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
        {title}
      </h2>

      {/* Description */}
      {description && (
        <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8">
          {description}
        </p>
      )}

      {/* Button */}
      {buttonHref ? (
        <BaseButton
          href={buttonHref}
          variant="secondary"
          size="lg"
        >
          {buttonText}
        </BaseButton>
      ) : onButtonClick ? (
        <BaseButton
          onClick={onButtonClick}
          variant="secondary"
          size="lg"
        >
          {buttonText}
        </BaseButton>
      ) : null}
    </div>
  );
}

