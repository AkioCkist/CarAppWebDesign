"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCarLoading } from './CarLoading';

export default function Header() {
    const [scrollY, setScrollY] = useState(0);
    const [fadeOut, setFadeOut] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const [showDropdown, setShowDropdown] = useState(false);
    const { startLoading, CarLoadingScreen } = useCarLoading();
    const router = useRouter();

    // Check if user is logged in on component mount
    useEffect(() => {
        const checkLoginStatus = () => {
            const cookies = document.cookie.split(';').reduce((acc, cookie) => {
                const [key, value] = cookie.trim().split('=');
                acc[key] = value;
                return acc;
            }, {});

            if (cookies.is_logged_in === 'true') {
                setIsLoggedIn(true);
                setUserInfo({
                    name: cookies.user_name || 'User',
                    phone: cookies.user_phone || '',
                    avatar: cookies.user_avatar || '/default-avatar.png'
                });
            }
        };

        checkLoginStatus();
    }, []);

    const handleNavigation = (href) => {
        setFadeOut(true);
        setTimeout(() => {
            if (href.startsWith("/")) {
                router.push(href);
            } else {
                window.location.href = href;
            }
        }, 200);
    };

    const handleSignInClick = (e) => {
        e.preventDefault();
        startLoading();
    };

    const handleLoadingComplete = () => {
        router.push("/signin_registration");
    };

    // Add this function to clear all account-related cookies (call on timeout or logout)
    function clearAccountCookies() {
      document.cookie = 'user_id=; path=/; max-age=0';
      document.cookie = 'user_name=; path=/; max-age=0';
      document.cookie = 'user_phone=; path=/; max-age=0';
      document.cookie = 'user_avatar=; path=/; max-age=0';
      document.cookie = 'is_logged_in=; path=/; max-age=0';
    }

    const handleLogout = () => {
        clearAccountCookies();
        setIsLoggedIn(false);
        setUserInfo({});
        setShowDropdown(false);
        
        // Refresh page or redirect to home
        window.location.reload();
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const fadeVariant = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                delay: 0,
                duration: 0.7,
                ease: "easeOut",
            },
        },
    };

    // Animation variants for dropdown
    const dropdownVariants = {
        hidden: {
            opacity: 0,
            scale: 0.95,
            y: -10,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            y: -10,
            transition: {
                duration: 0.2,
                ease: "easeIn"
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: (i) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: i * 0.05,
                duration: 0.2,
                ease: "easeOut"
            }
        })
    };

    return (
        <>
            <div
                className={`fixed inset-0 bg-black z-50 transition-opacity duration-200 pointer-events-none ${fadeOut ? "opacity-100" : "opacity-0"
                    }`}
            />
            <motion.header
                variants={fadeVariant}
                initial="hidden"
                animate="visible"
                className="fixed top-0 left-0 w-full z-30 text-white transition-opacity duration-300"
                style={{
                    opacity: scrollY > 5 ? Math.max(1 - (scrollY - 5) / 5, 0) : 1,
                    backgroundColor: scrollY > 50 ? "rgba(17, 24, 39, 0.9)" : "transparent",
                    transition: "background-color 0.3s ease, opacity 0.3s ease",
                }}
            >
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between py-4 transition-all duration-300">
                        {/* Left side - Logo and Navigation */}
                        <div className="flex items-center gap-8">
                            {/* Logo */}
                            <button
                                onClick={() => handleNavigation("../")}
                                className="flex items-center group transition-transform duration-200 hover:scale-105"
                            >
                                <img
                                    src="/logo/logo.png"
                                    alt="Whale Xe"
                                    className="h-8 transition-all duration-200 group-hover:brightness-110"
                                />
                                <span className="text-2xl font-bold text-white ml-2 transition-all duration-200 group-hover:text-green-400">
                                    Whale Xe
                                </span>
                            </button>
                            
                            {/* Navigation */}
                            <nav className="flex items-center gap-6 text-base font-medium">
                                <button
                                    onClick={() => handleNavigation("../")}
                                    className="text-white hover:text-green-400 transition-all duration-200 relative group"
                                >
                                    Home
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-200 group-hover:w-full"></span>
                                </button>
                                <button
                                    onClick={() => handleNavigation("")}
                                    className="text-white hover:text-green-400 transition-all duration-200 relative group"
                                >
                                    Cars
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-200 group-hover:w-full"></span>
                                </button>
                                <button
                                    onClick={() => handleNavigation("")}
                                    className="text-white hover:text-green-400 transition-all duration-200 relative group"
                                >
                                    Gallery
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-200 group-hover:w-full"></span>
                                </button>
                                <button
                                    onClick={() => handleNavigation("")}
                                    className="text-white hover:text-green-400 transition-all duration-200 relative group flex items-center gap-1"
                                >
                                    News
                                    <i className="fas fa-chevron-down text-xs transition-transform duration-200 group-hover:rotate-180"></i>
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-200 group-hover:w-full"></span>
                                </button>
                            </nav>
                        </div>

                        {/* Right side - Sign In Button or User Avatar */}
                        <div className="flex items-center relative">
                            {isLoggedIn ? (
                                <div className="relative">
                                    {/* Avatar Button with Text */}
                                    <motion.div
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        className="flex items-center gap-3 cursor-pointer group"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <motion.img
                                            id="avatarButton"
                                            className="w-10 h-10 rounded-full border-2 border-green-400 object-cover"
                                            src={userInfo.avatar}
                                            alt="User avatar"
                                            whileHover={{ scale: 1.05 }}
                                            onError={e => {
                                                e.target.onerror = null;
                                                e.target.src = "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_items_boosted&w=740";
                                            }}
                                        />
                                        <motion.div 
                                            className="font-medium text-white hidden md:block"
                                            animate={{ 
                                                opacity: showDropdown ? 0.7 : 1,
                                                x: showDropdown ? -5 : 0 
                                            }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div className="group-hover:text-green-400 transition-colors duration-200">
                                                {userInfo.name}
                                            </div>
                                            <div className="text-sm text-gray-300 group-hover:text-green-300 transition-colors duration-200">
                                                {userInfo.phone}
                                            </div>
                                        </motion.div>
                                        <motion.i 
                                            className="fas fa-chevron-down text-xs text-white ml-1 hidden md:block"
                                            animate={{ 
                                                rotate: showDropdown ? 180 : 0,
                                                opacity: showDropdown ? 0.7 : 1 
                                            }}
                                            transition={{ duration: 0.2 }}
                                        />
                                    </motion.div>

                                    {/* Animated Dropdown menu */}
                                    <AnimatePresence>
                                        {showDropdown && (
                                            <motion.div
                                                id="userDropdown"
                                                className="absolute right-0 mt-2 z-50 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-48 overflow-hidden"
                                                variants={dropdownVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                            >
                                                {/* Menu Items */}
                                                <ul className="py-2 text-sm text-gray-700" aria-labelledby="avatarButton">
                                                    <motion.li
                                                        variants={itemVariants}
                                                        initial="hidden"
                                                        animate="visible"
                                                        custom={1}
                                                    >
                                                        <a 
                                                            href="#" 
                                                            className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors duration-150"
                                                        >
                                                            <i className="fas fa-tachometer-alt mr-3 text-gray-500"></i>
                                                            Dashboard
                                                        </a>
                                                    </motion.li>
                                                    <motion.li
                                                        variants={itemVariants}
                                                        initial="hidden"
                                                        animate="visible"
                                                        custom={2}
                                                    >
                                                        <a 
                                                            href="#" 
                                                            className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors duration-150"
                                                        >
                                                            <i className="fas fa-cog mr-3 text-gray-500"></i>
                                                            Settings
                                                        </a>
                                                    </motion.li>
                                                    <motion.li
                                                        variants={itemVariants}
                                                        initial="hidden"
                                                        animate="visible"
                                                        custom={3}
                                                    >
                                                        <a 
                                                            href="#" 
                                                            className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors duration-150"
                                                        >
                                                            <i className="fas fa-car mr-3 text-gray-500"></i>
                                                            My Bookings
                                                        </a>
                                                    </motion.li>
                                                </ul>

                                                {/* Sign Out Button */}
                                                <motion.div 
                                                    className="py-1"
                                                    variants={itemVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    custom={4}
                                                >
                                                    <button
                                                        onClick={handleLogout}
                                                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                                                    >
                                                        <i className="fas fa-sign-out-alt mr-3"></i>
                                                        Sign out
                                                    </button>
                                                </motion.div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <motion.button
                                    onClick={handleSignInClick}
                                    className="px-4 py-2 text-white border border-green-400 rounded-lg hover:bg-green-400 hover:text-black transition-all duration-200 font-medium"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Sign in
                                </motion.button>
                            )}
                        </div>
                    </div>
                    <CarLoadingScreen onComplete={handleLoadingComplete} />
                </div>
            </motion.header>
        </>
    );
}