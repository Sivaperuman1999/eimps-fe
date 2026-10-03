import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        console.error("Unauthorized");
      }

      if (error.response?.status === 403) {
        console.error("Forbidden");
      }

      if (error.response?.status === 404) {
        console.error("Resource not found");
      }

      if (error.response?.status && error.response.status >= 500) {
        console.error("Server error");
      }
    }

    return Promise.reject(error);
  },
);

export default api;
