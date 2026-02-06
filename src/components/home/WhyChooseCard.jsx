"use client";

/**
 * Why Choose Card Component
 * Individual card for "Why Choose Abra?" section
 *
 * @param {Object} props
 * @param {string} props.icon - Remix Icon class name
 * @param {string} props.title - Card title
 * @param {string} props.description - Card description
 */
export default function WhyChooseCard({ icon, title, description }) {
  return (
    <div className="bg-[var(--color-sky-light)] rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
      {/* Icon Container */}
      <div className="w-16 h-16 flex items-center justify-center bg-white rounded-full mx-auto mb-4">
        <i className={`${icon} text-3xl text-gray-900`}></i>
      </div>

      {/* Content */}
      <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
