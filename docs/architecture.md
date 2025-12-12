# System Architecture - Archery Event Management System
 
**Project:** Archery Event Management System  
**Author:** TruongPham  
**Date:** November 6, 2025  
**Version:** 1.2  
**Last Updated:** November 30, 2025
 
---
 
## ⚠️ IMPORTANT: Requirements Update
 
**This document has been updated to reflect new client requirements captured in:**
 
📄 **[requirements-clarifications.md](./requirements-clarifications.md)** (Created: Nov 29, 2025)
 
Key updates in this architecture document:
- ✅ **Authentication**: Google SSO + Facebook SSO, persistent login (30-90 days)
- ✅ **Database Schema**: Added tables for Rounds, RoundPhases, Competitions, EquipmentApprovals, TargetAssignments, CompetitionStatusHistory
- ✅ **Competition Structure**: Event → Competition (Bow Type + Category + Round + Subround)
- ✅ **Multi-Role Rules**: Host+Athlete allowed, Referee+Athlete not allowed
- ✅ **Competition Status**: Active/Inactive/Closed lifecycle management
- ✅ **Equipment Check**: Optional per-bow-type approval system
- ✅ **Target Assignment**: Team-aware algorithm (frontend logic)
- ✅ **Timing System Integration**: Read-only API for external timing systems (Phase 2)
- ✅ **Distributed Tracing**: Grafana Tempo for request tracing and performance analysis
 
**For complete requirement details, see [requirements-clarifications.md](./requirements-clarifications.md)**
 
---
 
## Table of Contents
 
1. [Executive Summary](#executive-summary)
2. [System Overview](#system-overview)
3. [Architecture Principles](#architecture-principles)
4. [System Architecture](#system-architecture)
5. [Database Design](#database-design)
6. [API Architecture](#api-architecture)
7. [Notification Service Architecture](#notification-service-architecture)
8. [Real-Time Communication](#real-time-communication)
9. [Security Architecture](#security-architecture)
10. [Infrastructure Architecture](#infrastructure-architecture)
11. [Deployment Architecture](#deployment-architecture)
12. [Monitoring & Observability](#monitoring--observability)
13. [Technology Stack](#technology-stack)
14. [Design Decisions](#design-decisions)
 
---
 
## Executive Summary
 
This document defines the technical architecture for the **Archery Event Management System**, a production-grade SaaS platform enabling real-time archery competition management. The architecture emphasizes:
 
- **Real-time Performance:** Sub-2-second score propagation across all clients
- **Security:** Multi-layered security with SSL/TLS, WAF, and rate limiting
- **Scalability:** Load-balanced architecture supporting 100+ concurrent events
- **Observability:** Complete system monitoring with Prometheus, Grafana, Loki, and Tempo
- **Reliability:** 99.5% uptime with blue-green deployment strategy
 
### Key Architectural Characteristics
 
| Characteristic | Approach | Rationale |
|---------------|----------|-----------|
| **Architecture Style** | Monolithic (Multi-Repo) | Simplified deployment, suitable for MVP scale |
| **Frontend Strategy** | SPA (Single Page Application) | Mobile-first, responsive, real-time updates |
| **Backend Pattern** | RESTful API + WebSockets | Standard REST for CRUD, WebSockets for real-time |
| **Database** | PostgreSQL (Relational) | ACID compliance, complex relationships |
| **Caching** | In-memory + Redis (future) | Performance optimization |
| **Deployment** | Docker + Nginx + Blue-Green | Zero-downtime, production-grade |
 
---
 
## System Overview
 
### High-Level Architecture Diagram
 
```
┌─────────────────────────────────────────────────────────────────────────┐
│                              Internet                                    │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             │ HTTPS (443)
                             │ Let's Encrypt SSL/TLS
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         VPS SERVER (Docker Host)                         │
│                                                                           │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │              Nginx Reverse Proxy & Load Balancer                   │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐ │ │
│  │  │ SSL          │  │ API Gateway  │  │ WAF + Rate Limiting      │ │ │
│  │  │ Termination  │  │              │  │                          │ │ │
│  │  └──────────────┘  └──────────────┘  └──────────────────────────┘ │ │
│  └────────────┬───────────────────────────────────┬───────────────────┘ │
│               │                                   │                     │
│               │ Static Files                      │ API Requests        │
│               ▼                                   ▼                     │
│  ┌────────────────────────┐        ┌─────────────────────────────────┐ │
│  │   Frontend Container   │        │   Backend API Containers        │ │
│  │                        │        │   (Load Balanced x2+)           │ │
│  │   Vue 3 + Vuetify     │        │                                 │ │
│  │   Nginx (Static)      │        │   ┌─────────────────────────┐   │ │
│  │   Port: 8080          │        │   │  ASP.NET Core 9 API     │   │ │
│  │                        │        │   │  - REST Endpoints       │   │ │
│  │                        │◄───────┼───│  - SignalR Hubs         │   │ │
│  │                        │  WS    │   │  - Business Logic       │   │ │
│  │                        │        │   │  Port: 5000             │   │ │
│  └────────────────────────┘        │   └────────┬────────────────┘   │ │
│                                    │            │                    │ │
│                                    │   ┌────────▼────────────────┐   │ │
│                                    │   │  ASP.NET Core 9 API     │   │ │
│                                    │   │  (Instance 2)           │   │ │
│                                    │   │  Port: 5001             │   │ │
│                                    │   └────────┬────────────────┘   │ │
│                                    └────────────┼────────────────────┘ │
│                                                 │                      │
│                                                 │ PostgreSQL Client    │
│                                                 ▼                      │
│                              ┌──────────────────────────────────────┐  │
│                              │      PostgreSQL Database             │  │
│                              │      - Users, Events, Scores         │  │
│                              │      - Persistent Volume              │  │
│                              │      Port: 5432 (internal only)      │  │
│                              └──────────────────────────────────────┘  │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                   Observability Stack                              │ │
│  │                                                                     │ │
│  │  ┌──────────────┐   ┌──────────────┐   ┌──────────────────────┐  │ │
│  │  │ Prometheus   │   │  Grafana     │   │  Loki + Promtail     │  │ │
│  │  │              │──▶│              │◀──│                      │  │ │
│  │  │ Metrics      │   │  Dashboards  │   │  Logs                │  │ │
│  │  │ :9090        │   │  :3000       │   │  :3100               │  │ │
│  │  └──────▲───────┘   └───────┬──────┘   └───────▲──────────────┘  │ │
│  │         │                    │                  │                 │ │
│  │         │                    │   ┌──────────────▼──────────────┐  │ │
│  │         │                    └──▶│  Grafana Tempo              │  │ │
│  │         │                        │  Distributed Tracing        │  │ │
│  │         │                        │  :3200 (OTLP), :4317 (gRPC)│  │ │
│  │         │                        └──────────▲──────────────────┘  │ │
│  │         │                                   │                     │ │
│  │         └───────────────┬───────────────────┘                     │ │
│  │                         │                                         │ │
│  │                Scrape/Collect/Trace                               │ │
│  │         ┌───────────────┴───────────────┐                         │ │
│  │         │                               │                         │ │
│  │    All Services                    Docker Logs                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```
 
### Component Interaction Flow
 
**User Request Flow:**
1. User accesses via HTTPS (browser/mobile)
2. Nginx terminates SSL, applies WAF rules and rate limits
3. Static files served directly by Nginx
4. API requests load-balanced to backend instances
5. Backend queries PostgreSQL
6. Response returned through Nginx to client
7. Metrics/logs/traces collected by observability stack
 
**Real-Time Score Update Flow:**
1. Athlete submits score via mobile app
2. POST request to `/api/scores` endpoint
3. Backend validates, saves to PostgreSQL
4. SignalR hub broadcasts to all connected clients
5. All spectators/referees see update within 2 seconds
6. Event logged, metrics recorded, trace spans captured
 
---
 
## Architecture Principles
 
### 1. Security First
- All traffic encrypted (HTTPS only)
- Defense in depth (WAF, rate limiting, input validation)
- Least privilege access (RBAC enforced at every layer)
- Audit everything (comprehensive logging)
 
### 2. Performance & Scalability
- Stateless backend (horizontal scaling ready)
- Database connection pooling
- Efficient WebSocket management
- Load balancing for distribution
 
### 3. Observability
- Metrics for everything (business + technical)
- Centralized logging
- Distributed tracing for request flows
- Real-time alerting
- Performance monitoring
 
### 4. Reliability
- High availability design (99.5% uptime target)
- Graceful degradation
- Automated health checks
- Blue-green deployments
 
### 5. Developer Experience
- Clear separation of concerns
- RESTful API design
- Comprehensive documentation
- Local development with Docker Compose
 
---
 
## System Architecture
 
### Layered Architecture
 
```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│  Vue 3 Components, Vuetify UI, State Management (Pinia)     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP/HTTPS + WebSocket
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                       │
│  Nginx (Routing, SSL, Rate Limiting, Load Balancing)       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  ┌──────────────────┐  ┌─────────────────────────────────┐ │
│  │  API Controllers │  │  SignalR Hubs                   │ │
│  │  - Auth          │  │  - Score Broadcasts             │ │
│  │  - Events        │  │  - Leaderboard Updates          │ │
│  │  - Scores        │  │  - Bracket Updates              │ │
│  └────────┬─────────┘  └─────────────┬───────────────────┘ │
│           │                           │                     │
│           └───────────┬───────────────┘                     │
│                       ▼                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           Business Logic Layer                       │   │
│  │  - Event Management Service                          │   │
│  │  - Score Management Service                          │   │
│  │  - Tournament Bracket Service                        │   │
│  │  - User Management Service                           │   │
│  │  - Authorization Service                             │   │
│  └────────────────────────┬────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Access Layer                       │
│  Entity Framework Core, Repository Pattern, Unit of Work    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                     Database Layer                           │
│  PostgreSQL - Relational Data Store                         │
└─────────────────────────────────────────────────────────────┘
```
 
### Cross-Cutting Concerns
 
- **Authentication/Authorization:** JWT tokens, role-based access control
- **Logging:** Structured logging to Loki
- **Metrics:** Prometheus metrics collection
- **Tracing:** Distributed tracing with Grafana Tempo and OpenTelemetry
- **Error Handling:** Global exception handling, user-friendly messages
- **Validation:** Input validation at API and business logic layers
- **Caching:** Response caching for read-heavy endpoints (future)
 
---
 
## Database Design
 
### Entity Relationship Diagram
 
```
┌─────────────────┐         ┌─────────────────────┐
│     Users       │         │      Events         │
├─────────────────┤         ├─────────────────────┤
│ Id (PK)         │         │ Id (PK)             │
│ Email           │◄────────┤ HostUserId (FK)     │
│ PasswordHash    │  1    * │ Name                │
│ FirstName       │         │ Description         │
│ LastName        │         │ Location            │
│ Role            │         │ StartDate           │
│ CreatedAt       │         │ EndDate             │
│ UpdatedAt       │         │ RegistrationDeadline│
└─────────────────┘         │ Status              │
        │                   │ IsPublic            │
        │                   │ CreatedAt           │
        │                   │ UpdatedAt           │
        │                   └──────────┬──────────┘
        │                              │
        │                              │ 1
        │                              │
        │                              │ *
        │                   ┌──────────▼──────────┐
        │                   │       Games         │
        │                   ├─────────────────────┤
        │                   │ Id (PK)             │
        │                   │ EventId (FK)        │
        │                   │ Name                │
        │                   │ GameType            │
        │                   │ Distance            │
        │                   │ ArrowCount          │
        │                   │ Status              │
        │                   │ CreatedAt           │
        │                   └──────────┬──────────┘
        │                              │
        │                              │ 1
        │                              │
        │         ┌────────────────────┼──────────────────────┐
        │         │                    │                      │
        │         │ *                  │ *                    │ *
        │  ┌──────▼──────────┐  ┌──────▼──────────┐  ┌───────▼────────────┐
        │  │ AthleteGames    │  │  RefereeEvents  │  │ QualificationScores│
        │  ├─────────────────┤  ├─────────────────┤  ├────────────────────┤
        └─▶│ UserId (FK, PK) │  │ UserId (FK, PK) │  │ Id (PK)            │
      *    │ GameId (FK, PK) │  │ EventId (FK,PK) │  │ AthleteGameId (FK) │
           │ RegistrationDate│  │ Status          │  │ EndNumber          │
           │ IsApproved      │  │ ApprovedAt      │  │ Scores             │
           └──────┬──────────┘  │ ApprovedBy (FK) │  │ TotalScore         │
                  │             └─────────────────┘  │ IsLocked           │
                  │                                  │ CreatedBy (FK)     │
                  │ 1                                │ UpdatedBy (FK)     │
                  │                                  │ CreatedAt          │
                  │ *                                │ UpdatedAt          │
                  │                                  └────────────────────┘
       ┌──────────▼────────────┐
       │  EliminationBrackets  │
       ├───────────────────────┤
       │ Id (PK)               │
       │ GameId (FK)           │
       │ Round                 │
       │ MatchNumber           │
       │ Athlete1Id (FK)       │
       │ Athlete2Id (FK)       │
       │ Athlete1Score         │
       │ Athlete2Score         │
       │ WinnerId (FK)         │
       │ IsShootOff            │
       │ ShootOffWinnerId (FK) │
       │ Status                │
       │ CreatedAt             │
       │ UpdatedAt             │
       └───────────────────────┘
```
 
### Core Tables
 
**Users**
- Primary authentication and profile information
- Stores role (Admin, Host, Referee, Athlete)
- Indexes: Email (unique), Role
 
**Events**
- Competition events created by hosts
- One-to-many with Games
- Indexes: HostUserId, Status, StartDate
 
**Games** _(Renamed to "Competitions" in requirements-clarifications.md)_
- Individual competitions within an event
- Uniquely identified by: Bow Type + Category + Round + Subround
- Examples: "Recurve - Men's Individual - WA 1440 (90m)", "Barebow - Women's Team - Custom Local 50m"
- Belongs to one Event
- Supports Active/Inactive/Closed status for lifecycle management
- Indexes: EventId, Status
 
**AthleteGames**
- Many-to-many junction table
- Links athletes to games they've registered for
- Indexes: UserId, GameId, (UserId + GameId composite unique)
 
**RefereeEvents**
- Many-to-many junction table with approval status
- Links referees to events
- Indexes: UserId, EventId, Status
 
**QualificationScores**
- Stores scores for qualification rounds
- JSON field for individual arrow scores per end
- Indexes: AthleteGameId, IsLocked
 
**EliminationBrackets**
- Stores tournament bracket matches
- Tracks wins, losses, and shoot-off results
- Indexes: GameId, Round, MatchNumber
 
### Database Schema (PostgreSQL DDL)
 
```sql
-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Admin', 'Host', 'Referee', 'Athlete')),
    profile_photo_url VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
 
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
 
-- Events Table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    host_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    registration_deadline TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Draft', 'OpenForRegistration', 'InProgress', 'Completed', 'Cancelled')),
    is_public BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
 
CREATE INDEX idx_events_host ON events(host_user_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_start_date ON events(start_date);
 
-- Games Table
CREATE TABLE games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    game_type VARCHAR(100) NOT NULL, -- 'MenIndividual', 'WomenIndividual', 'MenTeam', 'WomenTeam'
    distance INT NOT NULL, -- in meters: 30, 50, 70, etc.
    arrow_count INT NOT NULL DEFAULT 72,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Registration', 'Qualification', 'Elimination', 'Completed')),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
 
CREATE INDEX idx_games_event ON games(event_id);
CREATE INDEX idx_games_status ON games(status);
 
-- AthleteGames (Junction Table)
CREATE TABLE athlete_games (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    registration_date TIMESTAMP NOT NULL DEFAULT NOW(),
    is_approved BOOLEAN NOT NULL DEFAULT true,
    PRIMARY KEY (user_id, game_id)
);
 
CREATE INDEX idx_athlete_games_user ON athlete_games(user_id);
CREATE INDEX idx_athlete_games_game ON athlete_games(game_id);
 
-- RefereeEvents (Junction Table)
CREATE TABLE referee_events (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    approved_at TIMESTAMP,
    approved_by UUID REFERENCES users(id),
    PRIMARY KEY (user_id, event_id)
);
 
CREATE INDEX idx_referee_events_user ON referee_events(user_id);
CREATE INDEX idx_referee_events_event ON referee_events(event_id);
CREATE INDEX idx_referee_events_status ON referee_events(status);
 
-- QualificationScores Table
CREATE TABLE qualification_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    athlete_game_id UUID NOT NULL, -- Composite FK reference
    user_id UUID NOT NULL,
    game_id UUID NOT NULL,
    end_number INT NOT NULL, -- Which set of arrows (1-12 for 72 arrows)
    scores JSONB NOT NULL, -- Array of individual arrow scores [10, 9, 10, 10, 9, 10]
    end_total INT NOT NULL,
    cumulative_total INT NOT NULL,
    is_locked BOOLEAN NOT NULL DEFAULT false,
    created_by UUID NOT NULL REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id, game_id) REFERENCES athlete_games(user_id, game_id) ON DELETE CASCADE
);
 
CREATE INDEX idx_qual_scores_athlete_game ON qualification_scores(user_id, game_id);
CREATE INDEX idx_qual_scores_locked ON qualification_scores(is_locked);
 
-- EliminationBrackets Table
CREATE TABLE elimination_brackets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    round INT NOT NULL, -- 1=Round of 16, 2=Quarterfinals, 3=Semifinals, 4=Finals
    match_number INT NOT NULL,
    athlete1_id UUID REFERENCES users(id),
    athlete2_id UUID REFERENCES users(id),
    athlete1_sets_won INT NOT NULL DEFAULT 0,
    athlete2_sets_won INT NOT NULL DEFAULT 0,
    winner_id UUID REFERENCES users(id),
    is_shoot_off BOOLEAN NOT NULL DEFAULT false,
    shoot_off_winner_id UUID REFERENCES users(id),
    status VARCHAR(50) NOT NULL CHECK (status IN ('Pending', 'InProgress', 'Completed')),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
 
CREATE INDEX idx_elim_brackets_game ON elimination_brackets(game_id);
CREATE INDEX idx_elim_brackets_round ON elimination_brackets(round);
 
-- EliminationSets Table (Set-by-Set scoring)
CREATE TABLE elimination_sets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bracket_id UUID NOT NULL REFERENCES elimination_brackets(id) ON DELETE CASCADE,
    set_number INT NOT NULL,
    athlete1_score INT NOT NULL,
    athlete2_score INT NOT NULL,
    athlete1_points INT NOT NULL, -- 2 for win, 1 for draw, 0 for loss
    athlete2_points INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
 
CREATE INDEX idx_elim_sets_bracket ON elimination_sets(bracket_id);
 
-- AuditLogs Table (Score modifications tracking)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(100) NOT NULL, -- 'QualificationScore', 'EliminationSet', etc.
    entity_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    user_id UUID NOT NULL REFERENCES users(id),
    old_value JSONB,
    new_value JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
 
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
 
-- ===========================
-- NEW TABLES (Per requirements-clarifications.md)
-- ===========================
 
-- Rounds Table (Predefined + Custom Rounds)
CREATE TABLE rounds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL, -- 'WA 1440', 'WA 900', 'Custom Local 50m'
    target_face_type VARCHAR(100), -- 'Metric 10 Zone', 'Imperial', 'Vegas', etc.
    is_custom BOOLEAN DEFAULT false,
    created_by UUID REFERENCES users(id), -- For custom rounds
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
 
CREATE INDEX idx_rounds_custom ON rounds(is_custom);
CREATE INDEX idx_rounds_created_by ON rounds(created_by);
 
-- Round Phases Table (Multi-Phase Support)
CREATE TABLE round_phases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    round_id UUID NOT NULL REFERENCES rounds(id) ON DELETE CASCADE,
    phase_number INTEGER NOT NULL CHECK (phase_number BETWEEN 1 AND 4),
    distance DECIMAL(10,2) NOT NULL CHECK (distance > 0),
    distance_unit VARCHAR(10) NOT NULL CHECK (distance_unit IN ('Meter', 'Yards')),
    target_face_size VARCHAR(20) NOT NULL, -- '122cm', '80cm', '16 inches'
    arrows_per_end INTEGER NOT NULL CHECK (arrows_per_end BETWEEN 1 AND 6),
    number_of_ends INTEGER NOT NULL CHECK (number_of_ends BETWEEN 1 AND 50),
    total_arrows INTEGER GENERATED ALWAYS AS (arrows_per_end * number_of_ends) STORED,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
 
CREATE INDEX idx_round_phases_round ON round_phases(round_id);
CREATE INDEX idx_round_phases_phase_number ON round_phases(round_id, phase_number);
 
-- Competitions Table (Replacing "Games" terminology)
-- NOTE: Existing "games" table remains for backward compatibility
-- New implementation should use "competitions" table
CREATE TABLE competitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    bow_type VARCHAR(100) NOT NULL, -- 'Recurve', 'Compound', 'Barebow', 'Longbow', 'Traditional', Custom
    category VARCHAR(100) NOT NULL, -- 'Men_Individual', 'Women_Team', 'Mixed_Team', 'Men_Pair', 'Women_Pair'
    round_id UUID REFERENCES rounds(id), -- Predefined or custom round
    subround_name VARCHAR(255), -- 'WA 1440 (90m)', 'WA 900 (70m)', etc.
    status VARCHAR(50) NOT NULL CHECK (status IN ('Active', 'Inactive', 'Closed')) DEFAULT 'Inactive',
    equipment_check_required BOOLEAN DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
 
CREATE INDEX idx_competitions_event ON competitions(event_id);
CREATE INDEX idx_competitions_status ON competitions(status);
CREATE INDEX idx_competitions_bow_type ON competitions(bow_type);
CREATE INDEX idx_competitions_category ON competitions(category);
 
-- Equipment Approvals Table
CREATE TABLE equipment_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    athlete_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bow_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Pending', 'Approved', 'Rejected')) DEFAULT 'Pending',
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(event_id, athlete_id, bow_type)
);
 
CREATE INDEX idx_equipment_event ON equipment_approvals(event_id);
CREATE INDEX idx_equipment_athlete ON equipment_approvals(athlete_id);
CREATE INDEX idx_equipment_status ON equipment_approvals(status);
 
-- Target Assignments Table
CREATE TABLE target_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
    athlete_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_number INTEGER NOT NULL,
    position VARCHAR(1) NOT NULL CHECK (position IN ('A', 'B', 'C', 'D')),
    assigned_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(competition_id, target_number, position)
);
 
CREATE INDEX idx_target_assignments_competition ON target_assignments(competition_id);
CREATE INDEX idx_target_assignments_athlete ON target_assignments(athlete_id);
CREATE INDEX idx_target_assignments_target ON target_assignments(competition_id, target_number);
 
-- Competition Status History Table (Audit trail for status changes)
CREATE TABLE competition_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by UUID NOT NULL REFERENCES users(id),
    reason TEXT,
    changed_at TIMESTAMP NOT NULL DEFAULT NOW()
);
 
CREATE INDEX idx_comp_status_history_comp ON competition_status_history(competition_id);
CREATE INDEX idx_comp_status_history_changed_at ON competition_status_history(changed_at);
```
 
---
 
## API Architecture
 
### RESTful API Design
 
**Base URL:** `https://api.archery-events.com/api/v1`
 
### API Endpoint Specification
 
#### Authentication Endpoints
 
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
```
 
**Example: Login**
```json
POST /api/v1/auth/login
Request:
{
  "email": "athlete@example.com",
  "password": "SecurePass123!"
}
 
Response: 200 OK
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "dGhpcyBpcyBhIHJlZnJl...",
  "expiresIn": 86400,
  "user": {
    "id": "uuid-here",
    "email": "athlete@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "Athlete"
  }
}
```
 
#### User Endpoints
 
```
GET    /api/v1/users/me
PUT    /api/v1/users/me
GET    /api/v1/users/{id}
POST   /api/v1/users/me/photo
```
 
#### Event Endpoints
 
```
GET    /api/v1/events                    # List all public events
GET    /api/v1/events/my                 # User's events (host/participant)
GET    /api/v1/events/{id}               # Get event details
POST   /api/v1/events                    # Create event (Host only)
PUT    /api/v1/events/{id}               # Update event (Host only)
DELETE /api/v1/events/{id}               # Delete event (Host only)
GET    /api/v1/events/{id}/participants  # List all participants
```
 
**Example: Create Event**
```json
POST /api/v1/events
Request:
{
  "name": "State Archery Championship 2025",
  "description": "Annual state championship competition",
  "location": "National Archery Center, City",
  "startDate": "2025-12-15T09:00:00Z",
  "endDate": "2025-12-15T18:00:00Z",
  "registrationDeadline": "2025-12-10T23:59:59Z",
  "isPublic": true
}
 
Response: 201 Created
{
  "id": "event-uuid",
  "hostUserId": "user-uuid",
  "name": "State Archery Championship 2025",
  "status": "Draft",
  "createdAt": "2025-11-06T10:00:00Z"
}
```
 
#### Game Endpoints
 
```
GET    /api/v1/events/{eventId}/games
POST   /api/v1/events/{eventId}/games
PUT    /api/v1/games/{id}
DELETE /api/v1/games/{id}
GET    /api/v1/games/{id}/leaderboard
```
 
#### Participation Endpoints
 
```
POST   /api/v1/events/{eventId}/register-athlete
POST   /api/v1/events/{eventId}/register-referee
GET    /api/v1/events/{eventId}/referees/pending
PUT    /api/v1/events/{eventId}/referees/{userId}/approve
PUT    /api/v1/events/{eventId}/referees/{userId}/reject
```
 
#### Qualification Score Endpoints
 
```
GET    /api/v1/games/{gameId}/scores
GET    /api/v1/games/{gameId}/scores/my
POST   /api/v1/games/{gameId}/scores
PUT    /api/v1/scores/{id}
POST   /api/v1/games/{gameId}/scores/lock
```
 
**Example: Submit Score**
```json
POST /api/v1/games/{gameId}/scores
Request:
{
  "endNumber": 1,
  "scores": [10, 9, 10, 10, 9, 10]
}
 
Response: 201 Created
{
  "id": "score-uuid",
  "endNumber": 1,
  "scores": [10, 9, 10, 10, 9, 10],
  "endTotal": 58,
  "cumulativeTotal": 58,
  "rank": 3,
  "createdAt": "2025-12-15T10:05:00Z"
}
```
 
#### Elimination Bracket Endpoints
 
```
POST   /api/v1/games/{gameId}/brackets/generate
GET    /api/v1/games/{gameId}/brackets
GET    /api/v1/brackets/{id}
POST   /api/v1/brackets/{id}/sets
PUT    /api/v1/brackets/{id}/shoot-off
```
 
### API Response Standards
 
**Success Response:**
```json
{
  "success": true,
  "data": { /* response data */ },
  "timestamp": "2025-11-06T10:00:00Z"
}
```
 
**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  },
  "timestamp": "2025-11-06T10:00:00Z"
}
```
 
**HTTP Status Codes:**
- `200 OK` - Successful GET, PUT, DELETE
- `201 Created` - Successful POST
- `400 Bad Request` - Validation errors
- `401 Unauthorized` - Missing/invalid authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error
 
---

## Notification Service Architecture

### Overview

The **Notification Service** provides timely competition reminders to athletes, leveraging a Facebook-style lightweight approach that minimizes database storage while ensuring reliable delivery across multiple channels (Push, Email, In-App).

**Key Objectives:**
- ✅ Notify athletes **24 hours** and **1 hour** before their registered competitions start
- ✅ Minimal database footprint (30-day retention, auto-cleanup)
- ✅ Multi-channel delivery (Push notifications, Email, In-app)
- ✅ User preference management (granular control)
- ✅ Scalable job queue system for high-volume events

### System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Notification Flow                               │
└─────────────────────────────────────────────────────────────────────┘

    ┌──────────────────┐        Every 5 minutes
    │  Cron Scheduler  │◄──────────────────────────────┐
    │  (Background)    │                                │
    └────────┬─────────┘                                │
             │                                          │
             │ Query competitions                        │
             │ starting in 24h/1h                       │
             ▼                                          │
    ┌──────────────────┐                                │
    │ Notification     │                                │
    │ Jobs Queue       │                                │
    └────────┬─────────┘                                │
             │                                          │
             │ Pending jobs                             │
             ▼                                          │
    ┌──────────────────┐                                │
    │  Job Processor   │                                │
    │  (Worker)        │                                │
    └────────┬─────────┘                                │
             │                                          │
             │ Get registered athletes                  │
             │ Check preferences                         │
             │                                          │
             ▼                                          │
    ┌──────────────────────────────────────────┐        │
    │        Multi-Channel Sender              │        │
    │  ┌────────────┬────────────┬──────────┐ │        │
    │  │ Push (FCM) │   Email    │  In-App  │ │        │
    │  └────────────┴────────────┴──────────┘ │        │
    └──────────────────┬───────────────────────┘        │
                       │                                │
                       │                                │
                       ▼                                │
          ┌─────────────────────────┐                  │
          │   Athlete Devices       │                  │
          │  📱 Mobile  💻 Web      │                  │
          └─────────────────────────┘                  │
                       │                                │
                       │ Read notification              │
                       ▼                                │
          ┌─────────────────────────┐                  │
          │  Mark as Read (API)     │                  │
          └─────────────────────────┘                  │
                                                        │
    ┌──────────────────┐                               │
    │  Daily Cleanup   │◄──────────────────────────────┘
    │  (2 AM Cron)     │   Delete expired (30 days+)
    └──────────────────┘   Keep last 50 read per user
```

### Database Schema

```sql
-- ========================================
-- NOTIFICATION TABLES
-- ========================================

-- Notifications Table (Recent notifications only - 30-day retention)
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'competition_reminder_24h', 'competition_reminder_1h'
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    data JSONB, -- {competitionId, eventId, competitionName, startTime}
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL, -- Auto-delete after 30 days
    INDEX idx_user_unread (user_id, is_read, created_at),
    INDEX idx_expires (expires_at)
);

CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read, created_at);
CREATE INDEX idx_notifications_expires ON notifications(expires_at);

-- Notification Preferences (User settings)
CREATE TABLE notification_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    enable_competition_reminders BOOLEAN DEFAULT TRUE,
    reminder_24h BOOLEAN DEFAULT TRUE,
    reminder_1h BOOLEAN DEFAULT TRUE,
    push_enabled BOOLEAN DEFAULT TRUE,
    email_enabled BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Push Notification Device Tokens
CREATE TABLE device_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL UNIQUE,
    device_type VARCHAR(20) NOT NULL CHECK (device_type IN ('ios', 'android', 'web')),
    created_at TIMESTAMP DEFAULT NOW(),
    last_used_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_device_tokens_user ON device_tokens(user_id);
CREATE INDEX idx_device_tokens_last_used ON device_tokens(last_used_at);

-- Notification Jobs Queue (Temporary processing queue)
CREATE TABLE notification_jobs (
    id BIGSERIAL PRIMARY KEY,
    competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL,
    scheduled_time TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    created_at TIMESTAMP DEFAULT NOW(),
    processed_at TIMESTAMP,
    error_message TEXT
);

CREATE INDEX idx_notification_jobs_schedule ON notification_jobs(scheduled_time, status);
CREATE INDEX idx_notification_jobs_competition ON notification_jobs(competition_id);
```

### Backend Service Components

#### 1. Notification Scheduler (Cron Job)

**Runs:** Every 5 minutes  
**Purpose:** Identify competitions requiring notifications and create jobs

```csharp
public class NotificationSchedulerService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<NotificationSchedulerService> _logger;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _serviceProvider.CreateScope();
                var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                var now = DateTime.UtcNow;
                var check24h = now.AddHours(24);
                var check1h = now.AddHours(1);
                var window = TimeSpan.FromMinutes(5); // 5-minute detection window

                // Find competitions starting in 24 hours (±5 min)
                var competitions24h = await dbContext.Competitions
                    .Where(c => c.StartTime >= check24h && 
                                c.StartTime <= check24h.Add(window) &&
                                c.Status == "Active")
                    .ToListAsync(stoppingToken);

                // Find competitions starting in 1 hour (±5 min)
                var competitions1h = await dbContext.Competitions
                    .Where(c => c.StartTime >= check1h && 
                                c.StartTime <= check1h.Add(window) &&
                                c.Status == "Active")
                    .ToListAsync(stoppingToken);

                // Create notification jobs
                foreach (var comp in competitions24h)
                {
                    await CreateNotificationJobIfNotExists(dbContext, comp, "competition_reminder_24h");
                }

                foreach (var comp in competitions1h)
                {
                    await CreateNotificationJobIfNotExists(dbContext, comp, "competition_reminder_1h");
                }

                await dbContext.SaveChangesAsync(stoppingToken);
                
                _logger.LogInformation(
                    "Notification Scheduler: Created {Count24h} (24h) + {Count1h} (1h) jobs",
                    competitions24h.Count, competitions1h.Count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in NotificationSchedulerService");
            }

            // Wait 5 minutes before next run
            await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
        }
    }

    private async Task CreateNotificationJobIfNotExists(
        AppDbContext dbContext, Competition competition, string notificationType)
    {
        // Check if job already exists
        var exists = await dbContext.NotificationJobs
            .AnyAsync(j => j.CompetitionId == competition.Id && 
                          j.NotificationType == notificationType &&
                          (j.Status == "pending" || j.Status == "completed"));

        if (exists) return;

        // Create new job
        dbContext.NotificationJobs.Add(new NotificationJob
        {
            CompetitionId = competition.Id,
            EventId = competition.EventId,
            NotificationType = notificationType,
            ScheduledTime = DateTime.UtcNow,
            Status = "pending"
        });
    }
}
```

#### 2. Notification Processor (Background Worker)

**Runs:** Continuously (processes pending jobs)  
**Purpose:** Execute notification jobs and send to athletes

```csharp
public class NotificationProcessorService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<NotificationProcessorService> _logger;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _serviceProvider.CreateScope();
                var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var notificationSender = scope.ServiceProvider.GetRequiredService<INotificationSender>();

                // Get pending jobs (batch of 100)
                var jobs = await dbContext.NotificationJobs
                    .Where(j => j.Status == "pending" && j.ScheduledTime <= DateTime.UtcNow)
                    .Take(100)
                    .ToListAsync(stoppingToken);

                foreach (var job in jobs)
                {
                    try
                    {
                        // Mark as processing
                        job.Status = "processing";
                        await dbContext.SaveChangesAsync(stoppingToken);

                        // Get registered athletes for this competition
                        var athletes = await dbContext.AthleteGames
                            .Where(ag => ag.GameId == job.CompetitionId && ag.IsApproved)
                            .Include(ag => ag.User)
                            .Select(ag => ag.User)
                            .ToListAsync(stoppingToken);

                        // Get competition details
                        var competition = await dbContext.Competitions
                            .Include(c => c.Event)
                            .FirstOrDefaultAsync(c => c.Id == job.CompetitionId, stoppingToken);

                        if (competition == null)
                        {
                            job.Status = "failed";
                            job.ErrorMessage = "Competition not found";
                            continue;
                        }

                        // Send notifications to each athlete
                        foreach (var athlete in athletes)
                        {
                            await notificationSender.SendCompetitionReminder(
                                athlete, competition, job.NotificationType, stoppingToken);
                        }

                        // Mark as completed
                        job.Status = "completed";
                        job.ProcessedAt = DateTime.UtcNow;

                        _logger.LogInformation(
                            "Processed notification job {JobId} for competition {CompetitionId}, sent to {AthleteCount} athletes",
                            job.Id, job.CompetitionId, athletes.Count);
                    }
                    catch (Exception ex)
                    {
                        job.Status = "failed";
                        job.ErrorMessage = ex.Message;
                        _logger.LogError(ex, "Failed to process notification job {JobId}", job.Id);
                    }
                    finally
                    {
                        await dbContext.SaveChangesAsync(stoppingToken);
                    }
                }

                // Wait 30 seconds before checking for more jobs
                await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in NotificationProcessorService");
                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            }
        }
    }
}
```

#### 3. Notification Sender (Multi-Channel)

**Purpose:** Send notifications via Push, Email, and In-App

```csharp
public interface INotificationSender
{
    Task SendCompetitionReminder(User athlete, Competition competition, 
        string notificationType, CancellationToken cancellationToken);
}

public class NotificationSender : INotificationSender
{
    private readonly AppDbContext _dbContext;
    private readonly IFirebaseMessaging _firebaseMessaging;
    private readonly IEmailService _emailService;
    private readonly ILogger<NotificationSender> _logger;

    public async Task SendCompetitionReminder(
        User athlete, Competition competition, string notificationType, 
        CancellationToken cancellationToken)
    {
        // Check user preferences
        var prefs = await _dbContext.NotificationPreferences
            .FirstOrDefaultAsync(p => p.UserId == athlete.Id, cancellationToken);

        if (prefs == null || !prefs.EnableCompetitionReminders)
            return;

        // Check specific reminder type
        if (notificationType.Contains("24h") && !prefs.Reminder24h) return;
        if (notificationType.Contains("1h") && !prefs.Reminder1h) return;

        var timeText = notificationType.Contains("24h") ? "24 hours" : "1 hour";
        
        var notification = new NotificationDto
        {
            Title = "Competition Starting Soon!",
            Message = $"Your {competition.BowType} {competition.Category} competition " +
                     $"\"{competition.SubroundName}\" starts in {timeText}",
            Data = new Dictionary<string, string>
            {
                ["competitionId"] = competition.Id.ToString(),
                ["eventId"] = competition.EventId.ToString(),
                ["competitionName"] = competition.SubroundName,
                ["startTime"] = competition.StartTime.ToString("o")
            }
        };

        // 1. Save to database (In-app notification)
        var notificationRecord = new Notification
        {
            UserId = athlete.Id,
            Type = notificationType,
            Title = notification.Title,
            Message = notification.Message,
            Data = JsonSerializer.Serialize(notification.Data),
            IsRead = false,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddDays(30) // Auto-expire in 30 days
        };

        _dbContext.Notifications.Add(notificationRecord);
        await _dbContext.SaveChangesAsync(cancellationToken);

        // 2. Send Push Notification (if enabled)
        if (prefs.PushEnabled)
        {
            var tokens = await _dbContext.DeviceTokens
                .Where(t => t.UserId == athlete.Id)
                .Select(t => t.Token)
                .ToListAsync(cancellationToken);

            foreach (var token in tokens)
            {
                try
                {
                    await _firebaseMessaging.SendAsync(new Message
                    {
                        Token = token,
                        Notification = new FirebaseAdmin.Messaging.Notification
                        {
                            Title = notification.Title,
                            Body = notification.Message
                        },
                        Data = notification.Data
                    }, cancellationToken);

                    // Update last_used_at
                    var deviceToken = await _dbContext.DeviceTokens
                        .FirstOrDefaultAsync(t => t.Token == token, cancellationToken);
                    if (deviceToken != null)
                    {
                        deviceToken.LastUsedAt = DateTime.UtcNow;
                    }
                }
                catch (FirebaseMessagingException ex)
                {
                    // Remove invalid tokens
                    if (ex.MessagingErrorCode == MessagingErrorCode.InvalidArgument ||
                        ex.MessagingErrorCode == MessagingErrorCode.Unregistered)
                    {
                        var invalidToken = await _dbContext.DeviceTokens
                            .FirstOrDefaultAsync(t => t.Token == token, cancellationToken);
                        if (invalidToken != null)
                        {
                            _dbContext.DeviceTokens.Remove(invalidToken);
                        }
                    }
                    _logger.LogWarning(ex, "Failed to send push notification to token");
                }
            }
        }

        // 3. Send Email (if enabled)
        if (prefs.EmailEnabled && !string.IsNullOrEmpty(athlete.Email))
        {
            await _emailService.SendCompetitionReminderEmail(
                athlete.Email, 
                notification, 
                competition, 
                cancellationToken);
        }

        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
```

#### 4. Data Cleanup Service (Daily Maintenance)

**Runs:** Daily at 2:00 AM  
**Purpose:** Remove expired notifications and old jobs

```csharp
public class NotificationCleanupService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<NotificationCleanupService> _logger;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                // Wait until 2:00 AM
                var now = DateTime.UtcNow;
                var next2AM = now.Date.AddDays(1).AddHours(2);
                if (now.Hour >= 2)
                    next2AM = now.Date.AddDays(1).AddHours(2);
                else
                    next2AM = now.Date.AddHours(2);

                var delay = next2AM - now;
                await Task.Delay(delay, stoppingToken);

                using var scope = _serviceProvider.CreateScope();
                var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                // 1. Delete expired notifications (older than 30 days)
                var deletedNotifications = await dbContext.Database.ExecuteSqlRawAsync(
                    "DELETE FROM notifications WHERE expires_at < NOW()", 
                    stoppingToken);

                // 2. Keep only last 50 read notifications per user
                await dbContext.Database.ExecuteSqlRawAsync(@"
                    DELETE FROM notifications
                    WHERE id NOT IN (
                        SELECT id FROM (
                            SELECT id, ROW_NUMBER() OVER (
                                PARTITION BY user_id 
                                ORDER BY created_at DESC
                            ) as rn
                            FROM notifications
                            WHERE is_read = TRUE
                        ) sub WHERE rn <= 50
                    ) AND is_read = TRUE", 
                    stoppingToken);

                // 3. Delete completed jobs older than 7 days
                var deletedJobs = await dbContext.Database.ExecuteSqlRawAsync(
                    "DELETE FROM notification_jobs WHERE status = 'completed' AND processed_at < NOW() - INTERVAL '7 days'",
                    stoppingToken);

                // 4. Delete inactive device tokens (not used in 90 days)
                var deletedTokens = await dbContext.Database.ExecuteSqlRawAsync(
                    "DELETE FROM device_tokens WHERE last_used_at < NOW() - INTERVAL '90 days'",
                    stoppingToken);

                _logger.LogInformation(
                    "Notification cleanup complete: {Notifications} notifications, {Jobs} jobs, {Tokens} tokens deleted",
                    deletedNotifications, deletedJobs, deletedTokens);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in NotificationCleanupService");
            }
        }
    }
}
```

### API Endpoints

#### Get User Notifications (Paginated)

```
GET /api/v1/notifications?page=1&limit=20
Authorization: Bearer {token}

Response: 200 OK
{
  "notifications": [
    {
      "id": "12345",
      "type": "competition_reminder_24h",
      "title": "Competition Starting Soon!",
      "message": "Your Recurve Men's Individual competition starts in 24 hours",
      "data": {
        "competitionId": "uuid",
        "eventId": "uuid",
        "competitionName": "WA 1440 (90m)",
        "startTime": "2025-12-15T09:00:00Z"
      },
      "isRead": false,
      "createdAt": "2025-12-14T09:00:00Z"
    }
  ],
  "unreadCount": 3,
  "hasMore": true
}
```

#### Mark Notification as Read

```
POST /api/v1/notifications/{id}/read
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true
}
```

#### Mark All Notifications as Read

```
POST /api/v1/notifications/read-all
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "count": 5
}
```

#### Update Notification Preferences

```
PUT /api/v1/notifications/preferences
Authorization: Bearer {token}

Request:
{
  "enableCompetitionReminders": true,
  "reminder24h": true,
  "reminder1h": true,
  "pushEnabled": true,
  "emailEnabled": false
}

Response: 200 OK
{
  "success": true
}
```

#### Register Device Token (Push Notifications)

```
POST /api/v1/notifications/device-token
Authorization: Bearer {token}

Request:
{
  "token": "fcm-token-here...",
  "deviceType": "android"
}

Response: 200 OK
{
  "success": true
}
```

### Real-Time Notification Delivery (Optional)

**WebSocket Integration:**  
Notifications can be delivered in real-time via SignalR for users actively online.

```csharp
public class NotificationHub : Hub
{
    public async Task JoinUserNotifications(string userId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"user:{userId}");
    }

    public async Task LeaveUserNotifications(string userId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user:{userId}");
    }
}

// When sending notification, also broadcast via WebSocket
public async Task BroadcastNotification(string userId, NotificationDto notification)
{
    await _hubContext.Clients.Group($"user:{userId}")
        .SendAsync("ReceiveNotification", notification);
}
```

### Key Features

| Feature | Implementation | Benefit |
|---------|---------------|---------|
| **Minimal Storage** | 30-day auto-expiry, keep last 50 read/user | Low database footprint |
| **Multi-Channel** | Push (FCM), Email, In-app | Reliable delivery |
| **User Control** | Granular preferences (24h, 1h, push, email) | User satisfaction |
| **Scalability** | Job queue + batch processing | Handles high volumes |
| **Reliability** | Retry logic, error tracking | Robust system |
| **Performance** | Indexed queries, caching | Fast response times |
| **Monitoring** | Job status tracking, failed job alerts | Operational visibility |

### Performance Considerations

- **Database Indexes:** Ensure fast queries on `user_id`, `created_at`, `is_read`, `expires_at`
- **Job Processing:** Use queue system (Redis/RabbitMQ) for high volume events
- **Caching:** Cache user preferences in Redis to reduce database load
- **Batch Processing:** Send notifications in batches of 100 to prevent overload
- **Rate Limiting:** Prevent notification spam (max 10 notifications/hour per user)

### Monitoring Metrics

```
Key Metrics:
- Notification delivery rate (%)
- Average processing time (seconds)
- Failed notification count
- User engagement rate (read/unread ratio)
- Database size over time (MB)
- Job queue depth
```

### Security Considerations

- ✅ Authenticate all API requests (JWT tokens)
- ✅ Encrypt device tokens at rest
- ✅ Validate notification data before sending (prevent XSS)
- ✅ Rate limit notification API calls (10 req/min per user)
- ✅ Sanitize notification content
- ✅ Secure Firebase Cloud Messaging credentials

### Implementation Roadmap

**Phase 1: Database Setup (Week 1)**
1. Create notification tables (notifications, notification_preferences, device_tokens, notification_jobs)
2. Add indexes for performance
3. Set up auto-cleanup triggers

**Phase 2: Backend Services (Week 2-3)**
1. Implement notification scheduler (cron job)
2. Implement notification processor (background worker)
3. Create notification sender with multi-channel support
4. Add cleanup service

**Phase 3: API Development (Week 3)**
1. Build REST APIs for fetching/managing notifications
2. Implement device token management
3. Add notification preferences endpoints

**Phase 4: Frontend Integration (Week 4)**
1. Create notification bell UI component
2. Implement notification list with pagination
3. Add notification preferences page
4. Integrate Firebase Cloud Messaging

**Phase 5: Testing & Monitoring (Week 5)**
1. Load testing for high-volume events
2. Set up monitoring for failed notifications
3. Analytics for notification engagement
4. End-to-end testing

---

## Notification Service: Architecture Decision Analysis

### Comparing Two Approaches

#### Approach 1: Hangfire + RabbitMQ + Quartz.NET (External Dependencies)

**Architecture:**
```
┌──────────────────────────────────────────────────────────────────┐
│                    Hangfire Dashboard                            │
│              (Web UI for job monitoring)                         │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│                   Hangfire Server                                │
│  - Persistent Job Storage (SQL Server/PostgreSQL)               │
│  - Job Retry Logic                                               │
│  - Automatic Failure Handling                                    │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│                      RabbitMQ                                    │
│  - Message Queue (AMQP Protocol)                                │
│  - Message Persistence                                           │
│  - Publish/Subscribe Pattern                                     │
│  - Dead Letter Queue                                             │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│               Consumer Workers (Multiple)                        │
│  - Scale horizontally                                            │
│  - Process notifications                                         │
│  - Send via FCM/Email                                            │
└──────────────────────────────────────────────────────────────────┘
```

**Key Components:**

1. **Hangfire** (Job Scheduler)
   - Web-based dashboard for monitoring
   - Persistent job storage
   - Automatic retry mechanism
   - Cron expression support
   - Job prioritization

2. **RabbitMQ** (Message Broker)
   - Decouples producer from consumer
   - Guarantees message delivery
   - Load balancing across consumers
   - Message persistence (survives restarts)
   - Dead letter queue for failed messages

3. **Quartz.NET** (Alternative Scheduler)
   - Enterprise-grade scheduling
   - Clustered scheduling support
   - Job chaining
   - Calendar-based scheduling

**Implementation Example:**

```csharp
// Install NuGet packages
// - Hangfire.Core
// - Hangfire.PostgreSql
// - RabbitMQ.Client
// - MassTransit (RabbitMQ abstraction)

// Program.cs - Configure Hangfire
builder.Services.AddHangfire(config => config
    .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
    .UseSimpleAssemblyNameTypeSerializer()
    .UseRecommendedSerializerSettings()
    .UsePostgreSqlStorage(builder.Configuration.GetConnectionString("HangfireConnection")));

builder.Services.AddHangfireServer();

// Program.cs - Configure RabbitMQ with MassTransit
builder.Services.AddMassTransit(x =>
{
    x.AddConsumer<NotificationConsumer>();
    
    x.UsingRabbitMq((context, cfg) =>
    {
        cfg.Host("localhost", "/", h =>
        {
            h.Username("guest");
            h.Password("guest");
        });
        
        cfg.ReceiveEndpoint("notification-queue", e =>
        {
            e.ConfigureConsumer<NotificationConsumer>(context);
            e.PrefetchCount = 100; // Process 100 messages at a time
            e.UseMessageRetry(r => r.Intervals(
                TimeSpan.FromSeconds(5),
                TimeSpan.FromSeconds(15),
                TimeSpan.FromSeconds(30)
            ));
        });
    });
});

// Schedule recurring job
RecurringJob.AddOrUpdate<NotificationSchedulerService>(
    "schedule-competition-reminders",
    service => service.ScheduleReminders(),
    "*/5 * * * *" // Every 5 minutes
);

// Notification Scheduler Service
public class NotificationSchedulerService
{
    private readonly IPublishEndpoint _publishEndpoint;
    private readonly AppDbContext _dbContext;
    
    public async Task ScheduleReminders()
    {
        var now = DateTime.UtcNow;
        var check24h = now.AddHours(24);
        var check1h = now.AddHours(1);
        
        var competitions = await _dbContext.Competitions
            .Where(c => (c.StartTime >= check24h && c.StartTime <= check24h.AddMinutes(5)) ||
                       (c.StartTime >= check1h && c.StartTime <= check1h.AddMinutes(5)))
            .ToListAsync();
        
        foreach (var competition in competitions)
        {
            var reminderType = competition.StartTime - now < TimeSpan.FromHours(2) 
                ? "1h" : "24h";
            
            // Publish to RabbitMQ
            await _publishEndpoint.Publish(new NotificationJob
            {
                CompetitionId = competition.Id,
                EventId = competition.EventId,
                NotificationType = $"competition_reminder_{reminderType}",
                ScheduledTime = DateTime.UtcNow
            });
        }
    }
}

// RabbitMQ Consumer
public class NotificationConsumer : IConsumer<NotificationJob>
{
    private readonly INotificationSender _notificationSender;
    private readonly AppDbContext _dbContext;
    
    public async Task Consume(ConsumeContext<NotificationJob> context)
    {
        var job = context.Message;
        
        // Get athletes
        var athletes = await _dbContext.AthleteGames
            .Where(ag => ag.GameId == job.CompetitionId)
            .Include(ag => ag.User)
            .Select(ag => ag.User)
            .ToListAsync();
        
        // Get competition
        var competition = await _dbContext.Competitions
            .FirstOrDefaultAsync(c => c.Id == job.CompetitionId);
        
        // Send to each athlete
        foreach (var athlete in athletes)
        {
            await _notificationSender.SendCompetitionReminder(
                athlete, competition, job.NotificationType, CancellationToken.None);
        }
    }
}
```

**Pros:**
- ✅ **Enterprise-grade reliability**: Battle-tested in production environments
- ✅ **Web dashboard**: Visual monitoring of jobs (Hangfire UI)
- ✅ **Automatic retries**: Built-in retry logic with exponential backoff
- ✅ **Horizontal scaling**: Add more workers easily
- ✅ **Message persistence**: Survives server restarts
- ✅ **Dead letter queue**: Captures failed messages for analysis
- ✅ **Better separation of concerns**: Publisher doesn't care about consumers
- ✅ **Load balancing**: RabbitMQ distributes work across consumers
- ✅ **Mature ecosystem**: Extensive documentation and community support

**Cons:**
- ❌ **Additional infrastructure**: Requires RabbitMQ server (extra resource)
- ❌ **Complexity**: More moving parts to maintain
- ❌ **Learning curve**: Team needs to understand RabbitMQ, Hangfire, MassTransit
- ❌ **Cost**: RabbitMQ server needs RAM (500MB-1GB minimum)
- ❌ **Network overhead**: Messages serialized/deserialized
- ❌ **Additional dependencies**: 3-4 NuGet packages
- ❌ **Monitoring complexity**: Need to monitor both Hangfire and RabbitMQ

---

#### Approach 2: Native .NET Background Services (My Recommendation)

**Architecture:**
```
┌──────────────────────────────────────────────────────────────────┐
│                   ASP.NET Core Application                       │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │          BackgroundService (IHostedService)                │ │
│  │                                                            │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  NotificationSchedulerService                        │ │ │
│  │  │  - Runs every 5 minutes                              │ │ │
│  │  │  - Queries database directly                         │ │ │
│  │  │  - Creates jobs in notification_jobs table           │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                            │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  NotificationProcessorService                        │ │ │
│  │  │  - Polls notification_jobs table                     │ │ │
│  │  │  - Processes pending jobs                            │ │ │
│  │  │  - Sends notifications                               │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                            │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  NotificationCleanupService                          │ │ │
│  │  │  - Runs daily at 2 AM                                │ │ │
│  │  │  - Cleans up old data                                │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
│                           │                                     │
│                           ▼                                     │
│                 ┌──────────────────┐                           │
│                 │  PostgreSQL DB   │                           │
│                 │  notification_   │                           │
│                 │  jobs table      │                           │
│                 └──────────────────┘                           │
└──────────────────────────────────────────────────────────────────┘
```

**Key Components:**

1. **BackgroundService (Built-in .NET)**
   - Native to ASP.NET Core
   - Lifecycle managed by host
   - No external dependencies
   - Uses PostgreSQL as job queue

2. **Database as Queue**
   - `notification_jobs` table serves as queue
   - ACID guarantees
   - Simple to implement
   - No additional infrastructure

**Implementation Example:**

```csharp
// Program.cs - Register background services
builder.Services.AddHostedService<NotificationSchedulerService>();
builder.Services.AddHostedService<NotificationProcessorService>();
builder.Services.AddHostedService<NotificationCleanupService>();
builder.Services.AddScoped<INotificationSender, NotificationSender>();

// No additional packages needed - all built-in!
```

**Pros:**
- ✅ **Zero external dependencies**: Uses built-in .NET features
- ✅ **Simple architecture**: Easy to understand and maintain
- ✅ **No additional infrastructure**: No RabbitMQ, Redis, or external services
- ✅ **Cost-effective**: No extra server resources needed
- ✅ **Fast development**: Less code, faster to implement
- ✅ **Database guarantees**: ACID compliance for job queue
- ✅ **Easy debugging**: All in one application
- ✅ **Suitable for MVP**: Perfect for initial launch

**Cons:**
- ❌ **Scaling limitations**: Harder to scale horizontally (need distributed locking)
- ❌ **No built-in dashboard**: Need to build custom monitoring
- ❌ **Manual retry logic**: Have to implement yourself
- ❌ **Database polling**: Can increase DB load (mitigated by indexes)
- ❌ **Single point of failure**: If app crashes, jobs pause
- ❌ **Less flexibility**: Tightly coupled to main application

---

### Decision Matrix: Which Approach to Choose?

| Criteria | Hangfire + RabbitMQ | Background Services | Winner |
|----------|-------------------|---------------------|--------|
| **Initial Development Speed** | Slower (3-5 days setup) | Faster (1-2 days) | ✅ Background Services |
| **Infrastructure Cost** | Higher (+$20-50/mo) | Lower ($0 extra) | ✅ Background Services |
| **Complexity** | High | Low | ✅ Background Services |
| **Scalability** | Excellent (10k+ jobs/min) | Good (1k jobs/min) | ✅ Hangfire + RabbitMQ |
| **Reliability** | Excellent (5 nines) | Good (3-4 nines) | ✅ Hangfire + RabbitMQ |
| **Monitoring** | Built-in dashboard | Custom needed | ✅ Hangfire + RabbitMQ |
| **Learning Curve** | Steep | Gentle | ✅ Background Services |
| **Maintenance** | Higher | Lower | ✅ Background Services |
| **Suitable for MVP** | Overkill | Perfect | ✅ Background Services |
| **Enterprise Ready** | Yes | With modifications | ✅ Hangfire + RabbitMQ |

---

### Recommendation Based on Your Context

#### ✅ **Start with Background Services (Approach 2)**

**Why?**

1. **You're building an MVP**: Your system is designed for 100+ concurrent events, not 10,000+
2. **Notification volume is predictable**: Max ~200 notifications per event (if 200 athletes × 2 reminders)
3. **You already have PostgreSQL**: No need to add RabbitMQ infrastructure
4. **Team velocity**: Faster to implement, easier to debug
5. **Cost optimization**: No additional server resources
6. **Monolithic architecture**: You chose monolith for simplicity - stay consistent

**When to migrate to Hangfire + RabbitMQ?**

Upgrade when you hit these thresholds:

- ✅ **>500 concurrent events**: Need better horizontal scaling
- ✅ **>10,000 notifications/hour**: Database queue becomes bottleneck
- ✅ **24/7 operations critical**: Need message persistence guarantees
- ✅ **Multiple notification types**: Need complex routing (email only, push only, etc.)
- ✅ **Enterprise customers**: They require SLA guarantees
- ✅ **Team grows >5 devs**: Can handle the complexity

---

### Hybrid Approach (Best of Both Worlds)

**Phase 1 (MVP - Month 1-3):** Background Services
```csharp
// Simple, fast, working solution
builder.Services.AddHostedService<NotificationSchedulerService>();
builder.Services.AddHostedService<NotificationProcessorService>();
```

**Phase 2 (Scale - Month 6-12):** Add Hangfire (Keep RabbitMQ for later)
```csharp
// Add Hangfire for better monitoring and reliability
builder.Services.AddHangfire(config => config.UsePostgreSqlStorage(...));
builder.Services.AddHangfireServer();

// Replace BackgroundService with Hangfire jobs
RecurringJob.AddOrUpdate<NotificationSchedulerService>(
    "schedule-reminders", 
    s => s.ScheduleReminders(), 
    "*/5 * * * *"
);
```

**Phase 3 (Enterprise - Month 12+):** Add RabbitMQ
```csharp
// Add RabbitMQ when scaling demands it
builder.Services.AddMassTransit(x =>
{
    x.UsingRabbitMq((context, cfg) => { /* config */ });
});
```

---

### Migration Path: Background Services → Hangfire + RabbitMQ

**Step 1: Add Hangfire (Zero downtime)**
```csharp
// Keep existing BackgroundService running
// Add Hangfire in parallel
builder.Services.AddHostedService<NotificationSchedulerService>(); // Old
builder.Services.AddHangfire(config => config.UsePostgreSqlStorage(...)); // New
```

**Step 2: Gradually migrate jobs**
```csharp
// Move one job at a time to Hangfire
RecurringJob.AddOrUpdate<NotificationSchedulerService>(
    "schedule-reminders",
    service => service.ScheduleReminders(),
    "*/5 * * * *"
);

// Remove old BackgroundService after validation
// builder.Services.AddHostedService<NotificationSchedulerService>(); // Commented out
```

**Step 3: Add RabbitMQ (when needed)**
```csharp
// Hangfire → RabbitMQ → Consumer
// Hangfire schedules jobs
// RabbitMQ queues messages
// Consumers process notifications
```

---

### Practical Recommendation for Your Project

**Implement Background Services now because:**

1. ✅ **Your architecture document already uses monolithic approach** - stay consistent
2. ✅ **Your event scale (100+ events)** doesn't require enterprise message queue yet
3. ✅ **Development speed matters** - you're building prototypes
4. ✅ **Team familiarity** - standard .NET patterns, no new tools to learn
5. ✅ **Infrastructure simplicity** - one less thing to deploy/monitor/secure

**Add this to your backlog for Phase 2:**

> "When we reach 500+ concurrent events or 10,000+ notifications/hour, evaluate migration to Hangfire + RabbitMQ for improved scalability and reliability. Estimated: Q3 2026."

---

### Code Comparison: Same Feature, Two Approaches

**Background Service (Simple):**
```csharp
// 50 lines of code, zero dependencies
public class NotificationSchedulerService : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            // Query database, create jobs
            await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
        }
    }
}
```

**Hangfire + RabbitMQ (Complex):**
```csharp
// 200+ lines of code, 3 NuGet packages, RabbitMQ server setup
// Configure Hangfire
builder.Services.AddHangfire(config => { /* 20 lines */ });

// Configure RabbitMQ
builder.Services.AddMassTransit(x => { /* 30 lines */ });

// Scheduler
RecurringJob.AddOrUpdate<NotificationSchedulerService>(/* ... */);

// Consumer
public class NotificationConsumer : IConsumer<NotificationJob> { /* 50 lines */ }

// Message contracts
public record NotificationJob { /* 10 lines */ }
```

**Both achieve the same goal** - the question is: do you need the extra power now or later?

**Answer: Start simple, scale smart.**

---
 
## Real-Time Communication
 
### SignalR Hub Architecture
 
**Hub: ScoreHub**
- Manages real-time score updates
- Broadcasts to all connected clients in same event/game
 
**Connection Flow:**
```
1. Client connects to /hubs/scores
2. Client joins group: "game:{gameId}"
3. On score update, server broadcasts to group
4. All clients in group receive update
5. Client disconnects, removed from group
```
 
**Hub Methods:**
 
```csharp
// Server-to-Client
public interface IScoreClient
{
    Task ReceiveScoreUpdate(ScoreUpdateDto score);
    Task ReceiveLeaderboardUpdate(LeaderboardDto leaderboard);
    Task ReceiveBracketUpdate(BracketUpdateDto bracket);
}
 
// Client-to-Server
public class ScoreHub : Hub<IScoreClient>
{
    public async Task JoinGameGroup(string gameId);
    public async Task LeaveGameGroup(string gameId);
}
```
 
**Message Flow:**
```
Athlete Mobile App ──┐
                     │
Referee Tablet ──────┤
                     │
Host Desktop ────────┼──> POST /api/scores
                     │
Spectator Web ───────┘         │
                               ▼
                        Backend Validates
                               │
                               ▼
                        Save to Database
                               │
                               ▼
                        SignalR Broadcast
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
   Athlete App            Referee App          Spectator Web
   (Leaderboard)          (Leaderboard)        (Leaderboard)
```
 
### WebSocket Configuration
 
- **Protocol:** SignalR over WebSockets (fallback to Server-Sent Events, Long Polling)
- **Connection Timeout:** 30 seconds
- **Keep-Alive Interval:** 15 seconds
- **Max Message Size:** 32 KB
- **Reconnection:** Automatic with exponential backoff
 
---
 
## Security Architecture
 
### Multi-Layer Security Approach
 
```
┌─────────────────────────────────────────────────────────┐
│ Layer 1: Network Security                               │
│ - VPS Firewall (ports 80, 443, 22 only)                │
│ - Fail2ban for SSH protection                           │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│ Layer 2: SSL/TLS Encryption                             │
│ - TLS 1.3 preferred, TLS 1.2 minimum                    │
│ - Let's Encrypt certificates                            │
│ - HSTS enabled                                          │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│ Layer 3: Web Application Firewall (Nginx)              │
│ - XSS protection headers                                │
│ - SQL injection pattern blocking                        │
│ - Request size limits (10MB max)                        │
│ - CORS policy enforcement                               │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│ Layer 4: Rate Limiting (Nginx)                          │
│ - Auth: 5 req/min per IP                                │
│ - API: 100 req/min per user                             │
│ - Scores: 30 req/min per athlete                        │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│ Layer 5: Authentication & Authorization                 │
│ - JWT tokens (24-hour expiration)                       │
│ - Role-based access control (RBAC)                      │
│ - Refresh token rotation                                │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│ Layer 6: Input Validation                               │
│ - Schema validation (FluentValidation)                  │
│ - SQL injection prevention (parameterized queries)      │
│ - XSS sanitization                                      │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│ Layer 7: Data Protection                                │
│ - Password hashing (bcrypt, cost 12)                    │
│ - Database encryption at rest                           │
│ - Secure connection strings                             │
└─────────────────────────────────────────────────────────┘
```
### Authentication Flow (JWT)
 
```
1. User submits credentials
2. Backend validates against database
3. Generate JWT access token (24h) + refresh token (30d)
4. Return tokens to client
5. Client stores tokens (httpOnly cookies or localStorage)
6. Client includes access token in Authorization header
7. Backend validates token on each request
8. If expired, use refresh token to get new access token
```
 
**JWT Payload:**
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "Athlete",
  "iat": 1699257600,
  "exp": 1699344000
}
```
 
### Google SSO Authentication Flow (OAuth 2.0)
 
```
┌─────────────┐                                    ┌──────────────────┐
│   Browser   │                                    │  Google OAuth    │
│  (Frontend) │                                    │   (accounts.     │
│             │                                    │  google.com)     │
└──────┬──────┘                                    └────────┬─────────┘
       │                                                    │
       │ 1. User clicks "Sign in with Google"             │
       ├──────────────────────────────────────────────────>│
       │                                                    │
       │ 2. Redirect to Google OAuth consent screen       │
       │<──────────────────────────────────────────────────┤
       │                                                    │
       │ 3. User grants permission (email, profile)        │
       ├──────────────────────────────────────────────────>│
       │                                                    │
       │ 4. Google returns ID token (JWT) to frontend      │
       │<──────────────────────────────────────────────────┤
       │                                                    │
       │                                                    │
       ▼                                                    │
┌─────────────┐                                            │
│   Backend   │                                            │
│  (ASP.NET)  │                                            │
└──────┬──────┘                                            │
       │                                                    │
       │ 5. POST /api/v1/auth/google { idToken }          │
       │<───────────────────────────────────────────────┐  │
       │                                                 │  │
       │ 6. Validate ID token with Google API           │  │
       ├─────────────────────────────────────────────────┼─>│
       │                                                 │  │
       │ 7. Google confirms token is valid              │  │
       │<────────────────────────────────────────────────┼──┤
       │                                                 │  │
       │ 8. Extract email, name, Google sub from token  │  │
       │                                                 │  │
       │ 9. Find or create user in database             │  │
       │    (match by email or GoogleId)                │  │
       │                                                 │  │
       │ 10. Generate JWT access + refresh tokens       │  │
       │                                                 │  │
       │ 11. Return JWT tokens to frontend              │  │
       ├────────────────────────────────────────────────>│  │
       │                                                    │
       │ 12. Frontend stores JWT, redirects to dashboard   │
       │                                                    │
```
 
**Google SSO Implementation Details:**
 
**Frontend (Vue 3):**
```html
<!-- Include Google Identity Services -->
<script src="https://accounts.google.com/gsi/client" async defer></script>
 
<!-- Google Sign-In Button -->
<div id="g_id_onload"
     data-client_id="YOUR_GOOGLE_CLIENT_ID"
     data-callback="handleCredentialResponse">
</div>
<div class="g_id_signin" data-type="standard"></div>
```
 
```typescript
// Handle Google credential response
function handleCredentialResponse(response: any) {
  const idToken = response.credential; // Google ID token (JWT)
 
  // Send ID token to backend for verification
  axios.post('/api/v1/auth/google', { idToken })
    .then(res => {
      // Store JWT tokens from backend
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      router.push('/dashboard');
    })
    .catch(err => {
      console.error('Google SSO failed:', err);
    });
}
```
 
**Backend (ASP.NET Core):**
```csharp
// Install: Google.Apis.Auth NuGet package
using Google.Apis.Auth;
 
[HttpPost("google")]
public async Task<IActionResult> GoogleAuth([FromBody] GoogleAuthRequest request)
{
    try
    {
        // Validate Google ID token
        var payload = await GoogleJsonWebSignature.ValidateAsync(
            request.IdToken,
            new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { _configuration["Google:ClientId"] }
            });
       
        // Extract user info from Google token
        var email = payload.Email;
        var googleId = payload.Subject; // Google's unique user ID
        var firstName = payload.GivenName;
        var lastName = payload.FamilyName;
       
        // Find or create user
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email || u.GoogleId == googleId);
       
        if (user == null)
        {
            // Create new user from Google account
            user = new User
            {
                Email = email,
                GoogleId = googleId,
                FirstName = firstName,
                LastName = lastName,
                Role = "Athlete", // Default role
                EmailVerified = true // Google emails are pre-verified
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }
        else if (string.IsNullOrEmpty(user.GoogleId))
        {
            // Link existing account with Google
            user.GoogleId = googleId;
            await _context.SaveChangesAsync();
        }
       
        // Generate JWT tokens (same as email/password login)
        var accessToken = _tokenService.GenerateAccessToken(user);
        var refreshToken = _tokenService.GenerateRefreshToken(user);
       
        return Ok(new { accessToken, refreshToken, user });
    }
    catch (InvalidJwtException)
    {
        return Unauthorized("Invalid Google token");
    }
}
```
 
**Configuration (appsettings.json - loaded from Vault):**
```json
{
  "Google": {
    "ClientId": "YOUR_CLIENT_ID.apps.googleusercontent.com",
    "ClientSecret": "YOUR_CLIENT_SECRET"
  }
}
```
 
**Database Schema Addition:**
```sql
ALTER TABLE Users
ADD GoogleId VARCHAR(255) NULL,
ADD CONSTRAINT UQ_Users_GoogleId UNIQUE (GoogleId);
```
 
**Security Considerations:**
- Google Client Secret stored in HashiCorp Vault (never in code)
- ID token validated using Google's public keys
- Email verification not required (Google pre-verifies)
- Users can link existing email/password account with Google
- Tokens expire and must be refreshed (standard JWT flow)
 
### Authorization Matrix (RBAC)
 
| Resource | Admin | Host | Referee | Athlete |
|----------|-------|------|---------|---------|
| Create Event | ✅ | ✅ | ❌ | ❌ |
| Update Own Event | ✅ | ✅ | ❌ | ❌ |
| Delete Own Event | ✅ | ✅ | ❌ | ❌ |
| Approve Referees | ✅ | ✅ (own) | ❌ | ❌ |
| Register as Athlete | ✅ | ✅ | ✅ | ✅ |
| Submit Own Score | ✅ | ✅ | ✅ | ✅ |
| Update Own Score | ✅ | ✅ | ✅ | ✅ (unlocked) |
| Update Any Score | ✅ | ✅ (event) | ✅ (event) | ❌ |
| Lock Scores | ✅ | ✅ (event) | ❌ | ❌ |
| Generate Bracket | ✅ | ✅ (event) | ❌ | ❌ |
| Resolve Shoot-off | ✅ | ✅ (event) | ✅ (event) | ❌ |
| View Leaderboard | ✅ | ✅ | ✅ | ✅ |
 
### Security Best Practices Implementation
 
**Password Policy:**
- Minimum 8 characters
- At least 1 uppercase, 1 lowercase, 1 number, 1 special character
- Hashed with bcrypt (cost factor 12)
- No password reuse (last 3 passwords tracked)
 
**Session Management:**
- JWT access tokens expire in 24 hours
- Refresh tokens expire in 30 days
- Tokens invalidated on logout
- Concurrent session limits (max 3 devices)
 
**API Security:**
- All endpoints require authentication (except public data)
- Role verification on every protected endpoint
- Input sanitization for all user inputs
- Output encoding to prevent XSS
 
---
 
## Infrastructure Architecture
 
### Docker Compose Stack
 
```yaml
version: '3.8'
 
services:
  # Nginx Reverse Proxy & Load Balancer
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
      - ./frontend/dist:/usr/share/nginx/html
    depends_on:
      - backend-1
      - backend-2
    networks:
      - app-network
 
  # Frontend (Vue 3 + Vuetify)
  frontend:
    build: ./frontend
    expose:
      - "8080"
    networks:
      - app-network
 
  # Backend API Instance 1
  backend-1:
    build: ./backend
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ConnectionStrings__DefaultConnection=Host=postgres;Database=archery;Username=archery_user;Password=${DB_PASSWORD}
    expose:
      - "5000"
    depends_on:
      - postgres
    networks:
      - app-network
 
  # Backend API Instance 2
  backend-2:
    build: ./backend
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ConnectionStrings__DefaultConnection=Host=postgres;Database=archery;Username=archery_user;Password=${DB_PASSWORD}
    expose:
      - "5000"
    depends_on:
      - postgres
    networks:
      - app-network
 
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=archery
      - POSTGRES_USER=archery_user
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    expose:
      - "5432"
    networks:
      - app-network
 
  # Prometheus (Metrics)
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    expose:
      - "9090"
    networks:
      - app-network
 
  # Grafana (Dashboards)
  grafana:
    image: grafana/grafana:latest
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
    volumes:
      - grafana-data:/var/lib/grafana
      - ./grafana/dashboards:/etc/grafana/provisioning/dashboards
    ports:
      - "3000:3000"
    depends_on:
      - prometheus
    networks:
      - app-network
 
  # Loki (Logs)
  loki:
    image: grafana/loki:latest
    volumes:
      - ./loki/loki-config.yml:/etc/loki/loki-config.yml
      - loki-data:/loki
    expose:
      - "3100"
    networks:
      - app-network
 
  # Promtail (Log Collector)
  promtail:
    image: grafana/promtail:latest
    volumes:
      - ./promtail/promtail-config.yml:/etc/promtail/promtail-config.yml
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
    depends_on:
      - loki
    networks:
      - app-network
 
  # HashiCorp Vault (Secrets Management)
  vault:
    image: hashicorp/vault:latest
    cap_add:
      - IPC_LOCK
    environment:
      - VAULT_DEV_ROOT_TOKEN_ID=${VAULT_ROOT_TOKEN}  # Dev mode only
      - VAULT_DEV_LISTEN_ADDRESS=0.0.0.0:8200
    volumes:
      - vault-data:/vault/data
      - ./vault/config.hcl:/vault/config/config.hcl
    ports:
      - "127.0.0.1:8200:8200"  # Localhost only for security
    command: server -dev  # Use server (not -dev) for production
    networks:
      - app-network
 
  # cAdvisor (Container Metrics)
  cadvisor:
    image: google/cadvisor:latest
    privileged: true
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:rw
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro
    expose:
      - "8080"
    networks:
      - app-network
 
  # Node Exporter (System Metrics)
  node-exporter:
    image: prom/node-exporter:latest
    command:
      - '--path.procfs=/host/proc'
      - '--path.sysfs=/host/sys'
      - '--path.rootfs=/rootfs'
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    expose:
      - "9100"
    networks:
      - app-network
 
volumes:
  postgres-data:
  prometheus-data:
  grafana-data:
  loki-data:
  vault-data:
 
networks:
  app-network:
    driver: bridge
```
 
### HashiCorp Vault Secrets Management
 
**Purpose:** Centralized secrets storage to avoid hardcoding credentials in code or environment files.
 
**Secrets Stored in Vault:**
- Database connection strings (PostgreSQL credentials)
- JWT signing secret and refresh token secret
- Google OAuth Client ID and Client Secret
- Email service credentials (SMTP)
- API keys (future integrations)
 
**Vault Configuration (config.hcl):**
 
```hcl
storage "file" {
  path = "/vault/data"
}
 
listener "tcp" {
  address     = "0.0.0.0:8200"
  tls_disable = 1  # Use TLS in production
}
 
ui = true
 
# Development mode settings
disable_mlock = true
```
 
**Initializing Vault (First-Time Setup):**
 
```bash
# 1. Start Vault container
docker-compose up -d vault
 
# 2. Initialize Vault (returns unseal keys and root token)
docker exec -it vault vault operator init
 
# 3. Unseal Vault (required after each restart, unless using auto-unseal)
docker exec -it vault vault operator unseal <UNSEAL_KEY_1>
docker exec -it vault vault operator unseal <UNSEAL_KEY_2>
docker exec -it vault vault operator unseal <UNSEAL_KEY_3>
 
# 4. Login with root token
docker exec -it vault vault login <ROOT_TOKEN>
 
# 5. Enable KV secrets engine (version 2)
docker exec -it vault vault secrets enable -version=2 kv
 
# 6. Create secrets
docker exec -it vault vault kv put kv/archery/database \
  username=archery_user \
  password=SecurePassword123! \
  connection_string="Host=postgres;Database=archery;Username=archery_user;Password=SecurePassword123!"
 
docker exec -it vault vault kv put kv/archery/jwt \
  secret=YourSuperSecretJWTKey256Bits \
  refresh_secret=YourRefreshTokenSecret256Bits
 
docker exec -it vault vault kv put kv/archery/google \
  client_id=YOUR_CLIENT_ID.apps.googleusercontent.com \
  client_secret=YOUR_CLIENT_SECRET
 
# 7. Create AppRole for backend authentication
docker exec -it vault vault auth enable approle
docker exec -it vault vault write auth/approle/role/archery-backend \
  token_ttl=1h \
  token_max_ttl=4h \
  secret_id_ttl=0
```
 
**Backend Integration (ASP.NET Core):**
 
Install VaultSharp NuGet package:
```bash
dotnet add package VaultSharp
```
 
**Vault Client Service:**
 
```csharp
using VaultSharp;
using VaultSharp.V1.AuthMethods.AppRole;
using VaultSharp.V1.Commons;
 
public class VaultService
{
    private readonly IVaultClient _vaultClient;
   
    public VaultService(IConfiguration configuration)
    {
        var vaultUri = configuration["Vault:Uri"]; // http://vault:8200
        var roleId = configuration["Vault:RoleId"];
        var secretId = configuration["Vault:SecretId"];
       
        var authMethod = new AppRoleAuthMethodInfo(roleId, secretId);
        var vaultClientSettings = new VaultClientSettings(vaultUri, authMethod);
        _vaultClient = new VaultClient(vaultClientSettings);
    }
   
    public async Task<string> GetSecretAsync(string path, string key)
    {
        Secret<SecretData> secret = await _vaultClient.V1.Secrets.KeyValue.V2
            .ReadSecretAsync(path: path, mountPoint: "kv");
       
        return secret.Data.Data[key].ToString();
    }
}
```
 
**Loading Secrets at Startup (Program.cs):**
 
```csharp
var builder = WebApplication.CreateBuilder(args);
 
// Register Vault service
builder.Services.AddSingleton<VaultService>();
 
// Build temporary service provider to access VaultService
var tempServiceProvider = builder.Services.BuildServiceProvider();
var vaultService = tempServiceProvider.GetRequiredService<VaultService>();
 
// Load secrets from Vault
var dbConnectionString = await vaultService.GetSecretAsync("archery/database", "connection_string");
var jwtSecret = await vaultService.GetSecretAsync("archery/jwt", "secret");
var googleClientId = await vaultService.GetSecretAsync("archery/google", "client_id");
var googleClientSecret = await vaultService.GetSecretAsync("archery/google", "client_secret");
 
// Override configuration with Vault secrets
builder.Configuration["ConnectionStrings:DefaultConnection"] = dbConnectionString;
builder.Configuration["Jwt:Secret"] = jwtSecret;
builder.Configuration["Google:ClientId"] = googleClientId;
builder.Configuration["Google:ClientSecret"] = googleClientSecret;
 
// Continue with normal configuration...
```
 
**Alternative: Docker Secrets (If Vault Not Feasible):**
 
```yaml
# docker-compose.yml
services:
  backend-1:
    secrets:
      - db_password
      - jwt_secret
      - google_client_secret
    environment:
      - DB_PASSWORD_FILE=/run/secrets/db_password
      - JWT_SECRET_FILE=/run/secrets/jwt_secret
 
secrets:
  db_password:
    file: ./secrets/db_password.txt
  jwt_secret:
    file: ./secrets/jwt_secret.txt
  google_client_secret:
    file: ./secrets/google_client_secret.txt
```
 
**Security Best Practices:**
- Never commit secrets to Git (use .gitignore for secrets/)
- Rotate secrets regularly (every 90 days minimum)
- Use least-privilege access (AppRole with limited policies)
- Enable Vault audit logging
- Use TLS for Vault communication in production
- Auto-unseal Vault in production (cloud KMS integration)
- Backup Vault data and unseal keys securely
 
### UFW Firewall Configuration (Ubuntu 24.04 VPS)
 
**Purpose:** Protect VPS by allowing only necessary ports and blocking all unauthorized traffic.
 
**VPS Specifications:**
- Operating System: Ubuntu 24.04 LTS
- Resources: 2 vCPU / 4 GB RAM
- Network: Public IP with UFW firewall
 
**UFW Setup Commands:**
 
```bash
# 1. Install UFW (usually pre-installed on Ubuntu)
sudo apt update
sudo apt install ufw
 
# 2. Set default policies
sudo ufw default deny incoming   # Block all incoming by default
sudo ufw default allow outgoing   # Allow all outgoing
 
# 3. Allow SSH (CRITICAL: Do this before enabling UFW to avoid lockout)
sudo ufw limit 22/tcp comment 'SSH with rate limiting'
# Alternative: Restrict SSH to specific IP
# sudo ufw allow from YOUR_IP_ADDRESS to any port 22
 
# 4. Allow HTTP and HTTPS (for web traffic)
sudo ufw allow 80/tcp comment 'HTTP'
sudo ufw allow 443/tcp comment 'HTTPS'
 
# 5. Allow Vault UI (localhost only, for internal access via SSH tunnel)
# No external rule needed - Vault port 8200 only exposed to localhost in Docker
 
# 6. Enable UFW
sudo ufw enable
 
# 7. Verify status
sudo ufw status verbose
 
# 8. Enable logging (low level to avoid log spam)
sudo ufw logging low
```
 
**Expected UFW Status:**
 
```
Status: active
Logging: on (low)
Default: deny (incoming), allow (outgoing), disabled (routed)
 
To                         Action      From
--                         ------      ----
22/tcp                     LIMIT       Anywhere                   # SSH with rate limiting
80/tcp                     ALLOW       Anywhere                   # HTTP
443/tcp                    ALLOW       Anywhere                   # HTTPS
22/tcp (v6)                LIMIT       Anywhere (v6)              # SSH with rate limiting
80/tcp (v6)                ALLOW       Anywhere (v6)              # HTTP
443/tcp (v6)                ALLOW       Anywhere (v6)              # HTTPS
```
 
**Docker and UFW Compatibility:**
 
By default, Docker can bypass UFW rules. To ensure UFW controls Docker traffic:
 
```bash
# Edit Docker daemon configuration
sudo nano /etc/docker/daemon.json
 
# Add the following:
{
  "iptables": false
}
 
# Restart Docker
sudo systemctl restart docker
 
# Reload UFW
sudo ufw reload
```
 
**Important:** This disables Docker's iptables manipulation. Test container networking after applying.
 
**Alternative (recommended):** Keep Docker iptables enabled but configure UFW to work with Docker:
 
```bash
# Edit UFW before.rules
sudo nano /etc/ufw/before.rules
 
# Add at the end (before *filter):
# BEGIN UFW AND DOCKER
*filter
:ufw-user-forward - [0:0]
:DOCKER-USER - [0:0]
-A DOCKER-USER -j ufw-user-forward
-A DOCKER-USER -j RETURN
COMMIT
# END UFW AND DOCKER
 
# Reload UFW
sudo ufw reload
```
 
**SSH Rate Limiting:**
- `ufw limit 22/tcp` enables rate limiting
- Blocks connection attempts if more than 6 connections in 30 seconds from same IP
- Protects against brute-force SSH attacks
 
**Security Monitoring:**
 
```bash
# View UFW logs
sudo tail -f /var/log/ufw.log
 
# View blocked connection attempts
sudo grep -i "BLOCK" /var/log/ufw.log
 
# View SSH connection attempts
sudo grep "DPT=22" /var/log/ufw.log
```
 
**Production Hardening:**
1. **Change SSH port** from 22 to custom port (e.g., 2222)
2. **Disable password authentication** - use SSH keys only
3. **Whitelist admin IPs** for SSH access
4. **Install Fail2Ban** for additional intrusion prevention
5. **Enable automatic security updates**
 
```bash
# Example: Change SSH to port 2222
sudo ufw delete allow 22/tcp
sudo ufw limit 2222/tcp comment 'SSH (custom port)'
 
# Disable password auth (edit /etc/ssh/sshd_config)
PasswordAuthentication no
PubkeyAuthentication yes
 
# Restart SSH
sudo systemctl restart ssh
```
 
**Accessing Vault UI Securely:**
 
Since Vault port 8200 is localhost-only, use SSH tunnel:
 
```bash
# From your local machine
ssh -L 8200:localhost:8200 user@your-vps-ip
 
# Then access Vault UI at http://localhost:8200 in your browser
```
 
### Nginx Configuration
 
**nginx.conf (Load Balancer + SSL)**
 
```nginx
upstream backend {
    least_conn;
    server backend-1:5000 max_fails=3 fail_timeout=30s;
    server backend-2:5000 max_fails=3 fail_timeout=30s;
}
 
# Rate limiting zones
limit_req_zone $binary_remote_addr zone=auth_limit:10m rate=5r/m;
limit_req_zone $http_authorization zone=api_limit:10m rate=100r/m;
limit_req_zone $http_authorization zone=score_limit:10m rate=30r/m;
 
# HTTP to HTTPS redirect
server {
    listen 80;
    server_name archery-events.com www.archery-events.com;
    return 301 https://$server_name$request_uri;
}
 
# HTTPS server
server {
    listen 443 ssl http2;
    server_name archery-events.com www.archery-events.com;
 
    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
 
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
 
    # Request size limit
    client_max_body_size 10M;
 
    # Frontend (Static files)
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
        expires 1d;
        add_header Cache-Control "public, immutable";
    }
 
    # API endpoints (Load balanced)
    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;
       
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
       
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
 
    # Auth endpoints (Stricter rate limit)
    location /api/v1/auth/ {
        limit_req zone=auth_limit burst=10 nodelay;
       
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
 
    # Score endpoints (Moderate rate limit)
    location /api/v1/games/ {
        limit_req zone=score_limit burst=10 nodelay;
       
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
 
    # SignalR WebSocket
    location /hubs/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
       
        # WebSocket timeouts
        proxy_read_timeout 86400;
        proxy_send_timeout 86400;
    }
 
    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```
 
---
## Deployment Architecture
 
### Blue-Green Deployment Strategy
 
```
┌─────────────────────────────────────────────────────────────┐
│                      Load Balancer (Nginx)                   │
│                                                               │
│  ┌──────────────────┐                                        │
│  │  Traffic Switch  │────┐                                   │
│  └──────────────────┘    │                                   │
└──────────────────────────┼───────────────────────────────────┘
                           │
          ┌────────────────┴────────────────┐
          │                                 │
          ▼ (Active)                        ▼ (Standby)
┌─────────────────────┐           ┌─────────────────────┐
│   BLUE Environment  │           │  GREEN Environment  │
│                     │           │                     │
│  Backend v1.0.0     │           │  Backend v1.1.0     │
│  (Serving Traffic)  │           │  (New Version)      │
└─────────────────────┘           └─────────────────────┘
          │                                 │
          └─────────────┬───────────────────┘
                        │
                        ▼
              ┌──────────────────┐
              │    Database      │
              │   (Shared)       │
              └──────────────────┘
```
 
**Deployment Process:**
 
1. **Pre-deployment:**
   - Run automated tests in CI
   - Build Docker images
   - Tag with version number
 
2. **Deploy to Green (Standby):**
   - Deploy new version to green environment
   - Run database migrations (if needed)
   - Perform smoke tests
 
3. **Switch Traffic:**
   - Update Nginx config to point to green
   - Reload Nginx (zero downtime)
   - Monitor metrics for issues
 
4. **Verification:**
   - Monitor for 15 minutes
   - Check error rates, response times
   - Verify core functionality
 
5. **Rollback Plan:**
   - If issues detected, switch back to blue
   - Investigate and fix
   - Retry deployment
 
6. **Cleanup:**
   - After 24 hours of stable green
   - Blue becomes new standby
   - Ready for next deployment
 
### CI/CD Pipeline (GitHub Actions)
 
**Workflow: Deploy to Dev**
 
```yaml
name: Deploy to Dev
 
on:
  push:
    branches: [ develop ]
 
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
   
    steps:
    - uses: actions/checkout@v3
   
    - name: Build Docker images
      run: |
        docker build -t archery-backend:dev ./backend
        docker build -t archery-frontend:dev ./frontend
   
    - name: Run tests
      run: |
        docker run archery-backend:dev dotnet test
   
    - name: Push to registry
      run: |
        docker push archery-backend:dev
        docker push archery-frontend:dev
   
    - name: Deploy to VPS
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.DEV_HOST }}
        username: ${{ secrets.SSH_USER }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /opt/archery-dev
          docker-compose pull
          docker-compose up -d
```
 
**Workflow: Deploy to Production (Blue-Green)**
 
```yaml
name: Deploy to Production
 
on:
  push:
    branches: [ main ]
  workflow_dispatch:
 
jobs:
  deploy:
    runs-on: ubuntu-latest
   
    steps:
    - uses: actions/checkout@v3
   
    - name: Build and test
      run: |
        docker build -t archery-backend:${{ github.sha }} ./backend
        docker run archery-backend:${{ github.sha }} dotnet test
   
    - name: Deploy to Green environment
      run: |
        # Deploy new version to green
        ssh $PROD_HOST "cd /opt/archery-green && docker-compose up -d"
   
    - name: Run smoke tests
      run: |
        ./scripts/smoke-test.sh https://green.archery-events.com
   
    - name: Switch traffic to Green
      run: |
        ssh $PROD_HOST "nginx -s reload"
   
    - name: Monitor for 15 minutes
      run: |
        sleep 900
        ./scripts/health-check.sh
   
    - name: Rollback if unhealthy
      if: failure()
      run: |
        ssh $PROD_HOST "nginx -s reload # switch back to blue"
```
 
---
 
## Monitoring & Observability
 
### Prometheus Metrics
 
**Metrics to Collect:**
 
**Application Metrics:**
- `http_requests_total` - Total HTTP requests (by endpoint, status)
- `http_request_duration_seconds` - Request latency (histogram)
- `signalr_connections_active` - Active WebSocket connections
- `score_submissions_total` - Total score submissions
- `events_created_total` - Total events created
 
**System Metrics:**
- `process_cpu_seconds_total` - CPU usage
- `process_resident_memory_bytes` - Memory usage
- `dotnet_gc_collections_total` - Garbage collection stats
 
**Container Metrics (cAdvisor):**
- `container_cpu_usage_seconds_total` - CPU usage per container
- `container_memory_usage_bytes` - Memory usage per container
- `container_network_receive_bytes_total` - Network bytes received
- `container_network_transmit_bytes_total` - Network bytes sent
- `container_fs_usage_bytes` - Filesystem usage per container
- `container_spec_memory_limit_bytes` - Memory limits per container
 
**Host System Metrics (Node Exporter):**
- `node_cpu_seconds_total` - Host CPU usage (per core)
- `node_memory_MemTotal_bytes` - Total host memory
- `node_memory_MemAvailable_bytes` - Available host memory
- `node_disk_read_bytes_total` - Disk read throughput
- `node_disk_written_bytes_total` - Disk write throughput
- `node_filesystem_avail_bytes` - Available disk space per filesystem
- `node_network_receive_bytes_total` - Network bytes received (per interface)
- `node_network_transmit_bytes_total` - Network bytes sent (per interface)
- `node_load1`, `node_load5`, `node_load15` - System load average
 
**Database Metrics:**
- `postgres_connections_active` - Active connections
- `postgres_query_duration_seconds` - Query performance
 
**Business Metrics:**
- `active_events_count` - Currently active events
- `registered_users_total` - Total registered users
- `daily_active_users` - DAU metric
 
### Grafana Dashboards
 
**Dashboard 1: System Overview**
- Host CPU usage (overall and per-core) from Node Exporter
- Host memory usage (total, used, available, buffers, cache)
- Host disk usage (per filesystem, read/write IOPS)
- Host network I/O (per interface)
- System load average (1m, 5m, 15m)
- Container health status
- VPS uptime
 
**Dashboard 2: Container Metrics (cAdvisor)**
- CPU usage by container (%)
- Memory usage by container (MB/GB)
- Memory limit violations
- Network I/O by container (bytes/sec)
- Disk I/O by container
- Container restart count
 
**Dashboard 3: API Performance**
- Request rate (requests/second)
- Response time (p50, p95, p99)
- Error rate by endpoint
- Top slowest endpoints
 
**Dashboard 4: Database Performance**
- Query execution time
- Connection pool usage
- Slow query log
- Cache hit ratio
 
**Dashboard 5: Business Metrics**
- Active events (real-time)
- Score submissions per minute
- User registrations per day
- Most popular game types
 
**Dashboard 6: Real-Time Competition**
- Live score update rate
- WebSocket connections
- Concurrent event participants
- Leaderboard refresh latency
 
**Dashboard 7: Distributed Tracing (Tempo)**
- Service dependency graph
- Request latency heatmap (p50, p95, p99 by endpoint)
- Trace volume by service
- Error traces by service
- Slowest operations (top 10 spans by duration)
- Database query performance breakdown
- External API call latency (Google SSO, Facebook SSO)
- Trace exemplars linked from metrics
 
### Alerting Rules
 
**Critical Alerts (PagerDuty/Email):**
- API error rate > 5% for 5 minutes
- Database connection pool > 90% for 2 minutes
- Disk space < 10%
- SSL certificate expiring in < 7 days
 
**Warning Alerts (Slack):**
- API p95 latency > 1 second
- Memory usage > 80%
- Failed logins > 10 in 5 minutes
- WebSocket disconnections > 20/minute
 
### Log Aggregation (Loki)
 
**Log Structure (JSON):**
```json
{
  "timestamp": "2025-11-06T10:15:30.123Z",
  "level": "INFO",
  "logger": "ScoreController",
  "message": "Score submitted successfully",
  "userId": "user-uuid",
  "gameId": "game-uuid",
  "scoreValue": 58,
  "duration": 45,
  "traceId": "trace-uuid"
}
```
 
**Log Queries (LogQL):**
```
# All errors in last hour
{job="backend"} |= "ERROR" | json
 
# Failed authentication attempts
{job="backend"} | json | message =~ "Failed login.*"
 
# Slow API requests (> 1s)
{job="backend"} | json | duration > 1000
```
 
### Distributed Tracing (Grafana Tempo)
 
**Purpose:** Track request flows across services, identify performance bottlenecks, and debug complex distributed transactions.
 
**Architecture:**
 
```
┌─────────────────────────────────────────────────────────────────┐
│                     Application Services                        │
│                                                                 │
│  ┌──────────────┐         ┌──────────────┐                    │
│  │  Frontend    │         │  Backend API │                    │
│  │  (Browser)   │────────▶│  (ASP.NET)   │                    │
│  │              │  HTTP   │              │                    │
│  │  TraceId:    │  Header │  TraceId:    │                    │
│  │  abc123      │         │  abc123      │                    │
│  └──────┬───────┘         └──────┬───────┘                    │
│         │                        │                            │
│         │ OTLP                   │ OTLP                       │
│         │ Traces                 │ Traces                     │
│         ▼                        ▼                            │
│  ┌────────────────────────────────────────────────────────┐  │
│  │           OpenTelemetry Collector (Optional)           │  │
│  │           - Batch processing                            │  │
│  │           - Sampling                                    │  │
│  │           - Tail-based sampling                         │  │
│  └────────────────────┬───────────────────────────────────┘  │
└───────────────────────┼──────────────────────────────────────┘
                        │
                        │ OTLP/gRPC
                        ▼
         ┌──────────────────────────────────┐
         │      Grafana Tempo               │
         │      - Trace storage             │
         │      - TraceQL queries           │
         │      - Port 3200 (HTTP)          │
         │      - Port 4317 (gRPC)          │
         └──────────────┬───────────────────┘
                        │
                        │ Query traces
                        ▼
         ┌──────────────────────────────────┐
         │         Grafana UI               │
         │         - Trace visualization    │
         │         - Service graphs         │
         │         - Logs correlation       │
         └──────────────────────────────────┘
```
 
**Trace Structure (OpenTelemetry Standard):**
 
```json
{
  "traceId": "abc123def456",
  "spans": [
    {
      "spanId": "span-001",
      "parentSpanId": null,
      "name": "POST /api/scores",
      "kind": "SERVER",
      "startTime": "2025-11-30T10:00:00.000Z",
      "endTime": "2025-11-30T10:00:00.250Z",
      "duration": 250,
      "attributes": {
        "http.method": "POST",
        "http.url": "/api/scores",
        "http.status_code": 201,
        "user.id": "user-uuid",
        "game.id": "game-uuid"
      },
      "events": [
        {
          "name": "Validation completed",
          "timestamp": "2025-11-30T10:00:00.050Z"
        }
      ]
    },
    {
      "spanId": "span-002",
      "parentSpanId": "span-001",
      "name": "Database INSERT scores",
      "kind": "CLIENT",
      "startTime": "2025-11-30T10:00:00.100Z",
      "endTime": "2025-11-30T10:00:00.180Z",
      "duration": 80,
      "attributes": {
        "db.system": "postgresql",
        "db.operation": "INSERT",
        "db.statement": "INSERT INTO qualification_scores..."
      }
    },
    {
      "spanId": "span-003",
      "parentSpanId": "span-001",
      "name": "SignalR broadcast",
      "kind": "PRODUCER",
      "startTime": "2025-11-30T10:00:00.190Z",
      "endTime": "2025-11-30T10:00:00.220Z",
      "duration": 30,
      "attributes": {
        "messaging.system": "signalr",
        "messaging.destination": "game:game-uuid"
      }
    }
  ]
}
```
 
**Backend Implementation (ASP.NET Core with OpenTelemetry):**
 
**Install NuGet Packages:**
```bash
dotnet add package OpenTelemetry.Exporter.OpenTelemetryProtocol
dotnet add package OpenTelemetry.Extensions.Hosting
dotnet add package OpenTelemetry.Instrumentation.AspNetCore
dotnet add package OpenTelemetry.Instrumentation.Http
dotnet add package OpenTelemetry.Instrumentation.SqlClient
```
 
**Configure OpenTelemetry (Program.cs):**
 
```csharp
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
 
var builder = WebApplication.CreateBuilder(args);
 
// Configure OpenTelemetry Tracing
builder.Services.AddOpenTelemetry()
    .WithTracing(tracerProviderBuilder =>
    {
        tracerProviderBuilder
            .AddSource("ArcheryEvent.WebAPI")
            .SetResourceBuilder(ResourceBuilder.CreateDefault()
                .AddService("archery-event-api")
                .AddAttributes(new Dictionary<string, object>
                {
                    ["deployment.environment"] = builder.Environment.EnvironmentName,
                    ["service.version"] = "1.2.0"
                }))
            .AddAspNetCoreInstrumentation(options =>
            {
                options.RecordException = true;
                options.EnrichWithHttpRequest = (activity, httpRequest) =>
                {
                    activity.SetTag("http.client_ip", httpRequest.HttpContext.Connection.RemoteIpAddress);
                };
                options.EnrichWithHttpResponse = (activity, httpResponse) =>
                {
                    activity.SetTag("http.response_content_length", httpResponse.ContentLength);
                };
            })
            .AddHttpClientInstrumentation()
            .AddSqlClientInstrumentation(options =>
            {
                options.SetDbStatementForText = true;
                options.RecordException = true;
            })
            .AddOtlpExporter(options =>
            {
                options.Endpoint = new Uri("http://tempo:4317"); // Tempo gRPC endpoint
                options.Protocol = OpenTelemetry.Exporter.OtlpExportProtocol.Grpc;
            });
    });
 
var app = builder.Build();
```
 
**Manual Span Creation (for custom operations):**
 
```csharp
using System.Diagnostics;
using OpenTelemetry.Trace;
 
public class ScoreService
{
    private static readonly ActivitySource ActivitySource = new("ArcheryEvent.WebAPI");
 
    public async Task<Result> CalculateLeaderboard(Guid gameId)
    {
        using var activity = ActivitySource.StartActivity("CalculateLeaderboard", ActivityKind.Internal);
        activity?.SetTag("game.id", gameId);
 
        try
        {
            // Complex calculation logic
            var scores = await _context.Scores.Where(s => s.GameId == gameId).ToListAsync();
            activity?.SetTag("scores.count", scores.Count);
 
            var leaderboard = scores.OrderByDescending(s => s.TotalScore).ToList();
 
            activity?.AddEvent(new ActivityEvent("Leaderboard calculated",
                tags: new ActivityTagsCollection { { "entries", leaderboard.Count } }));
 
            return Result.Success(leaderboard);
        }
        catch (Exception ex)
        {
            activity?.SetStatus(ActivityStatusCode.Error, ex.Message);
            activity?.RecordException(ex);
            throw;
        }
    }
}
```
 
**Frontend Implementation (Vue 3 with OpenTelemetry):**
 
**Install NPM Packages:**
```bash
npm install @opentelemetry/api
npm install @opentelemetry/sdk-trace-web
npm install @opentelemetry/instrumentation-fetch
npm install @opentelemetry/instrumentation-xml-http-request
npm install @opentelemetry/exporter-trace-otlp-http
```
 
**Configure OpenTelemetry (main.ts):**
 
```typescript
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
 
const provider = new WebTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'archery-event-frontend',
    [SemanticResourceAttributes.SERVICE_VERSION]: '1.2.0',
  }),
});
 
const exporter = new OTLPTraceExporter({
  url: 'http://tempo:4318/v1/traces', // Tempo HTTP endpoint
});
 
provider.addSpanProcessor(new BatchSpanProcessor(exporter));
provider.register();
 
registerInstrumentations({
  instrumentations: [
    new FetchInstrumentation({
      propagateTraceHeaderCorsUrls: [/^https?:\/\/api\.archery-events\.com.*/],
      clearTimingResources: true,
    }),
    new XMLHttpRequestInstrumentation({
      propagateTraceHeaderCorsUrls: [/^https?:\/\/api\.archery-events\.com.*/],
    }),
  ],
});
```
 
**Docker Compose Configuration:**
 
```yaml
services:
  tempo:
    image: grafana/tempo:latest
    container_name: tempo
    command: ["-config.file=/etc/tempo.yaml"]
    volumes:
      - ./tempo-config.yaml:/etc/tempo.yaml
      - tempo-data:/var/tempo
    ports:
      - "3200:3200"   # Tempo HTTP
      - "4317:4317"   # OTLP gRPC
      - "4318:4318"   # OTLP HTTP
    networks:
      - app-network
 
  grafana:
    image: grafana/grafana:latest
    environment:
      - GF_AUTH_ANONYMOUS_ENABLED=true
      - GF_AUTH_ANONYMOUS_ORG_ROLE=Admin
    volumes:
      - grafana-data:/var/lib/grafana
      - ./grafana-datasources.yaml:/etc/grafana/provisioning/datasources/datasources.yaml
    ports:
      - "3000:3000"
    networks:
      - app-network
 
volumes:
  tempo-data:
  grafana-data:
```
 
**Tempo Configuration (tempo-config.yaml):**
 
```yaml
server:
  http_listen_port: 3200
 
distributor:
  receivers:
    otlp:
      protocols:
        grpc:
          endpoint: 0.0.0.0:4317
        http:
          endpoint: 0.0.0.0:4318
 
ingester:
  max_block_duration: 5m
 
compactor:
  compaction:
    block_retention: 168h  # 7 days
 
storage:
  trace:
    backend: local
    local:
      path: /var/tempo/traces
    wal:
      path: /var/tempo/wal
 
overrides:
  metrics_generator_processors:
    - service-graphs
    - span-metrics
```
 
**Grafana Datasource Configuration (grafana-datasources.yaml):**
 
```yaml
apiVersion: 1
 
datasources:
  - name: Tempo
    type: tempo
    access: proxy
    url: http://tempo:3200
    jsonData:
      httpMethod: GET
      tracesToLogs:
        datasourceUid: loki
        tags: ['traceId']
      serviceMap:
        datasourceUid: prometheus
```
 
**Grafana Dashboard Queries (TraceQL):**
 
```
# Find all traces with errors
{ status = error }
 
# Find slow API requests (> 500ms)
{ duration > 500ms && span.kind = server }
 
# Find traces for specific user
{ resource.user.id = "user-uuid" }
 
# Find database queries taking > 100ms
{ name =~ ".*Database.*" && duration > 100ms }
 
# Find traces with specific game
{ span.game.id = "game-uuid" }
```
 
**Benefits of Distributed Tracing:**
 
✅ **End-to-End Visibility** - See complete request flow from browser to database  
✅ **Performance Bottlenecks** - Identify slow operations within complex transactions  
✅ **Error Debugging** - Trace exact path of failed requests with context  
✅ **Service Dependencies** - Visualize how services interact  
✅ **Latency Analysis** - Break down total request time by component  
✅ **Correlation** - Link traces with logs and metrics (traceId propagation)  
 
**Use Cases:**
 
1. **Score Submission Latency**: Trace from athlete's button click → API → validation → database → SignalR broadcast → spectator's screen update
2. **Authentication Flow**: Track OAuth 2.0 flow across Google SSO → backend verification → JWT generation → session creation
3. **Leaderboard Generation**: Identify bottlenecks in complex aggregation queries
4. **WebSocket Performance**: Measure SignalR hub broadcast latency to multiple clients
5. **Error Investigation**: When a score submission fails, trace shows exact failure point with full context
 
---
 
## Technology Stack
 
### Backend Stack
 
| Technology | Version | Purpose |
|------------|---------|---------|
| ASP.NET Core | 9.0 | RESTful API framework (Jason Taylor Clean Architecture) |
| SignalR | 9.0 | Real-time WebSocket communication |
| Entity Framework Core | 9.0 | ORM for database access |
| FluentValidation | 11.x | Input validation |
| MediatR | 12.x | CQRS pattern implementation |
| AutoMapper | 12.x | Object-to-object mapping |
| ASP.NET Identity | 9.0 | User authentication & authorization |
| Google.Apis.Auth | Latest | Google SSO integration |
| Serilog | Latest | Structured logging |
| Serilog.Sinks.Loki | Latest | Loki integration for logs |
| prometheus-net | Latest | Prometheus metrics for .NET |
| OpenTelemetry.Exporter.OpenTelemetryProtocol | Latest | OTLP exporter for traces |
| OpenTelemetry.Instrumentation.AspNetCore | Latest | Automatic HTTP request tracing |
| OpenTelemetry.Instrumentation.SqlClient | Latest | Database query tracing |
| JWT Bearer | Latest | Token-based authentication |
| BCrypt.Net | Latest | Password hashing (cost factor 12) |
 
### Frontend Stack
 
| Technology | Version | Purpose |
|------------|---------|---------|
| Vue.js | 3.x | Progressive JavaScript framework |
| Vuetify | 3.x | Material Design component library |
| Pinia | Latest | State management |
| Vue Router | 4.x | Client-side routing |
| Axios | Latest | HTTP client |
| SignalR Client | Latest | WebSocket client (@microsoft/signalr) |
| @opentelemetry/sdk-trace-web | Latest | Browser tracing SDK |
| @opentelemetry/instrumentation-fetch | Latest | Automatic fetch API tracing |
| @opentelemetry/exporter-trace-otlp-http | Latest | OTLP exporter for browser |
| Vite | Latest | Build tool & dev server |
| TypeScript | 5.x | Type safety |
| Vue I18n | 9.x | Internationalization |
 
### Database & Caching
 
| Technology | Version | Purpose |
|------------|---------|---------|
| PostgreSQL | 15 | Primary relational database (production) |
| SQL Server | 2022 | Alternative option (enterprise scenarios) |
| SQLite | Latest | Lightweight option (local/dev) |
| Redis | 7.x (Future) | Caching & session store |
 
### Infrastructure & DevOps
 
| Technology | Version | Purpose |
|------------|---------|---------|
| Ubuntu Server | 24.04 LTS | VPS operating system (2 vCPU / 4 GB RAM) |
| Docker | Latest | Containerization platform |
| Docker Compose | v3.8+ | Multi-container orchestration |
| Nginx | Alpine | Reverse proxy, load balancer, SSL termination |
| Let's Encrypt | Latest | Free automated SSL/TLS certificates |
| Certbot | Latest | Certificate management & auto-renewal |
| UFW | Latest | Uncomplicated Firewall (ports 80, 443, 8200) |
| GitHub Actions | Latest | CI/CD pipeline automation |
| Cloudflare | N/A | Optional: DDoS protection & CDN |
 
### Security & Secrets Management
 
| Technology | Version | Purpose |
|------------|---------|---------|
| HashiCorp Vault | Latest | Centralized secrets management (primary option) |
| Docker Secrets | Latest | Alternative: Docker native secrets |
| JWT | N/A | Stateless authentication tokens (24h expiry) |
| bcrypt | Latest | Password hashing (cost factor 12) |
 
### Monitoring & Observability
 
| Technology | Version | Purpose |
|------------|---------|---------|
| Prometheus | Latest | Metrics collection & time-series database |
| Grafana | Latest | Metrics visualization & dashboards |
| Loki | Latest | Log aggregation system |
| Promtail | Latest | Log collector & forwarder to Loki |
| Grafana Tempo | Latest | Distributed tracing backend (OpenTelemetry) |
| Serilog | Latest | Structured logging library (.NET) |
| AlertManager | Latest | Alert routing & notifications (email/webhook) |
| Node Exporter | Latest | System metrics (CPU, RAM, disk, network) |
| cAdvisor | Latest | Container metrics (Docker stats) |
 
---
 
## Code Architecture & Standards
 
### Backend: Clean Architecture (Jason Taylor Pattern)
 
The backend implements **Jason Taylor's Clean Architecture** for ASP.NET Core 9, providing a robust, maintainable foundation that can scale from monolith to distributed system.

#### Architecture Layers
 
```
┌─────────────────────────────────────────────────────────────────┐
│                        API Layer (WebAPI)                        │
│  - Controllers                                                   │
│  - SignalR Hubs                                                  │
│  - Middleware (Auth, Exception Handling, Logging)                │
│  - API Models (DTOs)                                             │
└────────────────────────────┬────────────────────────────────────┘
                             │ Depends on
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Application Layer                            │
│  - Use Cases / Commands / Queries (CQRS)                        │
│  - Interfaces (IRepository, IEmailService, etc.)                 │
│  - Business Logic                                                │
│  - Validation (FluentValidation)                                 │
│  - DTOs / ViewModels                                             │
│  - AutoMapper Profiles                                           │
└────────────────────────────┬────────────────────────────────────┘
                             │ Depends on
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Domain Layer (Core)                        │
│  - Entities (Event, Game, User, Score, etc.)                    │
│  - Value Objects                                                 │
│  - Enums (UserRole, EventStatus, GameType, etc.)                │
│  - Domain Events                                                 │
│  - Exceptions                                                    │
│  - Business Rules                                                │
│  - NO DEPENDENCIES - Pure business logic                        │
└─────────────────────────────────────────────────────────────────┘
                             ▲
                             │ Referenced by
                             │
┌─────────────────────────────────────────────────────────────────┐
│                    Infrastructure Layer                          │
│  - DbContext (EF Core)                                          │
│  - Repositories Implementation                                   │
│  - External Services (Email, SMS, Storage)                      │
│  - Identity / Authentication                                     │
│  - File System Access                                            │
│  - Third-party API Integration                                  │
└─────────────────────────────────────────────────────────────────┘
```
 
#### Project Structure
 
```
backend/
├── src/
│   ├── ArcheryEvent.Domain/              # Core business logic (no dependencies)
│   │   ├── Entities/
│   │   │   ├── User.cs
│   │   │   ├── Event.cs
│   │   │   ├── Game.cs
│   │   │   ├── QualificationScore.cs
│   │   │   ├── EliminationBracket.cs
│   │   │   └── AuditLog.cs
│   │   ├── Enums/
│   │   │   ├── UserRole.cs
│   │   │   ├── EventStatus.cs
│   │   │   ├── GameType.cs
│   │   │   └── BracketStatus.cs
│   │   ├── ValueObjects/
│   │   │   ├── ScoreSet.cs
│   │   │   └── Address.cs
│   │   ├── Exceptions/
│   │   │   ├── DomainException.cs
│   │   │   └── ScoreLockedException.cs
│   │   └── Common/
│   │       ├── BaseEntity.cs
│   │       └── IAuditableEntity.cs
│   │
│   ├── ArcheryEvent.Application/         # Business logic & use cases
│   │   ├── Common/
│   │   │   ├── Interfaces/
│   │   │   │   ├── IApplicationDbContext.cs
│   │   │   │   ├── IDateTime.cs
│   │   │   │   ├── ICurrentUserService.cs
│   │   │   │   └── IEmailService.cs
│   │   │   ├── Mappings/
│   │   │   │   └── MappingProfile.cs
│   │   │   ├── Models/
│   │   │   │   ├── Result.cs
│   │   │   │   └── PaginatedList.cs
│   │   │   └── Behaviours/
│   │   │       ├── ValidationBehaviour.cs
│   │   │       └── LoggingBehaviour.cs
│   │   ├── Events/                        # Feature: Event Management
│   │   │   ├── Commands/
│   │   │   │   ├── CreateEvent/
│   │   │   │   │   ├── CreateEventCommand.cs
│   │   │   │   │   ├── CreateEventCommandHandler.cs
│   │   │   │   │   └── CreateEventCommandValidator.cs
│   │   │   │   ├── UpdateEvent/
│   │   │   │   └── DeleteEvent/
│   │   │   ├── Queries/
│   │   │   │   ├── GetEvents/
│   │   │   │   ├── GetEventById/
│   │   │   │   └── GetMyEvents/
│   │   │   └── DTOs/
│   │   │       ├── EventDto.cs
│   │   │       └── EventDetailsDto.cs
│   │   ├── Scoring/                       # Feature: Scoring System
│   │   │   ├── Commands/
│   │   │   │   ├── SubmitScore/
│   │   │   │   ├── UpdateScore/
│   │   │   │   └── LockScores/
│   │   │   ├── Queries/
│   │   │   │   ├── GetLeaderboard/
│   │   │   │   └── GetScoreHistory/
│   │   │   └── DTOs/
│   │   │       └── ScoreDto.cs
│   │   ├── Brackets/                      # Feature: Tournament Brackets
│   │   │   ├── Commands/
│   │   │   │   ├── GenerateBracket/
│   │   │   │   ├── SubmitSetScore/
│   │   │   │   └── ResolveShootOff/
│   │   │   ├── Queries/
│   │   │   │   └── GetBracket/
│   │   │   └── DTOs/
│   │   │       └── BracketDto.cs
│   │   └── DependencyInjection.cs
│   │
│   ├── ArcheryEvent.Infrastructure/       # External concerns
│   │   ├── Persistence/
│   │   │   ├── ApplicationDbContext.cs
│   │   │   ├── Configurations/            # EF Core entity configs
│   │   │   │   ├── UserConfiguration.cs
│   │   │   │   ├── EventConfiguration.cs
│   │   │   │   └── ScoreConfiguration.cs
│   │   │   └── Migrations/
│   │   ├── Identity/
│   │   │   ├── IdentityService.cs
│   │   │   └── JwtTokenService.cs
│   │   ├── Services/
│   │   │   ├── DateTimeService.cs
│   │   │   ├── EmailService.cs
│   │   │   └── CurrentUserService.cs
│   │   ├── Repositories/
│   │   │   └── (if using Repository pattern)
│   │   └── DependencyInjection.cs
│   │
│   ├── ArcheryEvent.WebAPI/               # API entry point
│   │   ├── Controllers/
│   │   │   ├── AuthController.cs
│   │   │   ├── EventsController.cs
│   │   │   ├── GamesController.cs
│   │   │   ├── ScoresController.cs
│   │   │   └── BracketsController.cs
│   │   ├── Hubs/
│   │   │   └── ScoreHub.cs
│   │   ├── Filters/
│   │   │   ├── ApiExceptionFilter.cs
│   │   │   └── ValidateModelAttribute.cs
│   │   ├── Middleware/
│   │   │   ├── ExceptionMiddleware.cs
│   │   │   └── RequestLoggingMiddleware.cs
│   │   ├── Services/
│   │   │   └── CurrentUserService.cs
│   │   ├── appsettings.json
│   │   ├── appsettings.Development.json
│   │   ├── appsettings.Production.json
│   │   ├── Program.cs
│   │   └── Dockerfile
│   │
│   └── ArcheryEvent.Contracts/            # Shared contracts (optional)
│       ├── Requests/
│       ├── Responses/
│       └── Events/
│
├── tests/
│   ├── ArcheryEvent.Domain.UnitTests/
│   ├── ArcheryEvent.Application.UnitTests/
│   ├── ArcheryEvent.Application.IntegrationTests/
│   └── ArcheryEvent.WebAPI.FunctionalTests/
│
├── ArcheryEvent.sln
└── README.md
```
 
#### Key Architectural Patterns
 
**1. CQRS (Command Query Responsibility Segregation)**
- Separate models for read and write operations
- Commands modify state (CreateEventCommand, SubmitScoreCommand)
- Queries retrieve data (GetLeaderboardQuery, GetEventsQuery)
- Uses MediatR for command/query handling
 
**2. MediatR Pattern**
```csharp
// Command
public class CreateEventCommand : IRequest<Result<Guid>>
{
    public string Name { get; set; }
    public DateTime StartDate { get; set; }
    // ... other properties
}
 
// Handler
public class CreateEventCommandHandler : IRequestHandler<CreateEventCommand, Result<Guid>>
{
    private readonly IApplicationDbContext _context;
   
    public async Task<Result<Guid>> Handle(CreateEventCommand request, CancellationToken ct)
    {
        var @event = new Event { /* map from request */ };
        _context.Events.Add(@event);
        await _context.SaveChangesAsync(ct);
        return Result.Success(@event.Id);
    }
}
 
// Usage in Controller
[HttpPost]
public async Task<ActionResult<Guid>> Create(CreateEventCommand command)
{
    var result = await _mediator.Send(command);
    return result.Succeeded ? Ok(result.Data) : BadRequest(result.Errors);
}
```
 
**3. FluentValidation**
```csharp
public class CreateEventCommandValidator : AbstractValidator<CreateEventCommand>
{
    public CreateEventCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Event name is required")
            .MaximumLength(255);
           
        RuleFor(x => x.StartDate)
            .GreaterThan(DateTime.UtcNow).WithMessage("Start date must be in the future");
           
        RuleFor(x => x.EndDate)
            .GreaterThan(x => x.StartDate).WithMessage("End date must be after start date");
    }
}
```
 
**4. Repository Pattern (Optional)**
- Can use EF Core DbContext directly in Application layer
- Or implement Repository pattern in Infrastructure
- Recommendation: Start without Repository, add if needed
 
**5. Unit of Work**
- EF Core DbContext acts as Unit of Work
- All changes saved together with `SaveChangesAsync()`
 
#### Benefits of Clean Architecture
 
✅ **Testability** - Domain and Application layers have no infrastructure dependencies  
✅ **Maintainability** - Clear separation of concerns  
✅ **Flexibility** - Easy to swap infrastructure (change DB, email provider, etc.)  
✅ **Scalability** - Can extract features into microservices later  
✅ **Domain-Driven** - Business logic isolated and protected  
✅ **Team Collaboration** - Multiple developers can work on different layers
 
#### Migration Path (Future)
 
When/if scaling to microservices:
1. **Scoring Service** - Extract real-time scoring to dedicated service
2. **Bracket Service** - Extract tournament logic
3. **Notification Service** - Extract email/push notifications
4. **Event Gateway** - API Gateway for routing
 
Clean Architecture makes this transition significantly easier than traditional layered architecture.
 
---
 
### Frontend: Vue 3 Best Practices Structure
 
The frontend follows **Vue 3 community best practices** with clear separation and scalability in mind.
 
#### Responsive Design Strategy
 
**Mobile-First Approach:**
- Primary target: Mobile phones in portrait orientation (athletes scoring on-the-go)
- Full-screen experience on mobile devices with no wasted space
- Landscape mode optimized for tablets and desktops (full-width utilization)
 
**Breakpoint Strategy:**
 
| Device Type | Orientation | Max Width | Layout Strategy |
|-------------|-------------|-----------|-----------------|
| Mobile Phone | Portrait | 767px | Full screen (100vw × 100dvh), no borders, native feel |
| Tablet | Portrait | 768px - 1023px | Constrained width (500px max), centered, subtle borders |
| Tablet/Desktop | Landscape | Any | Full width (100vw), optimized horizontal space |
| Desktop | Any | Any | Full width, expanded hit targets for mouse input |
 
**Viewport Handling:**
- Use `100dvh` (dynamic viewport height) for mobile browsers to account for URL bar hiding
- Remove all default padding from `v-main` container (`pa-0`)
- Scoresheet container adapts responsively without fixed dimensions
 
**Responsive Component Guidelines:**
- All interactive elements minimum 44×44px touch targets (WCAG AAA)
- Score buttons use `aspect-ratio: 1` for consistent sizing across devices
- Grid layouts use flexible units (fr, %, vw/vh) instead of fixed pixels
- Font sizes scale appropriately: 14px (mobile) to 16px+ (desktop)
 
#### Folder Structure
 
```
frontend/
├── public/                              # Static assets (served as-is)
│   ├── favicon.ico
│   └── robots.txt
│
├── src/
│   ├── api/                             # API client layer
│   │   ├── client.ts                    # Axios instance configuration
│   │   ├── interceptors.ts              # Request/response interceptors
│   │   └── services/                    # API service modules
│   │       ├── authService.ts
│   │       ├── eventService.ts
│   │       ├── scoreService.ts
│   │       └── bracketService.ts
│   │
│   ├── assets/                          # Static resources
│   │   ├── images/
│   │   │   ├── logo.svg
│   │   │   └── icons/
│   │   ├── fonts/
│   │   └── styles/                      # Global styles
│   │       └── animations.scss
│   │
│   ├── components/                      # Reusable components
│   │   ├── common/                      # Generic UI components
│   │   │   ├── AppButton.vue
│   │   │   ├── AppCard.vue
│   │   │   ├── AppDialog.vue
│   │   │   ├── AppTable.vue
│   │   │   └── AppLoader.vue
│   │   ├── events/                      # Event-specific components
│   │   │   ├── EventCard.vue
│   │   │   ├── EventForm.vue
│   │   │   └── EventList.vue
│   │   ├── scoring/                     # Scoring UI components
│   │   │   ├── ScoreInput.vue
│   │   │   ├── Leaderboard.vue
│   │   │   └── ScoreHistory.vue
│   │   └── brackets/                    # Bracket visualization
│   │       ├── BracketTree.vue
│   │       ├── BracketMatch.vue
│   │       └── SetScoreInput.vue
│   │
│   ├── composables/                     # Composition API logic
│   │   ├── useAuth.ts                   # Authentication logic
│   │   ├── useWebSocket.ts              # SignalR connection management
│   │   ├── useScoring.ts                # Scoring business logic
│   │   ├── useNotifications.ts          # Toast notifications
│   │   └── usePagination.ts             # Pagination logic
│   │
│   ├── directives/                      # Custom Vue directives
│   │   ├── vClickOutside.ts
│   │   ├── vLazyLoad.ts
│   │   └── index.ts
│   │
│   ├── layouts/                         # Page layouts
│   │   ├── DefaultLayout.vue            # Main layout with nav
│   │   ├── AuthLayout.vue               # Login/register layout
│   │   ├── MobileLayout.vue             # Mobile-optimized layout
│   │   └── SpectatorLayout.vue          # Full-screen display layout
│   │
│   ├── locales/                         # Internationalization (i18n)
│   │   ├── en.json                      # English translations
│   │   ├── vi.json                      # Vietnamese translations
│   │   └── index.ts                     # i18n configuration
│   │
│   ├── plugins/                         # Vue plugins
│   │   ├── vuetify.ts                   # Vuetify configuration
│   │   ├── i18n.ts                      # Vue I18n setup
│   │   └── index.ts
│   │
│   ├── router/                          # Vue Router
│   │   ├── index.ts                     # Router configuration
│   │   ├── guards.ts                    # Navigation guards (auth check)
│   │   └── routes/
│   │       ├── auth.ts                  # Auth routes
│   │       ├── events.ts                # Event routes
│   │       ├── scoring.ts               # Scoring routes
│   │       └── brackets.ts              # Bracket routes
│   │
│   ├── store/                           # Pinia state management
│   │   ├── index.ts                     # Pinia setup
│   │   └── modules/
│   │       ├── auth.ts                  # Auth state (user, token)
│   │       ├── events.ts                # Events state
│   │       ├── scores.ts                # Scores & leaderboard state
│   │       ├── brackets.ts              # Bracket state
│   │       └── ui.ts                    # UI state (drawer, theme)
│   │
│   ├── styles/                          # Global styles
│   │   ├── variables.scss               # SCSS variables
│   │   ├── mixins.scss                  # SCSS mixins
│   │   ├── reset.scss                   # CSS reset
│   │   ├── typography.scss              # Font styles
│   │   └── main.scss                    # Main stylesheet
│   │
│   ├── types/                           # TypeScript definitions
│   │   ├── api.ts                       # API response types
│   │   ├── models.ts                    # Domain models
│   │   ├── store.ts                     # Store types
│   │   └── global.d.ts                  # Global type augmentations
│   │
│   ├── utils/                           # Utility functions
│   │   ├── date.ts                      # Date formatting/parsing
│   │   ├── validation.ts                # Input validation helpers
│   │   ├── format.ts                    # Number/string formatting
│   │   └── constants.ts                 # App constants
│   │
│   ├── views/                           # Page components (routed)
│   │   ├── auth/
│   │   │   ├── LoginView.vue
│   │   │   ├── RegisterView.vue
│   │   │   └── ForgotPasswordView.vue
│   │   ├── events/
│   │   │   ├── EventsView.vue           # List all events
│   │   │   ├── EventDetailsView.vue     # Single event
│   │   │   ├── CreateEventView.vue      # Create event form
│   │   │   └── MyEventsView.vue         # User's events
│   │   ├── scoring/
│   │   │   ├── ScoreInputView.vue       # Submit scores
│   │   │   ├── LeaderboardView.vue      # Live leaderboard
│   │   │   └── ScoreHistoryView.vue     # Athlete's score history
│   │   ├── brackets/
│   │   │   ├── BracketView.vue          # Bracket visualization
│   │   │   └── MatchView.vue            # Single match details
│   │   ├── profile/
│   │   │   └── ProfileView.vue
│   │   └── HomeView.vue
│   │
│   ├── App.vue                          # Root component
│   ├── main.ts                          # Application entry point
│   └── vite-env.d.ts                    # Vite type definitions
│
├── tests/                               # Tests
│   ├── unit/
│   │   ├── components/
│   │   └── composables/
│   └── e2e/
│       └── specs/
│
├── .env                                 # Environment variables
├── .env.example                         # Example env file
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json                        # TypeScript config
├── vite.config.ts                       # Vite config
└── README.md
```
 
#### Key Frontend Patterns
 
**1. Composition API with Composables**
```typescript
// composables/useAuth.ts
export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()
 
  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password })
    authStore.setUser(response.user)
    authStore.setToken(response.accessToken)
    router.push('/events')
  }
 
  const logout = () => {
    authStore.clearAuth()
    router.push('/login')
  }
 
  return { login, logout, user: computed(() => authStore.user) }
}
 
// Usage in component
const { login, logout, user } = useAuth()
```
 
**2. Pinia Store Structure**
```typescript
// store/modules/events.ts
import { defineStore } from 'pinia'
import { eventService } from '@/api/services/eventService'
 
export const useEventStore = defineStore('events', {
  state: () => ({
    events: [] as Event[],
    currentEvent: null as Event | null,
    loading: false,
    error: null as string | null
  }),
 
  getters: {
    upcomingEvents: (state) => state.events.filter(e => e.status === 'OpenForRegistration'),
    myEvents: (state) => state.events.filter(e => e.hostUserId === authStore.user?.id)
  },
 
  actions: {
    async fetchEvents() {
      this.loading = true
      try {
        this.events = await eventService.getAll()
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    }
  }
})
```
 
**3. API Service Layer**
```typescript
// api/services/eventService.ts
import { apiClient } from '../client'
import type { Event, CreateEventRequest } from '@/types/api'
 
export const eventService = {
  getAll: () => apiClient.get<Event[]>('/events'),
 
  getById: (id: string) => apiClient.get<Event>(`/events/${id}`),
 
  create: (data: CreateEventRequest) => apiClient.post<Event>('/events', data),
 
  update: (id: string, data: Partial<Event>) => apiClient.put<Event>(`/events/${id}`, data),
 
  delete: (id: string) => apiClient.delete(`/events/${id}`)
}
```
 
**4. Internationalization**
```typescript
// locales/en.json
{
  "auth": {
    "login": "Login",
    "logout": "Logout",
    "email": "Email Address",
    "password": "Password"
  },
  "events": {
    "title": "Events",
    "create": "Create Event",
    "upcoming": "Upcoming Events"
  }
}
 
// Usage in component
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
 
<template>
  <h1>{{ t('events.title') }}</h1>
</template>
```
 
**5. TypeScript Types**
```typescript
// types/models.ts
export interface Event {
  id: string
  name: string
  location: string
  startDate: Date
  endDate: Date
  status: EventStatus
  isPublic: boolean
}
 
export enum EventStatus {
  Draft = 'Draft',
  OpenForRegistration = 'OpenForRegistration',
  InProgress = 'InProgress',
  Completed = 'Completed'
}
```
 
#### Frontend Benefits
 
✅ **Scalability** - Organized structure supports growth  
✅ **Maintainability** - Clear separation of concerns  
✅ **Team Collaboration** - Multiple developers can work in parallel  
✅ **Type Safety** - TypeScript prevents runtime errors  
✅ **i18n Ready** - Multi-language from day one  
✅ **Testing** - Easy to test components and composables  
✅ **Performance** - Code splitting and lazy loading built-in
 
---
 
## Design Decisions
 
### Why Monolithic Architecture?
 
**Decision:** Start with monolithic architecture (separate repos for frontend/backend)
 
**Rationale:**
- Simpler deployment for MVP
- Easier to develop and debug
- Lower operational complexity
- Sufficient for expected load (100+ concurrent events)
- Can migrate to microservices later if needed
 
**Trade-offs:**
- ✅ Faster development
- ✅ Single deployment unit
- ✅ No distributed system complexity
- ❌ Scaling requires scaling entire backend
- ❌ Tighter coupling
 
### Why PostgreSQL over NoSQL?
 
**Decision:** PostgreSQL as primary database
 
**Rationale:**
- Complex relationships (users, events, games, scores, brackets)
- ACID compliance critical for competition integrity
- Strong support for JSON (JSONB for flexible data)
- Mature, battle-tested, excellent performance
- Rich query capabilities for leaderboards and rankings
 
**Trade-offs:**
- ✅ Data integrity guarantees
- ✅ Complex query support
- ✅ Excellent tooling
- ❌ Vertical scaling limits (mitigated by proper indexing)
 
### Why SignalR over Raw WebSockets?
 
**Decision:** SignalR for real-time communication
 
**Rationale:**
- Higher-level abstraction (easier to work with)
- Automatic fallback (WebSockets → SSE → Long Polling)
- Built-in reconnection logic
- TypeScript client support
- Seamless integration with ASP.NET Core
 
**Trade-offs:**
- ✅ Developer productivity
- ✅ Cross-platform clients
- ✅ Automatic scaling support
- ❌ Slightly more overhead than raw WebSockets
 
### Why Blue-Green over Rolling Deployment?
 
**Decision:** Blue-green deployment strategy
 
**Rationale:**
- Zero downtime deployments
- Instant rollback capability
- Full environment testing before switch
- Simple implementation with Nginx
- Clear separation of old/new versions
 
**Trade-offs:**
- ✅ Zero downtime
- ✅ Fast rollback
- ❌ Requires 2x infrastructure (but minimal for VPS)
- ❌ Database migration coordination needed
 
### Why Nginx over Cloud Load Balancer?
 
**Decision:** Nginx for reverse proxy and load balancing
 
**Rationale:**
- Full control over configuration
- Built-in WAF capabilities
- No vendor lock-in
- Lower cost (runs on same VPS)
- SSL termination + load balancing in one
 
**Trade-offs:**
- ✅ Cost effective
- ✅ Full control
- ✅ Single point of configuration
- ❌ Manual scaling vs auto-scaling cloud LB
- ❌ Self-managed SSL renewal
 
---
 
## Next Steps
 
### Implementation Roadmap
 
**Phase 1: Infrastructure Setup (Week 1-2)**
1. Set up VPS with Docker
2. Configure Nginx with SSL
3. Deploy monitoring stack (Prometheus + Grafana + Loki)
4. Set up PostgreSQL
5. Configure CI/CD pipelines
 
**Phase 2: Backend Core (Week 3-5)**
1. Project structure and architecture
2. Database models and migrations
3. Authentication & authorization
4. Event & game management APIs
5. Unit tests
 
**Phase 3: Frontend Foundation (Week 6-8)**
1. Vue 3 + Vuetify setup
2. Mock API responses
3. Responsive layouts
4. Core UI components
5. State management
 
**Phase 4: Real-Time Features (Week 9-12)**
1. SignalR implementation
2. Score submission
3. Live leaderboard
4. WebSocket connection management
5. Integration tests
 
**Phase 5: Tournament System (Week 13-16)**
1. Bracket generation logic
2. Match progression
3. Set-based scoring
4. Shoot-off resolution
5. End-to-end tests
 
**Phase 6: Security & Performance (Week 17-19)**
1. Rate limiting fine-tuning
2. Security audit
3. Load testing
4. Performance optimization
5. Documentation
 
**Phase 7: Production Launch (Week 20)**
1. Final testing
2. Data migration (if applicable)
3. Blue-green deployment
4. Monitoring validation
5. Go live! 🚀
 
---
 
**Document Status:** ✅ Complete  
**Ready for:** Epic breakdown and development kickoff  
**Last Updated:** November 6, 2025
 