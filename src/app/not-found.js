"use client";

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { BaseButton } from '@/components/ui';
import { ROUTES } from '@/config/routes';

/**
 * 404 Not Found Page
 * Displayed when a page is not found
 */
export default function NotFound() {
  const t = useTranslations();
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[var(--color-sky-light)] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Error Code */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-900 mb-4">
            {t('notFound.code')}
          </h1>
          <div className="w-24 h-1 bg-gray-900 mx-auto"></div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('notFound.title')}
          </h2>
          <p className="text-lg text-gray-700 mb-2">
            {t('notFound.message')}
          </p>
          <p className="text-base text-gray-600">
            {t('notFound.description')}
          </p>
        </div>
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <BaseButton
            onClick={() => router.back()}
            variant="outline"
            size="lg"
          >
            <i className="ri-arrow-right-line ml-2"></i>
            {t('notFound.goBack')}
          </BaseButton>
          <BaseButton
            href={ROUTES.HOME}
            variant="primary"
            size="lg"
          >
            {t('notFound.goHome')}
            <i className="ri-home-line mr-2"></i>
          </BaseButton>
        </div>
      </div>
    </main>
  );
}

