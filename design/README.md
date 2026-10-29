# CampusConnect UI/UX Design Guide (Figma + ChatGPT)

This guide walks you through using ChatGPT and Figma to generate the UI designs for **CampusConnect**, matching **Day 1 Workshop (Slides 61–74)**.

---

## 1. Why We Do This Before Frontend Code

In software development, frontend engineers don't guess what the UI should look like. They follow designs built by UI/UX designers based on:
1. **User friction points** (Slide 62: scattered info -> clean catalog; uncertain status -> clear confirmation).
2. **Design tokens** (Slide 67: Violet `#6D5EF8`, Navy `#111827`, 8px spacing grid).
3. **API states** (Slide 79: Idle, Registering, Registered, Event Full).

By generating the Figma wireframes first, students can visually see how the backend API contracts (`GET /api/events`, `POST /api/registrations`) drive each screen.

---

## 2. How to Use ChatGPT with Figma (Step-by-Step)

### Step 1: Open ChatGPT with Figma Connector
1. Open ChatGPT (GPT-4 / GPT-4o).
2. Select or enable your **Figma GPT / Plugin** (or ChatGPT Figma connector).
3. If using standard ChatGPT without a direct Figma write-plugin, you can also paste the prompt to generate **Figma FigJam / Auto-layout structure**, or paste into tools like **v0.dev** or **Figma AI**.

### Step 2: Paste the Prompt
Open [`design/figma_prompt.txt`](file:///Users/pranav/PRNV/IST-Yenp/design/figma_prompt.txt) in this folder.
Copy the entire text and paste it into ChatGPT.

### Step 3: Inspect the Generated Design
The prompt instructs Figma to generate 4 essential frames:
1. **Top Navbar**: Logo + navigation links + student avatar.
2. **Explore Events**: Search bar, category chips, 3-column event grid.
3. **Event Details**: Facts row (date, time, venue, seats left) + description + Register CTA with multiple states.
4. **Confirmation & My Registrations**: Success card with confirmation reference + list of booked events.

---

## 3. How the UI Directly Connects to our Backend

Show students how every element on the screen maps to a specific backend API route:

| UI Screen Element | Action / Trigger | Backend API Route | Slide Reference |
| :--- | :--- | :--- | :--- |
| **Event Cards Grid** | On page load | `GET /api/events` | Slide 70 & 77 |
| **Search Bar / Chips** | Filter text changed | `GET /api/events?search=...` | Slide 70 |
| **Seats Left Badge** | Open detail page | `GET /api/events/{id}` | Slide 71 |
| **"Register Now" Button** | Click event | `POST /api/registrations` | Slide 71, 79, 80 |
| **"✓ Registered" Badge** | Result of 201 Created | Stored in local state / DB | Slide 72 |
| **"Event Full" Alert** | Result of 409 Conflict | Triggered by backend capacity guard | Slide 72 |
| **My Registrations Page** | Open tab | `GET /api/me/registrations` | Slide 72 |

---

## 4. The 3 Button States to Teach (Slide 71 & 79)

Explain to students why the "Register" button is a **state machine**:

1. **Default State**:
   - Button is Violet `#6D5EF8`
   - Text: `"Register Now"`
   - Click triggers `POST /api/registrations`.

2. **Event Full State**:
   - When remaining seats = 0 (or API returns `409 EVENT_FULL`).
   - Button is disabled (Gray).
   - Coral badge shows: `"Event Full"`.

3. **Already Registered State**:
   - When student already booked (or API returns `409 DUPLICATE_REGISTRATION`).
   - Button changes to Green: `"✓ Registered"`.

---

## 5. Handoff to Coding Agent (Next Step)

Once the Figma design is ready:
1. Copy the Figma frame link (or take a screenshot of the frame).
2. Feed it into your coding agent (e.g. Antigravity / Cursor / v0) with the prompt:
   > *"Build these React components based on this design and connect them to the FastAPI backend at `http://127.0.0.1:8000/api`."*

