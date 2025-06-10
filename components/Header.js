"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCarLoading } from './CarLoading';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null); // Replace session with user state
  const { startLoading, CarLoadingScreen } = useCarLoading();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [bgOpacity, setBgOpacity] = useState(0);
  const [showWhiteFade, setShowWhiteFade] = useState(false);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  const isCarFindingPage = pathname?.includes('/finding_car');
  const isBookingPage = pathname?.includes('/booking_car');
  const isBookingTicketPage = pathname?.includes('/booking_ticket');
  const isAboutUsPage = pathname?.includes('/about_us'); // Thêm dòng này

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      // Header visibility logic
      if (currentScrollY > 100) { // Only start hiding after scrolling 100px
        if (currentScrollY > prevScrollY && currentScrollY > 200) {
          // Scrolling down and past 200px - hide header
          setIsHeaderVisible(false);
        } else if (currentScrollY < prevScrollY) {
          // Scrolling up - show header
          setIsHeaderVisible(true);
        }
      } else {
        // Near top of page - always show header
        setIsHeaderVisible(true);
      }

      setPrevScrollY(currentScrollY);
    };

    if (!isCarFindingPage) {
      window.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (!isCarFindingPage) {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, [isCarFindingPage, prevScrollY]);

  const handleNavigation = (href) => {
    setFadeOut(true);
    setShowMobileMenu(false);
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
  };  // Check localStorage for user data on mount and set up storage listener
  useEffect(() => {
    const checkUserData = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('user');
        }
      }
    };

    // Check on mount
    checkUserData();

    // Listen for storage changes (for cross-tab updates)
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        if (e.newValue) {
          try {
            setUser(JSON.parse(e.newValue));
          } catch (error) {
            console.error('Error parsing user data from storage event:', error);
          }
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  // Custom logout function
  const handleLogout = () => {
    // Start white fade overlay
    setShowWhiteFade(true);

    // Clear user data
    localStorage.removeItem('user');
    setUser(null);
    setShowDropdown(false);

    // Wait for fade animation to complete, then refresh
    setTimeout(() => {
      window.location.reload();
    }, 800); // 800ms to allow fade animation to complete
  };

  // Handle clicks outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.user-dropdown')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

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
        animate={{
          ...fadeVariant.visible,
          y: isHeaderVisible ? 0 : -100,
          // Nếu là about_us thì luôn opacity 1, không hiệu ứng mờ
          opacity: isCarFindingPage || isBookingPage || isBookingTicketPage || isAboutUsPage
            ? 1
            : scrollY > 5
              ? Math.max(1 - (scrollY - 5) / 5, 0.9)
              : 1,
        }}
        transition={{
          y: { duration: 0.3, ease: "easeInOut" },
          opacity: { duration: 0.3, ease: "easeInOut" },
        }}
        className="fixed top-0 left-0 w-full z-30 text-white"
        style={{
          backgroundColor: isCarFindingPage
            ? "rgba(17, 24, 39, 0.95)"
            : isBookingPage || isBookingTicketPage || isAboutUsPage
              ? "rgba(17, 24, 39, 0.95)" // Luôn nền đậm cho booking, booking_ticket và about_us, không hiệu ứng
              : scrollY > 50
                ? "rgba(17, 24, 39, 0.9)"
                : "rgba(17, 24, 39, " + bgOpacity + ")",
          backdropFilter: isCarFindingPage || isBookingPage || isBookingTicketPage || isAboutUsPage ? "blur(10px)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          {/* Main header content */}
          <div className="py-3 sm:py-4 flex items-center justify-between">
            {/* Left side - Logo and Navigation */}
            <div className="flex items-center">
              <button onClick={() => handleNavigation("/")} className="flex items-center group">
                <motion.img
                  src="/logo/logo.webp"
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
                <button
                  onClick={() => {
                    setShowWhiteFade(true);
                    setTimeout(() => {
                      handleNavigation("/about_us");
                    }, 200);
                    setTimeout(() => {
                      setShowWhiteFade(false);
                    }, 600);
                  }}
                  className="hover:text-green-400 transition-colors"
                >
                  About Us
                </button>
              </nav>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mobile menu button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* User section */}              {user ? (
                <div className="relative user-dropdown">
                  <motion.div
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 cursor-pointer p-1 rounded-lg transition-all duration-200 group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                  >                    <div className="relative">
                      <img
                        src={user.avatar || "/avatar/default_avatar.jpg"}
                        className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full border-2 border-green-400 object-cover flex-shrink-0"
                        alt="User avatar"
                        onError={(e) => {
                          e.target.src = "/avatar/default_avatar.jpg";
                        }}
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
                      {user.roles && user.roles.length > 0 && (
                        <div className="text-xs text-green-300 truncate max-w-24 lg:max-w-32">
                          {user.roles[0].name}
                        </div>
                      )}
                    </div>
                    <i className="fas fa-chevron-down text-xs text-white hidden sm:block flex-shrink-0 transition-colors duration-200 group-hover:text-green-400" />
                  </motion.div>
                  <AnimatePresence>
                    {showDropdown && (<motion.div
                      className="absolute right-0 mt-2 z-50 bg-white rounded-lg shadow-lg w-48 sm:w-52"
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >                        {/* User info section */}
                      <div className="px-4 py-3 border-b border-gray-100">                          <div className="flex items-center gap-3">
                        <img
                          src={user.avatar || "/avatar/default_avatar.jpg"}
                          className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                          alt="User avatar"
                          onError={(e) => {
                            e.target.src = "/avatar/default_avatar.jpg";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {user.name || "User"}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {user.phone}
                          </div>
                          {user.roles && user.roles.length > 0 && (
                            <div className="text-xs text-green-600 font-medium capitalize">
                              {user.roles[0].name}
                            </div>
                          )}
                          {user.id && (
                            <div className="text-xs text-gray-400">
                              ID: {user.id}
                            </div>
                          )}
                        </div>
                      </div>
                      </div>

                      {/* Menu items */}
                      <ul className="py-2 text-sm text-gray-700">
                        <li><a href="/user_dashboard" className="px-4 py-2 hover:bg-gray-100 transition-colors flex items-center gap-2">
                          <i className="fas fa-tachometer-alt w-4"></i> My Dashboard
                        </a></li>
                      </ul>
                      <div className="py-1 border-t border-gray-100">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                        >
                          <i className="fas fa-sign-out-alt w-4"></i> Sign out
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