import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import eventRoutes from "./routes/eventRoutes.js"; // <-- Import your new route file

// Load environment configurations
dotenv.config();

// Initialize express app
const app = express();

// Connect to our MongoDB database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Mount our specialized API routes
app.use("/api/events", eventRoutes); // <-- Connect route to the path

// Base fallback route
app.get("/", (req, res) => {
  res.send("SortMyScene Ticketing API is running smoothly...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
});
