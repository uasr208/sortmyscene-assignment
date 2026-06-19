import React, { useState, useEffect } from "react";
import api from "../api/config.js"; // <-- Import the custom api instance
import { Calendar, MapPin, Users, ArrowRight, AlertCircle } from "lucide-react";

export default function EventList({ onSelectEvent }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("ALL");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // Clean dynamic routing call using your configured axios instance
        const response = await api.get("/events");
        if (response.data.success) {
          setEvents(response.data.data);
        }
      } catch (err) {
        setError(
          "Connection exception. The remote application server instance is booting.",
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const categories = ["ALL", "MUSIC", "COMEDY", "SPORTS", "TECH"];
  const filteredEvents =
    activeFilter === "ALL"
      ? events
      : events.filter((e) => (e.category || "").toUpperCase() === activeFilter);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="rounded-full h-10 w-10 border-2 border-indigo-500 border-t-transparent animate-spin" />
        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-500">
          Synchronizing Arena...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          Live Booking Arena
        </h1>
        <p className="text-slate-400 text-sm mt-2 max-w-xl font-medium">
          Discover and lock verified ticket entries across elite live scenes.
        </p>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-4 py-1.5 rounded-lg text-xs font-black tracking-wider transition-all cursor-pointer border ${
              activeFilter === cat
                ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20"
                : "bg-[#121926] text-slate-400 border-slate-800/80 hover:text-slate-200 hover:border-slate-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEvents.map((event) => {
          const eventDate = new Date(event.date);
          const day = String(eventDate.getDate()).padStart(2, "0");
          const month = eventDate
            .toLocaleDateString("en-US", { month: "short" })
            .toUpperCase();
          const isCapacitySpecial =
            event.name.includes("Cyber") || event.name.includes("Echoes");

          return (
            <div
              key={event._id}
              className="bg-[#111726] rounded-2xl border border-slate-800/60 shadow-xl overflow-hidden flex flex-col group"
            >
              <div className="relative h-52 bg-slate-900 overflow-hidden">
                <img
                  src={event.imageUrl}
                  alt={event.name}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111726] via-transparent to-transparent" />

                <span
                  className={`absolute top-4 left-4 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md text-white border ${
                    (event.category || "").toUpperCase() === "TECH"
                      ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                      : "bg-pink-500/20 border-pink-500/30 text-pink-400"
                  }`}
                >
                  {event.category || "GENERAL"}
                </span>

                <div className="absolute bottom-4 right-4 bg-[#1b2336]/90 backdrop-blur-sm border border-slate-700/50 rounded-xl px-2.5 py-1.5 text-center text-white min-w-[46px]">
                  <p className="text-base font-black leading-none">{day}</p>
                  <p className="text-[9px] font-black tracking-wide text-slate-400 mt-0.5">
                    {month}
                  </p>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between bg-[#111726]">
                <div className="space-y-3">
                  <h3 className="font-bold text-xl text-white tracking-tight">
                    {event.name}
                  </h3>
                  <div className="space-y-2 text-xs font-semibold text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>
                        {eventDate.toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{event.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isCapacitySpecial ? (
                        <>
                          <AlertCircle
                            className={`w-3.5 h-3.5 ${event.name.includes("Echoes") ? "text-amber-500" : "text-emerald-500"}`}
                          />
                          <span
                            className={
                              event.name.includes("Echoes")
                                ? "text-amber-500/90"
                                : "text-emerald-500/90"
                            }
                          >
                            {event.name.includes("Echoes")
                              ? "Selling Fast"
                              : "Limited Capacity"}
                          </span>
                        </>
                      ) : (
                        <>
                          <Users className="w-3.5 h-3.5 text-slate-500" />
                          <span>{event.totalSeats} Seats Remaining</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectEvent(event)}
                  className="w-full mt-5 bg-indigo-600 text-white rounded-xl py-3 px-4 text-xs font-black tracking-widest uppercase hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Get Tickets</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
