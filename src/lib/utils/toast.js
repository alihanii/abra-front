import toast from 'react-hot-toast';

// Helper function to add click to dismiss functionality
const addClickToDismiss = (toastId) => {
  setTimeout(() => {
    // Try multiple selectors to find the toast element
    const selectors = [
      `[data-id="${toastId}"]`,
      `div[role="status"]`,
      `.t-toast`,
    ];
    
    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => {
        // Check if this element doesn't already have a click handler
        if (!el.dataset.clickable) {
          el.dataset.clickable = 'true';
          el.style.cursor = 'pointer';
          el.addEventListener('click', () => {
            toast.dismiss(toastId);
          });
        }
      });
    }
  }, 100);
};

/**
 * Show a success toast message
 * @param {string} message - The message to display
 * @param {object} options - Additional toast options
 */
export const showSuccess = (message, options = {}) => {
  const toastId = toast.success(message, {
    className: 't-toast success',
    ...options,
  });
  
  addClickToDismiss(toastId);
  return toastId;
};

/**
 * Show an error/danger toast message
 * @param {string} message - The message to display
 * @param {object} options - Additional toast options
 */
export const showError = (message, options = {}) => {
  const toastId = toast.error(message, {
    className: 't-toast danger',
    ...options,
  });
  
  addClickToDismiss(toastId);
  return toastId;
};

/**
 * Show a warning toast message
 * @param {string} message - The message to display
 * @param {object} options - Additional toast options
 */
export const showWarning = (message, options = {}) => {
  const toastId = toast(message, {
    className: 't-toast warning',
    icon: '⚠️',
    ...options,
  });
  
  addClickToDismiss(toastId);
  return toastId;
};

/**
 * Show an info toast message
 * @param {string} message - The message to display
 * @param {object} options - Additional toast options
 */
export const showInfo = (message, options = {}) => {
  const toastId = toast(message, {
    className: 't-toast',
    icon: 'ℹ️',
    ...options,
  });
  
  addClickToDismiss(toastId);
  return toastId;
};

/**
 * Show a loading toast message
 * @param {string} message - The message to display
 * @param {object} options - Additional toast options
 */
export const showLoading = (message, options = {}) => {
  const toastId = toast.loading(message, {
    className: 't-toast',
    ...options,
  });
  
  addClickToDismiss(toastId);
  return toastId;
};

/**
 * Dismiss a toast by its ID
 * @param {string} toastId - The toast ID to dismiss
 */
export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

/**
 * Dismiss all toasts
 */
export const dismissAll = () => {
  toast.dismiss();
};

/**
 * Promise-based toast for async operations
 * @param {Promise} promise - The promise to handle
 * @param {object} messages - Messages for loading, success, and error states
 * @param {object} options - Additional toast options
 */
export const promiseToast = (promise, messages, options = {}) => {
  const toastId = toast.promise(
    promise,
    {
      loading: messages.loading || 'در حال پردازش...',
      success: messages.success || 'موفقیت‌آمیز بود',
      error: messages.error || 'خطا رخ داد',
    },
    {
      className: 't-toast',
      ...options,
    }
  );
  
  addClickToDismiss(toastId);
  return toastId;
};

// Export default toast utilities for direct access if needed
const toastUtils = {
  success: showSuccess,
  error: showError,
  warning: showWarning,
  info: showInfo,
  loading: showLoading,
  dismiss: dismissToast,
  dismissAll,
  promise: promiseToast,
};
export default toastUtils;


