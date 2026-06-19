import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import EventList from "./components/EventList.jsx";
import SeatSelection from "./components/SeatSelection.jsx"; // <-- Import the Seat View
import { Compass, Wallet, Ticket, User, Coins } from "lucide-react";

function Dashboard() {
  const { user } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeTicket, setActiveTicket] = useState(null);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 selection:bg-indigo-500/30">
      {/* Navigation Top Header Bar */}
      <header className="border-b border-slate-900/80 bg-[#0b0f19]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div
            onClick={() => {
              setSelectedEvent(null);
              setActiveTicket(null);
            }}
            className="flex flex-col cursor-pointer select-none"
          >
            <span className="text-sm tracking-[0.2em] font-black uppercase text-slate-200 leading-none">
              SCENE
            </span>
            <span className="text-sm tracking-[0.15em] font-black uppercase text-indigo-400 mt-0.5 leading-none">
              ARCHIVE
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#121926] border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300">
              <Coins className="w-4 h-4 text-emerald-400" />
              <span>2.45 ETH</span>
            </div>
            <div className="w-8 h-8 rounded-full border border-indigo-500/50 overflow-hidden bg-slate-800 flex items-center justify-center">
              <span className="text-xs font-black text-indigo-400">AS</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Frame Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28">
        {activeTicket ? (
          /* SUCCESS PASS VOUCHER DISPLAY */
          <div className="max-w-md mx-auto bg-[#111726] border border-slate-800 rounded-3xl p-6 text-center shadow-2xl relative overflow-hidden animate-fadeIn border-t-4 border-emerald-500">
            <span className="text-[40px]">🎉</span>
            <h2 className="text-2xl font-black text-white mt-2">
              Booking Confirmed!
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Your entry passport code has been generated.
            </p>

            <div className="my-6 border-y border-dashed border-slate-800 py-4 space-y-3 text-left text-xs font-semibold text-slate-300">
              <div className="flex justify-between">
                <span>EVENT:</span>
                <span className="text-white font-black">
                  {activeTicket.event.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span>PASSPORT SEATS:</span>
                <span className="text-indigo-400 font-black">
                  {activeTicket.seats.join(", ")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>TX HASH SECURITY:</span>
                <span className="font-mono text-slate-400">
                  {activeTicket.transactionId}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveTicket(null);
                setSelectedEvent(null);
              }}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-black text-xs uppercase tracking-widest py-3 rounded-xl transition-all cursor-pointer"
            >
              Return to Live Arena
            </button>
          </div>
        ) : !selectedEvent ? (
          <EventList onSelectEvent={(event) => setSelectedEvent(event)} />
        ) : (
          /* ACTIVE INTERACTIVE SELECTION MATRIX GRID */
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Arena Allocation Layer
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Select and reserve entries for:{" "}
                <span className="font-bold text-indigo-400">
                  {selectedEvent.name}
                </span>
              </p>
            </div>
            <SeatSelection
              event={selectedEvent}
              user={user}
              onBookingSuccess={(ticketInfo) => setActiveTicket(ticketInfo)}
              onCancel={() => setSelectedEvent(null)}
            />
          </div>
        )}
      </main>

      {/* Footer Navigation Dock */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-[#090d16]/90 backdrop-blur-md border-t border-slate-900 px-4 py-2.5 flex justify-center shadow-[0_-10px_25px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between max-w-md w-full gap-2">
          <button
            onClick={() => {
              setSelectedEvent(null);
              setActiveTicket(null);
            }}
            className="flex flex-col items-center gap-1 flex-1 py-1 text-pink-500 bg-pink-500/10 rounded-xl border border-pink-500/20 transition-all cursor-pointer"
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px] font-bold tracking-wide">
              Discovery
            </span>
          </button>
          <button className="flex flex-col items-center gap-1 flex-1 py-1 text-slate-500 hover:text-slate-300 transition-all cursor-pointer">
            <Wallet className="w-5 h-5" />
            <span className="text-[10px] font-medium">Wallet</span>
          </button>
          <button className="flex flex-col items-center gap-1 flex-1 py-1 text-slate-500 hover:text-slate-300 transition-all cursor-pointer">
            <Ticket className="w-5 h-5" />
            <span className="text-[10px] font-medium">Bookings</span>
          </button>
          <button className="flex flex-col items-center gap-1 flex-1 py-1 text-slate-500 hover:text-slate-300 transition-all cursor-pointer">
            <User className="w-5 h-5" />
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  );
}
