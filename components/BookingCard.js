import React from 'react';
import { Calendar, User, Phone, MapPin } from 'lucide-react';

const BookingCard = ({ booking, onClick }) => {
  console.log('Booking data in BookingCard:', booking);

  const formatDate = (date) => {
    if (!date) return '--';

    if (date instanceof Date) {
      const d = date.getDate().toString().padStart(2, '0');
      const m = (date.getMonth() + 1).toString().padStart(2, '0');
      const y = date.getFullYear();
      return `${d}/${m}/${y}`;
    }

    if (typeof date === 'string') {
      const [y, m, d] = date.split('-');
      return `${d}/${m}/${y}`;
    }

    return '--';
  };

  const formatTime = (time) => {
    if (!time) return '';
    if (time instanceof Date) {
      const hours = time.getHours().toString().padStart(2, '0');
      const minutes = time.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }
    if (typeof time === 'string') {
      return time;
    }
    return '';
  };

  const formatPrice = (price) => {
    if (price == null) return '--';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
      confirmed: 'bg-blue-100 text-blue-800 border border-blue-300',
      ongoing: 'bg-green-100 text-green-800 border border-green-300',
      completed: 'bg-gray-100 text-gray-800 border border-gray-300',
      cancelled: 'bg-red-100 text-red-800 border border-red-300'
    };
    return colors[status] || colors.pending;
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      ongoing: 'Ongoing',
      completed: 'Completed',
      cancelled: 'Cancelled'
    };
    return texts[status] || status;
  };

  const carImage = booking.vehicle?.image || '/images/default-car.jpg';

  return (
    <div
      onClick={() => onClick && onClick(booking)}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 transform hover:scale-102 p-0"
      style={{ minWidth: 320, maxWidth: 420 }}
    >
      <div className="h-44 w-full bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-xl">
        <img
          src={carImage}
          alt={booking.vehicle?.name || 'Car'}
          className="object-cover w-full h-full"
          style={{ maxHeight: 200 }}
        />
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {booking.vehicle?.name || '--'}
            </h3>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
            {getStatusText(booking.status)}
          </span>
        </div>

        <div className="space-y-2 mt-2 text-gray-700 text-sm">
          <div className="flex items-start">
            <Calendar className="w-4 h-4 mr-2 text-green-500" />
            <span className="pt-0.5">
              {formatDate(booking.pickup_date)} {formatTime(booking.pickup_time)}
              {booking.return_date ? ` → ${formatDate(booking.return_date)} ${formatTime(booking.return_time)}` : ''}
            </span>
          </div>

          <div className="flex items-start">
            <MapPin className="w-4 h-4 mr-2 text-green-500" />
            <span className="pt-0.5">
              <div>Pick up at: <strong>{booking.pickup_location || '--'}</strong></div>
              {booking.return_location && (
                <div>Drop off at: <strong>{booking.return_location}</strong></div>
              )}
            </span>
          </div>
          {booking.renter?.name && (
            <div className="flex items-start">
              <User className="w-4 h-4 mr-2 text-green-500" />
              <span className="pt-0.5">{booking.renter.name}</span>
            </div>
          )}
          {booking.renter?.phone && (
            <div className="flex items-start">
              <Phone className="w-4 h-4 mr-2 text-green-500" />
              <span className="pt-0.5">{booking.renter.phone}</span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
          <span className="text-gray-500 text-sm font-medium">Total price:</span>
          <span className="text-lg font-bold text-green-600">{formatPrice(booking.final_price)}</span>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
