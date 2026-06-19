import axios from "axios";

// Vite uses import.meta.env to accurately track production builds
const API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:5000/api"
  : "https://sortmyscene-assignment.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
