import React, { useState, useEffect } from "react";

// VehicleCard subcomponent for each vehicle
function VehicleCard({ vehicle }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false); // Khởi tạo với false thay vì vehicle.isFavorite
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Đợi component mount xong mới set giá trị thực từ props
  useEffect(() => {
    setIsMounted(true);
    setIsFavorite(vehicle.isFavorite || false);
  }, [vehicle.isFavorite]);

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
  };

  // Không render animation cho đến khi component được mount
  if (!isMounted) {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col border border-gray-200 relative">
        {/* Favorite icon */}
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

        {/* Car image placeholder */}
        <div className="relative w-full h-44 overflow-hidden">
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
            </svg>
          </div>
        </div>

        <div className="p-4 flex flex-col flex-1">
          {/* Vehicle name */}
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-base text-gray-900">
              {vehicle.name}
            </span>
          </div>

          {/* Vehicle details */}
          <div className="flex flex-wrap items-center text-sm text-gray-600 mb-2 gap-x-4 gap-y-1">
            <span className="flex items-center gap-2">
              <img
                src="/icons/IconDetailCarCard/transmission.svg"
                alt="transmission"
                className="w-4 h-4"
              />
              {vehicle.transmission}
            </span>

            <span className="flex items-center gap-2">
              <img
                src="/icons/IconDetailCarCard/seat.svg"
                alt="seats"
                className="w-4 h-4"
              />
              {vehicle.seats} chỗ
            </span>

            <span className="flex items-center gap-2">
              <img
                src="/icons/IconDetailCarCard/fuel.svg"
                alt="fuel"
                className="w-4 h-4"
              />
              {vehicle.fuel}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <span className="flex items-center gap-2">
              <img
                src="/icons/IconDetailCarCard/location.svg"
                alt="location"
                className="w-4 h-4 text-blue-500"
              />
              {vehicle.location}
            </span>
          </div>

          {/* Rating and trips */}
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
                className="w-4 h-4"
              />
              {vehicle.trips} chuyến
            </span>
          </div>

          {/* Price */}
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

          {/* Discount badge */}
          {vehicle.priceDiscount && (
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">
                {vehicle.priceDiscount}
              </span>
            </div>
          )}

          {/* Description */}
          <div className="text-xs text-gray-700 mb-3 line-clamp-2">
            {vehicle.description}
          </div>

          {/* Book button */}
          <button className="mt-auto px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold w-full">
            <span className="flex items-center justify-center gap-2">
              Đặt xe ngay
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-xl shadow-md overflow-hidden flex flex-col border border-gray-200 relative transition-all duration-300 ease-in-out transform ${isHovered ? 'shadow-2xl scale-105 -translate-y-2' : 'hover:shadow-lg'
        }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Favorite icon with animation */}
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

      {/* Car image with loading animation */}
      <div className="relative w-full h-44 overflow-hidden">
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

        {/* Gradient overlay on hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
            }`}
        />
      </div>

      <div className="p-4 flex flex-col flex-1">
        {/* Vehicle name with animation */}
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`font-semibold text-base text-gray-900 transition-colors duration-300 ${isHovered ? 'text-blue-600' : ''
              }`}
          >
            {vehicle.name}
          </span>
        </div>

        {/* Vehicle details with custom icons */}
        <div className="flex flex-wrap items-center text-sm text-gray-600 mb-2 gap-x-4 gap-y-1">
          <span
            className={`flex items-center gap-2 transition-all duration-300 ${isHovered ? 'text-blue-600 transform translate-x-1' : ''
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
            className={`flex items-center gap-2 transition-all duration-300 ${isHovered ? 'text-blue-600 transform translate-x-1' : ''
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
            className={`flex items-center gap-2 transition-all duration-300 ${isHovered ? 'text-blue-600 transform translate-x-1' : ''
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

        {/* Location */}
        <div
          className={`flex items-center text-sm text-gray-600 mb-2 transition-all duration-300 ${isHovered ? 'text-blue-600 transform translate-x-1' : ''
            }`}
        >
          <span className="flex items-center gap-2">
            <img
              src="/icons/IconDetailCarCard/location.svg"
              alt="location"
              className="w-4 h-4 text-blue-500"
            />
            {vehicle.location}
          </span>
        </div>

        {/* Rating and trips */}
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

        {/* Price with animation */}
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

        {/* Discount badge */}
        {vehicle.priceDiscount && (
          <div
            className={`flex items-center gap-2 mb-2 transition-all duration-300 ${isHovered ? 'transform scale-105' : ''
              }`}
          >
            <span className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">
              {vehicle.priceDiscount}
            </span>
          </div>
        )}

        {/* Description */}
        <div className="text-xs text-gray-700 mb-3 line-clamp-2">
          {vehicle.description}
        </div>

        {/* Book button with enhanced animation */}
        <button
          className={`mt-auto px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold transition-all duration-300 w-full transform ${isHovered
              ? 'shadow-lg scale-105 from-blue-700 to-blue-800'
              : 'hover:from-blue-700 hover:to-blue-800 hover:shadow-md'
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
  );
}

// Main VehicleList component with safer animation
export default function VehicleList({ vehicles }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {vehicles.map((vehicle, idx) => (
        <div
          key={vehicle.id || idx} // Sử dụng ID unique thay vì index nếu có
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
          <VehicleCard vehicle={vehicle} />
        </div>
      ))}
    </div>
  );
}