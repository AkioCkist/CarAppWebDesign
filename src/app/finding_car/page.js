"use client";
import React, { use, useState } from 'react';
import { Search, MapPin, Car, Star, Users, Fuel, Calendar, ChevronDown, X } from 'lucide-react';

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

  // Sample car data
  const cars = [
    {
      id: 1,
      name: 'Porsche 911',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=250&fit=crop',
      engine: 'Xăng tự động',
      seats: 2,
      location: 'Quận Sơn Trà, Đà Nẵng',
      rating: 5.0,
      trips: 37,
      price: '865K',
      originalPrice: '980K'
    },
    {
      id: 2,
      name: 'Porsche 911 GT3 R rennsport',
      image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=250&fit=crop',
      engine: 'Xăng tự động',
      seats: 2,
      location: 'Quận Sơn Trà, Đà Nẵng',
      rating: 5.0,
      trips: 170,
      price: '5585K',
      originalPrice: '6412K'
    },
    {
      id: 3,
      name: 'SUZUKI XL7 2021',
      image: 'https://images.unsplash.com/photo-1549399592-91b8e56a6b26?w=400&h=250&fit=crop',
      engine: 'Xăng tự động',
      seats: 7,
      location: 'Quận Sơn Trà, Đà Nẵng',
      rating: 4.8,
      trips: 2,
      price: '865K',
      originalPrice: '912K'
    },
    {
      id: 4,
      name: 'Lamborghini SC18 ALSTON',
      image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=250&fit=crop',
      engine: 'Xăng tự động',
      seats: 2,
      location: 'Quận Cẩm Lệ, Đà Nẵng',
      rating: 5.0,
      trips: 37,
      price: '14865K',
      originalPrice: '16810K'
    },
    {
      id: 5,
      name: 'BMW X3 2020',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=250&fit=crop',
      engine: 'Xăng tự động',
      seats: 5,
      location: 'Quận Hải Châu, Đà Nẵng',
      rating: 4.9,
      trips: 45,
      price: '1200K',
      originalPrice: '1350K'
    },
    {
      id: 6,
      name: 'Mercedes C-Class',
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=250&fit=crop',
      engine: 'Xăng tự động',
      seats: 5,
      location: 'Quận Thanh Khê, Đà Nẵng',
      rating: 4.7,
      trips: 28,
      price: '1500K',
      originalPrice: '1800K'
    },
    {
      id: 7,
      name: 'Toyota Camry 2022',
      image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=250&fit=crop',
      engine: 'Xăng tự động',
      seats: 5,
      location: 'Quận Liên Chiểu, Đà Nẵng',
      rating: 4.8,
      trips: 62,
      price: '950K',
      originalPrice: '1100K'
    },
    {
      id: 8,
      name: 'Honda Civic 2023',
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=250&fit=crop',
      engine: 'Xăng tự động',
      seats: 5,
      location: 'Quận Ngũ Hành Sơn, Đà Nẵng',
      rating: 4.6,
      trips: 18,
      price: '800K',
      originalPrice: '920K'
    }
  ];

  const locations = ['Tất cả địa điểm', 'Quận Sơn Trá', 'Quận Hải Châu', 'Quận Thanh Khê', 'Quận Liên Chiểu', 'Quận Cẩm Lệ', 'Quận Ngũ Hành Sơn'];
  const carTypes = ['Tất cả loại xe', '2 chỗ', '5 chỗ', '7 chỗ', 'SUV', 'Sedan'];
  const priceRanges = ['Tất cả giá', 'Dưới 1 triệu', '1-2 triệu', '2-5 triệu', 'Trên 5 triệu'];

  // Filter options
  const filterOptions = {
    carType: ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Pickup'],
    brand: ['Toyota', 'Honda', 'Mercedes', 'BMW', 'Audi', 'Porsche', 'Lamborghini', 'Suzuki'],
    seats: ['2 chỗ', '4 chỗ', '5 chỗ', '7 chỗ', '8+ chỗ'],
    fuel: ['Xăng', 'Dầu', 'Hybrid', 'Điện']
  };

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

  const PopupOverlay = ({ children, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-96 overflow-y-auto" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );

  const FilterPopup = ({ title, options, category, onClose }) => (
    <PopupOverlay onClose={onClose}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
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
              <span className="text-gray-700">{option}</span>
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
              setFilters(prev => ({...prev, [category]: []}));
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
            <span className="text-sm text-gray-600 mr-4">Bộ Lọc:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActivePopup('carType')}
                className="flex items-center px-3 py-1.5 text-sm border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
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
                className="flex items-center px-3 py-1.5 text-sm border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
              >
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
                className="flex items-center px-3 py-1.5 text-sm border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
              >
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
                className="flex items-center px-3 py-1.5 text-sm border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
              >
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
                className={`flex items-center px-3 py-1.5 text-sm border rounded-full transition-colors ${
                  filters.discount 
                    ? 'border-blue-600 bg-blue-50 text-blue-600' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                Giảm Giá
                {filters.discount && (
                  <span className="ml-2 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                    1
                  </span>
                )}
              </button>
              
              <div className="flex items-center px-3 py-1.5 text-sm border border-gray-300 rounded-full">
                <span className="text-gray-500">Giá:</span>
                <span className="ml-2 text-gray-700">0 ——————— 10000000</span>
              </div>
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
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Car Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cars.map((car) => (
            <div key={car.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Car Image */}
              <div className="relative">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-48 object-cover"
                />
                <button className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              {/* Car Details */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{car.name}</h3>
                
                {/* Car Specs */}
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Fuel className="h-4 w-4 mr-1" />
                  <span className="mr-3">{car.engine}</span>
                  <Users className="h-4 w-4 mr-1" />
                  <span>{car.seats} chỗ</span>
                </div>

                {/* Location */}
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="line-clamp-1">{car.location}</span>
                </div>

                {/* Rating and Trips */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-sm font-medium">{car.rating}</span>
                    <span className="text-sm text-gray-500 ml-2">{car.trips} chuyến</span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-lg font-bold text-gray-900">{car.price}</span>
                    <span className="text-sm text-gray-500">/ngày</span>
                    {car.originalPrice && (
                      <div className="text-sm text-gray-400 line-through">{car.originalPrice}</div>
                    )}
                  </div>
                </div>

                {/* Book Button */}
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium">
                  Chuyến
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-8">
          <button className="bg-gray-200 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors">
            Xem thêm xe
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarListingPage;