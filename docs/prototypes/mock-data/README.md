# Mock Data for Prototypes

This folder contains mock data used for testing and demonstrating prototype functionality.

## Files

### users.js
Mock user data for authentication testing.

**Test Credentials:**

| Email | Password | Role | Name |
|-------|----------|------|------|
| `john@test.com` | `Pass123!` | athlete | John Doe |
| `jane@test.com` | `Test123!` | athlete | Jane Smith |
| `mike@test.com` | `Demo123!` | organizer | Mike Johnson |
| `sarah@test.com` | `User123!` | athlete | Sarah Williams |
| `admin@test.com` | `Admin123!` | admin | Admin User |

**Available Functions:**
- `validateCredentials(email, password)` - Returns user object if credentials are valid
- `emailExists(email)` - Check if email is already registered
- `registerUser(userData)` - Register a new user (mock)

### events.js
Mock event data for event listing and management.

**Available Functions:**
- `getAllEvents()` - Returns array of all 15 events
- `getEventById(id)` - Get specific event by ID
- `getEventsByStatus(status)` - Filter by status ('upcoming', 'live', 'completed')
- `searchEvents(searchTerm)` - Search by event name or location

**Event Data:**
- 15 total events (10 upcoming, 2 live, 3 completed)
- Date ranges from Sep 2024 to Apr 2025
- Locations: Tokyo, Seoul, Hanoi, Sydney, Paris, Bangkok, London, LA, Beijing, Berlin, Shanghai, Osaka, Melbourne, Singapore

## Usage in HTML Prototypes

### Using users.js

Include the script in your HTML file:

```html
<script src="../mock-data/users.js"></script>
```

Then use the mock data:

```javascript
// Login validation
const user = validateCredentials('john@test.com', 'Pass123!');
if (user) {
    console.log('Login successful:', user);
}

// Check if email exists
if (emailExists('john@test.com')) {
    console.log('Email already registered');
}

// Register new user
const newUser = registerUser({
    firstName: 'Test',
    lastName: 'User',
    email: 'test@test.com',
    password: 'Test123!'
});
```

### Using events.js

Include the script in your HTML file:

```html
<script src="../mock-data/events.js"></script>
```

Then use the mock data:

```javascript
// Get all events
const events = getAllEvents();
console.log('Total events:', events.length);

// Get event by ID
const event = getEventById(1);
console.log('Event:', event.title);

// Filter by status
const upcomingEvents = getEventsByStatus('upcoming');
console.log('Upcoming events:', upcomingEvents.length);

// Search events
const tokyoEvents = searchEvents('Tokyo');
console.log('Events in Tokyo:', tokyoEvents.length);
```

## Future Mock Data

Planned mock data files:
- `athletes.js` - Mock athlete profiles and statistics
- `scores.js` - Mock scoring data and results
- `registrations.js` - Mock event registration data
