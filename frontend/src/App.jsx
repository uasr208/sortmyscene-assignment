import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Ticket, User } from "lucide-react";

function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Universal Navigation Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl tracking-tight">
            <Ticket className="w-6 h-6 stroke-[2.5]" />
            <span>
              SortMyScene{" "}
              <span className="text-slate-800 font-medium">Events</span>
            </span>
          </div>

          <div className="flex items-center gap-3 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
            <User className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-semibold text-slate-700">
              {user.name}
            </span>
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-blue-800 font-medium text-center">
          👋 Code architecture initialized successfully! Ready to render live
          events.
        </div>
      </main>
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
