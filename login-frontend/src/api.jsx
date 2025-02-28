import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true, 
});

let isRefreshing = false; // Prevent multiple refresh calls

const refreshToken = async () => {
  if (isRefreshing) return null;
  isRefreshing = true;

  try {
    const response = await api.post("/refresh");
    localStorage.setItem("accessToken", response.data.accessToken);
    isRefreshing = false;
    return response.data.accessToken;
  } catch (error) {
    isRefreshing = false;
    console.error("Refresh token failed:", error.response?.data);
    return null;
  }
};

// Attach token to requests
api.interceptors.request.use(async (config) => {
  let accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    accessToken = await refreshToken();
  }

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
