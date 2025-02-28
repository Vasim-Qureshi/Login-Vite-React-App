import axios from "axios";
// import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true, // Allows cookies to be sent
});

// Function to refresh token
const refreshToken = async () => {
  try {
    const response = await api.post("/refresh");
    return response.data.accessToken;
  } catch (error) {
    return null;
  }
};

// Request interceptor to attach access token
api.interceptors.request.use(async (config) => {
  let accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    accessToken = await refreshToken();
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    }
  }

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

export default api;
