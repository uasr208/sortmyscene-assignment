import express from 'express';
import Seat from '../models/Seat.js';
import Reservation from '../models/Reservation.js';

const router = express.Router();

/**
 * @route   POST /api/reserve
 * @desc    Reserve available seats for a specific event for 10 minutes
 * @access  Public
 */
router.post('/reserve', async (req, res) => {
  try {
    const { userId, eventId, seatNumbers } = req.body;

    // Basic Data Validation
    if (!userId || !eventId || !seatNumbers || !Array.isArray(seatNumbers) || seatNumbers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, eventId, or seatNumbers array.'
      });
    }

    // ATOMIC OPERATION METHOD:
    // Try to update all requested seats from 'available' to 'reserved'
    // $in checks if the seat number is in our requested list
    const updateResult = await Seat.updateMany(
      {
        eventId: eventId,
        seatNumber: { $in: seatNumbers },
        status: 'available' // CRITICAL: Only match if it's currently free!
      },
      {
        $set: { status: 'reserved' }
      }
    );

    // If the number of modified documents doesn't match the number of seats requested,
    // it means at least one seat was already snatched by someone else or doesn't exist!
    if (updateResult.modifiedCount !== seatNumbers.length) {
      // ROLLBACK: If any seat failed, release the ones we accidentally locked
      await Seat.updateMany(
        {
          eventId: eventId,
          seatNumber: { $in: seatNumbers },
          status: 'reserved' // Safely target what we just modified
        },
        {
          $set: { status: 'available' }
        }
      );

      return res.status(409).json({
        success: false,
        message: 'One or more selected seats are no longer available. Please choose different seats.'
      });
    }

    // Set expiration time to exactly 10 minutes from right now
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); [cite: 14]

    // Create the temporary reservation document tracker
    const reservation = await Reservation.create({
      userId,
      eventId,
      seatNumbers,
      expiresAt
    });

    res.status(201).json({
      success: true,
      message: 'Seats reserved successfully for 10 minutes!', [cite: 14]
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error during seat reservation.',
      error: error.message
    });
  }
});


/**
 * @route   POST /api/bookings
 * @desc    Marks the seats as booked and removes the temporary reservation
 * @access  Public
 */
router.post('/bookings', async (req, res) => {
  try {
    const { userId, eventId, seatNumbers } = req.body;

    // 1. Basic input validation
    if (!userId || !eventId || !seatNumbers || !Array.isArray(seatNumbers)) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, eventId, or seatNumbers.'
      });
    }

    // 2. Find the active reservation in our database tracker
    const reservation = await Reservation.findOne({
      userId,
      eventId,
      seatNumbers: { $all: seatNumbers } // Checks if all requested seats match the reservation record
    });

    // Case A: No reservation record found at all
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'No active reservation found for these seats.'
      });
    }

    // Case B: The reservation exists but its 10-minute validity period has expired
    if (new Date() > reservation.expiresAt) {
      // Clean up: Release these seats back to 'available' so others can pick them up
      await Seat.updateMany(
        { eventId, seatNumber: { $in: seatNumbers } },
        { $set: { status: 'available' } }
      );

      // Delete the dead reservation record from our collection tracker
      await Reservation.deleteOne({ _id: reservation._id });

      return res.status(410).json({
        success: false,
        message: 'Your reservation period has expired (10-minute timeout). Please select your seats again.'
      });
    }

    // 3. ATOMIC CONFIRMATION: If everything looks good, update the seats to 'booked'
    await Seat.updateMany(
      {
        eventId,
        seatNumber: { $in: seatNumbers },
        status: 'reserved' // Only target seats currently marked as reserved
      },
      {
        $set: { status: 'booked' }
      }
    );

    // 4. Wipe out the temporary reservation tracker record now that the purchase is complete
    await Reservation.deleteOne({ _id: reservation._id });

    // 5. Send back a beautiful success message!
    res.status(200).json({
      success: true,
      message: 'Tickets booked successfully! Enjoy your event.'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error during booking finalization.',
      error: error.message
    });
  }
});

export default router;