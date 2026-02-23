/**
 * Home page layout with metadata
 */
export const metadata = {
  title: "ابرا | لباس و پوشاک با چاپ حرفه‌ای",
  description:
    "خرید لباس با کیفیت از ابرا. هودی، تی‌شرت، ست مچینگ و محصولات دیگر با چاپ حرفه‌ای و ارسال سریع.",
  openGraph: {
    title: "ابرا | لباس و پوشاک با چاپ حرفه‌ای",
    description:
      "خرید لباس با کیفیت از ابرا. هودی، تی‌شرت، ست مچینگ و محصولات دیگر با چاپ حرفه‌ای.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "ابرا | لباس و پوشاک با چاپ حرفه‌ای",
    description: "خرید لباس با کیفیت از ابرا. چاپ حرفه‌ای و ارسال سریع."
  }
};

export default function HomeLayout({ children }) {
  return children;
}
