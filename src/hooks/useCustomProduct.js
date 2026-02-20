"use client";

import { useCallback } from "react";
import { useCreateCustomProduct } from "@/hooks/useApi";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { showError, showSuccess, showLoading, dismissToast } from "@/lib/utils/toast";
import { prepareImageFiles } from "@/lib/utils/canvasUtils";

const MAX_IMAGE_SIZE_BYTES = 1 * 1024 * 1024; // 1 MB

/**
 * Custom hook for handling custom product creation and cart addition
 * @returns {Object} Hook return object with createAndAddToCart function
 */
export const useCustomProduct = () => {
  const { isAuthenticated } = useAuth();
  const { addCustomItem, openCart } = useCart();
  const createCustomProductMutation = useCreateCustomProduct();

  /**
   * Create custom product and add to cart
   * @param {Object} params - Parameters object
   * @param {Object} params.template - Template object
   * @param {string} params.selectedColor - Selected color key
   * @param {string} params.selectedSize - Selected size key
   * @param {number} params.quantity - Quantity
   * @param {number} params.finalPrice - Final price
   * @param {Object} params.selectedSizeData - Selected size data
   * @param {Object} params.selectedColorData - Selected color data
   * @param {Object} params.currentTemplateImage - Current template image
   * @param {string|null} params.frontImage - Front uploaded image
   * @param {string|null} params.behindImage - Behind uploaded image
   * @param {Object} params.frontImageContainerRef - Front image container ref
   * @param {Object} params.behindImageContainerRef - Behind image container ref
   * @returns {Promise<void>}
   */
  const createAndAddToCart = useCallback(async ({
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
  }) => {
    // Validation
    if (!template || !selectedColor || !selectedSize) {
      showError("لطفاً تمام فیلدها را پر کنید");
      return;
    }

    // Require at least one uploaded image (front or behind)
    if (!frontImage && !behindImage) {
      showError("لطفاً حداقل یک تصویر (جلو یا پشت) آپلود کنید");
      return;
    }

    // Check authentication
    if (!isAuthenticated) {
      showError("برای افزودن محصول به سبد خرید، ابتدا باید وارد حساب کاربری خود شوید");
      return;
    }

    const loadingToast = showLoading("در حال ایجاد محصول سفارشی...");

    try {
      // Prepare FormData
      const formData = new FormData();
      formData.append("template_type", template.type);
      formData.append("color", selectedColor);
      formData.append("size", selectedSize);

      // Prepare front images
      let frontFiles = [];
      if (frontImage) {
        frontFiles = await prepareImageFiles({
          uploadedImage: frontImage,
          containerRef: frontImageContainerRef,
          view: "front"
        });
      }

      // Prepare behind images
      let behindFiles = [];
      if (behindImage) {
        behindFiles = await prepareImageFiles({
          uploadedImage: behindImage,
          containerRef: behindImageContainerRef,
          view: "behind"
        });
      }

      // Validate max size per image (1 MB)
      const allFiles = [...frontFiles, ...behindFiles];
      const oversized = allFiles.find((file) => file.size > MAX_IMAGE_SIZE_BYTES);
      if (oversized) {
        showError("حجم هر تصویر باید حداکثر ۱ مگابایت باشد");
        return;
      }

      frontFiles.forEach((file) => formData.append("image_front", file));
      behindFiles.forEach((file) => formData.append("image_behind", file));

      // Create custom product via API
      const customProduct = await createCustomProductMutation.mutateAsync(formData);
      
      dismissToast(loadingToast);

      if (customProduct?.id) {
        // Add to custom cart (separate array, stored under abraa_cart_custom)
        addCustomItem({
          custom_product_id: customProduct.id,
          quantity
        });

        showSuccess("محصول سفارشی با موفقیت به سبد خرید اضافه شد");
        openCart();
      } else {
        showError("خطا در ایجاد محصول سفارشی");
      }
    } catch (error) {
      dismissToast(loadingToast);
      console.error("Error creating custom product:", error);
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          "خطا در ایجاد محصول سفارشی";
      showError(errorMessage);
    }
  }, [isAuthenticated, createCustomProductMutation, addCustomItem, openCart]);

  return {
    createAndAddToCart,
    isCreating: createCustomProductMutation.isPending
  };
};

