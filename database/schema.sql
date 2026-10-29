-- ============================================================
-- CampusConnect - Day 1 Workshop Database Schema (Supabase / PostgreSQL)
-- Matches Slides 35-39 & 53 of the CampusConnect Workshop
-- ============================================================

-- 1. Reset tables if they already exist (safe for re-running)
DROP TABLE IF EXISTS registrations CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2. USERS TABLE (Slide 35, 36, 38)
-- Stores students and organizers
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('student', 'organizer', 'admin')) DEFAULT 'student'
);

-- 3. EVENTS TABLE (Slide 35, 36, 38, 39)
-- Stores campus events created by organizers
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organizer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    status TEXT NOT NULL CHECK (status IN ('open', 'closed')) DEFAULT 'open'
);

-- 4. REGISTRATIONS TABLE (Slide 35, 36, 38, 39)
-- Junction table linking students to events
-- UNIQUE(user_id, event_id) ensures a student cannot register twice!
CREATE TABLE registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, event_id)
);

-- 5. DISABLE RLS FOR DAY 1 WORKSHOP SIMPLICITY
-- (Allows students to test without getting blocked by authentication policies)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- SEED DATA (Slide 47 & 53)
-- Uses fixed UUIDs so API testing with curl/Swagger/Postman is easy!
-- ============================================================

-- Seed 1 Organizer and 2 Students
INSERT INTO users (id, email, role) VALUES
    ('11111111-1111-1111-1111-111111111111', 'organizer@campus.edu', 'organizer'),
    ('22222222-2222-2222-2222-222222222222', 'student1@campus.edu', 'student'),
    ('33333333-3333-3333-3333-333333333333', 'student2@campus.edu', 'student');

-- Seed 3 Campus Events (using exact UUID from Slide 47 for event 1)
INSERT INTO events (id, organizer_id, title, capacity, status) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', '11111111-1111-1111-1111-111111111111', 'AI Build Night', 50, 'open'),
    ('550e8400-e29b-41d4-a716-446655440001', '11111111-1111-1111-1111-111111111111', 'Robotics Sprint', 30, 'open'),
    ('550e8400-e29b-41d4-a716-446655440002', '11111111-1111-1111-1111-111111111111', 'Open Source Jam', 100, 'open');

