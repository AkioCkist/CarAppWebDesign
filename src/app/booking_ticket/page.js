'use client'

import { Barlow_Condensed, Oswald } from 'next/font/google';
import { Car, Calendar, MapPin, Users, Star, CheckCircle, ArrowLeft, Download } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react'; // Import Suspense
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

// --- Fonts and Styles ---
Font.register({
  family: 'Roboto',
  fonts: [
    { 
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
      fontWeight: 'normal'
    },
    { 
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
      fontWeight: 'bold'
    }
  ],
});

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['700'],
});

const barlow = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '700'],
});

const pdfStyles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#f0fdf4',
    fontFamily: 'Roboto'
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#22c55e'
  },
  companyName: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    color: '#000000',
    marginBottom: 6,
    textAlign: 'center'
  },
  companyInfo: {
    fontSize: 8,
    fontFamily: 'Roboto',
    marginBottom: 3,
    color: '#666666',
    textAlign: 'center'
  },
  documentTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 15
  },
  section: {
    marginBottom: 15
  },
  sectionTitle: {
    backgroundColor: '#22c55e',
    color: 'white',
    padding: 6,
    borderRadius: 6,
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 8
  },
  table: {
    marginTop: 10,
    marginBottom: 15,
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#22c55e'
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#22c55e',
    paddingBottom: 5,
    marginBottom: 5
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#999'
  },
  col1: { width: '40%', fontSize: 9 },
  col2: { width: '20%', textAlign: 'center', fontSize: 9 },
  col3: { width: '20%', textAlign: 'right', fontSize: 9 },
  col4: { width: '20%', textAlign: 'right', fontSize: 9 },
  infoBlock: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#dcfce7'
  },
  label: {
    fontSize: 8,
    color: '#666'
  },
  value: {
    fontSize: 9,
    marginTop: 2
  },
  totalSection: {
    marginTop: 20,
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#22c55e'
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3
  },
  footer: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dcfce7'
  },
  customerInfo: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  customerBlock: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#dcfce7'
  },
  customerLabel: {
    fontSize: 8,
    color: '#666',
    marginBottom: 2
  },
  customerValue: {
    fontSize: 9,
    fontFamily: 'Roboto',
    color: '#000'
  },
});

// --- PDF Document Component ---
const BookingPDF = ({ booking, rentalDays, formatVND, total }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <View style={pdfStyles.header}>
        <Text style={pdfStyles.companyName}>CAR RENTAL</Text>
        <Text style={pdfStyles.companyInfo}>WHALE XE vehicle rental service</Text>
        <Text style={pdfStyles.companyInfo}>VNUK, Da Nang, vietnam</Text>
        <Text style={pdfStyles.companyInfo}>tel.: +84 7355608</Text>
      </View>
      <Text style={pdfStyles.documentTitle}>TAX INVOICE</Text>

      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <View style={{ flex: 1, marginLeft: 20 }}>
          <View style={pdfStyles.infoBlock}>
            <Text style={pdfStyles.label}>Invoice No:</Text>
            <Text style={pdfStyles.value}>#{Math.random().toString(36).substr(2, 9).toUpperCase()}</Text>
          </View>
          <View style={pdfStyles.infoBlock}>
            <Text style={pdfStyles.label}>Date:</Text>
            <Text style={pdfStyles.value}>{new Date().toLocaleDateString()}</Text>
          </View>
        </View>
      </View>

      <View style={pdfStyles.customerInfo}>
        <View style={pdfStyles.customerBlock}>
          <Text style={pdfStyles.customerLabel}>Customer Name:</Text>
          <Text style={pdfStyles.customerValue}>{booking.customer?.name || 'Guest User'}</Text>
        </View>
        <View style={pdfStyles.customerBlock}>
          <Text style={pdfStyles.customerLabel}>Pickup Location:</Text>
          <Text style={pdfStyles.customerValue}>{booking.searchData.pickupLocation}</Text>
        </View>
        <View style={pdfStyles.customerBlock}>
          <Text style={pdfStyles.customerLabel}>Dropoff Location:</Text>
          <Text style={pdfStyles.customerValue}>{booking.searchData.dropoffLocation}</Text>
        </View>
      </View>

      <View style={pdfStyles.table}>
        <View style={pdfStyles.tableHeader}>
          <Text style={pdfStyles.col1}>Items</Text>
          <Text style={pdfStyles.col2}>Duration</Text>
          <Text style={pdfStyles.col3}>Price/Day</Text>
          <Text style={pdfStyles.col4}>Amount</Text>
        </View>
        <View style={pdfStyles.tableRow}>
          <Text style={pdfStyles.col1}>{booking.car.name}</Text>
          <Text style={pdfStyles.col2}>{rentalDays} days</Text>
          <Text style={pdfStyles.col3}>{formatVND(booking.car.base_price)}</Text>
          <Text style={pdfStyles.col4}>{formatVND(booking.car.base_price * rentalDays)}</Text>
        </View>
      </View>

      <View style={pdfStyles.totalSection}>
        <View style={pdfStyles.totalRow}>
          <Text>Taxable Amount</Text>
          <Text>{formatVND(booking.car.base_price * rentalDays)}</Text>
        </View>
        <View style={pdfStyles.totalRow}>
          <Text>VAT (10%)</Text>
          <Text>{formatVND(Math.round(booking.car.base_price * rentalDays * 0.1))}</Text>
        </View>
        <View style={[pdfStyles.totalRow, { fontWeight: 'bold', marginTop: 10 }]}>
          <Text>Total Amount</Text>
          <Text>{formatVND(total)}</Text>
        </View>
      </View>

      <View style={pdfStyles.footer}>
        <View>
          <Text style={{ fontSize: 10, marginBottom: 30 }}>Customer Signature</Text>
          <Text style={{ fontSize: 10 }}>_________________</Text>
        </View>
        <View>
          <Text style={{ fontSize: 10, marginBottom: 30 }}>Authorized Signatory</Text>
          <Text style={{ fontSize: 10 }}>_________________</Text>
        </View>
      </View>
    </Page>
  </Document>
);

// This new component handles all the client-side logic and rendering
const BookingTicket = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const data = searchParams.get('data');
    if (!data) {
      setError('No booking data found in URL.');
      const timer = setTimeout(() => router.push('/booking_car'), 3000);
      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
    
    try {
      const decodedData = JSON.parse(decodeURIComponent(data));
      if (!decodedData.car || !decodedData.searchData) {
        throw new Error('The booking data is incomplete or invalid.');
      }
      setBooking(decodedData);
      setError(null);
    } catch (err) {
      console.error('Failed to parse booking data:', err);
      setError('Failed to load booking details. Data might be corrupted.');
      const timer = setTimeout(() => router.push('/booking_car'), 3000);
      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [searchParams, router]);

  // Loading State
  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <div className="text-red-500 mb-4 text-xl">⚠️ {error}</div>
          <p className="text-gray-600">Redirecting to the booking page shortly...</p>
        </div>
      </main>
    );
  }

  // Error State
  if (!booking) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mb-4"></div>
          <p className="text-green-800">Loading your booking details...</p>
        </div>
      </main>
    );
  }
  
  // --- Helper Functions ---
  const getDayCount = () => {
    const { pickupDate, dropoffDate } = booking.searchData;
    if (!pickupDate || !dropoffDate) return 1;
    const start = new Date(pickupDate);
    const end = new Date(dropoffDate);
    const diff = end.getTime() - start.getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 3600 * 24)));
  };

  const formatVND = (amount) => {
    if (typeof amount !== 'number') amount = Number(amount) || 0;
    return amount.toLocaleString('vi-VN') + ' VND';
  };

  // --- Derived Data ---
  const rentalDays = getDayCount();
  const pricePerDay = booking.car.base_price;
  const rentalPrice = pricePerDay * rentalDays;
  const vat = Math.round(rentalPrice * 0.1);
  const total = rentalPrice + vat;

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100">
      <Header />
      <div className="flex flex-col items-center justify-center p-4 sm:p-8 mt-24 mb-16">
        <div
          className={`
            ${barlow.className}
            relative w-full max-w-6xl rounded-3xl border-2 border-green-300 bg-white shadow-2xl
            flex flex-col md:flex-row overflow-visible
          `}
        >
          {/* Decorative "ticket holes" */}
          <div className="absolute left-0 top-32 h-10 w-10 -translate-x-1/2 rounded-full bg-green-50 border-2 border-green-200 z-10"></div>
          <div className="absolute left-0 bottom-32 h-10 w-10 -translate-x-1/2 rounded-full bg-green-50 border-2 border-green-200 z-10"></div>
          <div className="absolute right-0 top-32 h-10 w-10 translate-x-1/2 rounded-full bg-green-50 border-2 border-green-200 z-10"></div>
          <div className="absolute right-0 bottom-32 h-10 w-10 translate-x-1/2 rounded-full bg-green-50 border-2 border-green-200 z-10"></div>

          {/* Left: Ticket Info */}
          <div className="flex-1 flex flex-col justify-between">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-t-3xl md:rounded-tr-none md:rounded-l-3xl p-6 text-center shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-3 shadow">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h1 className={`${oswald.className} text-3xl font-bold text-white mb-1 tracking-wide`}>
                Booking Confirmed
              </h1>
              <p className="text-green-50 text-lg">Thank you for your reservation!</p>
            </div>

            {/* Ticket Body - Modified with new sections */}
            <div className="space-y-6 p-8 pb-6">
              {/* Reservation ID & Customer Info - New Section */}
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <span className="text-green-700 font-semibold block mb-1">Reservation ID</span>
                    <span className="text-green-900 font-mono">#RSV-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                  </div>
                  <div>
                    <span className="text-green-700 font-semibold block mb-1">Customer Name</span>
                    <span className="text-green-900">{booking.customer?.name || 'Guest User'}</span>
                  </div>
                  <div>
                    <span className="text-green-700 font-semibold block mb-1">Booking Date</span>
                    <span className="text-green-900">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Car Details */}
              <div className="flex items-center gap-5 mb-4">
                <div className="bg-green-100 rounded-2xl p-4 flex items-center justify-center">
                  {booking.car.image ? (
                    <img 
                      src={booking.car.image} 
                      alt={booking.car.name}
                      className="w-12 h-12 object-cover rounded-xl"
                    />
                  ) : (
                    <Car className="w-12 h-12 text-green-600" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-green-800 mb-1">{booking.car.name}</h2>
                  <div className="flex items-center gap-2 text-green-600 text-base">
                    <Users className="w-4 h-4" />
                    <span>{booking.car.type} • {booking.car.seats} seats</span>
                    <span className="ml-2">{booking.car.transmission}</span>
                    <Star className="w-4 h-4 ml-2 text-yellow-400 fill-yellow-400" />
                    <span>{booking.car.rating}</span>
                  </div>
                </div>
              </div>

              {/* Car Features - Enhanced Section */}
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <h3 className="text-green-700 font-semibold mb-3">Vehicle Features</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {booking.car.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 bg-white rounded-lg p-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-green-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rental Period */}
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-700">Rental Period</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-green-800 font-medium">{booking.searchData.pickupDate} {booking.searchData.pickupTime}</span>
                    <span className="text-green-500 font-bold text-xl">→</span>
                    <span className="text-green-800 font-medium">{booking.searchData.dropoffDate} {booking.searchData.dropoffTime}</span>
                  </div>
                  <span className="text-green-600 text-sm">({rentalDays} day(s))</span>
                </div>
              </div>

              {/* Pickup/Dropoff */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 bg-white border border-green-100 rounded-xl p-4 flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="text-green-700 font-semibold">Pickup Location</div>
                    <div className="text-green-600 text-sm">{booking.searchData.pickupLocation}</div>
                  </div>
                </div>
                <div className="flex-1 bg-white border border-green-100 rounded-xl p-4 flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="text-green-700 font-semibold">Dropoff Location</div>
                    <div className="text-green-600 text-sm">{booking.searchData.dropoffLocation}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Pricing & Actions */}
          <div className="flex flex-col justify-between md:border-l border-green-200 bg-gradient-to-b md:bg-gradient-to-r from-green-100 to-emerald-50 rounded-b-3xl md:rounded-bl-none md:rounded-r-3xl p-6 min-w-[320px] w-full md:w-[350px]">
            <div>
              <h3 className="font-bold text-emerald-700 text-xl mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Order Summary
              </h3>
              <div className="space-y-3 text-base">
                <div className="flex justify-between">
                  <span className="text-green-700 font-semibold">Car:</span>
                  <span className="text-emerald-900 font-bold">{booking.car.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700 font-semibold">Category:</span>
                  <span className="text-emerald-900">{booking.car.type} • {booking.car.seats} seats</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700 font-semibold">Rental Period:</span>
                  <span className="text-emerald-900">{booking.searchData.pickupDate} {booking.searchData.pickupTime} → {booking.searchData.dropoffDate} {booking.searchData.dropoffTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700 font-semibold">Duration:</span>
                  <span className="text-emerald-900">{rentalDays} day(s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700 font-semibold">Pickup:</span>
                  <span className="text-emerald-900">{booking.searchData.pickupLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700 font-semibold">Dropoff:</span>
                  <span className="text-emerald-900">{booking.searchData.dropoffLocation}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-green-700">Price per day:</span>
                  <span className="font-bold text-emerald-800">{formatVND(pricePerDay)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">VAT (10%):</span>
                  <span className="font-bold text-emerald-800">{formatVND(vat)}</span>
                </div>
                <div className="flex justify-between border-t border-green-200 pt-3 text-xl">
                  <span className="font-bold text-green-900">Total:</span>
                  <span className="font-bold text-emerald-600">{formatVND(total)}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-8">
              <PDFDownloadLink
                document={
                  <BookingPDF 
                    booking={booking}
                    rentalDays={rentalDays}
                    formatVND={formatVND}
                    total={total}
                  />
                }
                fileName="booking-confirmation.pdf"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white font-bold py-3 px-6 rounded-xl shadow hover:shadow-lg transition-all duration-300 text-base"
              >
                {({ loading }) => (
                  <>
                    <Download className="w-5 h-5" />
                    {loading ? 'Generating PDF...' : 'Download PDF'}
                  </>
                )}
              </PDFDownloadLink>
              <button
                onClick={() => router.push('/')}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-xl shadow hover:shadow-lg transition-all duration-300 text-base"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Homepage
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer className="w-full mt-auto" />
    </main>
  );
};

// The main page component now uses Suspense to wrap the client-side component
const TicketPage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Booking Details...</div>}>
      <BookingTicket />
    </Suspense>
  );
};

export default TicketPage;