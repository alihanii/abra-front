/**
 * AbraLogo Component
 * Reusable component for displaying "Abra" text with Maneli font
 *
 * @param {Object} props
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.as - HTML tag to use (default: "h1")
 * @param {string} props.children - Text content (default: "ابرا")
 * @param {Object} props.style - Additional inline styles
 */
export default function AbraLogo({
  className = "",
  as: Component = "h1",
  children = "ابرا",
  style = {},
  ...props
}) {
  return (
    <Component
      className={className}
      style={{
        fontFamily: "var(--font-maneli), Arial, Helvetica, sans-serif",
        ...style
      }}
      {...props}
    >
      {children}
    </Component>
  );
}

