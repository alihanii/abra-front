"use client";

import { useParams, notFound } from "next/navigation";
import { useProduct } from "@/hooks/useProduct";
import { useCart } from "@/contexts/CartContext";
import {
  Breadcrumbs,
  ProductImageGallery,
  ProductInfo,
  ProductMobileBar,
  ProductShippingInfo
} from "@/components/products/ProductDetail";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";

/**
 * Product Detail Page
 * Dynamic product detail page with full product information
 */
export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug;
  const { addItem, openCart } = useCart();

  const {
    product,
    selectedColor,
    selectedSize,
    selectedColorData,
    selectedSizeData,
    selectedImageIndex,
    quantity,
    availableStock,
    isInStock,
    finalPrice,
    originalPrice,
    discountAmount,
    selectColor,
    selectSize,
    selectImage,
    increaseQuantity,
    decreaseQuantity
  } = useProduct(slug);

  // Show 404 if product not found
  if (!product) {
    notFound();
  }

  // Prepare breadcrumbs
  const breadcrumbItems = [
    {
      label: "Home",
      href: ROUTES.HOME
    },
    {
      label: product.categoryLabel || "Products",
      href: product.category === "matching-sets" ? ROUTES.MATCHING_SETS : ROUTES.PRODUCTS
    },
    {
      label: product.name,
      href: null // Current page, no link
    }
  ];

  // Handle add to cart
  const handleAddToCart = () => {
    if (!product || !selectedColor || !selectedSize || !isInStock) {
      // Show error or validation message
      return;
    }

    addItem({
      id: `${product.id}-${selectedColor}-${selectedSize}`,
      slug: product.slug,
      name: product.name,
      price: finalPrice,
      image: product.images?.[0]?.url || "",
      size: selectedSizeData?.name || selectedSize,
      color: selectedColorData?.name || selectedColor,
      quantity: quantity
    });

    // Open cart drawer
    openCart();
  };

  return (
    <main className="min-h-screen bg-[var(--color-sky-light)]">
      <div className="max-w-7xl mx-auto px-6 py-2 pb-32 lg:pb-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* Product Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div>
            <ProductImageGallery
              images={product.images || []}
              selectedIndex={selectedImageIndex}
              onImageSelect={selectImage}
            />
          </div>

          {/* Product Info */}
          <div>
            <ProductInfo
              product={product}
              selectedColor={selectedColor}
              selectedSize={selectedSize}
              quantity={quantity}
              availableStock={availableStock}
              isInStock={isInStock}
              finalPrice={finalPrice}
              originalPrice={originalPrice}
              discountAmount={discountAmount}
              onColorSelect={selectColor}
              onSizeSelect={selectSize}
              onQuantityIncrease={increaseQuantity}
              onQuantityDecrease={decreaseQuantity}
              onAddToCart={handleAddToCart}
              isMobile={false}
            />
          </div>
        </div>

        {/* Shipping Info */}
        <ProductShippingInfo />
      </div>

      {/* Mobile Bottom Bar */}
      <ProductMobileBar
        product={product}
        selectedSize={selectedSize}
        selectedSizeData={selectedSizeData}
        quantity={quantity}
        finalPrice={finalPrice}
        isInStock={isInStock}
        onAddToCart={handleAddToCart}
      />
    </main>
  );
}
