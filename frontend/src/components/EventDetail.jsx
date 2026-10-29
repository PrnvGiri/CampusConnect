import React, { useState, useEffect } from "react";
import { getEventDetails, registerForEvent } from "../api";

export default function EventDetail({ eventId, onBack, onRegistered }) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Registration Button State Machine: 'idle' | 'submitting' | 'success' | 'duplicate' | 'full' | 'error'
  const [regState, setRegState] = useState("idle");
  const [regMessage, setRegMessage] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await getEventDetails(eventId);
        setEvent(data);
        if (data.seats_left <= 0) {
          setRegState("full");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [eventId]);

  async function handleRegister() {
    setRegState("submitting");
    setRegMessage("");

    const result = await registerForEvent(eventId);

    if (result.success) {
      setRegState("success");
      setRegMessage("Registration confirmed! Your seat is reserved.");
      // Refresh event seat count
      const updated = await getEventDetails(eventId);
      setEvent(updated);
      if (onRegistered) {
        onRegistered(updated);
      }
    } else {
      if (result.error === "DUPLICATE_REGISTRATION") {
        setRegState("duplicate");
        setRegMessage("You are already registered for this event.");
      } else if (result.error === "EVENT_FULL") {
        setRegState("full");
        setRegMessage("Registration is full. No more seats available.");
      } else {
        setRegState("error");
        setRegMessage(result.error || "Registration failed. Please try again.");
      }
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-[#6d5ef8] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-[#475569]">Loading event details...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl border border-red-200 text-center">
        <p className="text-red-600 font-semibold">{error || "Event not found"}</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-[#6d5ef8] text-white rounded-lg text-sm"
        >
          Back to Events
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm font-semibold text-[#475569] hover:text-[#5442de] transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        <span>Back to Events</span>
      </button>

      {/* Main Event Card (Slide 71) */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="h-64 sm:h-72 w-full bg-gradient-to-r from-[#5442de] to-[#6d5ef8] p-8 flex flex-col justify-end text-white relative">
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider">
              {event.status === "open" ? "Registration Open" : "Closed"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {event.title}
          </h1>
          <p className="mt-1 text-white/80 text-sm">
            CampusConnect Exclusive Workshop Series
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Key Facts Badges (Slide 71) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#f8f9ff] border border-[#e2e8f0]">
            <div>
              <span className="text-xs text-[#475569] block">Date</span>
              <span className="text-sm font-bold text-[#0d1c2e]">This Friday</span>
            </div>
            <div>
              <span className="text-xs text-[#475569] block">Time</span>
              <span className="text-sm font-bold text-[#0d1c2e]">5:00 PM - 7:30 PM</span>
            </div>
            <div>
              <span className="text-xs text-[#475569] block">Venue</span>
              <span className="text-sm font-bold text-[#0d1c2e]">Main Seminar Hall</span>
            </div>
            <div>
              <span className="text-xs text-[#475569] block">Remaining Seats</span>
              <span className={`text-sm font-bold ${event.seats_left < 10 ? "text-[#f97360]" : "text-[#10b981]"}`}>
                {event.seats_left} seats left
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-base font-bold text-[#0d1c2e] mb-2">About This Event</h3>
            <p className="text-sm text-[#475569] leading-relaxed">
              Join students and mentors for this intensive session on {event.title}. 
              Seats are strictly limited to {event.capacity} attendees to ensure hands-on guidance. 
              Confirm your registration below to reserve your spot!
            </p>
          </div>

          {/* Alert Message Banner based on state */}
          {regMessage && (
            <div
              className={`p-4 rounded-xl border flex items-center gap-3 text-sm font-medium ${
                regState === "success"
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {regState === "success" ? "check_circle" : "error"}
              </span>
              <span>{regMessage}</span>
            </div>
          )}

          {/* Action CTA with State Machine (Slide 71 & 79) */}
          <div className="pt-2">
            {regState === "success" ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  disabled
                  className="flex-1 py-3 px-6 rounded-lg bg-[#10b981] text-white font-bold text-sm flex items-center justify-center gap-2 cursor-default"
                >
                  <span className="material-symbols-outlined text-[18px]">done</span>
                  <span>Registered</span>
                </button>
              </div>
            ) : regState === "full" ? (
              <button
                disabled
                className="w-full py-3 px-6 rounded-lg bg-gray-300 text-gray-500 font-bold text-sm cursor-not-allowed"
              >
                Event Full (0 Seats Left)
              </button>
            ) : (
              <button
                onClick={handleRegister}
                disabled={regState === "submitting"}
                className="w-full py-3 px-6 rounded-lg bg-[#6d5ef8] hover:bg-[#5442de] active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md"
              >
                {regState === "submitting" ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Registering...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                    <span>Register Now</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

