// ============================================================================
// IMPERIUM — SINGLE SOURCE OF TRUTH
// ----------------------------------------------------------------------------
// OBSERVED     = verified on the live site mdiimperium.com (Aug 2026 audit)
// ILLUSTRATIVE = plausibly inferred for the prototype; NOT a verified fact.
//
// Event names, tracks, registration URLs, sponsor names and edition statistics
// are OBSERVED. Times, venues, prizes, eligibility, rules and judging criteria
// are ILLUSTRATIVE and are labelled as such in the UI.
// ============================================================================

export const EDITION = {
  id: "imp26",
  year: 2026,
  name: "Imperium'26",
  theme: "The Sixth Synapse — It's All About You", // OBSERVED
  tagline: "MDI Gurgaon's Annual Management | Sports | Cultural Fest", // OBSERVED
  startDate: "2026-01-30T09:00:00",
  endDate: "2026-02-01T23:00:00",
  venueName: "MDI Gurgaon, Sukhrali, Gurugram 122007", // OBSERVED
  stats: [
    // All OBSERVED — published on the current live site
    { label: "Footfall across 3 days", value: "11K+" },
    { label: "Unstop registrations", value: "5K+" },
    { label: "Prize pool (INR)", value: "18L+" },
    { label: "Participating institutions", value: "150+" },
    { label: "Events across management, culture & sports", value: "60+" },
    { label: "Partner brands last year", value: "25+" },
  ],
};

export const EDITIONS = [
  { id: "imp26", year: 2026, name: "Imperium'26", status: "upcoming" },
  { id: "imp25", year: 2025, name: "Imperium'25", status: "archived" },
  { id: "imp24", year: 2024, name: "Imperium'24", status: "archived" },
];

export const TRACKS = [
  { id: "case", name: "Case Competition" },
  { id: "finance", name: "Finance" },
  { id: "marketing", name: "Marketing" },
  { id: "strategy", name: "Strategy" },
  { id: "ops", name: "Operations" },
  { id: "hr", name: "HR" },
  { id: "quiz", name: "Quiz" },
  { id: "gaming", name: "Gaming" },
  { id: "cultural", name: "Cultural" },
  { id: "sports", name: "Sports" },
  { id: "workshop", name: "Workshop" },
  { id: "informal", name: "Informal" },
];

export const VENUES = [
  { id: "aud", name: "Main Auditorium", building: "Academic Block", floor: "Ground", capacity: 600, x: 300, y: 140, note: "Central quad, opposite the fountain" },
  { id: "lh3", name: "Lecture Hall 3", building: "Academic Block", floor: "1st", capacity: 120, x: 195, y: 230, note: "East staircase, first door on the right" },
  { id: "lh5", name: "Lecture Hall 5", building: "Academic Block", floor: "1st", capacity: 120, x: 248, y: 230, note: "Next to LH-3, same corridor" },
  { id: "sem", name: "Seminar Hall", building: "Management Block", floor: "2nd", capacity: 200, x: 432, y: 196, note: "Above the faculty lounge" },
  { id: "amp", name: "Amphitheatre", building: "Open Air", floor: "—", capacity: 800, x: 378, y: 330, note: "Behind the library, open air" },
  { id: "sports", name: "Sports Complex", building: "Sports Block", floor: "Ground", capacity: 400, x: 122, y: 348, note: "Past the hostel gate, follow the track" },
  { id: "lawn", name: "Central Lawn", building: "Open Air", floor: "—", capacity: 1500, x: 300, y: 268, note: "The main open ground — you can't miss it" },
  { id: "atrium", name: "Atrium", building: "Academic Block", floor: "Ground", capacity: 250, x: 356, y: 188, note: "Glass-roofed area at the main entrance" },
  { id: "liblawn", name: "Library Lawn", building: "Open Air", floor: "—", capacity: 300, x: 474, y: 318, note: "Grass strip on the library's north side" },
  { id: "lab", name: "Computer Lab 2", building: "Academic Block", floor: "2nd", capacity: 80, x: 168, y: 168, note: "Second floor, end of the west corridor" },
];

const U = "https://unstop.com";

// 54 events. Names, tracks and registration URLs are OBSERVED from the live site.
// The duplicate registration URLs below are REAL and are deliberately preserved
// so the organiser console's validation surfaces them.
const RAW = [
  ["Data Rush", "quiz", U + "/quiz/data-rush-the-hunt-mdi-1627479"],
  ["Photographia", "cultural", U + "/events/photographia-mdi-1625846"],
  ["Flick", "cultural", U + "/events/flick-mdi-1625852"],
  ["Hunger Games", "informal", null],
  ["HR Simulation", "hr", null],
  ["Mind The Noise Challenge", "marketing", U + "/competitions/build-your-attention-strategy-mdi-1625120"],
  ["Advectius", "case", U + "/competitions/advectius-case-competition-mdi-1625878"],
  ["Policy Housie", "hr", null],
  ["MarQAd", "marketing", U + "/competitions/marqad-mdi-1626083"],
  ["MarQWitty", "marketing", U + "/competitions/marqwitty-mdi-1626073"],
  ["MAuctionRT", "marketing", null],
  ["Start-up Mafia", "strategy", U + "/competitions/startup-mafia-imperium-2026-mdi-1624495"],
  ["OpsHunt", "ops", U + "/competitions/opshunt-the-operations-management-treasure-hunt-2026-mdi-1626122"],
  ["KON (King of the North)", "sports", null],
  ["The Battle of Bands", "cultural", U + "/events/cosmic-crescendo-mdi-1626066"],
  ["Street Chronicles", "cultural", U + "/events/street-chronicles-mdi-1625132"],
  ["Samarpan", "cultural", U + "/competitions/samarpan-26-mdi-1630409"],
  ["Silent Stories", "cultural", null],
  ["BizCzar", "case", U + "/competitions/bizczar-2026-mdi-1627459"],
  ["Match the Product", "marketing", U + "/events/match-the-product-mdi-1625036"],
  ["Aether — Product Pitch Competition", "strategy", U + "/competitions/aether-product-pitch-competition-mdi-1625028"],
  ["Esports: BGMI", "gaming", U + "/events/esports-bgmi-mdi-1624301"],
  ["Legends of the Worlds", "gaming", U + "/events/legends-of-the-world-gaming-competition-imperium-2026-mdi-1624296"],
  ["Beyond 180", "case", U + "/competitions/the-flagship-case-competition-of-180-dc-mdi-1624652"],
  ["Tidal Trivia", "quiz", null],
  ["Your Cosmic Canvas", "workshop", null],
  ["SparkScanner", "informal", null],
  ["Invisible Strings Attached", "informal", null],
  ["Sip Happens", "informal", null],
  ["Brews and Brushstrokes", "workshop", null],
  ["IPL Auction", "informal", U + "/events/inferno-auction-ipl-wars-mdi-1625190"],
  ["Shutterhunt", "cultural", null],
  ["Pottery Paint", "workshop", null],
  ["Art Sale", "workshop", null],
  ["Glitter Bar", "workshop", null],
  ["Elements of Play", "informal", null],
  ["Group Dance", "cultural", U + "/events/stellar-showdown-mdi-1626062"],
  ["Kaun Banega Marketer", "marketing", null],
  ["Windfall", "finance", U + "/competitions/windfall-the-trading-floor-imperium-2026-mdi-1625201"],
  ["Product Charades", "marketing", U + "/competitions/the-flagship-case-competition-of-180-dc-mdi-1624652"],
  ["Elements of Delta", "finance", U + "/competitions/elements-of-delta-the-great-options-trading-battle-mdi-1627441"],
  ["AetherQuest", "quiz", U + "/quiz/aetherquest-the-elemental-intelligence-quiz-imperium-2026-mdi-1629883"],
  ["Podcast or WhatsApp Forward?", "quiz", U + "/quiz/aetherquest-the-elemental-intelligence-quiz-imperium-2026-mdi-1629883"],
  ["Colosseum", "sports", U + "/events/colosseum-clash-mdi-1626071"],
  ["Brainwave Feud", "quiz", null],
  ["Ace Theory", "quiz", null],
  ["Literary Trivia", "quiz", null],
  ["Elemental NFT", "finance", U + "/competitions/elemental-nft-genesis-imperium-2026-mdi-1625487"],
  ["Zumba Session", "workshop", U + "/competitions/elemental-nft-genesis-imperium-2026-mdi-1625487"],
  ["Blind Date with a Book", "informal", null],
  ["Elemental VR", "workshop", U + "/competitions/elemental-nft-genesis-imperium-2026-mdi-1625487"],
  ["Dog Therapy Session", "workshop", U + "/competitions/elemental-nft-genesis-imperium-2026-mdi-1625487"],
  ["Silent Dance Therapy", "workshop", U + "/competitions/elemental-nft-genesis-imperium-2026-mdi-1625487"],
  ["Perfume Making Workshop", "workshop", null],
];

export const slugify = (s) =>
  s.toLowerCase().replace(/[\u2014\u2013]/g, "-").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const DAYS = ["2026-01-30", "2026-01-31", "2026-02-01"];
const SLOTS = [
  ["09:00", "11:00"], ["10:00", "12:00"], ["11:00", "13:00"], ["12:00", "14:00"],
  ["14:00", "16:00"], ["15:00", "17:00"], ["16:00", "18:00"], ["17:00", "19:00"],
];
const VIDS = VENUES.map((v) => v.id);
const TEAM_TRACKS = ["case", "strategy", "ops", "hr", "gaming", "sports"];
const SOLO_TRACKS = ["quiz", "workshop", "informal"];

const PRIZES = {
  case: 200000, finance: 100000, marketing: 75000, strategy: 100000, ops: 60000,
  hr: 60000, quiz: 30000, gaming: 40000, cultural: 50000, sports: 40000,
  workshop: 0, informal: 15000,
};

const BLURBS = {
  case: "A multi-round case competition judged by industry practitioners.",
  finance: "A markets and valuation challenge built around live decision-making.",
  marketing: "A brand and consumer-insight challenge with a live pitch round.",
  strategy: "A strategy and product challenge scored on structure and insight.",
  ops: "An operations and supply-chain problem solved against the clock.",
  hr: "A people and policy simulation with a live stakeholder round.",
  quiz: "A written prelim followed by an on-stage final.",
  gaming: "A bracketed competitive gaming tournament.",
  cultural: "A performance event judged on craft, originality and stage presence.",
  sports: "A knockout tournament running across the fest days.",
  workshop: "A hands-on session — walk in, no preparation needed.",
  informal: "A drop-in campus activity you can join between events.",
};

const ORGANISERS = ["Kirti Agarwal", "Akash Gupta", "Shantanu Jain", "Dhruvi Sethiya", "Sidharth Singhal"];

export const EVENTS = RAW.map(function (row, i) {
  const name = row[0], track = row[1], url = row[2];
  const day = DAYS[i % 3];
  const slot = SLOTS[i % SLOTS.length];
  const isTeam = TEAM_TRACKS.indexOf(track) >= 0 || (SOLO_TRACKS.indexOf(track) < 0 && i % 2 === 0);
  const prize = PRIZES[track] != null ? PRIZES[track] : 25000;
  return {
    id: "e" + (i + 1),
    editionId: "imp26",
    name: name,
    slug: slugify(name),
    trackId: track,
    format: isTeam ? "team" : "individual",
    mode: track === "gaming" && i % 2 ? "online" : "on_campus",
    shortDescription: BLURBS[track],
    fullDescription: null,
    eligibility:
      track === "case" || track === "finance"
        ? "Open to all postgraduate students from any recognised institution."
        : "Open to all college students. A valid student ID is required at the venue.",
    teamSizeMin: isTeam ? 2 : 1,
    teamSizeMax: isTeam ? 4 : 1,
    prizeTotal: prize,
    prizeBreakdown: prize
      ? [
          { position: "1st", amount: Math.round(prize * 0.5) },
          { position: "2nd", amount: Math.round(prize * 0.3) },
          { position: "3rd", amount: Math.round(prize * 0.2) },
        ]
      : [],
    rules: [
      "Report to the venue 15 minutes before the start time.",
      "Carry a valid college ID — it will be checked at entry.",
      "Team composition cannot be changed after registration closes.",
      "The judges' decision is final.",
    ],
    rounds: isTeam
      ? [
          { name: "Round 1 — Online submission", detail: "Submit your deck on Unstop before the deadline." },
          { name: "Round 2 — Shortlist announced", detail: "Shortlisted teams are notified by email." },
          { name: "Finals — On campus", detail: "Live presentation before the judging panel." },
        ]
      : [{ name: "Single round", detail: "Held live on campus on the scheduled day." }],
    criteria: [],
    date: day,
    startTime: slot[0],
    endTime: slot[1],
    venueId: VIDS[i % VIDS.length],
    registrationUrl: url,
    registrationDeadline: "2026-01-25",
    status: url ? (i % 7 === 0 ? "closing_soon" : "open") : "no_url",
    organiser: { name: ORGANISERS[i % 5], phone: "+91 96543 30572" },
    faqs: [
      {
        q: "Do I need to register in advance?",
        a: url
          ? "Yes — registration is handled on Unstop and closes on 25 January."
          : "Registration for this event is not open yet. Use Notify me and we will tell you the moment it opens.",
      },
      { q: "Is there a participation fee?", a: "No. Imperium events are free to enter." },
    ],
    relatedIds: [],
    registrationCount: url ? 40 + ((i * 17) % 180) : 0,
    registrationTarget: 120,
    lastChangedAt: null,
    changed: false,
    dataNote: "illustrative",
  };
});

// ---- Fully detailed flagship events -------------------------------------
function detail(slug, patch) {
  const e = EVENTS.find(function (x) { return x.slug === slug; });
  if (e) Object.assign(e, patch);
}

detail("advectius", {
  date: "2026-01-31", startTime: "10:00", endTime: "14:00", venueId: "lh3",
  fullDescription:
    "Advectius is Imperium's flagship strategy case competition. Teams receive a live business problem from a partner organisation and have three weeks to build a recommendation. The strongest submissions are invited to campus to present to a panel of practising consultants and industry leaders. Expect to be pushed on your assumptions, not just your slides.",
  criteria: [
    { name: "Problem structuring", weight: 30 },
    { name: "Depth of analysis", weight: 30 },
    { name: "Feasibility of recommendation", weight: 25 },
    { name: "Communication & Q&A", weight: 15 },
  ],
  rules: [
    "Teams of 2 to 4. Members may be from different institutions.",
    "The Round 1 submission must be a PDF deck of at most 10 slides.",
    "Finalists present for 10 minutes followed by 5 minutes of Q&A.",
    "Any use of confidential company data results in disqualification.",
    "The judges' decision is final.",
  ],
  faqs: [
    { q: "Can team members be from different colleges?", a: "Yes. Cross-institution teams are welcome and common." },
    { q: "Is the case released in advance?", a: "The case is released to all registered teams on 8 January." },
    { q: "What should we bring to the finals?", a: "Your deck on a USB drive as a backup, and a valid college ID." },
  ],
  registrationCount: 214, registrationTarget: 200,
});

detail("bizczar", {
  date: "2026-01-30", startTime: "11:00", endTime: "15:00", venueId: "sem",
  fullDescription:
    "BizCzar is a general management case competition that runs across all functions — you are scored as much on how you think as on what you conclude. Teams work through a written prelim, a caselet round, and a final boardroom simulation in front of the panel.",
  criteria: [
    { name: "Business acumen", weight: 35 },
    { name: "Quantitative rigour", weight: 25 },
    { name: "Creativity of solution", weight: 20 },
    { name: "Presentation", weight: 20 },
  ],
  registrationCount: 168,
});

detail("windfall", {
  date: "2026-01-31", startTime: "12:00", endTime: "14:00", venueId: "lab",
  fullDescription:
    "Windfall puts you on a simulated trading floor. Teams trade a live-feed portfolio across a compressed session, reacting to news events released at intervals. Scored on absolute return and on risk discipline — reckless positions are penalised even when they pay off.",
  criteria: [
    { name: "Portfolio return", weight: 40 },
    { name: "Risk management", weight: 30 },
    { name: "Decision rationale", weight: 20 },
    { name: "Team coordination", weight: 10 },
  ],
  registrationCount: 143,
});

detail("marqad", {
  date: "2026-01-31", startTime: "11:00", endTime: "13:00", venueId: "aud",
  fullDescription:
    "MarQAd is a live advertising challenge. Teams are handed a real brand brief on the morning of the event and have four hours to build a campaign concept, a key visual and a three-minute pitch. No pre-preparation is possible, which is the point.",
  criteria: [
    { name: "Insight", weight: 30 },
    { name: "Creative idea", weight: 30 },
    { name: "Execution", weight: 20 },
    { name: "Pitch", weight: 20 },
  ],
  registrationCount: 192,
});

detail("aetherquest", { date: "2026-02-01", startTime: "14:00", endTime: "16:00", venueId: "atrium", registrationCount: 97 });

EVENTS.forEach(function (e) {
  e.relatedIds = EVENTS.filter(function (o) { return o.trackId === e.trackId && o.id !== e.id; })
    .slice(0, 3)
    .map(function (o) { return o.id; });
});

export const ANNOUNCEMENTS = [
  { id: "a1", editionId: "imp26", title: "Day 2 schedule is confirmed", body: "All Day 2 timings are final. Check your schedule for venue details.", priority: "info", eventId: null, publishedAt: "2026-01-30T20:10:00", autoGenerated: false },
  { id: "a2", editionId: "imp26", title: "Registration closes 25 January", body: "Unstop registration for all competitive events closes at 11:59 PM on 25 January.", priority: "important", eventId: null, publishedAt: "2026-01-20T10:00:00", autoGenerated: false },
  { id: "a3", editionId: "imp26", title: "Pro Night entry opens at 6:30 PM", body: "Gates for the Central Lawn open at 6:30 PM. Carry your college ID.", priority: "info", eventId: null, publishedAt: "2026-01-31T08:00:00", autoGenerated: false },
  { id: "a4", editionId: "imp26", title: "Windfall is running 20 minutes late", body: "Computer Lab 2 is still being set up. Windfall will now start at 12:20 PM.", priority: "urgent", eventId: "e39", publishedAt: "2026-01-31T09:05:00", autoGenerated: false },
];

// Sponsor names are OBSERVED on the current Collaborations page. Tiers are ILLUSTRATIVE.
export const SPONSORS = [
  { id: "s1", editionId: "imp26", name: "Grant Thornton", tier: "Title Partner", website: "https://www.grantthornton.in", description: "Knowledge partner for the case competition track." },
  { id: "s2", editionId: "imp26", name: "ixigo", tier: "Powered By", website: "https://www.ixigo.com", description: "Travel partner for visiting contingents." },
  { id: "s3", editionId: "imp26", name: "Nissan", tier: "Associate Partner", website: "https://www.nissan.in", description: "On-campus brand activation across all three days." },
  { id: "s4", editionId: "imp26", name: "Plum", tier: "Associate Partner", website: "https://plumgoodness.com", description: "Sampling activation at the Central Lawn." },
  { id: "s5", editionId: "imp26", name: "Coolberg", tier: "Category Partner", website: "https://coolberg.in", description: "Beverage partner across all venues." },
  { id: "s6", editionId: "imp26", name: "Iota Water", tier: "Category Partner", website: null, description: "Hydration partner for the sports track." },
  { id: "s7", editionId: "imp26", name: "Crown Glow", tier: "Event Partner", website: null, description: "Partner for the cultural showcase events." },
  { id: "s8", editionId: "imp26", name: "Cut & Style", tier: "In-kind Partner", website: null, description: "Grooming partner for the pro nights." },
];

export const SPONSOR_PACKAGES = [
  { tier: "Title Partner", inclusions: ["Naming rights across all fest collateral", "Logo lock-up with the Imperium wordmark", "Two branded competitive events", "Main stage presence on all three nights", "Dedicated on-campus activation zone", "Full presence in the post-fest report"], eventAssociation: true },
  { tier: "Powered By", inclusions: ["'Powered by' credit on the website and stage", "One branded competitive event", "On-campus activation space", "Logo on all digital creatives"], eventAssociation: true },
  { tier: "Associate Partner", inclusions: ["Logo on website, standees and stage backdrop", "Sampling or activation stall", "Social media mentions across the fest"], eventAssociation: true },
  { tier: "Category Partner", inclusions: ["Exclusive category rights for the fest", "Logo on website and venue signage", "Product presence at all venues"], eventAssociation: false },
  { tier: "Event Partner", inclusions: ["Association with a single named event", "Logo on that event's page and collateral", "Judge or prize-presenter slot"], eventAssociation: true },
  { tier: "In-kind Partner", inclusions: ["Logo on the website partner wall", "Activation space in exchange for services"], eventAssociation: false },
];

export const TEAM = [
  { id: "t1", name: "Anushka Arora", role: "Joint Secretary", vertical: "Secretariat" },
  { id: "t2", name: "Divya Goyal", role: "Vertical Head", vertical: "Nautica" },
  { id: "t3", name: "Aayush Banka", role: "Vertical Member", vertical: "Nautica" },
  { id: "t4", name: "Kirti Agarwal", role: "Vertical Head", vertical: "Event Management" },
  { id: "t5", name: "Shishir Mishra", role: "Vertical Head", vertical: "Marketing" },
  { id: "t6", name: "Soumya Sharma", role: "Vertical Head", vertical: "Sponsorships" },
  { id: "t7", name: "Rahul Sunov", role: "Vertical Head", vertical: "Creativity & Design" },
  { id: "t8", name: "Akash Gupta", role: "Vertical Member", vertical: "Event Management" },
];

// Pre-seeded demo participant used by the "Load demo participant" control.
// MarQAd (11:00-13:00) and Windfall (12:00-14:00) are both on 31 Jan — a deliberate clash.
export const DEMO_PARTICIPANT = {
  name: "Riya Menon",
  email: "riya.menon@example.edu",
  institution: "SIBM Pune",
  eventSlugs: ["advectius", "marqad", "windfall", "aetherquest"],
};

export const JUDGE = {
  id: "j1",
  token: "demo",
  name: "Rohan Malhotra",
  organisation: "Director, Strategy — Nexa Consulting",
  assignedEventIds: ["e7", "e19"],
};

export const JUDGE_TEAMS = {
  e7: ["Team Meridian — IIM Indore", "The Fourth Wall — FMS Delhi", "Blue Ledger — SIBM Pune", "Northpoint — XLRI", "Signal & Noise — MDI Gurgaon", "Cohort Nine — IIFT"],
  e19: ["Redline — NMIMS", "Table Stakes — IMT Ghaziabad", "Kestrel — MDI Gurgaon", "Second Order — SPJIMR"],
};

export const RESULTS = [
  { id: "r1", eventId: "e7", position: 1, winnerName: "Team Meridian", winnerInstitution: "IIM Indore" },
  { id: "r2", eventId: "e7", position: 2, winnerName: "Blue Ledger", winnerInstitution: "SIBM Pune" },
  { id: "r3", eventId: "e7", position: 3, winnerName: "Northpoint", winnerInstitution: "XLRI" },
  { id: "r4", eventId: "e19", position: 1, winnerName: "Kestrel", winnerInstitution: "MDI Gurgaon" },
  { id: "r5", eventId: "e19", position: 2, winnerName: "Redline", winnerInstitution: "NMIMS" },
  { id: "r6", eventId: "e9", position: 1, winnerName: "Signal & Noise", winnerInstitution: "MDI Gurgaon" },
  { id: "r7", eventId: "e9", position: 2, winnerName: "Blue Ledger", winnerInstitution: "SIBM Pune" },
];

// Shaan, Euphoria and The Local Train are OBSERVED on the current site as PAST
// performers. Their placement in this line-up is ILLUSTRATIVE.
export const PRO_NIGHTS = [
  { day: "30 Jan", act: "The Local Train", type: "Band", time: "8:00 PM", venue: "Central Lawn" },
  { day: "31 Jan", act: "Shaan", type: "Live concert", time: "8:00 PM", venue: "Central Lawn" },
  { day: "1 Feb", act: "Euphoria", type: "Band", time: "7:30 PM", venue: "Central Lawn" },
];

export const DEMO_CLOCKS = {
  pre: "2026-01-12T15:30:00",
  live: "2026-01-31T09:17:00",
  post: "2026-02-05T11:00:00",
};
