"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import VehicleList from "../../../components/VehicleList";
import ProfileEditPanel from "../../../components/ProfileEditPanel";
import ToastNotification from "../../../components/ToastNotification";
import { getUserFavorites, toggleVehicleFavorite } from "../../../lib/auth-utils";
import { getUserBookings, formatBookingDate, formatBookingTime, formatPrice, getStatusText, getStatusColor } from "../../../lib/booking-api";
import { useToast } from "../../../hooks/useToast";

export default function UserProfilePage() {
  // MOVE ALL HOOKS TO THE TOP - BEFORE ANY CONDITIONAL LOGIC
  const router = useRouter();
  const { toasts, removeToast, showFavoriteToast, showUnfavoriteToast } = useToast();
  const [user, setUser] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);
  const [showFade, setShowFade] = useState(true);
  const [fadeOut, setFadeOut] = useState(false); const [showWhiteFadeLogout, setShowWhiteFadeLogout] = useState(false);
  const [activePanel, setActivePanel] = useState('dashboard');
  const [favoriteCars, setFavoriteCars] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState(null);  // User data effect
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
        router.push('/');
      }
    } else {
      //  Redirect về homepage
      router.push('/');
    }
  }, [router]);

  // Fade effect
  useEffect(() => {
    setFadeIn(true);
    // Start fade out after a short delay
    const timer = setTimeout(() => setFadeOut(true), 100); // Start fade after 100ms
    // Remove overlay after transition
    const removeTimer = setTimeout(() => setShowFade(false), 700); // 600ms transition + 100ms buffer
    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, []);  // Initialize favorite cars when user data is available
  useEffect(() => {
    const loadFavorites = async () => {
      if (user && (user.account_id || user.id)) {
        try {
          const userId = user.account_id || user.id;
          const favorites = await getUserFavorites(userId);
          setFavoriteCars(favorites);
        } catch (error) {
          console.error('Error loading favorite cars:', error);
          setFavoriteCars([]);
        }
      }
    };

    loadFavorites();
  }, [user]);

  // Load user bookings when user data is available
  useEffect(() => {
    const loadBookings = async () => {
      if (user && (user.account_id || user.id)) {
        setBookingsLoading(true);
        setBookingsError(null);
        try {
          const userId = user.account_id || user.id;
          const result = await getUserBookings(userId, { limit: 50 });
          console.log('getUserBookings result:', result);
          if (result.success) {
            console.log('Setting userBookings to:', result.records);
            setUserBookings(result.records);
          } else {
            setBookingsError(result.error || 'Failed to load bookings');
            setUserBookings([]);
          }
        } catch (error) {
          console.error('Error loading user bookings:', error);
          setBookingsError('Failed to load bookings');
          setUserBookings([]);
        } finally {
          setBookingsLoading(false);
        }
      }
    };

    loadBookings();
  }, [user]);

  // Debug log for userBookings
  useEffect(() => {
    console.log('userBookings state changed:', userBookings);
    console.log('bookingsLoading:', bookingsLoading);
    console.log('bookingsError:', bookingsError);
  }, [userBookings, bookingsLoading, bookingsError]);

  // NOW HANDLE LOADING STATE AFTER ALL HOOKS ARE DECLARED
  if (!user) {
    return (
      <div className="font-sans bg-gray-50 text-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }
  // Mock user data - replace with actual data from your backend if needed
  const userData = {
    name: user.name || "Monica Lucas",
    email: user.email || "monica@rentaly.com",
    avatar: user.avatar || "/images/profile/1.jpg",
    totalOrders: 3,
    completedRides: 12,
    totalBookings: 58,
    totalCars: 24,
    recentOrders: [
      {
        id: "RWR19",
        car: "Jeep Renegade",
        pickup: "New York",
        destination: "Los Angeles",
        rentDate: "March 8, 2023",
        returnDate: "March 16, 2023",
        status: "Completed"
      },
      {
        id: "RWR20",
        car: "Mini Cooper",
        pickup: "San Francisco",
        destination: "Chicago",
        rentDate: "March 8, 2023",
        returnDate: "March 16, 2023",
        status: "Completed"
      },
      {
        id: "RWR21",
        car: "Ferrari Enzo",
        pickup: "Philadelphia",
        destination: "Washington",
        rentDate: "March 8, 2023",
        returnDate: "March 16, 2023",
        status: "Pending"
      },
      {
        id: "RWR22",
        car: "Hyundai Santa",
        pickup: "Kansas City",
        destination: "Wichita",
        rentDate: "March 13, 2023",
        returnDate: "March 16, 2023",
        status: "Completed"
      },
      {
        id: "RWR23",
        car: "Toyota Yaris",
        pickup: "Baltimore",
        destination: "Sacramento",
        rentDate: "March 5, 2023",
        returnDate: "March 16, 2023",
        status: "Pending"
      }
    ],
    favoriteCars: [
      {
        id: 1,
        name: 'Porsche 911',
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=250&fit=crop',
        transmission: 'Tự động',
        fuel: 'Xăng',
        seats: 2,
        location: 'Quận Sơn Trà, Đà Nẵng',
        rating: 5.0,
        trips: 37,
        priceDisplay: '865K',
        oldPrice: 980000,
        pricePer: 'ngày',
        priceDiscount: 'Giảm 12%',
        description: 'Xe thể thao sang trọng với hiệu suất vượt trội.',
        isFavorite: false
      },
      {
        id: 2,
        name: 'Porsche 911 GT3 R rennsport',
        image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=250&fit=crop',
        transmission: 'Tự động',
        fuel: 'Xăng',
        seats: 2,
        location: 'Quận Sơn Trà, Đà Nẵng',
        rating: 5.0,
        trips: 170,
        priceDisplay: '5585K',
        oldPrice: 6412000,
        pricePer: 'ngày',
        priceDiscount: 'Giảm 13%',
        description: 'Siêu xe đua với tốc độ đỉnh cao.',
        isFavorite: false
      },
      {
        id: 3,
        name: 'SUZUKI XL7 2021',
        image: 'https://images.unsplash.com/photo-1549399592-91b8e56a6b26?w=400&h=250&fit=crop',
        transmission: 'Tự động',
        fuel: 'Xăng',
        seats: 7,
        location: 'Quận Sơn Trà, Đà Nẵng',
        rating: 4.8,
        trips: 2,
        priceDisplay: '865K',
        oldPrice: 912000,
        pricePer: 'ngày',
        priceDiscount: 'Giảm 5%',
        description: 'Xe gia đình rộng rãi, tiết kiệm nhiên liệu.',
        isFavorite: false
      }
    ]
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const fadeVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  // Animation variant for the Developer Badge
  const popInVariant = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: 0.4, // Delay for the badge to appear after sidebar starts animating
        duration: 0.5,
        ease: "backOut", // Adds a slight "pop"
      },
    },
  };

  // Animation variant for hero image pull up
  const heroImageVariant = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };
  // Use user info from session, fallback to defaults if not available
  const avatar =
    user.avatar && user.avatar.trim() !== ""
      ? user.avatar
      : "/avatar/default_avatar.jpg";
  const name = user.name || "Unknown User";
  const phone = user.phone || "N/A";  // Handle favorite/unfavorite
  const handleFavoriteToggle = async (vehicleId) => {
    // Check for user ID with flexible field checking
    const userId = user?.account_id || user?.id;
    if (!userId) {
      showUnfavoriteToast('Please log in to manage favorites');
      return;
    }

    try {
      const result = await toggleVehicleFavorite(userId, vehicleId);

      if (result.success) {
        if (result.action === 'added') {
          // Refresh favorites from server to get complete vehicle data
          const updatedFavorites = await getUserFavorites(userId);
          setFavoriteCars(updatedFavorites);
          showFavoriteToast('Vehicle added to your favorites!');
        } else {
          // Remove from local state
          setFavoriteCars(prev => prev.filter(car => car.id !== vehicleId));
          showUnfavoriteToast('Vehicle removed from favorites');
        }
      } else {
        showUnfavoriteToast('Failed to update favorite status');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      showUnfavoriteToast('An error occurred while updating favorites');
    }
  };

  // Animation variants for sidebar buttons
  const buttonVariants = {
    idle: {
      scale: 1,
      x: 0,
      transition: { duration: 0.2 }
    },
    hover: {
      scale: 1.02,
      x: 4,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  };

  // Animation variants for panel content
  const panelVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.98
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  // Stagger animation for dashboard stats
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "backOut"
      }
    }
  };

  return (
    <div className="font-sans bg-gray-50 text-gray-900 min-h-screen relative">
      {/* Toast Notifications */}
      <ToastNotification toasts={toasts} removeToast={removeToast} />

      {/* White fade-in overlay */}
      {showFade && (
        <div
          className="fixed inset-0 z-50 pointer-events-none"
          style={{
            background: "#fff",
            transition: "opacity 0.6s",
            opacity: fadeOut ? 0 : 1,
          }}
        />
      )}
      <Header />

      {/* Hero Section with Dashboard Title */}
      <section className="relative pt-24 pb-8">
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/hero/hero_profile.webp')",
              filter: "brightness(0.7)",
              top: "-48px",
              height: "calc(100% + 48px)",
              backgroundPosition: "center 60%",
              backgroundSize: "cover",
              zIndex: 0,
            }}
            variants={heroImageVariant}
            initial="hidden"
            animate="visible"
          />
        </div>
        <div className="relative z-10 text-center py-16">
          <motion.h1
            variants={fadeVariant}
            initial="hidden"
            animate="visible"
            className="text-4xl font-bold text-white"
          >
            Dashboard
          </motion.h1>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="pt-16 pb-8 relative z-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6">

            {/* Sidebar */}
            <motion.div
              variants={fadeVariant}
              initial="hidden"
              animate="visible"
              custom={1}
              className="lg:w-1/4"
            >
              <div className="bg-white rounded-lg shadow-sm p-6">
                {/* Profile Section */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <img
                      src={avatar}
                      alt={name}
                      className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                      onError={(e) => {
                        e.target.src = "/images/profile/default-avatar.png";
                      }}
                    />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-800">{name}</h3>
                  <p className="text-gray-600 text-sm">{user.phone || "N/A"}</p>
                </div>

                {/* Developer Badge - MODIFIED FOR ANIMATION */}
                <motion.div
                  className="mb-6"
                  variants={popInVariant}
                  initial="hidden"
                  animate="visible"
                >
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 w-full justify-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Developer
                  </span>
                </motion.div>

                {/* Navigation Menu with animations */}
                <nav className="space-y-2">
                  <motion.a
                    href="#"
                    onClick={e => { e.preventDefault(); setActivePanel('dashboard'); }}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${activePanel === 'dashboard' ? 'text-white bg-green-500' : 'text-gray-700 hover:bg-gray-100'}`}
                    variants={buttonVariants}
                    initial="idle"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    </svg>
                    Dashboard
                  </motion.a>
                  <motion.a
                    href="#"
                    onClick={e => { e.preventDefault(); setActivePanel('profile'); }}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${activePanel === 'profile' ? 'text-white bg-green-500' : 'text-gray-700 hover:bg-gray-100'}`}
                    variants={buttonVariants}
                    initial="idle"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Profile
                  </motion.a>
                  <motion.a
                    href="#"
                    onClick={e => { e.preventDefault(); setActivePanel('favoriteCars'); }}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${activePanel === 'favoriteCars' ? 'text-white bg-green-500' : 'text-gray-700 hover:bg-gray-100'}`}
                    variants={buttonVariants}
                    initial="idle"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    My Favorite Cars
                  </motion.a>
                  <motion.a
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      localStorage.removeItem('user');
                      router.push('/'); // Sign out and redirect to home
                    }}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                    variants={buttonVariants}
                    initial="idle"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </motion.a>
                </nav>
              </div>
            </motion.div>

            {/* Main Content with AnimatePresence */}
            <div className="lg:w-3/4 space-y-6">
              <AnimatePresence mode="wait">
                {/* Dashboard Panel */}
                {activePanel === 'dashboard' && (
                  <motion.div
                    key="dashboard"
                    variants={panelVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {/* Stats Cards with stagger animation */}
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
                    >                      {[
                      {
                        key: 'totalBookings',
                        value: userBookings.length,
                        label: 'Total Bookings',
                        icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      },
                      {
                        key: 'completedRides',
                        value: userBookings.filter(b => b.status === 'completed').length,
                        label: 'Completed Rides',
                        icon: "M13 10V3L4 14h7v7l9-11h-7z"
                      },
                      {
                        key: 'pendingOrders',
                        value: userBookings.filter(b => b.status === 'pending').length,
                        label: 'Pending Orders',
                        icon: "M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11"
                      },
                      {
                        key: 'favoriteCars',
                        value: favoriteCars.length,
                        label: 'Favorite Cars',
                        icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      }
                    ].map(({ key, value, label, icon }, index) => (
                      <motion.div
                        key={key}
                        variants={itemVariants}
                        className="bg-white rounded-lg p-6 text-center shadow-sm"
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                          transition: { duration: 0.2 }
                        }}
                      >                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
                          </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
                        <p className="text-sm text-gray-600">{label}</p>
                      </motion.div>
                    ))}
                    </motion.div>                    {/* All Orders Table - REPLACED Recent Orders */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="bg-white rounded-lg shadow-sm mb-6"
                    >
                      <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800">All My Orders</h3>
                        {bookingsError && (
                          <div className="mt-2 text-red-600 text-sm">
                            Error loading orders: {bookingsError}
                          </div>
                        )}
                      </div>

                      {/* Scrollable Table Container */}
                      <div className="relative">
                        {bookingsLoading ? (
                          <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mr-3"></div>
                            <span className="text-gray-600">Loading orders...</span>
                          </div>
                        ) : userBookings.length === 0 ? (
                          <div className="text-center py-12">
                            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-gray-500 text-lg mb-2">No orders found</p>
                            <p className="text-gray-400 text-sm">You haven't made any car bookings yet.</p>
                            <div className="mt-6 pb-6">
                              <button
                                onClick={() => router.push('/finding_car')}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              >
                                Browse Cars
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            {/* Fixed height container with scroll - INCREASED HEIGHT */}
                            <div className="max-h-96 overflow-y-auto overflow-x-auto
                              [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2
                              [&::-webkit-scrollbar-track]:rounded-full
                              [&::-webkit-scrollbar-track]:bg-green-50
                              [&::-webkit-scrollbar-thumb]:rounded-full
                              [&::-webkit-scrollbar-thumb]:bg-green-400
                              [&::-webkit-scrollbar-thumb:hover]:bg-green-400
                              [&::-webkit-scrollbar-corner]:bg-green-50
                              dark:[&::-webkit-scrollbar-track]:bg-green-900
                              dark:[&::-webkit-scrollbar-thumb]:bg-green-500
                              dark:[&::-webkit-scrollbar-corner]:bg-green-900"
                            >
                              <table className="w-full">
                                <thead className="bg-gray-50 sticky top-0 z-10">
                                  <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car Model</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pick up Location</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return Location</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup Time Day</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return Time Day</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {userBookings.map((booking, index) => (
                                    <motion.tr
                                      key={booking.id}
                                      className="hover:bg-gray-50 transition-colors duration-150"
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: index * 0.05, duration: 0.3 }}
                                    >
                                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        #{booking.id}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div className="flex items-center">
                                          <div className="flex-shrink-0 h-8 w-12 mr-3">
                                            <img
                                              className="h-8 w-12 rounded object-cover"
                                              src={booking.vehicle?.image || '/images/default-car.jpg'}
                                              alt={booking.vehicle?.name || 'Car'}
                                              onError={(e) => {
                                                e.target.src = '/images/default-car.jpg';
                                              }}
                                            />
                                          </div>
                                          <div>
                                            <div className="text-sm font-medium text-gray-900">
                                              {booking.vehicle?.name || 'N/A'}
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {booking.pickup_location || 'N/A'}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {booking.return_location || 'N/A'}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div>
                                          <div className="text-sm text-gray-900">{formatBookingDate(booking.pickup_date)}</div>
                                          <div className="text-sm text-gray-500">{formatBookingTime(booking.pickup_time)}</div>
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div>
                                          <div className="text-sm text-gray-900">{formatBookingDate(booking.return_date)}</div>
                                          <div className="text-sm text-gray-500">{formatBookingTime(booking.return_time)}</div>
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                        {formatPrice(booking.final_price)}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                                          {getStatusText(booking.status)}
                                        </span>
                                      </td>
                                    </motion.tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {/* Scroll indicator */}
                            {userBookings.length > 6 && (
                              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                                <div className="flex items-center justify-center text-sm text-gray-500">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                  </svg>
                                  Scroll to see more orders
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {/* Profile Edit Panel */}
                {activePanel === 'profile' && (
                  <motion.div
                    key="profile"
                    variants={panelVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <ProfileEditPanel user={userData} />
                  </motion.div>
                )}

                {/* Favorite Cars Panel */}
                {activePanel === 'favoriteCars' && (
                  <motion.div
                    key="favoriteCars"
                    variants={panelVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <div className="bg-white rounded-lg shadow-sm">
                      <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800">My Favorite Cars</h3>
                        <p className="text-sm text-gray-600 mt-1">Cars you've marked as favorites</p>
                      </div>
                      <div className="p-6">
                        {favoriteCars.length > 0 ? (
                          <VehicleList
                            vehicles={favoriteCars}
                            onFavoriteToggle={handleFavoriteToggle}
                            favorites={favoriteCars.map(car => car.id)}
                            showFavoriteButton={true}
                          />
                        ) : (
                          <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No favorite cars yet</h3>
                            <p className="mt-1 text-sm text-gray-500">Start browsing and add cars to your favorites!</p>
                            <div className="mt-6">
                              <button
                                onClick={() => router.push('/finding_car')}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              >
                                Browse Cars
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}