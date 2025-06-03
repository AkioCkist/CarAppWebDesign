"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { animate, scroll } from "motion";
import { useCarLoading } from "../../components/CarLoading";
import SimpleFaqSection from "../../components/SimpleFaqSection";
import VehicleList from "../../components/VehicleList";
import vehicles from "../../lib/seed";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

// Make sure this declaration is present!
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
    snippet: "Whether you're going on vacation, exploring the unknown, or traveling for business purposes, picking the perfect rental car is key to planning a smooth and pleasant journey.",
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

// Location options for dropdowns
const locationOptions = [
  { value: "", label: "Select location", disabled: true },
  { value: "hcm", label: "TP. Hồ Chí Minh" },
  { value: "hanoi", label: "Hà Nội" },
  { value: "danang", label: "Đà Nẵng" },
  { value: "hue", label: "Huế" },         // Thêm Huế
  { value: "bacninh", label: "Bắc Ninh" } // Thêm Bắc Ninh
];

const dropoffOptions = [
  { value: "same", label: "Same as Pick Up", disabled: false },
  { value: "hcm", label: "TP. Hồ Chí Minh" },
  { value: "hanoi", label: "Hà Nội" },
  { value: "danang", label: "Đà Nẵng" },
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
      delay: delay,
    }}
    className={`w-5 h-5 ${color} rounded-full border-2 border-white flex items-center justify-center shadow-lg`}
  >
    <span className="text-white text-xs font-bold">{children}</span>
  </motion.div>
);

// Custom Dropdown Component
const AnimatedDropdown = ({
  options,
  value,
  onChange,
  placeholder,
  name,
  isOpen,
  onToggle,
  onFocus,
  onBlur,
  isFocused,
  zIndex = 50 // Add zIndex prop with default value
}) => {
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative w-full">
      <motion.div
        onClick={onToggle}
        onFocus={onFocus}
        onBlur={onBlur}
        className="w-full py-2 pr-8 text-gray-800 bg-transparent border-0 focus:outline-none cursor-pointer flex items-center justify-between"
        tabIndex={0}
      >
        <span className={selectedOption?.value ? "text-gray-800" : "text-gray-500"}>
          {selectedOption?.label || placeholder}
        </span>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0, transformOrigin: "top" }} // Change height to scaleY
            animate={{ opacity: 1, scaleY: 1 }} // Change height to scaleY
            exit={{ opacity: 0, scaleY: 0 }} // Change height to scaleY
            transition={{
              duration: 0.3,
              ease: "easeOut"
            }}
            className={`absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden`}
            style={{
              marginTop: "4px",
              zIndex: zIndex // Use dynamic z-index
            }}>
            {options.map((option, index) => (
              <motion.div
                key={option.value}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.2,
                  ease: "easeOut"
                }}
                onClick={() => {
                  if (!option.disabled) {
                    onChange({ target: { name, value: option.value } });
                    onToggle();
                  }
                }}
                className={`px-4 py-3 cursor-pointer transition-colors ${option.disabled
                  ? "text-gray-400 cursor-not-allowed bg-gray-50"
                  : "text-gray-800 hover:bg-green-50 hover:text-green-700"
                  } ${value === option.value ? "bg-green-100 text-green-800 font-medium" : ""}`}
              >
                <motion.div
                  whileHover={!option.disabled ? { x: 5 } : {}}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex items-center"
                >
                  {!option.disabled && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.05 + 0.1 }}
                      className="w-2 h-2 bg-green-500 rounded-full mr-3"
                    />
                  )}
                  {option.label}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function HomePage() {
  const [sameLocation, setSameLocation] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [showPhoneBubble, setShowPhoneBubble] = useState(false);
  const [showEmailBubble, setShowEmailBubble] = useState(false);
  const [isPickupDateFocused, setIsPickupDateFocused] = useState(false);
  const [isPickupTimeFocused, setIsPickupTimeFocused] = useState(false);
  const [isDropoffDateFocused, setIsDropoffDateFocused] = useState(false);
  const [isDropoffTimeFocused, setIsDropoffTimeFocused] = useState(false);
  // Add location focus states
  const [isPickupLocationFocused, setIsPickupLocationFocused] = useState(false);
  const [isDropoffLocationFocused, setIsDropoffLocationFocused] = useState(false);
  // Add dropdown open states
  const [isPickupDropdownOpen, setIsPickupDropdownOpen] = useState(false);
  const [isDropoffDropdownOpen, setIsDropoffDropdownOpen] = useState(false);
  const fleetContainerRef = useRef(null);

  // Instead of state and useEffect for scrollY:
  // const [scrollY, setScrollY] = useState(0);
  const heroImageRef = useRef(null); // Keep this ref

  const { scrollY } = useScroll(); // Get raw scroll position
  const backgroundY = useTransform(scrollY, [0, 1000], [0, 400]); // Example: move 400px when scrolled 1000px

  const { isLoading, CarLoadingScreen, startLoading, stopLoading } = useCarLoading();
  const [form, setForm] = useState({
    vehicleType: vehicleTypes[0], // Using vehicleTypes here
    pickUpLocation: "",
    dropOffLocation: "same",
    pickUpDate: "",
    pickUpTime: "",
    dropOffDate: "",
    dropOffTime: "",
  });
  const [fadeIn, setFadeIn] = useState(false);
  const router = useRouter();

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

  useEffect(() => {
    setFadeIn(true);

    const handleRouteChangeStart = () => setFadeIn(false);
    router.events?.on?.("routeChangeStart", handleRouteChangeStart);

    // Close dropdowns when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setIsPickupDropdownOpen(false);
        setIsDropoffDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      router.events?.off?.("routeChangeStart", handleRouteChangeStart);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [router]);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "sameLocation") {
      setSameLocation(checked);
      setForm((f) => ({ ...f, dropOffLocation: checked ? "same" : f.dropOffLocation }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
      if (name === "pickUpLocation" && sameLocation) {
        setForm((f) => ({ ...f, dropOffLocation: "same" }));
      }
    }
  };

  const fadeVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.7,
        ease: "easeOut",
      },
    }),
  };

  // Animation variants for date/time pickers
  const pickerVariants = {
    idle: {
      scale: 1,
      boxShadow: "0 0 0 0px rgba(34, 197, 94, 0)",
      backgroundColor: "rgba(255, 255, 255, 1)"
    },
    focused: {
      scale: 1.02,
      boxShadow: "0 0 0 3px rgba(34, 197, 94, 0.1)",
      backgroundColor: "rgba(240, 253, 244, 1)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    clicked: {
      scale: 0.98,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  // Animation variants for location selects
  const locationVariants = {
    idle: {
      scale: 1,
      boxShadow: "0 0 0 0px rgba(34, 197, 94, 0)",
      backgroundColor: "rgba(255, 255, 255, 1)",
      borderBottomColor: "rgba(229, 231, 235, 1)" // gray-200
    },
    focused: {
      scale: 1.01,
      boxShadow: "0 0 0 2px rgba(34, 197, 94, 0.1)",
      backgroundColor: "rgba(240, 253, 244, 1)",
      borderBottomColor: "rgba(34, 197, 94, 0.3)", // green accent
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    clicked: {
      scale: 0.99,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  const iconVariants = {
    idle: {
      rotate: 0,
      scale: 1,
      color: "#6B7280"
    },
    focused: {
      rotate: 5,
      scale: 1.1,
      color: "#22C55E",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    clicked: {
      rotate: -5,
      scale: 0.9,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  // Setup scroll pinning effect for fleet section
  useEffect(() => {
    if (typeof window !== 'undefined' && fleetContainerRef.current) {
      const items = document.querySelectorAll(".fleet-item");

      if (items.length > 0) {
        // Animate fleet horizontally during vertical scroll
        scroll(
          animate(".fleet-group", {
            transform: ["none", `translateX(-${(items.length - 1) * 100}vw)`],
          }),
          { target: fleetContainerRef.current }
        );

        // Progress bar representing fleet scroll
        scroll(animate(".fleet-progress", { scaleX: [0, 1] }), {
          target: fleetContainerRef.current,
        });
      }
    }
  }, []);

  return isLoading ? (
    <CarLoadingScreen />
  ) : (
    <div className="font-sans bg-white text-gray-900">
      <Header />

      {/* Hero Section with Parallax */}
      <motion.section
        variants={fadeVariant}
        initial="hidden"
        animate="visible"
        custom={1}
        className="relative pt-24">
        <motion.div // Change this to motion.div
          ref={heroImageRef}
          className="absolute inset-0 bg-cover bg-center pointer-events-none"
          style={{
            backgroundImage: "url('/hero/hero.png')",
            filter: "brightness(0.7)",
            top: `-48px`,
            height: "calc(100% + 48px)",
            width: "100%",
            left: 0,
            zIndex: 0,
            position: "absolute",
            y: backgroundY, // Use the motion value for translateY
          }}
        >
        </motion.div>

        <div className="relative pt-30 pb-16 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white">
              Whale Xe - More than rentals<br />
              We deliver happiness
            </h1>

            {/* Search Form */}
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-5xl mx-auto mt-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <motion.div
                    variants={locationVariants}
                    animate={isPickupLocationFocused || isPickupDropdownOpen ? "focused" : "idle"}
                    whileTap="clicked"
                    className="relative z-20 flex items-center border-b pb-4 rounded-md overflow-visible dropdown-container"
                  >
                    <AnimatePresence>
                      {(isPickupLocationFocused || isPickupDropdownOpen) && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 rounded-md"
                        />
                      )}
                    </AnimatePresence>
                    <div className="flex-shrink-0 mr-3 relative z-10">
                      <motion.svg
                        variants={iconVariants}
                        animate={isPickupLocationFocused || isPickupDropdownOpen ? "focused" : "idle"}
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </motion.svg>
                    </div>
                    <div className="flex-1 min-w-0 relative z-10">
                      <label className="block text-left font-bold text-base text-gray-700 mb-1">Pick Up Location</label>
                      <div className="relative">
                        <AnimatedDropdown
                          options={locationOptions}
                          value={form.pickUpLocation}
                          onChange={handleFormChange}
                          placeholder="Select location"
                          name="pickUpLocation"
                          isOpen={isPickupDropdownOpen}
                          onToggle={() => {
                            setIsPickupDropdownOpen((open) => !open);
                            setIsDropoffDropdownOpen(false);
                          }}
                          onFocus={() => setIsPickupLocationFocused(true)}
                          onBlur={() => setIsPickupLocationFocused(false)}
                          isFocused={isPickupLocationFocused}
                          zIndex={60} // Higher z-index for pickup
                        />
                        <motion.svg
                          variants={iconVariants}
                          animate={isPickupLocationFocused || isPickupDropdownOpen ? "focused" : "idle"}
                          className="absolute right-0 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <motion.path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                            animate={{ rotate: isPickupDropdownOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          />
                        </motion.svg>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    variants={locationVariants}
                    animate={isDropoffLocationFocused || isDropoffDropdownOpen ? "focused" : "idle"}
                    whileTap="clicked"
                    className="relative z-10 flex items-center rounded-md overflow-visible dropdown-container"
                  >
                    <AnimatePresence>
                      {(isDropoffLocationFocused || isDropoffDropdownOpen) && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 rounded-md"
                        />
                      )}
                    </AnimatePresence>
                    <div className="flex-shrink-0 mr-3 relative z-10">
                      <motion.svg
                        variants={iconVariants}
                        animate={isDropoffLocationFocused || isDropoffDropdownOpen ? "focused" : "idle"}
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </motion.svg>
                    </div>
                    <div className="flex-1 min-w-0 relative z-10">
                      <label className="block text-left font-bold text-base text-gray-700 mb-1">Drop Off Location</label>
                      <div className="relative">
                        <AnimatedDropdown
                          options={dropoffOptions}
                          value={form.dropOffLocation}
                          onChange={handleFormChange}
                          placeholder="Same as Pick Up"
                          name="dropOffLocation"
                          isOpen={isDropoffDropdownOpen}
                          onToggle={() => {
                            setIsDropoffDropdownOpen((open) => !open);
                            setIsPickupDropdownOpen(false);
                          }}
                          onFocus={() => setIsDropoffLocationFocused(true)}
                          onBlur={() => setIsDropoffLocationFocused(false)}
                          isFocused={isDropoffLocationFocused}
                          zIndex={50} // Lower z-index for dropoff
                        />
                        <motion.svg
                          variants={iconVariants}
                          animate={isDropoffLocationFocused || isDropoffDropdownOpen ? "focused" : "idle"}
                          className="absolute right-0 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <motion.path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                            animate={{ rotate: isDropoffDropdownOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          />
                        </motion.svg>
                      </div>
                    </div>
                  </motion.div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center border-b border-gray-200 pb-4">
                    <div className="flex-shrink-0 mr-3">
                      <motion.svg
                        variants={iconVariants}
                        animate={isPickupDateFocused || isPickupTimeFocused ? "focused" : "idle"}
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </motion.svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="block text-left font-bold text-base text-gray-700 mb-2">Pick Up Date & Time</label>
                      <div className="grid grid-cols-2 gap-3">
                        <motion.div
                          variants={pickerVariants}
                          animate={isPickupDateFocused ? "focused" : "idle"}
                          whileTap="clicked"
                          className="relative cursor-pointer rounded-md overflow-hidden"
                          onClick={(e) => {
                            e.currentTarget.querySelector("input").showPicker?.();
                            e.currentTarget.querySelector("input").focus();
                          }}
                        >
                          <AnimatePresence>
                            {isPickupDateFocused && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                className="absolute inset-0 bg-gradient-to-r from-green-100 to-emerald-100 rounded-md"
                              />
                            )}
                          </AnimatePresence>
                          <input
                            type="date"
                            className="relative z-10 w-full py-2 px-1 pr-8 text-sm text-gray-800 bg-transparent border-0 focus:outline-none focus:ring-0 uppercase [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                            name="pickUpDate"
                            value={form.pickUpDate}
                            onChange={handleFormChange}
                            onFocus={() => setIsPickupDateFocused(true)}
                            onBlur={() => setIsPickupDateFocused(false)}
                          />
                          <motion.svg
                            variants={iconVariants}
                            animate={isPickupDateFocused ? "focused" : "idle"}
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none z-10"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
                          </motion.svg>
                        </motion.div>
                        <motion.div
                          variants={pickerVariants}
                          animate={isPickupTimeFocused ? "focused" : "idle"}
                          whileTap="clicked"
                          className="relative cursor-pointer rounded-md overflow-hidden"
                          onClick={(e) => {
                            e.currentTarget.querySelector("input").showPicker?.();
                            e.currentTarget.querySelector("input").focus();
                          }}
                        >
                          <AnimatePresence>
                            {isPickupTimeFocused && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                className="absolute inset-0 bg-gradient-to-r from-green-100 to-emerald-100 rounded-md"
                              />
                            )}
                          </AnimatePresence>
                          <motion.svg
                            variants={iconVariants}
                            animate={isPickupTimeFocused ? "focused" : "idle"}
                            className="absolute left-1 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none z-10"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </motion.svg>
                          <input
                            type="time"
                            className="relative z-10 w-full py-2 pl-8 pr-8 text-sm text-gray-800 bg-transparent border-0 focus:outline-none focus:ring-0 uppercase [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                            name="pickUpTime"
                            value={form.pickUpTime}
                            onChange={handleFormChange}
                            onFocus={() => setIsPickupTimeFocused(true)}
                            onBlur={() => setIsPickupTimeFocused(false)}
                          />
                          <motion.svg
                            variants={iconVariants}
                            animate={isPickupTimeFocused ? "focused" : "idle"}
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none z-10"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
                          </motion.svg>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      <motion.svg
                        variants={iconVariants}
                        animate={isDropoffDateFocused || isDropoffTimeFocused ? "focused" : "idle"}
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </motion.svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="block text-left font-bold text-base text-gray-700 mb-2">Return Date & Time</label>
                      <div className="grid grid-cols-2 gap-3">
                        <motion.div
                          variants={pickerVariants}
                          animate={isDropoffDateFocused ? "focused" : "idle"}
                          whileTap="clicked"
                          className="relative cursor-pointer rounded-md overflow-hidden"
                          onClick={(e) => {
                            e.currentTarget.querySelector("input").showPicker?.();
                            e.currentTarget.querySelector("input").focus();
                          }}
                        >
                          <AnimatePresence>
                            {isDropoffDateFocused && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                className="absolute inset-0 bg-gradient-to-r from-green-100 to-emerald-100 rounded-md"
                              />
                            )}
                          </AnimatePresence>
                          <input
                            type="date"
                            className="relative z-10 w-full py-2 px-1 pr-8 text-sm text-gray-800 bg-transparent border-0 focus:outline-none focus:ring-0 uppercase [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                            name="dropOffDate"
                            value={form.dropOffDate}
                            onChange={handleFormChange}
                            onFocus={() => setIsDropoffDateFocused(true)}
                            onBlur={() => setIsDropoffDateFocused(false)}
                          />
                          <motion.svg
                            variants={iconVariants}
                            animate={isDropoffDateFocused ? "focused" : "idle"}
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none z-10"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
                          </motion.svg>
                        </motion.div>
                        <motion.div
                          variants={pickerVariants}
                          animate={isDropoffTimeFocused ? "focused" : "idle"}
                          whileTap="clicked"
                          className="relative cursor-pointer rounded-md overflow-hidden"
                          onClick={(e) => {
                            e.currentTarget.querySelector("input").showPicker?.();
                            e.currentTarget.querySelector("input").focus();
                          }}
                        >
                          <AnimatePresence>
                            {isDropoffTimeFocused && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                className="absolute inset-0 bg-gradient-to-r from-green-100 to-emerald-100 rounded-md"
                              />
                            )}
                          </AnimatePresence>
                          <motion.svg
                            variants={iconVariants}
                            animate={isDropoffTimeFocused ? "focused" : "idle"}
                            className="absolute left-1 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none z-10"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </motion.svg>
                          <input
                            type="time"
                            className="relative z-10 w-full py-2 pl-8 pr-8 text-sm text-gray-800 bg-transparent border-0 focus:outline-none focus:ring-0 uppercase [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                            name="dropOffTime"
                            value={form.dropOffTime}
                            onChange={handleFormChange}
                            onFocus={() => setIsDropoffTimeFocused(true)}
                            onBlur={() => setIsDropoffTimeFocused(false)}
                          />
                          <motion.svg
                            variants={iconVariants}
                            animate={isDropoffTimeFocused ? "focused" : "idle"}
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none z-10"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
                          </motion.svg>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <motion.button
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
                  }}
                  whileTap={{
                    scale: 0.98,
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                    y: 40,
                  }}
                  className="bg-green-500 text-white font-medium py-3 w-full max-w-md mx-auto rounded-lg hover:bg-green-600 transition duration-200"
                  onClick={() => {
                    startLoading();
                    // Tạo query string từ form
                    const params = new URLSearchParams({
                      pickUpLocation: form.pickUpLocation,
                      dropOffLocation: form.dropOffLocation,
                      pickUpDate: form.pickUpDate,
                      pickUpTime: form.pickUpTime,
                      dropOffDate: form.dropOffDate,
                      dropOffTime: form.dropOffTime,
                    }).toString();
                    setTimeout(() => {
                      router.push(`/finding_car?${params}`);
                    }, 2600);
                  }}
                >
                  Search Your Cars
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Features Section - Adjusted margin */}
      <motion.section
        variants={fadeVariant}
        initial="hidden"
        animate="visible"
        custom={2}
        id="about"
        className="bg-white mt-16 relative z-10" // Set a positive margin-top to push it down
      >
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">Our Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover a world of convenience, safety, and customization, paving the way for
              unforgettable adventures and seamless mobility solutions.
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/4 space-y-8 mb-8 md:mb-0">
              {features.slice(0, 2).map((f, i) => (
                <motion.div
                  key={f.title}
                  className="flex items-start"
                  variants={fadeVariant}
                  custom={i * 0.2}>
                  <div className="flex-shrink-0 mr-4">
                    <Image src={f.icon} alt={f.title} width={48} height={48} className="bg-green-100 p-2 rounded-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1 text-gray-900">{f.title}</h3> {/* Changed text color to gray-900 */}
                    <p className="text-gray-600 text-sm">{f.desc}</p> {/* Changed text color to gray-600 */}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="w-full md:w-1/2 px-4 flex justify-center mb-8 md:mb-0">
              <motion.div variants={fadeVariant} custom={0.4}>
                <Image src="/hero/adumatyper.png" alt="Honda Type R" width={600} height={375} className="max-w-full h-auto" />
              </motion.div>
            </div>
            <div className="w-full md:w-1/4 space-y-8">
              {features.slice(2, 4).map((f, i) => (
                <motion.div
                  key={f.title}
                  className="flex items-start"
                  variants={fadeVariant}
                  custom={(i + 2) * 0.2}>
                  <div className="flex-shrink-0 mr-4">
                    <Image src={f.icon} alt={f.title} width={48} height={48} className="bg-green-100 p-2 rounded-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1 text-gray-900">{f.title}</h3> {/* Changed text color to gray-900 */}
                    <p className="text-gray-600 text-sm">{f.desc}</p> {/* Changed text color to gray-600 */}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Car Fleet Section with Scroll Pinning */}
      <motion.section
        variants={fadeVariant}
        initial="hidden"
        animate="visible"
        custom={3}
        id="renting"
        className="w-full">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold text-center mb-10">Our Fleet</h2>
        </div>

        {/* Fleet Gallery Container */}
        <div
          ref={fleetContainerRef}
          className="fleet-group-container"
          style={{
            height: '500vh',
            position: 'relative'
          }}
        >
          <div style={{
            position: 'sticky',
            top: 0,
            overflow: 'hidden',
            height: '100vh',
            display: 'flex',
            alignItems: 'center'
          }}>
            <ul className="fleet-group" style={{
              display: 'flex',
              margin: 0,
              padding: 0,
              listStyle: 'none'
            }}>
              {vehicles.slice(0, 5).map((vehicle, index) => (
                <li
                  key={vehicle.id || index}
                  className="fleet-item"
                  style={{
                    display: 'flex',
                    width: '100vw',
                    height: '100vh',
                    flex: '0 0 auto',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    padding: '0 2rem'
                  }}
                >
                  <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      className="bg-white rounded-xl shadow-2xl overflow-hidden"
                    >
                      <div className="relative h-48 md:h-64">
                        <Image
                          src={vehicle.image}
                          alt={vehicle.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {vehicle.type}
                        </div>
                      </div>
                      <div className="p-6 md:p-8">
                        <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
                          {vehicle.name}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <div className="text-center">
                            <div className="text-gray-600 text-sm">Engine</div>
                            <div className="font-semibold">{vehicle.engine}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-gray-600 text-sm">Fuel</div>
                            <div className="font-semibold">{vehicle.fuel}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-gray-600 text-sm">Seats</div>
                            <div className="font-semibold">{vehicle.seats}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-gray-600 text-sm">Transmission</div>
                            <div className="font-semibold">{vehicle.transmission}</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-3xl font-bold text-green-600">
                            ${vehicle.price}<span className="text-lg text-gray-600">/day</span>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
                          >
                            Book Now
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                    <div className="mt-8">
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Progress Bar */}
        <div
          className="fleet-progress"
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #10b981, #059669)',
            bottom: '100px',
            transform: 'scaleX(0)',
            transformOrigin: 'left',
            zIndex: 30,
            visibility: 'hidden',
          }}
        />
      </motion.section>

      {/* News Section */}
      <motion.section
        variants={fadeVariant}
        initial="hidden"
        animate="visible"
        custom={4}
        className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Latest News</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.map((n) => (
              <motion.div
                key={n.title}
                whileHover={{
                  scale: 1.03,
                  y: -5,
                }}
                transition={{
                  type: "tween",
                  ease: "easeOut",
                  duration: 0.15,
                  stiffness: 300,
                  damping: 10,
                  mass: 0.5,
                }}
                className="bg-gray-50 rounded-xl shadow p-4 flex flex-col hover:shadow-lg transition">
                <motion.img
                  whileHover={{ scale: 1.02 }}
                  src={n.image}
                  alt={n.title}
                  className="w-full h-48 object-cover rounded mb-4" />
                <h3 className="font-semibold text-lg mb-2">{n.title}</h3>
                <p className="text-gray-600 mb-3">{n.snippet}</p>
                <motion.a
                  whileHover={{ x: 5 }}
                  href={n.link}
                  className="text-blue-600 font-semibold hover:underline mt-auto">
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
        className="py-16 bg-gray-50">
        <div className="max-w-[98vw] xl:max-w-[1170px] mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <SimpleFaqSection />
          </div>
        </div>
      </motion.section>

      <Footer /> {/* Use Footer Component */}

      {/* Floating Chat Bubbles */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: 0.8,
          }}
          className="relative">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 1.0,
            }}
            className="absolute -top-2 -right-2 z-10">
            <NotificationDot color="bg-red-500" delay={0}>
              !
            </NotificationDot>
          </motion.div>
          <motion.div
            whileHover={{
              scale: 1.1,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(34, 197, 94, 0.2)",
              y: -5,
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPhoneBubble(!showPhoneBubble)}
            className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-lg cursor-pointer flex items-center justify-center relative overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-white rounded-full" />
            <motion.svg
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
              className="w-8 h-8 text-white z-10"
              fill="currentColor"
              viewBox="0 0 24 24">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            </motion.svg>
          </motion.div>
          <motion.div
            initial={{ scale: 0, x: 20, opacity: 0 }}
            animate={{
              scale: showPhoneBubble ? 1 : 0,
              x: showPhoneBubble ? 0 : 20,
              opacity: showPhoneBubble ? 1 : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
            className="absolute bottom-0 right-20 bg-white rounded-2xl shadow-2xl p-6 w-80 border border-gray-100 z-50"
            style={{
              transformOrigin: "bottom right",
              right: "80px",
              bottom: "0px",
            }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowPhoneBubble(false);
              }}
              className="absolute top-3 right-3 w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors z-10">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <img
                  src="/path-to-phone-avatar.jpg"
                  alt="Phone Support"
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "block";
                  }} />
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" style={{ display: "none" }}>
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">Call Us Now</h4>
                <p className="text-gray-600 text-sm mb-3">Need immediate assistance? Our support team is ready to help!</p>
                <a
                  href="tel:+84-0236-3738-399"
                  className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                  </svg>
                  +84 0236 3738 399
                </a>
              </div>
            </div>
            <div className="absolute bottom-4 -right-2 w-4 h-4 bg-white border-r border-b border-gray-100 transform rotate-45"></div>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: 1.0,
          }}
          className="relative">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 1.2,
            }}
            className="absolute -top-2 -right-2 z-10">
            <NotificationDot color="bg-orange-500" delay={0.1}>
              @
            </NotificationDot>
          </motion.div>
          <motion.div
            whileHover={{
              scale: 1.1,
              boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.3), 0 10px 10px -5px rgba(59, 130, 246, 0.2)",
              y: -5,
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowEmailBubble(!showEmailBubble)}
            className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-lg cursor-pointer flex items-center justify-center relative overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute inset-0 bg-white rounded-full" />
            <motion.svg
              whileHover={{ rotateY: 180 }}
              transition={{ duration: 0.6 }}
              className="w-8 h-8 text-white z-10"
              fill="currentColor"
              viewBox="0 0 24 24" >
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </motion.svg>
          </motion.div>
          <motion.div
            initial={{ scale: 0, x: 20, opacity: 0 }}
            animate={{
              scale: showEmailBubble ? 1 : 0,
              x: showEmailBubble ? 0 : 20,
              opacity: showEmailBubble ? 1 : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
            className="absolute bottom-0 right-20 bg-white rounded-2xl shadow-2xl p-6 w-80 border border-gray-100 z-50"
            style={{
              transformOrigin: "bottom right",
              right: "80px",
              bottom: "0px",
            }}
          >
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
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <img
                  src="/path-to-email-avatar.jpg"
                  alt="Email Support"
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "block";
                  }}
                />
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" style={{ display: "none" }}>
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
            <div className="absolute bottom-4 -right-2 w-4 h-4 bg-white border-r border-b border-gray-100 transform rotate-45"></div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}