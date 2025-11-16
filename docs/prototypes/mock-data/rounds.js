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
    ],
    "WA (Clout International)":[
        "Clout 185m",
        "Clout 165m",
        "Clout 125m",
        "Clout 110m",
        "Clout 90m",
        "Clout 75m",
    ],
    "WA (Field International)":[
        "24 - Marked",
        "24 - Unmarked",
        "24 - Mixed",
        "12 - Marked",
        "12 - Unmarked",
        "12 - Mixed",
    ],
    "GNAS (Metric)":[
        "Metric I",
        "Metric II",
        "Metric III",
        "Metric IV",
        "Metric V",
        "Long Metric (Gentlemen)",
        "Long Metric (Ladies)",
        "Long Metric I",
        "Long Metric II",
        "Long Metric III",
        "Long Metric IV",
        "Long Metric V",
        "Short Metric I",
        "Short Metric II",
        "Short Metric III",
        "Short Metric IV",
        "Short Metric V",
        "Half Metric I",
        "Half Metric II",
        "Half Metric III",
        "Half Metric IV",
        "Half Metric V",
        "Metric 122-50",
        "Metric 122-40",
        "Metric 122-30",
        "Metric 80-40",
        "Metric 80-30",
        "3 Dozen - 90m (122cm face)",
        "3 Dozen - 70m (122cm face)",
        "3 Dozen - 60m (122cm face)",
        "3 Dozen - 50m (122cm face)",
        "3 Dozen - 40m (122cm face)",
        "3 Dozen - 30m (122cm face)",
        "3 Dozen - 20m (122cm face)",
        "3 Dozen - 50m (80cm face)",
        "3 Dozen - 40m (80cm face)",
        "3 Dozen - 30m (80cm face)",
        "3 Dozen - 20m (80cm face)",
        "3 Dozen - 15m (80cm face)",
        "3 Dozen - 10m (80cm face)"
    ],
    //"GNAS (Imperial)":[],
    //"GNAS Clout (Imperial)":[],
    //"NFAS (National Field Archery)":[],
    //"USA (Metric)":[],
    //"USA (Imperial)":[],
    //"Australia (Metric)":[],
    //"Australia Clout (Metric)":[],
    //"New Zealand (Metric)":[],
    //"New Zealand (JAMA)":[],
    //"252 Awards Scheme":[]
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