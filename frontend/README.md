# CampusConnect Frontend Guide (React + Vite + Stitch UI)

This is the lightweight, modular React frontend for **CampusConnect**, built from the **Stitch UI designs** and matched to **Day 1 Workshop (Slides 75–84)**.

---

## 1. Minimal Folder Structure

```
frontend/
├── index.html              # HTML shell with Google Fonts & Stitch Tailwind Theme
├── package.json            # React + Vite
├── vite.config.js          # Port 5173 dev server
├── src/
│   ├── main.jsx            # React root mount
│   ├── App.jsx             # Main page state machine (Explore / Detail / My Registrations)
│   ├── api.js              # 4 clean fetch() calls to FastAPI backend
│   └── components/
│       ├── Navbar.jsx      # Top header with brand and student session badge
│       ├── EventCard.jsx   # Workshop card with seats remaining
│       ├── EventDetail.jsx # FR-04 Hero screen with Register Button State Machine
│       └── MyRegistrations.jsx # Live list of student registrations
└── README.md               # This guide
```

---

## 2. Quick Setup & Run (2 Minutes)

### Step 1: Ensure your Backend is Running
In one terminal, make sure your FastAPI backend is running on port 8000:
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```
*(Backend runs at: `http://127.0.0.1:8000`)*

### Step 2: Start the Frontend Server
In a **new terminal tab**, navigate to `frontend` and start the Vite dev server:
```bash
cd frontend
npm install
npm run dev
```

### Step 3: Open in Browser
Visit: 👉 **`http://localhost:5173`**

You will see the live CampusConnect app loaded with the 3 seeded events from PostgreSQL/Supabase!

---

## 3. How the Frontend Connects to the Backend (`src/api.js`)

All communication between React and FastAPI happens inside one simple file: [`src/api.js`](file:///Users/pranav/PRNV/IST-Yenp/frontend/src/api.js).

| Function | Method | Backend Route | What It Does |
| :--- | :--- | :--- | :--- |
| `getEvents(search)` | `GET` | `/api/events` | Fetches all campus events or searches by keyword. |
| `getEventDetails(id)` | `GET` | `/api/events/{id}` | Gets event facts + calculates remaining seats. |
| `registerForEvent(id)` | `POST` | `/api/registrations` | **Registers student** sending `x-user-id` in header. |
| `getMyRegistrations()` | `GET` | `/api/me/registrations` | Fetches registered events for the logged-in student. |

---

## 4. Teaching Guide: What to Show Students in Class

### Demonstration 1: Live Event Discovery (Slide 77 & 78)
1. Open the home page.
2. Type `"Robotics"` in the search bar.
3. Show how the input immediately triggers `GET /api/events?search=Robotics` and filters the cards in real time.

### Demonstration 2: The Register Button State Machine (Slide 71 & 79)
1. Click **"View Details"** on *AI Build Night*.
2. Point students to [`src/components/EventDetail.jsx`](file:///Users/pranav/PRNV/IST-Yenp/frontend/src/components/EventDetail.jsx).
3. Click the violet **"Register Now"** button:
   - Button enters `submitting` state (spinner appears, button disabled to prevent multi-click races).
   - Backend responds with `201 Created`.
   - Button instantly turns into a green **"✓ Registered"** state!
4. Click **"My Registrations"** in the top navbar:
   - Show how the newly booked event immediately appears with a green `Confirmed` badge.

### Demonstration 3: Testing the Duplicate Registration Guard (Slide 57 & 81)
1. Navigate back to *AI Build Night*.
2. Attempt to register again.
3. Show students how the backend returns `409 Conflict` (`DUPLICATE_REGISTRATION`).
4. The UI captures this error and displays a clear, human-readable alert without crashing.

---

## 5. Clean & Accessible Styling
- **Theme Tokens**: Matches Stitch design system tokens (`#6D5EF8` Electric Violet, `#0D1C2E` Deep Navy, `#10B981` Emerald Green, `#F97360` Coral).
- **Zero Complex CSS**: Uses Tailwind CDN inside `index.html`, eliminating version mismatch errors on student laptops.

