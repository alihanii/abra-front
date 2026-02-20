/**
 * Categories layout with metadata
 */
export const metadata = {
  title: "دسته‌بندی‌ها | ابرا",
  description:
    "دسته‌بندی‌های محصولات ابرا. هودی، تی‌شرت، ست مچینگ و سایر پوشاک با چاپ حرفه‌ای.",
  openGraph: {
    title: "دسته‌بندی‌های ابرا | محصولات پوشاک",
    description:
      "دسته‌بندی‌های محصولات ابرا. هودی، تی‌شرت، ست مچینگ و سایر پوشاک.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "دسته‌بندی‌های ابرا",
    description: "دسته‌بندی‌های محصولات پوشاک ابرا."
  }
};

export default function CategoriesLayout({ children }) {
  return children;
}
