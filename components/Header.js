"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCarLoading } from './CarLoading';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const { startLoading, CarLoadingScreen } = useCarLoading();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [bgOpacity, setBgOpacity] = useState(0);
  const [showWhiteFade, setShowWhiteFade] = useState(false);

  const isCarFindingPage = pathname?.includes('/finding_car');

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Chỉ thêm scroll listener nếu không phải trang finding_car
    if (!isCarFindingPage) {
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (!isCarFindingPage) {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, [isCarFindingPage]);

  const handleNavigation = (href) => {
    setFadeOut(true);
    setShowMobileMenu(false); // Close mobile menu on navigation
    setTimeout(() => {
      if (href.startsWith("/")) {
        router.push(href);
      } else {
        window.location.href = href;
      }
    }, 100);
  };

  const handleSignInClick = (e) => {
    e.preventDefault();
    startLoading();
  };

  const handleLoadingComplete = () => {
    router.push("/signin_registration");
  };

  useEffect(() => {
    let timeoutId;
    const handleScroll = () => {
      const scrollValue = window.scrollY;
      const targetOpacity = scrollValue > 50 ? 0.9 : scrollValue > 5 ? (scrollValue - 5) / 45 * 0.9 : 0;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setBgOpacity(targetOpacity);
      }, 7);
      setScrollY(scrollValue);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  const fadeVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.1, ease: "easeOut" },
    },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -10 },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto" },
    exit: { opacity: 0, height: 0 },
  };

  const user = session?.user;

  return (
    <>
      {/* White fade overlay */}
      <AnimatePresence>
        {showWhiteFade && (
          <motion.div
            className="fixed top-0 left-0 w-full h-full bg-white z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>

      <motion.header
        variants={fadeVariant}
        initial="hidden"
        animate="visible"
        className="fixed top-0 left-0 w-full z-30 text-white"
        style={{
          backgroundColor: isCarFindingPage
            ? "rgba(17, 24, 39, 0.95)"
            : scrollY > 50
              ? "rgba(17, 24, 39, 0.9)"
              : "rgba(17, 24, 39, " + bgOpacity + ")",
          opacity: isCarFindingPage ? 1 : scrollY > 5 ? Math.max(1 - (scrollY - 5) / 5, 0) : 1,
          transition: isCarFindingPage
            ? "none"
            : "background-color 0.5s cubic-bezier(0.4,0,0.2,1)",
          backdropFilter: isCarFindingPage ? "blur(10px)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          {/* Main header content */}
          <div className="py-3 sm:py-4 flex items-center justify-between">
            {/* Left side - Logo and Navigation */}
            <div className="flex items-center">
              <button onClick={() => handleNavigation("/")} className="flex items-center group">
                <motion.img
                  src="/logo/logo.png"
                  alt="Logo"
                  className="h-8 sm:h-10 lg:h-12 w-auto object-contain"
                  whileHover={{ scale: 0.96 }}
                  whileTap={{ scale: 0.92 }}
                />
              </button>

              {/* Desktop Navigation - Next to logo */}
              <nav className="hidden md:flex gap-4 lg:gap-6 font-medium text-sm lg:text-base ml-6 lg:ml-8">
                <button onClick={() => handleNavigation("./")} className="hover:text-green-400 transition-colors">
                  Home
                </button>
                <button onClick={() => handleNavigation("/#news")} className="hover:text-green-400 transition-colors">
                  News
                </button>
                <button
                  onClick={() => {
                    setShowWhiteFade(true);
                    setTimeout(() => {
                      handleNavigation("/about_us");
                    }, 200); // Reduced timeout for smoother transition
                    setTimeout(() => {
                      setShowWhiteFade(false);
                    }, 600); // Reset after navigation
                  }}
                  className="hover:text-green-400 transition-colors"
                >
                  About Us
                </button>
              </nav>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mobile menu button - Only show when not logged in or on smaller screens */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* User section */}
              {user ? (
                <div className="relative">
                  <motion.div
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 cursor-pointer p-1 rounded-lg transition-all duration-200 group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }} // Pressing down effect
                  >
                    <div className="relative">
                      <img
                        src={user.avatar || "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"}
                        className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full border-2 border-green-400 object-cover flex-shrink-0"
                        alt="avatar"
                      />
                    </div>
                    <div className="hidden sm:block text-white text-xs sm:text-sm min-w-0 transition-colors duration-200 group-hover:text-green-400">
                      <div className="truncate max-w-24 lg:max-w-32 font-medium">
                        {user.name || "User"}
                      </div>
                      {user.phone && (
                        <div className="text-xs text-gray-300 truncate max-w-24 lg:max-w-32 group-hover:text-green-200">
                          {user.phone}
                        </div>
                      )}
                    </div>
                    <i className="fas fa-chevron-down text-xs text-white hidden sm:block flex-shrink-0 transition-colors duration-200 group-hover:text-green-400" />
                  </motion.div>
                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div
                        className="absolute right-0 mt-2 z-50 bg-white rounded-lg shadow-lg w-44 sm:w-48"
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <ul className="py-2 text-sm text-gray-700">
                          <li><a href="/user_dashboard" className="block px-4 py-2 hover:bg-gray-100 transition-colors">My Dashboard</a></li>
                          <li><a href="#" className="block px-4 py-2 hover:bg-gray-100 transition-colors">My Bookings</a></li>
                          <li><a href="#" className="block px-4 py-2 hover:bg-gray-100 transition-colors">Settings</a></li>
                        </ul>
                        <div className="py-1 border-t border-gray-100">
                          <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <i className="fas fa-sign-out-alt mr-2"></i> Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.button
                  onClick={handleSignInClick}
                  className="px-3 py-2 sm:px-4 text-xs sm:text-sm border border-green-400 rounded-lg hover:bg-green-400 hover:text-black transition-colors flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                >
                  Sign in
                </motion.button>
              )}
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <AnimatePresence>
            {showMobileMenu && (
              <motion.div
                className="md:hidden border-t border-white border-opacity-20"
                variants={mobileMenuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2 }}
              >
                <nav className="py-4 space-y-2">
                  <button 
                    onClick={() => handleNavigation("./")} 
                    className="block w-full text-left px-4 py-3 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
                  >
                    Home
                  </button>
                  <button 
                    onClick={() => handleNavigation("/#renting")} 
                    className="block w-full text-left px-4 py-3 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
                  >
                    Cars
                  </button>
                  <button 
                    onClick={() => handleNavigation("/#gallery")} 
                    className="block w-full text-left px-4 py-3 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
                  >
                    Gallery
                  </button>
                  <button 
                    onClick={() => handleNavigation("/#about")} 
                    className="block w-full text-left px-4 py-3 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
                  >
                    News
                  </button>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>
      <CarLoadingScreen onComplete={handleLoadingComplete} />
    </>
  );
}