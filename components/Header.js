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
    }, 200);
  };

  const handleSignInClick = (e) => {
    e.preventDefault();
    startLoading();
  };

  const handleLoadingComplete = () => {
    router.push("/signin_registration");
  };

  const fadeVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
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
      <div className={`fixed inset-0 bg-black z-50 transition-opacity duration-200 pointer-events-none ${fadeOut ? "opacity-100" : "opacity-0"}`} />
      <motion.header
        variants={fadeVariant}
        initial="hidden"
        animate="visible"
        className="fixed top-0 left-0 w-full z-30 text-white"
        style={{
          // Nếu ở trang finding_car thì luôn có background cố định
          backgroundColor: isCarFindingPage
            ? "rgba(17, 24, 39, 0.95)"
            : scrollY > 50 ? "rgba(17, 24, 39, 0.9)" : "transparent",
          // Nếu ở trang finding_car thì luôn opacity là 1, không có hiệu ứng fade
          opacity: isCarFindingPage ? 1 : scrollY > 5 ? Math.max(1 - (scrollY - 5) / 5, 0) : 1,
          // Không có transition cho trang finding_car
          transition: isCarFindingPage ? "none" : "all 0.3s ease",
          // Thêm backdrop-filter để header rõ ràng hơn trên trang finding_car
          backdropFilter: isCarFindingPage ? "blur(10px)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center gap-8">
            <button onClick={() => handleNavigation("/")} className="flex items-center group">
              <img src="/logo/logo.png" alt="Logo" className="h-12" />
              <span className="ml-2 text-2xl font-bold group-hover:text-green-400">Whale Xe</span>
            </button>
            <nav className="flex gap-6 font-medium">
              <button onClick={() => handleNavigation("/")} className="hover:text-green-400">Home</button>
              <button onClick={() => handleNavigation("/#renting")} className="hover:text-green-400">Cars</button>
              <button onClick={() => handleNavigation("/#gallery")} className="hover:text-green-400">Gallery</button>
              <button onClick={() => handleNavigation("/#about")} className="hover:text-green-400">News</button>
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
                        <li><a href="/user_profile" className="block px-4 py-2 hover:bg-gray-100">My Profile</a></li>
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
        <CarLoadingScreen onComplete={handleLoadingComplete} />
      </motion.header>
    </>
  );
}
