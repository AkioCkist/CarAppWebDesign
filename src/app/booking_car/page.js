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
  
  // ✅ Decode URL parameters properly và thêm debug log
  const preFilledSearchData = {
    pickupLocation: decodeURIComponent(searchParams.get('pickupLocation') || ''),
    dropoffLocation: decodeURIComponent(searchParams.get('dropoffLocation') || ''),
    pickupDate: searchParams.get('pickupDate') || '',
    pickupTime: searchParams.get('pickupTime') || '',
    dropoffDate: searchParams.get('dropoffDate') || '',
    dropoffTime: searchParams.get('dropoffTime') || ''
  };

  // Debug log để kiểm tra dữ liệu
  useEffect(() => {
    console.log('URL params:', {
      pickupLocation: searchParams.get('pickupLocation'),
      dropoffLocation: searchParams.get('dropoffLocation'),
      pickupDate: searchParams.get('pickupDate'),
      pickupTime: searchParams.get('pickupTime'),
      dropoffDate: searchParams.get('dropoffDate'),
      dropoffTime: searchParams.get('dropoffTime')
    });
    console.log('Processed preFilledSearchData:', preFilledSearchData);
  }, [searchParams]);

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