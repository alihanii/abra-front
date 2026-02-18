"use client";

import { useTranslations } from 'next-intl';
import CTACard from "./CTACard";
import { ROUTES } from "@/config/routes";

/**
 * CTA Section Component
 * Call-to-action section with customizable CTA card
 *
 * @param {Object} props
 * @param {string} props.title - Main heading text
 * @param {string} props.description - Description text below title
 * @param {string} props.buttonText - Button label text
 * @param {string} props.buttonHref - Button link destination
 * @param {Function} props.onButtonClick - Button click handler (optional)
 * @param {string} props.variant - Card variant: 'primary' | 'secondary' | 'success'
 * @param {string} props.className - Additional CSS classes
 */
export default function CTASection({
  title,
  description,
  buttonText,
  buttonHref = ROUTES.DESIGN_STUDIO,
  onButtonClick,
  variant = "primary",
  className
}) {
  const t = useTranslations();
  
  const defaultTitle = title || t('cta.readyToCreate');
  const defaultDescription = description || t('cta.readyToCreateDesc');
  const defaultButtonText = buttonText || t('cta.launchDesignStudio');
  return (
    <section className="py-20 bg-[var(--color-sky-light)]">
      <div className="max-w-4xl mx-auto px-6">
        <CTACard
          title={defaultTitle}
          description={defaultDescription}
          buttonText={defaultButtonText}
          buttonHref={buttonHref}
          onButtonClick={onButtonClick}
          variant={variant}
          className={className}
        />
      </div>
    </section>
  );
}
