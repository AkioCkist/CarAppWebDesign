'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import CarBookingPage from '../../../components/CarBooking';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

function BookingContent() {
  const searchParams = useSearchParams();
  const [selectedCar, setSelectedCar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const carId = searchParams.get('carId');
  const carName = searchParams.get('carName');
  
  // Dữ liệu lọc chuyến đi
  const preFilledSearchData = {
    pickupLocation: searchParams.get('pickupLocation') || '',
    dropoffLocation: searchParams.get('dropoffLocation') || '',
    pickupDate: searchParams.get('pickupDate') || '',
    pickupTime: searchParams.get('pickupTime') || '',
    dropoffDate: searchParams.get('dropoffDate') || '',
    dropoffTime: searchParams.get('dropoffTime') || ''
  };

  useEffect(() => {
    if (!carId) {
      setError('Không tìm thấy thông tin xe');
      setIsLoading(false);
      return;
    }

    const fetchCar = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`http://localhost/myapi/vehicles.php?id=${carId}`);
        
        if (!res.ok) throw new Error('Không thể lấy dữ liệu xe');
        
        const car = await res.json();
        setSelectedCar(car);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin xe:', error);
        setError('Không thể tải thông tin xe. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCar();
  }, [carId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-green-700 text-lg">Đang tải thông tin xe...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <p className="text-gray-700 mt-2">Vui lòng quay lại trang chọn xe</p>
        </div>
      </div>
    );
  }


  return (
    <>
      <Header />
      <CarBookingPage selectedCar={selectedCar} preFilledSearchData={preFilledSearchData} />
      <Footer />
    </>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-green-700 text-lg">Đang tải thông tin đặt xe...</p>
        </div>
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}