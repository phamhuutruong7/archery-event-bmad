# Archery Event Scoring System - Implementation Guide

**Version:** 1.0  
**Date:** November 16, 2025  
**Status:** Prototype Implementation Complete

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [User Roles & Permissions](#user-roles--permissions)
3. [System Architecture](#system-architecture)
4. [Key Features](#key-features)
5. [User Workflows](#user-workflows)
6. [Technical Implementation](#technical-implementation)
7. [Data Models](#data-models)
8. [Next Steps](#next-steps)

---

## 🎯 Overview

This document describes the complete implementation of the **Archery Event Scoring System**, which allows users to manage events, register for competitions, enter scores in real-time, and view live leaderboards.

### What's Been Implemented

- ✅ **Competition Scoring View** with 2 tabs (Scorer & Spectator)
- ✅ **Target-based Athlete Organization** (4 positions per target: A, B, C, D)
- ✅ **Peer Scoring System** (athletes score each other)
- ✅ **Role-based Permissions** (Host, Athlete, Referee, Admin, Spectator)
- ✅ **Competition Status Management** (In Progress / Closed)
- ✅ **Team Registration** with team name field
- ✅ **Real-time Leaderboard** for spectators
- ✅ **Scoresheet Integration** for arrow-by-arrow scoring

---

## 👥 User Roles & Permissions

### 1. **Host**
- **Description:** Event organizer/creator
- **Permissions:**
  - ✅ Edit event details
  - ✅ Toggle competition status (In Progress ↔ Closed)
  - ✅ View all scoresheets
  - ✅ Edit ANY athlete's scoresheet
  - ✅ Manually select athletes for elimination rounds
  - ✅ Access all features

### 2. **Athlete**
- **Description:** Participant competing in the event
- **Permissions:**
  - ✅ Register for competitions with team name
  - ✅ Score for OTHER athletes on the SAME target (peer scoring)
  - ❌ Cannot score for themselves initially
  - ✅ View their own scoresheet
  - ✅ View leaderboard
  - ⚠️ Cannot edit after submission (only Host/Referee/Admin can)

### 3. **Referee**
- **Description:** Official judge supervising competitions
- **Permissions:**
  - ✅ View all scoresheets
  - ✅ Edit ANY athlete's scoresheet (even after submission)
  - ✅ Enter scores for any athlete
  - ✅ Access all In Progress competitions

### 4. **Admin**
- **Description:** System administrator
- **Permissions:**
  - ✅ Same as Referee + Host combined
  - ✅ Full system access
  - ✅ Can override any restrictions

### 5. **Spectator**
- **Description:** Public viewer (no registration)
- **Permissions:**
  - ✅ View live leaderboard
  - ✅ See overall competition scores
  - ❌ Cannot enter scores
  - ❌ Cannot view detailed scoresheets
  - ✅ See real-time updates

---

## 🏗️ System Architecture

### Page Structure

```
docs/prototypes/
├── events/
│   ├── event-detail.html          [✅ Updated: Clickable competitions]
│   ├── competition-selection.html [✅ Updated: Team name field added]
│   ├── event-edit.html            [Existing]
│   └── athlete-participation.html [Existing]
├── scoring/
│   ├── competition-scoring.html   [✅ NEW: Main scoring interface]
│   └── scoresheet.html            [✅ Existing: Arrow-by-arrow entry]
└── dashboard/
    └── dashboard.html             [Existing: Event listing]
```

### Data Flow

```
1. User Registration
   └─> Event Detail Page
       └─> Competition Selection (with Team Name)
           └─> Save to localStorage: 
               - event_{eventId}_athlete_competitions
               - event_{eventId}_athlete_team
               - event_{eventId}_registration

2. Competition Scoring
   └─> Event Detail Page (click competition row)
       └─> Competition Scoring Page
           ├─> Scorer Tab: View targets & athletes
           │   └─> Click athlete → Scoresheet Page
           │       └─> Enter scores → Save to localStorage
           └─> Spectator Tab: Live Leaderboard

3. Competition Status
   └─> Event Detail Page
       └─> Toggle: In Progress ↔ Closed
           └─> Only "In Progress" allows scoring
```

---

## ⚡ Key Features

### 1. Competition Status Management

**Previous:** "Open" / "Closed"  
**Updated:** "In Progress" / "Closed"

- **In Progress (Green):**
  - Athletes, Referees, Admins, Hosts can enter scores
  - Icon: `mdi-play-circle`
  - Color: Green (#2e7d32)
  - Clicking competition row opens scoring view

- **Closed (Red):**
  - No scoring allowed
  - Icon: `mdi-close-circle`
  - Color: Red (#c62828)
  - Clicking shows error snackbar

### 2. Target-Based Scoring

Each target has **4 positions** (A, B, C, D):

```
Target 1
  ├─ Position A: Alex Wong
  ├─ Position B: Brian Song
  ├─ Position C: Charlie Mungo
  └─ Position D: Daniel Crap
```

**Visual Indicators:**
- ✅ Green checkmark: Scoresheet completed
- 🟡 Yellow: Partial scores entered
- ⚪ Gray: No scores yet

### 3. Peer Scoring System

**How it works:**

1. **Initial Scoring (Athletes):**
   - Athlete A can score for Athletes B, C, D on the same target
   - Athlete A CANNOT score for themselves
   - This prevents self-scoring bias

2. **After Submission:**
   - Only **Host**, **Referee**, or **Admin** can edit
   - Ensures score integrity
   - Prevents accidental changes

3. **Special Cases:**
   - Host/Referee/Admin can score for ANYONE at ANY time
   - Useful for corrections or disputes

### 4. Team Registration

**Implementation:**
- Team name field added to `competition-selection.html`
- Required field (cannot submit without team name)
- Auto-creates team if name doesn't exist
- Stored in localStorage: `event_{eventId}_athlete_team`

**User Flow:**
```
1. User enters team name (e.g., "Golden Arrows")
2. Selects competitions to participate in
3. Submits registration
4. If team "Golden Arrows" doesn't exist → Creates automatically
5. If team exists → Joins existing team
```

### 5. Live Leaderboard (Spectator View)

**Features:**
- Real-time score updates
- Ranked by total score (descending)
- Shows:
  - Athlete name
  - Target & position
  - Current score / max score
  - Average per arrow
  - Gold count
  - Completion status (In Progress / Complete)

**Visual Hierarchy:**
- 🥇 1st place: Gold color
- 🥈 2nd place: Silver color
- 🥉 3rd place: Bronze color

### 6. Scoresheet Integration

**Features (from existing `scoresheet.html`):**
- Arrow-by-arrow score entry
- Color-coded ring values:
  - 🟡 Yellow: X, 10, 9
  - 🔴 Red: 8, 7
  - 🔵 Blue: 6, 5
  - ⚫ Black: 4, 3
  - ⚪ White: 2, 1
  - 🟢 Green: M (Miss)
- Live statistics:
  - Total score
  - Golds count
  - Average per arrow
- End-by-end confirmation
- Locked ends (cannot edit after confirmation)

---

## 🔄 User Workflows

### Workflow 1: Athlete Registration

```
1. Browse events on dashboard
2. Click event → Event Detail Page
3. Click "Register as Athlete"
4. Redirected to Competition Selection
5. Enter team name (e.g., "Team Phoenix")
6. Select competitions (checkboxes)
7. Click "Submit Registration"
8. Confirmation: "Successfully registered as athlete for team 'Team Phoenix' in 3 competition(s)!"
9. Redirected back to Event Detail Page
```

### Workflow 2: Entering Scores (Athlete)

```
1. Navigate to Event Detail Page
2. Find "In Progress" competition
3. Click competition row → Competition Scoring Page
4. See "Scorer" tab (default view)
5. Find your target (e.g., Target 3)
6. Click another athlete's cell (e.g., Position D: Leo Martinez)
7. Redirected to Scoresheet Page
8. Enter scores arrow-by-arrow for Leo
9. Confirm each end (✓ button)
10. Complete all ends → Scoresheet locked
11. Navigate back → See green checkmark on Leo's cell
```

### Workflow 3: Editing Scores (Referee)

```
1. Navigate to Event Detail Page
2. Click "In Progress" competition → Competition Scoring Page
3. See all targets with athletes
4. Click ANY athlete's cell (no restrictions)
5. Redirected to Scoresheet Page
6. See existing scores (even if locked)
7. Edit/update scores as needed
8. Confirm changes
9. Navigate back → Updated scores reflected
```

### Workflow 4: Viewing Leaderboard (Spectator)

```
1. Navigate to Event Detail Page
2. Click "In Progress" competition → Competition Scoring Page
3. Click "Spectator" tab
4. View live leaderboard:
   - Ranked athletes
   - Real-time scores
   - Progress indicators
5. Filter options:
   - All athletes
   - Completed only
   - In Progress only
6. Refresh to see latest updates
```

### Workflow 5: Host Manual Elimination Selection

> **Note:** UI for this is not yet implemented. Here's the planned workflow:

```
1. Navigate to Event Detail Page
2. Click "Manage Eliminations" button (to be added)
3. View qualification results
4. See default qualified athletes (Top 8, 16, 32, etc.)
5. Manually override selections:
   - Remove qualified athlete (e.g., Top 1 declined)
   - Add non-qualified athlete (e.g., 9th place)
6. Confirm selections
7. Generate elimination bracket
8. Athletes receive notification
```

---

## 💻 Technical Implementation

### 1. Competition Scoring Page

**File:** `docs/prototypes/scoring/competition-scoring.html`

**Key Components:**

- **Header:**
  - Back button
  - Competition title
  - Event subtitle
  - Language selector
  - Profile icon

- **Tab Navigation:**
  - Scorer Tab (for Host, Athlete, Referee, Admin)
  - Spectator Tab (for public view)

- **Scorer Tab:**
  - Competition info card (status, user role, user target)
  - Targets list with 4 athletes per target
  - Click athlete → Navigate to scoresheet

- **Spectator Tab:**
  - Competition info card
  - Filter buttons (All, Completed, In Progress)
  - Live leaderboard with rankings

**JavaScript Functions:**

```javascript
// Load targets and athletes
loadTargets()

// Check if user can score for athlete
canScoreForAthlete(targetId, athleteId)

// Open scoresheet for athlete
openScoresheet(targetId, athleteId, position, athleteName)

// Load and render leaderboard
loadLeaderboard()

// Filter leaderboard
filterLeaderboard(filter)
```

### 2. Event Detail Page Updates

**File:** `docs/prototypes/events/event-detail.html`

**Changes Made:**

1. **Competition Rows → Clickable:**
   ```javascript
   <tr onclick="openCompetitionScoring(eventId, competitionId, category, bowType)">
   ```

2. **Status Update: "Open" → "In Progress":**
   ```javascript
   const statusText = status === 'open' ? 'In Progress' : 'Closed';
   const statusIcon = status === 'open' ? 'mdi-play-circle' : 'mdi-close-circle';
   ```

3. **New Function:**
   ```javascript
   function openCompetitionScoring(eventId, competitionId, category, bowType) {
       const status = getCompetitionStatus(eventId, competitionId);
       
       if (status !== 'open') {
           showSnackbar('This competition is closed. Only In Progress competitions can be scored.', 'mdi-alert-circle', 'error');
           return;
       }
       
       window.location.href = `../scoring/competition-scoring.html?eventId=${eventId}&competitionId=${competitionId}...`;
   }
   ```

4. **CSS Updates:**
   ```css
   .status-switch-cell { min-width: 170px; }
   .status-switch { min-width: 140px; }
   .competitions-table tbody tr { cursor: pointer; }
   .competitions-table tbody tr:hover { background: #e3f2fd !important; }
   ```

5. **Prevent Event Propagation on Sub-elements:**
   ```javascript
   // Subround details link
   onclick="event.stopPropagation(); showSubroundDetails(...)"
   
   // Status toggle button
   onclick="event.stopPropagation(); toggleCompetitionStatus(...)"
   ```

### 3. Competition Selection Updates

**File:** `docs/prototypes/events/competition-selection.html`

**Changes Made:**

1. **Team Name Input Field:**
   ```html
   <div class="event-info">
       <div class="event-info-title">
           <i class="mdi mdi-account-group"></i>
           Team Information
       </div>
       <input 
           type="text" 
           id="teamNameInput" 
           placeholder="Enter your team name (or create new)" 
           oninput="validateTeamName()"
       />
       <div id="teamNameHelp">
           If your team doesn't exist, it will be created automatically
       </div>
   </div>
   ```

2. **Validation Function:**
   ```javascript
   function validateTeamName() {
       const teamName = document.getElementById('teamNameInput').value.trim();
       const confirmBtn = document.getElementById('confirmBtn');
       
       // Enable button only if team name AND competitions selected
       confirmBtn.disabled = !teamName || selectedCompetitions.length === 0;
   }
   ```

3. **Save Team Name:**
   ```javascript
   localStorage.setItem(`event_${eventId}_athlete_team`, teamName);
   ```

4. **Updated Confirmation:**
   ```javascript
   alert(`Successfully registered as athlete for team "${teamName}" in ${selectedCompetitions.length} competition(s)!`);
   ```

---

## 📊 Data Models

### LocalStorage Schema

#### 1. Competition Status
```javascript
Key: `event_{eventId}_comp_{competitionId}_status`
Value: "open" | "closed"

Example:
event_1_comp_0_status = "open"  // In Progress
event_1_comp_1_status = "closed"
```

#### 2. User Registration
```javascript
Key: `event_{eventId}_registration`
Value: "athlete" | "referee" | null

Example:
event_1_registration = "athlete"
```

#### 3. Athlete Competitions
```javascript
Key: `event_{eventId}_athlete_competitions`
Value: JSON array of competition IDs

Example:
event_1_athlete_competitions = "[0, 2, 4]"
```

#### 4. Athlete Team
```javascript
Key: `event_{eventId}_athlete_team`
Value: String (team name)

Example:
event_1_athlete_team = "Golden Arrows"
```

#### 5. Scoresheet Data (To be implemented)
```javascript
Key: `event_{eventId}_comp_{competitionId}_athlete_{athleteId}_scores`
Value: JSON object with end-by-end scores

Example:
event_1_comp_0_athlete_10_scores = {
  "ends": [
    { "endNumber": 1, "arrows": ["X", "10", "9", "9", "8", "7"], "confirmed": true },
    { "endNumber": 2, "arrows": ["10", "10", "9", "8", "8", "7"], "confirmed": true },
    ...
  ],
  "totalScore": 680,
  "golds": 42,
  "submittedBy": "user_5",  // User ID who entered the score
  "submittedAt": "2025-11-16T10:30:00Z",
  "lastEditedBy": "referee_2",
  "lastEditedAt": "2025-11-16T11:45:00Z"
}
```

### Mock Data Structure

#### Targets Data
```javascript
const targetsData = [
    {
        id: 1,
        number: 'Target 1',
        athletes: [
            {
                id: 1,
                position: 'A',
                name: 'Alex Wong',
                score: 680,
                totalArrows: 72,
                completed: true
            },
            {
                id: 2,
                position: 'B',
                name: 'Brian Song',
                score: 650,
                totalArrows: 72,
                completed: true
            },
            {
                id: 3,
                position: 'C',
                name: 'Charlie Mungo',
                score: 0,
                totalArrows: 0,
                completed: false
            },
            {
                id: 4,
                position: 'D',
                name: 'Daniel Crap',
                score: 245,
                totalArrows: 24,
                completed: false
            }
        ]
    },
    // ... more targets
];
```

### Backend Database Schema (For Production)

#### Users Table
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('host', 'athlete', 'referee', 'admin', 'spectator') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Teams Table
```sql
CREATE TABLE teams (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_team_name (name)
);
```

#### Events Table
```sql
CREATE TABLE events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    location VARCHAR(200),
    start_date DATE,
    end_date DATE,
    registration_deadline DATE,
    max_participants INT,
    host_id INT,
    status ENUM('upcoming', 'live', 'completed', 'cancelled'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (host_id) REFERENCES users(id)
);
```

#### Competitions Table
```sql
CREATE TABLE competitions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    bow_type ENUM('Recurve', 'Compound', 'Barebow'),
    category VARCHAR(50),
    round VARCHAR(100),
    subround VARCHAR(100),
    status ENUM('open', 'closed') DEFAULT 'closed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);
```

#### Registrations Table
```sql
CREATE TABLE registrations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    team_id INT,
    role ENUM('athlete', 'referee') NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL,
    UNIQUE KEY unique_event_user (event_id, user_id)
);
```

#### Competition Registrations Table
```sql
CREATE TABLE competition_registrations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    competition_id INT NOT NULL,
    user_id INT NOT NULL,
    team_id INT,
    target_number INT,
    target_position ENUM('A', 'B', 'C', 'D'),
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (competition_id) REFERENCES competitions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL,
    UNIQUE KEY unique_comp_user (competition_id, user_id)
);
```

#### Scoresheets Table
```sql
CREATE TABLE scoresheets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    competition_id INT NOT NULL,
    athlete_id INT NOT NULL,
    target_number INT NOT NULL,
    target_position ENUM('A', 'B', 'C', 'D'),
    scores JSON,  -- Stores end-by-end arrow scores
    total_score INT DEFAULT 0,
    total_golds INT DEFAULT 0,
    total_arrows INT DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    submitted_by INT,  -- User who entered the score
    submitted_at TIMESTAMP,
    last_edited_by INT,
    last_edited_at TIMESTAMP,
    FOREIGN KEY (competition_id) REFERENCES competitions(id) ON DELETE CASCADE,
    FOREIGN KEY (athlete_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (submitted_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (last_edited_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_comp_athlete (competition_id, athlete_id)
);
```

#### Elimination Selections Table
```sql
CREATE TABLE elimination_selections (
    id INT PRIMARY KEY AUTO_INCREMENT,
    competition_id INT NOT NULL,
    athlete_id INT NOT NULL,
    qualification_rank INT,
    selected_by INT NOT NULL,  -- Host who selected
    selected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (competition_id) REFERENCES competitions(id) ON DELETE CASCADE,
    FOREIGN KEY (athlete_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (selected_by) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_comp_athlete_elim (competition_id, athlete_id)
);
```

---

## 🚀 Next Steps

### Phase 1: Backend Development (Priority: HIGH)

1. **Authentication System:**
   - User registration/login
   - JWT token generation
   - Role-based access control (RBAC)
   - Session management

2. **API Endpoints:**
   ```
   POST   /api/auth/register
   POST   /api/auth/login
   POST   /api/auth/logout
   GET    /api/users/me
   
   GET    /api/events
   GET    /api/events/{eventId}
   POST   /api/events
   PUT    /api/events/{eventId}
   
   POST   /api/events/{eventId}/register
   POST   /api/events/{eventId}/competitions/{compId}/register
   
   GET    /api/competitions/{compId}/targets
   GET    /api/competitions/{compId}/leaderboard
   
   POST   /api/scoresheets
   GET    /api/scoresheets/{scoresheetId}
   PUT    /api/scoresheets/{scoresheetId}
   
   GET    /api/teams
   POST   /api/teams
   ```

3. **Database Setup:**
   - MySQL/PostgreSQL database
   - Migration scripts
   - Seed data for testing

### Phase 2: Real-time Features (Priority: HIGH)

1. **WebSocket Implementation:**
   - Real-time score updates
   - Live leaderboard refresh
   - Notification when scores change

2. **Technologies:**
   - Socket.io or native WebSocket
   - Redis for pub/sub
   - Event-driven architecture

### Phase 3: UI Enhancements (Priority: MEDIUM)

1. **Elimination Round Management:**
   - UI for host to select athletes
   - Override qualification rankings
   - Generate bracket view
   - Send notifications to selected athletes

2. **Results & Leaderboards:**
   - Dedicated results page
   - Historical results view
   - Filter by bow type, category, date
   - Sortable columns

3. **Notifications:**
   - Browser push notifications
   - In-app notification center
   - Email notifications (optional)

### Phase 4: Export & Reporting (Priority: LOW)

1. **Export Functionality:**
   - Export results to PDF
   - Export results to Excel
   - Print-friendly scoresheets
   - QR code for sharing results

2. **Analytics Dashboard:**
   - Event statistics
   - Athlete performance history
   - Competition trends

### Phase 5: Mobile App (Priority: LOW)

1. **React Native or Flutter:**
   - Native mobile experience
   - Offline score entry (sync later)
   - Push notifications
   - Camera integration for target photos

---

## 📝 Known Limitations (Current Prototype)

1. **No Authentication:**
   - User role is hardcoded in JavaScript
   - No login/logout functionality
   - Production needs proper auth

2. **LocalStorage Only:**
   - Data not persistent across devices
   - No synchronization
   - No conflict resolution

3. **No Real-time Updates:**
   - Manual refresh needed
   - No WebSocket connection
   - Leaderboard not auto-updating

4. **Mock Data:**
   - Targets and athletes are hardcoded
   - Production needs dynamic loading from database

5. **No Elimination UI:**
   - Host manual selection not yet implemented
   - Planned for Phase 3

6. **No Export:**
   - Cannot download results
   - Cannot print scoresheets
   - Planned for Phase 4

---

## 🧪 Testing Checklist

### User Registration
- [ ] Enter team name → Submit → Verify localStorage
- [ ] Try submitting without team name → Should show error
- [ ] Try submitting without selecting competitions → Should show error
- [ ] Create new team → Verify auto-creation message
- [ ] Join existing team → Verify team is reused

### Competition Status
- [ ] Toggle "In Progress" → Verify green icon and text
- [ ] Toggle "Closed" → Verify red icon and text
- [ ] Click "Closed" competition → Should show error snackbar
- [ ] Click "In Progress" competition → Should open scoring page

### Scoring (Athlete)
- [ ] Navigate to own target → Can score for others
- [ ] Try scoring for self → Should be restricted
- [ ] Complete scoresheet → Verify green checkmark
- [ ] Try editing after submission → Should be restricted

### Scoring (Referee)
- [ ] Navigate to any target → Can score for anyone
- [ ] Edit existing scoresheet → Should allow
- [ ] Complete scoresheet → Verify save

### Leaderboard
- [ ] View spectator tab → See all athletes ranked
- [ ] Filter "Completed" → See only completed scoresheets
- [ ] Filter "In Progress" → See only partial scores
- [ ] Verify medal colors (gold, silver, bronze)

---

## 📞 Support & Questions

For questions or clarifications, please contact:

**Developer:** TruongPham  
**Project:** ArcheryEventBMAD  
**Module:** BMM (BMAD Modular Methodology)

---

## 📄 License

This is a prototype implementation for the Archery Event Management System.

---

**Last Updated:** November 16, 2025  
**Document Version:** 1.0