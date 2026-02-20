"use client";

import { useCallback } from "react";
import { useCreateCustomProduct } from "@/hooks/useApi";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { showError, showSuccess, showLoading, dismissToast } from "@/lib/utils/toast";
import { prepareImageFiles } from "@/lib/utils/canvasUtils";

/**
 * Custom hook for handling custom product creation and cart addition
 * @returns {Object} Hook return object with createAndAddToCart function
 */
export const useCustomProduct = () => {
  const { isAuthenticated } = useAuth();
  const { addItem, openCart } = useCart();
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
      if (frontImage) {
        const frontFiles = await prepareImageFiles({
          uploadedImage: frontImage,
          containerRef: frontImageContainerRef,
          view: "front"
        });
        frontFiles.forEach(file => {
          formData.append("image_front", file);
        });
      }

      // Prepare behind images
      if (behindImage) {
        const behindFiles = await prepareImageFiles({
          uploadedImage: behindImage,
          containerRef: behindImageContainerRef,
          view: "behind"
        });
        behindFiles.forEach(file => {
          formData.append("image_behind", file);
        });
      }

      // Create custom product via API
      const customProduct = await createCustomProductMutation.mutateAsync(formData);
      
      dismissToast(loadingToast);

      if (customProduct?.id) {
        // Add to cart using the created product ID
        addItem({
          id: String(customProduct.id),
          slug: `custom-${customProduct.id}`,
          name: customProduct.name || `${template.type} (Custom Design)`,
          price: parseFloat(customProduct.price) || finalPrice,
          image: customProduct.custom_image_front?.[0]?.url || 
                 customProduct.custom_image_behind?.[0]?.url || 
                 currentTemplateImage?.url || "",
          size: customProduct.size_name || selectedSizeData?.name || selectedSize,
          color: customProduct.color_name || selectedColorData?.name || selectedColor,
          quantity: quantity
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
  }, [isAuthenticated, createCustomProductMutation, addItem, openCart]);

  return {
    createAndAddToCart,
    isCreating: createCustomProductMutation.isPending
  };
};

