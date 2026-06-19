import express from "express";
import Event from "../models/Event.js";
import Seat from "../models/Seat.js";

const router = express.Router();

/**
 * @route   GET /api/events
 * @desc    Get all premium events with complete sorting catalog
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    const events = await Event.find({}).sort({ date: 1 });
    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error retrieving premium event catalogs.",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/events/:id
 * @desc    Get detailed event profile alongside its synchronized matrix seats
 * @access  Public
 */
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "The requested live scene could not be found.",
      });
    }

    // CRITICAL ENGINE FIX: Fetch all corresponding layout seats assigned to this event ID
    const seats = await Seat.find({ eventId: req.params.id }).sort({
      seatNumber: 1,
    });

    // Bundle everything cleanly into the expected data packet wrapper
    res.status(200).json({
      success: true,
      data: {
        ...event._doc,
        seats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error parsing database seating layout layers.",
      error: error.message,
    });
  }
});

export default router;
