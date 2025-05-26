// components/CarLoading.js
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CarLoadingScreen = ({ isVisible, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const originalOverflowRef = useRef('');
  const originalPositionRef = useRef('');

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2500; // 2.5 seconds
    const interval = 16; // ~60fps
    const increment = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete?.();
          }, 400); // Small delay before calling onComplete
          return 100;
        }
        return newProgress;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isVisible, onComplete]);

  // Handle body scroll lock
  useEffect(() => {
    if (isVisible) {
      // Save current styles
      originalOverflowRef.current = document.body.style.overflow;
      originalPositionRef.current = document.body.style.position;

      // Lock scroll and prevent interactions
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      document.body.style.top = '0';
      document.body.style.left = '0';

      // Disable pointer events on all elements except loading screen
      const allElements = document.querySelectorAll('body > *:not([data-loading-screen])');
      allElements.forEach(el => {
        el.style.pointerEvents = 'none';
        el.style.userSelect = 'none';
      });

      // Prevent scroll events
      const preventDefault = (e) => e.preventDefault();
      document.addEventListener('wheel', preventDefault, { passive: false });
      document.addEventListener('touchmove', preventDefault, { passive: false });
      document.addEventListener('keydown', (e) => {
        // Prevent arrow keys, space, page up/down
        if ([32, 33, 34, 35, 36, 37, 38, 39, 40].includes(e.keyCode)) {
          e.preventDefault();
        }
      });

      return () => {
        // Restore body styles
        document.body.style.overflow = originalOverflowRef.current;
        document.body.style.position = originalPositionRef.current;
        document.body.style.width = '';
        document.body.style.height = '';
        document.body.style.top = '';
        document.body.style.left = '';

        // Restore pointer events
        const allElements = document.querySelectorAll('body > *:not([data-loading-screen])');
        allElements.forEach(el => {
          el.style.pointerEvents = '';
          el.style.userSelect = '';
        });

        // Remove event listeners
        document.removeEventListener('wheel', preventDefault);
        document.removeEventListener('touchmove', preventDefault);
      };
    }
  }, [isVisible]);

  // Reset progress when component becomes invisible
  useEffect(() => {
    if (!isVisible) {
      setProgress(0);
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          data-loading-screen="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-white z-[9999] flex items-center justify-center"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            pointerEvents: 'all',
            touchAction: 'none'
          }}
        >
          <div className="w-full max-w-md px-8">
            {/* Logo and Title */}
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center mb-12"
            >
              <div className="flex items-center justify-center mb-4">
                <img
                  src="/logo/logo.png"
                  alt="Whale Xe"
                  className="h-12 w-12 object-contain"
                  onError={(e) => {
                    // Fallback if logo doesn't exist
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div
                  className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-500 rounded-lg items-center justify-center hidden"
                  style={{ display: 'none' }}
                >
                  <span className="text-white font-bold text-xl">W</span>
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent ml-3">
                  Whale Xe
                </span>
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-gray-600 text-lg"
              >
                Đang chuyển hướng đến trang đăng ký...
              </motion.p>
            </motion.div>

            {/* Progress Bar Container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="relative mb-8"
            >
              {/* Progress Bar Track */}
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                {/* Progress Bar Fill */}
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-green-500 rounded-full relative"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1, ease: 'linear' }}
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                </motion.div>
              </div>

              {/* Car SVG */}
              <motion.div
                className="absolute -top-6 -ml-5"
                initial={{ left: '0%' }}
                animate={{ left: `${progress}%` }}
                transition={{ duration: 0.1, ease: 'linear' }}
              >
                <motion.svg
                  width="40"
                  height="28"
                  viewBox="0 0 40 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="drop-shadow-lg"
                  animate={{
                    y: [0, -2, 0],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}>
                  {/* Car Shadow */}
                  <ellipse cx="20" cy="26" rx="15" ry="2" fill="#000000" opacity="0.1" />
                  {/* Car Body */}
                  <path
                    d="M5 14h30c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2h-2c0 2.2-1.8 4-4 4s-4-1.8-4-4H13c0 2.2-1.8 4-4 4s-4-1.8-4-4H3c-1.1 0-2-.9-2-2v-6c0-1.1.9-2 2-2z"
                    fill="#3B82F6"
                  />
                  {/* Car Top */}
                  <path
                    d="M7 14V9c0-1.1.9-2 2-2h12l6 5v2H7z"
                    fill="#1E40AF"
                  />
                  {/* Windows */}
                  <path
                    d="M9 11h10l4 3H9V11z"
                    fill="#87CEEB"
                    opacity="0.8"
                  />
                  {/* Wheels */}
                  <circle cx="9" cy="22" r="3" fill="#2D3748" />
                  <circle cx="29" cy="22" r="3" fill="#2D3748" />
                  <circle cx="9" cy="22" r="1.5" fill="#718096" />
                  <circle cx="29" cy="22" r="1.5" fill="#718096" />
                  {/* Car Details */}
                  <rect x="20" y="16" width="12" height="1" fill="#1E40AF" rx="0.5" />
                  <rect x="7" y="16" width="10" height="1" fill="#1E40AF" rx="0.5" />
                  {/* Headlight */}
                  <circle cx="36" cy="18" r="1.5" fill="#FFF59D" opacity="0.9" />
                  {/* Taillight */}
                  <circle cx="4" cy="18" r="1" fill="#F87171" opacity="0.8" />
                </motion.svg>
              </motion.div>
            </motion.div>
            {/* Loading Text with Dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-gray-600 text-lg font-medium">Đang tải</span>
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-blue-500 rounded-full"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 1, 0.3],
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
              </div>
              {/* Progress Percentage (Optional - hidden by default) */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: progress > 50 ? 0.6 : 0 }}
                className="mt-3 text-sm text-gray-500">
                {Math.round(progress)}%
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Enhanced Hook với loading state management
export const useCarLoading = () => {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = () => {
    setIsLoading(true);
    // Additional cleanup if needed
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  };

  const stopLoading = () => setIsLoading(false);

  return {
    isLoading,
    startLoading,
    stopLoading,
    CarLoadingScreen: ({ onComplete }) => (
      <CarLoadingScreen
        isVisible={isLoading}
        onComplete={() => {
          onComplete?.();
        }}
      />
    ),
  };
};

export default CarLoadingScreen;