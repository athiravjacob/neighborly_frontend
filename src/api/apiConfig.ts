import axios, { InternalAxiosRequestConfig } from "axios";
import { store } from "../redux/store"; // Your store with redux-persist

const API_BASE_URL = "http://localhost:4000";

// Create Axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const { accessToken } = store.getState().auth;
      if (accessToken) {
        config.headers = config.headers || {};
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
export default api;