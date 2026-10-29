from fastapi import APIRouter, HTTPException, Header, status
from pydantic import BaseModel
from typing import Optional
from app.supabase_client import supabase

router = APIRouter(prefix="/api", tags=["CampusConnect API"])

# Default test student ID from seeded data (Student 1)
DEFAULT_TEST_STUDENT_ID = "22222222-2222-2222-2222-222222222222"


# ============================================================
# Request / Response Schemas
# ============================================================
class RegistrationRequest(BaseModel):
    event_id: str


# ============================================================
# FR-02: Browse Events
# GET /api/events
# ============================================================
@router.get("/events", summary="Browse all campus events")
def list_events(search: Optional[str] = None):
    query = supabase.table("events").select("id, title, capacity, status, organizer_id")
    if search:
        query = query.ilike("title", f"%{search}%")
    
    response = query.execute()
    return response.data


# ============================================================
# FR-03: View Event Details
# GET /api/events/{event_id}
# ============================================================
@router.get("/events/{event_id}", summary="Get single event details")
def get_event_details(event_id: str):
    # Fetch event
    event_res = supabase.table("events").select("*").eq("id", event_id).execute()
    if not event_res.data:
        raise HTTPException(status_code=404, detail="Event not found")
    
    event = event_res.data[0]

    # Count how many seats are already booked
    reg_count_res = supabase.table("registrations").select("id", count="exact").eq("event_id", event_id).execute()
    booked_count = reg_count_res.count or 0
    seats_left = max(0, event["capacity"] - booked_count)

    return {
        **event,
        "booked_seats": booked_count,
        "seats_left": seats_left
    }


# ============================================================
# FR-04: Register for an Event (HERO FEATURE - Slides 47, 55, 57)
# POST /api/registrations
# ============================================================
@router.post("/registrations", status_code=status.HTTP_201_CREATED, summary="Register student for an event")
def register_for_event(
    payload: RegistrationRequest,
    x_user_id: Optional[str] = Header(default=DEFAULT_TEST_STUDENT_ID, description="Authenticated User ID")
):
    """
    Core Registration Logic with 5 Production Guards:
    1. Authenticate user context (User identity from header, not body!)
    2. Check Event exists and is 'open'
    3. Check Duplicate Registration
    4. Check Seat Capacity
    5. Save Registration Record
    """
    user_id = x_user_id
    event_id = payload.event_id

    # Guard 1: Verify authenticated user identity
    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")

    # Guard 2: Verify event exists and is open (Slide 24 & 55)
    event_res = supabase.table("events").select("*").eq("id", event_id).execute()
    if not event_res.data:
        raise HTTPException(status_code=404, detail="Event not found")
    
    event = event_res.data[0]
    if event["status"] != "open":
        raise HTTPException(status_code=400, detail="Event is closed for registration")

    # Guard 3: Duplicate Check (Slide 23 & 55)
    existing_reg = supabase.table("registrations") \
        .select("id") \
        .eq("user_id", user_id) \
        .eq("event_id", event_id) \
        .execute()
    
    if existing_reg.data:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="DUPLICATE_REGISTRATION"
        )

    # Guard 4: Capacity Check / Overbooking Protection (Slide 40 & 55)
    count_res = supabase.table("registrations") \
        .select("id", count="exact") \
        .eq("event_id", event_id) \
        .execute()
    
    current_count = count_res.count or 0
    if current_count >= event["capacity"]:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="EVENT_FULL"
        )

    # Guard 5: Save Registration (Slide 47 & 55)
    insert_res = supabase.table("registrations").insert({
        "user_id": user_id,
        "event_id": event_id
    }).execute()

    if not insert_res.data:
        raise HTTPException(status_code=500, detail="Failed to create registration")

    new_reg = insert_res.data[0]
    return {
        "id": new_reg["id"],
        "event_id": event_id,
        "status": "REGISTERED"
    }


# ============================================================
# FR-06: View My Registrations (Slide 46)
# GET /api/me/registrations
# ============================================================
@router.get("/me/registrations", summary="Get registered events for current student")
def get_my_registrations(
    x_user_id: Optional[str] = Header(default=DEFAULT_TEST_STUDENT_ID)
):
    # Fetch registrations with joined event details
    response = supabase.table("registrations") \
        .select("id, created_at, events(id, title, capacity, status)") \
        .eq("user_id", x_user_id) \
        .execute()
    
    return response.data


# ============================================================
# FR-07: Organizer Attendee View (Slide 22 & 46)
# GET /api/events/{event_id}/registrations
# ============================================================
@router.get("/events/{event_id}/registrations", summary="View attendees for owned event")
def get_event_attendees(
    event_id: str,
    x_user_id: Optional[str] = Header(default="11111111-1111-1111-1111-111111111111")
):
    # Verify the event exists and the requester is the owner organizer
    event_res = supabase.table("events").select("organizer_id").eq("id", event_id).execute()
    if not event_res.data:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if event_res.data[0]["organizer_id"] != x_user_id:
        raise HTTPException(status_code=403, detail="Forbidden: You can only view attendees for events you own")

    # Fetch attendees
    attendees_res = supabase.table("registrations") \
        .select("id, created_at, users(id, email, role)") \
        .eq("event_id", event_id) \
        .execute()
    
    return attendees_res.data

