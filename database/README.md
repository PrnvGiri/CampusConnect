# CampusConnect Database Setup Guide (Supabase + PostgreSQL)

This guide walks you through setting up the database for **CampusConnect** on Supabase in under 5 minutes. 

It matches the exact architecture and entities taught in **Day 1 Workshop (Slides 34–39 & 53–54)**.

---

## 1. Core Database Design (What We Are Building)

Our application has 3 simple, relational tables:

```
+------------------+          +--------------------+
|      users       | 1      * |       events       |
|------------------|----------|--------------------|
| id (UUID, PK)    |          | id (UUID, PK)      |
| email (TEXT)     |          | organizer_id (FK)  |
| role (TEXT)      |          | title (TEXT)       |
+------------------+          | capacity (INT > 0) |
        | 1                   | status (TEXT)      |
        |                     +--------------------+
        |                               | 1
        | *                             | *
+--------------------------------------------------+
|                  registrations                   |
|--------------------------------------------------|
| id (UUID, PK)                                    |
| user_id (UUID, FK -> users.id)                   |
| event_id (UUID, FK -> events.id)                 |
| created_at (TIMESTAMPTZ)                         |
| CONSTRAINT: UNIQUE (user_id, event_id)           |
+--------------------------------------------------+
```

### Why these constraints exist:
1. **`UUID PRIMARY KEY DEFAULT gen_random_uuid()`**: Ensures every record has a unique, non-guessable ID.
2. **`CHECK (capacity > 0)`**: Prevents events from being created with 0 or negative seats.
3. **`UNIQUE (user_id, event_id)`**: Solves **FR-04 rule** directly in the database: a student can never register for the same event twice.

---

## 2. Step-by-Step Setup in Supabase (Takes ~2 Minutes)

### Step 1: Open Supabase
1. Go to [https://supabase.com](https://supabase.com) and log in (or create a free account).
2. Click **"New Project"**.
3. Enter:
   - **Name:** `CampusConnect`
   - **Database Password:** *(Choose a strong password and save it)*
   - **Region:** Choose the region nearest to you (e.g. `ap-south-1` for Mumbai / India).
4. Click **Create new project** and wait ~1 minute for Supabase to provision your database.

---

### Step 2: Open SQL Editor
1. In the left navigation bar of your Supabase project dashboard, click on the **SQL Editor** icon (`>_`).
2. Click **"New query"** (or the green `+` button).

---

### Step 3: Run the Schema Script
1. Open the file [`database/schema.sql`](file:///Users/pranav/PRNV/IST-Yenp/database/schema.sql) in this folder.
2. Copy the entire SQL content and paste it into the Supabase SQL Editor.
3. Click the green **"Run"** button (or press `Ctrl+Enter` / `Cmd+Enter`).
4. You will see:
   ```text
   Success. No rows returned
   ```

---

### Step 4: Verify Your Tables
1. In the left navigation bar, click on **Table Editor** (the spreadsheet icon).
2. You will see three tables created and pre-populated:
   - **`users`**: Contains 3 test accounts (1 organizer, 2 students).
   - **`events`**: Contains 3 seeded events (`AI Build Night`, `Robotics Sprint`, `Open Source Jam`).
   - **`registrations`**: Ready and empty for incoming registrations.

---

## 3. Teaching Demonstration (Slide 54 Demo)

You can run these simple SQL queries in the Supabase SQL Editor to show students how the database behaves in real time:

### Test 1: View all seeded events
```sql
SELECT title, capacity, status FROM events;
```

### Test 2: Simulate a successful registration (Student 1 registers for AI Build Night)
```sql
INSERT INTO registrations (user_id, event_id)
VALUES (
    '22222222-2222-2222-2222-222222222222', 
    '550e8400-e29b-41d4-a716-446655440000'
);
```
*(Result: 1 row inserted successfully)*

### Test 3: Demonstrate the Duplicate Guard (Slide 23 & 39)
Run the exact same insert statement again:
```sql
INSERT INTO registrations (user_id, event_id)
VALUES (
    '22222222-2222-2222-2222-222222222222', 
    '550e8400-e29b-41d4-a716-446655440000'
);
```
*(Result: **ERROR: duplicate key value violates unique constraint "registrations_user_id_event_id_key"**)*

Explain to students:
> *"The database itself protects data integrity. Even if the application code had a bug, the database constraint makes duplicate booking impossible."*

---

## 4. Key IDs Reference for Quick Copy-Pasting

These IDs are pre-seeded in [`schema.sql`](file:///Users/pranav/PRNV/IST-Yenp/database/schema.sql):

| Entity | Name / Email | UUID |
| :--- | :--- | :--- |
| **Organizer** | `organizer@campus.edu` | `11111111-1111-1111-1111-111111111111` |
| **Student 1** | `student1@campus.edu` | `22222222-2222-2222-2222-222222222222` |
| **Student 2** | `student2@campus.edu` | `33333333-3333-3333-3333-333333333333` |
| **Event 1** | AI Build Night (50 seats) | `550e8400-e29b-41d4-a716-446655440000` |
| **Event 2** | Robotics Sprint (30 seats) | `550e8400-e29b-41d4-a716-446655440001` |
| **Event 3** | Open Source Jam (100 seats) | `550e8400-e29b-41d4-a716-446655440002` |

