"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
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

function beautifyCityName(str) {
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

const CarListingPage = () => {
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
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [pickUpLocation, setPickUpLocation] = useState('Địa điểm nhận xe');
  const [dropOffLocation, setDropOffLocation] = useState('Địa điểm trả xe');
  const [pickUpDate, setPickUpDate] = useState('');
  const [pickUpTime, setPickUpTime] = useState('');
  const [dropOffDate, setDropOffDate] = useState('');
  const [dropOffTime, setDropOffTime] = useState('');
  const [selectedCar, setSelectedCar] = useState(null);
  const [showRentalModal, setShowRentalModal] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const searchParams = useSearchParams();
  const router = useRouter();

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

      const newSelectedLocation = normalizeCity(pickUpParam) || '';
      const newPickUpLocation = beautifyCityName(normalizeCity(pickUpParam)) || 'Địa điểm nhận xe';
      const newDropOffLocation = beautifyCityName(normalizeCity(dropOffParam)) || 'Địa điểm trả xe';
      const newFilters = {
        vehicle_type: params.get('vehicle_type') ? params.get('vehicle_type').split(',') : [],
        brand: params.get('brand') ? params.get('brand').split(',') : [],
        seats: params.get('seats') ? params.get('seats').split(',').map(s => `${s} chỗ`) : [],
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

  useEffect(() => {
    return () => {
      if (fetchController.current) {
        fetchController.current.abort();
      }
    };
  }, []);

  const handleFavoriteToggle = async (vehicleId) => {
    const isCurrentlyFavorite = favorites.includes(vehicleId);
    setFavorites(prev =>
      isCurrentlyFavorite
        ? prev.filter(id => id !== vehicleId)
        : [...prev, vehicleId]
    );

    try {
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle_favorite',
          vehicle_id: vehicleId,
          is_favorite: !isCurrentlyFavorite
        })
      });
      const result = await response.json();
      if (!response.ok) {
        console.error('Failed to toggle favorite:', result.message);
        setFavorites(prev =>
          isCurrentlyFavorite
            ? [...prev, vehicleId]
            : prev.filter(id => id !== vehicleId)
        );
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setFavorites(prev =>
        isCurrentlyFavorite
          ? [...prev, vehicleId]
          : prev.filter(id => id !== vehicleId)
      );
    }
  };

  const filterOptions = {
    vehicle_type: ['sedan', 'suv', 'hatchback', 'crossover', 'pickup'],
    brand: ['Toyota', 'Honda', 'Mercedes', 'BMW', 'Audi', 'Hyundai', 'Kia', 'Mazda', 'Nissan'],
    seats: ['2 chỗ', '4 chỗ', '5 chỗ', '7 chỗ', '8+ chỗ'],
    fuel_type: ['Xăng', 'Dầu', 'Hybrid', 'Điện']
  };

  const formatCarTypeDisplay = (type) => {
    const typeMap = {
      'sedan': 'Sedan',
      'suv': 'SUV',
      'hatchback': 'Hatchback',
      'crossover': 'Crossover',
      'pickup': 'Pickup'
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
    const minLimit = 0;
    const maxLimit = 10000000;
    const step = 100000;
    const [values, setValues] = useState([priceMin, priceMax]);
    const formatNumber = (num) => num.toLocaleString();
    const handleChange = (newValues) => {
      setValues(newValues);
    };

    const handleAfterChange = (newValues) => {
      setPriceMin(newValues[0]);
      setPriceMax(newValues[1]);
    };

    return (
      <PopupOverlay onClose={onClose}>
        <div className="p-6">
          <h3 className="text-lg font-bold text-black">Chọn khoảng giá</h3>
          <div className="flex space-x-4 mt-4">
            <div className="flex-1">
              <label className="block text-sm text-black">Từ</label>
              <input
                type="text"
                value={formatNumber(values[0])}
                onChange={(e) => {
                  const v = parseInt(e.target.value.replace(/,/g, '')) || 0;
                  if (v <= values[1]) setValues([v, values[1]]);
                }}
                className="w-full border rounded px-2 py-1 text-black placeholder:text-black"
                placeholder="0"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-black">Đến</label>
              <input
                type="text"
                value={formatNumber(values[1])}
                onChange={(e) => {
                  const v = parseInt(e.target.value.replace(/,/g, '')) || 0;
                  if (v >= values[0]) setValues([values[0], v]);
                }}
                className="w-full border rounded px-2 py-1 text-black placeholder:text-black"
                placeholder="10.000.000"
              />
            </div>
          </div>
          <div className="mt-6 px-2">
            <Slider
              range
              min={minLimit}
              max={maxLimit}
              step={step}
              defaultValue={[priceMin, priceMax]}
              value={values}
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
          <button
            onClick={onClose}
            className="mt-6 w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
            Áp dụng
          </button>
        </div>
      </PopupOverlay>
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
              <MapPin className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-gray-900">
                {beautifyCityName(selectedLocation) || 'Địa điểm nhận xe'}
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
          <div className="flex items-center py-3">
            <span className="text-sm text-black font-semibold mr-4">Bộ Lọc:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActivePopup('vehicle_type')}
                className={`flex items-center px-3 py-1.5 text-sm border rounded-full transition-colors font-normal ${filters.vehicle_type.length > 0
                  ? 'border-green-600 bg-green-50 text-green-600'
                  : 'border-gray-300 hover:bg-gray-50 text-black'
                  }`}
              >
                Loại Xe
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
                Hãng Xe
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
                Số Chỗ
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
                Nguyên Liệu
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
                  : 'border-gray-300 hover:bg-gray-50 text-black'
                  }`}>
                Giảm Giá
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
                <span>Giá:</span>
                <span className="ml-2">{priceMin.toLocaleString()} — {priceMax.toLocaleString()}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm xe theo tên, hãng..."
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
          onBookClick={(car) => {
            setSelectedCar(car);
            setShowRentalModal(true);
          }}
          isLoading={isInitialLoading}
          noResultType={
            pickUpLocation && pickUpLocation !== 'Địa điểm nhận xe' && filteredCars.length === 0
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
        />
        <div ref={loaderRef} className="h-10"></div>
      </div>

      {/* Sử dụng FilterPopup component với hiệu ứng */}
      {activePopup === 'vehicle_type' && (
        <FilterPopup
          title="Loại Xe"
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
          title="Hãng Xe"
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
          title="Số Chỗ"
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
          title="Nguyên Liệu"
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
        />
      )}
      <Footer />
    </div>
  );
};

export default CarListingPage;