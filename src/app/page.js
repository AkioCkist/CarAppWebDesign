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
    image: "https://placehold.co/300x200/cccccc/333333?text=News",
    title: "How to Choose the Right Rental Car for Your Trip",
    snippet: "Discover tips and tricks for selecting the perfect vehicle for your next adventure.",
    link: "#",
  },
  {
    image: "https://placehold.co/300x200/cccccc/333333?text=News",
    title: "Electric Cars: The Future of Car Rentals",
    snippet: "Explore the benefits of renting electric vehicles and how they're changing the industry.",
    link: "#",
  },
  {
    image: "https://placehold.co/300x200/cccccc/333333?text=News",
    title: "Travel Safe: Our COVID-19 Measures",
    snippet: "Learn about our enhanced cleaning protocols and safety measures for your peace of mind.",
    link: "#",
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

  return (
    <div className="font-sans bg-white text-gray-900">
      {/* Fade out overlay - Updated for faster, seamless transition */}
      <div
        className={`fixed inset-0 bg-black z-50 transition-opacity duration-200 pointer-events-none ${fadeOut ? 'opacity-100' : 'opacity-0'
          }`}
      />

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
                  className="h-auto max-w-full rounded mb-4"
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
        <div className="max-w-4xl mx-auto px-4">
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
        className="bg-blue-900 text-white py-10 mt-10"
      >
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-2">About Us</h3>
            <p className="text-gray-200 text-sm">Whale Xe is dedicated to making your car rental experience smooth, affordable, and enjoyable. Travel with confidence and comfort.</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">Contact Info</h3>
            <ul className="text-gray-200 text-sm space-y-1">
              <li>158a Lê Lợi, Hải Châu 1, Hải Châu, Đà Nẵng</li>
              <li>+84 0236 3738 399</li>
              <li>contact@whalexe.com</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">Quick Links</h3>
            <ul className="text-gray-200 text-sm space-y-1">
              <li><a href="#" className="hover:underline">Home</a></li>
              <li><a href="#renting" className="hover:underline">Rentals</a></li>
              <li><a href="#" className="hover:underline">Blog</a></li>
              <li><a href="#" className="hover:underline">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">Social Network</h3>
            <div className="flex gap-4 mt-2">
              <a href="#" className="hover:text-blue-300">
                <svg width="24" height="24" fill="currentColor">
                  <circle cx="12" cy="12" r="12" fill="#fff" />
                  <path d="M17 8.5a2.5 2.5 0 0 1-2.5 2.5H14v2h1.5a2.5 2.5 0 0 1 0 5H14v2h-2v-2h-1.5a2.5 2.5 0 0 1 0-5H12v-2h-1.5A2.5 2.5 0 0 1 8 8.5V7h2v1.5A.5.5 0 0 0 10.5 9H12V7h2v2h1.5A.5.5 0 0 0 15 8.5V7h2v1.5z" />
                </svg>
              </a>
              <a href="#" className="hover:text-blue-300">
                <svg width="24" height="24" fill="currentColor">
                  <circle cx="12" cy="12" r="12" fill="#fff" />
                  <path d="M19 7.5a2.5 2.5 0 0 1-2.5 2.5H16v2h1.5a2.5 2.5 0 0 1 0 5H16v2h-2v-2h-1.5a2.5 2.5 0 0 1 0-5H14v-2h-1.5A2.5 2.5 0 0 1 10 7.5V6h2v1.5A.5.5 0 0 0 12.5 8H14V6h2v2h1.5A.5.5 0 0 0 17 7.5V6h2v1.5z" />
                </svg>
              </a>
              <a href="#" className="hover:text-blue-300">
                <svg width="24" height="24" fill="currentColor">
                  <circle cx="12" cy="12" r="12" fill="#fff" />
                  <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0-2a6 6 0 1 1 0 12A6 6 0 0 1 12 6z" />
                </svg>
              </a>
              <a href="#" className="hover:text-blue-300">
                <svg width="24" height="24" fill="currentColor">
                  <circle cx="12" cy="12" r="12" fill="#fff" />
                  <path d="M16 8a4 4 0 1 0-8 0v8a4 4 0 1 0 8 0V8z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-blue-800 mt-8 pt-6 text-center text-gray-300 text-sm">
          <div className="mb-2">Copyright 2025 - Whale Xe</div>
          <div className="space-x-4">
            <a href="#" className="hover:underline">Terms &amp; Conditions</a>
            <a href="#" className="hover:underline">Privacy Policy</a>
          </div>
        </div>
      </motion.footer>
    </div >

  );
}