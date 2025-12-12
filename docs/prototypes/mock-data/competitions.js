/**
 * Mock Competitions Data
 * Based on World Archery Federation standard competition formats
 * 
 * World Archery recognizes several bow types and competition formats:
 * - Recurve (Olympic style)
 * - Compound
 * - Barebow
 * - Traditional
 * 
 * Competition categories:
 * - Individual (Men, Women)
 * - Team (Men, Women, Mixed)
 * - Various distances (18m, 25m, 30m, 50m, 60m, 70m, 90m)
 */

const standardCompetitions = [
    // Olympic Recurve - Standard distances
    { id: 1, category: 'Recurve', division: "Men's Individual", distance: '70m', format: 'Olympic Round', maxArrows: 72, target: '122cm 10-ring' },
    { id: 2, category: 'Recurve', division: "Women's Individual", distance: '70m', format: 'Olympic Round', maxArrows: 72, target: '122cm 10-ring' },
    { id: 3, category: 'Recurve', division: "Men's Team", distance: '70m', format: 'Olympic Round', maxArrows: 72, target: '122cm 10-ring' },
    { id: 4, category: 'Recurve', division: "Women's Team", distance: '70m', format: 'Olympic Round', maxArrows: 72, target: '122cm 10-ring' },
    { id: 5, category: 'Recurve', division: "Mixed Team", distance: '70m', format: 'Olympic Round', maxArrows: 72, target: '122cm 10-ring' },
    
    // Indoor Recurve
    { id: 6, category: 'Recurve', division: "Men's Individual", distance: '18m', format: 'Indoor', maxArrows: 60, target: '40cm 10-ring' },
    { id: 7, category: 'Recurve', division: "Women's Individual", distance: '18m', format: 'Indoor', maxArrows: 60, target: '40cm 10-ring' },
    { id: 8, category: 'Recurve', division: "Men's Team", distance: '18m', format: 'Indoor', maxArrows: 60, target: '40cm 10-ring' },
    { id: 9, category: 'Recurve', division: "Women's Team", distance: '18m', format: 'Indoor', maxArrows: 60, target: '40cm 10-ring' },
    { id: 10, category: 'Recurve', division: "Mixed Team", distance: '18m', format: 'Indoor', maxArrows: 60, target: '40cm 10-ring' },
    
    // Compound - Standard distances
    { id: 11, category: 'Compound', division: "Men's Individual", distance: '50m', format: 'Compound Round', maxArrows: 72, target: '80cm 10-ring' },
    { id: 12, category: 'Compound', division: "Women's Individual", distance: '50m', format: 'Compound Round', maxArrows: 72, target: '80cm 10-ring' },
    { id: 13, category: 'Compound', division: "Men's Team", distance: '50m', format: 'Compound Round', maxArrows: 72, target: '80cm 10-ring' },
    { id: 14, category: 'Compound', division: "Women's Team", distance: '50m', format: 'Compound Round', maxArrows: 72, target: '80cm 10-ring' },
    { id: 15, category: 'Compound', division: "Mixed Team", distance: '50m', format: 'Compound Round', maxArrows: 72, target: '80cm 10-ring' },
    
    // Indoor Compound
    { id: 16, category: 'Compound', division: "Men's Individual", distance: '18m', format: 'Indoor', maxArrows: 60, target: '40cm 10-ring' },
    { id: 17, category: 'Compound', division: "Women's Individual", distance: '18m', format: 'Indoor', maxArrows: 60, target: '40cm 10-ring' },
    { id: 18, category: 'Compound', division: "Men's Team", distance: '18m', format: 'Indoor', maxArrows: 60, target: '40cm 10-ring' },
    { id: 19, category: 'Compound', division: "Women's Team", distance: '18m', format: 'Indoor', maxArrows: 60, target: '40cm 10-ring' },
    { id: 20, category: 'Compound', division: "Mixed Team", distance: '18m', format: 'Indoor', maxArrows: 60, target: '40cm 10-ring' },
    
    // Barebow - 50m
    { id: 21, category: 'Barebow', division: "Men's Individual", distance: '50m', format: 'Barebow Round', maxArrows: 72, target: '122cm 10-ring' },
    { id: 22, category: 'Barebow', division: "Women's Individual", distance: '50m', format: 'Barebow Round', maxArrows: 72, target: '122cm 10-ring' },
    { id: 23, category: 'Barebow', division: "Men's Team", distance: '50m', format: 'Barebow Round', maxArrows: 72, target: '122cm 10-ring' },
    { id: 24, category: 'Barebow', division: "Women's Team", distance: '50m', format: 'Barebow Round', maxArrows: 72, target: '122cm 10-ring' },
    { id: 25, category: 'Barebow', division: "Mixed Team", distance: '50m', format: 'Barebow Round', maxArrows: 72, target: '122cm 10-ring' },
    
    // Barebow - 30m
    { id: 48, category: 'Barebow', division: "Men's Individual", distance: '30m', format: 'Barebow Round', maxArrows: 72, target: '80cm 10-ring' },
    { id: 49, category: 'Barebow', division: "Women's Individual", distance: '30m', format: 'Barebow Round', maxArrows: 72, target: '80cm 10-ring' },
    { id: 50, category: 'Barebow', division: "Men's Team", distance: '30m', format: 'Barebow Round', maxArrows: 72, target: '80cm 10-ring' },
    { id: 51, category: 'Barebow', division: "Women's Team", distance: '30m', format: 'Barebow Round', maxArrows: 72, target: '80cm 10-ring' },
    { id: 52, category: 'Barebow', division: "Mixed Team", distance: '30m', format: 'Barebow Round', maxArrows: 72, target: '80cm 10-ring' },
    
    // Barebow - 18m Indoor
    { id: 53, category: 'Barebow', division: "Men's Individual", distance: '18m', format: 'Indoor', maxArrows: 60, target: '40cm 10-ring' },
    { id: 54, category: 'Barebow', division: "Women's Individual", distance: '18m', format: 'Indoor', maxArrows: 60, target: '40cm 10-ring' },
    { id: 55, category: 'Barebow', division: "Men's Team", distance: '18m', format: 'Indoor', maxArrows: 60, target: '40cm 10-ring' },
    { id: 56, category: 'Barebow', division: "Women's Team", distance: '18m', format: 'Indoor', maxArrows: 60, target: '40cm 10-ring' },
    { id: 57, category: 'Barebow', division: "Mixed Team", distance: '18m', format: 'Indoor', maxArrows: 60, target: '40cm 10-ring' },
    
    // Youth Categories - Recurve
    { id: 26, category: 'Recurve', division: "Junior Men's Individual", distance: '70m', format: 'Olympic Round', maxArrows: 72, target: '122cm 10-ring' },
    { id: 27, category: 'Recurve', division: "Junior Women's Individual", distance: '70m', format: 'Olympic Round', maxArrows: 72, target: '122cm 10-ring' },
    { id: 28, category: 'Recurve', division: "Cadet Men's Individual", distance: '60m', format: 'Olympic Round', maxArrows: 72, target: '122cm 10-ring' },
    { id: 29, category: 'Recurve', division: "Cadet Women's Individual", distance: '60m', format: 'Olympic Round', maxArrows: 72, target: '122cm 10-ring' },
    
    // Youth Categories - Compound
    { id: 30, category: 'Compound', division: "Junior Men's Individual", distance: '50m', format: 'Compound Round', maxArrows: 72, target: '80cm 10-ring' },
    { id: 31, category: 'Compound', division: "Junior Women's Individual", distance: '50m', format: 'Compound Round', maxArrows: 72, target: '80cm 10-ring' },
    { id: 32, category: 'Compound', division: "Cadet Men's Individual", distance: '50m', format: 'Compound Round', maxArrows: 72, target: '80cm 10-ring' },
    { id: 33, category: 'Compound', division: "Cadet Women's Individual", distance: '50m', format: 'Compound Round', maxArrows: 72, target: '80cm 10-ring' },
    
    // Additional distances - Recurve
    { id: 34, category: 'Recurve', division: "Men's Individual", distance: '60m', format: 'Qualification Round', maxArrows: 36, target: '122cm 10-ring' },
    { id: 35, category: 'Recurve', division: "Women's Individual", distance: '60m', format: 'Qualification Round', maxArrows: 36, target: '122cm 10-ring' },
    { id: 36, category: 'Recurve', division: "Men's Individual", distance: '50m', format: 'Qualification Round', maxArrows: 36, target: '122cm 10-ring' },
    { id: 37, category: 'Recurve', division: "Women's Individual", distance: '50m', format: 'Qualification Round', maxArrows: 36, target: '122cm 10-ring' },
    { id: 38, category: 'Recurve', division: "Men's Individual", distance: '30m', format: 'Qualification Round', maxArrows: 36, target: '80cm 10-ring' },
    { id: 39, category: 'Recurve', division: "Women's Individual", distance: '30m', format: 'Qualification Round', maxArrows: 36, target: '80cm 10-ring' },
    
    // Additional distances - Compound
    { id: 40, category: 'Compound', division: "Men's Individual", distance: '60m', format: 'Qualification Round', maxArrows: 36, target: '80cm 10-ring' },
    { id: 41, category: 'Compound', division: "Women's Individual", distance: '60m', format: 'Qualification Round', maxArrows: 36, target: '80cm 10-ring' },
    { id: 42, category: 'Compound', division: "Men's Individual", distance: '30m', format: 'Qualification Round', maxArrows: 36, target: '80cm 10-ring' },
    { id: 43, category: 'Compound', division: "Women's Individual", distance: '30m', format: 'Qualification Round', maxArrows: 36, target: '80cm 10-ring' },
    
    // 25m Indoor (Alternative)
    { id: 44, category: 'Recurve', division: "Men's Individual", distance: '25m', format: 'Indoor', maxArrows: 60, target: '60cm 10-ring' },
    { id: 45, category: 'Recurve', division: "Women's Individual", distance: '25m', format: 'Indoor', maxArrows: 60, target: '60cm 10-ring' },
    { id: 46, category: 'Compound', division: "Men's Individual", distance: '25m', format: 'Indoor', maxArrows: 60, target: '60cm 10-ring' },
    { id: 47, category: 'Compound', division: "Women's Individual", distance: '25m', format: 'Indoor', maxArrows: 60, target: '60cm 10-ring' }
];

/**
 * Get all standard competitions
 * @returns {Array} Array of all competitions
 */
function getAllCompetitions() {
    return [...standardCompetitions];
}

/**
 * Search competitions by keyword
 * @param {string} keyword - Search term
 * @returns {Array} Filtered competitions
 */
function searchCompetitions(keyword) {
    if (!keyword || keyword.trim() === '') {
        return getAllCompetitions();
    }
    
    const term = keyword.toLowerCase().trim();
    return standardCompetitions.filter(comp => 
        comp.category.toLowerCase().includes(term) ||
        comp.division.toLowerCase().includes(term) ||
        comp.distance.toLowerCase().includes(term) ||
        comp.format.toLowerCase().includes(term)
    );
}

/**
 * Get competitions by category
 * @param {string} category - Category (Recurve, Compound, Barebow)
 * @returns {Array} Filtered competitions
 */
function getCompetitionsByCategory(category) {
    return standardCompetitions.filter(comp => comp.category === category);
}

/**
 * Get competitions by distance
 * @param {string} distance - Distance (e.g., '70m', '50m', '18m')
 * @returns {Array} Filtered competitions
 */
function getCompetitionsByDistance(distance) {
    return standardCompetitions.filter(comp => comp.distance === distance);
}

/**
 * Format competition display name
 * @param {Object} competition - Competition object
 * @returns {string} Formatted name
 */
function formatCompetitionName(competition) {
    return `${competition.category} - ${competition.division} - ${competition.distance}`;
}

// Export to window object for use in HTML prototypes
if (typeof window !== 'undefined') {
    window.standardCompetitions = standardCompetitions;
    window.getAllCompetitions = getAllCompetitions;
    window.searchCompetitions = searchCompetitions;
    window.getCompetitionsByCategory = getCompetitionsByCategory;
    window.getCompetitionsByDistance = getCompetitionsByDistance;
    window.formatCompetitionName = formatCompetitionName;
}
