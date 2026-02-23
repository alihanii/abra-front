/**
 * Product detail layout with dynamic metadata
 * Fetches product data server-side for SEO meta tags
 */
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL;

async function fetchProductBySlug(slug) {
  try {
    const res = await fetch(`${BASE_URL}/products/${slug}/`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const slug = params?.slug;
  if (!slug) {
    return {
      title: "محصول | ابرا",
      description: "محصولات پوشاک با کیفیت از ابرا."
    };
  }

  const product = await fetchProductBySlug(slug);
  if (!product) {
    return {
      title: "محصول | ابرا",
      description: "محصولات پوشاک با کیفیت از ابرا."
    };
  }

  const title = product.name ? `${product.name} | ابرا` : "محصول | ابرا";
  const description =
    product.description ||
    product.name ||
    "خرید پوشاک با کیفیت از ابرا. چاپ حرفه‌ای و ارسال سریع.";
  const img =
    product.images?.[0]?.url ||
    (typeof product.images?.[0] === "string" ? product.images[0] : null) ||
    product.image?.url ||
    (typeof product.image === "string" ? product.image : null);
  const imageUrl = img
    ? img.startsWith("http")
      ? img
      : `${BASE_URL.replace("/api", "")}${img.startsWith("/") ? "" : "/"}${img}`
    : null;

  const meta = {
    title,
    description: description.slice(0, 160),
    openGraph: {
      title,
      description,
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    }
  };
  if (imageUrl) {
    meta.openGraph.images = [{ url: imageUrl, alt: product.name }];
    meta.twitter.images = [imageUrl];
  }
  return meta;
}

export default function ProductDetailLayout({ children }) {
  return children;
}
