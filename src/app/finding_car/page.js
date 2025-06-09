"use client";
import React, { Suspense, useState, useEffect, useRef, useCallback } from 'react';
import { Search, MapPin, Car, Star, Users, Fuel, Calendar, ChevronDown, X } from 'lucide-react';
import VehicleList from "../../../components/VehicleList";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import CarRentalModal from "../../../components/CarRentalModal";
import FilterPopup from "../../../components/FilterPopup";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import CarLoadingScreen from '../../../components/CarLoading';
import { useSearchParams, useRouter } from 'next/navigation';

// Component chính - bọc bởi Suspense
export default function Page() {
  return (
    <Suspense fallback={<LoadingPlaceholder />}>
      <CarListingPageContent />
    </Suspense>
  );
}

// Component loading đơn giản
function LoadingPlaceholder() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
        <p className="text-green-700 text-lg">Loading vehicle list...</p>
      </div>
    </div>
  );
}

// Di chuyển toàn bộ code hiện tại vào component riêng biệt
function CarListingPageContent() {

  const searchParams = useSearchParams();
  const router = useRouter(); function beautifyCityName(str) {
    if (!str) return "";
    if (["TP.HCM", "Hà Nội", "Đà Nẵng", "Huế", "Bắc Ninh"].includes(str)) return str;
    const mapping = {
      'hcm': 'TP.HCM',
      'tp.hcm': 'TP.HCM',
      'hanoi': 'Hà Nội',
      'ha noi': 'Hà Nội',
      'danang': 'Đà Nẵng',
      'da nang': 'Đà Nẵng',
      'hue': 'Huế',
      'bacninh': 'Bắc Ninh',
      'bac ninh': 'Bắc Ninh'
    };
    const normalized = str.trim().toLowerCase();
    return mapping[normalized] || str;
  }

  const cityMapping = {
    'hcm': 'TP.HCM',
    'tp.hcm': 'TP.HCM',
    'hanoi': 'Hà Nội',
    'ha noi': 'Hà Nội',
    'danang': 'Đà Nẵng',
    'da nang': 'Đà Nẵng',
    'hue': 'Huế',
    'bacninh': 'Bắc Ninh',
    'bac ninh': 'Bắc Ninh',
    'TP.HCM': 'TP.HCM',
    'Hà Nội': 'Hà Nội',
    'Đà Nẵng': 'Đà Nẵng',
    'Huế': 'Huế',
    'Bắc Ninh': 'Bắc Ninh'
  };

  function normalizeCity(str) {
    if (!str) return "";
    const normalized = str.trim().toLowerCase();
    return cityMapping[normalized] || cityMapping[str.trim()] || str;
  }

  // Phần còn lại của component CarListingPage - GIỮ NGUYÊN TẤT CẢ
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [activePopup, setActivePopup] = useState(null);
  const [filters, setFilters] = useState({
    vehicle_type: [],
    brand: [],
    seats: [],
    fuel_type: [],
    discount: false
  });
  const [displayedCount, setDisplayedCount] = useState(8);
  const loaderRef = useRef(null);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(10000000);
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true); const [pickUpLocation, setPickUpLocation] = useState('Pick-up Location');
  const [dropOffLocation, setDropOffLocation] = useState('Drop-off Location');
  const [pickUpDate, setPickUpDate] = useState('');
  const [pickUpTime, setPickUpTime] = useState('');
  const [dropOffDate, setDropOffDate] = useState('');
  const [dropOffTime, setDropOffTime] = useState('');
  const [selectedCar, setSelectedCar] = useState(null);
  const [showRentalModal, setShowRentalModal] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const didInitRef = useRef(false);
  const isInitializedRef = useRef(false);
  const fetchController = useRef(null);

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const pickUpParam = params.get('pickUpLocation');
      const dropOffParam = params.get('dropOffLocation');

      const newSelectedLocation = normalizeCity(pickUpParam) || ''; const newPickUpLocation = beautifyCityName(normalizeCity(pickUpParam)) || 'Pick-up Location';
      const newDropOffLocation = beautifyCityName(normalizeCity(dropOffParam)) || 'Drop-off Location';
      const newFilters = {
        vehicle_type: params.get('vehicle_type') ? params.get('vehicle_type').split(',') : [],
        brand: params.get('brand') ? params.get('brand').split(',') : [],
        seats: params.get('seats') ? params.get('seats').split(',').map(s => `${s} seats`) : [],
        fuel_type: params.get('fuel_type') ? params.get('fuel_type').split(',') : [],
        discount: params.get('discount') === '1'
      };
      const newPriceMin = Number(params.get('priceMin')) || 0;
      const newPriceMax = Number(params.get('priceMax')) || 10000000;
      const newSearchTerm = params.get('search') || '';

      setSelectedLocation(newSelectedLocation);
      setPickUpLocation(newPickUpLocation);
      setDropOffLocation(newDropOffLocation);
      setPickUpDate(params.get('pickUpDate') || '');
      setPickUpTime(params.get('pickUpTime') || '');
      setDropOffDate(params.get('dropOffDate') || '');
      setDropOffTime(params.get('dropOffTime') || '');
      setFilters(newFilters);
      setPriceMin(newPriceMin);
      setPriceMax(newPriceMax);
      setSearchTerm(newSearchTerm);
      setDebouncedSearchTerm(newSearchTerm);

      isInitializedRef.current = true;
    }
  }, []);

  const fetchData = useCallback(async () => {
    if (!isInitializedRef.current) return;

    if (fetchController.current) {
      fetchController.current.abort();
    }
    fetchController.current = new AbortController();

    setIsLoading(true);
    if (cars.length === 0) {
      setIsInitialLoading(true);
    }

    const params = new URLSearchParams();

    if (selectedLocation) params.append('location', selectedLocation);
    if (filters.vehicle_type.length) params.append('vehicle_type', filters.vehicle_type.join(','));
    if (filters.brand.length) params.append('brand', filters.brand.join(','));
    if (filters.seats.length) params.append('seats', filters.seats.map(s => s.split(' ')[0]).join(','));
    if (filters.fuel_type.length) params.append('fuel_type', filters.fuel_type.join(','));
    if (filters.discount) params.append('discount', '1');
    params.append('priceMin', priceMin);
    params.append('priceMax', priceMax);
    if (debouncedSearchTerm) params.append('search', debouncedSearchTerm);

    console.log('Fetching API with params:', params.toString());

    try {
      const res = await fetch(`/api/vehicles?${params.toString()}`, {
        signal: fetchController.current.signal
      });

      if (!res.ok) throw new Error('API call failed');

      const data = await res.json();
      console.log('API response:', data);

      const minDelay = cars.length === 0 ? 1500 : 500;

      setTimeout(() => {
        setCars(data.records || []);
        setIsInitialLoading(false);
        setIsLoading(false);
      }, minDelay);

    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching cars:', error);
        setTimeout(() => {
          setCars([]);
          setIsInitialLoading(false);
          setIsLoading(false);
        }, cars.length === 0 ? 1500 : 500);
      }
    }
  }, [selectedLocation, filters, priceMin, priceMax, debouncedSearchTerm, cars.length]);

  useEffect(() => {
    if (isInitializedRef.current) {
      fetchData();
    }
  }, [fetchData]);

  // Load user favorites when component mounts
  useEffect(() => {
    const loadUserFavorites = async () => {
      try {
        const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;
        if (user && (user.account_id || user.id)) {
          const userId = user.account_id || user.id;
          const response = await fetch(`/api/favorites?account_id=${userId}`);
          if (response.ok) {
            const data = await response.json();
            // Extract vehicle IDs from favorites
            const favoriteIds = data.data?.map(fav => fav.id) || [];
            setFavorites(favoriteIds);
          }
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };

    loadUserFavorites();
  }, []);

  useEffect(() => {
    return () => {
      if (fetchController.current) {
        fetchController.current.abort();
      }
    };
  }, []);  const handleFavoriteToggle = async (vehicleId) => {
    // Check if user is logged in
    const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;
    
    if (!user || (!user.account_id && !user.id)) {
      // Show login alert and redirect to signin
      alert('Please log in to add vehicles to your favorites!');
      router.push('/signin_registration');
      return;
    }

    // Use either account_id or id from user data
    const userId = user.account_id || user.id;
    const isCurrentlyFavorite = favorites.includes(vehicleId);
    
    // Optimistic update
    setFavorites(prev =>
      isCurrentlyFavorite
        ? prev.filter(id => id !== vehicleId)
        : [...prev, vehicleId]
    );

    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          account_id: userId,
          vehicle_id: vehicleId
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to toggle favorite');
      }

      // Show success alert
      if (result.action === 'added') {
        alert('🚗 Vehicle added to your favorites!');
      } else {
        alert('Vehicle removed from favorites.');
      }

    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Failed to update favorites. Please try again.');
      
      // Revert optimistic update on error
      setFavorites(prev =>
        isCurrentlyFavorite
          ? [...prev, vehicleId]
          : prev.filter(id => id !== vehicleId)
      );
    }
  };

  const filterOptions = {
    vehicle_type: ['sedan', 'suv', 'hatchback', 'crossover', 'pickup', 'supercar'],
    brand: [
      'Toyota', 'Honda', 'Mercedes', 'BMW', 'Audi', 'Hyundai', 'Kia', 'Mazda', 'Nissan',
      'Lamborghini', 'Ferrari', 'Porsche', 'McLaren', 'Maserati', 'Aston Martin', 'Bentley'
    ], seats: ['2 seats', '4 seats', '5 seats', '7 seats', '8+ seats'],
    fuel_type: ['Gasoline', 'Diesel', 'Hybrid', 'Electric']
  };

  const formatCarTypeDisplay = (type) => {
    const typeMap = {
      'sedan': 'Sedan',
      'suv': 'SUV',
      'hatchback': 'Hatchback',
      'crossover': 'Crossover',
      'pickup': 'Pickup',
      'supercar': 'Super Car'
    };
    return typeMap[type] || type;
  };

  const filteredCars = React.useMemo(() => {
    console.log('🔄 Using cars as filteredCars:', cars.length, 'cars');
    return cars;
  }, [cars]);

  const handleFilterToggle = (category, value) => {
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [category]: prev[category].includes(value)
          ? prev[category].filter(item => item !== value)
          : [...prev[category], value]
      };
      return newFilters;
    });
  };

  const handleDiscountToggle = () => {
    setFilters(prev => ({
      ...prev,
      discount: !prev.discount
    }));
  };

  const closePopup = () => {
    setActivePopup(null);
  };

  useEffect(() => {
    if (activePopup) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [activePopup]);

  const PopupOverlay = ({ children, onClose }) => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );

  const PricePopup = ({ onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const minLimit = 0;
    const maxLimit = 10000000;
    const step = 100000;
    // Chỉ sử dụng internal state trong component này
    const [internalValues, setInternalValues] = useState([priceMin, priceMax]);

    useEffect(() => {
      // Trigger animation sau khi component mount
      const timer = setTimeout(() => setIsVisible(true), 50);
      return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Đợi animation xong mới close
    };

    const formatNumber = (num) => num.toLocaleString();

    // Cập nhật internal state khi kéo slider
    const handleChange = (newValues) => {
      setInternalValues(newValues);
    };

    // Cũng chỉ cập nhật internal state khi thả tay
    const handleAfterChange = (newValues) => {
      setInternalValues(newValues);
    };

    // Xử lý khi thay đổi input
    const handleInputChange = (index, value) => {
      const numValue = parseInt(value.replace(/,/g, '')) || 0;
      const newValues = [...internalValues];

      if (index === 0 && numValue <= internalValues[1]) {
        newValues[0] = numValue;
      } else if (index === 1 && numValue >= internalValues[0]) {
        newValues[1] = numValue;
      }

      setInternalValues(newValues);
    };

    // Áp dụng thay đổi - cập nhật priceMin/priceMax ở component cha
    const handleApply = () => {
      setPriceMin(internalValues[0]);
      setPriceMax(internalValues[1]);
      handleClose();
    };

    // Reset về giá trị mặc định
    const handleReset = () => {
      const resetValues = [0, 10000000];
      setInternalValues(resetValues);
      setPriceMin(0);
      setPriceMax(10000000);
      setTimeout(handleClose, 100);
    };

    return (
      <div
        className={`
          fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4
          transition-opacity duration-300 ease-out
          ${isVisible ? 'opacity-100' : 'opacity-0'}
        `}
        onClick={handleClose}
      >
        <div
          className={`
            bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden
            transition-all duration-300 ease-out
            ${isVisible
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-95'
            }
          `}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Select Price Range</h3>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">            <div className="flex space-x-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
              <input
                type="text"
                value={formatNumber(internalValues[0])}
                onChange={(e) => handleInputChange(0, e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-500 
                           focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                placeholder="0"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
              <input
                type="text"
                value={formatNumber(internalValues[1])}
                onChange={(e) => handleInputChange(1, e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-500 
                           focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                placeholder="10,000,000"
              />
            </div>
          </div>
            <div className="px-2">
              <Slider
                range
                min={minLimit}
                max={maxLimit}
                step={step}
                defaultValue={[priceMin, priceMax]}
                value={internalValues}
                onChange={handleChange}
                onChangeComplete={handleAfterChange}
                trackStyle={[{ background: '#22c55e', height: 6 }]}
                handleStyle={[
                  {
                    backgroundColor: '#fff',
                    border: '2px solid #22c55e',
                    width: 22,
                    height: 22,
                    marginTop: -8,
                    boxShadow: '0 2px 8px rgba(34,197,94,0.15)',
                  },
                  {
                    backgroundColor: '#fff',
                    border: '2px solid #22c55e',
                    width: 22,
                    height: 22,
                    marginTop: -8,
                    boxShadow: '0 2px 8px rgba(34,197,94,0.15)',
                  }
                ]}
                railStyle={{ background: '#e5e7eb', height: 6 }}
              />
            </div>
          </div>

          {/* Footer Actions */}<div className="px-6 py-4 bg-gray-50 border-t flex space-x-3">
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold
                         hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-[1.02]
                         active:scale-95 shadow-md hover:shadow-lg"
            >
              Apply
            </button>
            <button
              onClick={handleReset}
              className="flex-1 px-4 py-3 border-2 border-green-500 text-green-600 rounded-lg font-semibold
                         hover:bg-green-50 transition-all duration-200 transform hover:scale-[1.02]
                         active:scale-95"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayedCount < filteredCars.length) {
          setDisplayedCount(prev => Math.min(prev + 8, filteredCars.length));
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [filteredCars.length]);

  useEffect(() => {
    if (!isInitializedRef.current) return;

    const timer = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);

      if (filters.vehicle_type.length) params.set('vehicle_type', filters.vehicle_type.join(','));
      else params.delete('vehicle_type');

      if (filters.brand.length) params.set('brand', filters.brand.join(','));
      else params.delete('brand');

      if (filters.seats.length) params.set('seats', filters.seats.join(','));
      else params.delete('seats');

      if (filters.fuel_type.length) params.set('fuel_type', filters.fuel_type.join(','));
      else params.delete('fuel_type');

      if (filters.discount) params.set('discount', '1');
      else params.delete('discount');

      params.set('priceMin', priceMin);
      params.set('priceMax', priceMax);

      if (debouncedSearchTerm) params.set('search', debouncedSearchTerm);
      else params.delete('search');

      router.replace(`?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters, priceMin, priceMax, debouncedSearchTerm, router]);

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Header />
      <div className="h-21 bg-gray-800/95"></div>
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <MapPin className="h-5 w-5 text-blue-600" />              <span className="font-medium text-gray-900">
                {beautifyCityName(selectedLocation) || 'Pick-up Location'}
              </span>
              <span className="text-gray-500">→</span>
              <span className="font-medium text-gray-900">{dropOffLocation}</span>
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600 text-sm">
                {pickUpTime} {pickUpDate} - {dropOffTime} {dropOffDate}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-3">            <span className="text-sm text-black font-semibold mr-4">Filters:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActivePopup('vehicle_type')}
                className={`flex items-center px-3 py-1.5 text-sm border rounded-full transition-colors font-normal ${filters.vehicle_type.length > 0
                  ? 'border-green-600 bg-green-50 text-green-600'
                  : 'border-gray-300 hover:bg-gray-50 text-black'
                  }`}
              >
                Vehicle Type
                <ChevronDown className="ml-1 h-3 w-3" />
                {filters.vehicle_type.length > 0 && (
                  <span className="ml-2 bg-green-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {filters.vehicle_type.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActivePopup('brand')}
                className={`flex items-center px-3 py-1.5 text-sm border rounded-full transition-colors font-normal ${filters.brand.length > 0
                  ? 'border-green-600 bg-green-50 text-green-600'
                  : 'border-gray-300 hover:bg-gray-50 text-black'
                  }`}>
                Brand
                <ChevronDown className="ml-1 h-3 w-3" />
                {filters.brand.length > 0 && (
                  <span className="ml-2 bg-green-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {filters.brand.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActivePopup('seats')}
                className={`flex items-center px-3 py-1.5 text-sm border rounded-full transition-colors font-normal ${filters.seats.length > 0
                  ? 'border-green-600 bg-green-50 text-green-600'
                  : 'border-gray-300 hover:bg-gray-50 text-black'
                  }`}>
                Seats
                <ChevronDown className="ml-1 h-3 w-3" />
                {filters.seats.length > 0 && (
                  <span className="ml-2 bg-green-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {filters.seats.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActivePopup('fuel_type')}
                className={`flex items-center px-3 py-1.5 text-sm border rounded-full transition-colors font-normal ${filters.fuel_type.length > 0
                  ? 'border-green-600 bg-green-50 text-green-600'
                  : 'border-gray-300 hover:bg-gray-50 text-black'
                  }`}>
                Fuel Type
                <ChevronDown className="ml-1 h-3 w-3" />
                {filters.fuel_type.length > 0 && (
                  <span className="ml-2 bg-green-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {filters.fuel_type.length}
                  </span>
                )}
              </button>
              <button
                onClick={handleDiscountToggle}
                className={`flex items-center px-3 py-1.5 text-sm border rounded-full transition-colors font-normal ${filters.discount
                  ? 'border-green-600 bg-green-50 text-green-600'
                  : 'border-gray-300 hover:bg-gray-50 text-black'}`}>
                Discount
                {filters.discount && (
                  <span className="ml-2 bg-green-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                    1
                  </span>
                )}
              </button>
              <button
                onClick={() => setActivePopup('price')}
                className={`flex items-center px-3 py-1.5 text-sm border rounded-full transition-colors font-normal ${(priceMin !== 0 || priceMax !== 10000000)
                  ? 'border-green-600 bg-green-50 text-green-600'
                  : 'border-gray-300 hover:bg-gray-50 text-black'
                  }`}
              >
                <span>Price:</span>
                <span className="ml-2">{priceMin.toLocaleString()} — {priceMax.toLocaleString()}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />            <input
              type="text"
              placeholder="Search cars by name, brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-black"
            />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <VehicleList
          key={`${filteredCars.length}-${JSON.stringify(filters)}`}
          vehicles={filteredCars.slice(0, displayedCount)}
          onFavoriteToggle={handleFavoriteToggle}
          favorites={favorites}
          // Pass a custom onBookClick that includes search data
          onBookClick={(car) => {
            setSelectedCar(car);
            setShowRentalModal(true);
          }}
          isLoading={isInitialLoading} noResultType={
            pickUpLocation && pickUpLocation !== 'Pick-up Location' && filteredCars.length === 0
              ? "location"
              : filters.vehicle_type.length || filters.brand.length || filters.seats.length || filters.fuel_type.length || filters.discount
                ? "filter"
                : undefined
          }
          noResultFilter={
            filters.vehicle_type.length
              ? "vehicle_type"
              : filters.brand.length
                ? "brand"
                : filters.seats.length
                  ? "seats"
                  : filters.fuel_type.length
                    ? "fuel_type"
                    : filters.discount
                      ? "discount"
                      : "price"
          }
          // Pass search data to VehicleList for modal
          searchData={{
            pickupLocation: pickUpLocation,
            dropoffLocation: dropOffLocation,
            pickupDate: pickUpDate,
            pickupTime: pickUpTime,
            dropoffDate: dropOffDate,
            dropoffTime: dropOffTime
          }}
        />
        <div ref={loaderRef} className="h-10"></div>
      </div>

      {/* Sử dụng FilterPopup component với hiệu ứng */}      {activePopup === 'vehicle_type' && (
        <FilterPopup
          title="Vehicle Type"
          options={filterOptions.vehicle_type}
          category="vehicle_type"
          onClose={closePopup}
          filters={filters}
          onFilterToggle={handleFilterToggle}
          onClearFilters={(category) => setFilters(prev => ({ ...prev, [category]: [] }))}
          formatDisplay={formatCarTypeDisplay}
        />
      )}
      {activePopup === 'brand' && (
        <FilterPopup
          title="Brand"
          options={filterOptions.brand}
          category="brand"
          onClose={closePopup}
          filters={filters}
          onFilterToggle={handleFilterToggle}
          onClearFilters={(category) => setFilters(prev => ({ ...prev, [category]: [] }))}
        />
      )}
      {activePopup === 'seats' && (
        <FilterPopup
          title="Seats"
          options={filterOptions.seats}
          category="seats"
          onClose={closePopup}
          filters={filters}
          onFilterToggle={handleFilterToggle}
          onClearFilters={(category) => setFilters(prev => ({ ...prev, [category]: [] }))}
        />
      )}
      {activePopup === 'fuel_type' && (
        <FilterPopup
          title="Fuel Type"
          options={filterOptions.fuel_type}
          category="fuel_type"
          onClose={closePopup}
          filters={filters}
          onFilterToggle={handleFilterToggle}
          onClearFilters={(category) => setFilters(prev => ({ ...prev, [category]: [] }))}
        />
      )}
      {activePopup === 'price' && (
        <PricePopup onClose={closePopup} />
      )}
      {showRentalModal && selectedCar && (
        <CarRentalModal
          car={selectedCar}
          onClose={() => setShowRentalModal(false)}
          pickUpLocation={pickUpLocation}
          dropOffLocation={dropOffLocation}
          pickUpDate={pickUpDate}
          pickUpTime={pickUpTime}
          dropOffDate={dropOffDate}
          dropOffTime={dropOffTime}
          // Pass searchData for fallback (if needed)
          searchData={{
            pickupLocation: pickUpLocation,
            dropoffLocation: dropOffLocation,
            pickupDate: pickUpDate,
            pickupTime: pickUpTime,
            dropoffDate: dropOffDate,
            dropoffTime: dropOffTime
          }}
        />
      )}
      <Footer />
    </div>
  );
}