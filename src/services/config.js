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

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://dashboard.tripogram.com/api";
export const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";

export function getApiHeaders(extraHeaders = {}) {
  return {
    "Content-Type": "application/json",
    ...(API_KEY ? { "x-api-key": API_KEY } : {}),
    ...extraHeaders,
  };
}

// ✅ axios instance with timeout
export const api = axios.create({
  baseURL: API_URL,
  headers: getApiHeaders(),
  timeout: 100000, // 100 second timeout
});

// ✅ Add request interceptor for better error handling
api.interceptors.request.use(
  (config) => {
    // Add timeout to every request
    config.timeout = config.timeout || 100000;
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
      console.error('Request timeout:', error.config.url);
    }
    return Promise.reject(error);
  }
);
