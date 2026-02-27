import axios from "axios";
import { clearAccessToken, getAccessToken, setAccessToken } from "../utils/tokenStore";

const api = axios.create({
  baseURL: "https://krowdless-tech-backend.onrender.com",
  //baseURL: "http://localhost:8082",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach access token
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto Refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          "http://localhost:8082/api/v1/auth/refresh",
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.data.accessToken;

        setAccessToken(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (err) {
        clearAccessToken();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;