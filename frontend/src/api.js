// ============================================================
// CampusConnect Frontend API Service
// Connects React UI to the FastAPI Backend (Day 1 Workshop)
// ============================================================

const API_BASE_URL = "http://127.0.0.1:8000/api";

// Seeded test student ID from Slide 47 & 53
export const CURRENT_STUDENT_ID = "22222222-2222-2222-2222-222222222222";
export const CURRENT_STUDENT_EMAIL = "student1@campus.edu";

/**
 * FR-02: Browse all events (optional search filter)
 */
export async function getEvents(search = "") {
  const url = search 
    ? `${API_BASE_URL}/events?search=${encodeURIComponent(search)}` 
    : `${API_BASE_URL}/events`;
    
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch events");
  return await res.json();
}

/**
 * FR-03: Get single event details + seats remaining
 */
export async function getEventDetails(eventId) {
  const res = await fetch(`${API_BASE_URL}/events/${eventId}`);
  if (!res.ok) throw new Error("Failed to fetch event details");
  return await res.json();
}

/**
 * FR-04: Register current student for an event (Hero Feature)
 * Returns { success: true, data } or { success: false, error }
 */
export async function registerForEvent(eventId) {
  const res = await fetch(`${API_BASE_URL}/registrations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": CURRENT_STUDENT_ID, // Authentication Context (Slide 47)
    },
    body: JSON.stringify({ event_id: eventId }), // ONLY event_id sent in body!
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      status: res.status,
      error: data.detail || "Registration failed",
    };
  }

  return {
    success: true,
    status: res.status,
    data,
  };
}

/**
 * FR-06: View all events registered by the current student
 */
export async function getMyRegistrations() {
  const res = await fetch(`${API_BASE_URL}/me/registrations`, {
    headers: {
      "x-user-id": CURRENT_STUDENT_ID,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch my registrations");
  return await res.json();
}

