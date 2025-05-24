"use client";
import { useState, useEffect } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCarLoading } from '../../components/CarLoading';
const vehicleTypes = [
  "Sedan",
  "SUV",
  "Electric",
  "Luxury",
];

const cars = [
  {
    name: "Toyota Camry",
    image: "https://placehold.co/400x250/cccccc/333333?text=Car",
    price: "$50/day",
    details: "Seats: 5 | Transmission: Auto",
  },
  {
    name: "Tesla Model 3",
    image: "https://placehold.co/400x250/cccccc/333333?text=Car",
    price: "$90/day",
    details: "Seats: 5 | Transmission: Auto",
  },
  {
    name: "BMW X5",
    image: "https://placehold.co/400x250/cccccc/333333?text=Car",
    price: "$120/day",
    details: "Seats: 5 | Transmission: Auto",
  },
  {
    name: "Honda CR-V",
    image: "https://placehold.co/400x250/cccccc/333333?text=Car",
    price: "$60/day",
    details: "Seats: 5 | Transmission: Auto",
  },
];

const features = [
  {
    icon: "🚗",
    title: "Easy Booking",
    desc: "Book your car in just a few clicks with our seamless online process.",
  },
  {
    icon: "🛡️",
    title: "Wide Selection",
    desc: "Choose from a variety of vehicles to suit every journey and style.",
  },
  {
    icon: "💬",
    title: "24/7 Support",
    desc: "Our team is here to help you anytime, anywhere.",
  },
  {
    icon: "💰",
    title: "Best Prices",
    desc: "Enjoy competitive rates and exclusive deals every day.",
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

const faqs = [
  {
    question: "What documents do I need to rent a car?",
    answer:
      "You'll need a valid driver's license, a credit card, and proof of insurance. International renters may need a passport.",
  },
  {
    question: "Can I return the car to a different location?",
    answer:
      "Yes, we offer one-way rentals between select locations. Additional fees may apply.",
  },
  {
    question: "Is there an age requirement?",
    answer:
      "Renters must be at least 21 years old. Drivers under 25 may incur a young driver surcharge.",
  },
  {
    question: "Are there mileage limits?",
    answer:
      "Most rentals include unlimited mileage, but some vehicles may have restrictions. Check your rental agreement for details.",
  },
  {
    question: "How do I modify or cancel my booking?",
    answer:
      "You can manage your booking online or contact our support team 24/7 for assistance.",
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
  const [faqOpen, setFaqOpen] = useState(Array(faqs.length).fill(false));
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

      {/* Header - Updated opacity transition for seamless fade */}
      <motion.header
        variants={fadeVariant}
        initial="hidden"
        animate="visible"
        custom={0}
        className="fixed top-0 left-0 w-full z-30 text-white transition-opacity duration-200"
        style={{
          opacity: Math.max(1 - scrollY / 50, 0),
          backgroundColor: 'transparent'
        }}
      >
        <div className="max-w-7xl mx-auto px-4">
          {/* Main navigation */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2">
              {/* Logo */}
              <button onClick={() => handleNavigation('../')} className="flex items-center">
                <img src="/logo/logo.png" alt="Whale Xe" className="h-8" />
                <span className="text-2xl font-bold text-white ml-2">Whale Xe</span>
              </button>
            </div>

            <nav className="flex items-center gap-6 text-base font-medium">
              <button onClick={() => handleNavigation('../')} className="text-white hover:text-green-400 transition">
                Home
              </button>
              <button onClick={() => handleNavigation('')} className="text-white hover:text-green-400 transition">
                Cars
              </button>
              <button onClick={() => handleNavigation('')} className="text-white hover:text-green-400 transition flex items-center gap-1">
                Booking <i className="fas fa-chevron-down text-xs"></i>
              </button>
              <button onClick={() => handleNavigation('/signin_registration')} className="text-white hover:text-green-400 transition flex items-center gap-1">
                My Account <i className="fas fa-chevron-down text-xs"></i>
              </button>
              <button onClick={() => handleNavigation('')} className="text-white hover:text-green-400 transition flex items-center gap-1">
                Pages <i className="fas fa-chevron-down text-xs"></i>
              </button>
              <button onClick={() => handleNavigation('')} className="text-white hover:text-green-400 transition">
                Gallery
              </button>
              <button onClick={() => handleNavigation('')} className="text-white hover:text-green-400 transition flex items-center gap-1">
                News <i className="fas fa-chevron-down text-xs"></i>
              </button>
            </nav>

            <div>
              <button
                onClick={handleSignInClick}
                className="px-6 py-2 rounded-md bg-green-500 text-white font-medium hover:bg-green-600 transition">
                Sign In
              </button>
            </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Location Section */}
                <div className="space-y-4">
                  <div className="flex items-center border-b pb-4">
                    <div className="flex-shrink-0 mr-3">
                      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <label className="block text-left font-bold text-base text-gray-700">Pick Up Location</label>
                      <select className="w-full py-2 font-medium text-black focus:outline-none text-left">
                        <option>Select location</option>
                        <option>TP. Hồ Chí Minh</option>
                        <option>Hà Nội</option>
                        <option>Đà Nẵng</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <label className="block text-left font-bold text-base text-gray-700">Drop Off Location</label>
                      <select className="w-full py-2 font-medium text-black focus:outline-none text-left">
                        <option>Same as Pick Up</option>
                        <option>TP. Hồ Chí Minh</option>
                        <option>Hà Nội</option>
                        <option>Đà Nẵng</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Date/Time Section */}
                <div className="space-y-4">
                  <div className="flex items-center border-b pb-4">
                    <div className="flex-shrink-0 mr-3">
                      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <label className="block text-left font-bold text-base text-gray-700">Pick Up Date & Time</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="date"
                          className="py-2 font-medium text-black focus:outline-none text-left"
                          name="pickUpDate"
                          value={form.pickUpDate}
                          onChange={handleFormChange}
                        />
                        <input
                          type="time"
                          className="py-2 font-medium text-black focus:outline-none text-left"
                          name="pickUpTime"
                          value={form.pickUpTime}
                          onChange={handleFormChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <label className="block text-left font-bold text-base text-gray-700">Return Date & Time</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="date"
                          className="py-2 font-medium text-black focus:outline-none text-left"
                          name="dropOffDate"
                          value={form.dropOffDate}
                          onChange={handleFormChange}
                        />
                        <input
                          type="time"
                          className="py-2 font-medium text-black focus:outline-none text-left"
                          name="dropOffTime"
                          value={form.dropOffTime}
                          onChange={handleFormChange}
                        />
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
          <h2 className="text-3xl font-bold text-center mb-10">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                whileHover={{
                  scale: 1.05,
                  y: -5,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                transition={{
                  type: "tween", // tween animation
                  ease: "easeOut",
                  duration: 0.15, // Thời gian animation
                  stiffness: 300, // Độ cứng cao hơn
                  damping: 10,
                  mass: 0.5
                }}
                className="bg-blue-50 rounded-xl p-6 flex flex-col items-center text-center shadow hover:shadow-lg"
              >
                <motion.div
                  whileHover={{
                    scale: 1.2,
                    transition: { duration: 0.15 } // Đồng bộ thời gian với container
                  }}
                  className="text-4xl mb-3"
                >
                  {f.icon}
                </motion.div>
                <h3 className="font-semibold text-xl mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </motion.div>
            ))}

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {cars.map((car, i) => (
              <motion.div
                key={i}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                transition={{
                  type: "tween",
                  ease: "easeOut",
                  duration: 0.15,
                  stiffness: 300,
                  damping: 10,
                  mass: 0.5
                }}
                className="bg-white rounded-xl shadow p-4 flex flex-col items-center hover:shadow-lg transition"
              >
                <motion.img
                  whileHover={{ scale: 1.03 }}
                  src={car.image}
                  alt={car.name}
                  className="h-auto max-w-full rounded mb-4"
                />
                <h3 className="font-semibold text-lg mb-1">{car.name}</h3>
                <div className="text-blue-600 font-bold mb-1">{car.price}</div>
                <div className="text-gray-500 text-sm mb-3">{car.details}</div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
                >
                  Book Now
                </motion.button>
              </motion.div>
            ))}
          </div>
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
          <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                whileHover={{
                  scale: 1.01,
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                }}
                className="bg-white rounded-xl shadow p-4"
              >
                <button
                  className="w-full flex justify-between items-center text-left font-semibold text-lg focus:outline-none"
                  onClick={() => handleFaqToggle(i)}
                  aria-expanded={faqOpen[i]}
                  aria-controls={`faq-content-${i}`}
                >
                  <span>{faq.question}</span>
                  <motion.svg
                    animate={{ rotate: faqOpen[i] ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </button>

                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: faqOpen[i] ? "auto" : 0,
                    opacity: faqOpen[i] ? 1 : 0,
                    marginTop: faqOpen[i] ? "0.75rem" : 0
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden text-gray-600 border-t"
                >
                  <div id={`faq-content-${i}`}>
                    {faq.answer}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        variants={fadeVariant}
        initial="hidden"
        animate="visible"
        custom={6}
        className="bg-gradient-to-b from-blue-600 to-blue-800 text-white py-12 mt-20"
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-10">
          {/* Logo and About */}
          <div className="md:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="mr-3">
                <Image
                  src="/logo/logo.png"
                  alt="Whale Xe Logo"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-blue-300">
                Whale Xe
              </h2>
            </div>
            <p className="text-blue-100 text-sm mb-4">
              Whale Xe is dedicated to making your car rental experience smooth, affordable, and enjoyable.
              Travel with confidence and comfort.
            </p>
            <div className="flex space-x-4">
              {['facebook', 'twitter', 'instagram', 'youtube', 'linkedin'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-blue-100 hover:text-white transition-colors duration-300"
                  aria-label={social}
                >
                  <div className="w-8 h-8 bg-blue-500 hover:bg-blue-400 rounded-full flex items-center justify-center">
                    <Image
                      src={`/social-icons/${social}.svg`}
                      alt={social}
                      width={16}
                      height={16}
                      className="w-4 h-4 object-contain"
                    />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white flex items-center">
              <span className="w-3 h-3 bg-green-400 rounded-full mr-2"></span>
              Quick Links
            </h3>
            <ul className="space-y-2">
              {['Home', 'Rentals', 'Services', 'Blog', 'Contact'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-blue-100 hover:text-white transition-colors duration-300 text-sm flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-300 rounded-full mr-2"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white flex items-center">
              <span className="w-3 h-3 bg-green-400 rounded-full mr-2"></span>
              Contact Us
            </h3>
            <ul className="space-y-3 text-blue-100 text-sm">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3 text-green-300"></i>
                <span>158a Lê Lợi, Hải Châu 1, Hải Châu, Đà Nẵng</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone-alt mr-3 text-green-300"></i>
                <span>+84 0236 3738 399</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope mr-3 text-green-300"></i>
                <span>contact@whalexe.com</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-clock mr-3 text-green-300"></i>
                <span>Mon-Sun: 8:00 - 20:00</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-bold mb-4 text-white flex items-center">
              <span className="w-3 h-3 bg-green-400 rounded-full mr-2"></span>
              Newsletter
            </h3>
            <p className="text-blue-100 text-sm mb-4">
              Subscribe to our newsletter for the latest offers and news.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 rounded-l-lg focus:outline-none text-gray-800 w-full text-sm"
              />
              <button className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white px-4 py-2 rounded-r-lg text-sm font-medium transition-all duration-300">
                <i className="fas fa-paper-plane mr-1"></i> Send
              </button>
            </div>
            <div className="mt-4 flex items-center">
              <input type="checkbox" id="terms" className="mr-2" />
              <label htmlFor="terms" className="text-blue-100 text-xs">
                I agree to the <a href="#" className="text-green-300 hover:underline">Privacy Policy</a>
              </label>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-blue-500 mt-10 pt-6">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
            <div className="text-blue-100 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Whale Xe. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-blue-100 hover:text-white text-sm transition-colors duration-300">Terms & Conditions</a>
              <a href="#" className="text-blue-100 hover:text-white text-sm transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="text-blue-100 hover:text-white text-sm transition-colors duration-300">FAQ</a>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex space-x-2">
                <Image src="/logo/LogoPaymentFooter/visa.png" alt="Visa" width={24} height={24} className="h-6" />
                <Image src="/logo/LogoPaymentFooter/logo-momo-png-4.png" alt="Momo" width={24} height={24} className="h-6" />
                <Image src="/logo/LogoPaymentFooter/paypal.png" alt="Paypal" width={24} height={24} className="h-6" />
                <img src="/logo/LogoPaymentFooter/deposit.png" alt="Bank Transfer" width={24} height={24} className="h-6" />
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
              boxShadow: "0 20px 25px -5px rgba(34, 197, 94, 0.3), 0 10px 10px -5px rgba(34, 197, 94, 0.2)",
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
            }}
          >
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

