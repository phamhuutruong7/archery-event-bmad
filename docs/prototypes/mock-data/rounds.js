/**
 * Mock Rounds Data
 * World Archery (WA) International rounds and their subrounds with detailed specifications
 */

// Detailed subround specifications
const subroundDetails = {
    "WA 1440 (90m)": [
        { distance: "90m", targetSize: "122cm", ends: 6, target: "Metric 10 Zone", arrows: 36 },
        { distance: "70m", targetSize: "122cm", ends: 6, target: "Metric 10 Zone", arrows: 36 },
        { distance: "50m", targetSize: "80cm", ends: 6, target: "Metric 10 Zone", arrows: 36 },
        { distance: "30m", targetSize: "80cm", ends: 6, target: "Metric 10 Zone", arrows: 36 }
    ],
    "WA 1440 (70m)": [
        { distance: "70m", targetSize: "122cm", ends: 6, target: "Metric 10 Zone", arrows: 36 },
        { distance: "60m", targetSize: "122cm", ends: 6, target: "Metric 10 Zone", arrows: 36 },
        { distance: "50m", targetSize: "80cm", ends: 6, target: "Metric 10 Zone", arrows: 36 },
        { distance: "30m", targetSize: "80cm", ends: 6, target: "Metric 10 Zone", arrows: 36 }
    ],
    "WA 1440 (Cadet Ladies)": [
        { distance: "60m", targetSize: "122cm", ends: 6, target: "Metric 10 Zone", arrows: 36 },
        { distance: "50m", targetSize: "122cm", ends: 6, target: "Metric 10 Zone", arrows: 36 },
        { distance: "40m", targetSize: "80cm", ends: 6, target: "Metric 10 Zone", arrows: 36 },
        { distance: "30m", targetSize: "80cm", ends: 6, target: "Metric 10 Zone", arrows: 36 }
    ],
    "Half WA (90m)": [
        { distance: "90m", targetSize: "122cm", ends: 3, target: "Metric 10 Zone", arrows: 18 },
        { distance: "70m", targetSize: "122cm", ends: 3, target: "Metric 10 Zone", arrows: 18 },
        { distance: "50m", targetSize: "80cm", ends: 3, target: "Metric 10 Zone", arrows: 18 },
        { distance: "30m", targetSize: "80cm", ends: 3, target: "Metric 10 Zone", arrows: 18 }
    ],
    "Half WA (70m)": [
        { distance: "70m", targetSize: "122cm", ends: 3, target: "Metric 10 Zone", arrows: 18 },
        { distance: "60m", targetSize: "122cm", ends: 3, target: "Metric 10 Zone", arrows: 18 },
        { distance: "50m", targetSize: "80cm", ends: 3, target: "Metric 10 Zone", arrows: 18 },
        { distance: "30m", targetSize: "80cm", ends: 3, target: "Metric 10 Zone", arrows: 18 }
    ],
    "Half WA (Cadet Ladies)": [
        { distance: "60m", targetSize: "122cm", ends: 3, target: "Metric 10 Zone", arrows: 18 },
        { distance: "50m", targetSize: "122cm", ends: 3, target: "Metric 10 Zone", arrows: 18 },
        { distance: "40m", targetSize: "80cm", ends: 3, target: "Metric 10 Zone", arrows: 18 },
        { distance: "30m", targetSize: "80cm", ends: 3, target: "Metric 10 Zone", arrows: 18 }
    ],
    "WA 900": [
        { distance: "60m", targetSize: "122cm", ends: 5, target: "Metric 10 Zone", arrows: 30 },
        { distance: "50m", targetSize: "122cm", ends: 5, target: "Metric 10 Zone", arrows: 30 },
        { distance: "40m", targetSize: "122cm", ends: 5, target: "Metric 10 Zone", arrows: 30 }
    ],
    "WA 70m": [
        { distance: "70m", targetSize: "122cm", ends: 12, target: "Metric 10 Zone", arrows: 72 }
    ],
    "WA 60m": [
        { distance: "60m", targetSize: "122cm", ends: 12, target: "Metric 10 Zone", arrows: 72 }
    ],
    "WA 50m": [
        { distance: "50m", targetSize: "80cm", ends: 12, target: "Metric 10 Zone", arrows: 72 }
    ],
    "WA 50m (6 Ring Face)": [
        { distance: "50m", targetSize: "80cm", ends: 12, target: "Compound 6 Zone", arrows: 72 }
    ],
    "WA Standard": [
        { distance: "50m", targetSize: "122cm", ends: 6, target: "Metric 10 Zone", arrows: 36 },
        { distance: "30m", targetSize: "122cm", ends: 6, target: "Metric 10 Zone", arrows: 36 }
    ],
    "Frostbite": [
        { distance: "30m", targetSize: "80cm", ends: 6, target: "Metric 10 Zone", arrows: 36 }
    ],
    "WA 50m (10 Zone-Barebow)": [
        { distance: "50m", targetSize: "122cm", ends: 12, target: "Metric 10 Zone", arrows: 72 }
    ],
    "WA VI Outdoor (1440)": [
        { distance: "30m", targetSize: "60cm", ends: 6, target: "Metric 10 Zone", arrows: 36 },
        { distance: "30m", targetSize: "80cm", ends: 6, target: "Metric 10 Zone", arrows: 36 },
        { distance: "30m", targetSize: "80cm", ends: 6, target: "Metric 10 Zone", arrows: 36 },
        { distance: "30m", targetSize: "122cm", ends: 6, target: "Metric 10 Zone", arrows: 36 }
    ],
    "WA 30m (VI)": [
        { distance: "30m", targetSize: "80cm", ends: 12, target: "Metric 10 Zone", arrows: 72 }
    ]
};

const rounds = {
    "WA (International)": [
        "WA 1440 (90m)",
        "WA 1440 (70m)",
        "WA 1440 (Cadet Ladies)",
        "Half WA (90m)",
        "Half WA (70m)",
        "Half WA (Cadet Ladies)",
        "WA 900",
        "WA 70m",
        "WA 60m",
        "WA 50m",
        "WA 50m (6 Ring Face)",
        "WA Standard",
        "Frostbite",
        "WA 50m (10 Zone-Barebow)",
        "WA VI Outdoor (1440)",
        "WA 30m (VI)"
    ]
    // More rounds can be added here in the future
};

// Get all available rounds
function getAllRounds() {
    return Object.keys(rounds);
}

// Get subrounds for a specific round
function getSubrounds(roundName) {
    return rounds[roundName] || [];
}

// Get detailed specifications for a subround
function getSubroundDetails(subroundName) {
    return subroundDetails[subroundName] || [];
}

// Get summary of a subround (total arrows and distances)
function getSubroundSummary(subroundName) {
    const details = getSubroundDetails(subroundName);
    if (!details || details.length === 0) return null;
    
    const totalArrows = details.reduce((sum, phase) => sum + phase.arrows, 0);
    const distances = details.map(phase => phase.distance).join(", ");
    
    return {
        totalArrows,
        distances,
        phases: details.length
    };
}

// Validate if a round exists
function isValidRound(roundName) {
    return rounds.hasOwnProperty(roundName);
}

// Validate if a subround exists for a given round
function isValidSubround(roundName, subroundName) {
    const subrounds = getSubrounds(roundName);
    return subrounds.includes(subroundName);
}