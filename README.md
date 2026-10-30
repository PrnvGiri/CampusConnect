# CampusConnect — Day 1 Workshop

A modular, end-to-end college event discovery and registration platform built across 5 software roles: **Product Manager**, **System Architect**, **Backend Engineer**, **UI/UX Designer**, and **Frontend Engineer**.

---

## 📁 Repository Structure

```
CampusConnect/
├── database/          # PostgreSQL / Supabase schema & seed data
│   ├── schema.sql     # Complete DDL with UUID PKs, constraints & seed events
│   └── README.md      # Supabase setup guide & live SQL demo queries
├── backend/           # FastAPI REST API
│   ├── app/           # Routes, Supabase client, and main app entrypoint
│   ├── requirements.txt # Dependencies (fastapi, uvicorn, supabase)
│   └── README.md      # Code deep dive & 5 production guards walkthrough
├── design/            # UI/UX wireframes & design tokens
│   ├── figma_prompt.txt # ChatGPT + Figma prompt for generating screens
│   ├── stitch_campusconnect_event_platform_ui/ # Generated Stitch design files & tokens
│   └── README.md      # UI design system & state machine guide
└── frontend/          # React + Vite application
    ├── src/           # Components (Navbar, EventCard, EventDetail, MyRegistrations)
    ├── package.json   # React + Vite setup
    └── README.md      # Frontend setup and API integration guide
```

---

## 🚀 Quick Start Guide

### 1. Database (Supabase)
1. Open your Supabase project's **SQL Editor**.
2. Run [`database/schema.sql`](database/schema.sql).
3. The `users`, `events`, and `registrations` tables are now created and pre-seeded.

### 2. Backend (FastAPI)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env    # Fill in your SUPABASE_URL and SUPABASE_KEY
python3 -m uvicorn app.main:app --reload
```
* Interactive API docs: `http://127.0.0.1:8000/docs`

### 3. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
* Live web app: `http://localhost:5173`

