// src/api/api.js
import axios from "axios";

let token = localStorage.getItem("atm_token");

export function setAuthToken(newToken) {
  token = newToken;
}

const api = axios.create({
  baseURL: "https://advanced-task-manager-ky47.onrender.com",
  headers: {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : undefined,
  },
});

// Response interceptor to safely parse JSON
api.interceptors.response.use(
  (response) => {
    if (typeof response.data === "string") {
      try {
        response.data = JSON.parse(response.data);
      } catch (err) {
        console.warn("Failed to parse response as JSON", err);
        response.data = {};
      }
    }
    return response;
  },
  (error) => Promise.reject(error)
);

export default api;
