"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Car, Star, Users, Fuel, Calendar, ChevronDown, X } from 'lucide-react';
import VehicleList from "../../../components/VehicleList";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import CarRentalModal from "../../../components/CarRentalModal";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import CarLoadingScreen from '../../../components/CarLoading';
import { useSearchParams, useRouter } from 'next/navigation';

const cityNameMap = {
  hcm: "Hồ Chí Minh",
  hanoi: "Hà Nội",
  danang: "Đà Nẵng",
  hue: "Huế",
  bacninh: "Bắc Ninh",
  "TP. Hồ Chí Minh": "Hồ Chí Minh",
  "Hà Nội": "Hà Nội",
  "Đà Nẵng": "Đà Nẵng",
  "Huế": "Huế",
  "Bắc Ninh": "Bắc Ninh"
};

function beautifyCityName(val) {
  if (!val) return "";
  return cityNameMap[val] || val;
}

function normalizeCity(str) {
  if (!str) return "";
  str = str.toLowerCase().trim();
  str = str.replace(/tp\.?\s*hcm|thành phố hồ chí minh|hồ chí minh/g, "hcm");
  str = str.replace(/hà nội/g, "hanoi");
  str = str.replace(/đà nẵng/g, "danang");
  str = str.replace(/huế/g, "hue");
  str = str.replace(/bắc ninh/g, "bacninh");
  return str;
}

const CarListingPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCarType, setSelectedCarType] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [activePopup, setActivePopup] = useState(null);
  const [filters, setFilters] = useState({
    carType: [],
    brand: [],
    seats: [],
    fuel: [],
    discount: false
  });
  const [displayedCount, setDisplayedCount] = useState(8);
  const loaderRef = useRef(null);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(10000000);
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    const pickUpLocationFromURL = searchParams.get('pickUpLocation');
    if (pickUpLocationFromURL) {
      setPickUpLocation(beautifyCityName(pickUpLocationFromURL));
      setSelectedLocation(normalizeCity(pickUpLocationFromURL));
    }
  }, [searchParams]);

  // Chỉ fetch API khi đổi location (hoặc lần đầu vào trang)
  useEffect(() => {
    if (!selectedLocation) return;
    setIsLoading(true);

    const params = new URLSearchParams();
    if (selectedLocation) params.append('location', selectedLocation);

    fetch(`/api/vehicles?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setCars(data.records || []);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching cars:', error);
        setIsLoading(false);
      });
  }, [selectedLocation]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const pickUpParam = searchParams.get('pickUpLocation');
      const dropOffParam = searchParams.get('dropOffLocation');
      setSelectedLocation(normalizeCity(pickUpParam) || '');
      setPickUpLocation(beautifyCityName(normalizeCity(pickUpParam)) || 'Địa điểm nhận xe');
      setDropOffLocation(beautifyCityName(normalizeCity(dropOffParam)) || 'Địa điểm trả xe');
      setPickUpDate(searchParams.get('pickUpDate') || '');
      setPickUpTime(searchParams.get('pickUpTime') || '');
      setDropOffDate(searchParams.get('dropOffDate') || '');
      setDropOffTime(searchParams.get('dropOffTime') || '');

      // Đọc filter từ URL
      setFilters({
        carType: searchParams.get('carType') ? searchParams.get('carType').split(',') : [],
        brand: searchParams.get('brand') ? searchParams.get('brand').split(',') : [],
        seats: searchParams.get('seats') ? searchParams.get('seats').split(',') : [],
        fuel: searchParams.get('fuel') ? searchParams.get('fuel').split(',') : [],
        discount: searchParams.get('discount') === '1'
      });

      setPriceMin(Number(searchParams.get('priceMin')) || 0);
      setPriceMax(Number(searchParams.get('priceMax')) || 10000000);

      setSearchTerm(searchParams.get('search') || '');
    }
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

  const priceRanges = ['Tất cả giá', 'Dưới 1 triệu', '1-2 triệu', '2-5 triệu', 'Trên 5 triệu'];
  const filterOptions = {
    carType: ['sedan', 'suv', 'hatchback', 'crossover', 'pickup'],
    brand: ['Toyota', 'Honda', 'Mercedes', 'BMW', 'Audi', 'Hyundai', 'Kia', 'Mazda', 'Nissan'],
    seats: ['2 chỗ', '4 chỗ', '5 chỗ', '7 chỗ', '8+ chỗ'],
    fuel: ['Xăng', 'Dầu', 'Hybrid', 'Điện']
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

  // filteredCars: lọc tất cả filter ở client
  const filteredCars = cars.filter(car => {
    // Search - Sửa lại để tìm trong cả name và location
    const matchesSearch = !searchTerm ||
      car.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.description?.toLowerCase().includes(searchTerm.toLowerCase());
    // Location
    let matchesLocation = true;
    if (selectedLocation) {
      const carCityRaw = car.location?.split('-')[0]?.trim();
      const carCity = normalizeCity(carCityRaw);
      matchesLocation = carCity === selectedLocation;
    }

    // CarType
    const matchesCarType = !filters.carType.length ||
      filters.carType.some(type =>
        car.vehicle_type?.toLowerCase() === type?.toLowerCase()
      );

    // Brand
    const carBrand = car.name?.split(' ')[0];
    const matchesBrand = !filters.brand.length ||
      filters.brand.some(brand =>
        carBrand?.toLowerCase().includes(brand.toLowerCase())
      );

    // Seats
    const matchesSeats = !filters.seats.length ||
      filters.seats.some(seatFilter => {
        const seatNumber = parseInt(seatFilter.split(' ')[0]);
        return car.seats === seatNumber;
      });

    // Fuel
    const matchesFuel = !filters.fuel.length ||
      filters.fuel.some(fuel =>
        car.fuel_type?.toLowerCase() === fuel.toLowerCase() ||
        car.fuel?.toLowerCase() === fuel.toLowerCase()
      );

    // Discount
    const matchesDiscount = !filters.discount || Boolean(car.priceDiscount);

    // Price
    const priceValue = car.base_price ? Number(car.base_price) : 0;
    const matchesPrice = priceValue >= priceMin && priceValue <= priceMax;

    return (
      matchesSearch &&
      matchesLocation &&
      matchesCarType &&
      matchesBrand &&
      matchesSeats &&
      matchesFuel &&
      matchesDiscount &&
      matchesPrice
    );
  });

  const handleFilterToggle = (category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
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

  const FilterPopup = ({ title, options, category, onClose }) => (
    <PopupOverlay onClose={onClose}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-black">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-black-100 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-3">
          {options.map((option) => (
            <label key={option} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters[category].includes(option)}
                onChange={() => handleFilterToggle(category, option)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
              <span className="text-black">
                {category === 'carType' ? formatCarTypeDisplay(option) : option}
              </span>
            </label>
          ))}
        </div>
        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
            Áp dụng
          </button>
          <button
            onClick={() => {
              setFilters(prev => ({ ...prev, [category]: [] }));
              onClose();
            }}
            className="flex-1 px-4 py-2 border border-green-500 text-green-600 rounded-md hover:bg-green-50 transition-colors">
            Xóa bộ lọc
          </button>
        </div>
      </div>
    </PopupOverlay>
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

  // Đồng bộ filter vào URL khi filter thay đổi
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (filters.carType.length) params.set('carType', filters.carType.join(','));
    else params.delete('carType');

    if (filters.brand.length) params.set('brand', filters.brand.join(','));
    else params.delete('brand');

    if (filters.seats.length) params.set('seats', filters.seats.join(','));
    else params.delete('seats');

    if (filters.fuel.length) params.set('fuel', filters.fuel.join(','));
    else params.delete('fuel');

    if (filters.discount) params.set('discount', '1');
    else params.delete('discount');

    params.set('priceMin', priceMin);
    params.set('priceMax', priceMax);

    if (searchTerm) params.set('search', searchTerm);
    else params.delete('search');

    // Giữ các param khác (pickUpLocation, dropOffLocation, ...)
    router.replace(`?${params.toString()}`);
  }, [filters, priceMin, priceMax, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60">
          <CarLoadingScreen />
        </div>
      )}
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
                onClick={() => setActivePopup('carType')}
                className="flex items-center px-3 py-1.5 text-sm border border-gray-300 rounded-full hover:bg-gray-50 transition-colors text-black font-normal"
              >
                Loại Xe
                <ChevronDown className="ml-1 h-3 w-3" />
                {filters.carType.length > 0 && (
                  <span className="ml-2 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {filters.carType.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActivePopup('brand')}
                className="flex items-center px-3 py-1.5 text-sm border border-gray-300 rounded-full hover:bg-gray-50 transition-colors text-black font-normal">
                Hãng Xe
                <ChevronDown className="ml-1 h-3 w-3" />
                {filters.brand.length > 0 && (
                  <span className="ml-2 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {filters.brand.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActivePopup('seats')}
                className="flex items-center px-3 py-1.5 text-sm border border-gray-300 rounded-full hover:bg-gray-50 transition-colors text-black font-normal">
                Số Chỗ
                <ChevronDown className="ml-1 h-3 w-3" />
                {filters.seats.length > 0 && (
                  <span className="ml-2 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {filters.seats.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActivePopup('fuel')}
                className="flex items-center px-3 py-1.5 text-sm border border-gray-300 rounded-full hover:bg-gray-50 transition-colors text-black font-normal">
                Nguyên Liệu
                <ChevronDown className="ml-1 h-3 w-3" />
                {filters.fuel.length > 0 && (
                  <span className="ml-2 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {filters.fuel.length}
                  </span>
                )}
              </button>
              <button
                onClick={handleDiscountToggle}
                className={`flex items-center px-3 py-1.5 text-sm border rounded-full transition-colors text-black font-normal ${filters.discount
                  ? 'border-green-600 bg-green-50 text-green-600'
                  : 'border-gray-300 hover:bg-gray-50'
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
                className="flex items-center px-3 py-1.5 text-sm border border-gray-300 rounded-full text-black font-normal hover:bg-gray-50"
              >
                <span>Giá:</span>
                <span className="ml-2 text-gray-700">{priceMin.toLocaleString()} — {priceMax.toLocaleString()}</span>
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
          vehicles={filteredCars.slice(0, displayedCount)}
          onFavoriteToggle={handleFavoriteToggle}
          favorites={favorites}
          onBookClick={(car) => {
            setSelectedCar(car);
            setShowRentalModal(true);
          }}
          noResultType={
            pickUpLocation && pickUpLocation !== 'Địa điểm nhận xe' && filteredCars.length === 0
              ? "location"
              : filters.carType.length
                ? "filter"
                : filters.brand.length
                  ? "filter"
                  : filters.seats.length
                    ? "filter"
                    : filters.fuel.length
                      ? "filter"
                      : filters.discount
                        ? "filter"
                        : priceRange && priceRange !== 'Tất cả giá'
                          ? "filter"
                          : undefined
          }
          noResultFilter={
            filters.carType.length
              ? "carType"
              : filters.brand.length
                ? "brand"
                : filters.seats.length
                  ? "seats"
                  : filters.fuel.length
                    ? "fuel"
                    : filters.discount
                      ? "discount"
                      : priceRange && priceRange !== 'Tất cả giá'
                        ? "price"
                        : undefined
          }
        />
        <div ref={loaderRef} className="h-10"></div>
      </div>
      {activePopup === 'carType' && (
        <FilterPopup
          title="Loại Xe"
          options={filterOptions.carType}
          category="carType"
          onClose={closePopup}
        />
      )}
      {activePopup === 'brand' && (
        <FilterPopup
          title="Hãng Xe"
          options={filterOptions.brand}
          category="brand"
          onClose={closePopup}
        />
      )}
      {activePopup === 'seats' && (
        <FilterPopup
          title="Số Chỗ"
          options={filterOptions.seats}
          category="seats"
          onClose={closePopup}
        />
      )}
      {activePopup === 'fuel' && (
        <FilterPopup
          title="Nguyên Liệu"
          options={filterOptions.fuel}
          category="fuel"
          onClose={closePopup}
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