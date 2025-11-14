/**
 * Mock Event Details Data
 * Complete event information including competitions, description, and registration details
 */

const eventDetails = [
    {
        id: 1,
        title: "2024 National Championship",
        description: "The premier national archery championship featuring top archers from across the country. This prestigious event will showcase Olympic-style competitions with recurve and compound divisions. Athletes will compete in qualification rounds followed by elimination matches leading to the finals.",
        location: "Tokyo, Japan",
        startDate: "2024-12-15",
        endDate: "2024-12-17",
        dateDisplay: "Dec 15-17, 2024",
        registrationDeadline: "2024-12-08",
        maxParticipants: 200,
        currentParticipants: 156,
        status: "upcoming",
        competitions: [
            { id: 1, bowType: 'Recurve', category: "Men's Individual", round: 'WA (International)', subround: 'WA 1440 (90m)' },
            { id: 2, bowType: 'Recurve', category: "Women's Individual", round: 'WA (International)', subround: 'WA 1440 (70m)' },
            { id: 3, bowType: 'Recurve', category: "Men's Team", round: 'WA (International)', subround: 'WA 70m' },
            { id: 4, bowType: 'Recurve', category: "Women's Team", round: 'WA (International)', subround: 'WA 70m' },
            { id: 5, bowType: 'Compound', category: "Men's Individual", round: 'WA (International)', subround: 'WA 50m' },
            { id: 6, bowType: 'Compound', category: "Women's Individual", round: 'WA (International)', subround: 'WA 50m' }
        ],
        organizer: {
            name: "Japan Archery Federation",
            email: "info@archery-japan.jp",
            phone: "+81-3-1234-5678"
        }
    },
    {
        id: 2,
        title: "Regional Qualifier 2024",
        description: "Regional qualification event for the upcoming Asian Games. Top performers will earn their spots to represent their countries in the international competition. Multiple categories including individual and team events for both recurve and compound divisions.",
        location: "Seoul, Korea",
        startDate: "2024-12-01",
        endDate: "2024-12-03",
        dateDisplay: "Dec 1-3, 2024",
        registrationDeadline: "2024-11-24",
        maxParticipants: 150,
        currentParticipants: 142,
        status: "live",
        competitions: [
            { id: 1, bowType: 'Recurve', category: "Men's Individual", round: 'WA (International)', subround: 'WA 1440 (90m)' },
            { id: 2, bowType: 'Recurve', category: "Women's Individual", round: 'WA (International)', subround: 'WA 1440 (70m)' },
            { id: 3, bowType: 'Recurve', category: "Mixed Team", round: 'WA (International)', subround: 'WA 70m' },
            { id: 4, bowType: 'Compound', category: "Men's Individual", round: 'WA (International)', subround: 'WA 50m' },
            { id: 5, bowType: 'Compound', category: "Women's Individual", round: 'WA (International)', subround: 'WA 50m' },
            { id: 6, bowType: 'Compound', category: "Mixed Team", round: 'WA (International)', subround: 'WA 50m (6 Ring Face)' }
        ],
        organizer: {
            name: "Korean Archery Association",
            email: "contact@archery-korea.kr",
            phone: "+82-2-987-6543"
        }
    },
    {
        id: 3,
        title: "Winter Indoor Tournament",
        description: "Annual winter indoor championship featuring 18-meter competitions. Perfect for archers looking to maintain their form during the winter season. All bow categories welcome including recurve, compound, and barebow divisions.",
        location: "Hanoi, Vietnam",
        startDate: "2024-12-22",
        endDate: "2024-12-23",
        dateDisplay: "Dec 22-23, 2024",
        registrationDeadline: "2024-12-15",
        maxParticipants: 120,
        currentParticipants: 89,
        status: "upcoming",
        competitions: [
            { id: 1, bowType: 'Recurve', category: "Men's Individual", round: 'WA (International)', subround: 'WA 30m (VI)' },
            { id: 2, bowType: 'Recurve', category: "Women's Individual", round: 'WA (International)', subround: 'WA 30m (VI)' },
            { id: 3, bowType: 'Compound', category: "Men's Individual", round: 'WA (International)', subround: 'WA Standard' },
            { id: 4, bowType: 'Compound', category: "Women's Individual", round: 'WA (International)', subround: 'WA Standard' },
            { id: 5, bowType: 'Barebow', category: "Men's Individual", round: 'WA (International)', subround: 'WA 50m (10 Zone-Barebow)' },
            { id: 6, bowType: 'Barebow', category: "Women's Individual", round: 'WA (International)', subround: 'WA 50m (10 Zone-Barebow)' }
        ],
        organizer: {
            name: "Vietnam Archery Federation",
            email: "info@archery-vietnam.vn",
            phone: "+84-24-3456-7890"
        }
    },
    {
        id: 4,
        title: "Spring Open Championship",
        description: "Open championship welcoming archers of all skill levels. Multiple distance categories available. Great opportunity for newcomers to experience competitive archery while veterans can showcase their skills across various formats.",
        location: "Sydney, Australia",
        startDate: "2025-12-10",
        endDate: "2025-12-12",
        dateDisplay: "Dec 10-12, 2025",
        registrationDeadline: "2025-12-03",
        maxParticipants: 180,
        currentParticipants: 67,
        status: "upcoming",
        competitions: [
            { id: 1, bowType: 'Recurve', category: "Men's Individual", round: 'WA (International)', subround: 'Half WA (90m)' },
            { id: 2, bowType: 'Recurve', category: "Women's Individual", round: 'WA (International)', subround: 'Half WA (70m)' },
            { id: 3, bowType: 'Recurve', category: "Men's Team", round: 'WA (International)', subround: 'WA 60m' },
            { id: 4, bowType: 'Barebow', category: "Men's Individual", round: 'WA (International)', subround: 'WA 50m (10 Zone-Barebow)' },
            { id: 5, bowType: 'Barebow', category: "Women's Individual", round: 'WA (International)', subround: 'WA 50m (10 Zone-Barebow)' }
        ],
        organizer: {
            name: "Archery Australia",
            email: "events@archery.org.au",
            phone: "+61-2-9876-5432"
        }
    },
    {
        id: 5,
        title: "International Archery Cup",
        description: "Premier international tournament attracting world-class archers from over 30 countries. Olympic-standard facility with live streaming and professional scoring systems. Prize pool of $50,000 USD. Qualification rounds lead to knockout stages with medal matches.",
        location: "Paris, France",
        startDate: "2025-12-20",
        endDate: "2025-12-23",
        dateDisplay: "Dec 20-23, 2025",
        registrationDeadline: "2025-12-10",
        maxParticipants: 250,
        currentParticipants: 198,
        status: "upcoming",
        competitions: [
            { id: 1, bowType: 'Recurve', category: "Men's Individual", round: 'WA (International)', subround: 'WA 1440 (90m)' },
            { id: 2, bowType: 'Recurve', category: "Women's Individual", round: 'WA (International)', subround: 'WA 1440 (70m)' },
            { id: 3, bowType: 'Recurve', category: "Men's Team", round: 'WA (International)', subround: 'WA 70m' },
            { id: 4, bowType: 'Recurve', category: "Women's Team", round: 'WA (International)', subround: 'WA 70m' },
            { id: 5, bowType: 'Recurve', category: "Mixed Team", round: 'WA (International)', subround: 'WA 70m' },
            { id: 6, bowType: 'Compound', category: "Men's Individual", round: 'WA (International)', subround: 'WA 50m' },
            { id: 7, bowType: 'Compound', category: "Women's Individual", round: 'WA (International)', subround: 'WA 50m' },
            { id: 13, category: 'Compound', division: "Men's Team", distance: '50m', target: '10 ring 80cm', ends: 8, arrows: 6 },
            { id: 14, category: 'Compound', division: "Women's Team", distance: '50m', target: '10 ring 80cm', ends: 8, arrows: 6 },
            { id: 15, category: 'Compound', division: "Mixed Team", distance: '50m', target: '10 ring 80cm', ends: 8, arrows: 6 }
        ],
        organizer: {
            name: "French Archery Federation",
            email: "international@archery-france.fr",
            phone: "+33-1-4567-8901"
        }
    },
    {
        id: 6,
        title: "Youth Development Camp",
        description: "Intensive training camp for junior and cadet archers featuring coaching sessions, technique workshops, and friendly competitions. Focus on skill development and preparing young archers for competitive events. All equipment provided.",
        location: "Bangkok, Thailand",
        startDate: "2024-12-05",
        endDate: "2024-12-08",
        dateDisplay: "Dec 5-8, 2024",
        registrationDeadline: "2024-11-25",
        maxParticipants: 80,
        currentParticipants: 73,
        status: "live",
        competitions: [
            { id: 26, category: 'Recurve', division: "Junior Men's Individual", distance: '70m', format: 'Olympic Round' },
            { id: 27, category: 'Recurve', division: "Junior Women's Individual", distance: '70m', format: 'Olympic Round' },
            { id: 28, category: 'Recurve', division: "Cadet Men's Individual", distance: '60m', format: 'Olympic Round' },
            { id: 29, category: 'Recurve', division: "Cadet Women's Individual", distance: '60m', format: 'Olympic Round' },
            { id: 30, category: 'Compound', division: "Junior Men's Individual", distance: '50m', format: 'Compound Round' },
            { id: 31, category: 'Compound', division: "Junior Women's Individual", distance: '50m', format: 'Compound Round' }
        ],
        organizer: {
            name: "Thailand Archery Association",
            email: "youth@archery-thailand.th",
            phone: "+66-2-345-6789"
        }
    },
    {
        id: 7,
        title: "Masters League Final",
        description: "Championship finale for the Masters League season. Top-ranked archers from the regular season compete for the ultimate title. Categories for age groups 40+, 50+, and 60+. Both recurve and compound divisions.",
        location: "London, UK",
        startDate: "2025-11-28",
        endDate: "2025-11-29",
        dateDisplay: "Nov 28-29, 2025",
        registrationDeadline: "2025-11-21",
        maxParticipants: 100,
        currentParticipants: 45,
        status: "upcoming",
        competitions: [
            { id: 36, category: 'Recurve', division: "Men's Individual", distance: '50m', target: '10 ring 122cm', ends: 6, arrows: 6 },
            { id: 37, category: 'Recurve', division: "Women's Individual", distance: '50m', target: '10 ring 122cm', ends: 6, arrows: 6 },
            { id: 42, category: 'Compound', division: "Men's Individual", distance: '30m', target: '10 ring 80cm', ends: 6, arrows: 6 },
            { id: 43, category: 'Compound', division: "Women's Individual", distance: '30m', target: '10 ring 80cm', ends: 6, arrows: 6 },
            { id: 1000, category: 'Recurve', division: "Masters 50+ Men's", distance: '50m', target: '10 ring 122cm', ends: 6, arrows: 6, isCustom: true },
            { id: 1001, category: 'Compound', division: "Masters 50+ Men's", distance: '30m', target: '10 ring 80cm', ends: 6, arrows: 6, isCustom: true }
        ],
        organizer: {
            name: "Archery GB",
            email: "masters@archerygb.org",
            phone: "+44-20-1234-5678"
        }
    },
    {
        id: 8,
        title: "Summer Outdoor Classic",
        description: "Classic outdoor tournament in beautiful Los Angeles weather. Multiple distances from 30m to 70m. Family-friendly event with beginner clinics and exhibitions. Food vendors and archery equipment expo on-site.",
        location: "Los Angeles, USA",
        startDate: "2025-11-25",
        endDate: "2025-11-28",
        dateDisplay: "Nov 25-28, 2025",
        registrationDeadline: "2025-11-15",
        maxParticipants: 220,
        currentParticipants: 134,
        status: "upcoming",
        competitions: [
            { id: 1, category: 'Recurve', division: "Men's Individual", distance: '70m', target: '10 ring 122cm', ends: 12, arrows: 6 },
            { id: 2, category: 'Recurve', division: "Women's Individual", distance: '70m', target: '10 ring 122cm', ends: 12, arrows: 6 },
            { id: 34, category: 'Recurve', division: "Men's Individual", distance: '60m', target: '10 ring 122cm', ends: 10, arrows: 6 },
            { id: 35, category: 'Recurve', division: "Women's Individual", distance: '60m', target: '10 ring 122cm', ends: 10, arrows: 6 },
            { id: 11, category: 'Compound', division: "Men's Individual", distance: '50m', target: '10 ring 80cm', ends: 12, arrows: 6 },
            { id: 12, category: 'Compound', division: "Women's Individual", distance: '50m', target: '10 ring 80cm', ends: 12, arrows: 6 },
            { id: 21, category: 'Barebow', division: "Men's Individual", distance: '50m', target: '10 ring 122cm', ends: 10, arrows: 6 },
            { id: 22, category: 'Barebow', division: "Women's Individual", distance: '50m', target: '10 ring 122cm', ends: 10, arrows: 6 }
        ],
        organizer: {
            name: "USA Archery - California",
            email: "events@usarchery-ca.org",
            phone: "+1-310-555-0123"
        }
    },
    {
        id: 9,
        title: "Asian Games Qualifier",
        description: "Official qualification tournament for the Asian Games. National team selection event with strict World Archery rules. Only top scorers will advance to represent their countries at the Asian Games.",
        location: "Beijing, China",
        startDate: "2025-12-05",
        endDate: "2025-12-07",
        dateDisplay: "Dec 5-7, 2025",
        registrationDeadline: "2025-11-20",
        maxParticipants: 160,
        currentParticipants: 87,
        status: "upcoming",
        competitions: [
            { id: 1, category: 'Recurve', division: "Men's Individual", distance: '70m', format: 'Olympic Round' },
            { id: 2, category: 'Recurve', division: "Women's Individual", distance: '70m', format: 'Olympic Round' },
            { id: 3, category: 'Recurve', division: "Men's Team", distance: '70m', format: 'Olympic Round' },
            { id: 4, category: 'Recurve', division: "Women's Team", distance: '70m', format: 'Olympic Round' },
            { id: 5, category: 'Recurve', division: "Mixed Team", distance: '70m', format: 'Olympic Round' },
            { id: 11, category: 'Compound', division: "Men's Individual", distance: '50m', format: 'Compound Round' },
            { id: 12, category: 'Compound', division: "Women's Individual", distance: '50m', format: 'Compound Round' },
            { id: 13, category: 'Compound', division: "Men's Team", distance: '50m', format: 'Compound Round' },
            { id: 14, category: 'Compound', division: "Women's Team", distance: '50m', format: 'Compound Round' }
        ],
        organizer: {
            name: "Chinese Archery Association",
            email: "asiangames@archery-china.cn",
            phone: "+86-10-6543-2109"
        }
    },
    {
        id: 10,
        title: "European Championship",
        description: "Annual European Championship bringing together the continent's finest archers. Four days of intense competition across all Olympic categories. Media coverage and live broadcasting to millions of viewers.",
        location: "Berlin, Germany",
        startDate: "2025-12-18",
        endDate: "2025-12-21",
        dateDisplay: "Dec 18-21, 2025",
        registrationDeadline: "2025-12-05",
        maxParticipants: 300,
        currentParticipants: 267,
        status: "upcoming",
        competitions: [
            { id: 1, category: 'Recurve', division: "Men's Individual", distance: '70m', format: 'Olympic Round' },
            { id: 2, category: 'Recurve', division: "Women's Individual", distance: '70m', format: 'Olympic Round' },
            { id: 3, category: 'Recurve', division: "Men's Team", distance: '70m', format: 'Olympic Round' },
            { id: 4, category: 'Recurve', division: "Women's Team", distance: '70m', format: 'Olympic Round' },
            { id: 5, category: 'Recurve', division: "Mixed Team", distance: '70m', format: 'Olympic Round' },
            { id: 11, category: 'Compound', division: "Men's Individual", distance: '50m', format: 'Compound Round' },
            { id: 12, category: 'Compound', division: "Women's Individual", distance: '50m', format: 'Compound Round' },
            { id: 13, category: 'Compound', division: "Men's Team", distance: '50m', format: 'Compound Round' },
            { id: 14, category: 'Compound', division: "Women's Team", distance: '50m', format: 'Compound Round' },
            { id: 15, category: 'Compound', division: "Mixed Team", distance: '50m', format: 'Compound Round' },
            { id: 26, category: 'Recurve', division: "Junior Men's Individual", distance: '70m', format: 'Olympic Round' },
            { id: 27, category: 'Recurve', division: "Junior Women's Individual", distance: '70m', format: 'Olympic Round' }
        ],
        organizer: {
            name: "German Archery Federation",
            email: "euro@archery-germany.de",
            phone: "+49-30-9876-5432"
        }
    },
    {
        id: 11,
        title: "World Cup Series Round 1",
        description: "First stage of the prestigious World Archery World Cup Series. Points earned here count toward World Cup Finals qualification. Elite international field expected. Prize money and world ranking points available.",
        location: "Shanghai, China",
        startDate: "2026-01-02",
        endDate: "2026-01-05",
        dateDisplay: "Jan 2-5, 2026",
        registrationDeadline: "2025-12-20",
        maxParticipants: 280,
        currentParticipants: 213,
        status: "upcoming",
        competitions: [
            { id: 1, category: 'Recurve', division: "Men's Individual", distance: '70m', format: 'Olympic Round' },
            { id: 2, category: 'Recurve', division: "Women's Individual", distance: '70m', format: 'Olympic Round' },
            { id: 3, category: 'Recurve', division: "Men's Team", distance: '70m', format: 'Olympic Round' },
            { id: 4, category: 'Recurve', division: "Women's Team", distance: '70m', format: 'Olympic Round' },
            { id: 5, category: 'Recurve', division: "Mixed Team", distance: '70m', format: 'Olympic Round' },
            { id: 11, category: 'Compound', division: "Men's Individual", distance: '50m', format: 'Compound Round' },
            { id: 12, category: 'Compound', division: "Women's Individual", distance: '50m', format: 'Compound Round' },
            { id: 13, category: 'Compound', division: "Men's Team", distance: '50m', format: 'Compound Round' },
            { id: 14, category: 'Compound', division: "Women's Team", distance: '50m', format: 'Compound Round' },
            { id: 15, category: 'Compound', division: "Mixed Team", distance: '50m', format: 'Compound Round' }
        ],
        organizer: {
            name: "Chinese Archery Association",
            email: "worldcup@archery-china.cn",
            phone: "+86-21-8765-4321"
        }
    },
    {
        id: 12,
        title: "National Team Trials",
        description: "Official selection trials for the national team. Performance here determines team composition for international competitions. High-pressure environment with standardized judging and scoring protocols.",
        location: "Tokyo, Japan",
        startDate: "2025-11-22",
        endDate: "2025-11-23",
        dateDisplay: "Nov 22-23, 2025",
        registrationDeadline: "2025-11-15",
        maxParticipants: 100,
        currentParticipants: 78,
        status: "upcoming",
        competitions: [
            { id: 1, category: 'Recurve', division: "Men's Individual", distance: '70m', format: 'Olympic Round' },
            { id: 2, category: 'Recurve', division: "Women's Individual", distance: '70m', format: 'Olympic Round' },
            { id: 11, category: 'Compound', division: "Men's Individual", distance: '50m', format: 'Compound Round' },
            { id: 12, category: 'Compound', division: "Women's Individual", distance: '50m', format: 'Compound Round' },
            { id: 26, category: 'Recurve', division: "Junior Men's Individual", distance: '70m', format: 'Olympic Round' },
            { id: 27, category: 'Recurve', division: "Junior Women's Individual", distance: '70m', format: 'Olympic Round' }
        ],
        organizer: {
            name: "Japan Archery Federation",
            email: "trials@archery-japan.jp",
            phone: "+81-3-1234-5678"
        }
    },
    {
        id: 13,
        title: "Autumn Open 2024",
        description: "Successful autumn tournament featuring both indoor and outdoor competitions. Over 130 participants competed across multiple categories. Winners received medals and qualification points for regional rankings.",
        location: "Osaka, Japan",
        startDate: "2024-11-05",
        endDate: "2024-11-06",
        dateDisplay: "Nov 5-6, 2024",
        registrationDeadline: "2024-10-28",
        maxParticipants: 150,
        currentParticipants: 137,
        status: "completed",
        competitions: [
            { id: 36, category: 'Recurve', division: "Men's Individual", distance: '50m', format: 'Qualification Round' },
            { id: 37, category: 'Recurve', division: "Women's Individual", distance: '50m', format: 'Qualification Round' },
            { id: 38, category: 'Recurve', division: "Men's Individual", distance: '30m', format: 'Qualification Round' },
            { id: 39, category: 'Recurve', division: "Women's Individual", distance: '30m', format: 'Qualification Round' },
            { id: 48, category: 'Barebow', division: "Men's Individual", distance: '30m', format: 'Barebow Round' },
            { id: 49, category: 'Barebow', division: "Women's Individual", distance: '30m', format: 'Barebow Round' }
        ],
        organizer: {
            name: "Osaka Archery Club",
            email: "autumn@osaka-archery.jp",
            phone: "+81-6-7890-1234"
        },
        results: {
            topScorers: [
                { name: "Takeshi Yamamoto", category: "Recurve Men's 50m", score: 682 },
                { name: "Yuki Nakamura", category: "Recurve Women's 50m", score: 671 },
                { name: "Kenji Sato", category: "Barebow Men's 30m", score: 658 }
            ]
        }
    },
    {
        id: 14,
        title: "Summer Classic 2024",
        description: "Three-day summer event held in perfect weather conditions. Mixed competition formats with qualifying rounds and elimination brackets. Strong international participation from 12 countries.",
        location: "Melbourne, Australia",
        startDate: "2024-10-12",
        endDate: "2024-10-14",
        dateDisplay: "Oct 12-14, 2024",
        registrationDeadline: "2024-10-05",
        maxParticipants: 180,
        currentParticipants: 176,
        status: "completed",
        competitions: [
            { id: 1, category: 'Recurve', division: "Men's Individual", distance: '70m', format: 'Olympic Round' },
            { id: 2, category: 'Recurve', division: "Women's Individual", distance: '70m', format: 'Olympic Round' },
            { id: 3, category: 'Recurve', division: "Men's Team", distance: '70m', format: 'Olympic Round' },
            { id: 4, category: 'Recurve', division: "Women's Team", distance: '70m', format: 'Olympic Round' },
            { id: 11, category: 'Compound', division: "Men's Individual", distance: '50m', format: 'Compound Round' },
            { id: 12, category: 'Compound', division: "Women's Individual", distance: '50m', format: 'Compound Round' }
        ],
        organizer: {
            name: "Archery Victoria",
            email: "summer@archery-vic.org.au",
            phone: "+61-3-9876-5432"
        },
        results: {
            topScorers: [
                { name: "James Mitchell", category: "Recurve Men's 70m", score: 698 },
                { name: "Emma Wilson", category: "Recurve Women's 70m", score: 687 },
                { name: "David Chen", category: "Compound Men's 50m", score: 712 }
            ]
        }
    },
    {
        id: 15,
        title: "Indoor Championship 2024",
        description: "Inaugural indoor championship held in state-of-the-art facility. Perfect conditions with electronic scoring systems. Set new participation record for indoor events in the region.",
        location: "Singapore",
        startDate: "2024-09-20",
        endDate: "2024-09-22",
        dateDisplay: "Sep 20-22, 2024",
        registrationDeadline: "2024-09-13",
        maxParticipants: 140,
        currentParticipants: 138,
        status: "completed",
        competitions: [
            { id: 6, category: 'Recurve', division: "Men's Individual", distance: '18m', format: 'Indoor' },
            { id: 7, category: 'Recurve', division: "Women's Individual", distance: '18m', format: 'Indoor' },
            { id: 8, category: 'Recurve', division: "Men's Team", distance: '18m', format: 'Indoor' },
            { id: 9, category: 'Recurve', division: "Women's Team", distance: '18m', format: 'Indoor' },
            { id: 16, category: 'Compound', division: "Men's Individual", distance: '18m', format: 'Indoor' },
            { id: 17, category: 'Compound', division: "Women's Individual", distance: '18m', format: 'Indoor' },
            { id: 53, category: 'Barebow', division: "Men's Individual", distance: '18m', format: 'Indoor' },
            { id: 54, category: 'Barebow', division: "Women's Individual", distance: '18m', format: 'Indoor' }
        ],
        organizer: {
            name: "Singapore Archery Association",
            email: "indoor@archery.sg",
            phone: "+65-6543-2109"
        },
        results: {
            topScorers: [
                { name: "Lee Wei Ming", category: "Recurve Men's 18m", score: 589 },
                { name: "Tan Mei Ling", category: "Recurve Women's 18m", score: 586 },
                { name: "Kumar Rajan", category: "Compound Men's 18m", score: 599 }
            ]
        }
    },
    {
        id: 16,
        title: "Winter Cup 2024",
        description: "Unfortunately cancelled due to severe weather conditions and facility issues. All registered participants have been notified and full refunds processed. We apologize for the inconvenience and hope to reschedule this event next season.",
        location: "Oslo, Norway",
        startDate: "2024-12-28",
        endDate: "2024-12-30",
        dateDisplay: "Dec 28-30, 2024",
        registrationDeadline: "2024-12-20",
        maxParticipants: 100,
        currentParticipants: 0,
        status: "cancelled",
        competitions: [
            { id: 6, category: 'Recurve', division: "Men's Individual", distance: '18m', format: 'Indoor' },
            { id: 7, category: 'Recurve', division: "Women's Individual", distance: '18m', format: 'Indoor' },
            { id: 16, category: 'Compound', division: "Men's Individual", distance: '18m', format: 'Indoor' },
            { id: 17, category: 'Compound', division: "Women's Individual", distance: '18m', format: 'Indoor' }
        ],
        organizer: {
            name: "Norwegian Archery Federation",
            email: "winter@archery-norway.no",
            phone: "+47-22-123-4567"
        },
        cancellationReason: "Severe weather conditions and facility maintenance issues"
    }
];

/**
 * Get event detail by ID
 * @param {number} id - Event ID
 * @returns {Object|null} Event detail object or null if not found
 */
function getEventDetail(id) {
    return eventDetails.find(event => event.id === id) || null;
}

/**
 * Get all event details
 * @returns {Array} Array of all event details
 */
function getAllEventDetails() {
    return [...eventDetails];
}

/**
 * Get event details by status
 * @param {string} status - Event status ('upcoming', 'live', 'completed', 'cancelled')
 * @returns {Array} Filtered array of event details
 */
function getEventDetailsByStatus(status) {
    return eventDetails.filter(event => event.status === status);
}

// Export to window object for use in HTML prototypes
if (typeof window !== 'undefined') {
    window.eventDetails = eventDetails;
    window.getEventDetail = getEventDetail;
    window.getAllEventDetails = getAllEventDetails;
    window.getEventDetailsByStatus = getEventDetailsByStatus;
}
