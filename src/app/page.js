"use client";
import { useState, useEffect } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCarLoading } from '../../components/CarLoading';
import SimpleFaqSection from '../../components/SimpleFaqSection';
import VehicleList from "../../components/VehicleList";
import vehicles from "../../lib/seed";


const vehicleTypes = [
  "Sedan",
  "SUV",
  "Electric",
  "Luxury",
];

const features = [
  {
    icon: "/icons/trophy.svg",
    title: "First class services",
    desc: "Where luxury meets exceptional care, creating unforgettable moments and exceeding your every expectation.",
  },
  {
    icon: "/icons/road.svg",
    title: "24/7 road assistance",
    desc: "Reliable support when you need it most, keeping you on the move with confidence and peace of mind.",
  },
  {
    icon: "/icons/tag.svg",
    title: "Quality at Minimum Expense",
    desc: "Unlocking affordable brilliance with elevating quality while minimizing costs for maximum value.",
  },
  {
    icon: "/icons/pin.svg",
    title: "Free Pick-Up & Drop-Off",
    desc: "Enjoy free pickup and drop-off services, adding an extra layer of ease to your car rental experience.",
  },
];

const news = [
  {
    image: "https://www.hertz.com/content/dam/hertz/global/blog-articles/automotive/how-to-pick-a-rental-car-for-your-next-trip/Evening-drive.jpg",
    title: "How to Pick the Right Rental Car for Your Next Trip",
    snippet: "Whether you’re going on vacation, exploring the unknown, or traveling for business purposes, picking the perfect rental car is key to planning a smooth and pleasant journey.",
    link: "https://www.hertz.com/us/en/blog/automotive/how-to-pick-a-rental-car-for-your-next-trip",
  },
  {
    image: "https://energycentral.com/sites/default/files/styles/article_body/public/ece/node_main/2024/10/energycentral-carrentalimage.png?itok=JnrJQWuu",
    title: "Electric Vehicles and the Future of Car Rentals",
    snippet: "EVs are changing car rentals with lower costs and eco benefits. Companies are growing EV fleets and adapting to charging needs.",
    link: "https://energycentral.com/c/cp/electric-vehicles-and-future-car-rentals",
  },
  {
    image: "https://www.hertz.com/content/dam/hertz/global/blog-articles/automotive/how-ww2-changed-the-automative-industry/Traffic-in-NY-1943---header.jpg",
    title: "Life During Wartime: How World War II Changed the Auto Industry",
    snippet: "During WWII, U.S. car makers stopped civilian production to build military gear, leading to major tech advances and postwar auto growth.",
    link: "https://www.hertz.com/us/en/blog/automotive/life-during-wartime-how-world-war-ii-changed-the-auto-industry",
  },
];

// Notification Dot Components
const NotificationDot = ({ children, color = "bg-red-500", delay = 0 }) => (
  <motion.div
    animate={{
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut",
      delay: delay
    }}
    className={`w-5 h-5 ${color} rounded-full border-2 border-white flex items-center justify-center shadow-lg`}
  >
    <span className="text-white text-xs font-bold">{children}</span>
  </motion.div>
);

export default function HomePage() {
  const [sameLocation, setSameLocation] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  // Add states for chat bubbles
  const [showPhoneBubble, setShowPhoneBubble] = useState(false);
  const [showEmailBubble, setShowEmailBubble] = useState(false);
  const { isLoading, startLoading, CarLoadingScreen } = useCarLoading();
  const [form, setForm] = useState({
    vehicleType: vehicleTypes[0],
    pickUp: "",
    dropOff: "",
    pickUpDate: "",
    pickUpTime: "",
    dropOffDate: "",
    dropOffTime: "",
  });
  const [fadeIn, setFadeIn] = useState(false);
  const router = useRouter();

  // Updated handleNavigation function with faster transition
  const handleNavigation = (href) => {
    setFadeOut(true);
    setTimeout(() => {
      if (href.startsWith('/')) {
        router.push(href);
      } else {
        window.location.href = href;
      }
    }, 200); // Reduced from 500ms to 200ms for faster transition
  };

  useEffect(() => {
    setFadeIn(true);

    // Listen for route changes to trigger fade out
    const handleRouteChangeStart = () => setFadeIn(false);
    router.events?.on?.("routeChangeStart", handleRouteChangeStart);

    return () => {
      router.events?.off?.("routeChangeStart", handleRouteChangeStart);
    };
  }, [router]);

  const handleSignInClick = (e) => {
    e.preventDefault(); // Ngăn không cho link navigate ngay lập tức
    startLoading(); // Bắt đầu animation loading
  };
  const handleLoadingComplete = () => {
    // Navigation sang trang signin_registration
    router.push('/signin_registration');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Add event listener
    window.addEventListener("scroll", handleScroll);

    // Remove event listener on cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Empty dependency array means this runs once on mount

  const handleFaqToggle = (idx) => {
    setFaqOpen((prev) =>
      prev.map((open, i) => (i === idx ? !open : open))
    );
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "sameLocation") {
      setSameLocation(checked);
      setForm((f) => ({ ...f, dropOff: checked ? f.pickUp : f.dropOff }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
      if (name === "pickUp" && sameLocation) {
        setForm((f) => ({ ...f, dropOff: value }));
      }
    }
  };

  // Animation variants for staggered fade-in
  const fadeVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.7,
        ease: "easeOut"
      }
    })
  };

  return isLoading ? (
    <CarLoadingScreen onComplete={handleLoadingComplete} />
  ) : (
    <div className="font-sans bg-white text-gray-900">
      {/* Fade out overlay - Updated for faster, seamless transition */}
      <div
        className={`fixed inset-0 bg-black z-50 transition-opacity duration-200 pointer-events-none ${fadeOut ? 'opacity-100' : 'opacity-0'
          }`}/>
      {/* Header - Updated with gradient background transition */}
      <motion.header
        variants={fadeVariant}
        initial="hidden"
        animate="visible"
        custom={0}
        className="fixed top-0 left-0 w-full z-30 text-white transition-opacity duration-300"
        style={{
          opacity: scrollY > 5 ? Math.max(1 - (scrollY - 5) / 5, 0) : 1,
          backgroundColor: scrollY > 50 ? 'rgba(17, 24, 39, 0.9)' : 'transparent',
          transition: 'background-color 0.3s ease, opacity 0.3s ease'
        }}>
        <div className="max-w-7xl mx-auto px-4">
          {/* Main navigation */}
          <div className="flex items-center justify-between py-4 transition-all duration-300">
            <div className="flex items-center gap-2">
              {/* Logo with hover effect */}
              <button
                onClick={() => handleNavigation('../')}
                className="flex items-center group transition-transform duration-200 hover:scale-105">
                <img
                  src="/logo/logo.png"
                  alt="Whale Xe"
                  className="h-8 transition-all duration-200 group-hover:brightness-110"
                />
                <span className="text-2xl font-bold text-white ml-2 transition-all duration-200 group-hover:text-green-400">
                  Whale Xe
                </span>
              </button>
            </div>
            <nav className="flex items-center gap-6 text-base font-medium">
              <button
                onClick={() => handleNavigation('../')}
                className="text-white hover:text-green-400 transition-all duration-200 relative group">
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-200 group-hover:w-full"></span>
              </button>
              <button
                onClick={() => handleNavigation('')}
                className="text-white hover:text-green-400 transition-all duration-200 relative group"              >
                Cars
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-200 group-hover:w-full"></span>
              </button>
              <button
                onClick={() => handleNavigation('')}
                className="text-white hover:text-green-400 transition-all duration-200 relative group flex items-center gap-1"              >
                Booking
                <i className="fas fa-chevron-down text-xs transition-transform duration-200 group-hover:rotate-180"></i>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-200 group-hover:w-full"></span>
              </button>
              <button
                onClick={handleSignInClick}
                className="text-white hover:text-green-400 transition-all duration-200 relative group flex items-center gap-1"              >
                My Account
                <i className="fas fa-chevron-down text-xs transition-transform duration-200 group-hover:rotate-180"></i>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-200 group-hover:w-full"></span>
              </button>
              <button
                onClick={() => handleNavigation('')}
                className="text-white hover:text-green-400 transition-all duration-200 relative group flex items-center gap-1"            >
                Pages
                <i className="fas fa-chevron-down text-xs transition-transform duration-200 group-hover:rotate-180"></i>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-200 group-hover:w-full"></span>
              </button>

              <button
                onClick={() => handleNavigation('')}
                className="text-white hover:text-green-400 transition-all duration-200 relative group">
                Gallery
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-200 group-hover:w-full"></span>
              </button>
              <button
                onClick={() => handleNavigation('')}
                className="text-white hover:text-green-400 transition-all duration-200 relative group flex items-center gap-1">
                News
                <i className="fas fa-chevron-down text-xs transition-transform duration-200 group-hover:rotate-180"></i>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-200 group-hover:w-full"></span>
              </button>
            </nav>
          </div>
          <CarLoadingScreen onComplete={handleLoadingComplete} />
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        variants={fadeVariant}
        initial="hidden"
        animate="visible"
        custom={1}
        className="relative pt-24"
      >
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none"
          style={{
            backgroundImage: "url('/hero/hero.png')",
            filter: "brightness(0.7)",
            top: "-48px", // move image up
            height: "calc(100% + 48px)", // make image taller to cover gap
            width: "100%",
            left: 0,
            zIndex: 0,
            position: "absolute"
          }}
        ></div>

        <div className="relative pt-30 pb-16 px-4"> {/* Reduced pt-20 to pt-16 to maintain spacing */}
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white">
              Whale Xe - More than rentals<br />
              We deliver happiness
            </h1>

            {/* Search Form */}
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-5xl mx-auto mt-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Location Section */}
                <div className="space-y-6">
                  {/* Pick Up Location */}
                  <div className="flex items-center border-b border-gray-200 pb-4">
                    <div className="flex-shrink-0 mr-3">
                      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="block text-left font-bold text-base text-gray-700 mb-1">Pick Up Location</label>
                      <div className="relative">
                        <select
                          className="w-full py-2 pr-8 font-bold text-gray-800 bg-transparent border-0 focus:outline-none appearance-none cursor-pointer"
                          name="pickUpLocation"
                          value={form.pickUpLocation}
                          onChange={handleFormChange}
                        >
                          <option>Select location</option>
                          <option>TP. Hồ Chí Minh</option>
                          <option>Hà Nội</option>
                          <option>Đà Nẵng</option>
                        </select>
                        <svg className="absolute right-0 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Drop Off Location */}
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="block text-left font-bold text-base text-gray-700 mb-1">Drop Off Location</label>
                      <div className="relative">
                        <select
                          className="w-full py-2 pr-8 font-bold text-gray-800 bg-transparent border-0 focus:outline-none appearance-none cursor-pointer"
                          name="dropOffLocation"
                          value={form.dropOffLocation}
                          onChange={handleFormChange}
                        >
                          <option>Same as Pick Up</option>
                          <option>TP. Hồ Chí Minh</option>
                          <option>Hà Nội</option>
                          <option>Đà Nẵng</option>
                        </select>
                        <svg className="absolute right-0 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Date/Time Section */}
                <div className="space-y-6">
                  {/* Pick Up Date & Time */}
                  <div className="flex items-center border-b border-gray-200 pb-4">
                    <div className="flex-shrink-0 mr-3">
                      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="block text-left font-bold text-base text-gray-700 mb-2">Pick Up Date & Time</label>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="relative cursor-pointer" onClick={(e) => e.currentTarget.querySelector('input').showPicker?.()}>
                          <input
                            type="date"
                            className="w-full py-2 px-1 pr-8 text-sm font-bold text-gray-800 bg-transparent border-0 focus:outline-none focus:ring-0 uppercase [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                            name="pickUpDate"
                            value={form.pickUpDate}
                            onChange={handleFormChange}
                          />
                          <svg className="absolute right-1 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
                        <div className="relative cursor-pointer" onClick={(e) => e.currentTarget.querySelector('input').showPicker?.()}>
                          <svg className="absolute left-1 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <input
                            type="time"
                            className="w-full py-2 pl-8 pr-8 text-sm font-bold text-gray-800 bg-transparent border-0 focus:outline-none focus:ring-0 uppercase [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                            name="pickUpTime"
                            value={form.pickUpTime}
                            onChange={handleFormChange}
                          />
                          <svg className="absolute right-1 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Return Date & Time */}
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="block text-left font-bold text-base text-gray-700 mb-2">Return Date & Time</label>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="relative cursor-pointer" onClick={(e) => e.currentTarget.querySelector('input').showPicker?.()}>
                          <input
                            type="date"
                            className="w-full py-2 px-1 pr-8 text-sm font-bold text-gray-800 bg-transparent border-0 focus:outline-none focus:ring-0 uppercase [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                            name="dropOffDate"
                            value={form.dropOffDate}
                            onChange={handleFormChange}
                          />
                          <svg className="absolute right-1 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
                        <div className="relative cursor-pointer" onClick={(e) => e.currentTarget.querySelector('input').showPicker?.()}>
                          <svg className="absolute left-1 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <input
                            type="time"
                            className="w-full py-2 pl-8 pr-8 text-sm font-bold text-gray-800 bg-transparent border-0 focus:outline-none focus:ring-0 uppercase [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                            name="dropOffTime"
                            value={form.dropOffTime}
                            onChange={handleFormChange}
                          />
                          <svg className="absolute right-1 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search Button - Centered below the form */}
              <div className="mt-6 text-center">
                <motion.button
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)"
                  }}
                  whileTap={{
                    scale: 0.98,
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                    y: 40
                  }}
                  className="bg-green-500 text-white font-medium py-3 w-full max-w-md mx-auto rounded-lg hover:bg-green-600 transition duration-200"
                >
                  Search Your Cars
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        variants={fadeVariant}
        initial="hidden"
        animate="visible"
        custom={2}
        id="about"
        className="py-16 bg-white"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-center mb-10">Our Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover a world of convenience, safety, and customization, paving the way for
              unforgettable adventures and seamless mobility solutions.
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center">
            {/* Left and Right Feature Columns */}
            <div className="w-full md:w-1/4 space-y-8 mb-8 md:mb-0">
              {features.slice(0, 2).map((f, i) => (
                <motion.div
                  key={i}
                  className="flex items-start"
                  variants={fadeVariant}
                  custom={i * 0.2} // Stagger animation
                >
                  <div className="flex-shrink-0 mr-4">
                    <Image src={f.icon} alt={f.title} width={48} height={48} className="bg-green-100 p-2 rounded-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{f.title}</h3>
                    <p className="text-gray-600 text-sm">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Car Image - Centered */}
            <div className="w-full md:w-1/2 px-4 flex justify-center mb-8 md:mb-0">
              <motion.div
                variants={fadeVariant}
                custom={0.4} // Animation for car image
              >
                <Image src="/hero/adumatyper.png" alt="Honda Type R" width={600} height={375} className="max-w-full h-auto" />
                {/* Replace with actual car image path */}
              </motion.div>
            </div>

            {/* Right Feature Column */}
            <div className="w-full md:w-1/4 space-y-8">
              {features.slice(2, 4).map((f, i) => (
                <motion.div
                  key={i}
                  className="flex items-start"
                  variants={fadeVariant}
                  custom={(i + 2) * 0.2} // Stagger animation
                >
                  <div className="flex-shrink-0 mr-4">
                    <Image src={f.icon} alt={f.title} width={48} height={48} className="bg-green-100 p-2 rounded-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{f.title}</h3>
                    <p className="text-gray-600 text-sm">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Car Fleet Section */}
      <motion.section
        variants={fadeVariant}
        initial="hidden"
        animate="visible"
        custom={3}
        id="renting"
        className="py-16 bg-gray-50"
      >
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Our Fleet</h2>
          <VehicleList vehicles={vehicles} />
        </div>
      </motion.section>

      {/* News Section */}
      <motion.section
        variants={fadeVariant}
        initial="hidden"
        animate="visible"
        custom={4}
        className="py-16 bg-white"
      >
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Latest News</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.map((n, i) => (
              <motion.div
                key={i}
                whileHover={{
                  scale: 1.03,
                  y: -5
                }}
                transition={{
                  type: "tween",
                  ease: "easeOut",
                  duration: 0.15,
                  stiffness: 300,
                  damping: 10,
                  mass: 0.5
                }}
                className="bg-gray-50 rounded-xl shadow p-4 flex flex-col hover:shadow-lg transition"
              >
                <motion.img
                  whileHover={{ scale: 1.02 }}
                  src={n.image}
                  alt={n.title}
                  className="w-full h-48 object-cover rounded mb-4" // <-- uniform size here
                />
                <h3 className="font-semibold text-lg mb-2">{n.title}</h3>
                <p className="text-gray-600 mb-3">{n.snippet}</p>
                <motion.a
                  whileHover={{ x: 5 }}
                  href={n.link}
                  className="text-blue-600 font-semibold hover:underline mt-auto"
                >
                  Read More
                </motion.a>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        variants={fadeVariant}
        initial="hidden"
        animate="visible"
        custom={5}
        className="py-16 bg-gray-50"
      >
        <div className="max-w-[98vw] xl:max-w-[1170px] mx-auto px-4">
          {/* FAQ Header */}
          <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <SimpleFaqSection />
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        variants={fadeVariant}
        initial="hidden"
        animate="visible"
        custom={6}
        className="text-white py-12 mt-20 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/background/footer/lightleaks.png"
            alt="Footer background"
            layout="fill"
            objectFit="cover"
            quality={100}
            className="opacity-100" />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Logo and About - Takes more space on larger screens */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center mb-4">
                <div className="mr-3">
                  <Image
                    src="/logo/logo.png"
                    alt="Whale Xe Logo"
                    width={40}
                    height={40}
                    className="rounded-full" />
                </div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-cyan-300">
                  Whale Xe
                </h2>
              </div>
              <p className="text-green-100 text-sm leading-relaxed">
                Whale Xe is dedicated to making your car rental experience smooth, affordable, and enjoyable.
                Travel with confidence and comfort.
              </p>
              <div className="flex space-x-3 pt-2">
                {['facebook', 'twitter', 'instagram', 'youtube', 'linkedin'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="text-teal-50 hover:text-white transition-colors duration-300"
                    aria-label={social}>
                    <div className="w-7 h-7 bg-green-600/50 hover:bg-green-500 rounded-full flex items-center justify-center transition-all duration-300">
                      <Image
                        src={`/social-icons/${social}.svg`}
                        alt={social}
                        width={14}
                        height={14}
                        className="w-3.5 h-3.5 object-contain" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center mb-4">
                <span className="w-2.5 h-2.5 bg-green-400 rounded-full mr-2"></span>
                Quick Links
              </h3>
              <ul className="space-y-3">
                {['Home', 'Rentals', 'Services', 'Blog', 'Contact'].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-green-100 hover:text-white transition-colors duration-300 text-sm flex items-center group">
                      <span className="w-1.5 h-1.5 bg-green-300 rounded-full mr-3 group-hover:bg-white transition-colors duration-300"></span>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center mb-4">
                <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full mr-2"></span>
                Contact Us
              </h3>
              <ul className="space-y-4 text-green-100 text-sm">
                <li className="flex items-start">
                  <div className="mt-0.5 mr-3 w-5 h-5 flex items-center justify-center flex-shrink-0">
                    <Image src="/icons/map-marker.webp" alt="Address" width={20} height={20} />
                  </div>
                  <span className="leading-relaxed">158a Lê Lợi, Hải Châu 1, Hải Châu, Đà Nẵng</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-3 w-5 h-5 flex items-center justify-center flex-shrink-0">
                    <Image src="/icons/phone.webp" alt="Phone" width={16} height={16} />
                  </div>
                  <span>+84 0236 3738 399</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-3 w-5 h-5 flex items-center justify-center flex-shrink-0">
                    <Image src="/icons/mail.webp" alt="Email" width={16} height={16} />
                  </div>
                  <span>contact@whalexe.com</span>
                </li>
              </ul>
            </div>
            {/* Newsletter */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center mb-4">
                <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full mr-2"></span>
                Newsletter
              </h3>
              <p className="text-green-100 text-sm leading-relaxed">
                Subscribe to our newsletter for the latest offers and news.
              </p>
              <div className="space-y-3">
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="px-3 py-2.5 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-white-800 flex-1 text-sm border-0 placeholder-white" />
                  <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2.5 rounded-r-lg text-sm font-medium transition-all duration-300 whitespace-nowrap">
                    <i className="fas fa-paper-plane mr-1"></i> Subscribe
                  </button>
                </div>
                <div className="flex items-start">
                  <input type="checkbox" id="terms" className="mt-1 mr-2 accent-green-400" />
                  <label htmlFor="terms" className="text-green-100 text-xs leading-relaxed">
                    I agree to the <a href="#" className="text-green-300 hover:text-white hover:underline transition-colors duration-300">Privacy Policy</a>
                  </label>
                </div>
              </div>
            </div>
          </div>
          {/* Copyright Section */}
          <div className="border-t border-green-400/30 mt-12 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              {/* Copyright Text */}
              <div className="text-green-100 text-sm order-2 lg:order-1">
                © {new Date().getFullYear()} Whale Xe. All rights reserved.
              </div>
              {/* Footer Links */}
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 order-1 lg:order-2">
                <a href="#" className="text-green-100 hover:text-white text-sm transition-colors duration-300">
                  Terms & Conditions
                </a>
                <a href="#" className="text-green-100 hover:text-white text-sm transition-colors duration-300">
                  Privacy Policy
                </a>
                <a href="#" className="text-green-100 hover:text-white text-sm transition-colors duration-300">
                  FAQ
                </a>
              </div>
              {/* Payment Methods */}
              <div className="order-3">
                <div className="flex items-center space-x-3">
                  <span className="text-green-100 text-xs mr-2">We accept:</span>
                  <div className="flex space-x-2">
                    <Image src="/logo/LogoPaymentFooter/visa.png" alt="Visa" width={32} height={20} className="h-5 object-contain" />
                    <Image src="/logo/LogoPaymentFooter/logo-momo-png-4.png" alt="Momo" width={32} height={20} className="h-5 object-contain" />
                    <Image src="/logo/LogoPaymentFooter/paypal.png" alt="Paypal" width={32} height={20} className="h-5 object-contain" />
                    <Image src="/logo/LogoPaymentFooter/deposit.png" alt="Bank Transfer" width={32} height={20} className="h-5 object-contain" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.footer>

      {/* Floating Chat Bubbles */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
        {/* Phone Bubble */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: 0.8
          }}
          className="relative"
        >
          {/* Phone Notification Dot - Positioned above bubble */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 1.0
            }}
            className="absolute -top-2 -right-2 z-10"
          >
            <NotificationDot color="bg-red-500" delay={0}>
              !
            </NotificationDot>
          </motion.div>

          <motion.div
            whileHover={{
              scale: 1.1,
              boxShadow: "0 20px 25px -5px rgba(22, 235, 100, 0.3), 0 10px 10px -5px rgba(34, 197, 94, 0.2)",
              y: -5
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPhoneBubble(!showPhoneBubble)}
            className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-lg cursor-pointer flex items-center justify-center relative overflow-hidden"
          >
            {/* Animated ripple effect */}
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-white rounded-full"
            />

            {/* Phone icon */}
            <motion.svg
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
              className="w-8 h-8 text-white z-10"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            </motion.svg>
          </motion.div>

          {/* Phone Chat Bubble - Fixed positioning */}
          <motion.div
            initial={{ scale: 0, x: 20, opacity: 0 }}
            animate={{
              scale: showPhoneBubble ? 1 : 0,
              x: showPhoneBubble ? 0 : 20,
              opacity: showPhoneBubble ? 1 : 0
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
            className="absolute bottom-0 right-20 bg-white rounded-2xl shadow-2xl p-6 w-80 border border-gray-100 z-50"
            style={{
              transformOrigin: "bottom right",
              right: "80px",
              bottom: "0px"
            }}>
            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowPhoneBubble(false);
              }}
              className="absolute top-3 right-3 w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors z-10"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                {/* Placeholder for image - replace src when available */}
                <img
                  src="/path-to-phone-avatar.jpg"
                  alt="Phone Support"
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" style={{ display: 'none' }}>
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">Call Us Now</h4>
                <p className="text-gray-600 text-sm mb-3">Need immediate assistance? Our support team is ready to help!</p>
                <a
                  href="tel:+84-0236-3738-399"
                  className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                  </svg>
                  +84 0236 3738 399
                </a>
              </div>
            </div>

            {/* Speech bubble tail */}
            <div className="absolute bottom-4 -right-2 w-4 h-4 bg-white border-r border-b border-gray-100 transform rotate-45"></div>
          </motion.div>
        </motion.div>

        {/* Email Bubble */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: 1.0
          }}
          className="relative"
        >
          {/* Email Notification Dot - Positioned above bubble */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 1.2
            }}
            className="absolute -top-2 -right-2 z-10"
          >
            <NotificationDot color="bg-orange-500" delay={0.1}>
              @
            </NotificationDot>
          </motion.div>

          <motion.div
            whileHover={{
              scale: 1.1,
              boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.3), 0 10px 10px -5px rgba(59, 130, 246, 0.2)",
              y: -5
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowEmailBubble(!showEmailBubble)}
            className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-lg cursor-pointer flex items-center justify-center relative overflow-hidden"
          >
            {/* Animated ripple effect */}
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
              className="absolute inset-0 bg-white rounded-full"
            />

            {/* Email icon */}
            <motion.svg
              whileHover={{ rotateY: 180 }}
              transition={{ duration: 0.6 }}
              className="w-8 h-8 text-white z-10"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </motion.svg>
          </motion.div>

          {/* Email Chat Bubble - Fixed positioning */}
          <motion.div
            initial={{ scale: 0, x: 20, opacity: 0 }}
            animate={{
              scale: showEmailBubble ? 1 : 0,
              x: showEmailBubble ? 0 : 20,
              opacity: showEmailBubble ? 1 : 0
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
            className="absolute bottom-0 right-20 bg-white rounded-2xl shadow-2xl p-6 w-80 border border-gray-100 z-50"
            style={{
              transformOrigin: "bottom right",
              right: "80px",
              bottom: "0px"
            }}
          >
            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowEmailBubble(false);
              }}
              className="absolute top-3 right-3 w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors z-10"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                {/* Placeholder for image - replace src when available */}
                <img
                  src="/path-to-email-avatar.jpg"
                  alt="Email Support"
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" style={{ display: 'none' }}>
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">Send Email</h4>
                <p className="text-gray-600 text-sm mb-3">Have questions? Drop us a message and we'll get back to you!</p>
                <a
                  href="mailto:contact@whalexe.com"
                  className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                  contact@whalexe.com
                </a>
              </div>
            </div>

            {/* Speech bubble tail */}
            <div className="absolute bottom-4 -right-2 w-4 h-4 bg-white border-r border-b border-gray-100 transform rotate-45"></div>
          </motion.div>
        </motion.div>
      </div>
    </div >
  );
}