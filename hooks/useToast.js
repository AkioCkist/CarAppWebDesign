import { useState, useCallback } from 'react';

export const useToast = () => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = Date.now() + Math.random();
        const newToast = { id, message, type, duration };

        setToasts(prev => [...prev, newToast]);

        // Auto remove toast after duration
        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const showFavoriteToast = useCallback((message) => {
        addToast(message, 'favorite', 4000);
    }, [addToast]);

    const showUnfavoriteToast = useCallback((message) => {
        addToast(message, 'unfavorite', 4000);
    }, [addToast]);

    return {
        toasts,
        addToast,
        removeToast,
        showFavoriteToast,
        showUnfavoriteToast
    };
};