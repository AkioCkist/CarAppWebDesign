import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ToastNotification = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-4 right-4 z-[9999] space-y-2">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, y: -50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -50, scale: 0.9 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className={`
              relative max-w-sm w-full shadow-lg rounded-lg pointer-events-auto overflow-hidden
              ${toast.type === 'favorite'
                                ? 'bg-green-50 border-l-4 border-green-500'
                                : 'bg-blue-50 border-l-4 border-blue-500'
                            }
            `}
                    >
                        <div className="p-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    {toast.type === 'favorite' ? (
                                        <svg className="h-6 w-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    ) : (
                                        <svg className="h-6 w-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" />
                                        </svg>
                                    )}
                                </div>
                                <div className="ml-3 w-0 flex-1">
                                    <p className={`text-sm font-medium ${toast.type === 'favorite' ? 'text-green-800' : 'text-blue-800'
                                        }`}>
                                        {toast.message}
                                    </p>
                                </div>
                                <div className="ml-4 flex-shrink-0 flex">
                                    <button
                                        className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${toast.type === 'favorite'
                                            ? 'text-green-500 hover:bg-green-100 focus:ring-green-500'
                                            : 'text-blue-500 hover:bg-blue-100 focus:ring-blue-500'
                                            }`}
                                        onClick={() => removeToast(toast.id)}
                                    >
                                        <span className="sr-only">Dismiss</span>
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div className={`h-1 ${toast.type === 'favorite' ? 'bg-green-200' : 'bg-blue-200'
                            }`}>
                            <motion.div
                                className={`h-full ${toast.type === 'favorite' ? 'bg-green-500' : 'bg-blue-500'
                                    }`}
                                initial={{ width: '100%' }}
                                animate={{ width: '0%' }}
                                transition={{ duration: toast.duration / 1000, ease: "linear" }}
                            />
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default ToastNotification;