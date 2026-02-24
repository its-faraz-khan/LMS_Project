import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  register: (data) => API.post('/auth/register/', data),
  login: (data) => API.post('/auth/login/', data),
  guestLogin: () => API.post('/auth/guest-login/'),
  verifyEmail: (data) => API.post('/auth/verify-email/', data),
  resendOTP: (data) => API.post('/auth/resend-otp/', data),
  forgotPassword: (data) => API.post('/auth/forgot-password/', data),
  resetPassword: (data) => API.post('/auth/reset-password/', data),
  me: () => API.get('/auth/me/'),
};

export default API;
