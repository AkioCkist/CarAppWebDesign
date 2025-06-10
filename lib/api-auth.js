// Authentication utilities for API
export const getSessionUser = (request) => {
    try {
        const sessionCookie = request.cookies.get('session')?.value;
        if (!sessionCookie) {
            return null;
        }

        const sessionData = JSON.parse(atob(sessionCookie));
        return sessionData;
    } catch (error) {
        console.error('Error parsing session:', error);
        return null;
    }
};

export const requireAuth = (request) => {
    const user = getSessionUser(request);
    if (!user || !user.id) {
        throw new Error('Authentication required');
    }
    return user;
};

export const isAdmin = (user) => {
    return user?.roles?.some(role => role.name === 'admin') || false;
};

export const canAccessBooking = (user, bookingRenterId) => {
    // Admin can access all bookings
    if (isAdmin(user)) {
        return true;
    }

    // User can only access their own bookings
    return user.id === bookingRenterId;
};
