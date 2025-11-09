# Archery Event Management System - Epic & Story Breakdown

**Author:** TruongPham  
**Date:** November 7, 2025  
**Project Level:** Level 3 (Complex System)  
**Target Scale:** Production-grade SaaS platform with real-time scoring

---

## Overview

This document provides the complete epic and user story breakdown for the Archery Event Management System. The project is organized into **10 epics** with **42 user stories** designed to be implementable by development agents.

**Development Approach:**
- Stories are **vertically sliced** - each delivers complete, testable functionality
- Stories are **sequentially ordered** within epics - logical build-up progression
- Stories are **AI-agent sized** - completable in 2-4 hour focused sessions
- **No forward dependencies** - stories only depend on previous completed work

**Epic Overview:**

| Epic | Name | Stories | Weeks | Priority |
|------|------|---------|-------|----------|
| 1 | Infrastructure & Security Foundation | 7 | 1-2 | P0 (Critical) |
| 2 | User & Access Management | 5 | 3 | P0 (Critical) |
| 3 | Event & Game Configuration | 4 | 4 | P0 (Critical) |
| 4 | Participation & Registration | 4 | 5 | P0 (Critical) |
| 5 | Real-Time Qualification Scoring | 6 | 6-8 | P0 (Critical) |
| 6 | Elimination Tournament System | 6 | 9-11 | P0 (Critical) |
| 7 | Observer & Spectator Experience | 3 | 12 | P1 (Important) |
| 8 | Observability & Monitoring | 6 | 13-14 | P1 (Important) |
| 9 | DevOps & Deployment Pipeline | 3 | 15-16 | P0 (Critical) |
| 10 | Mobile & Responsive UI | 3 | Parallel 6-16 | P0 (Critical) |

**Total Stories:** 47  
**Estimated Duration:** 16-20 weeks to production MVP

**Coding Standards:**
- **Backend:** Jason Taylor Clean Architecture (ASP.NET Core 9)
- **Frontend:** Vue 3 best practices with organized folder structure
- See PRD.md and architecture.md for detailed standards

---

## Epic 1: Infrastructure & Security Foundation

**Goal:** Establish production-grade infrastructure with security, load balancing, and observability

**Business Value:** Create secure, scalable foundation for all application features

**Duration:** Weeks 1-2

---

### Story 1.1: Docker Compose Multi-Service Setup

**As a** DevOps engineer,  
**I want** a Docker Compose configuration for all services,  
**So that** the entire application stack can be deployed consistently across environments.

**Acceptance Criteria:**
1. Docker Compose file defines all services: Nginx, backend (x2), PostgreSQL, frontend, Prometheus, Grafana, Loki, Promtail
2. Services are connected via Docker bridge network
3. Named volumes created for persistent data (postgres-data, prometheus-data, grafana-data, loki-data)
4. Environment variables loaded from `.env` file
5. Health checks defined for critical services
6. Resource limits set for each container (CPU, memory)
7. Containers can be started with `docker-compose up -d` and stopped cleanly
8. All services can communicate internally via service names

**Technical Notes:**
- Use Docker Compose v3.8
- Alpine-based images where possible for smaller footprint
- Implement restart policies (restart: unless-stopped)

**Prerequisites:** None

---

### Story 1.2: Nginx Reverse Proxy & Load Balancer Configuration

**As a** system administrator,  
**I want** Nginx configured as reverse proxy and load balancer,  
**So that** traffic is distributed across backend instances with SSL termination.

**Acceptance Criteria:**
1. Nginx configuration serves frontend static files on `/`
2. API requests `/api/*` are load-balanced across 2 backend instances using least-connections algorithm
3. WebSocket requests `/hubs/*` are properly upgraded and proxied
4. Health check endpoint `/health` returns 200 OK
5. HTTP traffic on port 80 redirects to HTTPS on port 443
6. SSL/TLS certificates configured (self-signed for dev, Let's Encrypt for prod)
7. Security headers added: HSTS, X-Frame-Options, X-Content-Type-Options, CSP
8. Request size limit set to 10MB
9. Load balancer automatically removes unhealthy backend instances

**Technical Notes:**
- Use `nginx:alpine` Docker image
- Mount nginx.conf from host
- Configure upstream with health checks every 10 seconds
- Enable HTTP/2 support

**Prerequisites:** Story 1.1 (Docker Compose setup)

---

### Story 1.3: SSL/TLS Certificate Setup with Let's Encrypt

**As a** security engineer,  
**I want** automated SSL/TLS certificate provisioning and renewal,  
**So that** all traffic is encrypted with valid certificates.

**Acceptance Criteria:**
1. Certbot container configured to obtain Let's Encrypt certificates
2. Certificates automatically renewed 30 days before expiration
3. Nginx configured to use certificates from shared volume
4. HTTP to HTTPS redirect enforced
5. TLS 1.3 preferred, TLS 1.2 minimum
6. Strong cipher suites configured (no weak ciphers)
7. Certificate expiration monitoring alert configured in Prometheus
8. Self-signed certificates used for local development

**Technical Notes:**
- Use certbot/certbot Docker image
- Certificates stored in named volume shared with Nginx
- Renewal cron job runs daily
- Alert when cert expires in < 30 days

**Prerequisites:** Story 1.2 (Nginx configured)

---

### Story 1.4: Rate Limiting & WAF Rules Implementation

**As a** security engineer,  
**I want** rate limiting and basic WAF protection,  
**So that** the system is protected from abuse and common attacks.

**Acceptance Criteria:**
1. Rate limits configured in Nginx:
   - Auth endpoints: 5 requests/minute per IP
   - General API: 100 requests/minute per authenticated user
   - Score submissions: 30 requests/minute per athlete
2. 429 (Too Many Requests) response returned when limits exceeded with Retry-After header
3. Rate limit zones defined with appropriate memory allocation
4. Basic WAF rules block common attack patterns:
   - SQL injection patterns in query params
   - XSS patterns in headers
   - Path traversal attempts
5. Request logging includes rate limit violations
6. IP whitelist capability for admin/monitoring tools
7. Burst capacity configured for legitimate traffic spikes

**Technical Notes:**
- Use Nginx ngx_http_limit_req_module
- Define limit zones: auth_limit, api_limit, score_limit
- Log violations to separate file for security monitoring

**Prerequisites:** Story 1.2 (Nginx configured)

---

### Story 1.5: PostgreSQL Database Container Setup

**As a** backend developer,  
**I want** PostgreSQL database running in Docker with persistence,  
**So that** application data is stored reliably.

**Acceptance Criteria:**
1. PostgreSQL 15 container running from official Alpine image
2. Database initialized with credentials from environment variables
3. Data persisted in named Docker volume (postgres-data)
4. Database accessible only from backend containers (not exposed to host)
5. Connection pooling configured (max 100 connections)
6. Automated backup script configured (daily backups, 30-day retention)
7. Database health check endpoint responds
8. Initial database schema can be applied via migrations

**Technical Notes:**
- Use postgres:15-alpine image
- Configure shared_buffers, effective_cache_size for VPS resources
- Set timezone to UTC
- Enable logging for slow queries (> 1000ms)

**Prerequisites:** Story 1.1 (Docker Compose setup)

---

### Story 1.6: HashiCorp Vault Secrets Management Setup

**As a** DevOps engineer,  
**I want** HashiCorp Vault deployed for centralized secrets management,  
**So that** sensitive credentials are never hardcoded or stored in environment files.

**Acceptance Criteria:**
1. Vault container added to Docker Compose with hashicorp/vault:latest image
2. Vault initialized with unseal keys stored securely (development mode for local)
3. Vault UI accessible on port 8200 (localhost only)
4. Secrets engine (kv-v2) enabled for storing application secrets
5. Secrets created in Vault:
   - Database connection strings (PostgreSQL credentials)
   - JWT signing secret and refresh token secret
   - Google OAuth client ID and client secret
   - Email service credentials (future)
6. Backend service configured to read secrets from Vault via environment variables or Vault API
7. Vault access token/AppRole configured for backend authentication
8. Vault data persisted in named volume (vault-data)
9. Health check endpoint `/v1/sys/health` returns 200 OK
10. Documentation added for local Vault setup and secret initialization

**Technical Notes:**
- Use Vault Docker container with volume mount for persistence
- For production: Use Vault server mode with auto-unseal
- For local dev: Use `-dev` mode for simplicity
- Backend uses VaultSharp or direct HTTP API to retrieve secrets
- Secrets loaded at application startup and cached securely
- Alternative: Use Docker Secrets if Vault not feasible

**Prerequisites:** Story 1.1 (Docker Compose setup), Story 1.5 (Database setup)

---

### Story 1.7: UFW Firewall Configuration for VPS Security

**As a** system administrator,  
**I want** UFW firewall configured on Ubuntu VPS,  
**So that** only necessary ports are exposed and the system is protected from unauthorized access.

**Acceptance Criteria:**
1. UFW installed and enabled on Ubuntu 24.04 LTS VPS
2. Default policies set: deny incoming, allow outgoing
3. Required ports opened:
   - Port 22 (SSH) - restricted to specific IP addresses or SSH key only
   - Port 80 (HTTP) - allow from anywhere
   - Port 443 (HTTPS) - allow from anywhere
   - Port 8200 (Vault UI) - allow from localhost only (internal access)
4. All other ports blocked by default
5. UFW status shows active with correct rules
6. Rate limiting enabled on SSH port (max 6 connections per 30 seconds)
7. Logging enabled (level: low) to `/var/log/ufw.log`
8. Docker containers can communicate through UFW (Docker iptables compatibility ensured)
9. Configuration documented in deployment guide

**Technical Notes:**
- Commands: `ufw allow 80/tcp`, `ufw allow 443/tcp`, `ufw limit 22/tcp`
- Ensure UFW rules apply before Docker modifies iptables
- Test firewall rules before enabling permanently
- Document fallback procedure if locked out via SSH
- Consider IP whitelisting for SSH in production

**Prerequisites:** Story 1.1 (Docker Compose setup)

---

## Epic 2: User & Access Management

**Goal:** Implement user authentication, authorization, and profile management

**Business Value:** Secure user access with role-based permissions

**Duration:** Week 3

---

### Story 2.1: User Registration & Authentication API

**As a** new user,  
**I want** to register an account with email and password,  
**So that** I can access the platform securely.

**Acceptance Criteria:**
1. POST `/api/v1/auth/register` endpoint accepts: email, password, firstName, lastName, role
2. Email validation enforced (valid format, unique in database)
3. Password validation: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
4. Password hashed with bcrypt (cost factor 12) before storing
5. User record created in PostgreSQL users table
6. Response returns user object (without password) and 201 Created status
7. Email already exists returns 400 Bad Request with clear error message
8. Validation errors return 400 with field-specific error details
9. Unit tests cover success and error cases

**Technical Notes:**
- **Follow Clean Architecture pattern** (see architecture.md)
- Create `ArcheryEvent.Domain` project for User entity
- Create `ArcheryEvent.Application` project with `RegisterUserCommand` and handler
- Create `ArcheryEvent.Infrastructure` project for DbContext and password hashing
- Create `ArcheryEvent.WebAPI` project with AuthController
- Use ASP.NET Core Identity or custom implementation
- Entity Framework Core for database access
- FluentValidation for input validation in Application layer
- Return standardized error responses

**Prerequisites:** Story 1.5 (Database setup)

---

### Story 2.2: JWT-Based Login & Token Management

**As a** registered user,  
**I want** to login with my credentials and receive secure tokens,  
**So that** I can access protected resources.

**Acceptance Criteria:**
1. POST `/api/v1/auth/login` endpoint accepts email and password
2. Credentials validated against database (email lookup, password hash comparison)
3. JWT access token generated (24-hour expiration) with claims: userId, email, role
4. Refresh token generated (30-day expiration) and stored in database
5. Response includes: accessToken, refreshToken, expiresIn, user object
6. Invalid credentials return 401 Unauthorized
7. POST `/api/v1/auth/refresh` endpoint accepts refresh token and returns new access token
8. Expired/invalid refresh tokens return 401
9. POST `/api/v1/auth/logout` invalidates refresh token
10. JWT secret loaded from environment variable

**Technical Notes:**
- **Clean Architecture:** Create `LoginCommand` in Application layer
- Use MediatR pattern for command handling
- Use Microsoft.AspNetCore.Authentication.JwtBearer
- Sign tokens with HS256 algorithm
- Store refresh tokens in database with expiration tracking
- Implement token rotation on refresh
- JWT configuration in WebAPI Program.cs

**Prerequisites:** Story 2.1 (User registration)

---

### Story 2.3: Role-Based Authorization Middleware

**As a** system,  
**I want** to enforce role-based access control on all endpoints,  
**So that** users can only perform actions they're authorized for.

**Acceptance Criteria:**
1. Authorization policies defined for roles: Admin, Host, Referee, Athlete
2. Protected endpoints require valid JWT token in Authorization header
3. Endpoints decorated with [Authorize] attribute and role requirements
4. 401 returned for missing/invalid token
5. 403 returned for insufficient permissions
6. Custom authorization handlers for complex rules (e.g., "host of event" check)
7. Authorization claims extracted from JWT and available in controllers
8. Unit tests verify authorization rules for each endpoint
9. Audit log entry created for authorization failures

**Technical Notes:**
- Use ASP.NET Core Authorization policies
- Create custom AuthorizationHandler for resource-based authorization
- Implement IAuthorizationRequirement interfaces
- Log authorization failures with user/IP details

**Prerequisites:** Story 2.2 (JWT login)

---

### Story 2.4: User Profile Management

**As a** logged-in user,  
**I want** to view and update my profile,  
**So that** I can maintain accurate personal information.

**Acceptance Criteria:**
1. GET `/api/v1/users/me` returns current user's profile (firstName, lastName, email, role, profilePhotoUrl, createdAt)
2. PUT `/api/v1/users/me` updates firstName, lastName
3. Email cannot be changed via this endpoint (requires separate verification flow)
4. Response returns updated user object
5. Only authenticated users can access their own profile
6. Validation ensures firstName and lastName are not empty
7. 401 returned for unauthenticated requests
8. Audit log entry created for profile updates

**Technical Notes:**
- Extract userId from JWT claims
- Use AutoMapper for entity-to-DTO mapping
- Return consistent API response format
- Don't expose password hash in any response

**Prerequisites:** Story 2.3 (Authorization middleware)

---

### Story 2.5: Google SSO Integration (OAuth 2.0)

**As a** new or existing user,  
**I want** to sign in using my Google account,  
**So that** I can access the platform without creating a separate password.

**Acceptance Criteria:**
1. Backend: Google OAuth 2.0 authentication configured using Google.Apis.Auth NuGet package
2. Google Cloud Console project created with OAuth 2.0 credentials (Client ID, Client Secret)
3. Backend: POST `/api/v1/auth/google` endpoint accepts Google ID token from frontend
4. Backend: Token verified using Google.Apis.Auth.GoogleJsonWebSignature.ValidateAsync()
5. Backend: User created or retrieved based on Google email (sub claim used as external ID)
6. Backend: JWT access token and refresh token generated for authenticated Google user
7. Frontend: Google Sign-In button implemented using Google Identity Services (GSI)
8. Frontend: Google Sign-In button triggers OAuth flow, sends ID token to backend
9. Frontend: JWT tokens stored securely and user redirected to dashboard
10. Google Client ID and Secret stored in HashiCorp Vault (not hardcoded)
11. Users can link existing email/password account with Google account
12. Error handling for invalid tokens, network failures, and consent denials

**Technical Notes:**
- **Backend:** Install Google.Apis.Auth NuGet package
- **Backend:** Create `GoogleAuthCommand` in Application layer with handler
- **Backend:** Validate Google token, extract email, given_name, family_name, sub
- **Backend:** Store Google sub in Users table (GoogleId column, nullable)
- **Frontend:** Use `<script src="https://accounts.google.com/gsi/client" async defer></script>`
- **Frontend:** Implement `handleCredentialResponse(response)` callback
- **Frontend:** Send response.credential (ID token) to backend `/api/v1/auth/google`
- Load Google Client ID from Vault secret (GOOGLE_OAUTH_CLIENT_ID)
- Redirect URI: Configure in Google Console (e.g., https://yourdomain.com/auth/google/callback)
- Scopes: openid, email, profile

**Prerequisites:** Story 2.2 (JWT login), Story 1.6 (Vault secrets management)

---

## Epic 3: Event & Game Configuration

**Goal:** Enable hosts to create and manage archery events and game configurations

**Business Value:** Core platform functionality for event organization

**Duration:** Week 4

---

### Story 3.1: Create Event API

**As a** host user,  
**I want** to create a new archery event,  
**So that** athletes and referees can register to participate.

**Acceptance Criteria:**
1. POST `/api/v1/events` endpoint accepts: name, description, location, startDate, endDate, registrationDeadline, isPublic
2. Requires authentication and Host or Admin role
3. Event record created with hostUserId from JWT token
4. Status automatically set to "Draft"
5. Validation: name required, dates logical (end > start, registration < start)
6. Response returns created event with 201 status and generated ID
7. Events table updated in PostgreSQL
8. Validation errors return 400 with details
9. Host can create multiple events

**Technical Notes:**
- Use EventsController with [Authorize(Roles = "Host,Admin")]
- Entity Framework Core for database operations
- Validate date logic in service layer
- Return EventDto (not entity directly)

**Prerequisites:** Story 2.3 (Authorization), Story 1.5 (Database)

---

### Story 3.2: Event CRUD Operations

**As a** host user,  
**I want** to view, update, and delete my events,  
**So that** I can manage event details and lifecycle.

**Acceptance Criteria:**
1. GET `/api/v1/events` returns list of all public events
2. GET `/api/v1/events/my` returns current user's events (as host or participant)
3. GET `/api/v1/events/{id}` returns single event details
4. PUT `/api/v1/events/{id}` updates event (only by host or admin)
5. DELETE `/api/v1/events/{id}` soft-deletes event (only by host or admin)
6. Authorization check: only event host or admin can modify
7. Cannot delete event with status "InProgress" or "Completed"
8. 404 returned for non-existent events
9. 403 returned for unauthorized update/delete attempts

**Technical Notes:**
- Implement resource-based authorization (IsEventHostRequirement)
- Soft delete: set deletedAt timestamp, filter in queries
- Include participants count in event list responses
- Paginate event lists (20 per page)

**Prerequisites:** Story 3.1 (Create event)

---

### Story 3.3: Game Configuration within Events

**As a** host user,  
**I want** to configure game types within my event,  
**So that** athletes can register for specific competitions.

**Acceptance Criteria:**
1. POST `/api/v1/events/{eventId}/games` creates game within event
2. Accepts: name, gameType (MenIndividual, WomenIndividual, MenTeam, WomenTeam), distance (30, 50, 70 meters), arrowCount (default 72)
3. Only event host or admin can create games
4. Multiple games can be created per event
5. GET `/api/v1/events/{eventId}/games` lists all games for event
6. PUT `/api/v1/games/{id}` updates game configuration
7. DELETE `/api/v1/games/{id}` deletes game (if no participants registered)
8. Game status initialized to "Registration"
9. Validation: distance must be positive, arrowCount must be positive

**Technical Notes:**
- Games table references events via foreign key
- Prevent deletion if athlete_games records exist
- Return game with participant count
- Use enum for GameType

**Prerequisites:** Story 3.2 (Event CRUD)

---

### Story 3.4: Event Status Management

**As a** host user,  
**I want** to manage event status transitions,  
**So that** the event lifecycle is controlled.

**Acceptance Criteria:**
1. PUT `/api/v1/events/{id}/status` endpoint updates event status
2. Valid transitions: Draft → OpenForRegistration → InProgress → Completed
3. Cannot skip statuses (must follow sequence)
4. Cannot move Completed event back to earlier status
5. Status change to "InProgress" validates all games have participants
6. Status "Completed" locks all scores in all games
7. Only host or admin can change status
8. Status changes logged in audit_logs table
9. Email notifications sent to participants on status changes (future: just log for now)

**Technical Notes:**
- Implement status transition validation in service layer
- Use state machine pattern for transitions
- Trigger score locking on Completed status
- Return 400 for invalid transitions

**Prerequisites:** Story 3.3 (Game configuration)

---

## Epic 4: Participation & Registration

**Goal:** Enable users to register for events as athletes or referees

**Business Value:** Build participant base for competitions

**Duration:** Week 5

---

### Story 4.1: Athlete Game Registration

**As an** athlete user,  
**I want** to register for games within an event,  
**So that** I can participate in competitions.

**Acceptance Criteria:**
1. POST `/api/v1/events/{eventId}/register-athlete` endpoint accepts array of gameIds
2. Requires authentication (any role can register as athlete)
3. Creates athlete_games records for user-game combinations
4. isApproved automatically set to true (immediate approval for athletes)
5. Cannot register after event registration deadline
6. Cannot register for same game twice
7. GET `/api/v1/events/{eventId}/my-games` returns user's registered games
8. Response returns confirmation with registered game details
9. Validation: event exists, games exist and belong to event, deadline not passed

**Technical Notes:**
- Use composite key (userId, gameId) in athlete_games table
- Check registrationDeadline before allowing registration
- Return 400 if already registered for game
- Include game details in response

**Prerequisites:** Story 3.3 (Games configured), Story 2.3 (Authorization)

---

### Story 4.2: Referee Application & Approval Workflow

**As a** user,  
**I want** to apply to be a referee for an event,  
**So that** I can help manage competitions.

**Acceptance Criteria:**
1. POST `/api/v1/events/{eventId}/register-referee` creates referee application
2. Creates referee_events record with status "Pending"
3. GET `/api/v1/events/{eventId}/referees/pending` returns pending referee applications (host/admin only)
4. PUT `/api/v1/events/{eventId}/referees/{userId}/approve` approves referee
5. PUT `/api/v1/events/{eventId}/referees/{userId}/reject` rejects referee
6. Only event host or admin can approve/reject
7. Approved referee gets scoring permissions for event
8. Approval/rejection updates status, sets approvedBy and approvedAt
9. User notified of approval/rejection status (log for now, email future)

**Technical Notes:**
- referee_events table with composite PK (userId, eventId)
- Status enum: Pending, Approved, Rejected
- Approval authorization check (IsEventHost)
- Include user details in referee list response

**Prerequisites:** Story 3.1 (Events created), Story 2.3 (Authorization)

---

### Story 4.3: Participant List Management

**As a** host user,  
**I want** to view all event participants,  
**So that** I can see who's registered.

**Acceptance Criteria:**
1. GET `/api/v1/events/{eventId}/participants` returns all participants (athletes + referees)
2. Response grouped by:
   - Athletes (by game)
   - Referees (approved, pending, rejected)
3. Includes user details: name, email, registration date
4. Only event host, approved referees, or admin can view full list
5. Public users can view athlete count only (if event is public)
6. Athletes can see other athletes in their games
7. Results paginated (50 per page)
8. Supports filtering by game, role, status

**Technical Notes:**
- Join athlete_games and referee_events with users table
- Use DTOs to shape response
- Implement query filters with LINQ
- Authorization: role-based + resource-based

**Prerequisites:** Story 4.1 (Athlete registration), Story 4.2 (Referee approval)

---

### Story 4.4: Unregister from Event/Game

**As a** participant,  
**I want** to withdraw my registration,  
**So that** I can cancel my participation if needed.

**Acceptance Criteria:**
1. DELETE `/api/v1/events/{eventId}/games/{gameId}/registration` removes athlete registration
2. DELETE `/api/v1/events/{eventId}/referee-application` withdraws referee application
3. Only user who registered can unregister
4. Cannot unregister after event status is "InProgress" or later
5. Cannot unregister if scores already submitted
6. Soft delete (mark as withdrawn rather than delete record)
7. Response confirms successful withdrawal
8. 403 returned if event already started

**Technical Notes:**
- Add withdrawnAt timestamp to athlete_games and referee_events
- Filter withdrawn records from participant lists
- Check for existing scores before allowing withdrawal
- Restore capacity for withdrawn participants

**Prerequisites:** Story 4.1 (Registration), Story 4.3 (Participant management)

---

## Epic 5: Real-Time Qualification Scoring

**Goal:** Implement real-time score submission, synchronization, and live leaderboard

**Business Value:** Core competition functionality with live updates

**Duration:** Weeks 6-8

---

### Story 5.1: SignalR Hub Setup & Connection Management

**As a** backend developer,  
**I want** SignalR hub infrastructure configured,  
**So that** real-time updates can be broadcast to clients.

**Acceptance Criteria:**
1. SignalR hub endpoint `/hubs/scores` configured in ASP.NET Core
2. ScoreHub class implements group management for games
3. JoinGameGroup(gameId) method adds connection to game-specific group
4. LeaveGameGroup(gameId) method removes connection from group
5. Authentication required for hub connections (JWT token)
6. Connection IDs tracked per user
7. Disconnection automatically removes from all groups
8. Hub startup configured in Program.cs
9. CORS policy allows WebSocket upgrade

**Technical Notes:**
- Use Microsoft.AspNetCore.SignalR
- Configure in Program.cs: app.MapHub<ScoreHub>("/hubs/scores")
- Implement IScoreClient interface for typed hub
- Enable WebSocket support in Kestrel

**Prerequisites:** Story 2.2 (JWT auth), Story 1.2 (Nginx WebSocket proxy)

---

### Story 5.2: Qualification Score Submission API

**As an** athlete,  
**I want** to submit my arrow scores for an end,  
**So that** my performance is recorded.

**Acceptance Criteria:**
1. POST `/api/v1/games/{gameId}/scores` accepts: endNumber, scores (array of 6 integers)
2. Validates: user is registered athlete for game, scores are 0-10, endNumber sequential
3. Creates qualification_scores record with calculated endTotal and cumulativeTotal
4. Athlete can only submit own scores
5. Cannot submit if scores are locked
6. Scores array must have exactly 6 values (or configured arrow count per end)
7. Response returns created score with rank update
8. Duplicate end submission returns 400
9. After successful save, triggers SignalR broadcast to game group

**Technical Notes:**
- Calculate endTotal = sum(scores)
- Calculate cumulativeTotal from previous ends
- Use transaction for score save + broadcast
- Return current rank in response

**Prerequisites:** Story 5.1 (SignalR hub), Story 4.1 (Athlete registration)

---

### Story 5.3: Real-Time Score Broadcasting via SignalR

**As a** spectator,  
**I want** to receive live score updates,  
**So that** I can follow the competition in real-time.

**Acceptance Criteria:**
1. When score submitted, ScoreHub broadcasts to game group
2. Broadcast includes: athleteId, athleteName, endNumber, endTotal, cumulativeTotal, rank
3. All connected clients in game group receive update within 2 seconds
4. Broadcast method: ReceiveScoreUpdate(ScoreUpdateDto)
5. Includes updated leaderboard top 10 in broadcast
6. Handles concurrent score submissions gracefully
7. Failed broadcasts logged but don't block API response
8. Reconnected clients receive current state

**Technical Notes:**
- Use IHubContext<ScoreHub> injection in controller
- Broadcast after successful database commit
- Use async/await for non-blocking
- Include timestamp in broadcast payload

**Prerequisites:** Story 5.2 (Score submission API), Story 5.1 (SignalR hub)

---

### Story 5.4: Backend API for End Submission with Idempotency

**As an** athlete,  
**I want** reliable end submission with idempotency,  
**So that** my scores are saved correctly even with network issues.

**Acceptance Criteria:**
1. POST `/api/v1/events/{eventId}/competitions/{competitionId}/rounds/{roundId}/ends` accepts end submission
2. Payload: `{ athleteId, endNumber, arrows: ["10","9","10","8","9","10"], timestamp }`
3. Response 200 OK: `{ confirmed: true, lockedAt: timestamp }`
4. Response 503: Service unavailable (network/database failure)
5. Response 412: Conflict (host locked competition, scoring closed)
6. Idempotency key support (use request header `Idempotency-Key`)
7. Duplicate submissions return cached response (prevent double-save)
8. Validates: athlete authorized, scoring open, arrow count correct, sequential end numbers
9. Transaction-safe: score save + broadcast together

**Technical Notes:**
- Use ASP.NET Core idempotency middleware or custom implementation
- Store idempotency keys with 24-hour TTL (Redis or in-memory cache)
- Calculate end sum: X/10=10, M=0
- Trigger SignalR broadcast after commit
- Return 412 if competition status is "closed" or "finalized"

**Prerequisites:** Story 5.1 (SignalR hub), Story 4.1 (Athlete registration), Story 2.2 (JWT auth)

---

### Story 5.5: SignalR Hub for Score Broadcast

**As a** spectator or athlete,  
**I want** real-time score updates via SignalR,  
**So that** I see live results without polling.

**Acceptance Criteria:**
1. `ScoringHub.cs` implements SignalR hub
2. Client event: `OnEndConfirmed(athleteId, endNumber, sum, cumulativeTotal, timestamp)`
3. Hub groups scoped to competition (not global)
4. Clients subscribe: `connection.on('OnEndConfirmed', callback)`
5. All connected clients in competition group receive updates within 500ms
6. Reconnection logic: clients auto-reconnect on disconnect
7. Authentication required: JWT token via query string or header
8. Graceful degradation: failed broadcasts logged but don't block API
9. Includes current leaderboard snapshot in broadcast

**Technical Notes:**
- Use `IHubContext<ScoringHub>` injection in end submission controller
- Group name: `competition_{competitionId}`
- Configure in Program.cs: `app.MapHub<ScoringHub>("/hubs/scoring")`
- Enable WebSocket support, fallback to long-polling
- Use typed hub with `IScoreClient` interface

**Prerequisites:** Story 5.4 (End submission API), Story 1.2 (Nginx WebSocket proxy), Story 2.2 (JWT auth)

---

### Story 5.6: Live Leaderboard Calculation & API

**As a** user,  
**I want** to view real-time ranked leaderboard,  
**So that** I can see athlete standings.

**Acceptance Criteria:**
1. GET `/api/v1/games/{gameId}/leaderboard` returns ranked list of athletes
2. Sorted by cumulativeTotal descending
3. Includes: rank, athleteId, athleteName, totalScore, endsCompleted, lastUpdated
4. Handles ties (same rank for equal scores)
5. Public endpoint (no auth required if event is public)
6. Cached for 5 seconds to reduce database load
7. Real-time updates via SignalR (not polling)
8. Supports pagination (top 50 default, all on request)

**Technical Notes:**
- Aggregate scores from qualification_scores table
- Use RANK() window function in SQL
- Cache with MemoryCache, invalidate on new scores
- Return 304 Not Modified if no changes

**Prerequisites:** Story 5.3 (Real-time broadcasting)

---

### Story 5.5: Referee/Host Score Update & Correction

**As a** referee or host,  
**I want** to update any athlete's scores,  
**So that** I can correct errors or input scores on behalf of athletes.

**Acceptance Criteria:**
1. PUT `/api/v1/scores/{id}` updates existing score
2. Requires Referee (for event) or Host (for event) or Admin role
3. Can update scores array, recalculates endTotal and cumulativeTotal
4. Can update locked scores (referee/host override)
5. Audit log entry created with: who updated, old value, new value, timestamp
6. Updated score triggers SignalR broadcast
7. Cannot update scores for different event/game than authorized for
8. Response returns updated score with new rank

**Technical Notes:**
- Check referee authorization via referee_events table
- Store old_value in audit_logs before update
- Recalculate cumulative totals for subsequent ends
- Resource-based authorization (IsEventRefereeOrHost)

**Prerequisites:** Story 5.2 (Score submission), Story 4.2 (Referee approval)

---

### Story 5.6: Score Locking Mechanism

**As a** host,  
**I want** to lock qualification scores,  
**So that** final rankings are preserved before elimination round.

**Acceptance Criteria:**
1. POST `/api/v1/games/{gameId}/scores/lock` locks all scores for game
2. Only host or admin can lock scores
3. Sets isLocked = true for all qualification_scores in game
4. Locked scores cannot be updated by athletes
5. Locked scores can still be updated by referee/host (with audit trail)
6. GET `/api/v1/games/{gameId}/scores/status` returns lock status
7. Lock action triggers final leaderboard snapshot
8. Cannot unlock scores once locked (one-way operation)

**Technical Notes:**
- Bulk update query for performance
- Transaction to ensure atomicity
- Snapshot final rankings to separate table (optional)
- Trigger SignalR broadcast of lock status

**Prerequisites:** Story 5.2 (Score submission), Story 5.5 (Score updates)

---

## Epic 6: Elimination Tournament System

**Goal:** Implement tournament bracket generation, match progression, and shoot-off resolution

**Business Value:** Professional tournament experience with head-to-head competitions

**Duration:** Weeks 9-11

---

### Story 6.1: Generate Elimination Bracket from Qualification Results

**As a** host,  
**I want** to generate tournament bracket from top-ranked athletes,  
**So that** elimination rounds can begin.

**Acceptance Criteria:**
1. POST `/api/v1/games/{gameId}/brackets/generate` creates elimination bracket
2. Accepts: roundSize (8, 16, 32, etc.)
3. Only host or admin can generate bracket
4. Selects top N athletes from locked qualification scores
5. Creates bracket matches with standard seeding: #1 vs #N, #2 vs #(N-1), etc.
6. Stores matches in elimination_brackets table
7. Each match has: round number, match number, athlete1, athlete2, status "Pending"
8. Cannot generate if scores not locked
9. Cannot generate if bracket already exists
10. Response returns complete bracket structure

**Technical Notes:**
- Validate qualification scores are locked
- Use tournament seeding algorithm
- Create matches for round 1 (e.g., Round of 16)
- Calculate total rounds based on bracket size
- Initialize all matches with status "Pending"

**Prerequisites:** Story 5.6 (Score locking), Story 3.3 (Game configuration)

---

### Story 6.2: View Tournament Bracket Structure

**As a** user,  
**I want** to view the tournament bracket,  
**So that** I can see matchups and progression.

**Acceptance Criteria:**
1. GET `/api/v1/games/{gameId}/brackets` returns complete bracket tree structure
2. Response organized by rounds: Round of 16, Quarterfinals, Semifinals, Finals
3. Each match includes: matchNumber, athlete1Name, athlete2Name, scores, winner, status
4. Shows progression (winners advance to next round matches)
5. Public endpoint (no auth if event public)
6. Indicates current/upcoming matches
7. Completed matches show final scores and winner
8. Empty slots for future matches (TBD)

**Technical Notes:**
- Build tree structure from flat elimination_brackets records
- Use recursive query or application logic to build hierarchy
- Include athlete details via joins
- Cache bracket structure (invalidate on updates)

**Prerequisites:** Story 6.1 (Bracket generation)

---

### Story 6.3: Set-Based Scoring for Elimination Matches

**As a** referee or athlete,  
**I want** to submit set scores for elimination matches,  
**So that** match winners are determined.

**Acceptance Criteria:**
1. POST `/api/v1/brackets/{bracketId}/sets` creates new set score
2. Accepts: setNumber, athlete1Score, athlete2Score
3. Calculates points: 2 for winner, 1 each for draw, 0 for loser
4. Updates athlete1SetsWon and athlete2SetsWon in bracket
5. Match completed when one athlete reaches 6 points
6. Sets winnerId when match completed
7. Athletes or referees for event can submit scores
8. Cannot submit after match completed
9. Triggers SignalR broadcast of match update

**Technical Notes:**
- Store sets in elimination_sets table
- Business logic: determine set winner, award points
- Check for match completion after each set
- Atomic transaction for set insert + bracket update

**Prerequisites:** Story 6.2 (View brackets), Story 5.1 (SignalR)

---

### Story 6.4: Shoot-Off Resolution for Tied Matches

**As a** referee,  
**I want** to resolve 5-5 tied matches via shoot-off,  
**So that** a winner is determined.

**Acceptance Criteria:**
1. PUT `/api/v1/brackets/{bracketId}/shoot-off` resolves shoot-off
2. Accepts: shootOffWinnerId
3. Only referee or host can resolve shoot-off
4. Match must be tied 5-5 to allow shoot-off resolution
5. Sets isShootOff = true
6. Sets shootOffWinnerId and winnerId
7. Updates match status to "Completed"
8. Cannot change shoot-off winner once set
9. Triggers SignalR broadcast of match completion

**Technical Notes:**
- Validate match is actually tied before allowing
- Referee authorization check
- Audit log entry for shoot-off decision
- Broadcast includes shoot-off indicator

**Prerequisites:** Story 6.3 (Set scoring)

---

### Story 6.5: Automatic Match Progression to Next Round

**As a** system,  
**I want** winners to automatically advance to next round,  
**So that** bracket updates without manual intervention.

**Acceptance Criteria:**
1. When match completed (winner determined), next round match identified
2. Winner's ID populated in appropriate slot of next round match
3. If both slots filled in next match, status updated to "Pending" (ready to start)
4. Finals winner becomes champion (no next round)
5. Semifinals losers compete for 3rd place (optional, log for now)
6. All progression automatic, no manual steps
7. Bracket tree structure remains valid
8. Real-time broadcast shows bracket updates

**Technical Notes:**
- Calculate next round match number algorithmically
- Use match number patterns for bracket navigation
- Trigger progression in same transaction as match completion
- Handle bye matches (odd number of participants)

**Prerequisites:** Story 6.3 (Set scoring), Story 6.4 (Shoot-off)

---

### Story 6.6: Tournament Completion & Final Results

**As a** host,  
**I want** to finalize tournament results,  
**So that** winners are officially recognized.

**Acceptance Criteria:**
1. When finals match completed, tournament marked complete
2. GET `/api/v1/games/{gameId}/results` returns final standings:
   - 1st place (finals winner)
   - 2nd place (finals loser)
   - 3rd/4th place (semifinals losers)
3. Game status updated to "Completed"
4. All bracket data immutable after completion
5. Results accessible publicly (if event public)
6. Results include qualification scores + elimination performance
7. Export capability (JSON format for MVP)

**Technical Notes:**
- Derive standings from bracket structure
- Lock all elimination data on completion
- Store final results snapshot
- Future: PDF export, podium display

**Prerequisites:** Story 6.5 (Match progression)

---

## Epic 7: Observer & Spectator Experience

**Goal:** Provide optimized viewing experience for non-participants

**Business Value:** Engage broader audience, build community

**Duration:** Week 12

---

### Story 7.1: Public Event Discovery & Listing

**As a** spectator,  
**I want** to discover public events,  
**So that** I can find competitions to watch.

**Acceptance Criteria:**
1. GET `/api/v1/events/public` returns list of public events
2. No authentication required
3. Filters: upcoming events, in-progress events, completed events
4. Includes: name, location, dates, participant count, status
5. Sorted by start date (upcoming first)
6. Pagination (20 per page)
7. Search by name or location
8. Shows game types available in each event

**Technical Notes:**
- Query only events with isPublic = true
- Include aggregated counts (athletes, games)
- Use index on isPublic, startDate for performance
- Cache for 5 minutes

**Prerequisites:** Story 3.1 (Event creation)

---

### Story 7.2: Desktop-Optimized Full-Screen Leaderboard View

**As a** spectator on desktop,  
**I want** a full-screen leaderboard view,  
**So that** I can easily see rankings on a large display.

**Acceptance Criteria:**
1. GET `/api/v1/games/{gameId}/leaderboard/display` returns optimized leaderboard
2. Includes top 20 athletes with large, readable formatting
3. Auto-refreshes via SignalR (no page reload)
4. Shows: rank, athlete name, current score, trend (up/down/same)
5. Highlights score changes with animation
6. Full-screen mode available (browser F11)
7. Responsive to desktop screen sizes (1080p, 1440p, 4K)
8. Public access (no auth required if event public)

**Technical Notes:**
- Frontend: Vue component with auto-refresh
- Use CSS Grid for responsive columns
- Animate rank changes with transitions
- SignalR connection for live updates

**Prerequisites:** Story 5.4 (Leaderboard API), Story 5.3 (SignalR broadcast)

---

### Story 7.3: Real-Time Bracket Visualization for Spectators

**As a** spectator,  
**I want** to see live bracket updates,  
**So that** I can follow tournament progression.

**Acceptance Criteria:**
1. Bracket view component displays tournament tree
2. Real-time updates via SignalR when matches complete
3. Shows match status: pending, in-progress, completed
4. Highlights current matches
5. Shows scores for completed matches
6. Visual lines connecting rounds
7. Responsive design (works on mobile and desktop)
8. Auto-scrolls to active matches

**Technical Notes:**
- Frontend: SVG or Canvas for bracket drawing
- SignalR connection to bracket hub
- Smooth animations for match updates
- Scroll to viewport center for active match

**Prerequisites:** Story 6.2 (Bracket API), Story 6.3 (Match updates)

---

## Epic 8: Observability & Monitoring

**Goal:** Complete system visibility with metrics, logs, and alerts

**Business Value:** Proactive issue detection, performance monitoring, operational excellence

**Duration:** Weeks 13-14

---

### Story 8.1: Prometheus Metrics Collection Setup

**As a** DevOps engineer,  
**I want** Prometheus collecting metrics from all services,  
**So that** system performance can be monitored.

**Acceptance Criteria:**
1. Prometheus container configured in docker-compose
2. prometheus.yml configures scrape targets:
   - ASP.NET Core app metrics (prometheus-net) on /metrics
   - Nginx metrics (nginx-exporter) on :9113/metrics
   - PostgreSQL metrics (postgres_exporter) on :9187/metrics
   - Node metrics (node_exporter) on :9100/metrics
3. Scrape interval: 15 seconds
4. Metrics retention: 30 days
5. Prometheus accessible at http://localhost:9090
6. Health endpoint showing all targets UP
7. Custom metrics configured:
   - http_requests_total (by endpoint, status)
   - http_request_duration_seconds (histogram)
   - signalr_connections_active
   - score_submissions_total

**Technical Notes:**
- Use prom/prometheus:latest image
- Mount config from ./prometheus/prometheus.yml
- Add prometheus-net package to ASP.NET Core
- Configure exporters for Nginx and PostgreSQL

**Prerequisites:** Story 1.1 (Docker Compose)

---

### Story 8.2: Grafana Dashboards Configuration

**As a** system administrator,  
**I want** pre-configured Grafana dashboards,  
**So that** I can visualize metrics easily.

**Acceptance Criteria:**
1. Grafana container running and accessible at http://localhost:3000
2. Prometheus configured as data source
3. Five dashboards provisioned:
   - **System Overview:** CPU, memory, disk, network across containers
   - **API Performance:** request rate, latency (p50/p95/p99), error rate
   - **Database Performance:** connections, query time, cache hit ratio
   - **Business Metrics:** active events, score submissions/min, DAU
   - **Real-Time Activity:** WebSocket connections, live events, concurrent users
4. Dashboards auto-refresh every 5 seconds
5. Admin password set from environment variable
6. Dashboards persisted in volume

**Technical Notes:**
- Use grafana/grafana:latest image
- Provision dashboards via ./grafana/dashboards/
- Configure datasources via provisioning
- Use PromQL queries for metrics

**Prerequisites:** Story 8.1 (Prometheus setup)

---

### Story 8.3: Centralized Logging with Loki & Promtail

**As a** developer,  
**I want** centralized logs from all containers,  
**So that** I can troubleshoot issues across services.

**Acceptance Criteria:**
1. Loki container running for log aggregation
2. Promtail container collecting logs from:
   - All Docker containers (/var/lib/docker/containers)
   - Backend application (structured JSON logs)
   - Nginx access and error logs
3. Logs queryable in Grafana via Loki data source
4. Log retention: 30 days
5. Structured logging in ASP.NET Core (Serilog):
   - JSON format
   - Levels: DEBUG, INFO, WARN, ERROR
   - Fields: timestamp, level, message, userId, traceId
6. Common queries saved:
   - All errors in last hour
   - Failed auth attempts
   - Slow API requests (>1s)

**Technical Notes:**
- Use grafana/loki:latest and grafana/promtail:latest
- Configure Promtail to scrape Docker logs
- Add Serilog to ASP.NET Core with JSON formatting
- Mount Docker socket for Promtail

**Prerequisites:** Story 8.2 (Grafana setup)

---

### Story 8.4: Alerting Rules & Notifications

**As a** system administrator,  
**I want** automated alerts for critical issues,  
**So that** I can respond to problems quickly.

**Acceptance Criteria:**
1. Prometheus AlertManager configured
2. Alert rules defined for:
   - API error rate > 5% for 5 minutes (CRITICAL)
   - API p95 latency > 1 second for 5 minutes (WARNING)
   - Database connections > 90% for 2 minutes (CRITICAL)
   - Disk space < 10% (CRITICAL)
   - SSL certificate expiring < 7 days (WARNING)
   - Backend instance down (CRITICAL)
3. Alerts sent via:
   - Email (for critical alerts)
   - Slack webhook (for all alerts, future)
4. Alert notifications include: description, severity, affected service, timestamp
5. Alerts visible in Grafana dashboard
6. Test alerts can be triggered manually

**Technical Notes:**
- Configure alertmanager.yml with rules
- Use Prometheus alert rules
- Email via SMTP (Gmail or SendGrid)
- Set appropriate thresholds based on SLOs

**Prerequisites:** Story 8.1 (Prometheus), Story 8.2 (Grafana)

---

### Story 8.5: cAdvisor Container Metrics Collection

**As a** DevOps engineer,  
**I want** detailed container-level metrics collected by cAdvisor,  
**So that** I can monitor Docker container resource usage and performance.

**Acceptance Criteria:**
1. cAdvisor container added to Docker Compose using google/cadvisor:latest image
2. cAdvisor configured to monitor all Docker containers on the host
3. cAdvisor metrics endpoint exposed at http://localhost:8080 (internal only)
4. cAdvisor added as scrape target in Prometheus (prometheus.yml)
5. Metrics collected include:
   - Container CPU usage (per container)
   - Container memory usage and limits
   - Container network I/O (bytes sent/received)
   - Container disk I/O
   - Container filesystem usage
6. Grafana dashboard created showing:
   - Resource usage by container (CPU, memory, network)
   - Container health status
   - Resource limit violations
7. cAdvisor has read-only access to Docker socket (/var/run/docker.sock)
8. Metrics retained in Prometheus for 30 days

**Technical Notes:**
- Use google/cadvisor:latest Docker image
- Mount Docker socket: `/var/run/docker.sock:/var/run/docker.sock:ro`
- Mount root filesystem: `/:/rootfs:ro`
- Mount /var/run: `/var/run:/var/run:rw`
- Mount /sys: `/sys:/sys:ro`
- Mount /var/lib/docker: `/var/lib/docker:/var/lib/docker:ro`
- Add to prometheus.yml: `- job_name: 'cadvisor'` targeting port 8080
- Privileged mode may be required: `privileged: true`

**Prerequisites:** Story 8.1 (Prometheus setup)

---

### Story 8.6: Node Exporter System Metrics Collection

**As a** system administrator,  
**I want** host system metrics collected by Node Exporter,  
**So that** I can monitor VPS hardware resources (CPU, RAM, disk, network).

**Acceptance Criteria:**
1. Node Exporter container added to Docker Compose using prom/node-exporter:latest
2. Node Exporter configured to collect host system metrics (not just container metrics)
3. Node Exporter metrics endpoint exposed at http://localhost:9100/metrics (internal only)
4. Node Exporter added as scrape target in Prometheus
5. System metrics collected include:
   - Host CPU usage (overall and per-core)
   - Host memory usage (total, used, available, buffers, cache)
   - Host disk usage (per filesystem, read/write IOPS)
   - Host network usage (per interface, bytes/packets sent/received)
   - System load average (1m, 5m, 15m)
   - Host uptime
6. Grafana dashboard created showing:
   - System overview (CPU, RAM, disk, network)
   - Disk space alerts (< 10% free)
   - Network bandwidth usage
   - System load trends
7. Node Exporter configured with recommended collectors enabled
8. Metrics retained in Prometheus for 30 days

**Technical Notes:**
- Use prom/node-exporter:latest Docker image
- Mount host filesystems for accurate metrics:
  - `/proc:/host/proc:ro`
  - `/sys:/host/sys:ro`
  - `/:/rootfs:ro`
- Command: `--path.procfs=/host/proc --path.sysfs=/host/sys --path.rootfs=/rootfs`
- Network mode: host (to access host network stats)
- Add to prometheus.yml: `- job_name: 'node-exporter'` targeting port 9100
- Enable collectors: cpu, meminfo, diskstats, netdev, filesystem, loadavg

**Prerequisites:** Story 8.1 (Prometheus setup)

---

## Epic 9: DevOps & Deployment Pipeline

**Goal:** Automated CI/CD with blue-green deployment strategy

**Business Value:** Fast, reliable, zero-downtime deployments

**Duration:** Weeks 15-16

---

### Story 9.1: GitHub Actions CI Pipeline

**As a** developer,  
**I want** automated builds and tests on every commit,  
**So that** code quality is maintained.

**Acceptance Criteria:**
1. GitHub Actions workflow: `.github/workflows/ci.yml`
2. Triggers on: push to develop/main, pull requests
3. Jobs:
   - Build backend Docker image
   - Run unit tests (dotnet test)
   - Build frontend (npm run build)
   - Run frontend tests (npm run test)
   - Lint checks (backend + frontend)
4. All checks must pass before merge
5. Test coverage report generated
6. Build artifacts cached for faster runs
7. Workflow status badge in README

**Technical Notes:**
- Use actions/checkout@v3
- Cache Docker layers for speed
- Run tests in parallel where possible
- Fail fast on first error

**Prerequisites:** Story 2.1+ (Backend code exists)

---

### Story 9.2: Continuous Deployment to Dev Environment

**As a** developer,  
**I want** automatic deployment to dev on develop branch push,  
**So that** changes are immediately testable.

**Acceptance Criteria:**
1. GitHub Actions workflow: `.github/workflows/deploy-dev.yml`
2. Triggers on: push to develop branch
3. Steps:
   - Build Docker images with :dev tag
   - Push to container registry (GitHub Container Registry)
   - SSH to dev VPS
   - Pull latest images
   - Run docker-compose up -d
   - Run smoke tests
4. Deployment completes in < 5 minutes
5. Rollback on failed smoke tests
6. Deployment status notifications
7. Dev environment accessible at dev.archery-events.com

**Technical Notes:**
- Use appleboy/ssh-action for VPS deployment
- Store secrets in GitHub Secrets
- Run smoke tests via curl to health endpoints
- Keep previous image version for rollback

**Prerequisites:** Story 9.1 (CI pipeline), Story 1.1 (Docker setup)

---

### Story 9.3: Blue-Green Deployment to Production

**As a** DevOps engineer,  
**I want** zero-downtime production deployments,  
**So that** users aren't disrupted by updates.

**Acceptance Criteria:**
1. GitHub Actions workflow: `.github/workflows/deploy-prod.yml`
2. Triggers on: push to main branch OR manual workflow_dispatch
3. Blue-green process:
   - Deploy to green environment (standby)
   - Run database migrations (if needed)
   - Run comprehensive smoke tests
   - Switch Nginx to green
   - Reload Nginx (zero downtime)
   - Monitor for 15 minutes
   - If errors, rollback to blue automatically
4. Both blue and green environments configured in docker-compose
5. Nginx config updated to switch active environment
6. Database changes backward-compatible
7. Deployment notifications to team

**Technical Notes:**
- Maintain 2 sets of backend containers (blue + green)
- Use Nginx upstream switching
- Health check before traffic switch
- Automated rollback on elevated error rates

**Prerequisites:** Story 9.2 (Dev deployment), Story 1.2 (Nginx config)

---

## Epic 10: Mobile & Responsive UI

**Goal:** Mobile-first, responsive user interface with excellent UX

**Business Value:** Primary user experience for athletes and referees

**Duration:** Weeks 6-16 (Parallel with backend development)

---

### Story 10.1: Vue 3 + Vuetify Project Setup with Mock Data

**As a** frontend developer,  
**I want** Vue 3 project with Vuetify and mock API,  
**So that** UI development can proceed without backend dependency.

**Acceptance Criteria:**
1. Vue 3 project initialized with Vite
2. Vuetify 3 installed and configured
3. Vue Router configured for navigation
4. Pinia store configured for state management
5. Axios configured for API calls
6. Mock API responses created for all endpoints (MSW or json-server)
7. TypeScript enabled for type safety
8. Responsive breakpoints configured (mobile, tablet, desktop)
9. Project runs locally with `npm run dev`
10. Mock data includes realistic event/score/bracket data

**Technical Notes:**
- **Implement organized folder structure** (see architecture.md)
- Create folders: api/, assets/, components/, composables/, layouts/, locales/, router/, store/, styles/, types/, utils/, views/
- Use Vite for fast dev server
- Mock Service Worker (MSW) for API mocking
- Vuetify theme configured to brand colors
- Pinia stores: auth, events, scores, brackets
- TypeScript interfaces for all DTOs
- i18n setup for multi-language (locales/en.json, locales/vi.json)

**Prerequisites:** None (can start immediately)
- Vuetify theme configured to brand colors
- Pinia stores: auth, events, scores, brackets
- TypeScript interfaces for all DTOs

**Prerequisites:** None (can start immediately)

---

### Story 10.2: Core UI Components & Navigation

**As a** user,  
**I want** intuitive mobile-first navigation,  
**So that** I can access features easily on my phone.

**Acceptance Criteria:**
1. Bottom navigation bar for mobile (Home, Events, Profile)
2. App bar with title and menu for desktop
3. Drawer navigation for secondary options
4. Login/Register forms (email, password validation)
5. User profile page (view/edit)
6. Event list page (grid layout)
7. Event detail page
8. Responsive design (works 320px to 2560px)
9. Touch-friendly buttons (min 44x44px)
10. Loading states and error messages

**Technical Notes:**
- Use Vuetify components: v-bottom-navigation, v-app-bar, v-navigation-drawer
- Responsive grid: v-container, v-row, v-col
- Form validation with Vuetify rules
- Vue Router for page transitions

**Prerequisites:** Story 10.1 (Project setup)

---

### Story 10.3: Core Scoresheet Component Library

**As a** frontend developer,  
**I want** reusable scoring components with ring-authentic colors,  
**So that** scoresheet views are consistent and maintainable.

**Acceptance Criteria:**
1. `ArrowCell.vue` component:
   - Props: `value` (ScoreValue | null), `index` (0-5)
   - Displays arrow score with ring-authentic color background
   - Circular shape (border-radius: 50%, 36px diameter)
   - Color mapping: X/10/9 → Yellow (#e8de27), 8/7 → Red (#d92d41), 6/5 → Blue (#1884cc), 4/3 → Black (#000000), 2/1 → White (#f5f5f5), M → Green (#0a8c0a)
   - Empty state: gray background (#e0e0e0), "-" placeholder
2. `ScoreButton.vue` component:
   - Props: `score` (ScoreValue), `disabled` (boolean)
   - Circular button (48dp min touch target)
   - Emits: `@click` with score value
   - Ring-authentic colors matching ArrowCell
   - Touch feedback: scale animation on press
3. `useScoreCalculation.ts` composable:
   - Function: `scoreToNumber(value: ScoreValue): number` - X/10=10, M=0
   - Function: `calculateEndSum(arrows: Arrow[]): number`
   - Function: `isGold(value: ScoreValue): boolean` - X or 10
4. TypeScript type definitions:
   - `ScoreValue` type: 'X' | '10' | '9' | ... | '1' | 'M'
   - `Arrow` interface: `{ value: ScoreValue | null, timestamp?: Date }`
   - `End` interface: `{ endNumber, arrows, sum, confirmed, locked, status }`

**Technical Notes:**
- Use Vuetify for base styling
- Components in `src/components/scoring/`
- Composable in `src/composables/useScoreCalculation.ts`
- Types in `src/types/scoring.ts`
- All components use Composition API
- Accessibility: aria-labels on buttons, proper contrast ratios

**Estimated Effort:** 2-3 hours

**Prerequisites:** Story 10.1 (Vue 3 setup)

---

### Story 10.4: Qualification Scoresheet Layout & Flow

**As an** athlete on mobile,  
**I want** intuitive sequential score input with visual feedback,  
**So that** I can enter my scores quickly and accurately.

**Acceptance Criteria:**
1. `ScoresheetView.vue` page:
   - Header: Competition name, Distance, Golds count, Average
   - Scrollable ends list (8+ ends visible at once)
   - Fixed bottom score pad
   - Live stats: Total, Average updated immediately
2. `EndRow.vue` component:
   - Layout: End number + 6 ArrowCells + Confirm button + Sum (orange)
   - Active end: highlighted border (#1565c0)
   - Locked end: grayed out (opacity 0.6), small green check icon
   - Saving state: spinner overlay
   - Error state: red border, inline "Failed to save. Retry?" message
3. `ScorePad.vue` component:
   - Grid layout: 5 columns, 3 rows
   - Score buttons: X, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, M
   - Delete button (←) in top-right, gray background
   - Empty placeholders for grid alignment
4. Sequential input behavior:
   - User taps score → fills next empty arrow slot left-to-right
   - Cannot skip arrows or edit earlier arrows
   - Delete (←) removes last entered arrow
   - After 6 arrows, green ✓ button appears
   - Confirm sends to backend, shows "Saving..." overlay (800ms)
   - Success: locks end, auto-advances to next end
   - Failure: shows retry option
5. Statistics update:
   - Golds count updates when X/10 entered
   - Average recalculates after each arrow
   - Total updates on confirm

**Technical Notes:**
- Use Pinia store: `src/stores/scoring.ts`
- Components in `src/components/scoring/`
- View in `src/views/ScoresheetView.vue`
- Mobile-first: 375px base width
- Use `useScoreCalculation` composable
- End sum displays unconditionally, updates live

**Estimated Effort:** 4-6 hours

**Prerequisites:** Story 10.3 (Core components), Story 5.4 (Backend API)

---

### Story 10.5: Offline Queue & Resume Logic

**As an** athlete with unreliable connectivity,  
**I want** scores queued locally and synced when online,  
**So that** I don't lose data if network drops.

**Acceptance Criteria:**
1. `useOfflineSync.ts` composable:
   - Tracks online/offline state (`isOnline` ref)
   - Queues failed end submissions to IndexedDB
   - Background sync worker flushes queue when online
   - Method: `queueEnd(end: End)` - saves to local queue
   - Method: `syncQueue()` - attempts to send all queued ends
2. IndexedDB schema:
   - Store: `scoreQueue`
   - Fields: `{ id, eventId, competitionId, roundId, endNumber, arrows, sum, status: 'queued', timestamp }`
3. Mid-end resume:
   - Partial end (e.g., 3 arrows entered) saved to localStorage immediately (debounced)
   - On app reopen: restores incomplete end, focuses next arrow
4. Offline indicators:
   - "Queued — will sync when online" message near end row
   - Queue count badge in header (e.g., "3 ends queued")
   - Auto-sync on reconnect with success toast
5. Edge cases:
   - If backend rejects queued end (e.g., scoring closed), show error and remove from queue
   - Handle app close/crash: resume on restart

**Technical Notes:**
- Use IndexedDB via Dexie.js or native API
- Listen to `window.addEventListener('online/offline')`
- Debounce localStorage writes (500ms)
- Store in `localStorage.setItem('currentEnd', JSON.stringify(...))`
- Service worker for background sync (optional)

**Estimated Effort:** 3-4 hours

**Prerequisites:** Story 10.4 (Scoresheet layout), Story 5.4 (Backend API)

---

### Story 10.6: Elimination Scoresheet Variant

**As an** athlete in elimination rounds,  
**I want** a scoresheet adapted for set-based scoring,  
**So that** I can track my performance against an opponent.

**Acceptance Criteria:**
1. `EliminationLayout.vue` component:
   - Layout: My scores (left) vs Opponent scores (right)
   - 3 arrows per set (not 6)
   - Set scoring: 2 points for win, 1 for tie, 0 for loss
   - Running set points: "4-2" display
   - Match ends when athlete reaches target sets (e.g., 6 sets)
2. Score pad: Same as qualification (reuse ScorePad.vue)
3. Real-time opponent updates:
   - Subscribe to SignalR for opponent's score submissions
   - Opponent's arrows appear as they're entered
   - Visual indicator when opponent finishes set
4. Responsive to `competitionType` prop:
   - `<ScoreInput :competition-type="'elimination'" :arrows-per-end="3" />`
   - ScoresheetView dynamically renders QualificationLayout or EliminationLayout
5. Set winner calculation:
   - Compare sum of 3 arrows: higher sum wins set
   - Tie: both get 1 point

**Technical Notes:**
- Component in `src/components/scoring/EliminationLayout.vue`
- Reuse ArrowCell, ScoreButton components
- SignalR listener for opponent scores
- Conditional rendering in ScoresheetView based on competitionType

**Estimated Effort:** 3-4 hours

**Prerequisites:** Story 10.4 (Scoresheet layout), Story 5.5 (SignalR hub)

---

### Story 10.7: Score Input & Leaderboard Views (Legacy)

**As an** athlete on mobile,  
**I want** easy score input and live leaderboard,  
**So that** I can track my performance.

**Acceptance Criteria:**
1. Score input page:
   - Number pad for arrow scores (0-10)
   - 6 input fields per end
   - Running total display
   - Submit button
   - Confirmation dialog
2. Leaderboard page:
   - Ranked list with rank, name, score
   - Auto-refresh via SignalR
   - Visual indicators for rank changes
   - Filter by game
3. Both views optimized for mobile (portrait)
4. Offline support (queue scores, sync when online)
5. Haptic feedback on score submission (mobile)
6. Fast touch interactions (no delays)

**Technical Notes:**
- **Follow Vue 3 folder structure** (see architecture.md and PRD.md)
- Create organized folders: api/, components/, composables/, store/, views/, locales/
- Use Composition API with composables (useAuth, useWebSocket, useScoring)
- Pinia for state management (authStore, eventsStore, scoresStore)
- TypeScript for type safety
- Use v-text-field with type="number"
- SignalR client library (@microsoft/signalr)
- Service worker for offline support
- CSS animations for rank changes

**Prerequisites:** Story 10.2 (Core UI), Story 5.5 (SignalR backend)

---

## Implementation Sequencing

### Phase 0: Foundation (Weeks 1-2)
**Goal:** Production-grade infrastructure ready

- Story 1.1: Docker Compose setup
- Story 1.2: Nginx reverse proxy
- Story 1.3: SSL/TLS certificates
- Story 1.4: Rate limiting & WAF
- Story 1.5: PostgreSQL setup

**Milestone:** Infrastructure running, monitoring active

---

### Phase 1: Authentication (Week 3)
**Goal:** Secure user access

- Story 2.1: User registration API
- Story 2.2: JWT login
- Story 2.3: Authorization middleware
- Story 2.4: Profile management

**Milestone:** Users can register and login securely

---

### Phase 2: Event Management (Week 4)
**Goal:** Events and games configured

- Story 3.1: Create event API
- Story 3.2: Event CRUD
- Story 3.3: Game configuration
- Story 3.4: Event status management

**Milestone:** Hosts can create events with games

---

### Phase 3: Participation (Week 5)
**Goal:** Users can join events

- Story 4.1: Athlete registration
- Story 4.2: Referee approval workflow
- Story 4.3: Participant lists
- Story 4.4: Unregister capability

**Milestone:** Athletes and referees can join events

---

### Phase 4: Real-Time Scoring (Weeks 6-8)
**Goal:** Live score submission and leaderboard

- Story 5.1: SignalR hub setup
- Story 5.2: Score submission API
- Story 5.3: Real-time broadcasting
- Story 5.4: Live leaderboard
- Story 5.5: Score updates (referee)
- Story 5.6: Score locking

**Milestone:** Real-time competition scoring functional

---

### Phase 5: Tournament Brackets (Weeks 9-11)
**Goal:** Professional elimination rounds

- Story 6.1: Generate brackets
- Story 6.2: View brackets
- Story 6.3: Set-based scoring
- Story 6.4: Shoot-off resolution
- Story 6.5: Match progression
- Story 6.6: Tournament completion

**Milestone:** Complete tournament system from qualification to finals

---

### Phase 6: Spectator Experience (Week 12)
**Goal:** Public engagement

- Story 7.1: Public event discovery
- Story 7.2: Desktop leaderboard view
- Story 7.3: Bracket visualization

**Milestone:** Spectators can discover and watch events

---

### Phase 7: Observability (Weeks 13-14)
**Goal:** Complete system monitoring

- Story 8.1: Prometheus metrics
- Story 8.2: Grafana dashboards
- Story 8.3: Loki logging
- Story 8.4: Alerting rules

**Milestone:** Full observability stack operational

---

### Phase 8: Deployment Automation (Weeks 15-16)
**Goal:** CI/CD pipeline

- Story 9.1: GitHub Actions CI
- Story 9.2: Dev deployment
- Story 9.3: Blue-green production deployment

**Milestone:** Automated, zero-downtime deployments

---

### Phase 9: Frontend (Weeks 6-16, Parallel)
**Goal:** Mobile-first UI

- Story 10.1: Vue 3 + Vuetify setup
- Story 10.2: Core UI components
- Story 10.3: Score input & leaderboard views

**Milestone:** Complete mobile-responsive application

---

## Parallel Development Opportunities

**Can be developed simultaneously:**

- **Backend + Frontend:** Frontend uses mocks while backend builds APIs
- **Infrastructure + Features:** Observability setup while features developed
- **Multiple backend features:** Different developers can work on different epics
- **UI components:** Different pages can be built in parallel

**Dependencies to respect:**

- Auth must complete before protected resources
- Events before participation
- Scores before leaderboard
- Qualification before elimination brackets

---

## Story Size Validation

All stories validated for AI-agent compatibility:

✅ **Size:** Each story completable in 2-4 hour focused session  
✅ **Clarity:** Clear acceptance criteria, no ambiguity  
✅ **Independence:** Minimal dependencies, clear prerequisites  
✅ **Testability:** Success criteria measurable  
✅ **Value:** Each delivers working functionality

---

## Next Steps

**For implementation:**

1. **Start with Phase 0 (Infrastructure)** - Weeks 1-2
2. **Set up project repositories** (frontend + backend on GitHub)
3. **Initialize tracking** (GitHub Projects or similar)
4. **Begin Story 1.1** - Docker Compose setup

**For each story:**
- Load story from this document
- Implement according to acceptance criteria
- Test against all acceptance criteria
- Move to next story

---

**Document Status:** ✅ Complete  
**Total Stories:** 42  
**Ready for:** Development kickoff  
**Last Updated:** November 6, 2025
