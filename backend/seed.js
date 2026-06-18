import mongoose from "mongoose";
import dotenv from "dotenv";
import Event from "./models/Event.js";
import Seat from "./models/Seat.js";
import Reservation from "./models/Reservation.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(" Connected to MongoDB Atlas for advanced premium seeding...");

    // Wipe out legacy data
    await Event.deleteMany({});
    await Seat.deleteMany({});
    await Reservation.deleteMany({});
    console.log(" Old data wiped clean.");

    // 15 Premium Curated Events with real stock images from Unsplash
    const premiumEvents = [
      // Replace the top items inside premiumEvents array in backend/seed.js:
      {
        name: "Cyber-Neon Nights",
        date: new Date("2026-08-24T20:00:00Z"),
        venue: "Nexus Arena",
        totalSeats: 40,
        imageUrl:
          "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
        category: "MUSIC",
      },
      {
        name: "Neural Horizons 2.0",
        date: new Date("2026-08-28T19:00:00Z"),
        venue: "The Grid Pavilion",
        totalSeats: 30,
        imageUrl:
          "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
        category: "TECH",
      },
      {
        name: "Midnight Echoes",
        date: new Date("2026-09-02T21:30:00Z"),
        venue: "Velvet Vault",
        totalSeats: 50,
        imageUrl:
          "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
        category: "MUSIC",
      },
      {
        name: "Global Tech & AI Summit 2026",
        date: new Date("2026-08-15T09:00:00Z"),
        venue: "Pragati Maidan, New Delhi",
        totalSeats: 40,
        imageUrl:
          "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
        category: "Tech",
      },
      {
        name: "Boiler Room: Bengaluru Electronic Edition",
        date: new Date("2026-09-05T22:00:00Z"),
        venue: "The Lalit Ashok, Bengaluru",
        totalSeats: 30,
        imageUrl:
          "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?auto=format&fit=crop&w=800&q=80",
        category: "Music",
      },
      {
        name: "A.R. Rahman Symphony of Stars",
        date: new Date("2026-11-14T18:30:00Z"),
        venue: "DY Patil Stadium, Navi Mumbai",
        totalSeats: 50,
        imageUrl:
          "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80",
        category: "Music",
      },
      {
        name: "Basspod: Underground Dubstep Session",
        date: new Date("2026-06-30T21:00:00Z"),
        venue: "Kitty Su Club, New Delhi",
        totalSeats: 30,
        imageUrl:
          "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
        category: "Music",
      },
      {
        name: "The Broadway Musical: Aladdin",
        date: new Date("2026-10-02T16:00:00Z"),
        venue: "Nita Mukesh Ambani Cultural Centre, Mumbai",
        totalSeats: 40,
        imageUrl:
          "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80",
        category: "Theater",
      },
      {
        name: "Bass & BBQ Lounge Session",
        date: new Date("2026-07-19T13:00:00Z"),
        venue: "Olive Bar & Kitchen, Pune",
        totalSeats: 30,
        imageUrl:
          "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
        category: "Food",
      },
      {
        name: "Comic Con India 2026 Premiere",
        date: new Date("2026-12-05T10:00:00Z"),
        venue: "BEC Exhibition Centre, Mumbai",
        totalSeats: 50,
        imageUrl:
          "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
        category: "PopCulture",
      },
      {
        name: "Anubhav Singh Bassi: New Material",
        date: new Date("2026-06-22T19:00:00Z"),
        venue: "Sirifort Auditorium, New Delhi",
        totalSeats: 30,
        imageUrl:
          "https://images.unsplash.com/photo-1585699324551-f6c309eed262?auto=format&fit=crop&w=800&q=80",
        category: "Comedy",
      },
      {
        name: "Echoes of Earth: Eco-Music Fest",
        date: new Date("2026-12-12T15:00:00Z"),
        venue: "Embassy Riding School, Bengaluru",
        totalSeats: 40,
        imageUrl:
          "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80",
        category: "Music",
      },
      {
        name: "Indian Classical Fusion Night",
        date: new Date("2026-08-29T19:00:00Z"),
        venue: "Chowdiah Memorial Hall, Bengaluru",
        totalSeats: 30,
        imageUrl:
          "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=800&q=80",
        category: "Music",
      },
      {
        name: "TEDx India Event: Beyond Boundaries",
        date: new Date("2026-09-20T10:00:00Z"),
        venue: "IIT Madras Research Park, Chennai",
        totalSeats: 40,
        imageUrl:
          "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80",
        category: "Talks",
      },
      {
        name: "Sun-Downer Poolside Techno Festival",
        date: new Date("2026-06-28T16:30:00Z"),
        venue: "W Hotel Rockpool, Goa",
        totalSeats: 50,
        imageUrl:
          "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
        category: "Music",
      },
    ];

    // Insert events
    const createdEvents = await Event.insertMany(premiumEvents);
    console.log(` Saved ${createdEvents.length} rich premium events!`);

    // Dynamically spawn structured seat mapping for every event
    const rows = ["A", "B", "C", "D", "E"];
    let allSeats = [];

    for (let event of createdEvents) {
      const seatsPerRow = event.totalSeats / rows.length;

      for (let r = 0; r < rows.length; r++) {
        for (let s = 1; s <= seatsPerRow; s++) {
          allSeats.push({
            eventId: event._id,
            seatNumber: `${rows[r]}${s}`,
            status: "available",
          });
        }
      }
    }

    await Seat.insertMany(allSeats);
    console.log(
      ` Spawned ${allSeats.length} custom seat items in database layers.`,
    );
    console.log(" Seeding completed perfectly! 🌱");
    process.exit(0);
  } catch (error) {
    console.error(` Error execution fail during seed: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
