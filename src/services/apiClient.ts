import axios, { CanceledError, AxiosError } from "axios";

// Retrieve the base URL from your environment variables
const baseUrl = import.meta.env.VITE_API_URL;

// Create an Axios instance with the base URL
const axiosInstance = axios.create({
  baseURL: baseUrl,
});

// Add an interceptor to include the auth token with each request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
export { CanceledError, AxiosError };
