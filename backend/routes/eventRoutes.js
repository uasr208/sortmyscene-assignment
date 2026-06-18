import express from "express";
import Event from "../models/Event.js";

const router = express.Router();

/**
 * @route   GET /api/events
 * @desc    Retrieve a list of all available events
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    // Fetch all events from MongoDB Atlas and sort them by date (soonest first)
    const events = await Event.find({}).sort({ date: 1 });

    // Return the events array with a 200 OK status code
    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    // If something breaks (like database down), send a clean error back
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch events.",
      error: error.message,
    });
  }
});

export default router;
