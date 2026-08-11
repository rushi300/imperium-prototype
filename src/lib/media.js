// ============================================================================
// IMPERIUM — MEDIA LIBRARY
// ----------------------------------------------------------------------------
// Photography is stock imagery (Pexels License — free for commercial use)
// chosen to evoke each track/section's real energy. It is not photography
// from a specific Imperium edition — see the note on the About page gallery.
// ============================================================================

export const TRACK_IMAGES = {
  case: { src: "/images/track-case.jpg", alt: "Team presenting around a boardroom table" },
  finance: { src: "/images/track-finance.jpg", alt: "Trading screens with live market charts" },
  marketing: { src: "/images/track-marketing.jpg", alt: "Team workshopping a campaign brief" },
  strategy: { src: "/images/track-strategy.jpg", alt: "Professionals collaborating in a strategy session" },
  ops: { src: "/images/track-strategy.jpg", alt: "Team working through an operations problem" },
  hr: { src: "/images/track-case.jpg", alt: "Panel discussion around a table" },
  quiz: { src: "/images/track-campus.jpg", alt: "Students collaborating over a laptop" },
  gaming: { src: "/images/track-gaming.jpg", alt: "Players competing in an esports tournament" },
  cultural: { src: "/images/track-cultural.jpg", alt: "Classical dancer performing on stage" },
  sports: { src: "/images/track-sports.jpg", alt: "Athletes in action mid-match" },
  workshop: { src: "/images/track-workshop.jpg", alt: "Hands at work in a creative workshop" },
  informal: { src: "/images/track-campus.jpg", alt: "Students hanging out on campus" },
};

export const trackImage = (trackId) => TRACK_IMAGES[trackId] || TRACK_IMAGES.informal;

export const HERO_IMAGES = {
  pre: { src: "/images/hero-crowd.jpg", alt: "Crowd cheering with confetti in the air at a fest night" },
  post: { src: "/images/hero-concert.jpg", alt: "Band performing on a lit stage to a full crowd" },
  events: { src: "/images/events-hero.jpg", alt: "Team mid-presentation, screens glowing behind them" },
  partner: { src: "/images/partner-handshake.jpg", alt: "Two professionals shaking hands on a partnership" },
  proNights: { src: "/images/hero-concert.jpg", alt: "Band performing on a lit stage to a full crowd" },
  about: { src: "/images/hero-crowd.jpg", alt: "Crowd cheering with confetti in the air at a fest night" },
};

export const PRO_NIGHT_IMAGES = [
  { src: "/images/pronight-1.jpg", alt: "Electrifying night concert with dramatic stage lights" },
  { src: "/images/pronight-2.jpg", alt: "Vibrant concert crowd under dramatic stage lights" },
  { src: "/images/pronight-3.jpg", alt: "Massive crowd at a music festival under bright stage lights" },
];

export const GALLERY_IMAGES = [
  { src: "/images/hero-crowd.jpg", alt: "Crowd celebrating with confetti in the air" },
  { src: "/images/pronight-1.jpg", alt: "Stage lights over the crowd on Pro Night" },
  { src: "/images/track-cultural.jpg", alt: "Classical dance performance on stage" },
  { src: "/images/track-sports.jpg", alt: "Action shot from the sports tournament" },
  { src: "/images/track-gaming.jpg", alt: "Esports tournament in progress" },
  { src: "/images/track-workshop.jpg", alt: "Hands at work during a creative workshop" },
  { src: "/images/partner-handshake.jpg", alt: "A partnership sealed on the Central Lawn" },
  { src: "/images/pronight-2.jpg", alt: "Concert crowd under dramatic stage lights" },
];
