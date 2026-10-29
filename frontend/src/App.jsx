import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import EventCard from "./components/EventCard";
import EventDetail from "./components/EventDetail";
import MyRegistrations from "./components/MyRegistrations";
import { getEvents } from "./api";

export default function App() {
  const [activeTab, setActiveTab] = useState("explore"); // "explore" | "detail" | "my-registrations"
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [lastRegisteredEvent, setLastRegisteredEvent] = useState(null);

  // Event Catalog State
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = ["All", "AI", "Robotics", "Open Source"];

  // Fetch events when search changes
  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        const data = await getEvents(search);
        setEvents(data);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to connect to backend server");
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      loadEvents();
    }, 200);

    return () => clearTimeout(timer);
  }, [search]);

  // Filter events by category client-side
  const filteredEvents = events.filter((ev) => {
    if (selectedCategory === "All") return true;
    return ev.title.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  function handleSelectEvent(id) {
    setSelectedEventId(id);
    setActiveTab("detail");
  }

  function handleRegistered(updatedEvent) {
    setLastRegisteredEvent(updatedEvent);
    // Optional: Switch to My Registrations after 1.5 seconds or let user click
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9ff]">
      {/* Top App Shell Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8">
        {activeTab === "explore" && (
          <div className="space-y-8">
            {/* Hero Header (Slide 70 & Stitch) */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#6d5ef8] uppercase tracking-wider">
                CampusConnect Platform
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0d1c2e] tracking-tight">
                Find your next campus experience.
              </h1>
              <p className="text-sm text-[#475569] max-w-2xl">
                Discover workshops, tech hackathons, and guest lectures happening across campus.
              </p>
            </div>

            {/* Search Bar & Category Filters (Slide 70) */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#475569] text-xl">
                  search
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search events (e.g. AI, Robotics)..."
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-[#e2e8f0] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#6d5ef8] shadow-sm"
                />
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      selectedCategory === cat
                        ? "bg-[#6d5ef8] text-white shadow-sm"
                        : "bg-white border border-[#e2e8f0] text-[#475569] hover:bg-[#eff4ff]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Event Cards Grid (Slide 70) */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-[#6d5ef8] border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-xs font-medium text-[#475569]">Fetching campus events...</p>
              </div>
            ) : error ? (
              <div className="p-8 bg-white border border-red-200 rounded-xl text-center space-y-3">
                <span className="material-symbols-outlined text-4xl text-red-500">wifi_off</span>
                <p className="text-sm font-semibold text-red-600">{error}</p>
                <p className="text-xs text-[#475569]">
                  Make sure your backend server is running at <code>http://127.0.0.1:8000</code>
                </p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-[#e2e8f0]">
                <span className="material-symbols-outlined text-4xl text-gray-300">search_off</span>
                <p className="mt-2 text-sm text-[#475569]">No events match your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onSelect={handleSelectEvent}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Event Detail View */}
        {activeTab === "detail" && (
          <EventDetail
            eventId={selectedEventId}
            onBack={() => setActiveTab("explore")}
            onRegistered={handleRegistered}
          />
        )}

        {/* My Registrations View */}
        {activeTab === "my-registrations" && (
          <MyRegistrations
            lastRegisteredEvent={lastRegisteredEvent}
            onBrowseEvents={() => setActiveTab("explore")}
          />
        )}
      </main>
    </div>
  );
}

