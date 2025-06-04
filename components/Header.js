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
  const [scrollY, setScrollY] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [bgOpacity, setBgOpacity] = useState(0); // Thêm dòng này

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
    setTimeout(() => {
      if (href.startsWith("/")) {
        router.push(href);
      } else {
        window.location.href = href;
      }
    }, 100); // Delay to allow fade out effect
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
      // Calculate target opacity based on scroll position
      const targetOpacity = scrollValue > 50 ? 0.9 : scrollValue > 5 ? (scrollValue - 5) / 45 * 0.9 : 0;
      // Add a small delay before updating opacity
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setBgOpacity(targetOpacity);
      }, 7); // 120ms delay for smoothness
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

  const user = session?.user;

  return (
    <>
      {/* Remove the black fade out overlay */}
      {/* <div className={`fixed inset-0 bg-black z-50 transition-opacity duration-200 pointer-events-none ${fadeOut ? "opacity-100" : "opacity-0"}`} /> */}
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
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center gap-8">
            <button onClick={() => handleNavigation("/")} className="flex items-center group">
              <motion.img
                src="/logo/logo.png"
                alt="Logo"
                className="h-12"
                whileHover={{ scale: 0.96 }}
                whileTap={{ scale: 0.92 }}
              />
            </button>
            <nav className="flex gap-6 font-medium">
              <button onClick={() => handleNavigation("./")} className="hover:text-green-400">Home</button>
              <button onClick={() => handleNavigation("/#renting")} className="hover:text-green-400">Cars</button>
              <button onClick={() => handleNavigation("/#gallery")} className="hover:text-green-400">Gallery</button>
              <button onClick={() => handleNavigation("/#about")} className="hover:text-green-400">News</button>
              <button 
  onClick={() => handleNavigation("/about_us")} 
  className="hover:text-green-400"
>
  About Us
</button>

            </nav>
          </div>

          {/* Right side */}
          <div className="relative">
            {user ? (
              <div className="relative">
                <motion.div
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                >
                  <img
                    src={user.avatar || "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"}
                    className="w-10 h-10 rounded-full border-2 border-green-400 object-cover"
                    alt="avatar"
                  />
                  <div className="hidden md:block text-white text-sm">
                    <div>{user.name || "User"}</div>
                    <div className="text-xs text-gray-300">{user.phone || ""}</div>
                  </div>
                  <i className="fas fa-chevron-down text-xs text-white hidden md:block" />
                </motion.div>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      className="absolute right-0 mt-2 z-50 bg-white rounded-lg shadow-lg w-48"
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <ul className="py-2 text-sm text-gray-700">
                        <li><a href="/user_dashboard" className="block px-4 py-2 hover:bg-gray-100">My Dashboard</a></li>
                        <li><a href="#" className="block px-4 py-2 hover:bg-gray-100">My Bookings</a></li>
                        <li><a href="#" className="block px-4 py-2 hover:bg-gray-100">Settings</a></li>
                      </ul>
                      <div className="py-1">
                        <button
                          onClick={() => signOut({ callbackUrl: "/" })}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
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
                className="px-4 py-2 border border-green-400 rounded-lg hover:bg-green-400 hover:text-black"
                whileHover={{ scale: 1.05 }}
              >
                Sign in
              </motion.button>
            )}
          </div>
        </div>
      </motion.header>
      <CarLoadingScreen onComplete={handleLoadingComplete} />
    </>
  );
}
