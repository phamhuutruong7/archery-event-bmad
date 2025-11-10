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

## Usage in HTML Prototypes

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

## Future Mock Data

Planned mock data files:
- `events.js` - Mock event data (competitions, tournaments)
- `athletes.js` - Mock athlete profiles and statistics
- `scores.js` - Mock scoring data for events
- `registrations.js` - Mock event registration data
