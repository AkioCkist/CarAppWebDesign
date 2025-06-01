import React, { useState, useEffect } from "react";
import CarRentalModal from "./CarRentalModal"; // Import CarRentalModal

// VehicleCard subcomponent for each vehicle
function VehicleCard({ vehicle, onBookClick, onFavoriteToggle, isFavorite }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleFavoriteClick = () => {
    onFavoriteToggle(vehicle.id);
  };

  const handleBookClick = () => {
    onBookClick(vehicle); // Gọi callback với thông tin xe
  };

  if (!isMounted) {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col border border-gray-200 relative h-[450px] w-[250px]">
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg"
        >
          <svg
            className="w-5 h-5 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
          </svg>
        </button>

        <div className="relative w-full h-44 overflow-hidden">
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
            </svg>
          </div>
        </div>

        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-base text-gray-900">
              {vehicle.name}
            </span>
          </div>

          {/* Thay đổi phần div chứa transmission, fuel và seat */}
          <div className="grid grid-cols-3 gap-2 w-[600px] text-sm text-gray-600 mb-2">
            <span
              className={`flex items-center gap-2 transition-all duration-300 ${isHovered ? 'text-green-600 transform translate-x-1' : ''
                }`}
            >
              <img
                src="/icons/IconDetailCarCard/transmission.svg"
                alt="transmission"
                className="w-4 h-4"
              />
              {vehicle.transmission}
            </span>

            <span
              className={`flex items-center gap-2 transition-all duration-300 ${isHovered ? 'text-green-600 transform translate-x-1' : ''
                }`}
            >
              <img
                src="/icons/IconDetailCarCard/seat.svg"
                alt="seats"
                className="w-4 h-4" />
              {vehicle.seats} chỗ
            </span>
            <span
              className={`flex items-center gap-2 transition-all duration-300 ${isHovered ? 'text-green-600 transform translate-x-1' : ''
                }`}>
              <img
                src="/icons/IconDetailCarCard/fuel.svg"
                alt="fuel"
                className="w-4 h-4"
              />
              {vehicle.fuel}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <span className="flex items-center gap-2">
              <img
                src="/icons/IconDetailCarCard/location.svg"
                alt="location"
                className="w-4 h-4 text-green-500" />
              {vehicle.location}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <span className="flex items-center text-yellow-500 gap-1">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {vehicle.rating}
            </span>
            <span className="mx-2 text-gray-400">・</span>
            <span className="flex items-center gap-1">
              <img
                src="/icons/IconDetailCarCard/trips.svg"
                alt="trips"
                className="w-4 h-4" />
              {vehicle.trips} chuyến
            </span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-green-600 font-bold text-lg">
              {vehicle.priceDisplay}
            </span>
            {vehicle.oldPrice && (
              <span className="text-gray-400 line-through text-sm">
                {`${(vehicle.oldPrice / 1000).toFixed(0)}K/${vehicle.pricePer}`}
              </span>
            )}
          </div>
          {vehicle.priceDiscount && (
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-gradient-to-r from-green-100 to-green-200 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                {vehicle.priceDiscount}
              </span>
            </div>
          )}
          <div className="text-xs text-gray-700 mb-3 line-clamp-2 h-8 overflow-hidden">
            {vehicle.description}
          </div>
          <div className="mt-auto">
            <button
              onClick={handleBookClick}
              className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <span className="flex items-center justify-center gap-2">
                Đặt xe ngay
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-xl shadow-md overflow-hidden flex flex-col border border-gray-200 relative h-[520px] w-full transition-all duration-300 ease-in-out transform ${isHovered ? 'shadow-2xl scale-105 -translate-y-2' : 'hover:shadow-lg'
        }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={handleFavoriteClick}
        className={`absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg transition-all duration-300 ${isHovered ? 'scale-110' : ''
          } hover:bg-white hover:scale-125 active:scale-95`}
      >
        <svg
          className={`w-5 h-5 transition-all duration-300 ${isFavorite ? 'text-red-500 scale-110' : 'text-gray-400'
            }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
        </svg>
      </button>

      <div className="relative w-full h-80 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
            </svg>
          </div>
        )}
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className={`w-full h-full object-cover transition-all duration-500 ${isHovered ? 'scale-110' : 'scale-100'
            } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />

        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
            }`}
        />
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`font-semibold text-base text-gray-900 transition-colors duration-300 ${isHovered ? 'text-green-600' : ''
              }`}
          >
            {vehicle.name}
          </span>
        </div>

        <div className="flex flex-wrap items-center text-sm text-gray-600 mb-2 gap-x-4 gap-y-1">
          {/* Thay đổi phần div chứa transmission, fuel và seat */}
          <div className="grid grid-cols-3 gap-2 w-full text-sm text-gray-600 mb-2">
            <span
              className={`flex items-center gap-2 transition-all duration-300 ${isHovered ? 'text-green-600 transform translate-x-1' : ''
                }`}
            >
              <img
                src="/icons/IconDetailCarCard/transmission.svg"
                alt="transmission"
                className="w-4 h-4"
              />
              {vehicle.transmission}
            </span>

            <span
              className={`flex items-center gap-2 transition-all duration-300 ${isHovered ? 'text-green-600 transform translate-x-1' : ''
                }`}
            >
              <img
                src="/icons/IconDetailCarCard/seat.svg"
                alt="seats"
                className="w-4 h-4"
              />
              {vehicle.seats} chỗ
            </span>

            <span
              className={`flex items-center gap-2 transition-all duration-300 ${isHovered ? 'text-green-600 transform translate-x-1' : ''
                }`}
            >
              <img
                src="/icons/IconDetailCarCard/fuel.svg"
                alt="fuel"
                className="w-4 h-4"
              />
              {vehicle.fuel}
            </span>
          </div>
        </div>

        <div
          className={`flex items-center text-sm text-gray-600 mb-2 transition-all duration-300 ${isHovered ? 'text-green-600 transform translate-x-1' : ''
            }`}
        >
          <span className="flex items-center gap-2">
            <img
              src="/icons/IconDetailCarCard/location.svg"
              alt="location"
              className="w-4 h-4 text-green-500"
            />
            {vehicle.location}
          </span>
        </div>

        <div
          className={`flex items-center text-sm text-gray-600 mb-3 transition-all duration-300 ${isHovered ? 'transform translate-x-1' : ''
            }`}
        >
          <span className="flex items-center text-yellow-500 gap-1">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {vehicle.rating}
          </span>
          <span className="mx-2 text-gray-400">・</span>
          <span className="flex items-center gap-1">
            <img
              src="/icons/IconDetailCarCard/trips.svg"
              alt="trips"
              className="w-4 h-4"
            />
            {vehicle.trips} chuyến
          </span>
        </div>

        <div
          className={`flex items-center gap-2 mb-2 transition-all duration-300 ${isHovered ? 'transform scale-105' : ''
            }`}
        >
          <span className="text-green-600 font-bold text-lg">
            {vehicle.priceDisplay}
          </span>
          {vehicle.oldPrice && (
            <span className="text-gray-400 line-through text-sm">
              {`${(vehicle.oldPrice / 1000).toFixed(0)}K/${vehicle.pricePer}`}
            </span>
          )}
        </div>

        {vehicle.priceDiscount && (
          <div
            className={`flex items-center gap-2 mb-2 transition-all duration-300 ${isHovered ? 'transform scale-105' : ''
              }`}
          >
            <span className="bg-gradient-to-r from-green-100 to-green-200 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
              {vehicle.priceDiscount}
            </span>
          </div>
        )}

        <div className="text-xs text-gray-700 mb-3 line-clamp-2 h-8 overflow-hidden">
          {vehicle.description}
        </div>

        <div className="mt-auto">
          <button
            onClick={handleBookClick}
            className={`w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold transition-all duration-300 transform ${isHovered
              ? 'shadow-lg scale-105 from-green-600 to-green-700'
              : 'hover:from-green-600 hover:to-green-700 hover:shadow-md'
              } active:scale-95 active:shadow-inner`}
          >
            <span className="flex items-center justify-center gap-2">
              Đặt xe ngay
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''
                  }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Main VehicleList component with Modal integration
export default function VehicleList({ vehicles, onFavoriteToggle, favorites = [] }) {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dữ liệu tiện nghi mẫu cho các xe (bạn có thể customize theo dữ liệu thực)
  const carAmenities = {
    1: ['bluetooth', 'camera', 'airbag', 'etc'],
    2: ['sunroof', 'sportMode', 'tablet', 'camera360'],
    3: ['map', 'rotateCcw', 'circle', 'package'],
    4: ['shield', 'radar', 'bluetooth', 'camera'],
    // Thêm các ID xe khác...
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleBookClick = (vehicle) => {
    setSelectedCar(vehicle);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCar(null);
  };

  return (
    <>
      {vehicles && vehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle, idx) => (
            <div
              key={vehicle.id || idx}
              className={isMounted ? "animate-fade-in-up" : ""}
              style={
                isMounted
                  ? {
                    animationDelay: `${idx * 100}ms`,
                    animationFillMode: 'both'
                  }
                  : {}
              }
            >
              <VehicleCard
                vehicle={vehicle}
                onBookClick={handleBookClick}
                onFavoriteToggle={onFavoriteToggle}
                isFavorite={favorites.includes(vehicle.id)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <svg
            className="w-16 h-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            Không có xe nào trong mục yêu thích
          </h3>
          <p className="text-gray-500 text-center">
            Hãy thêm xe bạn yêu thích vào danh sách để xem chúng ở đây
          </p>
        </div>
      )}

      {/* CarRentalModal */}
      <CarRentalModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        carData={selectedCar}
        carAmenities={carAmenities}
      />
    </>
  );
}