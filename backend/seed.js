import mongoose from "mongoose";
import dotenv from "dotenv";
import Event from "./models/Event.js";
import Seat from "./models/Seat.js";
import Reservation from "./models/Reservation.js";

// Load our secret Atlas connection string from the .env file
dotenv.config();

const seedDatabase = async () => {
  try {
    // 1. Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGO_URI);
    console.log(" Connected to MongoDB Atlas for seeding...");

    // 2. Clear out any old data so we start completely fresh
    await Event.deleteMany({});
    await Seat.deleteMany({});
    await Reservation.deleteMany({});
    console.log(" Old data wiped clean from database.");

    // 3. Define 3 sample mock events
    const sampleEvents = [
      {
        name: "Sunburn Music Festival 2026",
        date: new Date("2026-12-25T18:00:00Z"),
        venue: "Goa Vagator Beach Arena",
        totalSeats: 40,
      },
      {
        name: "Standup Comedy Night with Zakir",
        date: new Date("2026-07-10T20:00:00Z"),
        venue: "NCPA Mumbai Auditorium",
        totalSeats: 30,
      },
      {
        name: "IPL Finals 2026 Screening",
        date: new Date("2026-06-01T19:30:00Z"),
        venue: "DLF CyberHub Gurugram",
        totalSeats: 50,
      },
    ];

    // 4. Save the events into our database
    const createdEvents = await Event.insertMany(sampleEvents);
    console.log(` Created ${createdEvents.length} events successfully!`);

    // 5. Automatically create rows of seats for each event
    const rows = ["A", "B", "C", "D", "E"]; // Rows in our theater row layout
    let allSeats = [];

    for (let event of createdEvents) {
      // Calculate how many seats per row we need to hit our total target
      const seatsPerRow = event.totalSeats / rows.length;

      for (let r = 0; r < rows.length; r++) {
        for (let s = 1; s <= seatsPerRow; s++) {
          allSeats.push({
            eventId: event._id,
            seatNumber: `${rows[r]}${s}`, // Generates strings like 'A1', 'A2', 'B1'
            status: "available", // Every seat starts fresh and open
          });
        }
      }
    }

    // 6. Save all our generated seat rows into Atlas in one fast bulk operation
    await Seat.insertMany(allSeats);
    console.log(
      ` Generated and inserted ${allSeats.length} total interactive seats.`,
    );

    console.log(" Database Seeding Finished Successfully! 🌱");
    process.exit(0); // Safely turn off the script execution
  } catch (error) {
    console.error(` Error seeding your database: ${error.message}`);
    process.exit(1);
  }
};

// Fire up our function!
seedDatabase();
