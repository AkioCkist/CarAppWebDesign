"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { animate, scroll } from "motion";
import { useCarLoading } from "../../components/CarLoading";
import SimpleFaqSection from "../../components/SimpleFaqSection";
import CarRentalModal from "../../components/CarRentalModal";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Script from "next/script";

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
    image: "https://tribe-s3-production.imgix.net/TvW2b1YQoFl67YyaWGcD7?fit=max&w=2000&auto=compress,format",
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
  isFocused, // eslint-disable-line @typescript-eslint/no-unused-vars
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
  const fleetScrollRef = useRef(null);

  // Instead of state and useEffect for scrollY:
  // const [scrollY, setScrollY] = useState(0);
  const heroImageRef = useRef(null); // Keep this ref

  const { scrollY } = useScroll(); // Get raw scroll position
  const backgroundY = useTransform(scrollY, [0, 1000], [0, 400]); // Example: move 400px when scrolled 1000px

  const { isLoading, CarLoadingScreen, startLoading } = useCarLoading();
  const [form, setForm] = useState({
    vehicleType: vehicleTypes[0], // Using vehicleTypes here
    pickUpLocation: "",
    dropOffLocation: "same",
    pickUpDate: "",
    pickUpTime: "",
    dropOffDate: "",
    dropOffTime: "",
  });
  const router = useRouter();
  const [fleetVehicles, setFleetVehicles] = useState([]);
  const [fleetLoading, setFleetLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

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
    const { name, value, checked } = e.target;
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

  useEffect(() => {
    // Fetch 4 xe đầu tiên
    setFleetLoading(true); // Đảm bảo loading state được set
    fetch("/api/vehicles?limit=4")
      .then(res => res.json())
      .then(data => {
        // Map dữ liệu từ Prisma về format card cần
        const mapped = (data.records || []).map(v => ({
          id: v.id,
          name: v.name,
          image: v.image,
          transmission: v.transmission,
          seats: v.seats,
          fuel: v.fuel,
          location: v.location,
          rating: v.rating,
          trips: v.trips,
          priceDisplay: v.priceDisplay,
          oldPrice: v.oldPrice,
          pricePer: v.pricePer,
          priceDiscount: v.priceDiscount,
          description: v.description,
          isFavorite: v.is_favorite,
        }));

        // Thêm delay 1 giây để đảm bảo skeleton loading hiển thị đủ lâu
        setTimeout(() => {
          setFleetVehicles(mapped);
          setFleetLoading(false);
        }, 1000); // Delay 1 giây
      })
      .catch(() => {
        setTimeout(() => {
          setFleetLoading(false);
        }, 1000); // Delay 1 giây ngay cả khi có lỗi
      });
  }, []);

  // Hàm lấy chi tiết xe khi bấm "Đặt xe ngay"
  const handleBookClick = async (vehicleId) => {
    setLoadingDetail(true);
    setIsModalOpen(true);
    try {
      const res = await fetch(`/api/vehicles?id=${vehicleId}`);
      const data = await res.json();
      setSelectedCar(data);
    } catch (error) {
      console.error('Error fetching car details:', error);
      setSelectedCar(null);
    }
    setLoadingDetail(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCar(null);
  };

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
            backgroundImage: "url('/background/autumn_nature.jpg')",
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
                      <div className="relative">                        <AnimatedDropdown
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
                          zIndex={9999} // Very high z-index for dropoff to appear above all elements
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
                    // Nếu chọn same, dropOffLocation = pickUpLocation
                    const dropOffLoc = form.dropOffLocation === "same" ? form.pickUpLocation : form.dropOffLocation;
                    const params = new URLSearchParams({
                      pickUpLocation: form.pickUpLocation,
                      dropOffLocation: dropOffLoc,
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

      {/* Car Fleet Section - Enhanced Carousel */}
      <motion.section
        variants={fadeVariant}
        initial="hidden"
        animate="visible"
        custom={3}
        id="renting"
        className="w-full bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-32 text-center"> {/* Increased vertical padding from py-20 to py-32 */}
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Our Fleet</h2> {/* Enhanced title */}
          <div className="relative">
            {/* Scroll Hint for Mobile */}
            <div className="md:hidden flex justify-center items-center gap-2 mb-6 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              <span>Swipe to explore more cars</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>

            {/* Fleet Container with Hidden Scrollbars */}
            <div
              ref={fleetScrollRef}
              className="overflow-x-auto overflow-y-hidden scrollbar-hide"
              style={{
                /* Hide scrollbar for Chrome, Safari and Opera */
                WebkitScrollbar: 'none',
                /* Hide scrollbar for IE, Edge and Firefox */
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
                /* Smooth scrolling for touch devices */
                WebkitOverflowScrolling: 'touch'
              }}
            >
              <ul className="flex gap-6 py-4 px-2" style={{ listStyle: 'none', margin: 0, padding: 0 }}> {/* Reduced gap for better fit */}
                {fleetLoading ? (
                  // Enhanced Skeleton loading for 4 cars
                  Array.from({ length: 4 }).map((_, idx) => (
                    <li key={idx} className="min-w-[450px] max-w-[450px] flex-shrink-0"> {/* Bigger cards */}
                      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 h-[600px] w-full"> {/* Enhanced styling */}
                        {/* Image skeleton */}
                        <div className="w-full h-80 bg-gray-200 animate-pulse relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"></div>
                        </div>

                        {/* Content skeleton */}
                        <div className="p-6 space-y-4"> {/* Increased padding */}
                          <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
                          </div>
                          <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4"></div>
                          <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2"></div>
                          <div className="h-7 bg-gray-200 rounded animate-pulse w-2/3"></div>
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5"></div>
                          </div>
                          <div className="h-14 bg-gray-200 rounded animate-pulse mt-6"></div> {/* Bigger button */}
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  fleetVehicles.map((vehicle, idx) => (
                    <motion.li
                      key={vehicle.id || idx}
                      className="min-w-[450px] max-w-[450px] flex-shrink-0" // Bigger, consistent card size
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: idx * 0.1,
                        ease: "easeOut"
                      }}
                    >
                      <div className="bg-white rounded-2xl shadow-lg overflow-visible flex flex-col border border-gray-100 relative h-[600px] w-full"> {/* Removed all hover effects */}
                        <div className="relative w-full h-80 overflow-hidden rounded-t-2xl"> {/* Larger image height, rounded corners */}
                          <img
                            src={vehicle.image}
                            alt={vehicle.name}
                            className="w-full h-full object-cover"
                            // Removed hover scale effect
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0" /> {/* Removed hover opacity effect */}
                        </div>
                        <div className="p-6 flex flex-col flex-1"> {/* Increased padding */}
                          <div className="flex items-center gap-2 mb-3"> {/* Increased margin */}
                            <span className="font-bold text-lg text-gray-900 line-clamp-1"> {/* Larger font */}
                              {vehicle.name}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center text-sm text-gray-600 mb-3 gap-x-4 gap-y-2"> {/* Increased text size, margin, gaps */}
                            <div className="grid grid-cols-3 gap-3 w-full text-sm text-gray-600 mb-3"> {/* Increased gaps, margin */}
                              <span className="flex items-center gap-2">
                                <img
                                  src={vehicle.transmission.toLowerCase().includes('manual')
                                    ? "/icons/IconDetailCarCard/Transmission.svg"
                                    : "/icons/IconDetailCarCard/transmissionautomatic.svg"
                                  }
                                  alt="transmission"
                                  className="w-5 h-5" // Larger icons
                                />
                                <span className="text-xs">{vehicle.transmission}</span>
                              </span>
                              <span className="flex items-center gap-2">
                                <img src="/icons/IconDetailCarCard/seat.svg" alt="seats" className="w-5 h-5" />
                                <span className="text-xs">{vehicle.seats} seats</span>
                              </span>
                              <span className="flex items-center gap-2">
                                <img src="/icons/IconDetailCarCard/fuel.svg" alt="fuel" className="w-5 h-5" />
                                <span className="text-xs">{vehicle.fuel}</span>
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mb-3"> {/* Increased margin */}
                            <span className="flex items-center gap-2">
                              <img src="/icons/IconDetailCarCard/location.svg" alt="location" className="w-5 h-5 text-green-500" />
                              {vehicle.location}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mb-4"> {/* Increased margin */}
                            <span className="flex items-center text-yellow-500 gap-1">
                              <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"> {/* Larger icon */}
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              {vehicle.rating}
                            </span>
                            <span className="mx-3 text-gray-400">・</span> {/* Increased margin */}
                            <span className="flex items-center gap-1">
                              <img src="/icons/IconDetailCarCard/trips.svg" alt="trips" className="w-5 h-5" />
                              {vehicle.trips} trips
                            </span>
                          </div>
                          <div className="flex items-baseline gap-2 mb-3"> {/* Increased gap, margin */}
                            <span className="text-green-600 font-bold text-xl"> {/* Larger text */}
                              {vehicle.priceDisplay}
                            </span>
                            {vehicle.oldPrice && (
                              <span className="text-gray-400 line-through text-sm">
                                {`${(vehicle.oldPrice / 1000).toFixed(0)}K/${vehicle.pricePer}`}
                              </span>
                            )}
                          </div>
                          {vehicle.priceDiscount && (
                            <div className="flex items-center gap-2 mb-3"> {/* Increased margin */}
                              <span className="bg-gradient-to-r from-green-100 to-green-200 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                                {vehicle.priceDiscount}
                              </span>
                            </div>
                          )}
                          <div className="text-sm text-gray-700 mb-4 line-clamp-2 h-10 overflow-hidden"> {/* Larger text, increased margin, height */}
                            {vehicle.description}
                          </div>
                          <div className="mt-auto">
                            <button
                              onClick={() => handleBookClick(vehicle.id)}
                              className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold text-base"
                              // Removed hover effects
                            >
                              <span className="flex items-center justify-center gap-2">
                                More Details
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
        {/* Modal chi tiết xe */}
        <CarRentalModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          carData={selectedCar}
          loading={loadingDetail}
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
            {news.map((n, index) => (
              <motion.div
                key={n.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                whileHover={{
                  scale: 1.05,
                  y: -10,
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
                }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 relative group cursor-pointer transition-all duration-300 ease-in-out hover:shadow-2xl"
                onMouseEnter={(e) => {
                  e.currentTarget.querySelector('.news-image').style.transform = 'scale(1.1)';
                  e.currentTarget.querySelector('.news-overlay').style.opacity = '1';
                  e.currentTarget.querySelector('.news-title').style.color = '#22C55E';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.querySelector('.news-image').style.transform = 'scale(1)';
                  e.currentTarget.querySelector('.news-overlay').style.opacity = '0';
                  e.currentTarget.querySelector('.news-title').style.color = '#111827';
                }}
              >
                <div className="relative w-full h-48 overflow-hidden">
                  <img
                    src={n.image}
                    alt={n.title}
                    className="news-image w-full h-full object-cover transition-all duration-500"
                  />
                  <div
                    className="news-overlay absolute inset-0 bg-gradient-to-t from-black/30 to-transparent transition-opacity duration-300 opacity-0"
                  />

                  {/* Animated Read More Badge */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="absolute top-4 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    New Article
                  </motion.div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="news-title font-semibold text-lg mb-3 transition-colors duration-300 text-gray-900 group-hover:text-green-600 line-clamp-2">
                    {n.title}
                  </h3>

                  <p className="text-gray-600 mb-4 flex-1 line-clamp-3 group-hover:text-gray-700 transition-colors duration-300">
                    {n.snippet}
                  </p>

                  <motion.a
                    href={n.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 5 }}
                    className="inline-flex items-center gap-2 text-green-600 font-semibold hover:text-green-700 transition-colors duration-300 mt-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Read More
                    <motion.svg
                      whileHover={{ x: 3 }}
                      className="w-4 h-4 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </motion.svg>
                  </motion.a>
                </div>

                {/* Hover border effect */}
                <div className="absolute inset-0 border-2 border-green-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
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
        className="py-2 bg-gray-50"> {/* Reduced padding from py-4 to py-2 */}
        <div className="max-w-[98vw] xl:max-w-[1170px] mx-auto px-4">
          <div className="space-y-4">
            <SimpleFaqSection />
            {/* View More FAQ Button */}
            <div className="text-center mt-4"> {/* Reduced margin from mt-8 to mt-4 */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold px-8 py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <span>View More FAQ</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Contact Form Section */}
      <section id="contact-us" className="py-8 sm:py-12 bg-gradient-to-br from-gray-50 to-slate-100"> {/* Reduced padding from py-12 sm:py-16 to py-8 sm:py-12 */}
        <div className="max-w-[98vw] xl:max-w-[1170px] mx-auto px-4"> {/* Expanded to match FAQ section width */}
          <div className="text-center mb-8 sm:mb-10"> {/* Adjusted margin */}
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Get in Touch</h2> {/* Changed text */}
            <p className="text-sm sm:text-base text-gray-600">We&apos;d love to hear from you! Send us a message and we&apos;ll respond as soon as possible.</p>
          </div>
          <form
            className="bg-white p-6 sm:p-8 rounded-xl shadow-xl space-y-5 border border-gray-200 max-w-4xl mx-auto" /* Added max-width and center alignment to match FAQ width */
            onSubmit={async e => {
              e.preventDefault();
              const form = e.target;
              const name = form.name.value;
              const email = form.email.value;
              const message = form.message.value;
              try {
                const res = await fetch('/myapi/contact.php', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name, email, message })
                });
                const data = await res.json();
                if (data.success) {
                  alert('Thank you for contacting us!');
                  form.reset();
                } else {
                  alert(data.error || 'Failed to send.');
                }
              } catch (error) {
                console.error('Error sending contact form:', error);
                alert('Error sending contact form.');
              }
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5"> {/* Grid for name and email */}
              <div>
                <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Your Name</label> {/* Adjusted label size, margin */}
                <input id="name" name="name" type="text" required className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-shadow duration-200 text-sm sm:text-base" placeholder="e.g. John Doe" /> {/* Adjusted padding, border, focus, text size */}
              </div>
              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Email Address</label> {/* Adjusted label size, margin */}
                <input id="email" name="email" type="email" required className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-shadow duration-200 text-sm sm:text-base" placeholder="you@example.com" /> {/* Adjusted padding, border, focus, text size */}
              </div>
            </div>
            <div>
              <label htmlFor="message" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Message</label> {/* Adjusted label size, margin */}
              <textarea id="message" name="message" required className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-shadow duration-200 text-sm sm:text-base" placeholder="Your message here..." rows="5"></textarea> {/* Adjusted padding, border, focus, text size, rows */}
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-2.5 sm:py-3 px-6 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-sm sm:text-base" /* Gradient, hover, active, focus states, text size */
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      <div className="mt-2.5"> {/* 10px top margin above footer */}
        <Footer />
      </div>

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
            delay: 0.8,
          }}
          className="relative"
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 1.0,
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
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(34, 197, 94, 0.2)",
              y: -5,
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPhoneBubble(!showPhoneBubble)}
            className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-lg cursor-pointer flex items-center justify-center relative overflow-hidden"
          >
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
              className="absolute inset-0 bg-white rounded-full"
            />
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
            }}
          >
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
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <img
                  src="/icons/phone_bubble.svg"
                  alt="Phone Support"
                  className="w-7 h-7 rounded-4 object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "block";
                  }}
                />
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" style={{ display: "none" }}>
                  <path d="M6.62 10.79c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
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
              <div className="absolute bottom-4 -right-2 w-4 h-4 bg-white border-r border-b border-gray-100 transform rotate-45"></div>
            </div>
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
            delay: 1.0,
          }}
          className="relative"
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 1.2,
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
              boxShadow:
                "0 20px 25px -5px rgba(59, 130, 246, 0.3), 0 10px 10px -5px rgba(59, 130, 246, 0.2)",
              y: -5,
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowEmailBubble(!showEmailBubble)}
            className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-lg cursor-pointer flex items-center justify-center relative overflow-hidden"
          >
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
              className="absolute inset-0 bg-white rounded-full"
            />
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
                  src="/icons/email_bubble.svg"
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
                <p className="text-gray-600 text-sm mb-3">Have questions? Drop us a message and we&apos;ll get back to you!</p>
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
              <div className="absolute bottom-4 -right-2 w-4 h-4 bg-white border-r border-b border-gray-100 transform rotate-45"></div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Google Tag Script */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-M6FED393ST"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-M6FED393ST');
        `}
      </Script>
    </div>
  );
}
