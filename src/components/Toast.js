import React, { useState, useEffect } from 'react';

const Toast = ({ toast, onClose, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 50);

    // Auto dismiss
    const dismissTimer = setTimeout(() => {
      handleClose();
    }, toast.duration || 4000);

    return () => clearTimeout(dismissTimer);
  }, [toast.duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(toast.id);
    }, 300);
  };

  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-500 border-l-4 border-green-600 shadow-green-200';
      case 'error':
        return 'bg-red-500 border-l-4 border-red-600 shadow-red-200';
      case 'warning':
        return 'bg-yellow-500 border-l-4 border-yellow-600 shadow-yellow-200';
      case 'info':
        return 'bg-blue-500 border-l-4 border-blue-600 shadow-blue-200';
      default:
        return 'bg-gray-500 border-l-4 border-gray-600 shadow-gray-200';
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return (
          <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="flex-shrink-0 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="flex-shrink-0 w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'info':
        return (
          <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const baseTransform = `translateY(${index * 80}px)`;
  const slideTransform = isVisible ? 'translateX(0)' : 'translateX(100%)';
  const scaleTransform = isLeaving ? 'scale(0.95)' : 'scale(1)';
  const opacity = isVisible && !isLeaving ? '1' : '0';

  return (
    <div
      className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ease-in-out ${getToastStyles()} 
        rounded-lg shadow-2xl min-w-80 max-w-96 backdrop-blur-sm`}
      style={{
        transform: `${baseTransform} ${slideTransform} ${scaleTransform}`,
        opacity: opacity,
        background: toast.type === 'success' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' :
                   toast.type === 'error' ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' :
                   toast.type === 'warning' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' :
                   toast.type === 'info' ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' :
                   'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
      }}
    >
      <div className="flex items-start p-4">
        {getIcon()}
        
        <div className="flex-1 ml-3">
          <p className="text-white font-medium text-sm leading-5">{toast.message}</p>
          
          {/* Progress Bar */}
          <div className="mt-2 w-full bg-white bg-opacity-20 rounded-full h-1">
            <div 
              className="bg-white h-1 rounded-full animate-progress-bar"
              style={{
                animation: `progressBar ${toast.duration || 4000}ms linear forwards`
              }}
            ></div>
          </div>
        </div>
        
        <button
          onClick={handleClose}
          className="flex-shrink-0 ml-4 p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors duration-200"
        >
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Toast Container Component
export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-0 right-0 z-50 pointer-events-none">
      <div className="relative">
        {toasts.map((toast, index) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              toast={toast}
              onClose={removeToast}
              index={index}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Toast;