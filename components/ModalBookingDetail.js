import React, { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  User,
  Phone,
  Car,
  Gauge,
  Users,
  Star,
  DollarSign,
  CheckCircle,
} from 'lucide-react';

export default function ModalBookingDetail({ booking, onClose }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (booking) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [booking]);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!booking && !isOpen) return null;

  const formatDate = (date) => {
    if (!date) return '--';
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate.getTime())) {
      const d = parsedDate.getDate().toString().padStart(2, '0');
      const m = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
      const y = parsedDate.getFullYear();
      return `${d}/${m}/${y}`;
    }
    return '--';
  };

  const formatTime = (time) => {
    if (!time) return '';
    const parsed = new Date(time);
    if (!isNaN(parsed)) {
      const h = parsed.getHours().toString().padStart(2, '0');
      const m = parsed.getMinutes().toString().padStart(2, '0');
      return `${h}:${m}`;
    }
    return time;
  };

  const formatPrice = (price) => {
    if (price == null) return '--';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
      confirmed: 'bg-blue-100 text-blue-800 border border-blue-300',
      ongoing: 'bg-green-100 text-green-800 border border-green-300',
      completed: 'bg-gray-100 text-gray-800 border border-gray-300',
      cancelled: 'bg-red-100 text-red-800 border border-red-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      ongoing: 'Ongoing',
      completed: 'Completed',
      cancelled: 'Cancelled',
    };
    return texts[status] || status;
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all duration-300 ease-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-2xl shadow-xl p-6 max-w-5xl w-full relative transform transition-all duration-300 ease-out ${isOpen ? 'scale-100' : 'scale-95'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl p-2 rounded-full hover:bg-gray-100"
          onClick={handleClose}
        >
          &times;
        </button>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold text-gray-900">
              Booking Details <span className="text-base text-gray-500">(ID: {booking.id})</span>
            </h2>
            <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${getStatusColor(booking.status)}`}>{getStatusText(booking.status)}</span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Vehicle Image */}
          <div className="col-span-1 rounded-xl overflow-hidden">
            {booking.vehicle?.image && (
              <img src={booking.vehicle.image} alt={booking.vehicle.name} className="w-full h-48 object-cover rounded-lg" />
            )}
            <h3 className="text-2xl font-extrabold text-gray-900 mt-4">{booking.vehicle?.name || '--'}</h3>
          </div>

          {/* Vehicle Info */}
          <div className="col-span-1 bg-gray-50 rounded-xl p-4">
            <ul className="space-y-2 text-sm text-gray-900">
              <li className="flex items-center gap-2"><Car className="w-4 h-4 text-green-500" /> <span className="font-bold">Type:</span> <span className="font-medium">{booking.vehicle.vehicle_type}</span></li>
              <li className="flex items-center gap-2"><Gauge className="w-4 h-4 text-green-500" /> <span className="font-bold">Transmission:</span> <span className="font-medium">{booking.vehicle.transmission}</span></li>
              <li className="flex items-center gap-2"><Users className="w-4 h-4 text-green-500" /> <span className="font-bold">Seats:</span> <span className="font-medium">{booking.vehicle.seats}</span></li>
              <li className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-green-500" /> <span className="font-bold">Price/Day:</span> <span className="font-medium">{formatPrice(booking.vehicle.base_price)}</span></li>
              {booking.vehicle?.rating != null && (
                <li className="flex items-center gap-2"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> <span className="font-bold">Rating:</span> <span className="font-medium">{booking.vehicle.rating.toFixed(1)}/5</span></li>
              )}
              <li className="flex items-center gap-2"><Calendar className="w-4 h-4 text-green-500" /> <span className="font-bold">Total Trips:</span> <span className="font-medium">{booking.vehicle.total_trips}</span></li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-green-500" /> <span className="font-bold">Location:</span> <span className="font-medium">{booking.vehicle.location}</span></li>
            </ul>
          </div>

          {/* Booking Info */}
          <div className="col-span-1 bg-gray-50 rounded-xl p-4 space-y-4 text-sm text-gray-900">
            <div>
              <h4 className="font-bold text-green-600 flex items-center gap-2 mb-1"><Calendar className="w-4 h-4 text-green-500" /> Rental Time</h4>
              <ul className="ml-6 space-y-1">
                <li><span className="font-bold">Pickup Date:</span> <span className="font-medium">{formatDate(booking.pickup_date)} at {formatTime(booking.pickup_time)}</span></li>
                <li><span className="font-bold">Return Date:</span> <span className="font-medium">{formatDate(booking.return_date)} at {formatTime(booking.return_time)}</span></li>
                {booking.created_at && <li><span className="font-bold">Created At:</span> <span className="font-medium">{formatDate(booking.created_at)}</span></li>}
                {booking.updated_at && <li><span className="font-bold">Last Updated:</span> <span className="font-medium">{formatDate(booking.updated_at)}</span></li>}
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-green-600 flex items-center gap-2 mb-1"><MapPin className="w-4 h-4 text-green-500" /> Location</h4>
              <ul className="ml-6 space-y-1">
                <li><span className="font-bold">Pickup at:</span> <span className="font-medium">{booking.pickup_location}</span></li>
                {booking.return_location && booking.return_location !== booking.pickup_location && (
                  <li><span className="font-bold">Return at:</span> <span className="font-medium">{booking.return_location}</span></li>
                )}
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-2 shadow-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-green-500" />
                <span className="font-bold">Renter:</span>
                <span className="font-medium">{booking.renter?.name}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-green-500" />
                <span className="font-bold">Phone:</span>
                <span className="font-medium">{booking.renter?.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-8 bg-gray-50 rounded-xl p-4 text-base text-gray-900">
          <div className="flex justify-between">
            <span className="font-bold">Initial Price:</span>
            <span className="font-medium">{formatPrice(booking.total_price)}</span>
          </div>

          {booking.discount_applied > 0 && (
            <div className="flex justify-between text-red-600">
              <span className="font-bold">Discount:</span>
              <span className="font-medium">- {formatPrice(booking.discount_applied)}</span>
            </div>
          )}

          <div className="flex justify-between items-center mt-4 pt-4 border-t text-green-600 font-bold text-lg">
            <span className="font-bold">Final Price:</span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" /> {formatPrice(booking.final_price)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
