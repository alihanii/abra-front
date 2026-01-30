'use client';

/**
 * Slider Dots Component
 * Navigation dots for hero slider
 * 
 * @param {Object} props
 * @param {number} props.totalSlides - Total number of slides
 * @param {number} props.activeIndex - Currently active slide index
 * @param {Function} props.onDotClick - Callback when dot is clicked
 */
export default function SliderDots({ totalSlides, activeIndex, onDotClick }) {
  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
      {Array.from({ length: totalSlides }).map((_, index) => (
        <button
          key={index}
          onClick={() => onDotClick(index)}
          className={`
            h-3 rounded-full transition-all cursor-pointer
            ${index === activeIndex 
              ? 'bg-gray-900 w-8' 
              : 'bg-gray-400 w-3'
            }
          `}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
}

