// Authentication and user utility functions

/**
 * Get current user data from localStorage
 * @returns {Object|null} User data or null if not logged in
 */
export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  
  try {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Set current user data in localStorage
 * @param {Object} userData - User data to store
 */
export function setCurrentUser(userData) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('user', JSON.stringify(userData));
  } catch (error) {
    console.error('Error setting current user:', error);
  }
}

/**
 * Remove current user data from localStorage
 */
export function removeCurrentUser() {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Error removing current user:', error);
  }
}

/**
 * Check if user is logged in
 * @returns {boolean} True if user is logged in
 */
export function isUserLoggedIn() {
  const user = getCurrentUser();
  return user && (user.account_id || user.id);
}

/**
 * Toggle vehicle favorite status for a user
 * @param {number} accountId - ID of the user account  
 * @param {number} vehicleId - ID of the vehicle
 * @returns {Promise<Object>} API response
 */
export async function toggleVehicleFavorite(accountId, vehicleId) {
  try {
    const response = await fetch('/api/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        account_id: accountId,
        vehicle_id: vehicleId,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to toggle favorite');
    }

    return data;
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
}

/**
 * Get user's favorite vehicles
 * @param {number} accountId - ID of the user account
 * @returns {Promise<Array>} Array of favorite vehicles
 */
export async function getUserFavorites(accountId) {
  try {
    const response = await fetch(`/api/favorites?account_id=${accountId}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get favorites');
    }

    return data.data || [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    throw error;
  }
}
