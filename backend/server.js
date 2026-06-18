import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Load environment configurations
dotenv.config();

// Initialize express app
const app = express();

// Connect to our MongoDB database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json()); // Allows our server to read JSON sent by the user

// Simple Base route to check if server is running
app.get("/", (req, res) => {
  res.send("SortMyScene Ticketing API is running smoothly...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
});
