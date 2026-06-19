import axios from "axios";

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://sortmyscene-assignment.onrender.com/api" // <-- UPDATED TO MATCH  ACTUAL BACKEND
    : "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
