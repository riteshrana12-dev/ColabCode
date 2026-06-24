import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { useToastStore } from "../store/toastStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
  withCredentials: true, // sends cookies (refresh token)
});

// attach access token to every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// if 401, try refresh then retry original request
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const res = await axios.get(
          `http://localhost:3000/api/v1/auth/refreshtoken`,
          {
            withCredentials: true,
          },
        );
        const newToken = res.data.accessToken;
        useAuthStore.getState().setAccessToken(newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        useAuthStore.getState().logout();
        useToastStore.getState().pushToast({
          type: "warning",
          title: "Session expired",
          message: "Please sign in again to continue.",
        });
        window.location.href = "/login";
      }
    }

    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again.";

    if (status !== 401) {
      useToastStore.getState().pushToast({
        type: status >= 500 ? "error" : "warning",
        title: status >= 500 ? "Server error" : "Request failed",
        message,
      });
    }

    return Promise.reject(error);
  },
);

export default api;
