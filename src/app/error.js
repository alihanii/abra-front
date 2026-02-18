"use client";

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { BaseButton } from '@/components/ui';
import { ROUTES } from '@/config/routes';

/**
 * Error Page (500)
 * Displayed when an error occurs in the application
 * 
 * @param {Object} props
 * @param {Error} props.error - The error object
 * @param {Function} props.reset - Function to reset the error boundary
 */
export default function Error({ error, reset }) {
  const t = useTranslations();

  useEffect(() => {
    // Log error to console or error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[var(--color-sky-light)] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Error Code */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-900 mb-4">
            {t('error.code')}
          </h1>
          <div className="w-24 h-1 bg-gray-900 mx-auto"></div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('error.title')}
          </h2>
          <p className="text-lg text-gray-700 mb-2">
            {t('error.message')}
          </p>
          <p className="text-base text-gray-600">
            {t('error.description')}
          </p>
        </div>

        {/* Illustration Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-32 h-32 rounded-full bg-red-100 flex items-center justify-center">
            <i className="ri-error-warning-fill text-6xl text-red-500"></i>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <BaseButton
            onClick={reset}
            variant="primary"
            size="lg"
          >
            <i className="ri-refresh-line ml-2"></i>
            {t('error.tryAgain')}
          </BaseButton>
          <BaseButton
            href={ROUTES.HOME}
            variant="outline"
            size="lg"
          >
            {t('error.goHome')}
            <i className="ri-home-line mr-2"></i>
          </BaseButton>
        </div>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === 'development' && error && (
          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-right">
            <p className="text-sm font-semibold text-red-900 mb-2">Error Details (Development):</p>
            <pre className="text-xs text-red-700 overflow-auto">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}

