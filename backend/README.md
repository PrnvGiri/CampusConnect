# CampusConnect Backend Guide & Code Deep Dive

This guide provides a **complete, in-depth explanation** of every file and code chunk in the `backend/` directory. It is written in simple, clear language so you can confidently explain what every single line does to your students.

---

## 1. Quick Setup & Run

### Terminal Commands
```bash
cd backend
source venv/bin/activate

# Copy credentials template and set your SUPABASE_URL and SUPABASE_KEY
cp .env.example .env

# Run using the venv's python to avoid global PATH conflicts
python3 -m uvicorn app.main:app --reload
```
* **Swagger UI:** `http://127.0.0.1:8000/docs`
* **Health Check:** `http://127.0.0.1:8000/`

---

## 2. High-Level Backend Flow (Slide 51)

Every request that hits our backend travels through 6 clear stages:

$$\text{Client (React / Swagger)} \xrightarrow{\text{1. Route}} \text{2. Auth Check} \xrightarrow{\text{3. Validation}} \text{4. Business Guards} \xrightarrow{\text{5. Supabase Query}} \xrightarrow{\text{6. HTTP JSON Response}}$$

---

## 3. File 1: `app/main.py` (The Application Gateway)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router
```

### What Each Section Does:

1. **`app = FastAPI(...)`**:
   * Creates the FastAPI application instance.
   * FastAPI automatically reads all your routes and creates interactive documentation at `/docs` (Swagger UI).

2. **CORS Middleware (`CORSMiddleware`)**:
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["*"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```
   * **Why is this here?**  
     Our backend runs on port 8000 (`http://127.0.0.1:8000`), while the React frontend runs on port 5173 (`http://localhost:5173`).
   * Browsers by default block web pages on one port/domain from making requests to another port for security (**Same-Origin Policy**).
   * CORS (**Cross-Origin Resource Sharing**) is our backend telling the student's browser: *"It's safe! Allow the frontend on port 5173 to call my endpoints."*

3. **`app.include_router(router)`**:
   * Takes all endpoints declared in `routes.py` and mounts them under the FastAPI app.

4. **`@app.get("/")`**:
   * A lightweight health-check route so you can quickly visit `http://127.0.0.1:8000/` in a browser and verify the server is live.

---

## 4. File 2: `app/supabase_client.py` (The Database Bridge)

```python
import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL: str = os.getenv("SUPABASE_URL", "").strip()
SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "").strip()

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
```

### What Each Section Does:

1. **`load_dotenv()`**:
   * Reads the `.env` file and loads the variables into Python's `os.environ`.
   * **Security Rule (Slide 29 & 60)**: Database credentials must **never** be hardcoded directly into source files. Storing them in `.env` keeps them safe and out of git repositories.

2. **`create_client(SUPABASE_URL, SUPABASE_KEY)`**:
   * Initializes the official Supabase Python client.
   * Supabase wraps PostgreSQL in a high-performance REST engine (PostgREST), meaning we can query the database using intuitive Python methods like `.table("events").select("*")` without the overhead of heavy ORMs (like SQLAlchemy or raw SQL drivers).

---

## 5. File 3: `app/routes.py` (Endpoints & Business Logic)

This is the core of the backend where all workshop functional requirements (`FR-01` to `FR-07`) live.

### Part A: Pydantic Validation Schema (Slide 47 & 51)

```python
class RegistrationRequest(BaseModel):
    event_id: str
```
* **Why do we use Pydantic?**
  When a student sends a request to `POST /api/registrations`, Pydantic ensures the body contains an `event_id` and that it is a valid string. If the request body is missing or malformed, FastAPI automatically responds with `422 Unprocessable Entity` before running any database code.
* **Notice what is absent:** `user_id` is NOT in this schema! (See Guard 1 below for why).

---

### Part B: `GET /api/events` (FR-02: Browse Events)

```python
@router.get("/events")
def list_events(search: Optional[str] = None):
    query = supabase.table("events").select("id, title, capacity, status, organizer_id")
    if search:
        query = query.ilike("title", f"%{search}%")
    
    response = query.execute()
    return response.data
```

* **`supabase.table("events").select(...)`**: Translates directly to:
  ```sql
  SELECT id, title, capacity, status, organizer_id FROM events;
  ```
* **`.ilike("title", f"%{search}%")`**: 
  * "i" stands for **case-insensitive**.
  * Matches event titles regardless of uppercase/lowercase (e.g., searching "ai", "AI", or "Build" matches "AI Build Night").
* **`response.data`**: An array of Python dictionaries that FastAPI automatically serializes into JSON with HTTP `200 OK`.

---

### Part C: `GET /api/events/{event_id}` (FR-03: Event Details & Seats Left)

```python
@router.get("/events/{event_id}")
def get_event_details(event_id: str):
    # 1. Fetch the event
    event_res = supabase.table("events").select("*").eq("id", event_id).execute()
    if not event_res.data:
        raise HTTPException(status_code=404, detail="Event not found")
    
    event = event_res.data[0]

    # 2. Count current bookings
    reg_count_res = supabase.table("registrations") \
        .select("id", count="exact") \
        .eq("event_id", event_id) \
        .execute()
    
    booked_count = reg_count_res.count or 0
    seats_left = max(0, event["capacity"] - booked_count)

    return {
        **event,
        "booked_seats": booked_count,
        "seats_left": seats_left
    }
```

* **`.eq("id", event_id)`**: Translates to SQL `WHERE id = event_id`.
* **`count="exact"`**: Requests PostgreSQL's count aggregation directly, preventing the server from downloading all registration rows over the network just to count them.
* **`seats_left = max(0, capacity - booked_count)`**: Calculates remaining seats dynamically and prevents displaying negative numbers.

---

### Part D: `POST /api/registrations` (FR-04: The Hero Feature)

This endpoint is the centerpiece of the entire workshop (Slides 23, 24, 40, and 55). It demonstrates how professional backend engineers protect data integrity through **5 sequential guards**:

```python
@router.post("/registrations", status_code=status.HTTP_201_CREATED)
def register_for_event(
    payload: RegistrationRequest,
    x_user_id: Optional[str] = Header(default=DEFAULT_TEST_STUDENT_ID)
):
```

#### Guard 1: Authenticated User Identity (Slide 47)
```python
user_id = x_user_id
if not user_id:
    raise HTTPException(status_code=401, detail="Not authenticated")
```
* **Key Concept for Students:**  
  The user identity is extracted from the **Header context (`x-user-id`)**, NOT from the request body!
  * *Why?* If `user_id` was accepted in the request body, any student could submit registrations under someone else's identity. In production systems, identity always originates from the verified session/token.

#### Guard 2: Event Existence & "Open" Status (Slide 24 & 55)
```python
event_res = supabase.table("events").select("*").eq("id", event_id).execute()
if not event_res.data:
    raise HTTPException(status_code=404, detail="Event not found")

event = event_res.data[0]
if event["status"] != "open":
    raise HTTPException(status_code=400, detail="Event is closed for registration")
```
* Verifies the event actually exists.
* Verifies the event status is `'open'`. If the organizer marked it `'closed'`, registrations are rejected immediately with HTTP `400 Bad Request`.

#### Guard 3: Duplicate Registration Guard (Slide 23 & 55)
```python
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
```
* Checks if a registration already exists pairing this student (`user_id`) with this event (`event_id`).
* If found, rejects with HTTP `409 Conflict` and code `"DUPLICATE_REGISTRATION"`.

#### Guard 4: Capacity Guard / The Last-Seat Incident (Slide 40 & 55)
```python
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
```
* Counts existing committed registrations for the event.
* If `current_count >= event["capacity"]`, halts execution and returns HTTP `409 Conflict` with `"EVENT_FULL"`.
* Guarantees an event with 50 seats never accidentally registers 51 students.

#### Guard 5: Safe Insert (Slide 47 & 55)
```python
insert_res = supabase.table("registrations").insert({
    "user_id": user_id,
    "event_id": event_id
}).execute()

new_reg = insert_res.data[0]
return {
    "id": new_reg["id"],
    "event_id": event_id,
    "status": "REGISTERED"
}
```
* When all previous guards pass, the new row is safely written to PostgreSQL.
* Returns HTTP `201 Created` with the new registration ID and confirmed status.

---

### Part E: `GET /api/me/registrations` (FR-06: Student History)

```python
@router.get("/me/registrations")
def get_my_registrations(x_user_id: Optional[str] = Header(default=DEFAULT_TEST_STUDENT_ID)):
    response = supabase.table("registrations") \
        .select("id, created_at, events(id, title, capacity, status)") \
        .eq("user_id", x_user_id) \
        .execute()
    return response.data
```

* **Relational Foreign Key Join (`events(...)`)**:
  * Because `registrations.event_id` references `events.id`, Supabase allows nested selection: `events(id, title, capacity, status)`.
  * In a single query, PostgreSQL joins the registration with its corresponding event title and details without needing separate manual queries.

---

### Part F: `GET /api/events/{event_id}/registrations` (FR-07: Organizer Attendee List)

```python
@router.get("/events/{event_id}/registrations")
def get_event_attendees(
    event_id: str,
    x_user_id: Optional[str] = Header(default="11111111-1111-1111-1111-111111111111")
):
    # 1. Verify event exists
    event_res = supabase.table("events").select("organizer_id").eq("id", event_id).execute()
    if not event_res.data:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # 2. Check Ownership (Slide 22 & 46)
    if event_res.data[0]["organizer_id"] != x_user_id:
        raise HTTPException(status_code=403, detail="Forbidden: You can only view attendees for events you own")

    # 3. Fetch attendees with student emails
    attendees_res = supabase.table("registrations") \
        .select("id, created_at, users(id, email, role)") \
        .eq("event_id", event_id) \
        .execute()
    
    return attendees_res.data
```

* **Ownership Security Check**:
  * Compares `event.organizer_id` against the requester's `x_user_id`.
  * If they don't match, returns HTTP `403 Forbidden`. Organizer A is blocked from viewing Organizer B's private attendee list.
* **Join with Users Table (`users(...)`)**:
  * Joins each registration record with the student's email and role so the organizer sees the actual attendee list.

---

## 6. HTTP Status Codes Cheat Sheet

| Status Code | Meaning | When It Occurs in Our App |
| :--- | :--- | :--- |
| **`200 OK`** | Success | Fetching events or registrations (`GET`). |
| **`201 Created`** | Resource Created | Successfully reserving a seat (`POST /api/registrations`). |
| **`400 Bad Request`** | Invalid Action | Trying to register for an event whose status is `'closed'`. |
| **`401 Unauthorized`** | Missing Identity | Request made without user authentication context. |
| **`403 Forbidden`** | Permission Denied | An organizer trying to view attendees of an event they don't own. |
| **`404 Not Found`** | Missing Resource | Looking up an `event_id` that doesn't exist in the database. |
| **`409 Conflict`** | Business Rule Violation | Duplicate registration or Event is full. |
| **`422 Unprocessable`** | Schema Error | Client sent malformed JSON body. |
