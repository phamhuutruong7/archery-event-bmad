/**
 * Mock Athletes Data
 * Athletes registered for events
 */

const athletesData = {
    // Event ID 1 - 2024 National Championship
    1: [
        // Recurve Athletes
        { id: 1, name: 'Takeshi Yamamoto', team: 'Tokyo Archery Club', category: 'Recurve', division: "Men's Individual", country: 'Japan', flag: 'ðŸ‡¯ðŸ‡µ', bib: 'JPN-001' },
        { id: 2, name: 'Yuki Nakamura', team: 'Tokyo Archery Club', category: 'Recurve', division: "Women's Individual", country: 'Japan', flag: 'ðŸ‡¯ðŸ‡µ', bib: 'JPN-002' },
        { id: 3, name: 'Kenji Sato', team: 'Osaka Archery Club', category: 'Recurve', division: "Men's Team", country: 'Japan', flag: 'ðŸ‡¯ðŸ‡µ', bib: 'JPN-003' },
        { id: 4, name: 'Hiroshi Tanaka', team: 'Osaka Archery Club', category: 'Recurve', division: "Men's Team", country: 'Japan', flag: 'ðŸ‡¯ðŸ‡µ', bib: 'JPN-004' },
        { id: 105, name: 'Ichiro Suzuki', team: 'Kyoto Archers', category: 'Recurve', division: "Men's Individual", country: 'Japan', flag: 'ðŸ‡¯ðŸ‡µ', bib: 'JPN-105' },
        { id: 106, name: 'Tomoe Yamamoto', team: 'Tokyo Archery Club', category: 'Recurve', division: "Women's Team", country: 'Japan', flag: 'ðŸ‡¯ðŸ‡µ', bib: 'JPN-106' },
        { id: 107, name: 'Daichi Nakamura', team: 'Osaka Archery Club', category: 'Recurve', division: "Men's Individual", country: 'Japan', flag: 'ðŸ‡¯ðŸ‡µ', bib: 'JPN-107' },
        { id: 108, name: 'Yuki Sato', team: 'Hiroshima Archery', category: 'Recurve', division: "Women's Individual", country: 'Japan', flag: 'ðŸ‡¯ðŸ‡µ', bib: 'JPN-108' },
        
        // Compound Athletes
        { id: 5, name: 'Yuto Suzuki', team: 'Kyoto Archers', category: 'Compound', division: "Men's Individual", country: 'Japan', flag: 'ðŸ‡¯ðŸ‡µ', bib: 'JPN-005' },
        { id: 6, name: 'Sakura Yamada', team: 'Kyoto Archers', category: 'Compound', division: "Women's Individual", country: 'Japan', flag: 'ðŸ‡¯ðŸ‡µ', bib: 'JPN-006' },
        { id: 101, name: 'Masaru Fujita', team: 'Hiroshima Archery', category: 'Compound', division: "Men's Individual", country: 'Japan', flag: 'ðŸ‡¯ðŸ‡µ', bib: 'JPN-101' },
        { id: 102, name: 'Aiko Nakamura', team: 'Nagoya Archers', category: 'Compound', division: "Women's Individual", country: 'Japan', flag: 'ðŸ‡¯ðŸ‡µ', bib: 'JPN-102' },
        { id: 103, name: 'Teruo Yamada', team: 'Sapporo Archery Club', category: 'Compound', division: "Men's Individual", country: 'Japan', flag: 'ðŸ‡¯ðŸ‡µ', bib: 'JPN-103' },
        { id: 104, name: 'Minori Tanaka', team: 'Fukuoka Archers', category: 'Compound', division: "Women's Individual", country: 'Japan', flag: 'ðŸ‡¯ðŸ‡µ', bib: 'JPN-104' },
        { id: 111, name: 'Shiro Nakamura', team: 'Kyoto Archers', category: 'Compound', division: "Men's Individual", country: 'Japan', flag: 'ðŸ‡¯ðŸ‡µ', bib: 'JPN-111' },
        { id: 112, name: 'Kaori Yamamoto', team: 'Tokyo Archery Club', category: 'Compound', division: "Women's Individual", country: 'Japan', flag: 'ðŸ‡¯ðŸ‡µ', bib: 'JPN-112' },
        { id: 113, name: 'Takeshi Sato', team: 'Osaka Archery Club', category: 'Compound', division: "Men's Individual", country: 'Japan', flag: 'ðŸ‡¯ðŸ‡µ', bib: 'JPN-113' },
        { id: 114, name: 'Akane Tanaka', team: 'Hiroshima Archery', category: 'Compound', division: "Women's Individual", country: 'Japan', flag: 'ðŸ‡¯ðŸ‡µ', bib: 'JPN-114' },
        { id: 115, name: 'Jiro Suzuki', team: 'Nagoya Archers', category: 'Compound', division: "Men's Individual", country: 'Japan', flag: 'ðŸ‡¯ðŸ‡µ', bib: 'JPN-115' },
        { id: 116, name: 'Hana Yamada', team: 'Sapporo Archery Club', category: 'Compound', division: "Women's Individual", country: 'Japan', flag: 'ðŸ‡¯ðŸ‡µ', bib: 'JPN-116' },
        
        // Barebow Athletes
        { id: 109, name: 'Hideo Tanaka', team: 'Nagoya Archers', category: 'Barebow', division: "Men's Individual", country: 'Japan', flag: 'ðŸ‡¯ðŸ‡µ', bib: 'JPN-109' },
        { id: 110, name: 'Haruka Yamada', team: 'Sapporo Archery Club', category: 'Barebow', division: "Women's Individual", country: 'Japan', flag: 'ðŸ‡¯ðŸ‡µ', bib: 'JPN-110' }
    ],
    
    // Event ID 2 - Regional Qualifier 2024
    2: [
        { id: 7, name: 'Kim Min-jun', team: 'Seoul National Team', category: 'Recurve', division: "Men's Individual", country: 'South Korea', flag: 'ðŸ‡°ðŸ‡·', bib: 'KOR-001' },
        { id: 8, name: 'Park Ji-won', team: 'Seoul National Team', category: 'Recurve', division: "Women's Individual", country: 'South Korea', flag: 'ðŸ‡°ðŸ‡·', bib: 'KOR-002' },
        { id: 9, name: 'Lee Sang-ho', team: 'Busan Archery Club', category: 'Recurve', division: "Men's Individual", country: 'South Korea', flag: 'ðŸ‡°ðŸ‡·', bib: 'KOR-003' },
        { id: 10, name: 'Choi Min-ji', team: 'Seoul National Team', category: 'Compound', division: "Women's Individual", country: 'South Korea', flag: 'ðŸ‡°ðŸ‡·', bib: 'KOR-004' },
        { id: 11, name: 'David Chen', team: 'Shanghai Sports Club', category: 'Compound', division: "Men's Individual", country: 'China', flag: 'ðŸ‡¨ðŸ‡³', bib: 'CHN-001' },
        { id: 12, name: 'Li Wei', team: 'Beijing Archery Team', category: 'Compound', division: "Women's Individual", country: 'China', flag: 'ðŸ‡¨ðŸ‡³', bib: 'CHN-002' }
    ],
    
    // Event ID 3 - Winter Indoor Tournament
    3: [
        { id: 13, name: 'Nguyen Van An', team: 'Hanoi Archery Club', category: 'Recurve', division: "Men's Individual", country: 'Vietnam', flag: 'ðŸ‡»ðŸ‡³', bib: 'VIE-001' },
        { id: 14, name: 'Tran Thi Mai', team: 'Hanoi Archery Club', category: 'Recurve', division: "Women's Individual", country: 'Vietnam', flag: 'ðŸ‡»ðŸ‡³', bib: 'VIE-002' },
        { id: 15, name: 'Le Van Minh', team: 'Ho Chi Minh Archers', category: 'Compound', division: "Men's Individual", country: 'Vietnam', flag: 'ðŸ‡»ðŸ‡³', bib: 'VIE-003' },
        { id: 16, name: 'Pham Thi Lan', team: 'Da Nang Archery Team', category: 'Compound', division: "Women's Individual", country: 'Vietnam', flag: 'ðŸ‡»ðŸ‡³', bib: 'VIE-004' },
        { id: 17, name: 'Vo Van Thanh', team: 'Hanoi Archery Club', category: 'Barebow', division: "Men's Individual", country: 'Vietnam', flag: 'ðŸ‡»ðŸ‡³', bib: 'VIE-005' },
        { id: 18, name: 'Nguyen Thi Hoa', team: 'Ho Chi Minh Archers', category: 'Barebow', division: "Women's Individual", country: 'Vietnam', flag: 'ðŸ‡»ðŸ‡³', bib: 'VIE-006' }
    ],
    
    // Event ID 4 - Spring Open Championship
    4: [
        { id: 19, name: 'James Mitchell', team: 'Melbourne Arrows', category: 'Recurve', division: "Men's Individual", country: 'Australia', flag: 'ðŸ‡¦ðŸ‡º', bib: 'AUS-001' },
        { id: 20, name: 'Emma Wilson', team: 'Sydney Archers', category: 'Recurve', division: "Women's Individual", country: 'Australia', flag: 'ðŸ‡¦ðŸ‡º', bib: 'AUS-002' },
        { id: 21, name: 'Oliver Brown', team: 'Brisbane Archery Club', category: 'Recurve', division: "Men's Individual", country: 'Australia', flag: 'ðŸ‡¦ðŸ‡º', bib: 'AUS-003' },
        { id: 22, name: 'Sophie Taylor', team: 'Perth Archers', category: 'Recurve', division: "Women's Individual", country: 'Australia', flag: 'ðŸ‡¦ðŸ‡º', bib: 'AUS-004' },
        { id: 23, name: 'Lucas Anderson', team: 'Melbourne Arrows', category: 'Barebow', division: "Men's Individual", country: 'Australia', flag: 'ðŸ‡¦ðŸ‡º', bib: 'AUS-005' },
        { id: 24, name: 'Isabella White', team: 'Sydney Archers', category: 'Barebow', division: "Women's Individual", country: 'Australia', flag: 'ðŸ‡¦ðŸ‡º', bib: 'AUS-006' }
    ],
    
    // Event ID 5 - International Archery Cup
    5: [
        { id: 25, name: 'Sophie Martin', team: 'Paris Archery Federation', category: 'Recurve', division: "Women's Individual", country: 'France', flag: 'ðŸ‡«ðŸ‡·', bib: 'FRA-001' },
        { id: 26, name: 'Lucas Dubois', team: 'Paris Archery Federation', category: 'Compound', division: "Men's Individual", country: 'France', flag: 'ðŸ‡«ðŸ‡·', bib: 'FRA-002' },
        { id: 27, name: 'Marie Lefebvre', team: 'Lyon Archers', category: 'Recurve', division: "Women's Team", country: 'France', flag: 'ðŸ‡«ðŸ‡·', bib: 'FRA-003' },
        { id: 28, name: 'Oliver Schmidt', team: 'Berlin Archery Club', category: 'Recurve', division: "Men's Individual", country: 'Germany', flag: 'ðŸ‡©ðŸ‡ª', bib: 'GER-001' },
        { id: 29, name: 'Anna MÃ¼ller', team: 'Munich Archers', category: 'Compound', division: "Women's Individual", country: 'Germany', flag: 'ðŸ‡©ðŸ‡ª', bib: 'GER-002' },
        { id: 30, name: 'Hans Weber', team: 'Hamburg Archery Team', category: 'Recurve', division: "Men's Team", country: 'Germany', flag: 'ðŸ‡©ðŸ‡ª', bib: 'GER-003' },
        { id: 31, name: 'Michael Anderson', team: 'California Archery Team', category: 'Compound', division: "Men's Individual", country: 'USA', flag: 'ðŸ‡ºðŸ‡¸', bib: 'USA-001' },
        { id: 32, name: 'Sarah Johnson', team: 'New York Archers', category: 'Recurve', division: "Women's Individual", country: 'USA', flag: 'ðŸ‡ºðŸ‡¸', bib: 'USA-002' },
        { id: 33, name: 'Robert Williams', team: 'Texas Archery Club', category: 'Compound', division: "Men's Team", country: 'USA', flag: 'ðŸ‡ºðŸ‡¸', bib: 'USA-003' },
        { id: 34, name: 'Emily Davis', team: 'Florida Archers', category: 'Recurve', division: "Women's Team", country: 'USA', flag: 'ðŸ‡ºðŸ‡¸', bib: 'USA-004' }
    ],
    
    // Event ID 6 - Youth Development Camp
    6: [
        { id: 35, name: 'Somchai Pattana', team: 'Bangkok Youth Archery', category: 'Recurve', division: "Junior Men's Individual", country: 'Thailand', flag: 'ðŸ‡¹ðŸ‡­', bib: 'THA-001' },
        { id: 36, name: 'Apinya Wongsa', team: 'Bangkok Youth Archery', category: 'Recurve', division: "Junior Women's Individual", country: 'Thailand', flag: 'ðŸ‡¹ðŸ‡­', bib: 'THA-002' },
        { id: 37, name: 'Nattapong Siri', team: 'Chiang Mai Juniors', category: 'Recurve', division: "Cadet Men's Individual", country: 'Thailand', flag: 'ðŸ‡¹ðŸ‡­', bib: 'THA-003' },
        { id: 38, name: 'Suwanna Chai', team: 'Phuket Youth Team', category: 'Recurve', division: "Cadet Women's Individual", country: 'Thailand', flag: 'ðŸ‡¹ðŸ‡­', bib: 'THA-004' },
        { id: 39, name: 'Thanakorn Boon', team: 'Bangkok Youth Archery', category: 'Compound', division: "Junior Men's Individual", country: 'Thailand', flag: 'ðŸ‡¹ðŸ‡­', bib: 'THA-005' },
        { id: 40, name: 'Pimchanok Aran', team: 'Chiang Mai Juniors', category: 'Compound', division: "Junior Women's Individual", country: 'Thailand', flag: 'ðŸ‡¹ðŸ‡­', bib: 'THA-006' }
    ],
    
    // Event ID 7 - Masters League Final
    7: [
        { id: 41, name: 'John Williams', team: 'London Masters', category: 'Recurve', division: "Men's Individual", country: 'United Kingdom', flag: 'ðŸ‡¬ðŸ‡§', bib: 'GBR-001' },
        { id: 42, name: 'Elizabeth Brown', team: 'Manchester Archers', category: 'Recurve', division: "Women's Individual", country: 'United Kingdom', flag: 'ðŸ‡¬ðŸ‡§', bib: 'GBR-002' },
        { id: 43, name: 'George Thompson', team: 'Edinburgh Masters', category: 'Compound', division: "Men's Individual", country: 'United Kingdom', flag: 'ðŸ‡¬ðŸ‡§', bib: 'GBR-003' },
        { id: 44, name: 'Margaret Davies', team: 'Cardiff Archery Club', category: 'Compound', division: "Women's Individual", country: 'United Kingdom', flag: 'ðŸ‡¬ðŸ‡§', bib: 'GBR-004' }
    ],
    
    // Event ID 8 - Summer Outdoor Classic
    8: [
        { id: 45, name: 'Carlos Rodriguez', team: 'Los Angeles Archers', category: 'Recurve', division: "Men's Individual", country: 'USA', flag: 'ðŸ‡ºðŸ‡¸', bib: 'USA-101' },
        { id: 46, name: 'Jennifer Martinez', team: 'San Diego Archery Club', category: 'Recurve', division: "Women's Individual", country: 'USA', flag: 'ðŸ‡ºðŸ‡¸', bib: 'USA-102' },
        { id: 47, name: 'Daniel Lee', team: 'San Francisco Archers', category: 'Compound', division: "Men's Individual", country: 'USA', flag: 'ðŸ‡ºðŸ‡¸', bib: 'USA-103' },
        { id: 48, name: 'Michelle Chen', team: 'Los Angeles Archers', category: 'Compound', division: "Women's Individual", country: 'USA', flag: 'ðŸ‡ºðŸ‡¸', bib: 'USA-104' },
        { id: 49, name: 'Ryan Thompson', team: 'Sacramento Archery Team', category: 'Barebow', division: "Men's Individual", country: 'USA', flag: 'ðŸ‡ºðŸ‡¸', bib: 'USA-105' },
        { id: 50, name: 'Amanda Garcia', team: 'San Diego Archery Club', category: 'Barebow', division: "Women's Individual", country: 'USA', flag: 'ðŸ‡ºðŸ‡¸', bib: 'USA-106' }
    ],
    
    // Event ID 9 - Asian Games Qualifier
    9: [
        { id: 51, name: 'Zhang Wei', team: 'Beijing National Team', category: 'Recurve', division: "Men's Individual", country: 'China', flag: 'ðŸ‡¨ðŸ‡³', bib: 'CHN-101' },
        { id: 52, name: 'Wang Li', team: 'Shanghai National Team', category: 'Recurve', division: "Women's Individual", country: 'China', flag: 'ðŸ‡¨ðŸ‡³', bib: 'CHN-102' },
        { id: 53, name: 'Liu Yang', team: 'Beijing National Team', category: 'Recurve', division: "Men's Team", country: 'China', flag: 'ðŸ‡¨ðŸ‡³', bib: 'CHN-103' },
        { id: 54, name: 'Chen Mei', team: 'Shanghai National Team', category: 'Recurve', division: "Women's Team", country: 'China', flag: 'ðŸ‡¨ðŸ‡³', bib: 'CHN-104' },
        { id: 55, name: 'Zhao Jun', team: 'Guangzhou Archers', category: 'Compound', division: "Men's Individual", country: 'China', flag: 'ðŸ‡¨ðŸ‡³', bib: 'CHN-105' },
        { id: 56, name: 'Lin Xia', team: 'Shenzhen Archery Team', category: 'Compound', division: "Women's Individual", country: 'China', flag: 'ðŸ‡¨ðŸ‡³', bib: 'CHN-106' }
    ],
    
    // Event ID 10 - European Championship
    10: [
        { id: 57, name: 'Maximilian Fischer', team: 'German National Team', category: 'Recurve', division: "Men's Individual", country: 'Germany', flag: 'ðŸ‡©ðŸ‡ª', bib: 'GER-201' },
        { id: 58, name: 'Laura Schmidt', team: 'German National Team', category: 'Recurve', division: "Women's Individual", country: 'Germany', flag: 'ðŸ‡©ðŸ‡ª', bib: 'GER-202' },
        { id: 59, name: 'Pierre Dubois', team: 'French National Team', category: 'Recurve', division: "Men's Team", country: 'France', flag: 'ðŸ‡«ðŸ‡·', bib: 'FRA-201' },
        { id: 60, name: 'Camille Martin', team: 'French National Team', category: 'Recurve', division: "Women's Team", country: 'France', flag: 'ðŸ‡«ðŸ‡·', bib: 'FRA-202' },
        { id: 61, name: 'Marco Rossi', team: 'Italian National Team', category: 'Compound', division: "Men's Individual", country: 'Italy', flag: 'ðŸ‡®ðŸ‡¹', bib: 'ITA-001' },
        { id: 62, name: 'Giulia Ferrari', team: 'Italian National Team', category: 'Compound', division: "Women's Individual", country: 'Italy', flag: 'ðŸ‡®ðŸ‡¹', bib: 'ITA-002' },
        { id: 63, name: 'Jan Kowalski', team: 'Polish National Team', category: 'Recurve', division: "Junior Men's Individual", country: 'Poland', flag: 'ðŸ‡µðŸ‡±', bib: 'POL-001' },
        { id: 64, name: 'Anna Nowak', team: 'Polish National Team', category: 'Recurve', division: "Junior Women's Individual", country: 'Poland', flag: 'ðŸ‡µðŸ‡±', bib: 'POL-002' }
    ],
    
    // Event ID 11 - World Cup Series Round 1
    11: [
        { id: 65, name: 'Yang Bo', team: 'Shanghai Elite Team', category: 'Recurve', division: "Men's Individual", country: 'China', flag: 'ðŸ‡¨ðŸ‡³', bib: 'CHN-301' },
        { id: 66, name: 'Sun Mei', team: 'Beijing Elite Team', category: 'Recurve', division: "Women's Individual", country: 'China', flag: 'ðŸ‡¨ðŸ‡³', bib: 'CHN-302' },
        { id: 67, name: 'Park Sung-hyun', team: 'Korean National Team', category: 'Recurve', division: "Men's Team", country: 'South Korea', flag: 'ðŸ‡°ðŸ‡·', bib: 'KOR-301' },
        { id: 68, name: 'Kim Yu-jin', team: 'Korean National Team', category: 'Recurve', division: "Women's Team", country: 'South Korea', flag: 'ðŸ‡°ðŸ‡·', bib: 'KOR-302' },
        { id: 69, name: 'Takahashi Ryu', team: 'Japanese National Team', category: 'Recurve', division: "Men's Individual", country: 'Japan', flag: 'ðŸ‡¯ðŸ‡µ', bib: 'JPN-301' },
        { id: 70, name: 'Tanaka Yui', team: 'Japanese National Team', category: 'Recurve', division: "Women's Individual", country: 'Japan', flag: 'ðŸ‡¯ðŸ‡µ', bib: 'JPN-302' }
    ],
    
    // Event ID 12 - National Team Trials
    12: [
        { id: 71, name: 'Sato Hiroshi', team: 'Tokyo Regional', category: 'Recurve', division: "Men's Individual", country: 'Japan', flag: 'ðŸ‡¯ðŸ‡µ', bib: 'JPN-401' },
        { id: 72, name: 'Watanabe Aiko', team: 'Osaka Regional', category: 'Recurve', division: "Women's Individual", country: 'Japan', flag: 'ðŸ‡¯ðŸ‡µ', bib: 'JPN-402' },
        { id: 73, name: 'Nakamura Kenji', team: 'Kyoto Regional', category: 'Compound', division: "Men's Individual", country: 'Japan', flag: 'ðŸ‡¯ðŸ‡µ', bib: 'JPN-403' },
        { id: 74, name: 'Kobayashi Yuki', team: 'Tokyo Regional', category: 'Compound', division: "Women's Individual", country: 'Japan', flag: 'ðŸ‡¯ðŸ‡µ', bib: 'JPN-404' },
        { id: 75, name: 'Ito Shun', team: 'Hokkaido Regional', category: 'Recurve', division: "Junior Men's Individual", country: 'Japan', flag: 'ðŸ‡¯ðŸ‡µ', bib: 'JPN-405' },
        { id: 76, name: 'Suzuki Hana', team: 'Fukuoka Regional', category: 'Recurve', division: "Junior Women's Individual", country: 'Japan', flag: 'ðŸ‡¯ðŸ‡µ', bib: 'JPN-406' }
    ]
};

/**
 * Get athletes for a specific event
 * @param {number} eventId - Event ID
 * @returns {Array} Array of athletes for the event
 */
function getAthletesByEvent(eventId) {
    return athletesData[eventId] || [];
}

/**
 * Get all athletes across all events
 * @returns {Array} Array of all athletes
 */
function getAllAthletes() {
    const allAthletes = [];
    for (const eventId in athletesData) {
        allAthletes.push(...athletesData[eventId]);
    }
    return allAthletes;
}

/**
 * Search athletes by name or team
 * @param {number} eventId - Event ID
 * @param {string} searchTerm - Search term
 * @returns {Array} Filtered athletes
 */
function searchAthletes(eventId, searchTerm) {
    const athletes = getAthletesByEvent(eventId);
    if (!searchTerm) return athletes;
    
    const term = searchTerm.toLowerCase();
    return athletes.filter(athlete => 
        athlete.name.toLowerCase().includes(term) || 
        athlete.team.toLowerCase().includes(term)
    );
}

/**
 * Get athlete by ID
 * @param {number} athleteId - Athlete ID
 * @returns {Object|null} Athlete object or null
 */
function getAthleteById(athleteId) {
    const allAthletes = getAllAthletes();
    return allAthletes.find(athlete => athlete.id === athleteId) || null;
}

// Export to window object for use in HTML prototypes
if (typeof window !== 'undefined') {
    window.athletesData = athletesData;
    window.getAthletesByEvent = getAthletesByEvent;
    window.getAllAthletes = getAllAthletes;
    window.searchAthletes = searchAthletes;
    window.getAthleteById = getAthleteById;
}