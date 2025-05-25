import React from "react";

// VehicleCard subcomponent for each vehicle
function VehicleCard({ vehicle }) {
  return (
    <div className="bg-white rounded-xl shadow p-0 flex flex-col hover:shadow-lg transition border border-gray-200 relative">
      {/* Favorite icon */}
      <button className="absolute top-3 right-3 z-10 bg-white rounded-full p-1 shadow-md hover:bg-gray-100">
        <svg className={`w-6 h-6 ${vehicle.isFavorite ? 'text-red-500' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
        </svg>
      </button>
      {/* Car image */}
      <img src={vehicle.image} alt={vehicle.name} className="w-full h-44 object-cover rounded-t-xl" />
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-base text-gray-900">{vehicle.name}</span>
        </div>
        <div className="flex flex-wrap items-center text-sm text-gray-600 mb-1 gap-x-3 gap-y-1">
          <span className="flex items-center gap-1"><i className="bi bi-gear"></i>{vehicle.transmission}</span>
          <span className="flex items-center gap-1"><i className="bi bi-person"></i>{vehicle.seats} chỗ</span>
          <span className="flex items-center gap-1"><i className="bi bi-fuel-pump"></i>{vehicle.fuel}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600 mb-2">
          <span className="flex items-center"><i className="bi bi-geo-alt text-blue-500 mr-1"></i>{vehicle.location}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <span className="flex items-center text-yellow-500"><i className="bi bi-star-fill mr-1"></i>{vehicle.rating}</span>
          <span className="mx-2">・</span>
          <span className="flex items-center"><i className="bi bi-geo mr-1"></i>{vehicle.trips} chuyến</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-green-600 font-bold text-lg">{vehicle.priceDisplay}</span>
          <span className="text-gray-400 line-through text-sm">{vehicle.oldPrice ? `${(vehicle.oldPrice/1000).toFixed(0)}K/${vehicle.pricePer}` : ''}</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">{vehicle.priceDiscount}</span>
        </div>
        <div className="text-xs text-gray-700 mb-2">{vehicle.description}</div>
        <button className="mt-auto px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition w-full">Đặt xe ngay</button>
      </div>
    </div>
  );
}

// Main VehicleList component
export default function VehicleList({ vehicles }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {vehicles.map((vehicle, idx) => (
        <VehicleCard key={idx} vehicle={vehicle} />
      ))}
    </div>
  );
} 