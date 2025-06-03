import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, User, Mail, Phone, CreditCard, Banknote, Car, CheckCircle } from 'lucide-react';

const CarBookingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Giả sử nhận thông tin xe từ props hoặc URL params
  const selectedCar = {
    id: 1,
    name: 'Toyota Camry',
    type: 'Sedan',
    seats: 5,
    transmission: 'Automatic',
    fuel: 'Gasoline',
    price: 45,
    image: '🚗',
    rating: 4.8,
    features: ['AC', 'GPS', 'Bluetooth']
  };

  const validateStep1 = () => {
    return searchData.pickupLocation && 
           searchData.dropoffLocation && 
           searchData.pickupDate && 
           searchData.pickupTime && 
           searchData.dropoffDate && 
           searchData.dropoffTime;
  };

  const validateStep2 = () => {
    return userInfo.fullName && 
           userInfo.email && 
           userInfo.phone && 
           userInfo.address && 
           userInfo.driverLicense;
  };

  const handleSearchSubmit = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    } else {
      alert('Vui lòng điền đầy đủ thông tin!');
    }
  };

  const handleUserInfoSubmit = () => {
    if (validateStep2()) {
      setCurrentStep(3);
    } else {
      alert('Vui lòng điền đầy đủ thông tin cá nhân!');
    }
  };

  const handleBookingComplete = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const bookingData = {
        car: selectedCar,
        search: searchData,
        customer: userInfo,
        payment: paymentMethod,
        total: calculateTotal(),
        bookingId: 'BK' + Date.now()
      };
      
      console.log('Booking Data:', bookingData);
      alert(`Đặt xe thành công! 
Mã đặt xe: ${bookingData.bookingId}
Phương thức thanh toán: ${paymentMethod === 'cash' ? 'Thanh toán khi nhận xe' : 'Chuyển khoản ngân hàng'}
Tổng tiền: $${calculateTotal()}`);
      
      setIsSubmitting(false);
      // Có thể redirect về trang chủ hoặc trang xác nhận
    }, 2000);
  };

  const calculateTotal = () => {
    if (!searchData.pickupDate || !searchData.dropoffDate) return selectedCar.price;
    
    const startDate = new Date(searchData.pickupDate);
    const endDate = new Date(searchData.dropoffDate);
    const timeDiff = endDate.getTime() - startDate.getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return selectedCar.price * Math.max(days, 1);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount * 25000); // Giả sử 1 USD = 25,000 VND
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">🚗 Đặt Xe</h1>
          <p className="text-green-600">Hoàn thành đặt xe trong 3 bước đơn giản</p>
        </div>

        {/* Progress Bar */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                  currentStep >= step ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Labels */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-20 text-sm text-green-700">
            <span className={currentStep >= 1 ? 'font-semibold' : ''}>Thông tin chuyến đi</span>
            <span className={currentStep >= 2 ? 'font-semibold' : ''}>Thông tin cá nhân</span>
            <span className={currentStep >= 3 ? 'font-semibold' : ''}>Thanh toán</span>
          </div>
        </div>

        {/* Selected Car Info - Sticky */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-3xl">{selectedCar.image}</span>
                <div>
                  <h3 className="font-bold text-green-800">{selectedCar.name}</h3>
                  <p className="text-green-600">{selectedCar.type} • {selectedCar.seats} chỗ • {selectedCar.transmission}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">${selectedCar.price}/ngày</p>
                <p className="text-sm text-gray-500">⭐ {selectedCar.rating}/5</p>
              </div>
            </div>
          </div>
        </div>

        {/* Step 1: Trip Information */}
        {currentStep === 1 && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                <MapPin className="mr-3" /> Thông tin chuyến đi
              </h2>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-green-700 font-medium mb-2">
                      <MapPin className="inline w-4 h-4 mr-2" />
                      Điểm đón
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full p-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none"
                      placeholder="Nhập địa điểm đón"
                      value={searchData.pickupLocation}
                      onChange={(e) => setSearchData({...searchData, pickupLocation: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-green-700 font-medium mb-2">
                      <MapPin className="inline w-4 h-4 mr-2" />
                      Điểm trả
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full p-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none"
                      placeholder="Nhập địa điểm trả xe"
                      value={searchData.dropoffLocation}
                      onChange={(e) => setSearchData({...searchData, dropoffLocation: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-green-700 font-medium mb-2">
                        <Calendar className="inline w-4 h-4 mr-2" />
                        Ngày đón
                      </label>
                      <input
                        type="date"
                        required
                        className="w-full p-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none"
                        value={searchData.pickupDate}
                        onChange={(e) => setSearchData({...searchData, pickupDate: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-green-700 font-medium mb-2">
                        <Clock className="inline w-4 h-4 mr-2" />
                        Giờ đón
                      </label>
                      <input
                        type="time"
                        required
                        className="w-full p-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none"
                        value={searchData.pickupTime}
                        onChange={(e) => setSearchData({...searchData, pickupTime: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-green-700 font-medium mb-2">
                        <Calendar className="inline w-4 h-4 mr-2" />
                        Ngày trả
                      </label>
                      <input
                        type="date"
                        required
                        className="w-full p-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none"
                        value={searchData.dropoffDate}
                        onChange={(e) => setSearchData({...searchData, dropoffDate: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-green-700 font-medium mb-2">
                        <Clock className="inline w-4 h-4 mr-2" />
                        Giờ trả
                      </label>
                      <input
                        type="time"
                        required
                        className="w-full p-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none"
                        value={searchData.dropoffTime}
                        onChange={(e) => setSearchData({...searchData, dropoffTime: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSearchSubmit}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg transition duration-300 text-lg"
                >
                  Tiếp tục
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: User Information */}
        {currentStep === 2 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                <User className="mr-3" /> Thông tin cá nhân
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-green-700 font-medium mb-2">
                    <User className="inline w-4 h-4 mr-2" />
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full p-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none"
                    placeholder="Nhập họ và tên"
                    value={userInfo.fullName}
                    onChange={(e) => setUserInfo({...userInfo, fullName: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-green-700 font-medium mb-2">
                    <Mail className="inline w-4 h-4 mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full p-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none"
                    placeholder="Nhập email"
                    value={userInfo.email}
                    onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-green-700 font-medium mb-2">
                    <Phone className="inline w-4 h-4 mr-2" />
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full p-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none"
                    placeholder="Nhập số điện thoại"
                    value={userInfo.phone}
                    onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-green-700 font-medium mb-2">
                    <MapPin className="inline w-4 h-4 mr-2" />
                    Địa chỉ
                  </label>
                  <textarea
                    required
                    className="w-full p-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none"
                    placeholder="Nhập địa chỉ đầy đủ"
                    rows="3"
                    value={userInfo.address}
                    onChange={(e) => setUserInfo({...userInfo, address: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-green-700 font-medium mb-2">
                    <CreditCard className="inline w-4 h-4 mr-2" />
                    Số giấy phép lái xe
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full p-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none"
                    placeholder="Nhập số giấy phép lái xe"
                    value={userInfo.driverLicense}
                    onChange={(e) => setUserInfo({...userInfo, driverLicense: e.target.value})}
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                  >
                    Quay lại
                  </button>
                  <button
                    onClick={handleUserInfoSubmit}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                  >
                    Tiếp tục
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Payment Method */}
        {currentStep === 3 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                <CreditCard className="mr-3" /> Thanh toán
              </h2>

              {/* Booking Summary */}
              <div className="bg-green-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-bold text-green-800 mb-4">Tóm tắt đơn hàng</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Xe:</span>
                    <span className="font-medium">{selectedCar.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Đón:</span>
                    <span>{searchData.pickupLocation} - {searchData.pickupDate} {searchData.pickupTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Trả:</span>
                    <span>{searchData.dropoffLocation} - {searchData.dropoffDate} {searchData.dropoffTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Số ngày:</span>
                    <span>{Math.max(1, Math.ceil((new Date(searchData.dropoffDate) - new Date(searchData.pickupDate)) / (1000 * 60 * 60 * 24)))} ngày</span>
                  </div>
                  <div className="border-t pt-2 mt-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Tổng cộng:</span>
                      <span className="text-green-600">
                        ${calculateTotal()} ({formatCurrency(calculateTotal())})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Options */}
              <div className="space-y-4 mb-8">
                <div 
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                    paymentMethod === 'cash' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                  onClick={() => setPaymentMethod('cash')}
                >
                  <div className="flex items-center">
                    <Banknote className="w-6 h-6 text-green-600 mr-4" />
                    <div>
                      <h3 className="font-bold text-green-800">Thanh toán khi nhận xe</h3>
                      <p className="text-green-600">Thanh toán bằng tiền mặt khi đón xe</p>
                    </div>
                    <div className="ml-auto">
                      <div className={`w-6 h-6 rounded-full border-2 ${
                        paymentMethod === 'cash' 
                          ? 'border-green-500 bg-green-500' 
                          : 'border-gray-300'
                      }`}>
                        {paymentMethod === 'cash' && (
                          <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div 
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                    paymentMethod === 'bank' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                  onClick={() => setPaymentMethod('bank')}
                >
                  <div className="flex items-center">
                    <CreditCard className="w-6 h-6 text-green-600 mr-4" />
                    <div>
                      <h3 className="font-bold text-green-800">Chuyển khoản ngân hàng</h3>
                      <p className="text-green-600">Thanh toán trước qua chuyển khoản</p>
                    </div>
                    <div className="ml-auto">
                      <div className={`w-6 h-6 rounded-full border-2 ${
                        paymentMethod === 'bank' 
                          ? 'border-green-500 bg-green-500' 
                          : 'border-gray-300'
                      }`}>
                        {paymentMethod === 'bank' && (
                          <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bank Transfer Details */}
              {paymentMethod === 'bank' && (
                <div className="bg-green-50 rounded-lg p-6 mb-6">
                  <h3 className="font-bold text-green-800 mb-4">Thông tin chuyển khoản</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Ngân hàng:</strong> Vietcombank</div>
                    <div><strong>Tên tài khoản:</strong> Dịch vụ cho thuê xe</div>
                    <div><strong>Số tài khoản:</strong> 1234567890</div>
                    <div><strong>Chi nhánh:</strong> Đà Nẵng</div>
                    <div><strong>Số tiền:</strong> {formatCurrency(calculateTotal())}</div>
                  </div>
                  <p className="text-green-700 mt-4 text-sm">
                    Vui lòng ghi rõ mã đặt xe trong nội dung chuyển khoản.
                  </p>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                  disabled={isSubmitting}
                >
                  Quay lại
                </button>
                <button
                  onClick={handleBookingComplete}
                  disabled={isSubmitting}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg transition duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang xử lý...
                    </>
                  ) : (
                    'Hoàn tất đặt xe'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarBookingPage;