// import axios from "axios";

// export const API_URL = process.env.NEXT_PUBLIC_API_URL;

// // ✅ axios instance
// export const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// }); 


import axios from "axios";

// [LOCAL DEV]: Fallback points to local PHP/Laragon; live backend URL is configured via NEXT_PUBLIC_API_URL in .env / .env.local
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1/tripo/public/api";
export const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "3N9RtfOtr06G5g1f4uHNe2CcaaAixeAjAeh6ZPRzLwM=";

export function getApiHeaders(extraHeaders = {}) {
  return {
    "Content-Type": "application/json",
    ...(API_KEY ? { "x-api-key": API_KEY } : {}),
    ...extraHeaders,
  };
}

// [LOCAL DEV]: Increased timeout from 8000ms to 30000ms because local Windows `php artisan serve`
// is single-threaded and queues parallel requests. Restore 8000 for live production backend if desired.
export const api = axios.create({
  baseURL: API_URL,
  headers: getApiHeaders(),
  timeout: 30000, // Production default was: 8000
});

// ✅ Add request interceptor for better error handling
api.interceptors.request.use(
  (config) => {
    config.timeout = config.timeout || 30000; // Production default was: 8000
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.warn('Request timeout:', error.config?.url);
    }
    return Promise.reject(error);
  }
);
