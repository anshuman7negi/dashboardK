import axios from "axios";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "../utils/tokenStore";

const api = axios.create({
  baseURL: "https://api.krowdless.com/",
  // baseURL: "http://localhost:8080",
  withCredentials: true,
});

// ================= REQUEST INTERCEPTOR =================

api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // FormData ke liye browser khud Content-Type set karega
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } else {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

// ================= RESPONSE INTERCEPTOR =================

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          "https://api.krowdless.com/api/v1/auth/refresh",
          {},
          {
            withCredentials: true,
          }
        );

        const newAccessToken = res.data.data.accessToken;

        setAccessToken(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (err) {
        clearAccessToken();
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default api;