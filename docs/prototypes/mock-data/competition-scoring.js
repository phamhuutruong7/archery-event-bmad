/**
 * Mock data for Competition Scoring Page
 * This file provides target assignments, athlete data, and scoring information
 * for the competition scoring interface
 */

// Mock competition scoring data by event and competition ID
const competitionScoringData = {
    // Event 1, Competition 1
    '1_1': {
        eventId: 1,
        competitionId: 1,
        eventName: 'Spring National Championship 2024',
        competitionName: 'Men\'s Individual Recurve - Qualification Round',
        category: 'Men\'s Individual',
        bowType: 'Recurve',
        status: 'open', // 'open' or 'closed'
        totalArrows: 72,
        maxScore: 720,
        targets: [
            {
                id: 1,
                number: 'Target 1',
                athletes: [
                    { 
                        id: 1, 
                        position: 'A', 
                        name: 'Alex Wong', 
                        team: 'Blue Arrows',
                        score: 680, 
                        totalArrows: 72, 
                        completed: true,
                        endsCompleted: 12,
                        totalEnds: 12
                    },
                    { 
                        id: 2, 
                        position: 'B', 
                        name: 'Brian Song', 
                        team: 'Red Dragons',
                        score: 650, 
                        totalArrows: 72, 
                        completed: true,
                        endsCompleted: 12,
                        totalEnds: 12
                    },
                    { 
                        id: 3, 
                        position: 'C', 
                        name: 'Charlie Mungo', 
                        team: 'Green Hawks',
                        score: 0, 
                        totalArrows: 0, 
                        completed: false,
                        endsCompleted: 0,
                        totalEnds: 12
                    },
                    { 
                        id: 4, 
                        position: 'D', 
                        name: 'Daniel Crap', 
                        team: 'Yellow Tigers',
                        score: 245, 
                        totalArrows: 24, 
                        completed: false,
                        endsCompleted: 4,
                        totalEnds: 12
                    }
                ]
            },
            {
                id: 2,
                number: 'Target 2',
                athletes: [
                    { 
                        id: 5, 
                        position: 'A', 
                        name: 'Emily Zhang', 
                        team: 'Blue Arrows',
                        score: 695, 
                        totalArrows: 72, 
                        completed: true,
                        endsCompleted: 12,
                        totalEnds: 12
                    },
                    { 
                        id: 6, 
                        position: 'B', 
                        name: 'Frank Miller', 
                        team: 'Silver Knights',
                        score: 670, 
                        totalArrows: 72, 
                        completed: true,
                        endsCompleted: 12,
                        totalEnds: 12
                    },
                    { 
                        id: 7, 
                        position: 'C', 
                        name: 'Grace Lee', 
                        team: 'Purple Panthers',
                        score: 655, 
                        totalArrows: 72, 
                        completed: true,
                        endsCompleted: 12,
                        totalEnds: 12
                    },
                    { 
                        id: 8, 
                        position: 'D', 
                        name: 'Henry Park', 
                        team: 'Orange Lions',
                        score: 640, 
                        totalArrows: 72, 
                        completed: true,
                        endsCompleted: 12,
                        totalEnds: 12
                    }
                ]
            },
            {
                id: 3,
                number: 'Target 3',
                athletes: [
                    { 
                        id: 9, 
                        position: 'A', 
                        name: 'Isabella Chen', 
                        team: 'Pink Phoenixes',
                        score: 685, 
                        totalArrows: 72, 
                        completed: true,
                        endsCompleted: 12,
                        totalEnds: 12
                    },
                    { 
                        id: 10, 
                        position: 'B', 
                        name: 'John Doe', 
                        team: 'Black Eagles',
                        score: 560, 
                        totalArrows: 60, 
                        completed: false,
                        endsCompleted: 10,
                        totalEnds: 12
                    },
                    { 
                        id: 11, 
                        position: 'C', 
                        name: 'Kate Wilson', 
                        team: 'White Wolves',
                        score: 720, 
                        totalArrows: 72, 
                        completed: true,
                        endsCompleted: 12,
                        totalEnds: 12
                    },
                    { 
                        id: 12, 
                        position: 'D', 
                        name: 'Leo Martinez', 
                        team: 'Brown Bears',
                        score: 590, 
                        totalArrows: 48, 
                        completed: false,
                        endsCompleted: 8,
                        totalEnds: 12
                    }
                ]
            },
            {
                id: 4,
                number: 'Target 4',
                athletes: [
                    { 
                        id: 13, 
                        position: 'A', 
                        name: 'Michael Johnson', 
                        team: 'Teal Titans',
                        score: 702, 
                        totalArrows: 72, 
                        completed: true,
                        endsCompleted: 12,
                        totalEnds: 12
                    },
                    { 
                        id: 14, 
                        position: 'B', 
                        name: 'Nancy Kim', 
                        team: 'Maroon Mustangs',
                        score: 688, 
                        totalArrows: 72, 
                        completed: true,
                        endsCompleted: 12,
                        totalEnds: 12
                    },
                    { 
                        id: 15, 
                        position: 'C', 
                        name: 'Oliver Brown', 
                        team: 'Navy Ninjas',
                        score: 665, 
                        totalArrows: 72, 
                        completed: true,
                        endsCompleted: 12,
                        totalEnds: 12
                    },
                    { 
                        id: 16, 
                        position: 'D', 
                        name: 'Patricia Davis', 
                        team: 'Crimson Cobras',
                        score: 642, 
                        totalArrows: 72, 
                        completed: true,
                        endsCompleted: 12,
                        totalEnds: 12
                    }
                ]
            }
        ]
    },
    // Event 1, Competition 2
    '1_2': {
        eventId: 1,
        competitionId: 2,
        eventName: 'Spring National Championship 2024',
        competitionName: 'Women\'s Individual Recurve - Qualification Round',
        category: 'Women\'s Individual',
        bowType: 'Recurve',
        status: 'open',
        totalArrows: 72,
        maxScore: 720,
        targets: [
            {
                id: 5,
                number: 'Target 5',
                athletes: [
                    { 
                        id: 17, 
                        position: 'A', 
                        name: 'Sarah Johnson', 
                        team: 'Sky Shooters',
                        score: 695, 
                        totalArrows: 72, 
                        completed: true,
                        endsCompleted: 12,
                        totalEnds: 12
                    },
                    { 
                        id: 18, 
                        position: 'B', 
                        name: 'Tina Lee', 
                        team: 'Fire Arrows',
                        score: 678, 
                        totalArrows: 72, 
                        completed: true,
                        endsCompleted: 12,
                        totalEnds: 12
                    },
                    { 
                        id: 19, 
                        position: 'C', 
                        name: 'Uma Patel', 
                        team: 'Storm Hawks',
                        score: 660, 
                        totalArrows: 72, 
                        completed: true,
                        endsCompleted: 12,
                        totalEnds: 12
                    },
                    { 
                        id: 20, 
                        position: 'D', 
                        name: 'Vera Chang', 
                        team: 'Thunder Bolts',
                        score: 645, 
                        totalArrows: 72, 
                        completed: true,
                        endsCompleted: 12,
                        totalEnds: 12
                    }
                ]
            },
            {
                id: 6,
                number: 'Target 6',
                athletes: [
                    { 
                        id: 21, 
                        position: 'A', 
                        name: 'Wendy Martinez', 
                        team: 'Lightning Strikers',
                        score: 710, 
                        totalArrows: 72, 
                        completed: true,
                        endsCompleted: 12,
                        totalEnds: 12
                    },
                    { 
                        id: 22, 
                        position: 'B', 
                        name: 'Xena Wu', 
                        team: 'Wind Warriors',
                        score: 692, 
                        totalArrows: 72, 
                        completed: true,
                        endsCompleted: 12,
                        totalEnds: 12
                    },
                    { 
                        id: 23, 
                        position: 'C', 
                        name: 'Yvonne Park', 
                        team: 'Ice Archers',
                        score: 675, 
                        totalArrows: 72, 
                        completed: true,
                        endsCompleted: 12,
                        totalEnds: 12
                    },
                    { 
                        id: 24, 
                        position: 'D', 
                        name: 'Zoe Kim', 
                        team: 'Star Shooters',
                        score: 658, 
                        totalArrows: 72, 
                        completed: true,
                        endsCompleted: 12,
                        totalEnds: 12
                    }
                ]
            }
        ]
    },
    // Event 4, Competition 1
    '4_1': {
        eventId: 4,
        competitionId: 1,
        eventName: 'Spring Open Championship',
        competitionName: 'Men\'s Individual Recurve - Half WA 90m',
        category: 'Men\'s Individual',
        bowType: 'Recurve',
        status: 'open',
        totalArrows: 72,
        maxScore: 720,
        targets: [
            {
                id: 7,
                number: 'Target 1',
                athletes: [
                    { 
                        id: 25, 
                        position: 'A', 
                        name: 'David Chen', 
                        team: 'Phoenix Archers',
                        score: 672, 
                        totalArrows: 72, 
                        completed: true,
                        endsCompleted: 12,
                        totalEnds: 12
                    },
                    { 
                        id: 26, 
                        position: 'B', 
                        name: 'Marcus Williams', 
                        team: 'Outback Bowmen',
                        score: 658, 
                        totalArrows: 72, 
                        completed: true,
                        endsCompleted: 12,
                        totalEnds: 12
                    },
                    { 
                        id: 27, 
                        position: 'C', 
                        name: 'James Taylor', 
                        team: 'Sydney Arrows',
                        score: 645, 
                        totalArrows: 66, 
                        completed: false,
                        endsCompleted: 11,
                        totalEnds: 12
                    },
                    { 
                        id: 28, 
                        position: 'D', 
                        name: 'Robert Anderson', 
                        team: 'Melbourne Shooters',
                        score: 630, 
                        totalArrows: 72, 
                        completed: true,
                        endsCompleted: 12,
                        totalEnds: 12
                    }
                ]
            },
            {
                id: 8,
                number: 'Target 2',
                athletes: [
                    { 
                        id: 29, 
                        position: 'A', 
                        name: 'Thomas Brown', 
                        team: 'Brisbane Bulls',
                        score: 690, 
                        totalArrows: 72, 
                        completed: true,
                        endsCompleted: 12,
                        totalEnds: 12
                    },
                    { 
                        id: 30, 
                        position: 'B', 
                        name: 'Andrew Wilson', 
                        team: 'Perth Hawks',
                        score: 675, 
                        totalArrows: 72, 
                        completed: true,
                        endsCompleted: 12,
                        totalEnds: 12
                    },
                    { 
                        id: 31, 
                        position: 'C', 
                        name: 'Christopher Lee', 
                        team: 'Adelaide Eagles',
                        score: 662, 
                        totalArrows: 72, 
                        completed: true,
                        endsCompleted: 12,
                        totalEnds: 12
                    },
                    { 
                        id: 32, 
                        position: 'D', 
                        name: 'Daniel Smith', 
                        team: 'Canberra Arrows',
                        score: 648, 
                        totalArrows: 72, 
                        completed: true,
                        endsCompleted: 12,
                        totalEnds: 12
                    }
                ]
            }
        ]
    },
    // Event 4, Competition 2
    '4_2': {
        eventId: 4,
        competitionId: 2,
        eventName: 'Spring Open Championship',
        competitionName: 'Women\'s Individual Recurve - Half WA 70m',
        category: 'Women\'s Individual',
        bowType: 'Recurve',
        status: 'open',
        totalArrows: 72,
        maxScore: 720,
        targets: [
            {
                id: 9,
                number: 'Target 1',
                athletes: [
                    { 
                        id: 33, 
                        position: 'A', 
                        name: 'Emma Johnson', 
                        team: 'Sydney Stars',
                        score: 685, 
                        totalArrows: 72, 
                        completed: true,
                        endsCompleted: 12,
                        totalEnds: 12
                    },
                    { 
                        id: 34, 
                        position: 'B', 
                        name: 'Olivia Brown', 
                        team: 'Melbourne Maidens',
                        score: 670, 
                        totalArrows: 72, 
                        completed: true,
                        endsCompleted: 12,
                        totalEnds: 12
                    },
                    { 
                        id: 35, 
                        position: 'C', 
                        name: 'Sophia Wilson', 
                        team: 'Brisbane Belles',
                        score: 655, 
                        totalArrows: 60, 
                        completed: false,
                        endsCompleted: 10,
                        totalEnds: 12
                    },
                    { 
                        id: 36, 
                        position: 'D', 
                        name: 'Isabella Taylor', 
                        team: 'Perth Panthers',
                        score: 640, 
                        totalArrows: 72, 
                        completed: true,
                        endsCompleted: 12,
                        totalEnds: 12
                    }
                ]
            }
        ]
    },
    // Event 4, Competition 3
    '4_3': {
        eventId: 4,
        competitionId: 3,
        eventName: 'Spring Open Championship',
        competitionName: 'Men\'s Team Recurve - WA 60m',
        category: 'Men\'s Team',
        bowType: 'Recurve',
        status: 'open',
        totalArrows: 72,
        maxScore: 720,
        targets: [
            {
                id: 10,
                number: 'Target 1',
                athletes: [
                    { 
                        id: 37, 
                        position: 'A', 
                        name: 'Lucas Martinez', 
                        team: 'Gold Coast Warriors',
                        score: 695, 
                        totalArrows: 72, 
                        completed: true,
                        endsCompleted: 12,
                        totalEnds: 12
                    },
                    { 
                        id: 38, 
                        position: 'B', 
                        name: 'Ryan Garcia', 
                        team: 'Gold Coast Warriors',
                        score: 688, 
                        totalArrows: 72, 
                        completed: true,
                        endsCompleted: 12,
                        totalEnds: 12
                    },
                    { 
                        id: 39, 
                        position: 'C', 
                        name: 'Ethan Rodriguez', 
                        team: 'Gold Coast Warriors',
                        score: 675, 
                        totalArrows: 72, 
                        completed: true,
                        endsCompleted: 12,
                        totalEnds: 12
                    },
                    { 
                        id: 40, 
                        position: 'D', 
                        name: 'Nathan Davis', 
                        team: 'Hobart Hawks',
                        score: 660, 
                        totalArrows: 72, 
                        completed: true,
                        endsCompleted: 12,
                        totalEnds: 12
                    }
                ]
            }
        ]
    },
    // Event 4, Competition 4
    '4_4': {
        eventId: 4,
        competitionId: 4,
        eventName: 'Spring Open Championship',
        competitionName: 'Men\'s Individual Barebow - WA 50m',
        category: 'Men\'s Individual',
        bowType: 'Barebow',
        status: 'open',
        totalArrows: 72,
        maxScore: 720,
        targets: [
            {
                id: 11,
                number: 'Target 1',
                athletes: [
                    { 
                        id: 41, 
                        position: 'A', 
                        name: 'Benjamin Clark', 
                        team: 'Darwin Archers',
                        score: 620, 
                        totalArrows: 72, 
                        completed: true,
                        endsCompleted: 12,
                        totalEnds: 12
                    },
                    { 
                        id: 42, 
                        position: 'B', 
                        name: 'Samuel White', 
                        team: 'Townsville Targets',
                        score: 605, 
                        totalArrows: 72, 
                        completed: true,
                        endsCompleted: 12,
                        totalEnds: 12
                    },
                    { 
                        id: 43, 
                        position: 'C', 
                        name: 'Matthew Harris', 
                        team: 'Cairns Crew',
                        score: 590, 
                        totalArrows: 54, 
                        completed: false,
                        endsCompleted: 9,
                        totalEnds: 12
                    },
                    { 
                        id: 44, 
                        position: 'D', 
                        name: 'Joseph Martin', 
                        team: 'Newcastle Nomads',
                        score: 575, 
                        totalArrows: 72, 
                        completed: true,
                        endsCompleted: 12,
                        totalEnds: 12
                    }
                ]
            }
        ]
    },
    // Event 4, Competition 5
    '4_5': {
        eventId: 4,
        competitionId: 5,
        eventName: 'Spring Open Championship',
        competitionName: 'Women\'s Individual Barebow - WA 50m',
        category: 'Women\'s Individual',
        bowType: 'Barebow',
        status: 'open',
        totalArrows: 72,
        maxScore: 720,
        targets: [
            {
                id: 12,
                number: 'Target 1',
                athletes: [
                    { 
                        id: 45, 
                        position: 'A', 
                        name: 'Charlotte Thompson', 
                        team: 'Wollongong Warriors',
                        score: 615, 
                        totalArrows: 72, 
                        completed: true,
                        endsCompleted: 12,
                        totalEnds: 12
                    },
                    { 
                        id: 46, 
                        position: 'B', 
                        name: 'Amelia Martinez', 
                        team: 'Geelong Gems',
                        score: 600, 
                        totalArrows: 72, 
                        completed: true,
                        endsCompleted: 12,
                        totalEnds: 12
                    },
                    { 
                        id: 47, 
                        position: 'C', 
                        name: 'Harper Anderson', 
                        team: 'Ballarat Bows',
                        score: 585, 
                        totalArrows: 72, 
                        completed: true,
                        endsCompleted: 12,
                        totalEnds: 12
                    },
                    { 
                        id: 48, 
                        position: 'D', 
                        name: 'Evelyn Thomas', 
                        team: 'Launceston Ladies',
                        score: 570, 
                        totalArrows: 48, 
                        completed: false,
                        endsCompleted: 8,
                        totalEnds: 12
                    }
                ]
            }
        ]
    }
};

/**
 * Get competition scoring data by event and competition ID
 * @param {number} eventId - Event ID
 * @param {number} competitionId - Competition ID
 * @returns {Object|null} Competition scoring data or null if not found
 */
function getCompetitionScoringData(eventId, competitionId) {
    const key = `${eventId}_${competitionId}`;
    return competitionScoringData[key] || null;
}

/**
 * Get all targets for a competition
 * @param {number} eventId - Event ID
 * @param {number} competitionId - Competition ID
 * @returns {Array} Array of targets with athletes
 */
function getCompetitionTargets(eventId, competitionId) {
    const data = getCompetitionScoringData(eventId, competitionId);
    return data ? data.targets : [];
}

/**
 * Get specific target data
 * @param {number} eventId - Event ID
 * @param {number} competitionId - Competition ID
 * @param {number} targetId - Target ID
 * @returns {Object|null} Target data or null if not found
 */
function getTargetData(eventId, competitionId, targetId) {
    const targets = getCompetitionTargets(eventId, competitionId);
    return targets.find(t => t.id === targetId) || null;
}

/**
 * Get athlete data from a specific target
 * @param {number} eventId - Event ID
 * @param {number} competitionId - Competition ID
 * @param {number} targetId - Target ID
 * @param {number} athleteId - Athlete ID
 * @returns {Object|null} Athlete data or null if not found
 */
function getAthleteFromTarget(eventId, competitionId, targetId, athleteId) {
    const target = getTargetData(eventId, competitionId, targetId);
    if (!target) return null;
    return target.athletes.find(a => a.id === athleteId) || null;
}

/**
 * Get leaderboard for a competition (sorted by score)
 * @param {number} eventId - Event ID
 * @param {number} competitionId - Competition ID
 * @param {string} filter - Filter: 'all', 'completed', 'in-progress'
 * @returns {Array} Sorted array of athletes with rank
 */
function getCompetitionLeaderboard(eventId, competitionId, filter = 'all') {
    const targets = getCompetitionTargets(eventId, competitionId);
    
    // Flatten all athletes from all targets
    let allAthletes = targets.flatMap(target => 
        target.athletes.map(athlete => ({
            ...athlete,
            targetId: target.id,
            targetNumber: target.number
        }))
    );
    
    // Apply filter
    if (filter === 'completed') {
        allAthletes = allAthletes.filter(a => a.completed);
    } else if (filter === 'in-progress') {
        allAthletes = allAthletes.filter(a => !a.completed && a.totalArrows > 0);
    }
    
    // Sort by score (descending)
    allAthletes.sort((a, b) => b.score - a.score);
    
    // Add rank
    return allAthletes.map((athlete, index) => ({
        ...athlete,
        rank: index + 1
    }));
}

/**
 * Get competition status
 * @param {number} eventId - Event ID
 * @param {number} competitionId - Competition ID
 * @returns {string} Status: 'open' or 'closed'
 */
function getCompetitionStatus(eventId, competitionId) {
    const data = getCompetitionScoringData(eventId, competitionId);
    return data ? data.status : 'closed';
}

/**
 * Get participant count for a competition
 * @param {number} eventId - Event ID
 * @param {number} competitionId - Competition ID
 * @returns {number} Total number of athletes
 */
function getParticipantCount(eventId, competitionId) {
    const targets = getCompetitionTargets(eventId, competitionId);
    return targets.reduce((total, target) => total + target.athletes.length, 0);
}
