"use client";

import { useParams, notFound } from "next/navigation";
import { useProduct } from "@/hooks/useProduct";
import { useProductBySlug } from "@/hooks/useApi";
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
import { BaseSkeleton } from "@/components/ui";

/**
 * Product Detail Page
 * Dynamic product detail page with full product information
 */
export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug;
  const { addItem, openCart } = useCart();

  // Fetch product data from API using TanStack Query
  const { data: productData, isLoading, error } = useProductBySlug(slug);

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
  } = useProduct(productData);

  // Show loading state with skeletons
  if (isLoading) {
    return (
      <main
        className="min-h-screen bg-[var(--color-sky-light)]"
        dir="ltr"
      >
        <div className="max-w-7xl mx-auto px-6 py-2 pb-32 lg:pb-8">
          {/* Breadcrumbs Skeleton */}
          <div className="flex items-center gap-2 mb-6">
            <BaseSkeleton
              isLoading={true}
              className="h-4 w-12"
            />
            <i className="ri-arrow-right-s-line text-gray-400"></i>
            <BaseSkeleton
              isLoading={true}
              className="h-4 w-16"
            />
            <i className="ri-arrow-right-s-line text-gray-400"></i>
            <BaseSkeleton
              isLoading={true}
              className="h-4 w-24"
            />
          </div>

          {/* Product Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery Skeleton */}
            <div>
              <div className="flex flex-row gap-3">
                {/* Thumbnails */}
                <div className="flex flex-col gap-2 order-2 lg:order-1 max-h-[240px] lg:max-h-[400px]">
                  {[1, 2, 3, 4].map((i) => (
                    <BaseSkeleton
                      key={i}
                      isLoading={true}
                      variant="default"
                      className="w-16 h-16 lg:w-20 lg:h-20 shrink-0"
                    />
                  ))}
                </div>
                {/* Main Image */}
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg flex-1 order-1 lg:order-2">
                  <BaseSkeleton
                    isLoading={true}
                    variant="rectangular"
                    className="aspect-square w-full"
                  />
                </div>
              </div>
            </div>

            {/* Product Info Skeleton */}
            <div dir="rtl">
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm">
                {/* Title */}
                <BaseSkeleton
                  isLoading={true}
                  variant="text"
                  className="h-10 lg:h-12 mb-3 w-3/4"
                />

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-4">
                  <BaseSkeleton
                    isLoading={true}
                    variant="text"
                    className="h-9 w-32"
                  />
                  <BaseSkeleton
                    isLoading={true}
                    variant="text"
                    className="h-7 w-24"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2 mb-6">
                  <BaseSkeleton
                    isLoading={true}
                    variant="text"
                    className="h-4 w-full"
                  />
                  {/* <BaseSkeleton isLoading={true} variant="text" className="h-4 w-full" /> */}
                  <BaseSkeleton
                    isLoading={true}
                    variant="text"
                    className="h-4 w-3/4"
                  />
                </div>

                {/* Color Selection */}
                <div className="mb-6">
                  <BaseSkeleton
                    isLoading={true}
                    variant="text"
                    className="h-5 w-24 mb-3"
                  />
                  <div className="flex gap-3">
                    {[1, 2, 3, 4].map((i) => (
                      <BaseSkeleton
                        key={i}
                        isLoading={true}
                        variant="default"
                        className="w-12 h-12"
                      />
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div className="mb-6">
                  <BaseSkeleton
                    isLoading={true}
                    variant="text"
                    className="h-5 w-16 mb-3"
                  />
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <BaseSkeleton
                        key={i}
                        isLoading={true}
                        variant="default"
                        className="h-10 w-16"
                      />
                    ))}
                  </div>
                </div>

                {/* Add to Cart Button */}
                <BaseSkeleton
                  isLoading={true}
                  variant="default"
                  className="h-14 w-full rounded-full mb-8"
                />

                {/* Features List */}
                <div className="pt-8 border-t border-gray-200">
                  <BaseSkeleton
                    isLoading={true}
                    variant="text"
                    className="h-6 w-40 mb-4"
                  />
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3"
                      >
                        <BaseSkeleton
                          isLoading={true}
                          variant="circular"
                          className="w-5 h-5 shrink-0 mt-0.5"
                        />
                        <BaseSkeleton
                          isLoading={true}
                          variant="text"
                          className="h-4 flex-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Info Skeleton */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <BaseSkeleton
                  isLoading={true}
                  variant="circular"
                  className="w-12 h-12 mb-4"
                />
                <BaseSkeleton
                  isLoading={true}
                  variant="text"
                  className="h-6 w-32 mb-2"
                />
                <BaseSkeleton
                  isLoading={true}
                  variant="text"
                  className="h-4 w-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Bottom Bar Skeleton */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <BaseSkeleton
                  isLoading={true}
                  variant="text"
                  className="h-3 w-20 mb-2"
                />
                <BaseSkeleton
                  isLoading={true}
                  variant="text"
                  className="h-8 w-24"
                />
              </div>
              <div className="text-right">
                <BaseSkeleton
                  isLoading={true}
                  variant="text"
                  className="h-3 w-16 mb-2 ml-auto"
                />
                <BaseSkeleton
                  isLoading={true}
                  variant="text"
                  className="h-4 w-12 ml-auto"
                />
              </div>
            </div>
            <BaseSkeleton
              isLoading={true}
              variant="default"
              className="h-14 w-full rounded-full"
            />
            <div className="h-2" />
          </div>
        </div>
      </main>
    );
  }

  // Show error state
  if (error) {
    console.error("Error fetching product:", error);
    notFound();
  }

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
      id: `${product.id}`,
      slug: product.slug,
      name: product.name,
      price: finalPrice,
      image: product.images?.[0]?.url || "",
      size: selectedSizeData?.id ?? selectedSize,
      color: selectedColorData?.id ?? selectedColor,
      quantity: quantity
    });

    // Open cart drawer
    openCart();
  };

  return (
    <main
      className="min-h-screen bg-[var(--color-sky-light)] "
      dir="ltr"
    >
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
          <div dir="rtl">
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
