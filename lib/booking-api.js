// Booking API utilities
export const getUserBookings = async (userId, options = {}) => {
    try {
        const { status, limit = 10, offset = 0 } = options;

        const url = new URL('/api/booking', window.location.origin);
        if (userId) {
            url.searchParams.append('userId', userId);
        }
        if (status && status !== 'all') {
            url.searchParams.append('status', status);
        }
        if (limit) {
            url.searchParams.append('limit', limit);
        }
        if (offset) {
            url.searchParams.append('offset', offset);
        }

        const response = await fetch(url.toString());

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Return both records and total for pagination
        return {
            records: data.records || [],
            total: data.total || 0,
            success: true
        };
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        return {
            records: [],
            total: 0,
            success: false,
            error: error.message
        };
    }
};

export const getBookingDetail = async (bookingId) => {
    try {
        const url = new URL('/api/booking', window.location.origin);
        url.searchParams.append('id', bookingId);

        const response = await fetch(url.toString());

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return {
            booking: data,
            success: true
        };
    } catch (error) {
        console.error('Error fetching booking detail:', error);
        return {
            booking: null,
            success: false,
            error: error.message
        };
    }
};

export const updateBookingStatus = async (bookingId, status) => {
    try {
        const response = await fetch('/api/booking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'update_status',
                booking_id: bookingId,
                status: status
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return {
            success: data.success || false,
            message: data.message || 'Status updated',
            error: data.error || null
        };
    } catch (error) {
        console.error('Error updating booking status:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

export const createBooking = async (bookingData) => {
    try {
        const response = await fetch('/api/booking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'create_booking',
                ...bookingData
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return {
            success: data.success || false,
            booking: data.booking || null,
            message: data.message || 'Booking created',
            error: data.error || null
        };
    } catch (error) {
        console.error('Error creating booking:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Format functions for display
export const formatBookingDate = (date) => {
    if (!date) return '--';

    try {
        if (typeof date === 'string') {
            const [year, month, day] = date.split('-');
            return `${day}/${month}/${year}`;
        }
        if (date instanceof Date) {
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }
    } catch (error) {
        console.error('Error formatting date:', error);
    }

    return '--';
};

export const formatBookingTime = (time) => {
    if (!time) return '--';

    try {
        if (typeof time === 'string') {
            // If it's already in HH:MM format
            if (time.includes(':')) {
                return time;
            }
            // If it's a full datetime string
            if (time.includes('T')) {
                return new Date(time).toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }
        }
        if (time instanceof Date) {
            return time.toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    } catch (error) {
        console.error('Error formatting time:', error);
    }

    return '--';
};

export const formatPrice = (price) => {
    if (price == null || price === undefined) return '--';
    try {
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        if (isNaN(numPrice)) return '--';

        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(numPrice);
    } catch (error) {
        console.error('Error formatting price:', error);
        return '--';
    }
};

export const getStatusText = (status) => {
    const statusMap = {
        pending: 'Pending',
        confirmed: 'Confirmed',
        ongoing: 'Ongoing',
        completed: 'Completed',
        cancelled: 'Cancelled'
    };
    return statusMap[status] || status || 'Unknown';
};

export const getStatusColor = (status) => {
    const colorMap = {
        pending: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
        confirmed: 'bg-blue-100 text-blue-800 border border-blue-300',
        ongoing: 'bg-green-100 text-green-800 border border-green-300',
        completed: 'bg-gray-100 text-gray-800 border border-gray-300',
        cancelled: 'bg-red-100 text-red-800 border border-red-300'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800 border border-gray-300';
};
