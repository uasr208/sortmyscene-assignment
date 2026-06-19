import React, { useState, useEffect } from "react";
import api from "../api/config.js"; // <-- Import the custom api instance
import { ShieldCheck, Timer, Armchair } from "lucide-react";

export default function SeatSelection({
  event,
  user,
  onBookingSuccess,
  onCancel,
}) {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reservationMessage, setReservationMessage] = useState(null);
  const [isReserved, setIsReserved] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/events/${event._id}`);
        if (response.data.success) {
          setSeats(response.data.data.seats || []);
        }
      } catch (err) {
        console.error(err);
        setReservationMessage({
          type: "error",
          text: "Failed to stream seat data layers from server.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchSeats();
  }, [event._id]);

  useEffect(() => {
    if (!isReserved || timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [isReserved, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleSeatClick = (seat) => {
    if (seat.status === "booked" || isReserved) return;
    if (selectedSeats.includes(seat.seatNumber)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat.seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seat.seatNumber]);
    }
  };

  const handleReserve = async () => {
    if (selectedSeats.length === 0) return;
    try {
      setReservationMessage(null);
      const response = await api.post("/reserve", {
        userId: user.id,
        eventId: event._id,
        seatNumbers: selectedSeats,
      });
      if (response.data.success) {
        setIsReserved(true);
        setReservationMessage({ type: "success", text: response.data.message });
      }
    } catch (err) {
      setReservationMessage({
        type: "error",
        text: err.response?.data?.message || "Conflict: Seats already taken.",
      });
    }
  };

  const handleConfirmBooking = async () => {
    try {
      setReservationMessage(null);
      const response = await api.post("/bookings", {
        userId: user.id,
        eventId: event._id,
        seatNumbers: selectedSeats,
      });
      if (response.data.success) {
        onBookingSuccess({
          event,
          seats: selectedSeats,
          transactionId: Math.random().toString(36).substr(2, 9).toUpperCase(),
        });
      }
    } catch (err) {
      setReservationMessage({
        type: "error",
        text: err.response?.data?.message || "Transaction error.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-500">
        <div className="rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-black tracking-widest animate-pulse">
          Mapping Seating Matrix Layers...
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2 bg-[#111726] border border-slate-800/60 rounded-2xl p-6 flex flex-col items-center">
        <div className="w-full max-w-md mx-auto mb-12 text-center">
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent rounded-full opacity-60" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 block mt-2.5">
            STAGE / SCREEN AREA
          </span>
        </div>

        <div className="w-full max-w-md my-4">
          <div className="grid grid-cols-8 gap-3">
            {seats.map((seat) => {
              const isSelected = selectedSeats.includes(seat.seatNumber);
              const isBooked =
                seat.status === "booked" ||
                seat.status === "unavailable" ||
                seat.status === "confirmed";
              const isTemporarilyLocked =
                seat.status === "reserved" && !isSelected;

              return (
                <button
                  key={seat._id}
                  disabled={
                    isBooked ||
                    isTemporarilyLocked ||
                    (isReserved && !isSelected)
                  }
                  onClick={() => handleSeatClick(seat)}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center text-[10px] font-black tracking-tight border transition-all cursor-pointer select-none relative ${
                    isBooked
                      ? "bg-rose-950/20 border-rose-900/30 text-rose-800 cursor-not-allowed opacity-30 pointer-events-none"
                      : isTemporarilyLocked
                        ? "bg-amber-950/20 border-amber-900/30 text-amber-800 cursor-not-allowed opacity-40"
                        : isSelected
                          ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30 scale-105"
                          : "bg-[#182235] border-slate-800/80 text-slate-400 hover:border-slate-600 hover:text-white"
                  }`}
                >
                  <Armchair className="w-3.5 h-3.5 mb-0.5 opacity-70" />
                  {seat.seatNumber}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-6 mt-10 border-t border-slate-800/60 pt-6 text-[11px] font-black uppercase tracking-wider text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-[#182235] border border-slate-800" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-indigo-600" />
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-rose-950/50 border border-rose-900/50 opacity-40" />
            <span>Booked</span>
          </div>
        </div>
      </div>

      <div className="bg-[#111726] border border-slate-800/60 rounded-2xl p-5 space-y-6">
        <div>
          <h3 className="font-extrabold text-lg text-white">
            Reservation Summary
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 truncate">{event.name}</p>
        </div>

        <div className="bg-[#080c14] border border-slate-800/80 rounded-xl p-4 min-h-[72px] flex flex-wrap gap-2 items-center">
          {selectedSeats.length === 0 ? (
            <p className="text-xs font-semibold text-slate-500 w-full text-center">
              No seats selected yet.
            </p>
          ) : (
            selectedSeats.map((s) => (
              <span
                key={s}
                className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black px-2.5 py-1 rounded-lg"
              >
                Seat {s}
              </span>
            ))
          )}
        </div>

        {isReserved && (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl p-3 flex items-center justify-between text-xs font-black tracking-wide animate-pulse">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4" />
              <span>HOLDING ENTRY TICKETS:</span>
            </div>
            <span className="font-mono text-sm tracking-widest">
              {formatTime(timeLeft)}
            </span>
          </div>
        )}

        {reservationMessage && (
          <div
            className={`p-3 rounded-xl text-xs font-bold border ${reservationMessage.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border-rose-500/20 text-pink-400"}`}
          >
            {reservationMessage.text}
          </div>
        )}

        {!isReserved ? (
          <button
            disabled={selectedSeats.length === 0}
            onClick={handleReserve}
            className="w-full bg-indigo-600 disabled:bg-slate-800 disabled:text-slate-500 disabled:border-transparent disabled:cursor-not-allowed hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-widest py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Lock Temporary Hold</span>
          </button>
        ) : (
          <button
            onClick={handleConfirmBooking}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Confirm Booking & Pay</span>
          </button>
        )}

        <button
          onClick={onCancel}
          className="w-full text-slate-500 hover:text-slate-300 font-bold text-center text-xs uppercase tracking-wider cursor-pointer transition-colors pt-1 block"
        >
          Cancel Selection
        </button>
      </div>
    </div>
  );
}
