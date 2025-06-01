"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Car, Star, Users, Fuel, Calendar, ChevronDown, X } from 'lucide-react';
import VehicleList from "../../../components/VehicleList";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import CarRentalModal from "../../../components/CarRentalModal"; // import component

const carAmenities = {
  1: ['bluetooth', 'camera', 'airbag', 'etc'],
  2: ['bluetooth', 'camera', 'airbag', 'etc', 'sunroof', 'sportMode'],
  3: ['bluetooth', 'camera', 'airbag', 'etc', 'tablet'],
  4: ['bluetooth', 'camera', 'airbag', 'etc', 'sunroof', 'sportMode', 'camera360'],
  5: ['bluetooth', 'camera', 'airbag', 'etc', 'map'],
  6: ['bluetooth', 'camera', 'airbag', 'etc', 'rotateCcw', 'circle'],
  7: ['bluetooth', 'camera', 'airbag', 'etc', 'package', 'shield'],
  8: ['bluetooth', 'camera', 'airbag', 'etc', 'radar', 'sunroof'],
};

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

  // Sample car data adapted for VehicleList
  const cars = [
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
    },
    {
      id: 4,
      name: 'Lamborghini SC18 ALSTON',
      image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=250&fit=crop',
      transmission: 'Tự động',
      fuel: 'Xăng',
      seats: 2,
      location: 'Quận Cẩm Lệ, Đà Nẵng',
      rating: 5.0,
      trips: 37,
      priceDisplay: '14865K',
      oldPrice: 16810000,
      pricePer: 'ngày',
      priceDiscount: 'Giảm 11%',
      description: 'Siêu xe độc nhất với thiết kế ấn tượng.yeyeyeyyeyeyeeeeeeeeeeeeeeeeeeeeeeeeeeeeê',
      isFavorite: false
    },
    {
      id: 5,
      name: 'BMW X3 2020',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=250&fit=crop',
      transmission: 'Tự động',
      fuel: 'Xăng',
      seats: 5,
      location: 'Quận Hải Châu, Đà Nẵng',
      rating: 4.9,
      trips: 45,
      priceDisplay: '1200K',
      oldPrice: 1350000,
      pricePer: 'ngày',
      priceDiscount: 'Giảm 11%',
      description: 'SUV cao cấp với nội thất tiện nghi.',
      isFavorite: false
    },
    {
      id: 6,
      name: 'Mercedes C-Class',
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=250&fit=crop',
      transmission: 'Tự động',
      fuel: 'Xăng',
      seats: 5,
      location: 'Quận Thanh Khê, Đà Nẵng',
      rating: 4.7,
      trips: 28,
      priceDisplay: '1500K',
      oldPrice: 1800000,
      pricePer: 'ngày',
      priceDiscount: 'Giảm 17%',
      description: 'Sedan sang trọng với công nghệ hiện đại.',
      isFavorite: false
    },
    {
      id: 7,
      name: 'Toyota Camry 2022',
      image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=250&fit=crop',
      transmission: 'Tự động',
      fuel: 'Xăng',
      seats: 5,
      location: 'Quận Liên Chiểu, Đà Nẵng',
      rating: 4.8,
      trips: 62,
      priceDisplay: '950K',
      oldPrice: 1100000,
      pricePer: 'ngày',
      priceDiscount: 'Giảm 14%',
      description: 'Sedan đáng tin cậy với mức giá hợp lý.',
      isFavorite: false
    },
    {
      id: 8,
      name: 'Honda Civic 2023',
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=250&fit=crop',
      transmission: 'Tự động',
      fuel: 'Xăng',
      seats: 5,
      location: 'Quận Ngũ Hành Sơn, Đà Nẵng',
      rating: 4.6,
      trips: 18,
      priceDisplay: '800K',
      oldPrice: 920000,
      pricePer: 'ngày',
      priceDiscount: 'Giảm 13%',
      description: 'Sedan thể thao với thiết kế trẻ trung.',
      isFavorite: false
    }
  ];

  const locations = ['Tất cả địa điểm', 'Quận Sơn Trà', 'Quận Hải Châu', 'Quận Thanh Khê', 'Quận Liên Chiểu', 'Quận Cẩm Lệ', 'Quận Ngũ Hành Sơn'];
  const carTypes = ['Tất cả loại xe', '2 chỗ', '5 chỗ', '7 chỗ', 'SUV', 'Sedan'];
  const priceRanges = ['Tất cả giá', 'Dưới 1 triệu', '1-2 triệu', '2-5 triệu', 'Trên 5 triệu'];

  // Filter options
  const filterOptions = {
    carType: ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Pickup'],
    brand: ['Toyota', 'Honda', 'Mercedes', 'BMW', 'Audi', 'Porsche', 'Lamborghini', 'Suzuki'],
    seats: ['2 chỗ', '4 chỗ', '5 chỗ', '7 chỗ', '8+ chỗ'],
    fuel: ['Xăng', 'Dầu', 'Hybrid', 'Điện']
  };

  // Filter cars based on search term and filters
  const filteredCars = cars.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation === 'Tất cả địa điểm' || !selectedLocation || car.location.includes(selectedLocation);
    const matchesCarType = selectedCarType === 'Tất cả loại xe' || !selectedCarType ||
      (selectedCarType.includes('chỗ') ? `${car.seats} chỗ` === selectedCarType : car.carType === selectedCarType);
    const priceValue = parseInt(car.priceDisplay.replace('K', '')) * 1000;
    const matchesPrice = priceRange === 'Tất cả giá' || !priceRange ||
      (priceRange === 'Dưới 1 triệu' && priceValue < 1000000) ||
      (priceRange === '1-2 triệu' && priceValue >= 1000000 && priceValue <= 2000000) ||
      (priceRange === '2-5 triệu' && priceValue > 2000000 && priceValue <= 5000000) ||
      (priceRange === 'Trên 5 triệu' && priceValue > 5000000);
    const matchesFilters = (!filters.carType.length || filters.carType.includes(car.carType)) &&
      (!filters.brand.length || filters.brand.includes(car.name.split(' ')[0])) &&
      (!filters.seats.length || filters.seats.includes(`${car.seats} chỗ`)) &&
      (!filters.fuel.length || filters.fuel.includes(car.fuel)) &&
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
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-black">{option}</span>
            </label>
          ))}
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Áp dụng
          </button>
          <button
            onClick={() => {
              setFilters(prev => ({ ...prev, [category]: [] }));
              onClose();
            }}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
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

    // Đảm bảo min không lớn hơn max và ngược lại
    const handleMinChange = (e) => {
      const value = Math.min(Number(e.target.value), priceMax - step);
      setPriceMin(value);
    };
    const handleMaxChange = (e) => {
      const value = Math.max(Number(e.target.value), priceMin + step);
      setPriceMax(value);
    };

    // Khi kéo thanh slider
    const handleSliderMin = (e) => {
      const value = Math.min(Number(e.target.value), priceMax - step);
      setPriceMin(value);
    };
    const handleSliderMax = (e) => {
      const value = Math.max(Number(e.target.value), priceMin + step);
      setPriceMax(value);
    };

    return (
      <PopupOverlay onClose={onClose}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-black">Chọn khoảng giá</h3>
            <button onClick={onClose} className="p-1 hover:bg-black-100 rounded">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center space-x-4 mb-6">
            <input
              type="number"
              min={minLimit}
              max={priceMax - step}
              step={step}
              value={priceMin}
              onChange={handleMinChange}
              className="w-28 px-2 py-1 border border-gray-300 rounded text-black"
              placeholder="Từ"
            />
            <span className="text-gray-500">—</span>
            <input
              type="number"
              min={priceMin + step}
              max={maxLimit}
              step={step}
              value={priceMax}
              onChange={handleMaxChange}
              className="w-28 px-2 py-1 border border-gray-300 rounded text-black"
              placeholder="Đến"
            />
          </div>
          {/* Thanh kéo đôi custom */}
          <div className="relative w-full mb-6" style={{ height: 40 }}>
            <input
              type="range"
              min={minLimit}
              max={maxLimit}
              step={step}
              value={priceMin}
              onChange={handleSliderMin}
              className="absolute pointer-events-none w-full accent-blue-600"
              style={{ zIndex: priceMin > maxLimit - 100000 ? 5 : 6 }}
            />
            <input
              type="range"
              min={minLimit}
              max={maxLimit}
              step={step}
              value={priceMax}
              onChange={handleSliderMax}
              className="absolute pointer-events-none w-full accent-blue-600"
              style={{ zIndex: 7 }}
            />
            {/* Thanh màu giữa hai đầu */}
            <div
              className="absolute h-1 bg-blue-500 rounded"
              style={{
                left: `${((priceMin - minLimit) / (maxLimit - minLimit)) * 100}%`,
                width: `${((priceMax - priceMin) / (maxLimit - minLimit)) * 100}%`,
                top: 16,
                zIndex: 1,
              }}
            />
          </div>
          <div className="flex justify-between w-full text-xs text-gray-500 mt-1 mb-4">
            <span>0</span>
            <span>10.000.000</span>
          </div>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
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
    <div className="min-h-screen bg-gray-50">
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
              <span className="font-medium text-gray-900">Đà Nẵng</span>
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600 text-sm">21:00 14/05/2025 - 20:00 15/05/2025</span>
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
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-300 hover:bg-gray-50'
                  }`}>
                Giảm Giá
                {filters.discount && (
                  <span className="ml-2 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
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