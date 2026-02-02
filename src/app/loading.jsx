'use client';

import LoadingScreen from '@/components/ui/LoadingScreen';

/**
 * Loading Component for Next.js App Router
 * Automatically displayed during route transitions and data fetching
 * This component uses Suspense boundaries to show loading state
 */
export default function Loading() {
  return (
    <LoadingScreen
      isLoading
      logoText="Abra"
      typingSpeed={100}
      loop
      size="lg"
      className="fixed inset-0 z-[100]"
    />
  );
}

