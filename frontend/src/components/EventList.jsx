import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Calendar,
  MapPin,
  Users,
  ArrowRight,
  Sparkles,
  Tag,
} from "lucide-react";

export default function EventList({ onSelectEvent }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/events");
        if (response.data.success) {
          setEvents(response.data.data);
        }
      } catch (err) {
        setError(
          "Could not establish connection with backend system. Make sure your local Node server is running.",
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter computations
  const categories = [
    "All",
    ...new Set(events.map((e) => e.category || "General")),
  ];
  const filteredEvents =
    activeFilter === "All"
      ? events
      : events.filter((e) => e.category === activeFilter);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="relative flex items-center justify-center">
          <div className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-indigo-400 opacity-75"></div>
          <div className="relative rounded-full h-12 w-12 border-4 border-indigo-500/20 border-t-indigo-600 animate-spin"></div>
        </div>
        <p className="mt-4 text-slate-500 font-bold text-xs uppercase tracking-widest animate-pulse">
          Syncing Event Feeds...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50/50 border border-rose-200 backdrop-blur-sm text-rose-900 rounded-2xl p-6 text-center max-w-xl mx-auto shadow-sm">
        <p className="font-bold flex items-center justify-center gap-2 text-rose-700">
          ⚠️ Connection Exception
        </p>
        <p className="text-xs font-medium mt-1.5 text-rose-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Premium Typography Welcome Header Banner */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 fill-indigo-100" /> Premium
            Curation Platform
          </span>
          <h1 className="text-3xl font-black text-indigo-100 tracking-tight sm:text-4xl">
            Live Booking Arena
          </h1>
          <p className="text-slate-500 text-sm mt-1 max-w-xl">
            Discover and lock verified ticket entries across elite live scenes
            using fast, synchronized atomic reservation tunnels.
          </p>
        </div>
      </div>

      {/* Modern Filter Bubble Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 select-none cursor-pointer border ${
              activeFilter === cat
                ? "bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/10"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Image-Based Premium Event Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredEvents.map((event) => {
          const eventDate = new Date(event.date);
          const day = eventDate.getDate();
          const month = eventDate.toLocaleDateString("en-IN", {
            month: "short",
          });

          return (
            <div
              key={event._id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-xl hover:border-slate-300/80 hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer"
            >
              {/* Image Container Frame */}
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img
                  src={
                    event.imageUrl ||
                    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
                  }
                  alt={event.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
                {/* Gradient Shadow Overlay underneath text info layers */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />

                {/* Category Floating Token Tag */}
                <span className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1">
                  <Tag className="w-2.5 h-2.5 text-indigo-400 fill-indigo-400/20" />
                  {event.category || "General"}
                </span>

                {/* Floating Date Badge Component */}
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md border border-white/30 rounded-xl px-3 py-1.5 text-center text-slate-900 min-w-[50px] shadow-sm group-hover:bg-white transition-colors">
                  <p className="text-lg font-black leading-none tracking-tight">
                    {day}
                  </p>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 mt-0.5">
                    {month}
                  </p>
                </div>
              </div>

              {/* Details Content Box */}
              <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                <div>
                  <h3 className="font-extrabold text-lg text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors duration-150 line-clamp-2 min-h-[56px]">
                    {event.name}
                  </h3>

                  {/* Property Matrix Grid */}
                  <div className="space-y-3 mt-4 text-xs text-slate-500 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-slate-50 rounded-lg text-slate-400 group-hover:text-indigo-500 transition-colors">
                        <Calendar className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-semibold text-slate-600">
                        {eventDate.toLocaleDateString("en-IN", {
                          weekday: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-slate-50 rounded-lg text-slate-400 group-hover:text-indigo-500 transition-colors">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-semibold text-slate-600 truncate max-w-[200px]">
                        {event.venue}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-slate-50 rounded-lg text-slate-400 group-hover:text-indigo-500 transition-colors">
                        <Users className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-semibold text-slate-600">
                        {event.totalSeats} Total Capacities
                      </span>
                    </div>
                  </div>
                </div>

                {/* Main Action Call Button */}
                <button
                  onClick={() => onSelectEvent(event)}
                  className="w-full mt-4 bg-slate-950 text-white rounded-xl py-3 px-4 text-xs font-bold tracking-wide shadow-sm hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-600/10 transition-all duration-200 flex items-center justify-center gap-2 group/btn active:scale-[0.98]"
                >
                  <span>Get Tickets</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
