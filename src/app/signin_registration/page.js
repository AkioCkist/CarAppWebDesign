"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from 'next/image';
import { motion } from "framer-motion";

export default function LoginPage() {
  const [scrollY, setScrollY] = useState(0);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [flipDirection, setFlipDirection] = useState('horizontal');

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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
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
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    alert(isLogin ? 'Login successful!' : 'Account created successfully!');
  };

  const handleSocialLogin = (provider) => {
    alert(`${provider} login clicked`);
  };

  const toggleMode = () => {
    // Randomly choose flip direction with each toggle
    setFlipDirection(Math.random() > 0.5 ? 'horizontal' : 'vertical');
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      rememberMe: false
    });
    setErrors({});
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

  return (
    <div className="font-sans bg-black text-gray-900 min-h-screen">
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
              <img src="/logo/logo.png" alt="Whale Xe" className="h-8" />
              <span className="text-2xl font-bold text-white ml-2">Whale Xe</span>
            </a>
          </div>

          <nav className="flex items-center gap-6 text-base font-medium">
            <a href="#" className="text-white hover:text-green-400 transition">Home</a>
            <a href="#" className="text-white hover:text-green-400 transition">Cars</a>
            <a href="#" className="text-white hover:text-green-400 transition flex items-center gap-1">
              Booking <i className="fas fa-chevron-down text-xs"></i>
            </a>
            <a href="#" className="text-white hover:text-green-400 transition flex items-center gap-1">
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
      <section className="pt-32 pb-16 min-h-screen flex items-center justify-center relative">
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
        />
        
        <div className="relative z-10 w-full max-w-md mx-auto px-4">
          {/* Card container with perspective for 3D effect */}
          <div className="w-full perspective-1000">
            {/* Flippable card */}
            <motion.div
              custom={flipDirection}
              variants={cardVariants}
              initial="front"
              animate={isLogin ? "front" : "back"}
              className="w-full h-full relative preserve-3d"
              style={{ 
                transformStyle: "preserve-3d",
                minHeight: "800px" // Increased minimum height to fit all content
              }}
            >
              {/* Front side (Login) */}
              <motion.div
                className="absolute w-full h-full backface-hidden rounded-2xl shadow-2xl p-8 bg-white/10 backdrop-blur-xl border border-white/30"
                style={{
                  backfaceVisibility: "hidden",
                  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                  background: "rgba(255,255,255,0.10)",
                  backdropFilter: "blur(18px)",
                  WebkitBackdropFilter: "blur(18px)",
                  borderRadius: "1rem",
                  border: "1px solid rgba(255,255,255,0.3)",
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
                >
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                      {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-white">
                      {isLogin ? 'Sign in to your account to continue' : 'Join us for the best car rental experience'}
                    </p>
                  </div>

                  {/* Form with extended bottom padding */}
                  <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
                    {!isLogin && (
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                            errors.name ? 'border-red-500' : 'border-gray-300'
                          } bg-white bg-opacity-80 text-gray-900`}
                          placeholder="Enter your full name"
                        />
                        {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                      </div>
                      )
                    }

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        } bg-white bg-opacity-80 text-gray-900`}
                        placeholder="Enter your email"
                      />
                      {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition pr-12 ${
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

                    {!isLogin && (
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Confirm Password</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition pr-12 ${
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
                    )}

                    {isLogin && (
                      <div className="flex items-center justify-between">
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

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          {isLogin ? 'Signing in...' : 'Creating account...'}
                        </div>
                      ) : (
                        isLogin ? 'Sign In' : 'Create Account'
                      )}
                    </button>
                    
                    {/* Divider */}
                    <div className="mt-6 mb-6">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-black bg-opacity-60 text-white">Or continue with</span>
                        </div>
                      </div>
                    </div>

                    {/* Social Login */}
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleSocialLogin('Google')}
                        className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span className="text-sm font-medium text-white">Google</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => handleSocialLogin('Facebook')}
                        className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        <span className="text-sm font-medium text-white">Facebook</span>
                      </button>
                    </div>

                    {/* Toggle Mode - kept at bottom */}
                    <div className="mt-6 text-center">
                      <p className="text-sm text-white">
                        Don't have an account?
                        <button
                          type="button"
                          onClick={toggleMode}
                          className="ml-1 text-green-200 hover:text-green-100 font-medium"
                        >
                          Sign up
                        </button>
                      </p>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
              
              {/* Back side (Register) */}
              <motion.div
                className="absolute w-full h-full backface-hidden rotateY-180 rounded-2xl shadow-2xl p-8 bg-white/10 backdrop-blur-xl border border-white/30"
                style={{
                  backfaceVisibility: "hidden",
                  transform: flipDirection === 'horizontal' ? 'rotateY(180deg)' : 'rotateX(180deg)',
                  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                  background: "rgba(255,255,255,0.10)",
                  backdropFilter: "blur(18px)",
                  WebkitBackdropFilter: "blur(18px)",
                  borderRadius: "1rem",
                  border: "1px solid rgba(255,255,255,0.3)",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                {/* Content wrapper with animation */}
                <motion.div 
                  className="flex-1 flex flex-col"
                  initial="hidden"
                  animate={isLogin ? "hidden" : "visible"}
                  variants={contentVariants}
                >
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                      Create Account
                    </h2>
                    <p className="text-white">
                      Join us for the best car rental experience
                    </p>
                  </div>

                  {/* Form with consistent height */}
                  <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        } bg-white bg-opacity-80 text-gray-900`}
                        placeholder="Enter your full name"
                      />
                      {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        } bg-white bg-opacity-80 text-gray-900`}
                        placeholder="Enter your email"
                      />
                      {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition pr-12 ${
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

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Confirm Password</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition pr-12 ${
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

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Creating account...
                        </div>
                      ) : 'Create Account'}
                    </button>
                    
                    {/* Toggle Mode - kept at bottom */}
                    <div className="mt-6 text-center">
                      <p className="text-sm text-white">
                        Already have an account?
                        <button
                          type="button"
                          onClick={toggleMode}
                          className="ml-1 text-green-200 hover:text-green-100 font-medium"
                        >
                          Sign in
                        </button>
                      </p>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}