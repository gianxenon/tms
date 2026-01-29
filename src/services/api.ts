import axios from "axios"; 
import { useAuthStore } from "../features/auth/authStore";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://192.178.0.204:8087/ics";

const api = axios.create({
  baseURL: API_BASE_URL, 
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});
 
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
 
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized, redirecting to login...");
      useAuthStore.setState({ user: null, authChecked: true });
      localStorage.removeItem("auth_token");  
    }
    return Promise.reject(error);
  }
);

export default api;
