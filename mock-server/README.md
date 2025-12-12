# Archery Event Mock Server

A clean, maintainable mock API server using **Express.js** for frontend development.

## Features

- ✅ **Simple JSON database** - Edit `db.json` to modify all data
- ✅ **Full REST API** - Complete CRUD operations for all resources
- ✅ **Authentication system** - Login/register/refresh/logout endpoints
- ✅ **Auto-reload** - Server watches for code changes
- ✅ **Data persistence** - All changes saved to `db.json`
- ✅ **Realistic behavior** - Simulates network latency and proper responses

---

## Quick Start

### 1. Install Dependencies

```bash
cd frontend/mock-server
npm install
```

### 2. Start the Server

**Development mode** (with auto-reload on file changes):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

Server runs on: **http://localhost:5000**

---

## Available Endpoints

### Authentication
```
POST   http://localhost:5000/auth/login
POST   http://localhost:5000/auth/register
POST   http://localhost:5000/auth/refresh
POST   http://localhost:5000/auth/logout
```

### Events
```
GET    http://localhost:5000/api/v1/events
GET    http://localhost:5000/api/v1/events/:id
POST   http://localhost:5000/api/v1/events
PUT    http://localhost:5000/api/v1/events/:id
DELETE http://localhost:5000/api/v1/events/:id
GET    http://localhost:5000/api/v1/events/my-events
```

### Competitions
```
GET    http://localhost:5000/api/v1/events/:eventId/competitions
GET    http://localhost:5000/api/v1/competitions/:id
POST   http://localhost:5000/api/v1/competitions
PUT    http://localhost:5000/api/v1/competitions/:id
DELETE http://localhost:5000/api/v1/competitions/:id
```

### Scores
```
POST   http://localhost:5000/api/v1/scores
GET    http://localhost:5000/api/v1/scores/:id
PUT    http://localhost:5000/api/v1/scores/:id
GET    http://localhost:5000/api/v1/scores/athlete/:athleteId/competition/:competitionId
```

### Leaderboards
```
GET    http://localhost:5000/api/v1/competitions/:competitionId/leaderboard
```

### Users
```
GET    http://localhost:5000/api/v1/users/me
GET    http://localhost:5000/api/v1/users/:id
PUT    http://localhost:5000/api/v1/users/:id
```

---

## Modifying Mock Data

### Edit Database (`db.json`)

All mock data is in **`db.json`**. It's structured in collections:

```json
{
  "users": [...],
  "events": [...],
  "competitions": [...],
  "scores": [...],
  "leaderboards": [...],
  "participants": [...]
}
```

**To add/modify data:**
1. Open `db.json`
2. Edit the JSON directly
3. Save the file
4. Data persists automatically!
5. **Note**: POST/PUT/DELETE requests also update `db.json` in real-time

### Example: Add a New Event

```json
{
  "id": "event-005",
  "name": "Summer Championships 2025",
  "description": "Regional summer tournament",
  "location": "Coastal Arena, Sydney",
  "startDate": "2025-08-10T09:00:00Z",
  "endDate": "2025-08-12T18:00:00Z",
  "registrationDeadline": "2025-08-01T23:59:59Z",
  "status": "OpenForRegistration",
  "isPublic": true,
  "hostUserId": "user-001",
  "createdAt": "2024-12-03T10:00:00Z",
  "updatedAt": "2024-12-03T10:00:00Z"
}
```

Add this object to the `events` array in `db.json`.

---

## Server Architecture (`server.js`)

Express-based REST API with custom route handlers:

**Current implementations:**
- ✅ Authentication (login/register/refresh/logout)
- ✅ Full CRUD for Events, Competitions, Scores, Users
- ✅ Score submission with automatic total calculation
- ✅ Token-based user identification
- ✅ Query parameter support (filtering, pagination)
- ✅ CORS enabled
- ✅ Data persistence to db.json

**To add new endpoints:**
1. Open `server.js`
2. Add route handler:
```javascript
server.get('/api/v1/custom/route', (req, res) => {
  const db = getDb()
  // Your custom logic
  res.json({ result: 'success' })
})
```

---

## Testing Credentials

### Users in Database

| Email | Password | Role |
|-------|----------|------|
| admin@archery.com | password123 | Host |
| athlete@archery.com | password123 | Athlete |
| referee@archery.com | password123 | Referee |

### Example Login Request

```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"athlete@archery.com","password":"password123"}'
```

**Response:**
```json
{
  "accessToken": "mock-token-user-002",
  "refreshToken": "mock-refresh-user-002",
  "expiresIn": 86400,
  "user": {
    "id": "user-002",
    "email": "athlete@archery.com",
    "firstName": "John",
    "lastName": "Archer",
    "role": "Athlete"
  }
}
```

---

## Query Parameters

### Events Filtering & Pagination
```bash
GET /api/v1/events?status=OpenForRegistration
GET /api/v1/events?search=championship
GET /api/v1/events?page=1&pageSize=10
```

### Scores Filtering
```bash
GET /api/v1/scores?athleteId=user-002
GET /api/v1/scores?competitionId=comp-001
GET /api/v1/scores?athleteId=user-002&competitionId=comp-001
```

### Competitions Filtering
```bash
GET /api/v1/competitions?eventId=event-001
```

---

## Integration with Frontend

Your frontend is already configured to use this mock server!

**Environment variable** (`.env.local`):
```
VITE_API_URL=http://localhost:5000/api/v1
```

**Usage in components:**
```typescript
import { eventService } from '@/api/services/eventService'

// Get all events
const events = await eventService.getAll()

// Get event by ID
const event = await eventService.getById('event-001')

// Create new event
const newEvent = await eventService.create({
  name: 'New Tournament',
  description: 'Test event',
  location: 'Test Arena',
  startDate: '2025-09-01T09:00:00Z',
  endDate: '2025-09-03T18:00:00Z',
  registrationDeadline: '2025-08-20T23:59:59Z',
  isPublic: true
})
```

---

## Advanced Configuration

### Adjust Network Latency

The server simulates 100ms network delay. To change it, edit `server.js`:

```javascript
server.use((req, res, next) => {
  setTimeout(next, 500) // Change to desired ms
})
```

### Add Custom Validation

Add validation before saving data:

```javascript
server.post('/api/v1/events', (req, res) => {
  // Validate required fields
  if (!req.body.name || !req.body.location) {
    return res.status(400).json({ error: 'Name and location required' })
  }
  
  // Continue with normal logic...
})
```

---

## Troubleshooting

### Port 5000 Already in Use

Change the port in `package.json`:
```json
"start": "json-server db.json --port 3001 --routes routes.json --middlewares middleware.js"
```

Also update frontend `.env.local`:
```
VITE_API_URL=http://localhost:3001/api/v1
```

### Data Not Persisting

The server saves all POST/PUT/DELETE changes to `db.json`. If data isn't persisting:
- Check file permissions on `db.json`
- Ensure you're not running multiple server instances
- Verify `db.json` is not read-only

### CORS Issues

CORS is configured to allow all origins. If issues persist:
- Check browser console for specific errors
- Verify server is running on correct port (5000)
- Check for proxy/firewall issues

---

## File Structure

```
frontend/mock-server/
├── db.json           # Main database (all mock data here!)
├── server.js         # Express server with all routes
├── package.json      # Dependencies (express, cors)
├── README.md         # This file
├── TEST_GUIDE.md     # Testing examples
└── .gitignore        # Ignore node_modules
```

---

## Next Steps

1. **Start the server**: `npm run dev`
2. **Start frontend**: `cd ../` then `npm run dev`
3. **Test login**: Use credentials above
4. **Modify data**: Edit `db.json` and see changes instantly
5. **Add features**: Extend `middleware.js` for custom behavior

---

## Transition to Real Backend

When your real backend is ready:

1. Update `.env.local`:
```
VITE_API_URL=http://your-real-api.com/api/v1
```

2. No code changes needed! Your API services will work with the real backend.

3. Keep mock server for:
   - Offline development
   - Testing
   - Demos
   - Backend unavailability

---

**Happy coding! 🎯**
