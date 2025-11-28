/**
 * Mock Athlete Competitions Data
 * Maps which competitions each athlete is registered for in each event
 */

const athleteCompetitionsData = {
    // Event 1: 2024 National Championship (Tokyo, Japan)
    1: {
        1: [ // Takeshi Yamamoto
            { id: 1, category: 'Recurve', division: "Men's Individual", distance: '70m', format: 'Olympic Round' },
            { id: 3, category: 'Recurve', division: "Men's Team", distance: '70m', format: 'Olympic Round' }
        ],
        2: [ // Yuki Nakamura
            { id: 2, category: 'Recurve', division: "Women's Individual", distance: '70m', format: 'Olympic Round' },
            { id: 4, category: 'Recurve', division: "Women's Team", distance: '70m', format: 'Olympic Round' }
        ],
        3: [ // Kenji Sato
            { id: 1, category: 'Recurve', division: "Men's Individual", distance: '70m', format: 'Olympic Round' }
        ],
        4: [ // Haruka Tanaka
            { id: 2, category: 'Recurve', division: "Women's Individual", distance: '70m', format: 'Olympic Round' }
        ],
        105: [ // Ichiro Suzuki
            { id: 1, category: 'Recurve', division: "Men's Individual", distance: '70m', format: 'Olympic Round' }
        ],
        106: [ // Tomoe Yamamoto
            { id: 4, category: 'Recurve', division: "Women's Team", distance: '70m', format: 'Olympic Round' }
        ],
        107: [ // Daichi Nakamura
            { id: 1, category: 'Recurve', division: "Men's Individual", distance: '70m', format: 'Olympic Round' }
        ],
        108: [ // Yuki Sato
            { id: 2, category: 'Recurve', division: "Women's Individual", distance: '70m', format: 'Olympic Round' }
        ],
        5: [ // Yuto Suzuki
            { id: 5, category: 'Compound', division: "Men's Individual", distance: '50m', format: 'Compound Round' }
        ],
        6: [ // Sakura Yamada
            { id: 6, category: 'Compound', division: "Women's Individual", distance: '50m', format: 'Compound Round' }
        ],
        101: [ // Masaru Fujita
            { id: 5, category: 'Compound', division: "Men's Individual", distance: '50m', format: 'Compound Round' }
        ],
        102: [ // Aiko Nakamura
            { id: 6, category: 'Compound', division: "Women's Individual", distance: '50m', format: 'Compound Round' }
        ],
        103: [ // Teruo Yamada
            { id: 5, category: 'Compound', division: "Men's Individual", distance: '50m', format: 'Compound Round' }
        ],
        104: [ // Minori Tanaka
            { id: 6, category: 'Compound', division: "Women's Individual", distance: '50m', format: 'Compound Round' }
        ],
        111: [ // Shiro Nakamura
            { id: 5, category: 'Compound', division: "Men's Individual", distance: '50m', format: 'Compound Round' }
        ],
        112: [ // Kaori Yamamoto
            { id: 6, category: 'Compound', division: "Women's Individual", distance: '50m', format: 'Compound Round' }
        ],
        113: [ // Takeshi Sato
            { id: 5, category: 'Compound', division: "Men's Individual", distance: '50m', format: 'Compound Round' }
        ],
        114: [ // Akane Tanaka
            { id: 6, category: 'Compound', division: "Women's Individual", distance: '50m', format: 'Compound Round' }
        ],
        115: [ // Jiro Suzuki
            { id: 5, category: 'Compound', division: "Men's Individual", distance: '50m', format: 'Compound Round' }
        ],
        116: [ // Hana Yamada
            { id: 6, category: 'Compound', division: "Women's Individual", distance: '50m', format: 'Compound Round' }
        ],
        109: [ // Hideo Tanaka
            { id: 9, category: 'Barebow', division: "Men's Individual", distance: '50m', format: 'Barebow Round' }
        ],
        110: [ // Haruka Yamada
            { id: 10, category: 'Barebow', division: "Women's Individual", distance: '50m', format: 'Barebow Round' }
        ]
    },
    
    // Event 2: Regional Qualifier 2024 (Seoul, Korea)
    2: {
        7: [ // Kim Min-jun
            { id: 1, category: 'Recurve', division: "Men's Individual", distance: '70m', format: 'Olympic Round' },
            { id: 5, category: 'Recurve', division: "Mixed Team", distance: '70m', format: 'Olympic Round' }
        ],
        8: [ // Park Ji-won
            { id: 2, category: 'Recurve', division: "Women's Individual", distance: '70m', format: 'Olympic Round' },
            { id: 5, category: 'Recurve', division: "Mixed Team", distance: '70m', format: 'Olympic Round' }
        ],
        9: [ // Lee Dong-hyun
            { id: 1, category: 'Recurve', division: "Men's Individual", distance: '70m', format: 'Olympic Round' }
        ],
        10: [ // David Chen
            { id: 11, category: 'Compound', division: "Men's Individual", distance: '50m', format: 'Compound Round' },
            { id: 15, category: 'Compound', division: "Mixed Team", distance: '50m', format: 'Compound Round' }
        ],
        11: [ // Li Wei
            { id: 12, category: 'Compound', division: "Women's Individual", distance: '50m', format: 'Compound Round' },
            { id: 15, category: 'Compound', division: "Mixed Team", distance: '50m', format: 'Compound Round' }
        ],
        12: [ // Zhang Min
            { id: 11, category: 'Compound', division: "Men's Individual", distance: '50m', format: 'Compound Round' }
        ]
    },
    
    // Event 3: Winter Indoor Tournament (Hanoi, Vietnam)
    3: {
        13: [ // Nguyen Van An
            { id: 6, category: 'Recurve', division: "Men's Individual", distance: '18m', format: 'Indoor' },
            { id: 8, category: 'Recurve', division: "Men's Team", distance: '18m', format: 'Indoor' }
        ],
        14: [ // Tran Thi Mai
            { id: 7, category: 'Recurve', division: "Women's Individual", distance: '18m', format: 'Indoor' },
            { id: 9, category: 'Recurve', division: "Women's Team", distance: '18m', format: 'Indoor' }
        ],
        15: [ // Le Hoang
            { id: 16, category: 'Compound', division: "Men's Individual", distance: '18m', format: 'Indoor' }
        ],
        16: [ // Pham Thu Ha
            { id: 17, category: 'Compound', division: "Women's Individual", distance: '18m', format: 'Indoor' }
        ],
        17: [ // Vo Minh Tuan
            { id: 53, category: 'Barebow', division: "Men's Individual", distance: '18m', format: 'Indoor' }
        ],
        18: [ // Dang Kim Anh
            { id: 54, category: 'Barebow', division: "Women's Individual", distance: '18m', format: 'Indoor' }
        ]
    },
    
    // Event 4: Spring Open Championship (Sydney, Australia)
    4: {
        19: [ // James Mitchell
            { id: 36, category: 'Recurve', division: "Men's Individual", distance: '50m', format: 'Qualification Round' },
            { id: 38, category: 'Recurve', division: "Men's Individual", distance: '30m', format: 'Qualification Round' }
        ],
        20: [ // Emma Wilson
            { id: 37, category: 'Recurve', division: "Women's Individual", distance: '50m', format: 'Qualification Round' },
            { id: 39, category: 'Recurve', division: "Women's Individual", distance: '30m', format: 'Qualification Round' }
        ],
        21: [ // Oliver Brown
            { id: 36, category: 'Recurve', division: "Men's Individual", distance: '50m', format: 'Qualification Round' }
        ],
        22: [ // Sophie Taylor
            { id: 37, category: 'Recurve', division: "Women's Individual", distance: '50m', format: 'Qualification Round' }
        ],
        23: [ // Daniel Harris
            { id: 21, category: 'Barebow', division: "Men's Individual", distance: '50m', format: 'Barebow Round' }
        ],
        24: [ // Isabella Clark
            { id: 22, category: 'Barebow', division: "Women's Individual", distance: '50m', format: 'Barebow Round' }
        ]
    },
    
    // Event 5: International Archery Cup (Paris, France)
    5: {
        25: [ // Sophie Martin
            { id: 2, category: 'Recurve', division: "Women's Individual", distance: '70m', format: 'Olympic Round' },
            { id: 4, category: 'Recurve', division: "Women's Team", distance: '70m', format: 'Olympic Round' },
            { id: 5, category: 'Recurve', division: "Mixed Team", distance: '70m', format: 'Olympic Round' }
        ],
        26: [ // Lucas Dubois
            { id: 11, category: 'Compound', division: "Men's Individual", distance: '50m', format: 'Compound Round' },
            { id: 13, category: 'Compound', division: "Men's Team", distance: '50m', format: 'Compound Round' }
        ],
        27: [ // Marie Lambert
            { id: 2, category: 'Recurve', division: "Women's Individual", distance: '70m', format: 'Olympic Round' }
        ],
        28: [ // Oliver Schmidt
            { id: 1, category: 'Recurve', division: "Men's Individual", distance: '70m', format: 'Olympic Round' },
            { id: 3, category: 'Recurve', division: "Men's Team", distance: '70m', format: 'Olympic Round' }
        ],
        29: [ // Anna MÃ¼ller
            { id: 12, category: 'Compound', division: "Women's Individual", distance: '50m', format: 'Compound Round' },
            { id: 14, category: 'Compound', division: "Women's Team", distance: '50m', format: 'Compound Round' },
            { id: 15, category: 'Compound', division: "Mixed Team", distance: '50m', format: 'Compound Round' }
        ],
        30: [ // Felix Wagner
            { id: 11, category: 'Compound', division: "Men's Individual", distance: '50m', format: 'Compound Round' },
            { id: 15, category: 'Compound', division: "Mixed Team", distance: '50m', format: 'Compound Round' }
        ],
        31: [ // Michael Anderson
            { id: 11, category: 'Compound', division: "Men's Individual", distance: '50m', format: 'Compound Round' }
        ],
        32: [ // Sarah Johnson
            { id: 12, category: 'Compound', division: "Women's Individual", distance: '50m', format: 'Compound Round' }
        ],
        33: [ // Thomas Petit
            { id: 1, category: 'Recurve', division: "Men's Individual", distance: '70m', format: 'Olympic Round' }
        ],
        34: [ // Julia Fischer
            { id: 2, category: 'Recurve', division: "Women's Individual", distance: '70m', format: 'Olympic Round' }
        ]
    },
    
    // Event 6: Youth Development Camp (Bangkok, Thailand)
    6: {
        35: [ // Somchai Prasert
            { id: 26, category: 'Recurve', division: "Junior Men's Individual", distance: '70m', format: 'Olympic Round' }
        ],
        36: [ // Nattaya Siriwan
            { id: 27, category: 'Recurve', division: "Junior Women's Individual", distance: '70m', format: 'Olympic Round' }
        ],
        37: [ // Kitti Wongsawat
            { id: 28, category: 'Recurve', division: "Cadet Men's Individual", distance: '60m', format: 'Olympic Round' }
        ],
        38: [ // Pimchanok Tanaka
            { id: 29, category: 'Recurve', division: "Cadet Women's Individual", distance: '60m', format: 'Olympic Round' }
        ],
        39: [ // Apirat Chaiyaporn
            { id: 30, category: 'Compound', division: "Junior Men's Individual", distance: '50m', format: 'Compound Round' }
        ],
        40: [ // Siriporn Methee
            { id: 31, category: 'Compound', division: "Junior Women's Individual", distance: '50m', format: 'Compound Round' }
        ]
    },
    
    // Event 7: Masters League Final (London, UK)
    7: {
        41: [ // William Thompson
            { id: 36, category: 'Recurve', division: "Men's Individual", distance: '50m', format: 'Qualification Round' },
            { id: 1000, category: 'Recurve', division: "Masters 50+ Men's", distance: '50m', format: 'Masters Round' }
        ],
        42: [ // Margaret Davies
            { id: 37, category: 'Recurve', division: "Women's Individual", distance: '50m', format: 'Qualification Round' }
        ],
        43: [ // Robert Wilson
            { id: 42, category: 'Compound', division: "Men's Individual", distance: '30m', format: 'Qualification Round' },
            { id: 1001, category: 'Compound', division: "Masters 50+ Men's", distance: '30m', format: 'Masters Round' }
        ],
        44: [ // Elizabeth Brown
            { id: 43, category: 'Compound', division: "Women's Individual", distance: '30m', format: 'Qualification Round' }
        ]
    },
    
    // Event 8: Summer Outdoor Classic (Los Angeles, USA)
    8: {
        45: [ // Michael Anderson
            { id: 1, category: 'Recurve', division: "Men's Individual", distance: '70m', format: 'Olympic Round' },
            { id: 34, category: 'Recurve', division: "Men's Individual", distance: '60m', format: 'Qualification Round' }
        ],
        46: [ // Sarah Johnson
            { id: 2, category: 'Recurve', division: "Women's Individual", distance: '70m', format: 'Olympic Round' },
            { id: 35, category: 'Recurve', division: "Women's Individual", distance: '60m', format: 'Qualification Round' }
        ],
        47: [ // David Miller
            { id: 11, category: 'Compound', division: "Men's Individual", distance: '50m', format: 'Compound Round' }
        ],
        48: [ // Jennifer Davis
            { id: 12, category: 'Compound', division: "Women's Individual", distance: '50m', format: 'Compound Round' }
        ],
        49: [ // Robert Garcia
            { id: 21, category: 'Barebow', division: "Men's Individual", distance: '50m', format: 'Barebow Round' }
        ],
        50: [ // Lisa Martinez
            { id: 22, category: 'Barebow', division: "Women's Individual", distance: '50m', format: 'Barebow Round' }
        ]
    },
    
    // Event 9: Asian Games Qualifier (Beijing, China)
    9: {
        51: [ // David Chen
            { id: 11, category: 'Compound', division: "Men's Individual", distance: '50m', format: 'Compound Round' },
            { id: 13, category: 'Compound', division: "Men's Team", distance: '50m', format: 'Compound Round' }
        ],
        52: [ // Li Wei
            { id: 12, category: 'Compound', division: "Women's Individual", distance: '50m', format: 'Compound Round' },
            { id: 14, category: 'Compound', division: "Women's Team", distance: '50m', format: 'Compound Round' }
        ],
        53: [ // Kim Min-jun
            { id: 1, category: 'Recurve', division: "Men's Individual", distance: '70m', format: 'Olympic Round' },
            { id: 3, category: 'Recurve', division: "Men's Team", distance: '70m', format: 'Olympic Round' },
            { id: 5, category: 'Recurve', division: "Mixed Team", distance: '70m', format: 'Olympic Round' }
        ],
        54: [ // Park Ji-won
            { id: 2, category: 'Recurve', division: "Women's Individual", distance: '70m', format: 'Olympic Round' },
            { id: 4, category: 'Recurve', division: "Women's Team", distance: '70m', format: 'Olympic Round' },
            { id: 5, category: 'Recurve', division: "Mixed Team", distance: '70m', format: 'Olympic Round' }
        ],
        55: [ // Takeshi Yamamoto
            { id: 1, category: 'Recurve', division: "Men's Individual", distance: '70m', format: 'Olympic Round' }
        ],
        56: [ // Yuki Nakamura
            { id: 2, category: 'Recurve', division: "Women's Individual", distance: '70m', format: 'Olympic Round' }
        ]
    },
    
    // Event 10: European Championship (Berlin, Germany)
    10: {
        57: [ // Oliver Schmidt
            { id: 1, category: 'Recurve', division: "Men's Individual", distance: '70m', format: 'Olympic Round' },
            { id: 3, category: 'Recurve', division: "Men's Team", distance: '70m', format: 'Olympic Round' }
        ],
        58: [ // Anna MÃ¼ller
            { id: 12, category: 'Compound', division: "Women's Individual", distance: '50m', format: 'Compound Round' },
            { id: 14, category: 'Compound', division: "Women's Team", distance: '50m', format: 'Compound Round' },
            { id: 15, category: 'Compound', division: "Mixed Team", distance: '50m', format: 'Compound Round' }
        ],
        59: [ // Sophie Martin
            { id: 2, category: 'Recurve', division: "Women's Individual", distance: '70m', format: 'Olympic Round' },
            { id: 4, category: 'Recurve', division: "Women's Team", distance: '70m', format: 'Olympic Round' },
            { id: 5, category: 'Recurve', division: "Mixed Team", distance: '70m', format: 'Olympic Round' }
        ],
        60: [ // Lucas Dubois
            { id: 11, category: 'Compound', division: "Men's Individual", distance: '50m', format: 'Compound Round' },
            { id: 15, category: 'Compound', division: "Mixed Team", distance: '50m', format: 'Compound Round' }
        ],
        61: [ // Marco Rossi
            { id: 1, category: 'Recurve', division: "Men's Individual", distance: '70m', format: 'Olympic Round' }
        ],
        62: [ // Giulia Ferrari
            { id: 2, category: 'Recurve', division: "Women's Individual", distance: '70m', format: 'Olympic Round' },
            { id: 27, category: 'Recurve', division: "Junior Women's Individual", distance: '70m', format: 'Olympic Round' }
        ],
        63: [ // Jan Kowalski
            { id: 11, category: 'Compound', division: "Men's Individual", distance: '50m', format: 'Compound Round' }
        ],
        64: [ // Katarzyna Nowak
            { id: 12, category: 'Compound', division: "Women's Individual", distance: '50m', format: 'Compound Round' }
        ]
    },
    
    // Event 11: World Cup Series Round 1 (Shanghai, China)
    11: {
        65: [ // David Chen
            { id: 11, category: 'Compound', division: "Men's Individual", distance: '50m', format: 'Compound Round' },
            { id: 13, category: 'Compound', division: "Men's Team", distance: '50m', format: 'Compound Round' }
        ],
        66: [ // Li Wei
            { id: 12, category: 'Compound', division: "Women's Individual", distance: '50m', format: 'Compound Round' },
            { id: 14, category: 'Compound', division: "Women's Team", distance: '50m', format: 'Compound Round' },
            { id: 15, category: 'Compound', division: "Mixed Team", distance: '50m', format: 'Compound Round' }
        ],
        67: [ // Kim Min-jun
            { id: 1, category: 'Recurve', division: "Men's Individual", distance: '70m', format: 'Olympic Round' },
            { id: 3, category: 'Recurve', division: "Men's Team", distance: '70m', format: 'Olympic Round' }
        ],
        68: [ // Park Ji-won
            { id: 2, category: 'Recurve', division: "Women's Individual", distance: '70m', format: 'Olympic Round' },
            { id: 4, category: 'Recurve', division: "Women's Team", distance: '70m', format: 'Olympic Round' },
            { id: 5, category: 'Recurve', division: "Mixed Team", distance: '70m', format: 'Olympic Round' }
        ],
        69: [ // Takeshi Yamamoto
            { id: 1, category: 'Recurve', division: "Men's Individual", distance: '70m', format: 'Olympic Round' },
            { id: 3, category: 'Recurve', division: "Men's Team", distance: '70m', format: 'Olympic Round' },
            { id: 5, category: 'Recurve', division: "Mixed Team", distance: '70m', format: 'Olympic Round' }
        ],
        70: [ // Yuki Nakamura
            { id: 2, category: 'Recurve', division: "Women's Individual", distance: '70m', format: 'Olympic Round' },
            { id: 4, category: 'Recurve', division: "Women's Team", distance: '70m', format: 'Olympic Round' }
        ]
    },
    
    // Event 12: National Team Trials (Tokyo, Japan)
    12: {
        71: [ // Takeshi Yamamoto
            { id: 1, category: 'Recurve', division: "Men's Individual", distance: '70m', format: 'Olympic Round' }
        ],
        72: [ // Yuki Nakamura
            { id: 2, category: 'Recurve', division: "Women's Individual", distance: '70m', format: 'Olympic Round' }
        ],
        73: [ // Kenji Sato
            { id: 1, category: 'Recurve', division: "Men's Individual", distance: '70m', format: 'Olympic Round' }
        ],
        74: [ // Haruka Tanaka
            { id: 2, category: 'Recurve', division: "Women's Individual", distance: '70m', format: 'Olympic Round' },
            { id: 27, category: 'Recurve', division: "Junior Women's Individual", distance: '70m', format: 'Olympic Round' }
        ],
        75: [ // Hiroshi Yamada
            { id: 11, category: 'Compound', division: "Men's Individual", distance: '50m', format: 'Compound Round' }
        ],
        76: [ // Sakura Suzuki
            { id: 12, category: 'Compound', division: "Women's Individual", distance: '50m', format: 'Compound Round' }
        ]
    }
};

/**
 * Get competitions for a specific athlete in a specific event
 * @param {number} eventId - Event ID
 * @param {number} athleteId - Athlete ID
 * @returns {Array} Array of competitions the athlete is registered for
 */
function getAthleteCompetitions(eventId, athleteId) {
    if (!athleteCompetitionsData[eventId] || !athleteCompetitionsData[eventId][athleteId]) {
        return [];
    }
    return athleteCompetitionsData[eventId][athleteId];
}

/**
 * Get all athletes competing in a specific competition
 * @param {number} eventId - Event ID
 * @param {number} competitionId - Competition ID
 * @returns {Array} Array of athlete IDs
 */
function getAthletesInCompetition(eventId, competitionId) {
    if (!athleteCompetitionsData[eventId]) {
        return [];
    }
    
    const athleteIds = [];
    for (const athleteId in athleteCompetitionsData[eventId]) {
        const competitions = athleteCompetitionsData[eventId][athleteId];
        if (competitions.some(comp => comp.id === competitionId)) {
            athleteIds.push(parseInt(athleteId));
        }
    }
    return athleteIds;
}

/**
 * Get count of competitions an athlete is registered for
 * @param {number} eventId - Event ID
 * @param {number} athleteId - Athlete ID
 * @returns {number} Count of competitions
 */
function getAthleteCompetitionCount(eventId, athleteId) {
    const competitions = getAthleteCompetitions(eventId, athleteId);
    return competitions.length;
}

// Export to window object for use in HTML prototypes
if (typeof window !== 'undefined') {
    window.athleteCompetitionsData = athleteCompetitionsData;
    window.getAthleteCompetitions = getAthleteCompetitions;
    window.getAthletesInCompetition = getAthletesInCompetition;
    window.getAthleteCompetitionCount = getAthleteCompetitionCount;
}