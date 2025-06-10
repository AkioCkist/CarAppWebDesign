'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Calendar, MapPin, Clock, User, Mail, Phone,
  CreditCard, Banknote, Car, CheckCircle, ArrowLeft,
  ArrowRight, Star, Shield, Award, Users
} from 'lucide-react';

// carbooking.js - Sửa lại useEffect
const CarBookingPage = ({ selectedCar, preFilledSearchData }) => {
  const router = useRouter();

  // Chuẩn hóa dữ liệu xe đã chọn
  const normalizedCar = selectedCar
    ? {
        id: selectedCar.vehicle_id || selectedCar.id,
        name: selectedCar.name || '',
        type: selectedCar.vehicle_type || selectedCar.type || '',
        seats: selectedCar.seats || '',
        transmission: selectedCar.transmission || '',
        fuel: selectedCar.fuel_type || selectedCar.fuel || '',
        price: selectedCar.base_price || selectedCar.price || 0,
        base_price: selectedCar.base_price || selectedCar.price || 0,
        imageUrl: selectedCar.image
          ? (typeof selectedCar.image === 'string'
              ? selectedCar.image
              : null)
          : (selectedCar.vehicle_images && selectedCar.vehicle_images.length > 0
              ? selectedCar.vehicle_images[0].image_url
              : null),
        features: (selectedCar.features || selectedCar.amenities?.map(a => a.name) || []).slice(0, 5),
        rating: selectedCar.rating || 5,
        trips: selectedCar.total_trips || selectedCar.trips || 0,
        location: selectedCar.location || '',
        description: selectedCar.description || '',
      }
    : null;

  const [searchData, setSearchData] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    pickupDate: '',
    pickupTime: '',
    dropoffDate: '',
    dropoffTime: ''
  });

  const [userInfo, setUserInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    driverLicense: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const searchParams = useSearchParams();

  const MAX_PRICE = 99999999.99; // Maximum value for numeric(10,2)

  // Tự động fill thông tin tìm kiếm nếu đã có preFilledSearchData
  useEffect(() => {
    // Try to get search data from props first, then from URL
    if (preFilledSearchData) {
      setSearchData({
        pickupLocation: preFilledSearchData.pickupLocation || '',
        dropoffLocation: preFilledSearchData.dropoffLocation || '',
        pickupDate: preFilledSearchData.pickupDate || '',
        pickupTime: preFilledSearchData.pickupTime || '',
        dropoffDate: preFilledSearchData.dropoffDate || '',
        dropoffTime: preFilledSearchData.dropoffTime || ''
      });
    } else if (searchParams) {
      setSearchData({
        pickupLocation: searchParams.get('pickupLocation') || '',
        dropoffLocation: searchParams.get('dropoffLocation') || '',
        pickupDate: searchParams.get('pickupDate') || '',
        pickupTime: searchParams.get('pickupTime') || '',
        dropoffDate: searchParams.get('dropoffDate') || '',
        dropoffTime: searchParams.get('dropoffTime') || ''
      });
    }
  }, [preFilledSearchData, searchParams]);

  // Debug: Log searchData khi nó thay đổi
  useEffect(() => {
    console.log('Current searchData:', searchData);
  }, [searchData]);

  const calculateTotal = () => {
    if (!searchData.pickupDate || !searchData.dropoffDate || !normalizedCar?.price) {
      return 0;
    }
    
    const startDate = new Date(`${searchData.pickupDate}T${searchData.pickupTime || '00:00'}`);
    const endDate = new Date(`${searchData.dropoffDate}T${searchData.dropoffTime || '00:00'}`);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return 0;
    }
    
    const timeDiff = endDate.getTime() - startDate.getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    const totalPrice = normalizedCar.price * Math.max(days, 1);
    return Math.min(totalPrice, MAX_PRICE);
  };

  const formatPrice = (price) => {
    return Number(Math.min(price, MAX_PRICE).toFixed(2));
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!searchData.pickupLocation?.trim()) {
      newErrors.pickupLocation = 'Please enter pickup location';
    }
    if (!searchData.dropoffLocation?.trim()) {
      newErrors.dropoffLocation = 'Please enter dropoff location';
    }
    if (!searchData.pickupDate) {
      newErrors.pickupDate = 'Please select pickup date';
    }
    if (!searchData.pickupTime) {
      newErrors.pickupTime = 'Please select pickup time';
    }
    if (!searchData.dropoffDate) {
      newErrors.dropoffDate = 'Please select dropoff date';
    }
    if (!searchData.dropoffTime) {
      newErrors.dropoffTime = 'Please select dropoff time';
    }

    // Validate dates and times
    if (searchData.pickupDate && searchData.dropoffDate && searchData.pickupTime && searchData.dropoffTime) {
      const pickupDateTime = new Date(`${searchData.pickupDate}T${searchData.pickupTime}`);
      const dropoffDateTime = new Date(`${searchData.dropoffDate}T${searchData.dropoffTime}`);
      
      if (isNaN(pickupDateTime.getTime()) || isNaN(dropoffDateTime.getTime())) {
        newErrors.pickupDate = 'Invalid date or time format';
      } else if (dropoffDateTime <= pickupDateTime) {
        newErrors.dropoffDate = 'Dropoff date and time must be after pickup date and time';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!userInfo.fullName.trim()) {
      newErrors.fullName = 'Please enter your full name';
    }
    if (!userInfo.email.trim()) {
      newErrors.email = 'Please enter your email';
    } else if (!/\S+@\S+\.\S+/.test(userInfo.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!userInfo.phone.trim()) {
      newErrors.phone = 'Please enter your phone number';
    } else if (!/^[0-9+\-\s()]{10,15}$/.test(userInfo.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Invalid phone number';
    }
    if (!userInfo.address.trim()) {
      newErrors.address = 'Please enter your address';
    }
    if (!userInfo.driverLicense.trim()) {
      newErrors.driverLicense = 'Please enter your driver\'s license number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearchSubmit = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleUserInfoSubmit = () => {
    if (validateStep2()) {
      setCurrentStep(3);
    }
  };

 const handleBookingComplete = async () => {
  setIsSubmitting(true);

  try {
    // Validate all required data
    if (!normalizedCar?.id) {
      throw new Error('Car information is missing');
    }

    if (!validateStep1()) {
      throw new Error('Please check your trip information');
    }

    if (!validateStep2()) {
      throw new Error('Please check your personal information');
    }

    // Calculate total price
    const totalPrice = calculateTotal();
    console.log('Calculated total price:', totalPrice);

    if (!totalPrice || totalPrice <= 0) {
      throw new Error('Invalid total price calculation. Please check your booking dates and car price.');
    }

    // Format dates and times
    const formatDate = (dateStr) => {
      if (!dateStr) return null;
      const date = new Date(dateStr);
      return date.toISOString().split('T')[0];
    };

    const formatTime = (timeStr) => {
      if (!timeStr) return null;
      return timeStr;
    };

    // Create a serializable version of the car data for navigation
    const serializableCar = {
      ...normalizedCar,
      // Convert image React element to image URL/path
      image: selectedCar.image || 
             (selectedCar.vehicle_images && selectedCar.vehicle_images.length > 0 
               ? selectedCar.vehicle_images[0].image_url 
               : ''),
    };

    // Create booking data matching the API structure
    const bookingData = {
      action: 'create_booking',
      vehicle_id: normalizedCar.id,
      renter_id: Math.floor(Math.random() * 1000) + 1, // Random ID for testing
      start_date: formatDate(searchData.pickupDate),
      end_date: formatDate(searchData.dropoffDate),
      start_time: formatTime(searchData.pickupTime),
      end_time: formatTime(searchData.dropoffTime),
      total_price: formatPrice(totalPrice),
      discount_applied: 0,
      final_price: formatPrice(totalPrice),
      status: 'pending',
      pickup_location: searchData.pickupLocation,
      return_location: searchData.dropoffLocation,
      renter_info: {
        full_name: userInfo.fullName,
        email: userInfo.email,
        phone: userInfo.phone,
        address: userInfo.address,
        driver_license: userInfo.driverLicense
      }
    };

    // Debug log
    console.log('Booking Data:', bookingData);

    // Send request to API
    const response = await fetch('/api/booking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    const result = await response.json();
    console.log('API Response:', result);

    if (!response.ok) {
      throw new Error(result.error || 'Failed to create booking');
    }

    // Update vehicle status to rented
    const updateVehicleResponse = await fetch('/api/vehicles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'update_status',
        vehicle_id: normalizedCar.id,
        status: 'rented'
      }),
    });

    if (!updateVehicleResponse.ok) {
      console.error('Failed to update vehicle status');
    }

    // Prepare success message data
    const carName = normalizedCar?.name || '';
    const carType = normalizedCar?.type || '';
    const carSeats = normalizedCar?.seats ? `${normalizedCar.seats} seats` : '';
    const rentalDays = getDayCount();
    const pricePerDay = normalizedCar?.price ? `${formatVND(normalizedCar.price)}` : '';
    const total = formatVND(totalPrice);
    const vat = formatVND(Math.round(totalPrice * 0.1));
    const totalWithVat = formatVND(Math.round(totalPrice * 1.1));

    // Show success message
    const successMessage = `🎉 Booking successful!

🚗 Car: ${carName} (${carType}${carSeats ? ' • ' + carSeats : ''})
📅 Rental: ${searchData.pickupDate} ${searchData.pickupTime} → ${searchData.dropoffDate} ${searchData.dropoffTime} (${rentalDays} day(s))
💵 Price per day: ${pricePerDay}
🧾 VAT (10%): ${vat}
💰 Total: ${totalWithVat}

📋 Booking ID: ${result.booking?.booking_id || 'Pending'}
💳 Payment method: ${paymentMethod === 'cash' ? 'Pay on Pickup' : 'Bank Transfer'}

📧 Details have been sent to your email.
📞 We will contact you for confirmation within 30 minutes.`;

    // Navigate to booking ticket page with all booking data
    const navigationData = {
      car: serializableCar,
      searchData,
      userInfo,
      paymentMethod,
      bookingResult: result,
      totalPrice: totalPrice,
      rentalDays: getDayCount(),
      successMessage: successMessage
    };
    
    const encodedData = encodeURIComponent(JSON.stringify(navigationData));
    router.push(`/booking_ticket?data=${encodedData}`);

  } catch (error) {
    console.error('Booking error:', error);
    setErrors({
      submit: error.message || 'An error occurred while booking. Please try again.'
    });
  } finally {
    setIsSubmitting(false);
  }
};

    } catch (error) {
      console.error('Booking error:', error);
      setErrors({
        submit: error.message || 'An error occurred while booking. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format number as Vietnamese currency (e.g. 8.500.000 VND)
  const formatVND = (amount) => {
    if (typeof amount !== 'number') amount = Number(amount) || 0;
    return amount.toLocaleString('vi-VN') + ' VND';
  };

  const getDayCount = () => {
    if (!searchData.pickupDate || !searchData.dropoffDate) return 1;
    const startDate = new Date(searchData.pickupDate);
    const endDate = new Date(searchData.dropoffDate);
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));
  };

  // Render car image component
  const CarImage = ({ className = "w-16 h-16 object-cover rounded-xl" }) => {
    if (!normalizedCar?.imageUrl) return null;
    return (
      <img 
        src={normalizedCar.imageUrl} 
        alt={normalizedCar.name} 
        className={className}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100">
      {/* Header Section */}
      <div className="container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4">
            <Car className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-green-800 mb-2">Book Your Car</h1>
          <p className="text-green-600 text-lg">Complete your booking in just 3 simple steps</p>
        </div>
        {/* Info Boxes */}
        <div className="w-full max-w-4xl flex flex-col gap-2 mb-8">
          <div className="text-sm p-4 bg-gray-100 border border-green-200 rounded-md shadow text-green-900">
            <strong>Selected car:</strong> {normalizedCar?.name} ({normalizedCar?.type}) - {formatVND(normalizedCar?.price)} /day
          </div>
          <div className="text-sm p-4 bg-yellow-50 border border-yellow-200 rounded-md shadow text-yellow-900">
            <strong>Search info:</strong><br />
            Pickup: {searchData.pickupLocation} at {searchData.pickupDate} {searchData.pickupTime}<br />
            Dropoff: {searchData.dropoffLocation} at {searchData.dropoffDate} {searchData.dropoffTime}
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-0">
        {/* Progress Bar */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg transition-all duration-300 ${
                  currentStep >= step 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg scale-110' 
                    : 'bg-gray-300'
                } ${currentStep === step ? 'ring-4 ring-green-200' : ''}`}>
                  {currentStep > step ? <CheckCircle className="w-6 h-6" /> : step}
                </div>
                {step < 3 && (
                  <div className={`w-20 h-2 mx-3 rounded-full transition-all duration-300 ${
                    currentStep > step ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-300'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Labels */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-24 text-sm">
            <span className={`transition-all duration-300 ${currentStep >= 1 ? 'font-bold text-green-700' : 'text-gray-500'}`}>
              Trip Information
            </span>
            <span className={`transition-all duration-300 ${currentStep >= 2 ? 'font-bold text-green-700' : 'text-gray-500'}`}>
              Personal Information
            </span>
            <span className={`transition-all duration-300 ${currentStep >= 3 ? 'font-bold text-green-700' : 'text-gray-500'}`}>
              Payment
            </span>
          </div>
        </div>

        {/* Selected Car Info - Enhanced */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-green-100 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-10 transform translate-x-16 -translate-y-16"></div>
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="text-5xl bg-green-50 p-4 rounded-2xl">
                    <CarImage />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-green-800 mb-1">{normalizedCar?.name}</h3>
                    <p className="text-green-600 text-lg mb-2">
                      {normalizedCar?.type} • {normalizedCar?.seats} seats • {normalizedCar?.transmission}
                    </p>
                    <div className="flex space-x-2">
                      {normalizedCar?.features?.map((feature, index) => (
                        <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-2xl mb-2">
                    <p className="text-2xl font-bold">{formatVND(normalizedCar?.price)}</p>
                    <p className="text-sm opacity-90">/day</p>
                  </div>
                  <p className="text-green-600 font-medium flex items-center justify-end">
                    <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                    {normalizedCar?.rating}/5
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 1: Trip Information */}
        {currentStep === 1 && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-green-100">
              <h2 className="text-3xl font-bold text-green-800 mb-8 flex items-center">
                <div className="bg-green-100 p-3 rounded-2xl mr-4">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                Trip Information
              </h2>
              
              <div className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-green-700 font-semibold mb-3 text-lg">
                      <MapPin className="inline w-5 h-5 mr-2" />
                      Pickup Location
                    </label>
                    <input
                      type="text"
                      className={`w-full p-4 border-2 rounded-xl focus:outline-none transition-all duration-300 text-lg text-black border-green-200 focus:border-green-500 focus:bg-green-50 ${
                        errors.pickupLocation 
                          ? 'border-red-300 focus:border-red-500 bg-red-50' 
                          : 'border-green-200 focus:border-green-500 focus:bg-green-50'
                      }`}
                      value={searchData.pickupLocation}
                      onChange={(e) =>
                        setSearchData((prev) => ({ ...prev, pickupLocation: e.target.value }))
                      }
                    />
                    {errors.pickupLocation && (
                      <p className="text-red-500 text-sm mt-1">{errors.pickupLocation}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-green-700 font-semibold mb-3 text-lg">
                      <MapPin className="inline w-5 h-5 mr-2" />
                      Dropoff Location
                    </label>
                    <input
                      type="text"
                      className={`w-full p-4 border-2 rounded-xl focus:outline-none transition-all duration-300 text-lg text-black border-green-200 focus:border-green-500 focus:bg-green-50 ${
                        errors.dropoffLocation 
                          ? 'border-red-300 focus:border-red-500 bg-red-50' 
                          : 'border-green-200 focus:border-green-500 focus:bg-green-50'
                      }`}
                      value={searchData.dropoffLocation}
                      onChange={(e) => {
                        setSearchData({...searchData, dropoffLocation: e.target.value});
                        if (errors.dropoffLocation) setErrors({...errors, dropoffLocation: ''});
                      }}
                    />
                    {errors.dropoffLocation && (
                      <p className="text-red-500 text-sm mt-1">{errors.dropoffLocation}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-green-800 flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Pickup Time
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-green-700 font-medium mb-2">Date</label>
                        <input
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          className={`w-full p-4 border-2 rounded-xl focus:outline-none transition-all duration-300 text-lg text-black border-green-200 focus:border-green-500 focus:bg-green-50 text-lg text-black border-green-200 focus:border-green-500 focus:bg-green-50 ${
                            errors.pickupDate 
                              ? 'border-red-300 focus:border-red-500' 
                              : 'border-green-200 focus:border-green-500'
                          }`}
                          onChange={(e) => {
                            setSearchData(prev => ({ ...prev, pickupDate: e.target.value }));
                            if (errors.pickupDate) setErrors(prev => ({ ...prev, pickupDate: '' }));
                          }}
                        />
                        {errors.pickupDate && (
                          <p className="text-red-500 text-sm mt-1">{errors.pickupDate}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-green-700 font-medium mb-2">Time</label>
                        <input
                          type="time"
                          value={searchData.pickupTime}
                          className={`w-full p-4 border-2 rounded-xl focus:outline-none transition-all duration-300 text-lg text-black border-green-200 focus:border-green-500 focus:bg-green-50 ${
                            errors.pickupTime 
                              ? 'border-red-300 focus:border-red-500' 
                              : 'border-green-200 focus:border-green-500'
                          }`}
                          onChange={(e) => {
                            setSearchData({...searchData, pickupTime: e.target.value});
                            if (errors.pickupTime) setErrors({...errors, pickupTime: ''});
                          }}
                        />
                        {errors.pickupTime && (
                          <p className="text-red-500 text-sm mt-1">{errors.pickupTime}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-green-800 flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Dropoff Time
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-green-700 font-medium mb-2">Date</label>
                        <input
                          type="date"
                          min={searchData.pickupDate || new Date().toISOString().split('T')[0]}
                          className={`w-full p-4 border-2 rounded-xl focus:outline-none transition-all duration-300 text-lg text-black border-green-200 focus:border-green-500 focus:bg-green-50 text-lg text-black border-green-200 focus:border-green-500 focus:bg-green-50 ${
                            errors.dropoffDate 
                              ? 'border-red-300 focus:border-red-500' 
                              : 'border-green-200 focus:border-green-500'
                          }`}
                          value={searchData.dropoffDate}
                          onChange={(e) => {
                            setSearchData({...searchData, dropoffDate: e.target.value});
                            if (errors.dropoffDate) setErrors({...errors, dropoffDate: ''});
                          }}
                        />
                        {errors.dropoffDate && (
                          <p className="text-red-500 text-sm mt-1">{errors.dropoffDate}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-green-700 font-medium mb-2">Time</label>
                        <input
                          type="time"
                          value={searchData.dropoffTime}
                          className={`w-full p-4 border-2 rounded-xl focus:outline-none transition-all duration-300 text-lg text-black border-green-200 focus:border-green-500 focus:bg-green-50 ${
                            errors.dropoffTime 
                              ? 'border-red-300 focus:border-red-500' 
                              : 'border-green-200 focus:border-green-500'
                          }`}
                          onChange={(e) => {
                            setSearchData({...searchData, dropoffTime: e.target.value});
                            if (errors.dropoffTime) setErrors({...errors, dropoffTime: ''});
                          }}
                        />
                        {errors.dropoffTime && (
                          <p className="text-red-500 text-sm mt-1">{errors.dropoffTime}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Preview */}
                {searchData.pickupDate && searchData.dropoffDate && (
                  <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-green-700 font-medium">Rental days: {getDayCount()} day(s)</p>
                        <p className="text-green-600">Price: {formatVND(normalizedCar.price)} x {getDayCount()} day(s)</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">{formatVND(calculateTotal())}</p>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleSearchSubmit}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 text-xl shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
                >
                  Continue
                  <ArrowRight className="ml-3 w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: User Information */}
        {currentStep === 2 && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-green-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-green-800 flex items-center">
                  <div className="bg-green-100 p-3 rounded-2xl mr-4">
                    <User className="w-6 h-6 text-green-600" />
                  </div>
                  Personal Information
                </h2>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center text-green-600 hover:text-green-800 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-green-700 font-semibold mb-3">
                      <User className="inline w-4 h-4 mr-2" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      className={`w-full p-4 border-2 rounded-xl focus:outline-none transition-all duration-300 text-lg text-black border-green-200 focus:border-green-500 focus:bg-green-50 text-lg text-black border-green-200 focus:border-green-500 focus:bg-green-50 ${
                        errors.fullName 
                          ? 'border-red-300 focus:border-red-500 bg-red-50' 
                          : 'border-green-200 focus:border-green-500 focus:bg-green-50'
                      }`}
                      placeholder="Nguyễn Văn A"
                      value={userInfo.fullName}
                      onChange={(e) => {
                        setUserInfo({...userInfo, fullName: e.target.value});
                        if (errors.fullName) setErrors({...errors, fullName: ''});
                      }}
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-green-700 font-semibold mb-3">
                      <Phone className="inline w-4 h-4 mr-2" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      className={`w-full p-4 border-2 rounded-xl focus:outline-none transition-all duration-300 text-lg text-black border-green-200 focus:border-green-500 focus:bg-green-50 text-lg text-black border-green-200 focus:border-green-500 focus:bg-green-50 ${
                        errors.phone 
                          ? 'border-red-300 focus:border-red-500 bg-red-50' 
                          : 'border-green-200 focus:border-green-500 focus:bg-green-50'
                      }`}
                      placeholder="0123 456 789"
                      value={userInfo.phone}
                      onChange={(e) => {
                        setUserInfo({...userInfo, phone: e.target.value});
                        if (errors.phone) setErrors({...errors, phone: ''});
                      }}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-green-700 font-semibold mb-3">
                    <Mail className="inline w-4 h-4 mr-2" />
                    Email *
                  </label>
                  <input
                    type="email"
                    className={`w-full p-4 border-2 rounded-xl focus:outline-none transition-all duration-300 text-lg text-black border-green-200 focus:border-green-500 focus:bg-green-50 text-lg text-black border-green-200 focus:border-green-500 focus:bg-green-50 ${
                      errors.email 
                        ? 'border-red-300 focus:border-red-500 bg-red-50' 
                        : 'border-green-200 focus:border-green-500 focus:bg-green-50'
                    }`}
                    placeholder="example@email.com"
                    value={userInfo.email}
                    onChange={(e) => {
                      setUserInfo({...userInfo, email: e.target.value});
                      if (errors.email) setErrors({...errors, email: ''});
                    }}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-green-700 font-semibold mb-3">
                    <MapPin className="inline w-4 h-4 mr-2" />
                    Address *
                  </label>
                  <textarea
                    className={`w-full p-4 border-2 rounded-xl focus:outline-none transition-all duration-300 text-lg text-black border-green-200 focus:border-green-500 focus:bg-green-50 text-lg text-black border-green-200 focus:border-green-500 focus:bg-green-50 resize-none ${
                      errors.address 
                        ? 'border-red-300 focus:border-red-500 bg-red-50' 
                        : 'border-green-200 focus:border-green-500 focus:bg-green-50'
                    }`}
                    placeholder="123 Đường ABC, Phường XYZ, Quận/Huyện, Thành phố"
                    rows="3"
                    value={userInfo.address}
                    onChange={(e) => {
                      setUserInfo({...userInfo, address: e.target.value});
                      if (errors.address) setErrors({...errors, address: ''});
                    }}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                  )}
                </div>

                <div>
                  <label className="block text-green-700 font-semibold mb-3">
                    <CreditCard className="inline w-4 h-4 mr-2" />
                    Driver's License Number *
                  </label>
                  <input
                    type="text"
                    className={`w-full p-4 border-2 rounded-xl focus:outline-none transition-all duration-300 text-lg text-black border-green-200 focus:border-green-500 focus:bg-green-50 text-lg text-black border-green-200 focus:border-green-500 focus:bg-green-50 ${
                      errors.driverLicense 
                        ? 'border-red-300 focus:border-red-500 bg-red-50' 
                        : 'border-green-200 focus:border-green-500 focus:bg-green-50'
                    }`}
                    placeholder="123456789"
                    value={userInfo.driverLicense}
                    onChange={(e) => {
                      setUserInfo({...userInfo, driverLicense: e.target.value});
                      if (errors.driverLicense) setErrors({...errors, driverLicense: ''});
                    }}
                  />
                  {errors.driverLicense && (
                    <p className="text-red-500 text-sm mt-1">{errors.driverLicense}</p>
                  )}
                </div>

                {/* Important Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start">
                    <Shield className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-1">Important Notice</h4>
                      <p className="text-blue-700 text-sm">
                        Please bring your original driver's license and ID card when picking up the car.
                        Information must match what you have provided.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleUserInfoSubmit}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 text-xl shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
                >
                  Continue
                  <ArrowRight className="ml-3 w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {currentStep === 3 && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-green-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-green-800 flex items-center">
                  <div className="bg-green-100 p-3 rounded-2xl mr-4">
                    <CreditCard className="w-6 h-6 text-green-600" />
                  </div>
                  Payment
                </h2>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center text-green-600 hover:text-green-800 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </button>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Payment Methods */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-green-800 mb-6">Choose payment method</h3>
                  
                  <div className="space-y-4">
                    <div 
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                        paymentMethod === 'cash' 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                      onClick={() => setPaymentMethod('cash')}
                    >
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                          paymentMethod === 'cash' ? 'border-green-500' : 'border-gray-300'
                        }`}>
                          {paymentMethod === 'cash' && <div className="w-3 h-3 bg-green-500 rounded-full"></div>}
                        </div>
                        <div className="flex items-center">
                          <Banknote className="w-6 h-6 text-green-600 mr-3" />
                          <div>
                            <h4 className="font-semibold text-green-800">Pay on Pickup</h4>
                            <p className="text-green-600 text-sm">Pay by cash or card at pickup location</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div 
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                        paymentMethod === 'bank' 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                      onClick={() => setPaymentMethod('bank')}
                    >
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                          paymentMethod === 'bank' ? 'border-green-500' : 'border-gray-300'
                        }`}>
                          {paymentMethod === 'bank' && <div className="w-3 h-3 bg-green-500 rounded-full"></div>}
                        </div>
                        <div className="flex items-center">
                          <CreditCard className="w-6 h-6 text-green-600 mr-3" />
                          <div>
                            <h4 className="font-semibold text-green-800">Bank Transfer</h4>
                            <p className="text-green-600 text-sm">Transfer 30% upfront - Pay the rest at pickup</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bank Transfer Details */}
                  {paymentMethod === 'bank' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <h4 className="font-semibold text-blue-800 mb-4 flex items-center">
                        <CreditCard className="w-5 h-5 mr-2" />
                        Bank Transfer Details
                      </h4>
                      <div className="space-y-3 text-blue-700">
                        <div className="flex justify-between">
                          <span>Bank:</span>
                          <span className="font-semibold">VNUK Bankrupt</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Account number:</span>
                          <span className="font-semibold">7355608</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Account holder:</span>
                          <span className="font-semibold">WHALE XE RENTAL CO., LTD</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Amount to transfer:</span>
                          <span className="font-semibold text-lg">{formatVND(Math.round(calculateTotal() * 0.3))}</span>
                        </div>
                        <div className="border-t border-blue-300 pt-3 mt-3">
                          <p className="text-sm">
                            <strong>Transfer note:</strong> "Car booking [Full Name] [Phone Number]"
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Terms and Conditions */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      Terms and Conditions
                    </h4>
                    <div className="space-y-2 text-gray-700 text-sm">
                      <div className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Customer must have a valid driver's license and ID card</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Insurance deposit of 2,000,000 VND required at pickup</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Deposit refunded within 7 days after return</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Free cancellation up to 24h before, 20% fee after</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Basic insurance included in rental price</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-green-800 mb-6">Order Summary</h3>
                  
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    {/* Car Info Summary */}
                    <div className="flex items-center mb-4">
                      <div className="text-3xl mr-4">
                        <CarImage />
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-800">{normalizedCar?.name}</h4>
                        <p className="text-green-600 text-sm">{normalizedCar?.type} • {normalizedCar?.seats} seats</p>
                      </div>
                    </div>

                    {/* Trip Details */}
                    <div className="space-y-3 border-t border-green-200 pt-4">
                      <div className="flex items-center text-green-700">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          <strong>Pickup:</strong> {searchData.pickupLocation}
                        </span>
                      </div>
                      <div className="flex items-center text-green-700">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          <strong>Dropoff:</strong> {searchData.dropoffLocation}
                        </span>
                      </div>
                      <div className="flex items-center text-green-700">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          <strong>Time:</strong> {searchData.pickupDate} {searchData.pickupTime} → {searchData.dropoffDate} {searchData.dropoffTime}
                        </span>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="space-y-2 border-t border-green-200 pt-4 mt-4">
                      <div className="flex items-center text-green-700">
                        <User className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          <strong>Customer:</strong> {userInfo.fullName}
                        </span>
                      </div>
                      <div className="flex items-center text-green-700">
                        <Phone className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          <strong>Phone:</strong> {userInfo.phone}
                        </span>
                      </div>
                      <div className="flex items-center text-green-700">
                        <Mail className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          <strong>Email:</strong> {userInfo.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-800 mb-4">Price Details</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rental price ({getDayCount()} day(s))</span>
                        <span className="font-medium text-gray-900">{formatVND(calculateTotal())}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service fee</span>
                        <span className="font-medium text-gray-900">{formatVND(0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">VAT (10%)</span>
                        <span className="font-medium text-gray-900">{formatVND(Math.round(calculateTotal() * 0.1))}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between text-lg font-bold">
                          <span className="text-gray-900">Total</span>
                          <span className="text-green-600">{formatVND(Math.round(calculateTotal() * 1.1))}</span>
                        </div>
                      </div>
                    </div>
                    {paymentMethod === 'bank' && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <div className="flex justify-between text-sm">
                          <span>Pay upfront:</span>
                          <span className="font-semibold">{formatVND(Math.round(calculateTotal() * 1.1 * 0.3))}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Pay at pickup:</span>
                          <span className="font-semibold">{formatVND(Math.round(calculateTotal() * 1.1 * 0.7))}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Button */}
                  <button
                    onClick={handleBookingComplete}
                    disabled={isSubmitting}
                    className={`w-full font-bold py-5 px-8 rounded-2xl transition-all duration-300 text-xl shadow-lg flex items-center justify-center ${
                      isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white hover:shadow-xl transform hover:scale-105'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-3 w-6 h-6" />
                        Confirm Booking
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features/Benefits Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-green-100">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-green-800 mb-2">Comprehensive Insurance</h3>
              <p className="text-green-600 text-sm">Fully insured vehicles for your peace of mind</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-green-100">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-green-800 mb-2">24/7 Support</h3>
              <p className="text-green-600 text-sm">Our support team is always ready to assist you</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-green-100">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-green-800 mb-2">Best Price</h3>
              <p className="text-green-600 text-sm">Guaranteed best price on the market</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarBookingPage;