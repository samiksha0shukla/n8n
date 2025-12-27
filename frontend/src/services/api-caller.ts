import axios from "axios";

// === Base URL ===
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8001";

// === Token helpers ===
export function getToken(): string | null {
  const token = localStorage.getItem("access_token");
  // Handle the case where token was stored as JSON string
  if (token && token.startsWith('"') && token.endsWith('"')) {
    return token.slice(1, -1);
  }
  return token;
}

export function setToken(token: string): void {
  localStorage.setItem("access_token", token);
}

export function removeToken(): void {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
}

// === Axios Instance ===
export const apiCaller = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  validateStatus: (status) => {
    // Return response for all status codes (we handle errors in services)
    return status >= 200 && status < 500;
  },
});

// === Request Interceptor - Add Auth Token ===
apiCaller.interceptors.request.use(
  (config) => {
    const token = getToken();
    console.log('[API] Request:', config.method?.toUpperCase(), config.url);
    console.log('[API] Token:', token ? `${token.substring(0, 30)}...` : 'NO TOKEN');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// === Response Interceptor - Handle Errors ===
apiCaller.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth and redirect
      removeToken();
      // Only redirect if not already on auth page
      if (!window.location.pathname.includes('/auth')) {
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

