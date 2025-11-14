/**
 * Mock Rounds Data
 * World Archery (WA) International rounds and their subrounds
 */

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

// Validate if a round exists
function isValidRound(roundName) {
    return rounds.hasOwnProperty(roundName);
}

// Validate if a subround exists for a given round
function isValidSubround(roundName, subroundName) {
    const subrounds = getSubrounds(roundName);
    return subrounds.includes(subroundName);
}