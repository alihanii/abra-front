"use client";

import { useState, useRef } from "react";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { useProductTemplates } from "@/hooks/useApi";
import { useProductTemplate } from "@/hooks/useProductTemplate";
import { useCustomProduct } from "@/hooks/useCustomProduct";
import {
  ProductTemplateImageEditor,
  ProductTemplateInfo
} from "@/components/products/ProductTemplate";
import ProductTemplateMobileBar from "@/components/products/ProductTemplate/ProductTemplateMobileBar";
import { Breadcrumbs } from "@/components/products/ProductDetail";
import { ProductShippingInfo } from "@/components/products/ProductDetail";
import { ROUTES } from "@/config/routes";
import { BaseSkeleton } from "@/components/ui";
import { cn } from "@/lib/utils";

/**
 * Product Templates Page
 * Page for selecting and customizing product templates
 */
export default function ProductTemplatesPage() {
  const t = useTranslations();
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);
  const frontImageContainerRef = useRef(null);
  const behindImageContainerRef = useRef(null);

  // Custom product hook
  const { createAndAddToCart } = useCustomProduct();

  // Fetch product templates from API using TanStack Query
  const { data: templatesData, isLoading, error } = useProductTemplates();

  // Get selected template (may be undefined during loading)
  const selectedTemplate = templatesData?.results?.[selectedTemplateIndex] || null;

  // Use product template hook for state management
  // Must be called before any conditional returns to follow Rules of Hooks
  const {
    template,
    selectedColor,
    selectedSize,
    selectedColorData,
    selectedSizeData,
    quantity,
    availableStock,
    isInStock,
    finalPrice,
    originalPrice,
    discountAmount,
    selectedView,
    currentTemplateImage,
    frontImage,
    behindImage,
    currentUploadedImage,
    frontImageSize,
    behindImageSize,
    currentImageSize,
    frontImagePosition,
    behindImagePosition,
    currentImagePosition,
    increaseQuantity,
    decreaseQuantity,
    selectColor,
    selectSize,
    selectView,
    handleImageUpload,
    removeImage,
    updateImageSize,
    updateImagePosition
  } = useProductTemplate(selectedTemplate);

  // Show loading state with skeletons (matches ProductTemplateImageEditor + ProductTemplateInfo + ProductTemplateMobileBar)
  if (isLoading) {
    return (
      <main
        className="min-h-screen bg-[var(--color-sky-light)]"
        dir="ltr"
      >
        <div className="max-w-7xl mx-auto px-6 py-2 pb-32 lg:pb-8">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 mb-6 mt-2">
            <BaseSkeleton isLoading={true} variant="text" className="h-4 w-16" />
            <i className="ri-arrow-right-s-line text-gray-400"></i>
            <BaseSkeleton isLoading={true} variant="text" className="h-4 w-28" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Editor Skeleton: Alert + template container + upload zone */}
            <div className="space-y-4">
              <BaseSkeleton
                isLoading={true}
                variant="default"
                className="h-16 w-full rounded-xl"
              />
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg aspect-square relative">
                <BaseSkeleton
                  isLoading={true}
                  variant="rectangular"
                  className="absolute inset-0 w-full h-full"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <BaseSkeleton
                    isLoading={true}
                    variant="default"
                    className="h-12 w-40 rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Product Info Skeleton: Template selector, Price, View, Color+Size, Add to cart */}
            <div dir="rtl">
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm">
                {/* Template Selector */}
                <div className="mb-6">
                  <BaseSkeleton isLoading={true} variant="text" className="h-4 w-28 mb-3" />
                  <div className="flex flex-wrap gap-2">
                    {[1, 2].map((i) => (
                      <BaseSkeleton
                        key={i}
                        isLoading={true}
                        variant="default"
                        className="h-9 w-20 rounded-lg"
                      />
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-6">
                  <BaseSkeleton isLoading={true} variant="text" className="h-7 w-24" />
                  <BaseSkeleton isLoading={true} variant="text" className="h-5 w-16" />
                </div>

                {/* View Selection (Front/Behind) */}
                <div className="mb-6">
                  <BaseSkeleton isLoading={true} variant="text" className="h-4 w-24 mb-3" />
                  <div className="flex gap-3">
                    <BaseSkeleton
                      isLoading={true}
                      variant="default"
                      className="h-10 flex-1 rounded-lg"
                    />
                    <BaseSkeleton
                      isLoading={true}
                      variant="default"
                      className="h-10 flex-1 rounded-lg"
                    />
                  </div>
                </div>

                {/* Color + Size side by side */}
                <div className="flex gap-12 mb-6">
                  <div>
                    <BaseSkeleton isLoading={true} variant="text" className="h-4 w-12 mb-3" />
                    <div className="flex gap-2">
                      {[1, 2, 3].map((i) => (
                        <BaseSkeleton
                          key={i}
                          isLoading={true}
                          variant="circular"
                          className="w-8 h-8"
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <BaseSkeleton isLoading={true} variant="text" className="h-4 w-12 mb-3" />
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4].map((i) => (
                        <BaseSkeleton
                          key={i}
                          isLoading={true}
                          variant="default"
                          className="h-8 w-10 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <BaseSkeleton
                  isLoading={true}
                  variant="default"
                  className="h-14 w-full rounded-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Bar Skeleton (matches ProductTemplateMobileBar) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <BaseSkeleton isLoading={true} variant="text" className="h-3 w-16 mb-1" />
                <BaseSkeleton isLoading={true} variant="text" className="h-7 w-20" />
              </div>
              <div className="text-right">
                <BaseSkeleton isLoading={true} variant="text" className="h-3 w-12 mb-1 ml-auto" />
                <BaseSkeleton isLoading={true} variant="text" className="h-4 w-8 ml-auto" />
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
    console.error("Error fetching product templates:", error);
    notFound();
  }

  // Show 404 if no templates found
  if (!templatesData?.results || templatesData.results.length === 0) {
    notFound();
  }

  // Prepare breadcrumbs
  const breadcrumbItems = [
    {
      label: t("navigation.home"),
      href: ROUTES.HOME
    },
    {
      label: t("designStudio.title"),
      href: ROUTES.PRODUCT_TEMPLATES
    }
  ];

  // Handle add to cart
  const handleAddToCart = () => {
    if (!isInStock) {
      return;
    }

    createAndAddToCart({
      template,
      selectedColor,
      selectedSize,
      quantity,
      finalPrice,
      selectedSizeData,
      selectedColorData,
      currentTemplateImage,
      frontImage,
      behindImage,
      frontImageContainerRef,
      behindImageContainerRef
    });
  };

  return (
    <main
      className="min-h-screen bg-[var(--color-sky-light)]"
      dir="ltr"
    >
      <div className="max-w-7xl mx-auto px-6 py-2 pb-32 lg:pb-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={breadcrumbItems}
          className="mt-2"
        />

        {/* Product Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Editor */}
          <div>
            {currentTemplateImage && (
              <>
                {/* Front view editor - always rendered but hidden when behind is selected */}
                <div
                  ref={frontImageContainerRef}
                  className={cn("template-image-wrapper", selectedView !== "front" && "hidden")}
                >
                  <ProductTemplateImageEditor
                    templateImage={template?.imageFront}
                    uploadedImage={frontImage}
                    imageSize={frontImageSize}
                    imagePosition={frontImagePosition}
                    view="front"
                    onImageUpload={handleImageUpload}
                    onImageRemove={removeImage}
                    onImageSizeChange={updateImageSize}
                    onImagePositionChange={updateImagePosition}
                  />
                </div>
                {/* Behind view editor - always rendered but hidden when front is selected */}
                <div
                  ref={behindImageContainerRef}
                  className={cn("template-image-wrapper", selectedView !== "behind" && "hidden")}
                >
                  <ProductTemplateImageEditor
                    templateImage={template?.imageBehind}
                    uploadedImage={behindImage}
                    imageSize={behindImageSize}
                    imagePosition={behindImagePosition}
                    view="behind"
                    onImageUpload={handleImageUpload}
                    onImageRemove={removeImage}
                    onImageSizeChange={updateImageSize}
                    onImagePositionChange={updateImagePosition}
                  />
                </div>
              </>
            )}
          </div>

          {/* Product Info */}
          <div>
            <ProductTemplateInfo
              template={template}
              templates={templatesData.results}
              selectedTemplateIndex={selectedTemplateIndex}
              onTemplateSelect={setSelectedTemplateIndex}
              selectedColor={selectedColor}
              selectedSize={selectedSize}
              quantity={quantity}
              availableStock={availableStock}
              isInStock={isInStock}
              finalPrice={finalPrice}
              originalPrice={originalPrice}
              discountAmount={discountAmount}
              selectedView={selectedView}
              onColorSelect={selectColor}
              onSizeSelect={selectSize}
              onQuantityIncrease={increaseQuantity}
              onQuantityDecrease={decreaseQuantity}
              onViewSelect={selectView}
              onAddToCart={handleAddToCart}
              isMobile={false}
            />
          </div>
        </div>

        {/* Shipping Info */}
        <ProductShippingInfo />
      </div>

      {/* Mobile Bottom Bar */}
      <ProductTemplateMobileBar
        template={template}
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
