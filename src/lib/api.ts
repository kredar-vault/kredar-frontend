import axios from 'axios';

const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    return '/api/v1';
  }
  const url = process.env.NEXT_PUBLIC_API_URL || 'https://api.staging.kredar.xyz';
  // Ensure we append /api/v1 if it is not already in the URL
  return url.endsWith('/api/v1') ? url : `${url}/api/v1`;
};

export const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Inject authentication token automatically into all outgoing requests
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('kredar_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Automatically handle expired tokens (401 Unauthorized) and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('kredar_token');
        localStorage.removeItem('kredar_current_user');
        localStorage.removeItem('kredar_onboarding_complete');
        window.location.href = '/auth/login?expired=true';
      }
    }
    return Promise.reject(error);
  },
);
