// API utility functions
// Get API URL from config or fallback to localhost
const API_URL = window.CONFIG ? window.CONFIG.API_URL : 'http://localhost:5000/api/v1';

// Main API request function
async function apiRequest(endpoint, method = 'GET', data = null, token = null) {
    const url = `${API_URL}${endpoint}`;
    
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }
    
    if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
    }
    
    try {
        // Use real API calls
        const response = await fetch(url, options);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
}

// Authentication functions
async function login(email, password) {
    return apiRequest('/auth/login', 'POST', { email, password });
}

async function register(name, email, password) {
    return apiRequest('/auth/register', 'POST', { name, email, password });
}

async function logout() {
    return apiRequest('/auth/logout');
}

async function getCurrentUser() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
        const response = await apiRequest('/auth/me', 'GET', null, token);
        return response.data;
    } catch (error) {
        localStorage.removeItem('token');
        return null;
    }
}

// Package functions
async function getPackages() {
    return apiRequest('/packages');
}

async function getPackage(id) {
    return apiRequest(`/packages/${id}`);
}

async function createBooking(packageId, bookingData) {
    const token = localStorage.getItem('token');
    return apiRequest(`/packages/${packageId}/bookings`, 'POST', bookingData, token);
}

async function getUserBookings() {
    const token = localStorage.getItem('token');
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    
    return apiRequest(`/users/${user._id}/bookings`, 'GET', null, token);
}

async function processPayment(bookingId, paymentData) {
    const token = localStorage.getItem('token');
    return apiRequest('/payments', 'POST', { booking: bookingId, ...paymentData }, token);
}

// Export functions
window.exploreAPI = {
    login,
    register,
    logout,
    getCurrentUser,
    getPackages,
    getPackage,
    createBooking,
    getUserBookings,
    processPayment
};
