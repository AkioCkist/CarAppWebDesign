'use client'
// booking_car/page.js - Sửa lại cách lấy dữ liệu từ URL
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import CarBookingPage from '../../../components/CarBooking';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { useCarLoading } from '../../../components/CarLoading';

function BookingContent() {
  const searchParams = useSearchParams();
  const [selectedCar, setSelectedCar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isLoading: isCarLoading, startLoading, stopLoading, CarLoadingScreen } = useCarLoading();

  const carId = searchParams.get('carId');
  
  // Lấy các tham số tìm kiếm từ URL
  const preFilledSearchData = {
    pickupLocation: searchParams.get('pickupLocation') || searchParams.get('pickUpLocation') || '',
    dropoffLocation: searchParams.get('dropoffLocation') || searchParams.get('dropOffLocation') || '',
    pickupDate: searchParams.get('pickupDate') || searchParams.get('pickUpDate') || '',
    pickupTime: searchParams.get('pickupTime') || searchParams.get('pickUpTime') || '',
    dropoffDate: searchParams.get('dropoffDate') || searchParams.get('dropOffDate') || '',
    dropoffTime: searchParams.get('dropoffTime') || searchParams.get('dropOffTime') || ''
  };

  useEffect(() => {
    if (!carId) {
      setError('Car information not found');
      setIsLoading(false);
      stopLoading();
      return;
    }

    const fetchCar = async () => {
      try {
        setIsLoading(true);
        startLoading();
        // Gọi API Next.js (không dùng PHP nữa)
        const res = await fetch(`/api/vehicles?id=${encodeURIComponent(carId)}`);
        if (!res.ok) throw new Error('Unable to fetch car data');
        let car = await res.json();
        // Nếu trả về là object có records, lấy phần tử đầu tiên
        if (car.records && Array.isArray(car.records)) {
          car = car.records[0];
        }
        if (!car || Object.keys(car).length === 0) {
          throw new Error('Car data not found');
        }
        setSelectedCar(car);
      } catch (error) {
        setError('Unable to load car information. Please try again later.');
      } finally {
        setIsLoading(false);
        stopLoading();
      }
    };

    fetchCar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carId]);

  if (isLoading || isCarLoading) {
    return <CarLoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-200 via-white to-gray-50">
      <Header />
      <div className="h-21 bg-gray/100"></div>
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
    <Suspense fallback={null}>
      <BookingContent />
    </Suspense>
  );
}