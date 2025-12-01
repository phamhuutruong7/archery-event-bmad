// Mock Data for Archery Event Management System

const mockData = {
    currentUser: {
        id: 'user-1',
        name: 'Alex Archer',
        email: 'alex@example.com',
        role: 'Athlete', // 'Host', 'Referee', 'Admin'
        avatar: 'https://ui-avatars.com/api/?name=Alex+Archer&background=1565c0&color=fff'
    },
    events: [
        {
            id: 'evt-001',
            name: 'National Archery Championship 2025',
            location: 'Olympic Stadium, Cityville',
            date: 'Dec 15-17, 2025',
            status: 'Open', // 'Draft', 'Open', 'InProgress', 'Completed'
            participants: 128,
            image: 'https://images.unsplash.com/photo-1511376777868-611b54f68947?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 'evt-002',
            name: 'Winter Club Shoot',
            location: 'Archery Range A, Downtown',
            date: 'Jan 10, 2026',
            status: 'Draft',
            participants: 24,
            image: 'https://images.unsplash.com/photo-1554188248-986adbb73be0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        }
    ],
    competitions: [
        {
            id: 'comp-001',
            eventId: 'evt-001',
            name: 'Recurve - Men\'s Individual - WA 70m',
            type: 'Qualification',
            distance: '70m',
            targetFace: '122cm',
            totalEnds: 12,
            arrowsPerEnd: 6
        },
        {
            id: 'comp-002',
            eventId: 'evt-001',
            name: 'Compound - Women\'s Individual - WA 50m',
            type: 'Elimination',
            distance: '50m',
            targetFace: '80cm (6-ring)',
            totalEnds: 5,
            arrowsPerEnd: 3
        }
    ],
    scores: {
        'comp-001': {
            'user-1': [
                { end: 1, arrows: ['10', '10', '9', '9', '8', '8'], total: 54 },
                { end: 2, arrows: ['X', '10', '10', '9', '9', '7'], total: 55 },
                { end: 3, arrows: ['10', '9', '9', '8', '8', '8'], total: 52 }
            ]
        }
    }
};

// Helper functions to simulate API calls
const api = {
    login: (email, password) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, user: mockData.currentUser });
            }, 800);
        });
    },
    getEvents: () => {
        return Promise.resolve(mockData.events);
    },
    getCompetition: (id) => {
        return Promise.resolve(mockData.competitions.find(c => c.id === id));
    },
    submitEnd: (compId, endData) => {
        console.log(`Submitting end for ${compId}:`, endData);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, lockedAt: new Date() });
            }, 500);
        });
    }
};
