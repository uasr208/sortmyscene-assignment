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

/**
 * @route   GET /api/events/:id
 * @desc    Retrieve details for a single event along with its live seat grid layout
 * @access  Public
 */
router.get("/:id", async (req, res) => {
  try {
    const eventId = req.params.id;

    // 1. Find the event by its unique ID
    const event = await Event.findById(eventId);

    // If the event doesn't exist, tell the frontend immediately
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    // 2. Find all the seats that belong to this specific event
    // We sort them alphabetically by seat number (A1, A2, B1...) so they arrange perfectly on the screen
    const seats = await Seat.find({ eventId: eventId }).sort({ seatNumber: 1 });

    // 3. Send back a unified package containing both event and seat layout details
    res.status(200).json({
      success: true,
      data: {
        event,
        seats,
      },
    });
  } catch (error) {
    // Handle cases where the ID format is invalid (CastError)
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid Event ID format.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch event details.",
      error: error.message,
    });
  }
});

export default router;
