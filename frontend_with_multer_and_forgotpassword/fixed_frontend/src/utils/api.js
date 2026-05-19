import axios from 'axios';

// Increase timeout to 30s — Gemini AI can be slow on first call
const API = axios.create({ baseURL: '/api', timeout: 30000 });
const AUTH_STORAGE_KEY = 'himachal_agrorent_user';

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

API.interceptors.request.use((config) => {
  const user = getStoredUser();
  if (user?.token) {
    config.headers.Authorization = 'Bearer ' + user.token;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || '';

    // Auto-logout on expired token
    if (status === 401 && message.toLowerCase().includes('token')) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      delete axios.defaults.headers.common.Authorization;
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Lands
export const getLands = (params) => API.get('/lands', { params });
export const getLand = (id) => API.get(`/lands/${id}`);
export const addLand = (data) => API.post('/lands', data);
export const updateLand = (id, data) => API.put(`/lands/${id}`, data);
export const approveLand = (id, data) => API.patch(`/lands/${id}/approve`, data);
export const setLandAvailability = (id, data) => API.patch(`/lands/${id}/availability`, data);
export const getMyLands = () => API.get('/lands/farmer/my');
export const getAllLands = () => API.get('/lands/admin/all');

// Bookings
export const createBooking = (data) => API.post('/bookings', data);
export const getMyBookings = () => API.get('/bookings/my');
export const getFarmerBookings = () => API.get('/bookings/farmer');
export const getAllBookings = () => API.get('/bookings/admin');
export const updateBookingStatus = (id, data) => API.patch(`/bookings/${id}/status`, data);
export const updateBookingProgress = (id, data) => API.patch(`/bookings/${id}/progress`, data);
export const getBooking = (id) => API.get(`/bookings/${id}`);

// Crops
export const getCrops = () => API.get('/crops');
export const addCrop = (data) => API.post('/crops', data);
export const updateCrop = (id, data) => API.put(`/crops/${id}`, data);
export const deleteCrop = (id) => API.delete(`/crops/${id}`);

// Seasons
export const getSeasons = () => API.get('/seasons');
export const addSeason = (data) => API.post('/seasons', data);
export const updateSeason = (id, data) => API.put(`/seasons/${id}`, data);
export const deleteSeason = (id) => API.delete(`/seasons/${id}`);

// Users
export const getAllUsers = () => API.get('/users');
export const getFarmers = () => API.get('/users/farmers');
export const toggleUser = (id) => API.patch(`/users/${id}/toggle`);
export const updateProfile = (data) => API.put('/users/profile', data);

// AI Chat — only use the correct backend endpoint /api/chat
export const sendChatMessage = (data) => {
  const text = data?.message || data?.prompt || '';
  return API.post('/chat', { prompt: text, message: text });
};

export default API;

// Payment (Razorpay)
export const getRazorpayKey = () => API.get('/payment/key');
export const createPaymentOrder = (data) => API.post('/payment/create-order', data);
export const verifyPayment = (data) => API.post('/payment/verify', data);
