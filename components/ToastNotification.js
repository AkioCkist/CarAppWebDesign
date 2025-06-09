import React from 'react';

const ToastNotification = ({ toasts, removeToast }) => {
    if (!toasts.length) return null;

    return (
        // Change positioning to top center instead of middle center
        <div className="fixed z-50 top-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-2">
            {toasts.map((toast) => {
                let bgColor, textColor, icon, iconColor, closeButtonColor;

                if (toast.type === 'favorite' || toast.type === 'success') {
                    bgColor = 'bg-emerald-100'; // Light green background
                    textColor = 'text-emerald-800'; // Dark green text
                    iconColor = 'text-emerald-600'; // Green for checkmark icon
                    closeButtonColor = textColor;
                    icon = (
                        <svg  className={`h-5 w-5 mr-3 flex-shrink-0 ${iconColor}`} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    );
                } else if (toast.type === 'unfavorite') {
                    bgColor = 'bg-sky-100'; // Light blue background
                    textColor = 'text-sky-800'; // Dark blue text
                    iconColor = 'text-slate-700'; // Dark gray/blackish for info icon
                    closeButtonColor = textColor;
                    icon = (
                        <svg className={`h-5 w-5 mr-3 flex-shrink-0 ${iconColor}`} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    );
                } else { // Default case (e.g., error)
                    bgColor = 'bg-red-600'; // Original red background
                    textColor = 'text-white'; // Original white text
                    closeButtonColor = textColor;
                    icon = null; // No icon for default, or you can add one
                }

                return (
                    <div
                        key={toast.id}
                        className={`px-4 py-3 rounded-lg shadow-lg text-sm max-w-md w-full 
                        ${bgColor} ${textColor}
                        animate-fade-in flex items-center`}
                    >
                        {icon}
                        <div className="flex-grow">{toast.message}</div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className={`${closeButtonColor} hover:opacity-75 ml-4 text-xl flex-shrink-0`}
                        >
                            &times;
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default ToastNotification;