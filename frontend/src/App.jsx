import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import EventList from "./components/EventList.jsx";
import { Compass, Wallet, Ticket, User, Coins } from "lucide-react";

function Dashboard() {
  const { user } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 selection:bg-indigo-500/30">
      {/* Top Header Bar from image */}
      <header className="border-b border-slate-900/80 bg-[#0b0f19]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div
            onClick={() => setSelectedEvent(null)}
            className="flex flex-col cursor-pointer select-none"
          >
            <span className="text-sm tracking-[0.2em] font-black uppercase text-slate-200 leading-none">
              SCENE
            </span>
            <span className="text-sm tracking-[0.15em] font-black uppercase text-indigo-400 mt-0.5 leading-none">
              ARCHIVE
            </span>
          </div>

          {/* Mock Crypto Wallet & Profile token combo from your image layout */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#121926] border border-slate-800 px-3 py-1.5 rounded-xl shadow-inner text-xs font-bold text-slate-300">
              <Coins className="w-4 h-4 text-emerald-400" />
              <span>2.45 ETH</span>
            </div>
            <div className="w-8 h-8 rounded-full border border-indigo-500/50 overflow-hidden bg-slate-800 flex items-center justify-center">
              <span className="text-xs font-black text-indigo-400">AS</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Feed Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28">
        {!selectedEvent ? (
          <EventList onSelectEvent={(event) => setSelectedEvent(event)} />
        ) : (
          <div className="bg-[#111726] border border-slate-800/80 rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
            <h2 className="text-2xl font-black tracking-tight text-white">
              Interactive Seat Matrix
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Live Allocation Layer for:{" "}
              <span className="font-bold text-indigo-400">
                {selectedEvent.name}
              </span>
            </p>

            <div className="h-[250px] my-6 bg-[#080c14] border border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 text-sm">
              [ Interactive Seat Selection Matrix Mounting Area ]
            </div>

            <button
              onClick={() => setSelectedEvent(null)}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all border border-slate-700 cursor-pointer"
            >
              ← Back to Live Arena
            </button>
          </div>
        )}
      </main>

      {/* Bottom Floating Premium Navigation Dock from your image */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-[#090d16]/90 backdrop-blur-md border-t border-slate-900 px-4 py-2.5 flex justify-center shadow-[0_-10px_25px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between max-w-md w-full gap-2">
          <button
            onClick={() => setSelectedEvent(null)}
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
