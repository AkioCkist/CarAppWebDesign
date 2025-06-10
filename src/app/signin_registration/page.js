"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from 'next/image';
import { motion } from "framer-motion";

// Animation variant for pull-up
const pullUpVariant = {
  hidden: { opacity: 0, y: 80 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 45, delay: 0.5 }
  }
};

// Modified glassStyle object - remove any backdrop-filter properties
const glassStyle = {
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  background: "rgba(255,255,255,0.10)", // semi-transparent background
  borderRadius: "1rem",
  border: "1px solid rgba(255,255,255,0.3)"
  // No backdrop-filter here
};

// New variants for the popup animation
const popupVariants = {
  hidden: { opacity: 0, scale: 0.8, y: -50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: -50,
    transition: {
      ease: "easeOut",
      duration: 0.3,
    },
  },
};

function useFocusState() {
  const [focusedInput, setFocusedInput] = useState(null);

  const handleFocus = (inputName) => {
    setFocusedInput(inputName);
  };

  const handleBlur = () => {
    setFocusedInput(null);
  };

  return { focusedInput, handleFocus, handleBlur };
}

export default function LoginPage() {
  const [scrollY, setScrollY] = useState(0);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    confirmPassword: '',
    name: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [flipDirection, setFlipDirection] = useState('horizontal');
  const [authMessage, setAuthMessage] = useState({ show: false, message: "", success: false });

  const { focusedInput, handleFocus, handleBlur } = useFocusState();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Prevent non-numeric input for phone number fields
  const handlePhoneInput = (e) => {
    const { value } = e.target;
    // Allow only digits and optional leading '+'
    if (/^[+]?\d*$/.test(value)) {
      handleInputChange(e);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?\d{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  setIsLoading(true);
  setAuthMessage({ show: false, message: "", success: false });

  try {
    if (isLogin) {
      // Login logic
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          phone: formData.phone,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setAuthMessage({
          show: true,
          message: "Login successful! Redirecting...",
          success: true,
        });
        setTimeout(() => {
          // Check if user is admin (role_id = 3)
          const isAdmin = data.user.roles?.some(role => role.id === 3);
          window.location.href = isAdmin ? "/dashboard" : "/";
        }, 2500);
      } else {
        setAuthMessage({
          show: true,
          message: data.error || "Phone number or password is incorrect.",
          success: false,
        });
        setTimeout(() => setAuthMessage({ show: false, message: "", success: false }), 2500);
      }
    } else {
      // Registration logic (fixed key names)
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setAuthMessage({
          show: true,
          message: 'Account created successfully!',
          success: true,
        });
        setTimeout(() => {
          setAuthMessage({ show: false, message: "", success: false });
          window.location.href = "/";
        }, 2500);
      } else {
        setAuthMessage({
          show: true,
          message: data.error || 'Registration failed. Please try again.',
          success: false,
        });
        setTimeout(() => setAuthMessage({ show: false, message: "", success: false }), 2500);
      }
    }
  } catch (error) {
    setAuthMessage({
      show: true,
      message: 'Network error. Please check your connection and try again.',
      success: false,
    });
    setTimeout(() => setAuthMessage({ show: false, message: "", success: false }), 2500);
  } finally {
    setIsLoading(false);
  }
};

  // Placeholder for social login (not implemented yet)
  const handleSocialLogin = async (provider) => {
    setAuthMessage({ 
      show: true, 
      message: `${provider} login is not yet implemented.`, 
      success: false 
    });
    setTimeout(() => setAuthMessage({ show: false, message: "", success: false }), 2500);
  };

  const toggleMode = () => {
    // Randomly choose flip direction with each toggle
    setFlipDirection(Math.random() > 0.5 ? 'horizontal' : 'vertical');
    setIsLogin(!isLogin);
    setFormData({
      phone: '',
      password: '',
      confirmPassword: '',
      name: '',
      rememberMe: false
    });
    setErrors({});
    setAuthMessage({ show: false, message: "", success: false });
  };

  // Zoom out transition for header and login panel
  const zoomOutVariant = {
    hidden: { opacity: 0, scale: 1.04, y: 32 },
    visible: (i = 1) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };

  // Simple fade in for video only
  const fadeInVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: "easeOut"
      }
    }
  };

  // Card flip variants with bouncy effect
  const cardVariants = {
    front: (direction) => ({
      rotateY: direction === 'horizontal' ? 0 : 0,
      rotateX: direction === 'vertical' ? 0 : 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
        bounce: 0.8,
        duration: 0.8
      }
    }),
    back: (direction) => ({
      rotateY: direction === 'horizontal' ? 180 : 0,
      rotateX: direction === 'vertical' ? 180 : 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
        bounce: 0.8,
        duration: 0.8
      }
    })
  };

  // Content animation that syncs with card flip
  const contentVariants = {
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.3, // Delay appearance until flip is mostly complete
        duration: 0.5
      }
    },
    hidden: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.2
      }
    }
  };

  // New text animation variants
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.7,
        ease: "easeOut"
      }
    })
  };

  // New input animation variants
  const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i = 1) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.15 + 0.3, // Stagger after header appears
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }
    })
  };

  return (
    <div className="font-sans bg-black text-gray-900 min-h-screen">
      {/* Notification Component */}
      {authMessage.show && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.9 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
            duration: 0.5
          }}
          className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4"
        >
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 2, duration: 0.8 }} // Start fade after 2 seconds, fade for 0.8 seconds
            className={`relative overflow-hidden rounded-2xl shadow-2xl border backdrop-blur-md ${
              authMessage.success
                ? 'bg-gradient-to-r from-green-500/90 to-emerald-600/90 border-green-400/50'
                : 'bg-gradient-to-r from-red-500/90 to-rose-600/90 border-red-400/50'
            }`}
            style={{
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            {/* Animated background glow */}
            <div
              className={`absolute inset-0 opacity-30 ${
                authMessage.success ? 'bg-green-400' : 'bg-red-400'
              }`}
              style={{
                background: authMessage.success
                  ? 'radial-gradient(circle at 30% 50%, rgba(34, 197, 94, 0.4) 0%, transparent 50%)'
                  : 'radial-gradient(circle at 30% 50%, rgba(239, 68, 68, 0.4) 0%, transparent 50%)'
              }}
            />
            
            <div className="relative p-4">
              <div className="flex items-start space-x-3">
                {/* Icon */}
                <div className={`flex-shrink-0 ${authMessage.success ? 'text-green-100' : 'text-red-100'}`}>
                  {authMessage.success ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ scale: 0, rotate: 180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.div>
                  )}
                </div>

                {/* Message */}
                <div className="flex-1 min-w-0">
                  <motion.p
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`text-sm font-medium ${
                      authMessage.success ? 'text-green-50' : 'text-red-50'
                    }`}
                  >
                    {authMessage.message}
                  </motion.p>
                </div>

                {/* Close button */}
                <button
                  onClick={() => setAuthMessage({ show: false, message: "", success: false })}
                  className={`flex-shrink-0 rounded-full p-1 hover:bg-white/20 transition-colors ${
                    authMessage.success ? 'text-green-100 hover:text-green-50' : 'text-red-100 hover:text-red-50'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Progress bar for auto-dismiss - Updated timing to match 2-second display */}
              <motion.div
                className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  className={`h-full ${authMessage.success ? 'bg-green-200' : 'bg-red-200'}`}
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{
                    duration: 2, // Changed to 2 seconds to match display time
                    ease: "linear",
                    delay: 0.5
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Header - Apply zoom out transition */}
      <motion.header
        variants={zoomOutVariant}
        initial="hidden"
        animate="visible"
        custom={0}
        className="fixed top-0 left-0 w-full z-30 text-white transition-opacity duration-300"
        style={{
          opacity: scrollY > 5 ? Math.max(1 - (scrollY - 5) / 5, 0) : 1,
          backgroundColor: scrollY > 50 ? 'rgba(17, 24, 39, 0.9)' : 'transparent',
          transition: 'background-color 0.3s ease, opacity 0.3s ease'
        }}
      >
        <div className="max-w-7xl mx-auto px-4">
          {/* Top bar with contact info and social links */}
          <div className="flex items-center justify-between py-2 text-sm">
            <div className="flex items-center gap-4">
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
              <a href="#" aria-label="Pinterest"><i className="fab fa-pinterest"></i></a>
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            </div>
          </div>

          {/* Main navigation */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2">
              {/* Logo */}
              <a href="../" className="flex items-center">
                <img src="/logo/logo.webp" alt="Logo" className="h-12" />
                <span className="text-2xl font-bold text-white ml-2">Whale Xe</span>
              </a>
            </div>

            <nav className="flex items-center gap-6 text-base font-medium">
              <a href="../" className="text-white hover:text-green-400 transition">Home</a>
              <a href="#" className="text-white hover:text-green-400 transition">Cars</a>
              <a href="#" className="text-white hover:text-green-400 transition flex items-center gap-1">
                Booking <i className="fas fa-chevron-down text-xs"></i>
              </a>
              <a href="" className="text-white hover:text-green-400 transition flex items-center gap-1">
                My Account <i className="fas fa-chevron-down text-xs"></i>
              </a>
              <a href="#" className="text-white hover:text-green-400 transition flex items-center gap-1">
                Pages <i className="fas fa-chevron-down text-xs"></i>
              </a>
              <a href="#" className="text-white hover:text-green-400 transition">Gallery</a>
              <a href="#" className="text-white hover:text-green-400 transition flex items-center gap-1">
                News <i className="fas fa-chevron-down text-xs"></i>
              </a>
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Login Section */}
      <section className="h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background video with fade-in only */}
        <motion.video
          variants={fadeInVariant}
          initial="hidden"
          animate="visible"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0, background: "#000" }}
          src="/background/loginBackground.webm"
          autoPlay
          loop
          muted
          playsInline
        />

        {/* Dark overlay */}
        <div
          className="absolute inset-0 bg-black opacity-50"
          style={{ zIndex: 1 }}
        />        <div className="relative z-10 w-full max-w-[420px] mx-auto px-4 h-full flex items-center justify-center">
          <div className="transform scale-[0.95] md:scale-100 transition-transform duration-300 w-full">
            <div className="w-full max-w-[380px] max-h-[680px]">
              <motion.div
                variants={pullUpVariant}
                initial="hidden"
                animate="visible"
                className="w-full perspective-1000 relative"
                style={{
                  backdropFilter: "blur(18px)",
                  WebkitBackdropFilter: "blur(18px)",
                }}
              >
                {/* Flippable card */}
                <motion.div
                  custom={flipDirection}
                  variants={cardVariants}
                  initial="front"
                  animate={isLogin ? "front" : "back"}                  className="w-full h-full relative preserve-3d"
                  style={{
                    transformStyle: "preserve-3d",
                    minHeight: "700px" // Ensure enough height for content
                  }}
                >                  {/* Front side (Login) */}
                  <motion.div
                    className="absolute w-full h-full backface-hidden rounded-2xl shadow-2xl p-8 border border-white/30"
                    style={{
                      ...glassStyle,
                      backfaceVisibility: "hidden",
                      display: "flex",
                      flexDirection: "column"
                    }}
                  >
                    {/* Content wrapper with animation */}
                    <motion.div
                      className="flex-1 flex flex-col"
                      initial="visible"
                      animate={isLogin ? "visible" : "hidden"}
                      variants={contentVariants}
                    >                      {/* Header with typing animation */}
                      <div className="text-center mb-6 px-6">
                        <motion.div
                          className="w-14 h-14 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            delay: 0.2
                          }}
                        >
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>                        </motion.div>

                        <motion.h2
                          className="text-2xl font-bold text-white mb-2"
                          variants={textVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          {isLogin ? 'Welcome Back' : 'Create Account'}
                        </motion.h2>
                      </div>{/* Form with extended bottom padding */}
                      <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">                        {!isLogin && (
                          <div className="px-6">
                            <label className="block text-sm font-medium text-white mb-2">Full Name</label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                                errors.name ? 'border-red-500' : 'border-gray-300'
                              } bg-white bg-opacity-80 text-gray-900`}
                              placeholder="Enter your full name"
                            />
                            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                          </div>
                        )}{/* Phone number input for login */}                        <motion.div
                          variants={inputVariants}
                          initial="hidden"
                          animate="visible"
                          custom={1}
                        >
                          <div className="px-6">
                            <label className="block text-sm font-medium text-white mb-2">Phone Number</label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handlePhoneInput}
                              onFocus={() => handleFocus("phone")}
                              onBlur={handleBlur}
                              className={`w-full px-3 py-2.5 border rounded-lg transition-all duration-300 ${
                                errors.phone ? 'border-red-500' :
                                focusedInput === "phone" ? 'border-green-500 ring-2 ring-green-500 ring-opacity-50' : 'border-gray-300'
                              } bg-white bg-opacity-80 text-gray-900`}
                              placeholder="Enter your phone number"
                              pattern="^\+?\d{10,15}$"
                              inputMode="tel"
                            />
                            <motion.div
                              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-green-500 to-blue-500"
                              initial={{ width: "0%" }}
                              animate={{ width: focusedInput === "phone" ? "100%" : "0%" }}
                              transition={{ duration: 0.3 }}
                            />
                            {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                          </div>
                        </motion.div>                        <motion.div
                          variants={inputVariants}
                          initial="hidden"
                          animate="visible"
                          custom={2}
                        >
                          <div className="px-6">
                            <label className="block text-sm font-medium text-white mb-2">Password</label>
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition pr-12 ${
                                  errors.password ? 'border-red-500' : 'border-gray-300'
                                } bg-white bg-opacity-80 text-gray-900`}
                                placeholder="Enter your password"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white"
                              >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                              </button>
                            </div>
                            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
                          </div>
                        </motion.div>                        {!isLogin && (
                          <motion.div
                            variants={inputVariants}
                            initial="hidden"
                            animate="visible"
                            custom={3}
                          >
                            <div className="px-6">
                              <label className="block text-sm font-medium text-white mb-2">Confirm Password</label>
                              <div className="relative">
                                <input
                                  type={showConfirmPassword ? "text" : "password"}
                                  name="confirmPassword"
                                  value={formData.confirmPassword}
                                  onChange={handleInputChange}
                                  className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition pr-12 ${
                                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                  } bg-white bg-opacity-80 text-gray-900`}
                                  placeholder="Confirm your password"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white"
                                >
                                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                              </div>
                              {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
                            </div>
                          </motion.div>
                        )}                        {isLogin && (
                          <div className="flex items-center justify-between px-6">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-white">Remember me</span>
                            </label>
                            <a href="#" className="text-sm text-green-200 hover:text-green-100">
                              Forgot password?
                            </a>
                          </div>
                        )}                        
                        {/* ########## START: BUTTON FIX ########## */}
                        <div className="px-6 mt-auto">
                          <motion.button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                          >
                            {isLoading ? (
                              <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                {isLogin ? 'Signing in...' : 'Creating account...'}
                              </div>
                            ) : (
                              isLogin ? 'Sign In' : 'Create Account'
                            )}
                          </motion.button>
                        </div>
                        {/* ########## END: BUTTON FIX ########## */}


                        {/* Divider */}
                        <div className="text-gray-400 text-2xl text-center mt-4 arrow-cycle">
                          ↓
                        </div>
                        <style jsx>{`
                          .arrow-cycle {
                            display: inline-block;
                            animation: arrowSpinBounce 2.5s infinite ease-in-out;
                            color: #9ca3af; /* Tailwind gray-400 */
                          }
                          @keyframes arrowSpinBounce {
                            0% { transform: rotate(0deg) translateY(0); opacity: 0.6; color: #9ca3af; /* gray-400 */ }
                            10% { transform: rotate(360deg) translateY(0); color: #9ca3af; }
                            30% { transform: rotate(0deg) translateY(12px); opacity: 1; color: #fff; /* white */ }
                            60% { transform: translateY(-6px); color: #fff; }
                            90% { transform: rotate(360deg) translateY(0); opacity: 0.8; color: #9ca3af; }
                            100% { transform: rotate(0deg) translateY(0); opacity: 0.6; color: #9ca3af; }
                          }
                        `}</style>                        {/* Social Login Buttons with Icons */}
                        <div className="grid grid-cols-2 gap-3 px-6">
                          <button
                            type="button"
                            onClick={() => handleSocialLogin('google')}
                            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                          >
                            <Image src="/icons/google.svg" alt="Google" width={24} height={24} className="mr-2" />
                            <span className="text-white">Google</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSocialLogin('facebook')}
                            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                          >
                            <Image src="/icons/facebook.svg" alt="Facebook" width={24} height={24} className="mr-2" />
                            <span className="text-white">Facebook</span>
                          </button>
                        </div>                        {/* Toggle Mode */}
                        <div className="mt-6 text-center px-6">
                          <p className="text-sm text-white">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button
                              type="button"
                              onClick={toggleMode}
                              className="ml-1 text-green-200 hover:text-green-100 font-medium"
                            >
                              {isLogin ? 'Sign up' : 'Sign in'}
                            </button>
                          </p>
                        </div>
                      </form>
                    </motion.div>
                  </motion.div>                  {/* Back side (Register) - Adjusted the text for the "Back" side for consistency */}
                  <motion.div
                    className="absolute w-full h-full backface-hidden rounded-2xl shadow-2xl p-8 border border-white/30"
                    style={{
                      ...glassStyle,
                      transform: flipDirection === 'horizontal' ? "rotateY(180deg)" : "rotateX(180deg)",
                      display: "flex",
                      flexDirection: "column",
                      visibility: isLogin ? "hidden" : "visible" // Ensure it's only visible when isLogin is false
                    }}
                  >
                    <motion.div
                      className="flex-1 flex flex-col"
                      initial="hidden"
                      animate={isLogin ? "hidden" : "visible"}
                      variants={contentVariants}
                    >                      <div className="text-center mb-6 px-6">
                        <motion.div
                          className="w-14 h-14 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            delay: 0.2
                          }}
                        >
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>                        </motion.div>
                        <motion.h2
                          className="text-2xl font-bold text-white mb-2"
                          variants={textVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          Create Account
                        </motion.h2>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">                        {/* Name input for registration */}
                        <div className="px-6">
                          <label className="block text-sm font-medium text-white mb-2">Full Name</label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                              errors.name ? 'border-red-500' : 'border-gray-300'
                            } bg-white bg-opacity-80 text-gray-900`}
                            placeholder="Enter your full name"
                          />
                          {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                        </div>                        <motion.div
                          variants={inputVariants}
                          initial="hidden"
                          animate="visible"
                          custom={1}
                        >
                          <div className="px-6">
                            <label className="block text-sm font-medium text-white mb-2">Phone Number</label>                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handlePhoneInput}
                              onFocus={() => handleFocus("phone")}
                              onBlur={handleBlur}
                              className={`w-full px-3 py-2.5 border rounded-lg transition-all duration-300 ${
                                errors.phone ? 'border-red-500' :
                                focusedInput === "phone" ? 'border-green-500 ring-2 ring-green-500 ring-opacity-50' : 'border-gray-300'
                              } bg-white bg-opacity-80 text-gray-900`}
                              placeholder="Enter your phone number"
                              pattern="^\+?\d{10,15}$"
                              inputMode="tel"
                            />
                            <motion.div
                              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-green-500 to-blue-500"
                              initial={{ width: "0%" }}
                              animate={{ width: focusedInput === "phone" ? "100%" : "0%" }}
                              transition={{ duration: 0.3 }}
                            />
                            {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                          </div>
                        </motion.div>                        <motion.div
                          variants={inputVariants}
                          initial="hidden"
                          animate="visible"
                          custom={2}
                        >
                          <div className="px-6">
                            <label className="block text-sm font-medium text-white mb-2">Password</label>
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition pr-12 ${
                                  errors.password ? 'border-red-500' : 'border-gray-300'
                                } bg-white bg-opacity-80 text-gray-900`}
                                placeholder="Enter your password"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white"
                              >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                              </button>
                            </div>
                            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
                          </div>
                        </motion.div>                        <motion.div
                          variants={inputVariants}
                          initial="hidden"
                          animate="visible"
                          custom={3}
                        >
                          <div className="px-6">
                            <label className="block text-sm font-medium text-white mb-2">Confirm Password</label>
                            <div className="relative">
                              <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition pr-12 ${
                                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                } bg-white bg-opacity-80 text-gray-900`}
                                placeholder="Confirm your password"
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white"
                              >
                                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                              </button>
                            </div>
                            {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
                          </div>
                        </motion.div>                        
                        {/* ########## START: BUTTON FIX ########## */}
                        <div className="px-6 mt-auto">
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isLoading ? (
                              <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Creating account...
                              </div>
                            ) : 'Create Account'}
                          </button>
                        </div>
                        {/* ########## END: BUTTON FIX ########## */}

                        {/* Toggle Mode */}
                        <div className="mt-4 text-center px-6">
                          <p className="text-sm text-white">
                            Already have an account?{' '}
                            <button
                              type="button"
                              onClick={toggleMode}
                              className="text-green-200 hover:text-green-100 font-medium"
                            >
                              Sign in
                            </button>
                          </p>
                        </div>
                      </form>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}