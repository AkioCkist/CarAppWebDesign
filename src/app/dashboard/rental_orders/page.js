'use client'

import { useState, useEffect, useCallback } from 'react'
import BookingCard from '../../../../components/BookingCard'
import ModalBookingDetail from '../../../../components/ModalBookingDetail'
import SkeletonLoader from '../../../../components/SkeletonLoader'

export default function RentalOrdersPage() {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadingContent, setLoadingContent] = useState(false)
    const [error, setError] = useState(null)
    const [statusFilter, setStatusFilter] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedBooking, setSelectedBooking] = useState(null)

    const fetchData = useCallback(async (currentStatusFilter, currentSearchTerm) => {
        try {
            const url = new URL('/api/booking', window.location.origin)
            if (currentStatusFilter !== 'all') {
                url.searchParams.append('status', currentStatusFilter)
            }
            if (currentSearchTerm) {
                url.searchParams.append('search', currentSearchTerm)
            }

            const response = await fetch(url)
            if (!response.ok) {
                throw new Error('Failed to fetch bookings')
            }

            const data = await response.json()
            setBookings(data.records)
            return data.records;
        } catch (err) {
            setError(err.message)
            return [];
        }
    }, [])

    useEffect(() => {
        const initialLoadHandler = setTimeout(async () => {
            setLoading(true);
            await fetchData(statusFilter, searchTerm);
            setLoading(false);
        }, 500);

        return () => clearTimeout(initialLoadHandler);
    }, []);

    useEffect(() => {
        if (!loading) {
            setLoadingContent(true);
            const handler = setTimeout(async () => {
                await fetchData(statusFilter, searchTerm);
                setLoadingContent(false);
            }, 500);

            return () => {
                clearTimeout(handler);
            };
        }
    }, [searchTerm, statusFilter, fetchData]);

    const handleBookingClick = (booking) => {
        setSelectedBooking(booking)
    }
    const handleCloseModal = () => setSelectedBooking(null)

    const statusOptions = [
        { value: 'all', label: 'All' },
        { value: 'pending', label: 'Pending' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'ongoing', label: 'Ongoing' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
    ]

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

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800 border border-yellow-300 font-bold',
            confirmed: 'bg-blue-100 text-blue-800 border border-blue-300 font-bold',
            ongoing: 'bg-green-100 text-green-800 border border-green-300 font-bold',
            completed: 'bg-gray-100 text-gray-800 border border-gray-300 font-bold',
            cancelled: 'bg-red-100 text-red-800 border border-red-300 font-bold'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 font-bold';
    };

    const getButtonStyle = (option) => {
        if (statusFilter === option.value) {
            if (option.value === 'all') {
                return 'bg-gray-200 text-gray-900 font-bold border border-gray-300';
            }
            return getStatusColor(option.value);
        }
        return 'bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium';
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md max-w-lg text-center">
                    <p className="font-bold text-xl mb-2">Error Loading Data</p>
                    <p>{error}</p>
                    <p className="text-sm text-gray-600 mt-4">Please try refreshing the page or contact support if the issue persists.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return <SkeletonLoader type="rental-orders-page" />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Rental Orders</h1>
                <div className="flex flex-wrap justify-start gap-3 mt-4 mb-4">
                    {statusOptions.map(option => (
                        <button
                            key={option.value}
                            onClick={() => setStatusFilter(option.value)}
                            className={`px-4 py-2 rounded-md transition ${getButtonStyle(option)}`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search by vehicle name, renter name or location..."
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 font-semibold"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loadingContent ? (
                <SkeletonLoader type="booking-cards-grid" />
            ) : bookings.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No rental orders found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {bookings.map(booking => (
                        <BookingCard
                            key={booking.id}
                            booking={booking}
                            onClick={handleBookingClick}
                        />
                    ))}
                </div>
            )}

            <ModalBookingDetail booking={selectedBooking} onClose={handleCloseModal} />
        </div>
    )
}