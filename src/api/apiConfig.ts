import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { clearCredentials } from "../redux/slices/authSlice";
import { store } from "../redux/store";

const API_BASE_URL = import.meta.env.VITE_BASE_URI
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}
// Create Axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (error: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
  

    if (
      error.response?.status === 403 &&
      error.response?.data &&
      typeof error.response.data === 'object' &&
      'message' in error.response.data &&
      error.response.data.message === 'Your account has been banned by Admin'
    ) {
      console.log("banned")
      store.dispatch(clearCredentials());
      // Redirect to banned page
      window.location.href = '/banned';
      return Promise.reject(error);
    }
    if (
      error.response?.status === 401 &&
      error.response.data &&
      typeof error.response.data === 'object' &&
      'error' in error.response.data &&
      error.response.data.error === 'Access token expired' &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(api(originalRequest)),
            reject: (err) => reject(err),
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("before refresh req")
        await api.post('/auth/tokens/refresh');
        console.log("after refresh req")
        // Refresh token
        processQueue(null); // Retry all failed requests
        return api(originalRequest); // Retry original request
      } catch (refreshError) {
        
        processQueue(refreshError, null);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Other 401s (not token expired)
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;