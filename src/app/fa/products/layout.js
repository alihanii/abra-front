/**
 * Products list layout with metadata
 */
export const metadata = {
  title: "محصولات | ابرا",
  description:
    "خرید لباس و پوشاک با کیفیت از ابرا. هودی، تی‌شرت، ست مچینگ و محصولات دیگر با چاپ حرفه‌ای.",
  openGraph: {
    title: "محصولات ابرا | لباس و پوشاک با کیفیت",
    description:
      "خرید لباس و پوشاک با کیفیت از ابرا. هودی، تی‌شرت، ست مچینگ و محصولات دیگر.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "محصولات ابرا",
    description: "خرید لباس و پوشاک با کیفیت از ابرا."
  }
};

export default function ProductsLayout({ children }) {
  return children;
}
