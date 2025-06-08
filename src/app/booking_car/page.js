'use client'
// booking_car/page.js - Sửa lại cách lấy dữ liệu từ URL
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
  
  // Lấy các tham số tìm kiếm từ URL
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
        // Gọi API Next.js (không dùng PHP nữa)
        const res = await fetch(`/api/vehicles?id=${encodeURIComponent(carId)}`);
        if (!res.ok) throw new Error('Không thể lấy dữ liệu xe');
        let car = await res.json();
        // Nếu trả về là object có records, lấy phần tử đầu tiên
        if (car.records && Array.isArray(car.records)) {
          car = car.records[0];
        }
        if (!car || Object.keys(car).length === 0) {
          throw new Error('Không tìm thấy dữ liệu xe');
        }
        setSelectedCar(car);
      } catch (error) {
        setError('Không thể tải thông tin xe. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCar();
  }, [carId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <CarBookingPage 
        selectedCar={selectedCar} 
        preFilledSearchData={preFilledSearchData}
      />
      <Footer />
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingContent />
    </Suspense>
  );
}