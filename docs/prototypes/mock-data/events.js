/**
 * Mock Events Data
 * Test data for archery event prototypes
 */

const mockEvents = [
    { id: 1, title: "2024 National Championship", status: "upcoming", startDate: "2024-12-15", endDate: "2024-12-17", dateDisplay: "Dec 15-17, 2024", location: "Tokyo, Japan", competitions: [{ distance: "70m", target: "122 cm 10 rings", arrows: 72 }, { distance: "50m", target: "80 cm 10 rings", arrows: 72 }] },
    { id: 2, title: "Regional Qualifier 2024", status: "live", startDate: "2024-12-01", endDate: "2024-12-03", dateDisplay: "Dec 1-3, 2024", location: "Seoul, Korea", competitions: [{ distance: "60m", target: "122 cm 10 rings", arrows: 36 }] },
    { id: 3, title: "Winter Indoor Tournament", status: "upcoming", startDate: "2024-12-22", endDate: "2024-12-23", dateDisplay: "Dec 22-23, 2024", location: "Hanoi, Vietnam", competitions: [{ distance: "18m", target: "40 cm 10 rings", arrows: 60 }] },
    { id: 4, title: "Spring Open Championship", status: "upcoming", startDate: "2025-12-10", endDate: "2025-12-12", dateDisplay: "Dec 10-12, 2025", location: "Sydney, Australia", competitions: [{ distance: "70m", target: "122 cm 10 rings", arrows: 72 }, { distance: "18m", target: "40 cm 10 rings", arrows: 60 }] },
    { id: 5, title: "International Archery Cup", status: "upcoming", startDate: "2025-12-20", endDate: "2025-12-23", dateDisplay: "Dec 20-23, 2025", location: "Paris, France", competitions: [{ distance: "70m", target: "122 cm 10 rings", arrows: 72 }, { distance: "50m", target: "80 cm 10 rings", arrows: 72 }, { distance: "30m", target: "80 cm 10 rings", arrows: 36 }] },
    { id: 6, title: "Youth Development Camp", status: "live", startDate: "2024-12-05", endDate: "2024-12-08", dateDisplay: "Dec 5-8, 2024", location: "Bangkok, Thailand", competitions: [{ distance: "50m", target: "122 cm 10 rings", arrows: 36 }, { distance: "30m", target: "80 cm 10 rings", arrows: 36 }] },
    { id: 7, title: "Masters League Final", status: "upcoming", startDate: "2025-11-28", endDate: "2025-11-29", dateDisplay: "Nov 28-29, 2025", location: "London, UK", competitions: [{ distance: "60m", target: "122 cm 10 rings", arrows: 36 }] },
    { id: 8, title: "Summer Outdoor Classic", status: "upcoming", startDate: "2025-11-25", endDate: "2025-11-28", dateDisplay: "Nov 25-28, 2025", location: "Los Angeles, USA", competitions: [{ distance: "70m", target: "122 cm 10 rings", arrows: 72 }, { distance: "50m", target: "80 cm 10 rings", arrows: 72 }] },
    { id: 9, title: "Asian Games Qualifier", status: "upcoming", startDate: "2025-12-05", endDate: "2025-12-07", dateDisplay: "Dec 5-7, 2025", location: "Beijing, China", competitions: [{ distance: "70m", target: "122 cm 10 rings", arrows: 72 }] },
    { id: 10, title: "European Championship", status: "upcoming", startDate: "2025-12-18", endDate: "2025-12-21", dateDisplay: "Dec 18-21, 2025", location: "Berlin, Germany", competitions: [{ distance: "70m", target: "122 cm 10 rings", arrows: 72 }, { distance: "50m", target: "80 cm 10 rings", arrows: 72 }, { distance: "18m", target: "40 cm 10 rings", arrows: 60 }] },
    { id: 11, title: "World Cup Series Round 1", status: "upcoming", startDate: "2026-01-02", endDate: "2026-01-05", dateDisplay: "Jan 2-5, 2026", location: "Shanghai, China", competitions: [{ distance: "70m", target: "122 cm 10 rings", arrows: 72 }] },
    { id: 12, title: "National Team Trials", status: "upcoming", startDate: "2025-11-22", endDate: "2025-11-23", dateDisplay: "Nov 22-23, 2025", location: "Tokyo, Japan", competitions: [{ distance: "70m", target: "122 cm 10 rings", arrows: 72 }, { distance: "60m", target: "122 cm 10 rings", arrows: 36 }] },
    { id: 13, title: "Autumn Open 2024", status: "completed", startDate: "2024-11-05", endDate: "2024-11-06", dateDisplay: "Nov 5-6, 2024", location: "Osaka, Japan", competitions: [{ distance: "50m", target: "80 cm 10 rings", arrows: 72 }] },
    { id: 14, title: "Summer Classic 2024", status: "completed", startDate: "2024-10-12", endDate: "2024-10-14", dateDisplay: "Oct 12-14, 2024", location: "Melbourne, Australia", competitions: [{ distance: "70m", target: "122 cm 10 rings", arrows: 72 }] },
    { id: 15, title: "Indoor Championship 2024", status: "completed", startDate: "2024-09-20", endDate: "2024-09-22", dateDisplay: "Sep 20-22, 2024", location: "Singapore", competitions: [{ distance: "18m", target: "40 cm 10 rings", arrows: 60 }] },
    { id: 16, title: "Winter Cup 2024", status: "cancelled", startDate: "2024-12-28", endDate: "2024-12-30", dateDisplay: "Dec 28-30, 2024", location: "Oslo, Norway", competitions: [{ distance: "18m", target: "40 cm 10 rings", arrows: 60 }] }
];

/**
 * Get all events
 * @returns {Array} Array of all events
 */
function getAllEvents() {
    return [...mockEvents];
}

/**
 * Get event by ID
 * @param {number} id - Event ID
 * @returns {Object|null} Event object or null if not found
 */
function getEventById(id) {
    return mockEvents.find(event => event.id === id) || null;
}

/**
 * Get events by status
 * @param {string} status - Event status ('upcoming', 'live', 'completed', 'cancelled')
 * @returns {Array} Filtered array of events
 */
function getEventsByStatus(status) {
    return mockEvents.filter(event => event.status === status);
}

/**
 * Search events by name or location
 * @param {string} searchTerm - Search term
 * @returns {Array} Filtered array of events
 */
function searchEvents(searchTerm) {
    const term = searchTerm.toLowerCase();
    return mockEvents.filter(event => 
        event.title.toLowerCase().includes(term) || 
        event.location.toLowerCase().includes(term)
    );
}

// Export to window object for use in HTML prototypes
if (typeof window !== 'undefined') {
    window.mockEvents = mockEvents;
    window.getAllEvents = getAllEvents;
    window.getEventById = getEventById;
    window.getEventsByStatus = getEventsByStatus;
    window.searchEvents = searchEvents;
}
