"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import AbraLogo from "@/components/ui/AbraLogo";

/**
 * Loading Screen Component
 * Displays a loading screen with typewriter animation for shop name
 *
 * @param {Object} props
 * @param {boolean} props.isLoading - Whether loading is active
 * @param {string} props.logoText - Text to type (default: "Abra")
 * @param {number} props.typingSpeed - Speed of typing in milliseconds (default: 150)
 * @param {number} props.minDisplayTime - Minimum time to display loading in milliseconds (default: 1500)
 * @param {Function} props.onComplete - Callback when typing is complete
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.size - Size: 'sm' | 'md' | 'lg' | 'xl' (default: 'lg')
 * @param {boolean} props.loop - Whether to loop the typing animation (default: false)
 */
export default function LoadingScreen({
  isLoading = true,
  logoText = "Abra",
  typingSpeed = 150,
  minDisplayTime = 1500,
  onComplete,
  className,
  size = "lg",
  loop = false
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [startTime] = useState(Date.now());

  // Use refs to store intervals/timeouts so they persist across re-renders
  const typeIntervalRef = useRef(null);
  const pauseTimeoutRef = useRef(null);

  // Typewriter effect with loop support
  useEffect(() => {
    if (!isLoading) {
      setDisplayedText("");
      setIsTypingComplete(false);
      // Clear any running intervals/timeouts
      if (typeIntervalRef.current) {
        clearInterval(typeIntervalRef.current);
        typeIntervalRef.current = null;
      }
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
        pauseTimeoutRef.current = null;
      }
      return;
    }

    let currentIndex = 0;
    const text = logoText;

    const startTyping = () => {
      // Clear any existing intervals/timeouts before starting
      if (typeIntervalRef.current) {
        clearInterval(typeIntervalRef.current);
        typeIntervalRef.current = null;
      }
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
        pauseTimeoutRef.current = null;
      }

      setIsTypingComplete(false);
      currentIndex = 0;
      setDisplayedText("");

      typeIntervalRef.current = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          if (typeIntervalRef.current) {
            clearInterval(typeIntervalRef.current);
            typeIntervalRef.current = null;
          }
          setIsTypingComplete(true);

          if (loop) {
            // Wait a bit before restarting (pause duration)
            pauseTimeoutRef.current = setTimeout(() => {
              startTyping();
            }, 1000); // 1 second pause before restart
          } else {
            // Call onComplete after minimum display time
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

            pauseTimeoutRef.current = setTimeout(() => {
              if (onComplete) {
                onComplete();
              }
              pauseTimeoutRef.current = null;
            }, remainingTime);
          }
        }
      }, typingSpeed);
    };

    startTyping();

    return () => {
      if (typeIntervalRef.current) {
        clearInterval(typeIntervalRef.current);
        typeIntervalRef.current = null;
      }
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
        pauseTimeoutRef.current = null;
      }
    };
  }, [isLoading, logoText, typingSpeed, minDisplayTime, onComplete, startTime, loop]);

  // Cursor blinking animation
  useEffect(() => {
    if (!isLoading) {
      setShowCursor(false);
      return;
    }

    // Show cursor only when typing (not when complete in loop mode)
    if (isTypingComplete && !loop) {
      setShowCursor(false);
      return;
    }

    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530); // Blink speed

    return () => clearInterval(cursorInterval);
  }, [isLoading, isTypingComplete, loop]);

  if (!isLoading && !displayedText) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] bg-white flex items-center justify-center",
        "transition-opacity duration-500 ease-in-out",
        isLoading ? "opacity-100" : "opacity-0 pointer-events-none",
        className
      )}
    >
      <div className="flex flex-col items-center justify-center">
        {/* Logo Text with Typewriter Effect */}
        <div className="flex items-center gap-2 mb-4">
          <AbraLogo
            className={cn(
              "font-bold text-gray-900",
              size === "sm" && "text-md sm:text-md",
              size === "sm" && "text-xl sm:text-xl",
              size === "md" && "text-2xl sm:text-3xl md:text-4xl",
              size === "lg" && "text-3xl sm:text-4xl md:text-5xl",
              size === "xl" && "text-5xl sm:text-6xl md:text-7xl",
              !size && "text-6xl sm:text-7xl md:text-8xl" // default lg
            )}
          >
            {displayedText}
            {showCursor && (
              <span
                className={cn(
                  "inline-block w-0.5 bg-gray-900 ml-1 animate-pulse",
                  size === "sm" && "h-3 sm:h-4",
                  size === "md" && "h-5 sm:h-6md:h-8",
                  size === "lg" && "h-12 sm:h-14 md:h-16",
                  size === "xl" && "h-14 sm:h-16 md:h-20",
                  !size && "h-12 sm:h-14 md:h-16" // default lg
                )}
              />
            )}
          </AbraLogo>
        </div>

        {/* Loading Indicator (shows after typing is complete, only if not looping) */}
        {
          <div className="flex items-center gap-2 mt-2">
            <div
              className="w-1.5 h-1.5 bg-gray-900 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="w-1.5 h-1.5 bg-gray-900 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="w-1.5 h-1.5 bg-gray-900 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        }
      </div>
    </div>
  );
}
