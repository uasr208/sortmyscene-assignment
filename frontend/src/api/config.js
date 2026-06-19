import axios from "axios";

// Automatically shifts base connection URLs depending on environment variables
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://sortmyscene-backend.onrender.com/api" // Put your live Render URL here
    : "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
