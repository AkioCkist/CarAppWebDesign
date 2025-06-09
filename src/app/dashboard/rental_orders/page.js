'use client'

import { useState, useEffect } from 'react'
import BookingCard from '../../../../components/BookingCard'
import ModalBookingDetail from '../../../../components/ModalBookingDetail'

export default function RentalOrdersPage() {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [statusFilter, setStatusFilter] = useState('all')
    const [selectedBooking, setSelectedBooking] = useState(null)

    useEffect(() => {
        fetchBookings()
    }, [statusFilter])

    const fetchBookings = async () => {
        try {
            setLoading(true)
            const url = new URL('/api/booking', window.location.origin)
            if (statusFilter !== 'all') {
                url.searchParams.append('status', statusFilter)
            }

            const response = await fetch(url)
            if (!response.ok) {
                throw new Error('Failed to fetch bookings')
            }

            const data = await response.json()
            setBookings(data.records)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

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
            pending: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
            confirmed: 'bg-blue-100 text-blue-800 border border-blue-300',
            ongoing: 'bg-green-100 text-green-800 border border-green-300',
            completed: 'bg-gray-100 text-gray-800 border border-gray-300',
            cancelled: 'bg-red-100 text-red-800 border border-red-300'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-4 tracking-wide">
                    Rental Orders
                </h1>
                <div className="flex flex-wrap justify-center gap-3 mt-4">
                    {statusOptions.map(option => (
                        <button
                            key={option.value}
                            onClick={() => setStatusFilter(option.value)}
                            className={`px-4 py-2 rounded-md transition ${
                                statusFilter === option.value
                                    ? getStatusColor(option.value)
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {error ? (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-red-600 text-center">
                        <p>Error: {error}</p>
                        <button
                            onClick={fetchBookings}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            ) : loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
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
