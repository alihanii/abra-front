'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

/**
 * ScrollReveal Component
 * Wrapper component that adds scroll reveal animation to children
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child elements to animate
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.threshold - Intersection threshold (0-1)
 * @param {string} props.rootMargin - Root margin for intersection observer
 * @param {boolean} props.triggerOnce - Only trigger animation once
 * @param {string} props.animation - Animation type: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight'
 * @param {number} props.delay - Animation delay in milliseconds
 */
export default function ScrollReveal({
  children,
  className,
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = true,
  animation = 'fadeUp',
  delay = 0,
}) {
  const { ref, isVisible } = useScrollAnimation({
    threshold,
    rootMargin,
    triggerOnce,
  });

  const animationClasses = {
    fadeUp: 'opacity-0 translate-y-8 transition-all duration-700 ease-out',
    fadeIn: 'opacity-0 transition-all duration-700 ease-out',
    slideLeft: 'opacity-0 -translate-x-8 transition-all duration-700 ease-out',
    slideRight: 'opacity-0 translate-x-8 transition-all duration-700 ease-out',
  };

  const visibleClasses = {
    fadeUp: 'opacity-100 translate-y-0',
    fadeIn: 'opacity-100',
    slideLeft: 'opacity-100 translate-x-0',
    slideRight: 'opacity-100 translate-x-0',
  };

  return (
    <div
      ref={ref}
      className={cn(
        animationClasses[animation] || animationClasses.fadeUp,
        isVisible && (visibleClasses[animation] || visibleClasses.fadeUp),
        className
      )}
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}






