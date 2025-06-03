import React, { useState } from 'react';
import { Calendar, MapPin, Clock, User, Mail, Phone, CreditCard, Banknote, Car, Users, Fuel, Settings } from 'lucide-react';

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
  
  const [selectedCar, setSelectedCar] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');

  // Sample car data
  const availableCars = [
    {
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
    },
    {
      id: 2,
      name: 'Honda CR-V',
      type: 'SUV',
      seats: 7,
      transmission: 'Automatic',
      fuel: 'Gasoline',
      price: 65,
      image: '🚙',
      rating: 4.9,
      features: ['AC', 'GPS', '4WD', 'Bluetooth']
    },
    {
      id: 3,
      name: 'BMW 3 Series',
      type: 'Luxury',
      seats: 5,
      transmission: 'Automatic',
      fuel: 'Gasoline',
      price: 85,
      image: '🚘',
      rating: 4.7,
      features: ['AC', 'GPS', 'Leather', 'Premium Sound']
    }
  ];

  const handleSearchSubmit = () => {
    setCurrentStep(2);
  };

  const handleUserInfoSubmit = () => {
    setCurrentStep(3);
  };

  const handleBookingComplete = () => {
    alert(`Booking confirmed! Payment method: ${paymentMethod === 'cash' ? 'Cash on Delivery' : 'Bank Transfer'}`);
  };

  const calculateTotal = () => {
    const days = searchData.pickupDate && searchData.dropoffDate ? 
      Math.ceil((new Date(searchData.dropoffDate) - new Date(searchData.pickupDate)) / (1000 * 60 * 60 * 24)) : 1;
    return 45 * Math.max(days, 1); // Using a base price of $45/day
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">🚗 Car Booking</h1>
          <p className="text-green-600">Book your perfect ride in 3 easy steps</p>
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
          <div className="flex space-x-24 text-sm text-green-700">
            <span className={currentStep >= 1 ? 'font-semibold' : ''}>Search Cars</span>
            <span className={currentStep >= 2 ? 'font-semibold' : ''}>Your Info</span>
            <span className={currentStep >= 3 ? 'font-semibold' : ''}>Payment</span>
          </div>
        </div>

        {/* Step 1: Car Search */}
        {currentStep === 1 && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                <Car className="mr-3" /> Find Your Perfect Car
              </h2>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-green-700 font-medium mb-2">
                      <MapPin className="inline w-4 h-4 mr-2" />
                      Pickup Location
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full p-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none"
                      placeholder="Enter pickup location"
                      value={searchData.pickupLocation}
                      onChange={(e) => setSearchData({...searchData, pickupLocation: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-green-700 font-medium mb-2">
                      <MapPin className="inline w-4 h-4 mr-2" />
                      Drop-off Location
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full p-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none"
                      placeholder="Enter drop-off location"
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
                        Pickup Date
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
                        Pickup Time
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
                        Drop-off Date
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
                        Drop-off Time
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
                  Search Available Cars
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
                <User className="mr-3" /> Your Information
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-green-700 font-medium mb-2">
                    <User className="inline w-4 h-4 mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full p-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none"
                    placeholder="Enter your full name"
                    value={userInfo.fullName}
                    onChange={(e) => setUserInfo({...userInfo, fullName: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-green-700 font-medium mb-2">
                    <Mail className="inline w-4 h-4 mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full p-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none"
                    placeholder="Enter your email"
                    value={userInfo.email}
                    onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-green-700 font-medium mb-2">
                    <Phone className="inline w-4 h-4 mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full p-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none"
                    placeholder="Enter your phone number"
                    value={userInfo.phone}
                    onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-green-700 font-medium mb-2">
                    <MapPin className="inline w-4 h-4 mr-2" />
                    Address
                  </label>
                  <textarea
                    required
                    className="w-full p-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none"
                    placeholder="Enter your full address"
                    rows="3"
                    value={userInfo.address}
                    onChange={(e) => setUserInfo({...userInfo, address: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-green-700 font-medium mb-2">
                    <CreditCard className="inline w-4 h-4 mr-2" />
                    Driver's License Number
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full p-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none"
                    placeholder="Enter your driver's license number"
                    value={userInfo.driverLicense}
                    onChange={(e) => setUserInfo({...userInfo, driverLicense: e.target.value})}
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleUserInfoSubmit}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                  >
                    Continue
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
                <CreditCard className="mr-3" /> Payment Method
              </h2>

              {/* Booking Summary */}
              <div className="bg-green-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-bold text-green-800 mb-4">Booking Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span className="font-medium">Car Rental</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pickup:</span>
                    <span>{searchData.pickupLocation} - {searchData.pickupDate} {searchData.pickupTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Drop-off:</span>
                    <span>{searchData.dropoffLocation} - {searchData.dropoffDate} {searchData.dropoffTime}</span>
                  </div>
                  <div className="border-t pt-2 mt-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-green-600">${calculateTotal()}</span>
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
                      <h3 className="font-bold text-green-800">Cash on Delivery</h3>
                      <p className="text-green-600">Pay when you pick up the car</p>
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
                      <h3 className="font-bold text-green-800">Bank Transfer</h3>
                      <p className="text-green-600">Pay in advance online</p>
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
                  <h3 className="font-bold text-green-800 mb-4">Bank Transfer Details</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Bank:</strong> Green Bank</div>
                    <div><strong>Account Name:</strong> Car Rental Service</div>
                    <div><strong>Account Number:</strong> 1234567890</div>
                    <div><strong>SWIFT Code:</strong> GRNBVNVX</div>
                    <div><strong>Amount:</strong> ${calculateTotal()}</div>
                  </div>
                  <p className="text-green-700 mt-4 text-sm">
                    Please include your booking reference in the transfer description.
                  </p>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                >
                  Back
                </button>
                <button
                  onClick={handleBookingComplete}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg transition duration-300 text-lg"
                >
                  Complete Booking
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