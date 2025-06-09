import React from 'react';

const ToastNotification = ({ toasts, removeToast }) => {
    if (!toasts.length) return null;

    return (
        // Change positioning to top center instead of middle center
        <div className="fixed z-50 top-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-2">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`px-4 py-3 rounded-lg shadow-lg text-white max-w-md w-full 
            ${toast.type === 'success' || toast.type === 'favorite' ? 'bg-green-600' : 'bg-red-600'}
            animate-fade-in flex items-center justify-between`}
                >
                    <div className="mr-3">{toast.message}</div>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className="text-white hover:text-gray-200 ml-2 text-lg font-bold"
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ToastNotification;