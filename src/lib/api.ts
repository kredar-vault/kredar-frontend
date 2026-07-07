import axios from 'axios';
import { getToken, clearAuthCookies } from './cookies';

const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    return '/api/v1';
  }
  const url = process.env.NEXT_PUBLIC_API_URL || '';
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

// Automatically handle expired/invalid sessions (401) and redirect to login.
//
// IMPORTANT CAVEAT: this backend reuses 401 for business-rule rejections too
// (confirmed case: "Live keys require KYB approval..." comes back as a 401,
// not a 403). So we can't just say "401 = log out" anymore. Heuristic used
// here: a real expired/invalid-token 401 typically has no specific message
// body. A business-rule 401 (like the KYB one) comes with a clear `message`.
// So: only force logout when there's NO usable message — otherwise let the
// error pass through so the calling code's own catch/toast can show the
// real reason to the user.
//
// This is a heuristic, not a guarantee, because the backend isn't drawing a
// clean line between "your session is invalid" and "you're not allowed to do
// this" — both come back as 401. The correct long-term fix is on the backend:
// use 403 Forbidden for business-rule rejections, and reserve 401 for actual
// auth/session failures. Flag that to your backend team when you get a
// chance — this frontend workaround will misfire if a future business-rule
// 401 happens to come back with an empty message.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const message = error.response.data?.message;
      const hasBusinessMessage = typeof message === 'string' && message.trim().length > 0;

      if (!hasBusinessMessage && typeof window !== 'undefined') {
        clearAuthCookies();
        window.location.href = '/auth/login?expired=true';
      }
    }
    return Promise.reject(error);
  },
);
