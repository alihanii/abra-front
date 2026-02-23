/**
 * Design Studio layout with metadata
 */
export const metadata = {
  title: "استودیو طراحی | طراحی لباس سفارشی",
  description:
    "طرح و لباس سفارشی خود را طراحی کنید. هودی، تی‌شرت و محصولات دیگر با چاپ حرفه‌ای و کیفیت بالا.",
  openGraph: {
    title: "استودیو طراحی ابرا | طراحی لباس سفارشی",
    description:
      "طرح و لباس سفارشی خود را طراحی کنید. هودی، تی‌شرت و محصولات دیگر با چاپ حرفه‌ای.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "استودیو طراحی ابرا",
    description: "طرح و لباس سفارشی خود را طراحی کنید."
  }
};

export default function DesignStudioLayout({ children }) {
  return children;
}
