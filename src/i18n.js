import { getRequestConfig } from 'next-intl/server';
import { routing } from './i18n/routing';

export default getRequestConfig(async ({ locale }) => {
  // Use the locale from the request, or fallback to default
  // When localePrefix is 'as-needed' or 'never', locale might be undefined
  const resolvedLocale = locale || routing.defaultLocale;

  return {
    locale: resolvedLocale,
    messages: (await import(`./locales/${resolvedLocale}.json`)).default
  };
});

