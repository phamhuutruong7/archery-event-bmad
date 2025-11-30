# Archery Event Management System - Product Requirements Document
 
**Author:** TruongPham  
**Date:** November 6, 2025  
**Version:** 1.2  
**Last Updated:** November 30, 2025
 
---
 
## ⚠️ IMPORTANT: Requirements Update
 
**This document has been updated to reflect new client requirements captured in:**
 
📄 **[requirements-clarifications.md](./requirements-clarifications.md)** (Created: Nov 29, 2025)
 
Key updates in this PRD:
- ✅ **FR-1.1**: Google SSO + Facebook SSO (Phase 1), Persistent login (30-90 days)
- ✅ **FR-1.3**: Multi-role support (Host+Athlete allowed, Referee+Athlete not allowed, Co-Host equal permissions)
- ✅ **FR-2.2-2.4**: Competition structure (Bow Type + Category + Round + Subround), Custom Round definition, Competition Status (Active/Inactive/Closed)
- ✅ **FR-3.4**: Equipment Check (optional, per-bow-type approval)
- ✅ **FR-3.5**: Target Assignment (team-aware algorithm)
- ✅ **FR-4.3**: Auto-lock scoring workflow (Referee override)
- ✅ **FR-5**: Elimination Round updates (Host-assigned matchups, set-based scoring, Golden Arrow shoot-off)
- ✅ **FR-6.4**: Tempo Integration (Phase 2 - timing system observation API)
- ✅ **FR-8**: Team & Pair Competitions (Phase 2)
- ✅ **Permission Matrix**: Updated with new actions (Toggle Competition Status, Approve Equipment, Create Custom Round)
 
**For complete requirement details, see [requirements-clarifications.md](./requirements-clarifications.md)**
 
---
 
## Executive Summary
 
The **Archery Event Management System** is a web-based platform that democratizes professional archery competition management. It enables anyone to create, manage, and participate in competitive archery events with the polish and functionality of major sporting events.
 
### The Vision
 
Transform how archery competitions are organized by providing a mobile-first platform where:
- **Hosts** can effortlessly create and manage professional-grade competitions
- **Athletes** can participate, input scores in real-time, and track their performance
- **Referees** can manage scoring with full authority and oversight
- **Spectators** can watch live leaderboards and tournament progression from anywhere
 
### What Makes This Special
 
🎯 **The Magic Moments:**
 
1. **Live Competition Experience** - Watch scores update in real-time as arrows hit targets, creating the excitement of being there live
2. **Athlete Empowerment** - Athletes input their own scores directly from the field via mobile, creating immediate engagement
3. **Automatic Tournament Flow** - System handles qualification rounds, automatically ranks athletes, and generates professional elimination brackets
4. **Multi-Perspective Viewing** - Referees on the field, observers in the stands, and remote spectators all see the same live data
5. **Professional Tournament Brackets** - Visualize head-to-head elimination rounds with automatic point tracking and shoot-off resolution
 
This platform brings **professional sports management tools** to the grassroots archery community, making it possible for anyone to run competitions that look and feel like major sporting events.
 
---
 
## Project Classification
 
**Technical Type:** Web Application (SaaS Platform)  
**Domain:** Sports Event Management / Competitive Athletics  
**Complexity:** Level 3 (Complex System - 10-25 user stories)  
**Architecture:** Monolithic with Multi-Repository Strategy
 
### Technical Stack
 
**Backend:**
- Framework: ASP.NET Core 9 (Jason Taylor Clean Architecture)
- Database: PostgreSQL 15 (or SQL Server, SQLite for dev)
- Authentication: ASP.NET Identity + Google SSO
- Security: JWT tokens + cookie-based sessions
- Logging: Serilog → Loki/file outputs
- ORM: Entity Framework Core
 
**Frontend:**
- Framework: Vue 3 + Vuetify (mobile-first, responsive)
- Authentication: Google SSO + credential-based (via backend)
- Build Tool: Vite
- State Management: Pinia
- HTTP Client: Axios
- Real-time: SignalR client
 
**Infrastructure & Deployment:**
- VPS: Ubuntu 24.04 (2 vCPU / 4 GB RAM)
- Containerization: Docker + Docker Compose
- Reverse Proxy: Nginx (SSL termination, load balancing)
- SSL/TLS: Let's Encrypt (automated with certbot)
- Firewall: UFW (allow 80, 443, 8200)
- Optional: Cloudflare proxy for DDoS protection
 
**Security & Secrets:**
- Secrets Management: HashiCorp Vault (Docker container)
- Access Method: Environment variables / Docker secrets
- Never stored in code or Dockerfile
- Frontend never accesses Vault directly
 
**Monitoring & Observability:**
- Metrics: Prometheus (app & container metrics)
- Visualization: Grafana (dashboards & alerts)
- Logs: Serilog + Loki + Promtail
- Alerts: Grafana alerts → email/webhook notifications
 
**CI/CD:**
- Repository: GitHub
- Pipeline: GitHub Actions
- Process: Test → Build → Deploy to VPS via SSH
- Deployment: Blue-green strategy with health checks
 
**Environments:** Dev → Prod (Staging planned for future)
 
### Repository Structure
 
- **Frontend Repository:** Vue 3 application (GitHub)
- **Backend Repository:** ASP.NET Core API + deployment configs (GitHub)
- Separate repos enable independent deployment and version control
 
### Coding Standards & Architecture Patterns
 
#### Backend: Clean Architecture (Jason Taylor Template)
 
The backend follows **Jason Taylor's Clean Architecture** pattern for ASP.NET Core, providing:
- **Clear separation of concerns** - Domain, Application, Infrastructure, and API layers
- **Dependency inversion** - Core business logic independent of external frameworks
- **Testability** - Easy unit and integration testing
- **Maintainability** - Structured for long-term growth and scalability
- **Future-proofing** - Easy to migrate from monolith to microservices if needed
 
**Benefits for this project:**
- While starting as a monolith, Clean Architecture reduces pain when expanding features
- Enables clear boundaries between scoring logic, event management, and infrastructure
- Makes it easier to extract services (e.g., real-time scoring engine) in the future
- Follows industry best practices for enterprise .NET development
 
#### Frontend: Organized Vue 3 Structure
 
The frontend follows **best-practice Vue 3 folder organization**:
 
```
frontend/
├── public/                    # Static assets served as-is
├── src/
│   ├── api/                   # API client and service layer
│   ├── assets/                # Images, fonts, static files
│   │   ├── images/
│   │   ├── fonts/
│   │   └── icons/
│   ├── components/            # Reusable Vue components
│   │   ├── common/            # Generic components (Button, Card, etc.)
│   │   ├── events/            # Event-specific components
│   │   ├── scoring/           # Scoring UI components
│   │   └── brackets/          # Tournament bracket components
│   ├── composables/           # Vue 3 Composition API reusable logic
│   ├── directives/            # Custom Vue directives
│   ├── layouts/               # Page layout components
│   │   ├── DefaultLayout.vue
│   │   ├── AuthLayout.vue
│   │   └── MobileLayout.vue
│   ├── locales/               # i18n translation files
│   │   ├── en.json
│   │   ├── vi.json
│   │   └── index.ts
│   ├── plugins/               # Vue plugins and third-party integrations
│   ├── router/                # Vue Router configuration
│   │   ├── index.ts
│   │   └── routes/
│   ├── store/                 # Pinia state management
│   │   ├── modules/
│   │   │   ├── auth.ts
│   │   │   ├── events.ts
│   │   │   ├── scores.ts
│   │   │   └── brackets.ts
│   │   └── index.ts
│   ├── styles/                # Global styles and themes
│   │   ├── variables.scss
│   │   ├── mixins.scss
│   │   └── main.scss
│   ├── types/                 # TypeScript type definitions
│   ├── utils/                 # Helper functions and utilities
│   ├── views/                 # Page-level components
│   │   ├── auth/
│   │   ├── events/
│   │   ├── scoring/
│   │   └── brackets/
│   ├── App.vue
│   └── main.ts
├── tests/                     # Unit and integration tests
├── vite.config.ts
└── package.json
```
 
**Organizational Benefits:**
- **Clear separation** - Easy to locate components, services, and utilities
- **Scalability** - Structure supports growth from MVP to large application
- **Team collaboration** - Developers can work in parallel without conflicts
- **Maintainability** - Consistent patterns make onboarding easier
- **i18n ready** - Multi-language support from day one
 
---
 
## Success Criteria
 
### User Success Metrics
 
**For Hosts:**
- Can create and launch an event in under 10 minutes
- Successfully manage 28+ athlete competitions without technical assistance
- Zero scoring disputes due to clear audit trails
 
**For Athletes:**
- Input scores within 30 seconds of completing an end (set of arrows)
- See their ranking update within 2 seconds of score submission
- Experience seamless transition from qualification to elimination rounds
 
**For Referees:**
- Update any score with full authority in under 15 seconds
- Resolve shoot-off decisions immediately through the interface
- View complete scoring history for audit purposes
 
**For Spectators:**
- Access live leaderboards from any device
- See tournament bracket progression in real-time
- No manual refresh needed - automatic updates
 
### Platform Success Metrics
 
- **Real-time Performance:** < 2 second latency for score updates across all connected clients
- **Mobile Usability:** 90%+ of score inputs happen on mobile devices
- **Reliability:** 99.5% uptime during active competitions
- **Adoption:** Host 10+ successful competitions in first 3 months
- **Monetization Path:** Identified revenue model to sustain VPS costs within 6 months
 
---
 
## Product Scope
 
### MVP - Minimum Viable Product
 
**Core Competition Management:**
1. ✅ User authentication and role-based access (Admin, Host, Referee, Athlete)
2. ✅ Google SSO + Facebook SSO (primary authentication methods)
3. ✅ Persistent login (30-90 days, no daily re-login required)
4. ✅ Event creation with customizable game types (Men/Women, Individual/Team, distance categories)
5. ✅ User registration and event participation (as Referee or Athlete)
6. ✅ Host-controlled referee approval workflow
7. ✅ Athlete multi-game registration within events
 
**Real-Time Scoring System:**
6. ✅ Target-based athlete organization (4 positions per target: A, B, C, D)
7. ✅ Peer scoring system (Athletes score each other on same target, not themselves)
8. ✅ Live score input with role-based permissions:
   - Athletes: Insert scores for OTHER athletes on same target (peer scoring)
   - Referees/Host/Admin: Insert/update ANY athlete's scores
   - Athletes CANNOT score themselves initially (prevents bias)
   - Only Referees/Host/Admin can edit after submission
9. ✅ Real-time score synchronization across all connected clients via SignalR
10. ✅ Live leaderboard with automatic ranking and medal colors (🥇🥈🥉)
11. ✅ Qualification round management (72 arrows, rank top performers)
12. ✅ Competition status: "In Progress" (scoring allowed) / "Closed" (scoring blocked)
13. ✅ Team registration with auto-creation of new teams
 
**Tournament Bracket System:**
10. ✅ Host-controlled athlete selection for elimination rounds (top 16, 8, etc.)
11. ✅ Tournament bracket visualization (1v1 matchups)
12. ✅ Set-based scoring (first to 6 points, 2 for win, 1 for draw)
13. ✅ Shoot-off resolution (referee decides closest-to-center)
14. ✅ Score locking after round completion
 
**Mobile & Desktop Support:**
15. ✅ Responsive mobile-first UI (primary use case)
16. ✅ Desktop observer view for spectators and event coordinators
 
### Growth Features (Post-MVP)
 
**Enhanced Competition Management:**
- Team competition support with aggregated scoring
- Multi-day event scheduling
- Athlete check-in and assignment management
- Target assignment automation
- Competition templates for common formats
 
**Advanced Analytics:**
- Historical performance tracking per athlete
- Competition statistics and insights
- Export competition results (PDF, CSV)
- Photo/video integration for scoring verification
 
**Community Features:**
- Athlete profiles and competition history
- Event discovery and public event listings
- Rating system for events and participants
- Social sharing of results
 
**Monetization Features:**
- Freemium tier (limited events per month)
- Premium subscriptions for hosts
- Event registration fees processing
- Advertisement placements (non-intrusive)
 
### Vision (Future)
 
**Platform Expansion:**
- Mobile native apps (iOS/Android) for enhanced performance
- Live streaming integration
- Multi-sport support (expand beyond archery)
- Federation/organization management tools
- Certification and qualification tracking
 
**Advanced Tournament Features:**
- Complex bracket formats (double elimination, round robin)
- Handicap systems and classification support
- Weather condition tracking
- Equipment tracking and compliance
 
**Global Scale:**
- Multi-language support
- Regional competition series tracking
- International ranking system integration
- Timezone-aware scheduling
 
---
 
## User Roles & Permissions
 
### Role Definitions
 
| Role | Access Level | Primary Responsibilities |
|------|-------------|-------------------------|
| **Admin** | System-wide | Platform management, full scoring access, can override any restrictions |
| **Host** | Event-scoped | Create events, toggle competition status, approve referees, manage brackets, edit ANY athlete's scoresheet, manually select athletes for elimination rounds |
| **Referee** | Event-scoped | View all scoresheets, edit ANY athlete's scoresheet (even after submission), enter scores for any athlete, supervise competition integrity |
| **Athlete** | Target-scoped | Register with team name, score for OTHER athletes on SAME target (peer scoring), CANNOT score for themselves initially, view own scoresheet and leaderboard |
| **Spectator** | Read-only | View live leaderboard with real-time updates, see overall competition scores, CANNOT view detailed scoresheets or enter scores |
| **Tempo (Phase 2)** | API-only | Timing systems can observe live scores, leaderboard, and competition status via read-only API (Host-generated API keys) |
 
### Permission Matrix
 
| Action | Admin | Host | Referee | Athlete |
|--------|-------|------|---------|---------|
| Create Event | ✅ | ✅ | ❌ | ❌ |
| Update Event Details | ✅ | ✅ (own) | ❌ | ❌ |
| Delete Event | ✅ | ✅ (own) | ❌ | ❌ |
| Toggle Competition Status (Active/Inactive/Closed) | ✅ | ✅ (own event) | ❌ | ❌ |
| Enable/Disable Equipment Check | ✅ | ✅ (event creation) | ❌ | ❌ |
| Approve Equipment Check | ✅ | ✅ | ✅ | ❌ |
| Create Custom Round | ✅ | ✅ | ❌ | ❌ |
| Approve Referee Applications | ✅ | ✅ (own event) | ❌ | ❌ |
| Approve Co-Host (Equal Permissions) | ✅ | ✅ (own event) | ❌ | ❌ |
| Register as Athlete | ✅ | ✅ | ❌ (conflicts) | ✅ |
| Register as Referee | ✅ | ✅ | ✅ | ❌ (conflicts) |
| Insert Own Score | ✅ | ✅ | ✅ | ❌ (peer scoring only) |
| Update Own Score (Before Lock) | ✅ | ✅ | ✅ | ✅ |
| Update Own Score (After Auto-Lock) | ✅ | ✅ | ✅ | ❌ |
| Insert Other Athlete Score (Same Target) | ✅ | ✅ | ✅ | ✅ (peer scoring) |
| Insert Other Athlete Score (Any Target) | ✅ | ✅ | ✅ | ❌ |
| Update Other Athlete Score | ✅ | ✅ | ✅ | ❌ |
| Lock Scores | ✅ | ✅ | ❌ | ❌ |
| Select Elimination Participants | ✅ | ✅ | ❌ | ❌ |
| Resolve Shoot-off | ✅ | ✅ | ✅ | ❌ |
| View Live Leaderboard | ✅ | ✅ | ✅ | ✅ |
| View Tournament Brackets | ✅ | ✅ | ✅ | ✅ |
 
---
 
## Functional Requirements
 
### FR-1: User Management
 
**FR-1.1: User Registration & Authentication**
- **Google SSO** (Phase 1 - Primary method)
- **Facebook SSO** (Phase 1 - Primary method)
- **Persistent Login:** Users remain logged in for 30-90 days (no daily re-login required)
- Email/password registration (Phase 2)
- Email verification required for account activation (Phase 2)
- Secure password requirements (min 8 chars, complexity rules) (Phase 2)
- JWT-based authentication with refresh tokens
- Session management:
  - Access token: 24-hour expiration
  - Refresh token: 30 days (default) or 90 days ("Remember Me")
  - Automatic token refresh in background
  - Secure HttpOnly cookies for token storage
 
**FR-1.2: Profile Management**
- Users can update profile information (name, contact, bio)
- Optional profile photo upload
- Archery credentials/certifications (optional)
- Competition history tracking
 
**FR-1.3: Role Assignment & Multi-Role Support**
- Users can participate in multiple roles across different events
- Role-specific dashboards and navigation
- Admin can manually adjust user roles if needed
 
**Multi-Role Rules (Per requirements-clarifications.md):**
- ✅ **Host + Athlete:** Allowed in same event (useful for small local competitions)
- ❌ **Referee + Athlete:** NOT allowed in same event (prevents conflict of interest)
- ✅ **Co-Host Permissions:** When Host approves another Host, both have equal permissions (no hierarchy)
- Enforced at registration level with validation logic
 
---
 
### FR-2: Event Management
 
**FR-2.1: Event Creation**
- Host creates event with:
  - Event name, description, location
  - Start/end dates
  - Registration deadline
  - Public/private visibility
  - Custom rules or notes
  - Equipment check toggle (optional feature)
- Host can create themselves as default participant (Referee or Athlete)
 
**FR-2.2: Competition Configuration**
- Each competition within an event is uniquely identified by:
 
  **1. Bow Type (Required, User-Definable):**
  - Common: Recurve, Compound, Barebow
  - Extended: Longbow, Traditional Bow
  - Custom: Host can input any bow type
 
  **2. Category (Required, Fixed List):**
  - Men's Individual
  - Women's Individual
  - Men's Team
  - Women's Team
  - Mixed Team (must be 1 male + 1 female)
  - Men's Pair (2 males)
  - Women's Pair (2 females)
 
  **3. Round (Required, Predefined + Custom):**
  - Predefined: WA 1440, WA 900, WA 720, etc.
  - Custom: Host can define their own rounds (Phase 1)
 
  **4. Subround (Required):**
  - Specific configuration within round
  - Examples: "WA 1440 (90m)", "WA 900 (70m)"
 
- **Competition Name Format:** "Bow Type - Category - Round Subround"
  - Example: "Recurve - Men's Individual - WA 1440 (90m)"
  - Example: "Barebow - Women's Team - Custom Local 50m"
 
**FR-2.3: Custom Round Definition (Phase 1)**
- Host can create custom rounds with:
  - Round name (e.g., "Local Spring 50m", "Club Championship")
  - Target face type (Metric 10 Zone, Imperial, Vegas, Worcester, etc.)
  - Multi-phase support (1-4 phases)
 
- **⚠️ Custom Round Visibility:**
  - Custom rounds are **Host-private** (user-specific)
  - Only the Host who created the custom round can see and use it
  - Other Hosts cannot see custom rounds created by other users
  - If another Host wants the same configuration, they must create it again
  - Prevents clutter from other users' custom configurations
 
- **Per Phase Configuration:**
  - Distance (10-100) + Unit (Meter/Yards)
  - Target face size (16", 40cm, 60cm, 80cm, 122cm)
  - Arrows per end (1-6)
  - Number of ends (1-50)
  - Total arrows auto-calculated
 
- **Example: WA 1440 has 4 phases:**
  - Phase 1: 90m, 122cm face, 6 arrows × 6 ends = 36 arrows
  - Phase 2: 70m, 122cm face, 6 arrows × 6 ends = 36 arrows
  - Phase 3: 50m, 80cm face, 6 arrows × 6 ends = 36 arrows
  - Phase 4: 30m, 80cm face, 6 arrows × 6 ends = 36 arrows
  - **Grand Total: 144 arrows**
 
**FR-2.4: Competition Status Management**
- Each competition has independent status:
  - **Active:** Scoring allowed, athletes can enter scores
  - **Inactive:** Scoring paused, useful for breaks or managing multiple simultaneous competitions
  - **Closed:** Competition finished, scores permanently locked (Host can reopen if needed)
 
- Only Host can toggle status (color-coded buttons: Green/Gray/Red)
- Prevents scoring when competition not ready
- Enables Host to manage multiple competitions without conflicts
 
**FR-2.5: Event Updates**
- Host can edit event details before/during competition
- Host can cancel events (with participant notification)
- Event status tracking: Draft → Open for Registration → In Progress → Completed
- Closed competitions retain data for 3-6 months minimum (audit/historical purposes)
 
---
 
### FR-3: Participation Management
 
**FR-3.1: Registration Workflow**
- Users browse available events
- Users apply to participate as:
  - **Referee:** Pending approval by host
  - **Athlete:** Immediate registration to selected games
- Users can register for multiple games within same event
- Registration deadline enforcement
 
**FR-3.2: Referee Approval**
- Host views list of referee applicants
- Host approves/rejects referee applications
- Approved referees receive notification
- Approved referees gain scoring permissions for that event
 
**FR-3.3: Athlete Game Selection & Team Registration**
- Athletes enter team name during registration (required field)
- System auto-creates team if name doesn't exist, or joins existing team
- Athletes select which games to participate in (from available options)
- Multi-game participation supported
- Athletes see registration confirmation per game with team name
- Team information stored per athlete per event
- Host can manage team assignments in database if needed
 
**FR-3.4: Equipment Check (Phase 1 - Optional Feature)**
- **Feature Toggle:** Host enables/disables equipment check during event creation
- **When Disabled:** Athletes proceed directly to competition after registration
- **When Enabled:**
 
  **Equipment Check Workflow:**
  1. Athlete registers → Status: "Pending Equipment Check"
  2. Host/Referee inspects equipment
  3. Click "Approve Equipment" button → Athlete qualified for selected competitions
  4. If rejected, athlete cannot participate in that competition
 
  **Per-Bow-Type Approval:**
  - Each bow is checked separately
  - Example: Athlete has Recurve + Barebow
    - Recurve approved → Can compete in Recurve competitions
    - Barebow rejected → Cannot compete in Barebow competitions
 
  **Approval Authority:**
  - Host (event creator)
  - Co-Hosts (approved by original Host)
  - Referees (approved for event)
 
  **UI Requirements:**
  - Simple approve button per athlete per bow type
  - Visual status indicators: ✅ Approved / ⏳ Pending / ❌ Rejected
  - No complex forms or documentation in Phase 1
 
**FR-3.5: Target Assignment**
- **Timing:** After registration deadline OR after equipment check (if enabled)
- **Assignment Options:**
  - Option 1: All registered athletes → Auto-assign
  - Option 2: Only equipment-approved athletes → Auto-assign
 
- **Team-Aware Assignment Algorithm (Frontend Logic):**
  - Each target: 4 positions (A, B, C, D)
  - **Ideal:** 4 athletes from 4 different teams per target
  - **Acceptable:** Multiple athletes from same team if unavoidable
  - Goal: Distribute team members across different targets
 
  **Algorithm:**
  1. Group athletes by team
  2. Sort teams by size (largest first)
  3. For each target, try to assign 1 athlete from 4 different teams
  4. If not enough teams, assign 2 from same team
  5. Continue until all athletes assigned
 
- **Manual Override:** Host can reassign athletes via drag-and-drop UI (future) or manual edit
 
---
 
### FR-4: Qualification Round Scoring
 
**FR-4.1: Target-Based Organization**
- Athletes organized by targets (e.g., Target 1, Target 2, Target 3)
- Each target has 4 positions: A, B, C, D
- Visual display shows all athletes per target with completion status:
  - ✅ Green checkmark: Scoresheet completed
  - 🟡 Yellow indicator: Partial scores entered  
  - ⚪ Gray indicator: No scores yet
- Competition Scoring View with 2 tabs:
  - **Scorer Tab:** For Host/Athlete/Referee/Admin to view targets and enter scores
  - **Spectator Tab:** Public leaderboard view with real-time rankings
 
**FR-4.2: Peer Scoring System**
- **Athletes (Peer Scoring):**
  - Can score for OTHER athletes on the SAME target only
  - CANNOT score for themselves initially (prevents self-scoring bias)
  - Example: Athlete at Target 3-Position B can score for positions A, C, D
  - After submission, CANNOT edit scores (locked for integrity)
- **Referees/Host/Admin:**
  - Can score for ANY athlete on ANY target
  - Can edit ANY athlete's scoresheet even after submission
  - Useful for corrections, disputes, or referee-led scoring
- **Spectators:**
  - Cannot enter scores
  - Can only view live leaderboard
- Clear audit trail of who entered/modified each score
 
**FR-4.3: Score Input Interface**
- Mobile-optimized score entry form
- Click athlete cell → Opens scoresheet page
- Arrow-by-arrow score entry per end (typically 6 arrows)
- Color-coded ring values:
  - 🟡 Yellow: X, 10, 9
  - 🔴 Red: 8, 7
  - 🔵 Blue: 6, 5
  - ⚫ Black: 4, 3
  - ⚪ White: 2, 1
  - 🟢 Green: M (Miss)
- Running total display with live statistics (total score, golds, average per arrow)
- End-by-end confirmation with ✓ button
- Locked ends cannot be edited after confirmation (except by Referee/Host/Admin)
- Visual feedback on score submission
- Offline support with sync when connection restores
 
**FR-4.3: Score Entry & Auto-Lock Workflow**
- After each end:
  1. Athlete completes arrows (e.g., 6 arrows)
  2. Athlete (or peer) inputs all arrow scores
  3. Athlete clicks "Confirm" ✓ button
  4. **Score auto-locks immediately**
  5. Athlete **cannot edit** locked scores
 
- **Override Authority:**
  - Only **Referee**, **Host**, or **Admin** can edit locked scores
  - Use cases: Scoring disputes, corrections, referee-witnessed shots
  - All modifications tracked in audit log
 
**FR-4.4: Real-Time Synchronization**
- Score updates broadcast to all connected clients within **2 seconds**
- WebSocket or SignalR for live updates
- Automatic reconnection handling
- Conflict resolution (referee/host changes override athlete inputs)
 
**FR-4.5: Live Leaderboard**
- Real-time ranking of all athletes in game
- Sort by total score (highest first)
- Display: Rank, Athlete Name, Current Score, Arrows Shot
- Auto-refresh without page reload
- Accessible on mobile and desktop
 
**FR-4.6: Competition Status Management**
- Each competition has independent status:
 
  **Active (Green):**
  - Icon: `mdi-play-circle`
  - Color: Green (#2e7d32)
  - Scoring **allowed**
  - Athletes, Referees, Admins, Hosts can enter scores
  - Clicking competition row opens scoring view
 
  **Inactive (Gray):**
  - Icon: `mdi-pause-circle`
  - Color: Gray (#757575)
  - Scoring **paused**
  - Useful for breaks or managing multiple competitions
  - Clicking shows "Competition paused" message
 
  **Closed (Red):**
  - Icon: `mdi-close-circle`
  - Color: Red (#c62828)
  - Competition **finished**, scores permanently locked
  - No scoring allowed
  - Clicking shows "Competition closed" message
 
- **Status Control:**
  - Only **Host** can toggle status
  - Enables managing multiple simultaneous competitions without conflicts
  - Visual feedback via snackbar notifications (3-second display)
 
- **Reopen Capability:**
  - Host can reopen closed competitions if needed (disputes, corrections)
  - Reopen event logged in audit trail
  - Historical scores retained for 3-6 months minimum
 
**FR-4.7: Score Locking & Edit Restrictions**
- Athletes can submit scores but CANNOT edit after confirmation
- Only Host/Referee/Admin can edit submitted scores (even after lock)
- Individual scoresheet ends lock after confirmation
- Visual indicator showing locked status
- Complete scoresheet shows green checkmark on target view
- Audit trail tracks all modifications (who, when, old value, new value)
 
---
 
### FR-5: Elimination Round Management (Phase 1 or 2 - TBD)
 
**FR-5.1: Athlete Selection for Elimination**
- After qualification scoring complete, system ranks all athletes
- **Host manually selects** athletes to advance to elimination
- Host decides bracket size: 32, 16, 8, 4 (or custom numbers)
- Selection interface shows qualification rankings
- System validates minimum bracket size requirements
- Athletes receive notification of advancement
 
**FR-5.2: Bracket Configuration & Matchup Assignment**
- Host defines:
  - Bracket size (e.g., 32, 16, 8, quarter-finals, semi-finals, finals)
  - Seeding strategy (standard or custom)
 
- **Matchup Assignment:**
  - **Standard Seeding:** #1 vs lowest seed, #2 vs second-lowest, etc.
  - **Host Custom Rules:** Host can manually assign specific matchups
  - Useful for local rules, regional preferences, or seeding adjustments
 
- Bracket displays graphically (tree structure)
- Mobile and desktop optimized views
 
**FR-5.3: Set-Based Scoring System**
- Each match uses **Best of 3 or Best of 5 sets**
- Scoring per set:
  - **Win set:** 2 points
  - **Draw set:** 1 point each
  - **Loss set:** 0 points
 
- **Match Win Condition:**
  - First to **6 points** wins the match
  - Example progression: 2-0, 4-0, 4-2, 6-2 (Winner)
 
- Athletes shoot defined arrows per set (e.g., 3 arrows)
- Real-time point tracking per match
 
**FR-5.4: Golden Arrow (Shoot-Off) Resolution**
- **Trigger:** Match tied **5-5**
- **Process:**
  1. Both athletes shoot **1 arrow**
  2. **Referee determines** closest to center (manual judgment)
  3. Referee clicks winner in UI
  4. Winner gets final point → **6-5** (Match Winner)
 
- System records shoot-off in audit log
- Visual indicator: "Golden Arrow" badge on bracket
 
**FR-5.5: Match Progression**
- Winner advances to next bracket round
- Loser eliminated (single-elimination format)
- Bracket auto-updates in real-time
- All connected users see progression
- Clear visual indication: Current matches (highlighted) vs Completed (grayed)
 
**FR-5.6: Tournament Completion**
- **Final Match:** Determines 1st place (Champion)
- **Loser of Final:** Gets 2nd place
- **Semi-Final Losers:** Get 3rd/4th place (no playoff in standard rules)
- Final standings exported/displayed
- Podium results published to event page
 
---
 
### FR-6: Real-Time Updates & Notifications
 
**FR-6.1: Live Score Broadcasting**
- All score changes broadcast immediately
- Leaderboard auto-updates
- Bracket status updates in real-time
 
**FR-6.2: System Notifications**
- Email notifications for:
  - Event registration confirmation
  - Referee approval/rejection
  - Advancement to elimination round
  - Match schedule updates
- In-app notifications for time-sensitive updates
 
**FR-6.3: Observer Mode**
- Public/private spectator view
- Desktop-optimized full-screen leaderboard
- No authentication required for public events
- Refresh-free live updates
 
**FR-6.4: Tempo Integration (Phase 2 or Later)**
- **Tempo** timing systems can observe live competition data
- Read-only API access for Tempo systems
- Host generates event-specific Tempo API keys
- Available data: Live scores, leaderboard, competition status
- WebSocket/SignalR for real-time data feeds
- Rate limiting: 100 requests/minute per API key
- Use case: Tempo displays live archery scores alongside event timing
- See [requirements-clarifications.md Section 15](./requirements-clarifications.md#15-tempo-integration-phase-2-or-later) for detailed specifications
 
---
 
### FR-7: Multi-Device Support
 
**FR-7.1: Mobile-First Design**
- Optimized for phone screens (primary use case)
- Touch-friendly controls
- Minimal data usage
- Fast load times (<3s on 4G)
 
**FR-7.2: Desktop Support**
- Full feature parity with mobile
- Enhanced viewing for observers
- Multi-column layouts for leaderboards/brackets
- Keyboard shortcuts for power users
 
**FR-7.3: Responsive Behavior**
- Automatic layout adaptation
- Same codebase for all screen sizes
- Progressive enhancement approach
 
---
### FR-8: Team & Pair Competitions (Phase 2)
 
**FR-8.1: Post-Qualification Team Formation**
- After qualification complete, Host can form teams from qualified athletes
- **Team Selection Process:**
  - Host views qualification rankings
  - Host manually selects athletes to form teams
  - Example: Top 3 athletes from each club → 1 team per club
 
- **Team Scoring:**
  - Team score = sum or average of member scores
  - Configurable by Host (sum vs average)
  - Real-time team leaderboard
 
**FR-8.2: Pair Competitions**
- Host selects 2 athletes per pair
- **Same-Gender Requirement:** Enforced at selection
  - Men's Pair: 2 males only
  - Women's Pair: 2 females only
- System validates gender rules before saving
- Pair scores tracked separately from individual
 
**FR-8.3: Mixed Team Competitions**
- Host selects 1 male + 1 female per team
- **Gender Rule Enforced:** System prevents invalid combinations
- Example: Men's Team (3 males), Women's Team (3 females), Mixed Team (1M + 1F)
- UI shows gender indicators during selection
 
**FR-8.4: Multi-Competition Parallel Management**
- Host can run simultaneously:
  - Elimination rounds (Top 16 individuals)
  - Team competition (Multiple teams)
  - Pair competition (Multiple pairs)
- Each tracked separately with independent status
- Athletes can participate in multiple categories if qualified
 
---
 
## Non-Functional Requirements
 
### NFR-1: Performance
 
**NFR-1.1: Response Times**
- API responses: < 500ms for 95th percentile
- Score update propagation: < 2 seconds to all clients
- Page load time: < 3 seconds on 4G mobile connection
- Database queries: < 100ms for standard operations
 
**NFR-1.2: Concurrency**
- Support 100+ simultaneous score inputs without degradation
- Handle 500+ concurrent spectators per event
- WebSocket connection pooling for scalability
 
**NFR-1.3: Real-Time Requirements**
- WebSocket/SignalR for live updates
- Graceful degradation to polling if WebSocket unavailable
- Update batching to prevent UI thrashing
 
---
 
### NFR-2: Security
 
**NFR-2.1: Authentication & Authorization**
- JWT tokens with 24-hour expiration
- Refresh token rotation for security
- Role-based access control (RBAC) enforced at API level
- No client-side permission bypass possible
 
**NFR-2.2: Data Protection**
- HTTPS only (TLS 1.3 preferred, TLS 1.2 minimum)
- SSL/TLS certificates (Let's Encrypt or commercial CA)
- Password hashing with bcrypt (min cost factor 12)
- SQL injection prevention (parameterized queries)
- XSS protection (input sanitization)
- CSRF token validation
 
**NFR-2.3: Network Security**
- Nginx reverse proxy for SSL termination and request routing
- Web Application Firewall (WAF) rules
- Rate limiting per IP/user:
  - Login attempts: 5 per minute per IP
  - API requests: 100 per minute per authenticated user
  - Score submissions: 30 per minute per athlete
- DDoS protection at reverse proxy level
- IP blacklisting/whitelisting capability
- Request size limits (prevent payload attacks)
- CORS policy enforcement
 
**NFR-2.4: API Gateway & Security**
- API Gateway for centralized request handling
- API key validation for third-party integrations (future)
- Request/response logging for security audit
- Input validation at gateway level
- SQL injection and XSS filtering
 
**NFR-2.5: Audit & Compliance**
- All score modifications logged with timestamp + user
- Audit trail retention for 1 year minimum
- Admin access logs for compliance
- GDPR-compliant data handling (future consideration)
 
---
 
### NFR-3: Scalability & Load Balancing
 
**NFR-3.1: Load Balancing**
- Nginx load balancer for distributing traffic across backend instances
- Round-robin or least-connections algorithm
- Health checks for backend instances (every 10 seconds)
- Automatic failover to healthy instances
- Session affinity for WebSocket connections
- Support for horizontal scaling (2-4 backend instances initially)
 
**NFR-3.2: Horizontal Scaling**
- Stateless API design for easy horizontal scaling
- Database connection pooling
- Docker containers enable VPS scaling
- Redis for distributed session management (if multi-instance)
 
**NFR-3.3: Data Growth**
- System handles 1000+ events in first year
- Database optimization for historical data queries
- Archival strategy for completed events (>1 year old)
 
**NFR-3.3: Future-Proofing**
- Microservice migration path available
- API versioning strategy
- Database migration support
 
---
 
### NFR-4: Reliability & Availability
 
**NFR-4.1: Uptime**
- Target: 99.5% availability
- Planned maintenance windows communicated 48 hours ahead
- Blue-green deployment to minimize downtime
 
**NFR-4.2: Data Integrity**
- Daily automated database backups
- Backup retention: 30 days
- Point-in-time recovery capability
- Referential integrity enforced at database level
 
**NFR-4.3: Error Handling**
- Graceful degradation for non-critical features
- User-friendly error messages
- Automatic retry logic for transient failures
- Offline queue for mobile score inputs
 
---
 
### NFR-5: DevOps & Deployment
 
**NFR-5.1: CI/CD Pipeline**
- GitHub Actions for automated builds
- Automated testing on every commit
- Blue-green deployment strategy for zero-downtime releases
 
**NFR-5.2: Environments**
- **Dev:** Feature development and testing
- **Prod:** Live production environment
- **Staging:** Future environment for pre-production validation
 
**NFR-5.3: Monitoring & Observability**
- **Metrics Collection:** Prometheus for metrics scraping
  - API response times, request rates, error rates
  - Database connection pool stats
  - WebSocket connection counts
  - Business metrics (events created, scores submitted, etc.)
- **Visualization:** Grafana dashboards for real-time monitoring
  - System health overview dashboard
  - API performance dashboard
  - Real-time competition activity dashboard
  - Infrastructure resource utilization
- **Logging:** Centralized logging with Loki + Promtail
  - Structured JSON logging from all services
  - Log aggregation from all Docker containers
  - Queryable logs with LogQL
  - Log retention: 30 days (configurable)
- **Distributed Tracing:** (Optional for MVP, recommended for production)
  - Request tracing across services
  - Performance bottleneck identification
- **Alerting:**
  - Prometheus AlertManager for critical alerts
  - Notifications via email/Slack for:
    - API error rate > 5%
    - Response time > 1 second (95th percentile)
    - Database connection pool exhaustion
    - Disk space < 20%
    - SSL certificate expiration < 30 days
 
**NFR-5.4: Docker & Containerization**
- Frontend and backend as separate Docker images
- Docker Compose for local development
- Production deployment via Docker on VPS
- Environment-specific configuration via env files
 
---
 
### NFR-6: Usability & Accessibility
 
**NFR-6.1: Mobile Usability**
- Minimum touch target size: 44x44px
- One-handed operation where possible
- Minimal text input required
- Auto-focus and smart defaults
 
**NFR-6.2: Accessibility**
- WCAG 2.1 Level AA compliance (future goal)
- Semantic HTML structure
- Keyboard navigation support
- Screen reader compatibility (basic)
 
**NFR-6.3: Internationalization (Future)**
- English as primary language (MVP)
- i18n framework ready for multi-language support
- UTC timezone with local display conversion
 
---
 
## Technical Architecture Overview
 
### System Infrastructure Diagram
 
```
                                    Internet
                                       ↓
                            [Let's Encrypt SSL/TLS]
                                       ↓
┌────────────────────────────────────────────────────────────────┐
│                      VPS Server (Docker Host)                   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Nginx Reverse Proxy + Load Balancer          │  │
│  │  - SSL/TLS Termination (HTTPS)                            │  │
│  │  - API Gateway                                             │  │
│  │  - Rate Limiting & WAF                                     │  │
│  │  - Load Balancing (Round Robin)                            │  │
│  └───┬──────────────────────────────────────────────────┬────┘  │
│      │                                                   │       │
│  ┌───▼────────────────┐                      ┌──────────▼────┐  │
│  │   Frontend         │                      │   Backend API  │  │
│  │   (Vue 3)          │                      │  (ASP.NET 9)   │  │
│  │   Port: 8080       │                      │   Port: 5000   │  │
│  │   (Docker)         │                      │   (Docker x2+) │  │
│  └────────────────────┘                      └────────┬───────┘  │
│                                                       │          │
│                                              ┌────────▼────────┐ │
│                                              │   PostgreSQL    │ │
│                                              │   Port: 5432    │ │
│                                              │   (Docker)      │ │
│                                              └─────────────────┘ │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Observability Stack                          │  │
│  │  ┌─────────────┐  ┌──────────┐  ┌─────────┐             │  │
│  │  │ Prometheus  │  │ Grafana  │  │  Loki   │             │  │
│  │  │  (Metrics)  │→ │ (Dashbrd)│← │ (Logs)  │             │  │
│  │  │  :9090      │  │  :3000   │  │  :3100  │             │  │
│  │  └──────▲──────┘  └──────────┘  └────▲────┘             │  │
│  │         │                              │                  │  │
│  │  ┌──────┴──────────────────────────────┴────┐            │  │
│  │  │           Promtail (Log Collector)       │            │  │
│  │  └──────────────────────────────────────────┘            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```
 
### Repository Structure
 
**Frontend Repository** (GitHub)
```
archery-frontend/
├── src/
│   ├── components/
│   ├── views/
│   ├── router/
│   ├── store/
│   └── services/
├── Dockerfile
├── docker-compose.yml
├── .github/workflows/
│   ├── dev-deploy.yml
│   └── prod-deploy.yml
└── README.md
```
 
**Backend Repository** (GitHub)
```
archery-backend/
├── src/
│   ├── API/
│   ├── Core/
│   ├── Infrastructure/
│   └── Tests/
├── Dockerfile
├── docker-compose.yml
├── deployment/
│   ├── dev/
│   ├── prod/
│   └── scripts/
├── .github/workflows/
│   ├── dev-deploy.yml
│   └── prod-deploy.yml
└── README.md
```
 
### Infrastructure Components
 
**1. Nginx Reverse Proxy & Load Balancer**
- **Purpose:** SSL termination, request routing, load balancing, security gateway
- **Configuration:**
  - SSL/TLS certificates from Let's Encrypt (auto-renewal)
  - HTTP to HTTPS redirect (force secure connections)
  - Static file serving for frontend (cached)
  - WebSocket upgrade support for SignalR
  - Load balancing across multiple backend instances
  - Health check endpoints (`/health`)
  - Request/response buffering
- **Security Features:**
  - Rate limiting rules (configured per endpoint)
  - Request size limits (max 10MB)
  - IP-based access control
  - Basic WAF rules (XSS, SQL injection patterns)
  - Header security (HSTS, X-Frame-Options, CSP)
  - Hide server version information
 
**2. API Gateway (Nginx + Custom Middleware)**
- **Purpose:** Centralized API management and security
- **Features:**
  - Request validation and sanitization
  - API versioning support (`/api/v1/...`)
  - Request logging for audit
  - Response caching for read-heavy endpoints
  - CORS policy enforcement
  - JWT token validation at gateway level (optional)
 
**3. Observability Stack (Prometheus + Grafana + Loki + Promtail)**
 
**Prometheus (Metrics):**
- Metrics scraping from:
  - ASP.NET Core application metrics (via prometheus-net)
  - Nginx metrics (via nginx-prometheus-exporter)
  - PostgreSQL metrics (via postgres_exporter)
  - Node/system metrics (via node_exporter)
- Default scrape interval: 15 seconds
- Retention: 30 days
- Alert rules for critical thresholds
 
**Grafana (Visualization):**
- Pre-configured dashboards:
  - System Overview (CPU, memory, disk, network)
  - API Performance (request rate, latency, errors)
  - Database Performance (connections, queries, cache hits)
  - Business Metrics (events, users, scores)
  - Real-Time Competition Activity
- User authentication (admin access only)
- Alerting integration (email/Slack)
 
**Loki + Promtail (Logging):**
- Promtail collects logs from all Docker containers
- Structured JSON logging from ASP.NET Core
- Log levels: DEBUG, INFO, WARN, ERROR
- Queryable via LogQL in Grafana
- Log retention: 30 days (configurable)
- Log categories:
  - Application logs
  - Access logs (Nginx)
  - Database logs
  - Security events (failed auth, rate limits)
 
**4. Docker Compose Architecture**
- Multi-container setup with service dependencies
- Named volumes for persistent data
- Bridge network for inter-container communication
- Environment-specific configuration (`.env` files)
- Resource limits per container (CPU, memory)
- Automatic container restart policies
 
**5. Security Best Practices**
 
**SSL/TLS:**
- TLS 1.3 preferred, TLS 1.2 minimum
- Strong cipher suites only
- HSTS enabled (max-age: 31536000)
- Certificate pinning (optional for future)
 
**Rate Limiting Strategy:**
- **Auth endpoints:** 5 requests/minute per IP
- **API endpoints:** 100 requests/minute per authenticated user
- **Score submissions:** 30 requests/minute per athlete
- **Public endpoints:** 60 requests/minute per IP
- 429 (Too Many Requests) response with Retry-After header
 
**Firewall Rules (VPS Level):**
- Allow: 80 (HTTP - redirect to HTTPS), 443 (HTTPS), 22 (SSH - admin only)
- Block: All other inbound traffic
- Allow outbound: 443, 80, 53 (DNS), NTP
- Fail2ban for SSH brute-force protection
 
**Additional Security Measures:**
- Regular security updates (automated with unattended-upgrades)
- Minimal container images (Alpine Linux base)
- Non-root user in Docker containers
- Secrets management (Docker secrets or environment variables)
- Database access restricted to backend containers only
- No direct internet access to database
 
---
 
### Deployment Infrastructure
 
**Backend Repository** (GitHub)
 
**Dev Environment:**
- Triggered by push to `develop` branch
- Automated build and deploy via GitHub Actions
- Accessible at dev.archery-events.com (example)
 
**Prod Environment:**
- Triggered by push to `main` branch (or manual approval)
- Blue-green deployment for zero downtime
- Accessible at archery-events.com (example)
 
**Blue-Green Process:**
1. Deploy new version to "green" environment
2. Run smoke tests
3. Switch traffic from "blue" to "green"
4. Keep "blue" as rollback option for 24 hours
 
---
 
## User Experience Principles
 
### Design Philosophy
 
**1. Mobile-First, Always**
- Every feature designed for thumb-reach
- Minimal scrolling for critical actions
- Fast, decisive interactions
 
**2. Real-Time Feel**
- Updates appear instantly
- No "refresh" buttons needed
- Optimistic UI updates with rollback on error
 
**3. Clear Visual Hierarchy**
- Most important info largest and first
- Live scores prominently displayed
- Status indicators always visible
 
**4. Competition Atmosphere**
- Professional sports aesthetic
- Excitement through motion and updates
- Clear winners and progression
 
### Key Interactions
 
**Score Input (Athlete Mobile):**
1. Open event → My Matches
2. Tap "Enter Score"
3. Input arrow scores (6 arrows)
4. Submit → Instant feedback + leaderboard update
 
**Live Leaderboard (Spectator Desktop):**
1. Navigate to event → Leaderboard
2. Automatic updates (no interaction needed)
3. Visual highlight when ranks change
4. Full-screen mode available
 
**Bracket Management (Host):**
1. View qualification results
2. Select "Create Elimination Bracket"
3. Confirm top 16 athletes
4. System generates bracket
5. Monitor matches in real-time
 
---
 
## Implementation Planning
 
### Development Phases
 
**Phase 1: Foundation** (Weeks 1-2)
- Setup repositories (frontend + backend)
- Docker configuration
- Basic authentication system
- Database schema design
- CI/CD pipeline configuration
 
**Phase 2: Core Features** (Weeks 3-6)
- Event management (CRUD)
- User registration and role management
- Game configuration
- Participant management
 
**Phase 3: Scoring System** (Weeks 7-10)
- Qualification round scoring
- Real-time updates (WebSocket/SignalR)
- Live leaderboard
- Score locking mechanism
 
**Phase 4: Tournament Brackets** (Weeks 11-14)
- Elimination bracket generation
- Set-based scoring
- Shoot-off resolution
- Match progression
 
**Phase 5: Polish & Deploy** (Weeks 15-16)
- Mobile UI optimization
- Performance testing
- Blue-green deployment setup
- Production launch
 
### Epic Breakdown Required
 
Due to GitHub Copilot's context window limitations, the detailed epic and user story breakdown should be created as a separate document.
 
**Next Step:** Run the workflow to create epics and stories breakdown.
 
---
 
## Monetization Strategy (Future)
 
### Revenue Model Options
 
**Option 1: Freemium**
- Free tier: 2 events per month, up to 50 participants
- Premium: $19/month - unlimited events, advanced features
- Enterprise: Custom pricing for federations
 
**Option 2: Transaction-Based**
- Free event creation
- Small fee per athlete registration ($0.50-$1.00)
- Host pays or passes to athletes
 
**Option 3: Advertising**
- Free platform with non-intrusive ads
- Premium removes ads
 
**Recommendation:** Start with freemium model, 3-6 months post-launch
 
---
 
## Risks & Mitigations
 
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|-----------|
| Real-time updates fail at scale | High | Medium | Load testing, graceful polling fallback |
| Mobile data usage too high | Medium | Low | Optimize payloads, implement compression |
| Complex bracket logic bugs | High | Medium | Comprehensive testing, phased rollout |
| VPS costs exceed budget | Medium | Medium | Monitor usage, optimize queries, consider CDN |
| Low initial adoption | Medium | Medium | Beta test with local clubs, gather feedback early |
| Score tampering/cheating | High | Low | Strong audit trails, referee override capability |
 
---
 
## Next Steps
 
### Immediate Actions
 
1. **✅ PRD Complete** - This document
2. **Create Epic & Story Breakdown** - Decompose into implementable chunks
3. **UX/UI Design** - Wireframes and mockups (especially mobile screens)
4. **Architecture Document** - Technical design document
5. **Repository Setup** - Initialize GitHub repos
6. **Start Frontend Development** - Begin with mock data as requested
 
### Workflow Progression
 
```
Current: PRD Creation ✅
Next: Epic & Story Breakdown
Then: UX Design (optional but recommended)
Then: Architecture Design
Then: Implementation (Frontend First with mocks)
```
 
---
 
## References
 
- **Project Inception:** Analyst workflow session (November 4-6, 2025)
- **User Requirements:** Captured through collaborative discovery
- **Technical Stack Decisions:** Based on user preferences and modern web standards
 
---
 
## Appendix A: Glossary
 
- **End:** A set of arrows shot before scoring (typically 6 arrows)
- **Qualification Round:** Initial scoring phase (72 arrows) to rank athletes
- **Elimination Round:** Bracket-based 1v1 matches to determine winners
- **Shoot-off:** Tie-breaker where closest to center wins
- **Set:** A scoring unit in elimination rounds (win=2pts, draw=1pt each)
- **Blue-Green Deployment:** Zero-downtime deployment by running two identical environments
 
---
 
_This PRD captures the essence of the Archery Event Management System - bringing professional sports management to the grassroots archery community through real-time technology and mobile-first design._
 
_Created through collaborative discovery between TruongPham and the BMad Method PM Agent._
 
---
 
**Document Status:** ✅ Complete  
**Ready for:** Epic Breakdown & Architecture Design
 