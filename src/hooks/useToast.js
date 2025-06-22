import { useState, useCallback } from 'react';

let toastId = 0;

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++toastId;
    const newToast = {
      id,
      message,
      type,
      duration,
      timestamp: Date.now()
    };

    setToasts(prevToasts => {
      // Limit to maximum 5 toasts
      const updatedToasts = [...prevToasts, newToast];
      if (updatedToasts.length > 5) {
        return updatedToasts.slice(-5);
      }
      return updatedToasts;
    });

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  const showSuccess = useCallback((message, duration = 4000) => {
    return addToast(message, 'success', duration);
  }, [addToast]);

  const showError = useCallback((message, duration = 5000) => {
    return addToast(message, 'error', duration);
  }, [addToast]);

  const showWarning = useCallback((message, duration = 4500) => {
    return addToast(message, 'warning', duration);
  }, [addToast]);

  const showInfo = useCallback((message, duration = 3500) => {
    return addToast(message, 'info', duration);
  }, [addToast]);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Auto-clear old toasts if they get stuck
  const cleanupOldToasts = useCallback(() => {
    const now = Date.now();
    setToasts(prevToasts => 
      prevToasts.filter(toast => now - toast.timestamp < (toast.duration + 1000))
    );
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clearAllToasts,
    cleanupOldToasts
  };
};