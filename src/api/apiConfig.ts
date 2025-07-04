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
    console.log('Initial Error:', {
      status: error.response?.status,
      data: error.response?.data,
      url: originalRequest.url,
      retry: originalRequest._retry,
    });

    if (
      error.response?.status === 403 &&
      error.response?.data &&
      typeof error.response.data === 'object' &&
      'message' in error.response.data &&
      error.response.data.message === 'Your account has been banned by Admin'
    ) {
      console.log('User banned');
      store.dispatch(clearCredentials());
      window.location.href = '/banned';
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      error.response.data &&
      typeof error.response.data === 'object' &&
      'message' in error.response.data &&
      error.response.data.message === 'Access token expired' &&
      !originalRequest._retry
    ) {
      console.log('Triggering refresh, _retry:', originalRequest._retry);
      if (isRefreshing) {
        console.log('Queueing request, queue length:', failedQueue.length);
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
        console.log('Sending refresh request to /auth/tokens/refresh');
        const refreshResponse = await api.post('/auth/tokens/refresh');
        console.log('Refresh response:', refreshResponse.data);
        processQueue(null);
        console.log('Retrying original request:', originalRequest.url);
        return api(originalRequest);
      } catch (refreshError: any) {
        console.error('Refresh failed:', {
          status: refreshError.response?.status,
          data: refreshError.response?.data,
        });
        processQueue(refreshError, null);
        window.location.href = '/login'; // Re-enable redirect
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 401) {
      console.log('Other 401 error, redirecting to login:', error.response?.data);
      window.location.href = '/login';
    }

    console.error('Unhandled error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default api;