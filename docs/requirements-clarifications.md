# Requirements Clarifications - Archery Event Management System
 
**Date:** November 29, 2025  
**Version:** 1.2  
**Last Updated:** November 30, 2025  
**Status:** Approved - Ready for Implementation
 
---
 
## 📚 Related Documents
 
This document is the **authoritative source** for all detailed clarifications. Related documents have been updated to reference these requirements:
 
- **[PRD.md](./PRD.md)** - Product Requirements Document (v1.1) - Updated with FR-1 through FR-8
- **[architecture.md](./architecture.md)** - System Architecture (v1.1) - Updated database schema and system design
- **[epics.md](./epics.md)** - Epic breakdown and user stories (to be updated)
 
**Important:** Any conflicts between this document and other documents should be resolved in favor of this document.
 
---
 
## Document Purpose
 
This document captures detailed clarifications and requirements updates provided by the client. These supersede any conflicting information in the original PRD.md and architecture.md documents.
 
---
 
## 1. Authentication & Session Management
 
### 1.1 Social Login (Phase 1)
 
**Google SSO:**
- Primary authentication method
- OAuth 2.0 flow
- Retrieves: Email, First Name, Last Name, Profile Photo
- Auto-creates user account on first login
 
**Facebook SSO:**
- Primary authentication method
- OAuth 2.0 flow
- Retrieves: Email, First Name, Last Name, Profile Photo
- Auto-creates user account on first login
 
### 1.2 Persistent Login Sessions
 
**Multi-Day Sessions:**
- Users remain logged in for **30 days** by default
- Refresh token rotation for security
- "Remember Me" option extends session to **90 days**
- Auto-refresh before token expiration (seamless for user)
 
**Session Management:**
- JWT access token: 24-hour expiration
- Refresh token: 30-90 days (based on "Remember Me")
- Secure HttpOnly cookies for token storage
- Automatic token refresh in background
 
**Security:**
- Revoke all sessions on password change (if using email/password)
- Device tracking (optional Phase 2: see active sessions, revoke specific devices)
- IP-based anomaly detection (optional Phase 2)
 
**User Experience:**
- ✅ User logs in once via Google or Facebook
- ✅ User participates in event over multiple days without re-login
- ✅ Background token refresh prevents interruptions
- ✅ Only re-login required after 30-90 days (or manual logout)
 
---
 
## 2. User Roles & Multi-Role Capabilities
 
### 2.1 Role Combination Rules
 
**Host + Athlete:** ✅ **ALLOWED**
- A user can be both Host and Athlete in the same event
- Host retains full administrative privileges while competing
- Use case: Small local events where organizer also competes
 
**Referee + Athlete:** ❌ **NOT ALLOWED**
- A user cannot be both Referee and Athlete in the same event
- Prevents conflict of interest in scoring and rule enforcement
- Enforced at registration level
 
**Host Co-Management:**
- When Host approves another user as Host, they have **equal permissions**
- No primary/secondary distinction
- Both can manage event, approve participants, control competitions
 
---
 
## 3. Competition Structure & Configuration
 
### 3.1 Competition Identification
 
Each competition within an event is uniquely identified by:
 
1. **Bow Type** (Required)
   - Common: Recurve, Compound, Barebow
   - Extended: Longbow, Traditional Bow, etc. (user input allowed)
   - Stored as string, allows custom values
 
2. **Category** (Required, Fixed List)
   - Men's Individual
   - Women's Individual
   - Men's Team
   - Women's Team
   - Mixed Team (must be 1 male + 1 female)
   - Men's Pair (2 males)
   - Women's Pair (2 females)
   
   **Note:** "Pair" is the international terminology for 2-person same-gender teams
 
3. **Round** (Required)
   - Predefined: WA 1440, WA 900, WA 720, etc.
   - Custom: Host can define their own rounds (Phase 1 feature)
 
4. **Subround** (Required)
   - Specific configuration within a Round
   - Example: "WA 1440 (90m)", "WA 900 (70m)"
   - Defines distances, target faces, ends, arrows
 
**Example Competition Name:**
- "Recurve - Men's Individual - WA 1440 (90m)"
- "Barebow - Women's Team - Custom Local 50m"
 
### 3.2 Custom Round Definition (Phase 1)
 
When Host creates a custom round, they define:
 
**⚠️ Important: Custom Round Visibility**
- Custom rounds are **Host-private** (user-specific)
- Only the Host who created the custom round can see and use it
- Other Hosts **cannot** see custom rounds created by other users
- If another Host wants the same configuration, they must create it again
- Prevents clutter and confusion from other users' custom configurations
- **Database:** `created_by` field tracks ownership, queries filter by current user
 
**Round-Level Configuration:**
- **Round Name:** (e.g., "Local Spring 50m", "Club Championship")
- **Target Face Type:** (applies to all phases, but can vary per phase)
  - Metric 10 Zone
  - Imperial
  - Vegas
  - Vegas Imperial
  - Worcester
  - Compound
  - Field FITA
  - NFAS Big Game
  - NFAA Single Face
  - NFAA Five Spot Face
 
**Phase Configuration (Multi-Phase Support):**
 
Each Round can have 1-4 phases with different configurations:
 
| Field | Type | Range/Options | Example |
|-------|------|---------------|---------|
| Phase Number | Integer | 1-4 | Phase 1, Phase 2 |
| Distance | Number + Unit | 10-100 (Meter or Yards) | 90m, 70m, 50 yards |
| Target Face Size | String | 16", 40cm, 60cm, 80cm, 122cm | 122cm, 80cm |
| Arrows per End | Integer | 1-6 | 6 (most common) |
| Number of Ends | Integer | 1-50 | 6 ends |
| Total Arrows | Calculated | arrows/end × ends | 36 arrows |
 
**Example: WA 1440 Configuration**
 
```
Round: WA 1440
Target Face Type: Metric 10 Zone
 
Phase 1:
  Distance: 90m
  Target Face: 122cm
  Arrows/End: 6
  Ends: 6
  Total: 36 arrows
 
Phase 2:
  Distance: 70m
  Target Face: 122cm
  Arrows/End: 6
  Ends: 6
  Total: 36 arrows
 
Phase 3:
  Distance: 50m
  Target Face: 80cm
  Arrows/End: 6
  Ends: 6
  Total: 36 arrows
 
Phase 4:
  Distance: 30m
  Target Face: 80cm
  Arrows/End: 6
  Ends: 6
  Total: 36 arrows
 
Grand Total: 144 arrows
```
 
**Validation Rules:**
- Minimum 1 phase required
- Distance must be > 0
- Arrows per end: 1-6
- Ends: 1-50
- Target face must match target face type
 
---
 
## 4. Equipment Check (Phase 1 - Optional Feature)
 
### 4.1 Feature Toggle
 
- Equipment check is **OPTIONAL** per event
- Host enables/disables during event creation
- If disabled, athletes proceed directly to competition after registration
 
### 4.2 Equipment Check Workflow
 
**When Enabled:**
 
1. **Registration:** Athlete registers for event → Status: "Pending Equipment Check"
2. **Equipment Check:** Host/Referee inspects equipment
3. **Approval:** Click "Approve Equipment" button → Athlete qualified for selected competitions
4. **Rejection:** If equipment fails, athlete cannot participate in that competition
 
**Equipment Check Scope:**
 
- **Per Bow Type:** Each bow is checked separately
- Example scenario:
  - Athlete has Recurve + Barebow
  - Recurve equipment approved → Can compete in Recurve competitions
  - Barebow equipment rejected → Cannot compete in Barebow competitions
 
**Who Can Approve:**
- Host (event creator)
- Co-Hosts (approved by original Host)
- Referees (approved for event)
 
**UI Implementation:**
- Simple approve button per athlete per bow type
- Visual status indicator: ✅ Approved / ⏳ Pending / ❌ Rejected
- No complex forms or documentation (Phase 1)
 
---
 
## 5. Target Assignment & Athlete Organization
 
### 5.1 Target Assignment Logic (Frontend Logic)
 
**Timing:** After registration deadline closes
 
**Assignment Options:**
 
**Option 1: Immediate Assignment**
- All registered athletes → Automatic target assignment
- Algorithm avoids same team on one target (see 4.2)
 
**Option 2: Post-Equipment Check**
- Only equipment-approved athletes → Target assignment
- More accurate for events with equipment requirements
 
**Implementation:**
- Logic executed in frontend
- Results saved to database
- Host can manually adjust if needed
 
### 5.2 Team-Aware Assignment Algorithm
 
**Goal:** Distribute team members across different targets when possible
 
**Rules:**
1. Each target has 4 positions: A, B, C, D
2. **Prefer:** 4 athletes from 4 different teams per target
3. **Allow:** Multiple athletes from same team if unavoidable (large teams)
4. **Example:**
   - Target 1: Team Alpha (A), Team Beta (B), Team Gamma (C), Team Delta (D) ✅ Ideal
   - Target 2: Team Alpha (A), Team Alpha (B), Team Beta (C), Team Gamma (D) ✅ Acceptable
 
**Algorithm Pseudocode:**
```
1. Group athletes by team
2. Sort teams by size (largest first)
3. For each target:
   - Try to assign 1 athlete from 4 different teams
   - If not enough teams, assign 2 from same team
4. Continue until all athletes assigned
```
 
**Manual Override:**
- Host can reassign athletes to different targets/positions via UI
- Changes saved to database
 
---
 
## 6. Scoring System & Workflow
 
### 6.1 Score Entry & Auto-Lock
 
**After Each End:**
1. Athlete completes 6 arrows
2. Athlete inputs all 6 scores
3. Athlete clicks "Confirm" ✓ button
4. **Score auto-locks** immediately
5. Athlete **cannot edit** locked scores
 
**Override Authority:**
- Only **Referee** or **Host** can edit locked scores
- Use case: Scoring disputes, corrections, referee-witnessed shots
 
### 6.2 Real-Time Scoreboard Updates
 
**Update Trigger:** Immediate upon score confirmation
 
**Broadcast Scope:**
- All connected clients see update within **2 seconds**
- No manual refresh required
- WebSocket/SignalR for live sync
 
**Visibility:**
- Athletes: See their own detailed scoresheet + leaderboard
- Spectators: See leaderboard only (no detailed scoresheets)
- Host/Referee: See everything
- **Tempo (Timing System):** Can observe live scores, leaderboard, and competition status (Phase 2 or later)
 
---
 
## 7. Competition Lifecycle Management
 
### 7.1 Competition Status System
 
**Status Options:**
 
| Status | Icon | Color | Scoring Allowed | Click Behavior |
|--------|------|-------|-----------------|----------------|
| **Active** | `mdi-play-circle` | Green | ✅ Yes | Opens scoring view |
| **Inactive** | `mdi-pause-circle` | Gray | ❌ No | Shows "Competition paused" |
| **Closed** | `mdi-close-circle` | Red | ❌ No | Shows "Competition closed" |
 
**Status Control:**
- Only **Host** can change status
- Prevents athletes from scoring when competition not ready
- Useful for managing multiple simultaneous competitions
 
**Use Case:**
- Host runs Qualification in morning → Status: Active
- Lunch break → Status: Inactive
- Resume afternoon → Status: Active
- After qualification complete → Status: Closed
- Start Elimination round → New competition, Status: Active
 
### 7.2 Competition Closure
 
**When Host Closes Competition:**
- All scores permanently locked
- Athletes cannot enter scores
- Referees cannot edit scores (unless Host reopens)
- Competition moves to "Completed" state
 
**Reopen Capability:**
- Host can reopen if needed (disputes, corrections)
- Audit log tracks reopen actions
- Historical scores retained (3-6 months minimum)
 
---
 
## 8. Post-Qualification Progression
 
### 8.1 Athlete Selection for Next Rounds
 
**Qualification Complete → Host Options:**
 
1. **Elimination Bracket** (Individual)
   - Host selects top N athletes (8, 16, 32, etc.)
   - System generates single-elimination bracket
   - Seeding based on qualification rank
 
2. **Team Competition**
   - Host manually selects athletes to form teams
   - Example: Top 3 athletes from each club → 1 team
   - Team scores = sum/average of member scores
 
3. **Pair Competition**
   - Host manually selects 2 athletes per pair
   - Same-gender requirement enforced
 
4. **Mixed Team Competition**
   - Host selects 1 male + 1 female per team
   - Gender rule enforced at selection
 
**Selection Interface:**
- Host view shows qualification rankings
- Checkboxes to select athletes
- Drag-and-drop to form teams/pairs (future enhancement)
- Validate gender rules before saving
 
### 8.2 Multiple Simultaneous Progressions
 
**Host Can Run Simultaneously:**
- Elimination (Top 16 individuals)
- Team competition (Multiple teams)
- Pair competition (Multiple pairs)
 
**Status Management:**
- Each progression tracked separately
- Host activates/pauses each independently
- Prevents athlete confusion
 
---
 
## 9. Elimination Round System
 
### 9.1 Bracket Configuration
 
**Bracket Size:** Host decides
- Common: 32, 16, 8, 4 (quarter-finals, semi-finals, finals)
- Custom: Any number (e.g., 24, 12)
 
**Seeding Strategy:**
- Based on qualification rank
- Standard: #1 vs #16, #2 vs #15, etc.
- Host can manually adjust matchups if needed (local rules)
 
### 9.2 Match Scoring System
 
**Set-Based Scoring (Best of 3 or 5):**
 
**Per Set:**
- Each athlete shoots defined arrows (e.g., 3 arrows)
- Higher score wins set → **2 points**
- Tie score → **1 point each**
 
**Match Win Condition:**
- First to **6 points** wins match
- Example progression: 2-0, 4-0, 4-2, 6-2 (Winner)
 
**Golden Arrow (Shoot-Off) Rule:**
 
If match tied **5-5**:
1. Both athletes shoot 1 arrow
2. **Referee determines** closest to center
3. Winner gets final point → **6-5** (Match Winner)
4. Referee clicks winner in UI → System records and advances athlete
 
### 9.3 Match Progression
 
**Winner Advancement:**
- Winner moves to next bracket round
- Loser eliminated
- Bracket auto-updates in real-time
- All users see bracket progression
 
**Final Match:**
- Determines 1st place (Champion)
- Loser gets 2nd place
- Semi-final losers get 3rd/4th place (no playoff in standard rules)
 
---
 
## 10. Phase 1 vs Phase 2 Features
 
### Phase 1 (MVP - Target Launch)
 
**Authentication & User Management:**
- ✅ Google SSO (primary method)
- ✅ Facebook SSO (primary method)
- ✅ Persistent login (multi-day sessions - users stay logged in for extended periods)
- 🔜 Email signup/login (Phase 2)
- ✅ Role management (Host, Referee, Athlete)
- ✅ Multi-role support (except Referee+Athlete)
 
**Event & Competition Management:**
- ✅ Event creation & management
- ✅ Competition configuration (Bow, Category, Round, Subround)
- ✅ Custom Round definition (multi-phase support)
- ✅ Equipment check (optional, button-based approval)
- ✅ Target assignment (team-aware algorithm)
 
**Scoring System:**
- ✅ Qualification round scoring
- ✅ Real-time scoreboard updates (< 2 seconds)
- ✅ Auto-lock after end confirmation
- ✅ Referee override capability
- ✅ Competition status management (Active/Inactive/Closed)
 
**Athlete & Referee Management:**
- ✅ Athlete registration & approval
- ✅ Referee registration & approval
- ✅ Multi-competition registration
 
**Elimination System:**
- ✅ OR 🔜 Athlete selection for elimination (could be Phase 1 or 2)
- ✅ OR 🔜 Single-elimination bracket generation
- ✅ OR 🔜 Set-based scoring (best of 3/5)
- ✅ OR 🔜 Golden Arrow shoot-off resolution
 
**Decision Pending:** Elimination system priority depends on client timeline preference
 
### Phase 2 (Post-MVP Enhancements)
 
**Authentication:**
- 🔜 Email signup/login
- 🔜 Password reset workflow
- 🔜 Apple SSO (additional social login)
 
**Advanced Competitions:**
- 🔜 Team competitions (multi-athlete team scoring)
- 🔜 Pair competitions (2-athlete pairs)
- 🔜 Mixed team competitions (male + female teams)
 
**Enhanced Features:**
- 🔜 Historical athlete performance tracking
- 🔜 Advanced statistics & analytics
- 🔜 Export results (PDF, CSV)
- 🔜 Competition templates
- 🔜 Multi-day event scheduling
 
**Tempo Integration (Phase 2 or Later):**
- 🔜 Tempo timing system observation API
- 🔜 Read-only access to live scores and leaderboard
- 🔜 Competition status visibility
- 🔜 WebSocket/API integration for real-time data feed
- 🔜 Tempo-specific authentication/authorization
- 🔜 Use case: Official timing systems can display live archery scores alongside event timing
 
**Elimination Enhancements (if not Phase 1):**
- 🔜 Double elimination brackets
- 🔜 Round-robin formats
- 🔜 Swiss-system tournaments
 
---
 
## 11. Data Persistence & History
 
### 11.1 Score History
 
**Retention Period:** Minimum 3-6 months
 
**Stored Data:**
- All scores (arrow-by-arrow)
- Timestamps
- Who entered score (Athlete, Referee, Host)
- Who modified score (if any)
- Lock/unlock events
 
**Audit Trail:**
- Complete history of all score changes
- User ID + timestamp for each modification
- Prevents disputes, enables transparency
 
### 11.2 Competition Closure
 
**When Closed:**
- All data frozen
- Export available
- Results published
- Leaderboard final
 
**Host Reopen:**
- Only Host can reopen
- Reopen event logged
- Used for corrections or disputes
 
---
 
## 12. Database Schema Updates
 
### 12.1 New/Updated Tables
 
**Competitions Table:**
```sql
CREATE TABLE competitions (
    id UUID PRIMARY KEY,
    event_id UUID REFERENCES events(id),
    bow_type VARCHAR(100),  -- Recurve, Compound, Barebow, Custom
    category VARCHAR(100),  -- Men's Individual, Women's Team, etc.
    round_id UUID REFERENCES rounds(id), -- Nullable for custom
    subround_id UUID REFERENCES subrounds(id), -- Nullable for custom
    status VARCHAR(50), -- Active, Inactive, Closed
    equipment_check_required BOOLEAN DEFAULT false,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```
 
**Rounds Table (Custom Rounds):**
```sql
CREATE TABLE rounds (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    target_face_type VARCHAR(100), -- Metric 10 Zone, Imperial, etc.
    is_custom BOOLEAN DEFAULT false,
    created_by UUID REFERENCES users(id), -- For custom rounds (NULL for predefined rounds)
    created_at TIMESTAMP
);
 
-- Query Logic:
-- Predefined rounds: WHERE is_custom = false (visible to all)
-- Custom rounds: WHERE is_custom = true AND created_by = :currentUserId (Host-private)
```
 
**Round Phases Table:**
```sql
CREATE TABLE round_phases (
    id UUID PRIMARY KEY,
    round_id UUID REFERENCES rounds(id),
    phase_number INTEGER, -- 1, 2, 3, 4
    distance DECIMAL(10,2),
    distance_unit VARCHAR(10), -- Meter, Yards
    target_face_size VARCHAR(20), -- 122cm, 80cm, 16 inches
    arrows_per_end INTEGER,
    number_of_ends INTEGER,
    total_arrows INTEGER GENERATED ALWAYS AS (arrows_per_end * number_of_ends) STORED
);
```
 
**Equipment Approvals Table:**
```sql
CREATE TABLE equipment_approvals (
    id UUID PRIMARY KEY,
    event_id UUID REFERENCES events(id),
    athlete_id UUID REFERENCES users(id),
    bow_type VARCHAR(100),
    status VARCHAR(50), -- Pending, Approved, Rejected
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    notes TEXT
);
```
 
**Target Assignments Table:**
```sql
CREATE TABLE target_assignments (
    id UUID PRIMARY KEY,
    competition_id UUID REFERENCES competitions(id),
    athlete_id UUID REFERENCES users(id),
    target_number INTEGER,
    position VARCHAR(1), -- A, B, C, D
    assigned_at TIMESTAMP
);
```
 
---
 
## 13. Technical Implementation Notes
 
### 13.1 Frontend Logic Requirements
 
**Target Assignment Algorithm:**
- Implement in Vue.js frontend
- Run after registration deadline or equipment check
- Save results to database via API
- Allow Host manual override
 
**Real-Time Updates:**
- SignalR for score broadcasts
- Reconnection handling
- Optimistic UI updates with rollback
 
**Competition Status Toggle:**
- Host-only button
- Color-coded visual feedback
- Instant UI update + database sync
 
### 13.2 API Endpoints Required
 
**Custom Rounds:**
```
POST /api/rounds - Create custom round (Host only, saved as created_by = current user)
GET /api/rounds - List rounds (returns predefined + current user's custom rounds only)
GET /api/rounds/:id - Get round details (only if predefined OR created_by = current user)
POST /api/rounds/:id/phases - Add phase to round (only if created_by = current user)
PUT /api/rounds/:id/phases/:phaseId - Update phase (only if created_by = current user)
DELETE /api/rounds/:id/phases/:phaseId - Remove phase (only if created_by = current user)
DELETE /api/rounds/:id - Delete custom round (only if created_by = current user)
 
-- Authorization Logic:
-- Predefined rounds (is_custom = false): Read-only for all users
-- Custom rounds (is_custom = true): Full CRUD only for creator (created_by = current user)
-- Other users' custom rounds: Not visible in API responses
```
 
**Equipment Check:**
```
GET /api/events/:id/equipment-approvals - List pending approvals
POST /api/events/:id/equipment-approvals/:athleteId/approve - Approve equipment
POST /api/events/:id/equipment-approvals/:athleteId/reject - Reject equipment
```
 
**Target Assignments:**
```
POST /api/competitions/:id/assign-targets - Auto-assign athletes
GET /api/competitions/:id/targets - Get target assignments
PUT /api/competitions/:id/targets/:assignmentId - Update assignment
```
 
**Competition Status:**
```
PUT /api/competitions/:id/status - Update status (Active/Inactive/Closed)
POST /api/competitions/:id/reopen - Reopen closed competition
```
 
---
 
## 14. UI/UX Considerations
 
### 14.1 Mobile-First Design
 
**All scoring interfaces must be:**
- Touch-optimized (44x44px minimum)
- Single-hand operable
- Fast load times (< 3 seconds on 4G)
- Offline-capable with sync
 
### 14.2 Desktop Observer Views
 
**Spectator Mode:**
- Full-screen leaderboard
- Auto-refresh (no manual reload)
- Bracket visualization
- Color-coded rankings (gold, silver, bronze)
 
### 14.3 Responsive Breakpoints (Implemented)
 
- Mobile Portrait: 320-599px (100vw, compact)
- Mobile Landscape: 600-767px (100vw, full)
- Tablet Portrait: 768-959px (100vw, careful)
- Monitor/Desktop: 960-1279px (100vw, full)
- Wide Screen: 1280px+ (35vw, centered Facebook-style)
 
---
 
## 15. Tempo Integration (Phase 2 or Later)
 
### 15.1 Overview
 
**Tempo** is a timing system commonly used in sporting events. This integration allows Tempo systems to observe live archery competition data for display alongside event timing information.
 
**Use Cases:**
- Official timing systems display live archery scores
- Multi-sport events where Tempo tracks timing + archery scores
- Large venues with centralized display systems
- Broadcasting scenarios requiring unified data feeds
 
### 15.2 Access Model
 
**Read-Only Observation:**
- Tempo can **observe** but **cannot modify** any data
- No scoring permissions
- No competition management permissions
- Pure data consumer role
 
**Authentication:**
- Dedicated Tempo API key per event (Host generates)
- Event-scoped access (Tempo can only see specific event data)
- Revocable by Host at any time
- Rate limiting to prevent abuse
 
### 15.3 Available Data
 
**Tempo Can Access:**
1. **Live Scores:**
   - Real-time score updates per athlete
   - Arrow-by-arrow details (optional, configurable by Host)
   - End totals and cumulative scores
 
2. **Leaderboard:**
   - Current rankings
   - Athlete names and teams
   - Total scores and progress
 
3. **Competition Status:**
   - Active/Inactive/Closed status
   - Competition phase (Qualification, Elimination)
   - Current round/end information
 
4. **Event Metadata:**
   - Event name, location, dates
   - Competition categories (Bow Type, Category, Round)
   - Number of participants
 
**Tempo Cannot Access:**
- User authentication details
- Athlete personal information beyond public profile
- Host/Referee administrative functions
- Historical event data (only current event)
 
### 15.4 Technical Integration
 
**API Endpoints (Phase 2):**
```
GET /api/tempo/events/:eventId/competitions - List competitions
GET /api/tempo/competitions/:id/leaderboard - Get live leaderboard
GET /api/tempo/competitions/:id/scores - Get athlete scores
GET /api/tempo/competitions/:id/status - Get competition status
```
 
**WebSocket/SignalR Integration:**
```
// Subscribe to live updates
tempo.subscribe('competition:123', (data) => {
  // Receive real-time score updates
  // data: { athleteId, scores, total, rank }
})
```
 
**Data Format:**
- JSON responses
- ISO 8601 timestamps
- Standard HTTP status codes
- Pagination for large datasets
 
### 15.5 Security & Rate Limiting
 
**API Key Management:**
- Host generates Tempo API key from event settings
- Key format: `tempo_live_[eventId]_[random32chars]`
- Keys are event-specific (cannot access other events)
- Host can regenerate or revoke keys anytime
 
**Rate Limits:**
- 100 requests/minute per API key
- WebSocket: 1 connection per API key
- Exceeding limits returns `429 Too Many Requests`
 
**Access Logs:**
- All Tempo API calls logged
- Host can view access history
- Suspicious activity alerts (Phase 2)
 
### 15.6 Implementation Timeline
 
**Phase 2 or Later** (Post-MVP):
- Tempo API development
- Documentation for Tempo integration partners
- Testing with real Tempo systems
- Example client libraries (JavaScript, Python)
 
**Prerequisites:**
- Phase 1 real-time scoring system stable
- SignalR infrastructure proven in production
- Security model validated
 
---
 
## 16. Success Metrics
 
### 16.1 Phase 1 Success Criteria
 
**Technical:**
- Score update latency < 2 seconds (95th percentile)
- 99.5% uptime during active competitions
- Zero data loss incidents
- Mobile usability score > 90%
 
**User Adoption:**
- Host 10+ successful events in first 3 months
- 100+ total athlete registrations
- 90%+ positive feedback on scoring experience
 
**Operational:**
- Zero manual intervention required during events
- All disputes resolved via audit trail
- Equipment check workflow < 30 seconds per athlete
 
---
 
## 17. Questions & Decisions Log
 
| # | Question | Answer | Impact |
|---|----------|--------|--------|
| 1 | Can Host also be Athlete? | YES | Multi-role support needed |
| 2 | Can Referee also be Athlete? | NO | Enforce at registration |
| 3 | Co-Host permissions equal? | YES | No hierarchy in permissions |
| 4 | Multiple competitions simultaneously? | YES | Status management per competition |
| 5 | Equipment check timing? | Pre-event, optional | Feature toggle needed |
| 6 | Target assignment automation? | Frontend algorithm, team-aware | Complex logic in Vue |
| 7 | Score locking behavior? | Auto-lock after confirmation | Referee override only |
| 8 | Golden Arrow decision maker? | Referee manually selects | UI button needed |
| 9 | Historical data retention? | 3-6 months minimum | Database cleanup strategy |
| 10 | Elimination in Phase 1? | TBD (could be Phase 1 or 2) | Timeline dependent |
| 11 | Facebook SSO needed? | YES (along with Google) | Phase 1 social login |
| 12 | How long should users stay logged in? | 30-90 days (persistent sessions) | Refresh token strategy |
| 13 | Tempo integration priority? | Phase 2 or later | Plan now, implement later |
| 14 | Custom round visibility? | Host-private (user-specific) | Only creator can see/use their custom rounds |
 
---
 
## Document Status
 
**Status:** ✅ **APPROVED - Ready for Implementation**  
**Last Updated:** November 29, 2025  
**Approved By:** Client (TruongPham)  
**Next Actions:**
1. ✅ Update architecture.md (critical sections) - COMPLETED Nov 29
2. ✅ Update PRD.md (critical sections) - COMPLETED Nov 29
3. ✅ Add Facebook SSO + Persistent Login - COMPLETED Nov 30
4. ✅ Add Tempo Integration planning - COMPLETED Nov 30
5. Begin Epic & User Story breakdown
6. Start Sprint 1 planning
 
---
 
_This document serves as the authoritative source for all clarified requirements. Any conflicts between this document and the original PRD/architecture documents should be resolved in favor of this document._
 