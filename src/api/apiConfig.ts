import axios, { AxiosError, AxiosRequestConfig } from "axios";

const API_BASE_URL =import.meta.env.VITE_BASE_URI
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}
// Create Axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
});

let isRefreshing = false;

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    if (
      error.response?.status === 401 &&
      error.response.data &&
      typeof error.response.data === 'object' &&
      'error' in error.response.data &&
      error.response.data.error === 'Access token expired' &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return Promise.reject(error); // Wait or queue instead
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        await api.post('/auth/refresh');
        console.log('Token refreshed, retrying original request');
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 401 ) {
      console.warn('Unauthorized access — redirecting to login');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);
export default api;