/**
 * Mock Referees Data
 * Referees assigned to events
 */

const refereesData = {
    // Event ID 1 - 2024 National Championship
    1: [
        { id: 1, name: 'Akira Tanaka', level: 'World Archery Judge Level 3', country: 'Japan', flag: '🇯🇵', email: 'a.tanaka@archery-japan.jp', phone: '+81-3-1234-5678' },
        { id: 2, name: 'Yuko Watanabe', level: 'World Archery Judge Level 2', country: 'Japan', flag: '🇯🇵', email: 'y.watanabe@archery-japan.jp', phone: '+81-6-2345-6789' },
        { id: 3, name: 'Hideo Nakamura', level: 'National Judge', country: 'Japan', flag: '🇯🇵', email: 'h.nakamura@archery-japan.jp', phone: '+81-3-3456-7890' }
    ],
    
    // Event ID 2 - Regional Qualifier 2024
    2: [
        { id: 4, name: 'Kim Sung-ho', level: 'World Archery Judge Level 3', country: 'South Korea', flag: '🇰🇷', email: 'k.sungho@archery-korea.kr', phone: '+82-2-987-6543' },
        { id: 5, name: 'Park Min-seo', level: 'World Archery Judge Level 2', country: 'South Korea', flag: '🇰🇷', email: 'p.minseo@archery-korea.kr', phone: '+82-2-876-5432' },
        { id: 6, name: 'Chen Wei', level: 'World Archery Judge Level 2', country: 'China', flag: '🇨🇳', email: 'c.wei@archery-china.cn', phone: '+86-10-6543-2109' }
    ],
    
    // Event ID 3 - Winter Indoor Tournament
    3: [
        { id: 7, name: 'Nguyen Van Tuan', level: 'National Judge', country: 'Vietnam', flag: '🇻🇳', email: 'n.tuan@archery-vietnam.vn', phone: '+84-24-3456-7890' },
        { id: 8, name: 'Tran Thi Lan', level: 'National Judge', country: 'Vietnam', flag: '🇻🇳', email: 't.lan@archery-vietnam.vn', phone: '+84-28-2345-6789' },
        { id: 9, name: 'Le Van Hung', level: 'Regional Judge', country: 'Vietnam', flag: '🇻🇳', email: 'l.hung@archery-vietnam.vn', phone: '+84-24-4567-8901' }
    ],
    
    // Event ID 4 - Spring Open Championship
    4: [
        { id: 10, name: 'Andrew Thompson', level: 'World Archery Judge Level 2', country: 'Australia', flag: '🇦🇺', email: 'a.thompson@archery.org.au', phone: '+61-2-9876-5432' },
        { id: 11, name: 'Rebecca Williams', level: 'National Judge', country: 'Australia', flag: '🇦🇺', email: 'r.williams@archery.org.au', phone: '+61-3-8765-4321' },
        { id: 12, name: 'David Brown', level: 'Regional Judge', country: 'Australia', flag: '🇦🇺', email: 'd.brown@archery.org.au', phone: '+61-7-7654-3210' }
    ],
    
    // Event ID 5 - International Archery Cup
    5: [
        { id: 13, name: 'Marie Dupont', level: 'World Archery Judge Level 3', country: 'France', flag: '🇫🇷', email: 'm.dupont@worldarchery.org', phone: '+33-1-4567-8901' },
        { id: 14, name: 'Jean-Pierre Moreau', level: 'World Archery Judge Level 3', country: 'France', flag: '🇫🇷', email: 'jp.moreau@worldarchery.org', phone: '+33-1-5678-9012' },
        { id: 15, name: 'Hans Weber', level: 'World Archery Judge Level 2', country: 'Germany', flag: '🇩🇪', email: 'h.weber@archery.de', phone: '+49-30-9876-5432' },
        { id: 16, name: 'Claudia Fischer', level: 'World Archery Judge Level 2', country: 'Germany', flag: '🇩🇪', email: 'c.fischer@archery.de', phone: '+49-89-8765-4321' },
        { id: 17, name: 'Sarah Johnson', level: 'World Archery Judge Level 2', country: 'USA', flag: '🇺🇸', email: 's.johnson@usarchery.org', phone: '+1-212-555-0123' }
    ],
    
    // Event ID 6 - Youth Development Camp
    6: [
        { id: 18, name: 'Somchai Rattana', level: 'World Archery Judge Level 2', country: 'Thailand', flag: '🇹🇭', email: 's.rattana@archery-thailand.th', phone: '+66-2-345-6789' },
        { id: 19, name: 'Apinya Suksan', level: 'National Judge', country: 'Thailand', flag: '🇹🇭', email: 'a.suksan@archery-thailand.th', phone: '+66-2-456-7890' },
        { id: 20, name: 'Nattapong Prasert', level: 'Youth Development Coach', country: 'Thailand', flag: '🇹🇭', email: 'n.prasert@archery-thailand.th', phone: '+66-2-567-8901' }
    ],
    
    // Event ID 7 - Masters League Final
    7: [
        { id: 21, name: 'John Williams', level: 'World Archery Judge Level 3', country: 'United Kingdom', flag: '🇬🇧', email: 'j.williams@worldarchery.org', phone: '+44-20-1234-5678' },
        { id: 22, name: 'Margaret Davies', level: 'World Archery Judge Level 2', country: 'United Kingdom', flag: '🇬🇧', email: 'm.davies@archerygb.org', phone: '+44-161-2345-6789' },
        { id: 23, name: 'Robert Thompson', level: 'National Judge', country: 'United Kingdom', flag: '🇬🇧', email: 'r.thompson@archerygb.org', phone: '+44-131-3456-7890' }
    ],
    
    // Event ID 8 - Summer Outdoor Classic
    8: [
        { id: 24, name: 'Michael Rodriguez', level: 'World Archery Judge Level 2', country: 'USA', flag: '🇺🇸', email: 'm.rodriguez@usarchery-ca.org', phone: '+1-310-555-0123' },
        { id: 25, name: 'Jennifer Martinez', level: 'National Judge', country: 'USA', flag: '🇺🇸', email: 'j.martinez@usarchery-ca.org', phone: '+1-619-555-0456' },
        { id: 26, name: 'Daniel Lee', level: 'Regional Judge', country: 'USA', flag: '🇺🇸', email: 'd.lee@usarchery-ca.org', phone: '+1-415-555-0789' }
    ],
    
    // Event ID 9 - Asian Games Qualifier
    9: [
        { id: 27, name: 'Wang Jian', level: 'World Archery Judge Level 3', country: 'China', flag: '🇨🇳', email: 'w.jian@archery-china.cn', phone: '+86-10-6543-2109' },
        { id: 28, name: 'Li Ming', level: 'World Archery Judge Level 3', country: 'China', flag: '🇨🇳', email: 'l.ming@archery-china.cn', phone: '+86-21-5432-1098' },
        { id: 29, name: 'Zhang Hua', level: 'World Archery Judge Level 2', country: 'China', flag: '🇨🇳', email: 'z.hua@archery-china.cn', phone: '+86-20-4321-0987' },
        { id: 4, name: 'Kim Sung-ho', level: 'World Archery Judge Level 3', country: 'South Korea', flag: '🇰🇷', email: 'k.sungho@archery-korea.kr', phone: '+82-2-987-6543' },
        { id: 1, name: 'Akira Tanaka', level: 'World Archery Judge Level 3', country: 'Japan', flag: '🇯🇵', email: 'a.tanaka@archery-japan.jp', phone: '+81-3-1234-5678' }
    ],
    
    // Event ID 10 - European Championship
    10: [
        { id: 30, name: 'Klaus Schmidt', level: 'World Archery Judge Level 3', country: 'Germany', flag: '🇩🇪', email: 'k.schmidt@archery-germany.de', phone: '+49-30-9876-5432' },
        { id: 31, name: 'Sophie Laurent', level: 'World Archery Judge Level 3', country: 'France', flag: '🇫🇷', email: 's.laurent@archery-france.fr', phone: '+33-1-6789-0123' },
        { id: 32, name: 'Marco Bianchi', level: 'World Archery Judge Level 2', country: 'Italy', flag: '🇮🇹', email: 'm.bianchi@archery-italy.it', phone: '+39-06-7890-1234' },
        { id: 33, name: 'Isabella Rodriguez', level: 'World Archery Judge Level 2', country: 'Spain', flag: '🇪🇸', email: 'i.rodriguez@archery.es', phone: '+34-91-8901-2345' },
        { id: 34, name: 'Jan Kowalski', level: 'World Archery Judge Level 2', country: 'Poland', flag: '🇵🇱', email: 'j.kowalski@archery-poland.pl', phone: '+48-22-9012-3456' }
    ],
    
    // Event ID 11 - World Cup Series Round 1
    11: [
        { id: 35, name: 'Liu Xiaobo', level: 'World Archery Judge Level 3', country: 'China', flag: '🇨🇳', email: 'l.xiaobo@archery-china.cn', phone: '+86-21-8765-4321' },
        { id: 36, name: 'Yamamoto Takeshi', level: 'World Archery Judge Level 3', country: 'Japan', flag: '🇯🇵', email: 'y.takeshi@worldarchery.org', phone: '+81-3-2345-6789' },
        { id: 37, name: 'Lee Dong-wook', level: 'World Archery Judge Level 3', country: 'South Korea', flag: '🇰🇷', email: 'l.dongwook@worldarchery.org', phone: '+82-2-3456-7890' },
        { id: 13, name: 'Marie Dupont', level: 'World Archery Judge Level 3', country: 'France', flag: '🇫🇷', email: 'm.dupont@worldarchery.org', phone: '+33-1-4567-8901' },
        { id: 21, name: 'John Williams', level: 'World Archery Judge Level 3', country: 'United Kingdom', flag: '🇬🇧', email: 'j.williams@worldarchery.org', phone: '+44-20-1234-5678' }
    ],
    
    // Event ID 12 - National Team Trials
    12: [
        { id: 38, name: 'Sato Masahiro', level: 'World Archery Judge Level 3', country: 'Japan', flag: '🇯🇵', email: 'm.sato@archery-japan.jp', phone: '+81-3-4567-8901' },
        { id: 39, name: 'Kobayashi Keiko', level: 'World Archery Judge Level 2', country: 'Japan', flag: '🇯🇵', email: 'k.kobayashi@archery-japan.jp', phone: '+81-3-5678-9012' },
        { id: 40, name: 'Tanaka Hiroshi', level: 'National Judge', country: 'Japan', flag: '🇯🇵', email: 'h.tanaka@archery-japan.jp', phone: '+81-3-6789-0123' },
        { id: 1, name: 'Akira Tanaka', level: 'World Archery Judge Level 3', country: 'Japan', flag: '🇯🇵', email: 'a.tanaka@archery-japan.jp', phone: '+81-3-1234-5678' }
    ]
};

/**
 * Get referees for a specific event
 * @param {number} eventId - Event ID
 * @returns {Array} Array of referees for the event
 */
function getRefereesByEvent(eventId) {
    return refereesData[eventId] || [];
}

/**
 * Get all referees across all events
 * @returns {Array} Array of all unique referees
 */
function getAllReferees() {
    const allReferees = [];
    const seenIds = new Set();
    
    for (const eventId in refereesData) {
        refereesData[eventId].forEach(referee => {
            if (!seenIds.has(referee.id)) {
                seenIds.add(referee.id);
                allReferees.push(referee);
            }
        });
    }
    return allReferees;
}

/**
 * Search referees by name
 * @param {number} eventId - Event ID
 * @param {string} searchTerm - Search term
 * @returns {Array} Filtered referees
 */
function searchReferees(eventId, searchTerm) {
    const referees = getRefereesByEvent(eventId);
    if (!searchTerm) return referees;
    
    const term = searchTerm.toLowerCase();
    return referees.filter(referee => 
        referee.name.toLowerCase().includes(term)
    );
}

/**
 * Get referee by ID
 * @param {number} refereeId - Referee ID
 * @returns {Object|null} Referee object or null
 */
function getRefereeById(refereeId) {
    const allReferees = getAllReferees();
    return allReferees.find(referee => referee.id === refereeId) || null;
}

/**
 * Get referees by level
 * @param {string} level - Judge level
 * @returns {Array} Filtered referees
 */
function getRefereesByLevel(level) {
    const allReferees = getAllReferees();
    return allReferees.filter(referee => referee.level === level);
}

// Export to window object for use in HTML prototypes
if (typeof window !== 'undefined') {
    window.refereesData = refereesData;
    window.getRefereesByEvent = getRefereesByEvent;
    window.getAllReferees = getAllReferees;
    window.searchReferees = searchReferees;
    window.getRefereeById = getRefereeById;
    window.getRefereesByLevel = getRefereesByLevel;
}
