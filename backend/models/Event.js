import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    date: { type: Date, required: true },
    venue: { type: String, required: true },
    totalSeats: { type: Number, required: true },
    imageUrl: { type: String }, // <-- Added this field
    category: { type: String, default: "General" }, // <-- Added this field
  },
  { timestamps: true },
);

const Event = mongoose.model("Event", eventSchema);
export default Event;
