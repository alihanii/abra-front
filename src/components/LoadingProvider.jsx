"use client";

import { useState, useEffect } from "react";
import { LoadingScreen } from "@/components/ui";
import { cn } from "@/lib/utils";

/**
 * Loading Provider Component
 * Shows loading screen on initial page load
 */
export default function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Wait for fade out animation to complete (500ms) before showing content
      setTimeout(() => {
        setShowContent(true);
      }, 500);
    }, 2000); // 2 seconds total (typing + minimum display)

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <LoadingScreen
        isLoading={isLoading}
        logoText="Abra"
        typingSpeed={150}
        minDisplayTime={1500}
        onComplete={() => setIsLoading(false)}
      />
      {/* Always render children but hide them during loading */}
      <div
        className={cn(
          "transition-opacity duration-500",
          showContent ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        {children}
      </div>
    </>
  );
}
