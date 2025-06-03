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
import { useSearchParams } from 'next/navigation'; // Thêm dòng này

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
  // Nếu là mã thì chuyển, nếu là tên thì giữ nguyên
  return cityNameMap[val] || val;
}

// Chuẩn hóa tên thành phố để so sánh
function normalizeCity(str) {
  if (!str) return "";
  str = str.toLowerCase().trim();
  // Quy về dạng không dấu, viết thường, bỏ ký tự đặc biệt
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
  const [displayedCount, setDisplayedCount] = useState(8); // Initial number of vehicles to display
  const loaderRef = useRef(null);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(10000000);
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // đã có

  useEffect(() => {
    setIsLoading(true);
    fetch('http://localhost/myapi/vehicles.php')
      .then(res => res.json())
      .then(data => {
        setCars(data.records || []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);
  const priceRanges = ['Tất cả giá', 'Dưới 1 triệu', '1-2 triệu', '2-5 triệu', 'Trên 5 triệu'];

  // Filter options
  const filterOptions = {
    carType: ['sedan', 'suv', 'hatchback', 'crossover', 'pickup'],
    brand: ['Toyota', 'Honda', 'Mercedes', 'BMW', 'Audi', 'Porsche', 'Lamborghini', 'Suzuki'],
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

  const [pickUpLocation, setPickUpLocation] = useState('Địa điểm nhận xe');
  const [dropOffLocation, setDropOffLocation] = useState('Địa điểm trả xe');
  const [pickUpDate, setPickUpDate] = useState('');
  const [pickUpTime, setPickUpTime] = useState('');
  const [dropOffDate, setDropOffDate] = useState('');
  const [dropOffTime, setDropOffTime] = useState('');

  // Lấy search params sau khi mounted
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      setPickUpLocation(beautifyCityName(searchParams.get('pickUpLocation')) || 'Địa điểm nhận xe');
      setDropOffLocation(beautifyCityName(searchParams.get('dropOffLocation')) || 'Địa điểm trả xe');
      setPickUpDate(searchParams.get('pickUpDate') || '');
      setPickUpTime(searchParams.get('pickUpTime') || '');
      setDropOffDate(searchParams.get('dropOffDate') || '');
      setDropOffTime(searchParams.get('dropOffTime') || '');
    }
  }, []);

  // Filter cars based on search term and filters
  const filteredCars = cars.filter(car => {
    const matchesSearch = car.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.brand?.toLowerCase().includes(searchTerm.toLowerCase());

    // Lọc theo thành phố lấy từ pickUpLocation
    let matchesLocation = true;
    if (pickUpLocation && pickUpLocation !== 'Địa điểm nhận xe') {
      // Lấy phần tên thành phố đầu tiên trong location của xe
      const carCityRaw = car.location?.split('-')[0]?.trim();
      const carCity = normalizeCity(carCityRaw);
      const pickUpCity = normalizeCity(pickUpLocation);
      matchesLocation = carCity === pickUpCity;
    }

    //filter loại xe: dùng vehicle_type
    const matchesCarType = selectedCarType === 'Tất cả loại xe' || !selectedCarType ||
      (selectedCarType.includes('chỗ') ? `${car.seats} chỗ` === selectedCarType :
        car.vehicle_type?.toLowerCase() === selectedCarType?.toLowerCase());

    // Sửa filter giá: dùng base_price (giả sử đơn vị là VND)
    const priceValue = car.base_price ? Number(car.base_price) : 0;
    const matchesPrice = priceRange === 'Tất cả giá' || !priceRange ||
      (priceRange === 'Dưới 1 triệu' && priceValue < 1000000) ||
      (priceRange === '1-2 triệu' && priceValue >= 1000000 && priceValue <= 2000000) ||
      (priceRange === '2-5 triệu' && priceValue > 2000000 && priceValue <= 5000000) ||
      (priceRange === 'Trên 5 triệu' && priceValue > 5000000);

    // Sửa filter nâng cao: dùng vehicle_type thay vì carType
    const matchesFilters =
      (!filters.carType.length || filters.carType.some(type =>
        car.vehicle_type?.toLowerCase() === type?.toLowerCase())) &&
      (!filters.brand.length || filters.brand.includes(car.name?.split(' ')[0])) &&
      (!filters.seats.length || filters.seats.includes(`${car.seats} chỗ`)) &&
      (!filters.fuel.length || filters.fuel.includes(car.fuel_type || car.fuel)) &&
      (!filters.discount || car.priceDiscount);
    return matchesSearch && matchesLocation && matchesCarType && matchesPrice && matchesFilters;
  });

  // Handle filter toggle
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

  // Thêm useEffect để khóa scroll khi popup mở
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
                  marginTop: -8, // căn giữa dot với thanh trượt cao 6px
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
              railStyle={{ background: '#e5e7eb', height: 6 }} // màu xám nhạt cho rail
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

  const [selectedCar, setSelectedCar] = useState(null);
  const [showRentalModal, setShowRentalModal] = useState(false);

  // Thêm state favorites
  const [favorites, setFavorites] = useState([]);

  // Thêm hàm xử lý favorite toggle
  const handleFavoriteToggle = (vehicleId) => {
    setFavorites(prev => {
      if (prev.includes(vehicleId)) {
        return prev.filter(id => id !== vehicleId);
      } else {
        return [...prev, vehicleId];
      }
    });
  };

  // Infinite scrolling logic
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

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60">
          <CarLoadingScreen />
        </div>
      )}
      {/* Navigation Header */}
      <Header />
      {/* Spacer để header chiếm chỗ, chỉnh h-20 cho đúng chiều cao Header */}
      <div className="h-21 bg-gray-800/95"></div>

      {/* Location & Time Bar */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <MapPin className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-gray-900">{pickUpLocation}</span>
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

      {/* Filter Header */}
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

      {/* Search Section */}
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

      {/* Car Grid */}
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

      {/* Popups */}
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

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CarListingPage;