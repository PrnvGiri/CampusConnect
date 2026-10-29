import React, { useState, useEffect } from "react";
import { getMyRegistrations, CURRENT_STUDENT_EMAIL } from "../api";

export default function MyRegistrations({ lastRegisteredEvent, onBrowseEvents }) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadRegistrations() {
      try {
        setLoading(true);
        const data = await getMyRegistrations();
        setRegistrations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadRegistrations();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 1. Optional Hero Success Block if just registered (Slide 72) */}
      {lastRegisteredEvent && (
        <section className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6 sm:p-8 text-center border-t-4 border-t-[#10b981]">
          <div className="w-14 h-14 rounded-full bg-green-50 text-[#10b981] flex items-center justify-center mx-auto mb-3 ring-8 ring-green-50/50">
            <span className="material-symbols-outlined text-3xl">check_circle</span>
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-green-50 text-[#10b981] font-bold text-xs uppercase tracking-wider mb-2">
            Confirmed
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0d1c2e]">
            You're Registered for {lastRegisteredEvent.title}!
          </h2>
          <p className="mt-1 text-sm text-[#475569]">
            A confirmation has been saved to your student account ({CURRENT_STUDENT_EMAIL}).
          </p>
        </section>
      )}

      {/* 2. Registered Events History List (Slide 72 & FR-06) */}
      <section className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#e2e8f0]">
          <div>
            <h2 className="text-xl font-bold text-[#0d1c2e]">My Registrations</h2>
            <p className="text-xs text-[#475569] mt-0.5">
              Live records fetched from PostgreSQL / Supabase
            </p>
          </div>
          <button
            onClick={onBrowseEvents}
            className="text-xs font-semibold text-[#5442de] hover:underline flex items-center gap-1"
          >
            <span>+ Find More Events</span>
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-8 h-8 border-3 border-[#6d5ef8] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-xs text-[#475569]">Loading your registrations...</p>
          </div>
        ) : error ? (
          <p className="text-sm text-red-600 text-center py-6">{error}</p>
        ) : registrations.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-4xl text-gray-300">event_busy</span>
            <p className="mt-2 text-sm text-[#475569]">You haven't registered for any events yet.</p>
            <button
              onClick={onBrowseEvents}
              className="mt-4 px-4 py-2 bg-[#6d5ef8] text-white rounded-lg text-xs font-semibold"
            >
              Browse Campus Events
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {registrations.map((reg) => (
              <div
                key={reg.id}
                className="p-4 sm:p-5 rounded-xl border border-[#e2e8f0] bg-[#f8f9ff] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#e6eeff] text-[#5442de] flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-xl">event_available</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#0d1c2e]">
                      {reg.events?.title || "Campus Event"}
                    </h3>
                    <p className="text-xs text-[#475569] mt-0.5">
                      Registration ID: <code className="font-mono text-[11px] text-[#5442de]">{reg.id.slice(0, 8)}...</code>
                    </p>
                    <p className="text-xs text-[#475569] mt-0.5">
                      Booked on: {new Date(reg.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <span className="px-3 py-1 rounded-full bg-green-50 text-[#10b981] border border-green-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
                    <span>Confirmed</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

