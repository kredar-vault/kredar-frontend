import axios from 'axios';
import { getToken, clearAuthCookies } from './cookies';

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
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
        clearAuthCookies();
        window.location.href = '/auth/login?expired=true';
      }
    }
    return Promise.reject(error);
  },
);
