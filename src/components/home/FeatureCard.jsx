'use client';

/**
 * Feature Card Component
 * Individual feature card with icon, title, and description
 * 
 * @param {Object} props
 * @param {string} props.icon - Remix Icon class name
 * @param {string} props.title - Feature title
 * @param {string} props.description - Feature description
 */
export default function FeatureCard({ icon, title, description }) {
  return (
    <div className="flex items-center gap-4">
      {/* Icon Container */}
      <div className="w-14 h-14 flex items-center justify-center bg-[var(--color-sky-light)] rounded-full shrink-0">
        <i className={`${icon} text-2xl text-gray-900`}></i>
      </div>
      
      {/* Content */}
      <div>
        <h3 className="font-semibold text-gray-900 text-lg mb-1">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
}

