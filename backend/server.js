import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import eventRoutes from "./routes/eventRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

dotenv.config();

const app = express();

// Enable json body parsing
app.use(express.json());

// Dynamic Production CORS Configurations
const allowedOrigins = [
  "http://localhost:5173",
  "https://sortmyscene-assignment-gilt.vercel.app", // <-- UPDATED TO MATCH  ACTUAL FRONTEND
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allows server tools, curl, or direct postman queries without an explicit origin header
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  }),
);

// Route Middlewares
app.use("/api/events", eventRoutes);
app.use("/api", bookingRoutes);

// Root Healthcheck Probe Route (Helps Render verify application status)
app.get("/", (req, res) => {
  res.status(200).json({
    status: "online",
    service: "SortMyScene Seating Allocation Engine Engine",
  });
});

// Database Connectivity Layer
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas Infrastructure Synced Successfully"))
  .catch((err) => console.error("Database Connection Failure:", err));

// Dynamic Port Binding for Render Cloud Environment
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server executing operations on production port ${PORT}`);
});
