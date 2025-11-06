import axios from "axios";

// === Base URL ===
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8001";

// === Token helpers ===
export function getToken() {
  return localStorage.getItem("access_token");
}

export function setToken(token: string) {
  localStorage.setItem("access_token", token);
}

export function removeToken() {
  localStorage.removeItem("access_token");
}

// === Axios Instance ===
export const apiCaller = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  validateStatus: (status) => {
    // Allow catching 4xx responses instead of throwing
    return status >= 200 && status <= 500;
  },
});
