/**
 * Mock User Data for Authentication Prototype
 * Simple credentials for testing login functionality
 */

const MOCK_USERS = [
    {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john@test.com",
        password: "Pass123!",
        role: "athlete",
        registeredDate: "2024-01-15",
        avatar: null
    },
    {
        id: 2,
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@test.com",
        password: "Test123!",
        role: "athlete",
        registeredDate: "2024-02-20",
        avatar: null
    },
    {
        id: 3,
        firstName: "Mike",
        lastName: "Johnson",
        email: "mike@test.com",
        password: "Demo123!",
        role: "organizer",
        registeredDate: "2024-03-10",
        avatar: null
    },
    {
        id: 4,
        firstName: "Sarah",
        lastName: "Williams",
        email: "sarah@test.com",
        password: "User123!",
        role: "athlete",
        registeredDate: "2024-04-05",
        avatar: null
    },
    {
        id: 5,
        firstName: "Admin",
        lastName: "User",
        email: "admin@test.com",
        password: "Admin123!",
        role: "admin",
        registeredDate: "2024-01-01",
        avatar: null
    }
];

/**
 * Validate user credentials
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {object|null} User object if valid, null if invalid
 */
function validateCredentials(email, password) {
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
        return null; // User not found
    }
    
    if (user.password !== password) {
        return null; // Invalid password
    }
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

/**
 * Check if email already exists
 * @param {string} email - Email to check
 * @returns {boolean} True if email exists
 */
function emailExists(email) {
    return MOCK_USERS.some(u => u.email.toLowerCase() === email.toLowerCase());
}

/**
 * Register new user (mock)
 * @param {object} userData - User registration data
 * @returns {object} New user object
 */
function registerUser(userData) {
    const newUser = {
        id: MOCK_USERS.length + 1,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        role: "athlete",
        registeredDate: new Date().toISOString().split('T')[0],
        avatar: null
    };
    
    MOCK_USERS.push(newUser);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
}

// Export for use in HTML prototypes
if (typeof window !== 'undefined') {
    window.MOCK_USERS = MOCK_USERS;
    window.validateCredentials = validateCredentials;
    window.emailExists = emailExists;
    window.registerUser = registerUser;
}
