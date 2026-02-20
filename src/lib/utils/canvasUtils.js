/**
 * Canvas Utilities
 * Helper functions for capturing and manipulating canvas images
 */

/**
 * Capture canvas image from container
 * @param {HTMLElement} container - Container element with template and uploaded image
 * @returns {Promise<Blob|null>} Image blob or null if failed
 */
export const captureCanvasImage = async (container) => {
  if (!container) return null;

  return new Promise(async (resolve) => {
    // Find the template image container
    const templateContainer = container.querySelector(".template-image-container");
    if (!templateContainer) {
      resolve(null);
      return;
    }

    // Helper to restore container state
    const restoreContainer = () => {
      if (wasHidden) {
        container.style.display = originalDisplay;
        container.style.visibility = originalVisibility;
        container.style.position = originalPosition;
        container.style.left = originalLeft;
        container.classList.remove("temp-visible");
      }
    };

    // Temporarily make container visible if hidden to get accurate dimensions
    const computedStyle = window.getComputedStyle(container);
    const wasHidden = container.classList.contains("hidden") || 
                      container.style.display === "none" ||
                      computedStyle.display === "none";
    
    let originalDisplay = "";
    let originalVisibility = "";
    let originalPosition = "";
    let originalLeft = "";
    
    if (wasHidden) {
      originalDisplay = container.style.display;
      originalVisibility = container.style.visibility;
      originalPosition = container.style.position;
      originalLeft = container.style.left;
      
      container.classList.remove("hidden");
      container.style.display = "block";
      container.style.visibility = "visible";
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.top = "-9999px";
      container.classList.add("temp-visible");
      
      // Force reflow to ensure dimensions are calculated
      void container.offsetHeight;
      
      // Small delay to ensure images are loaded
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Create a canvas element
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    // Get container dimensions
    const rect = templateContainer.getBoundingClientRect();
    const width = rect.width || templateContainer.offsetWidth;
    const height = rect.height || templateContainer.offsetHeight;
    
    if (width === 0 || height === 0) {
      restoreContainer();
      resolve(null);
      return;
    }

    canvas.width = width;
    canvas.height = height;

    // Get base template image
    const baseImageElement = templateContainer.querySelector(".absolute.inset-0 img");
    // Get uploaded overlay image
    const overlayImageElement = templateContainer.querySelector(".absolute.cursor-move img");

    if (!baseImageElement) {
      restoreContainer();
      resolve(null);
      return;
    }

    // Load base image
    const baseImage = new Image();
    baseImage.crossOrigin = "anonymous";
    
    baseImage.onload = () => {
      // Draw base template image
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

      // Draw overlay image if exists
      if (overlayImageElement) {
        const overlayImage = new Image();
        overlayImage.crossOrigin = "anonymous";
        
        overlayImage.onload = () => {
          // Get overlay position and size from styles
          const overlayContainer = overlayImageElement.closest(".absolute.cursor-move");
          if (overlayContainer) {
            const overlayRect = overlayContainer.getBoundingClientRect();
            const containerRect = templateContainer.getBoundingClientRect();
            
            const x = ((overlayRect.left - containerRect.left) / containerRect.width) * canvas.width;
            const y = ((overlayRect.top - containerRect.top) / containerRect.height) * canvas.height;
            const width = (overlayRect.width / containerRect.width) * canvas.width;
            const height = (overlayRect.height / containerRect.height) * canvas.height;

            ctx.drawImage(overlayImage, x, y, width, height);
          }

          // Convert canvas to blob
          canvas.toBlob((blob) => {
            restoreContainer();
            resolve(blob);
          }, "image/png");
        };
        
        overlayImage.onerror = () => {
          // If overlay fails to load, just return base image
          canvas.toBlob((blob) => {
            restoreContainer();
            resolve(blob);
          }, "image/png");
        };

        // Load overlay image
        overlayImage.src = overlayImageElement.src;
      } else {
        // No overlay, just return base image
        canvas.toBlob((blob) => {
          restoreContainer();
          resolve(blob);
        }, "image/png");
      }
    };

    baseImage.onerror = () => {
      restoreContainer();
      resolve(null);
    };

    // Load base image
    baseImage.src = baseImageElement.src;
  });
};

/**
 * Convert data URL or blob URL to File
 * @param {string} dataUrl - Data URL or blob URL
 * @param {string} filename - Filename for the file
 * @returns {Promise<File>} File object
 */
export const dataUrlToFile = async (dataUrl, filename) => {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type || "image/png" });
};

/**
 * Prepare image files for custom product creation
 * @param {Object} params - Parameters object
 * @param {string|null} params.uploadedImage - Uploaded image data URL
 * @param {HTMLElement|null} params.containerRef - Container ref for canvas capture
 * @param {string} params.view - View type: "front" or "behind"
 * @returns {Promise<Array<File>>} Array of image files
 */
export const prepareImageFiles = async ({ uploadedImage, containerRef, view }) => {
  const files = [];

  if (uploadedImage) {
    // Add uploaded image
    const uploadedFile = await dataUrlToFile(
      uploadedImage,
      `${view}_uploaded.png`
    );
    files.push(uploadedFile);

    // Capture final image from canvas if container exists
    if (containerRef?.current) {
      const canvasBlob = await captureCanvasImage(containerRef.current);
      if (canvasBlob) {
        const canvasFile = new File(
          [canvasBlob],
          `${view}_final.png`,
          { type: "image/png" }
        );
        files.push(canvasFile);
      }
    }
  }

  return files;
};

