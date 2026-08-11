// ============================================================================
// IMPERIUM — MEDIA LIBRARY
// ----------------------------------------------------------------------------
// Photography is stock imagery (Pexels License — free for commercial use)
// chosen to evoke each track/section's real energy. It is not photography
// from a specific Imperium edition — see the note on the About page gallery.
// ============================================================================

import { withBase } from "@/lib/basePath";

export const TRACK_IMAGES = {
  case: { src: withBase("/images/track-case.jpg"), alt: "Team presenting around a boardroom table" },
  finance: { src: withBase("/images/track-finance.jpg"), alt: "Trading screens with live market charts" },
  marketing: { src: withBase("/images/track-marketing.jpg"), alt: "Team workshopping a campaign brief" },
  strategy: { src: withBase("/images/track-strategy.jpg"), alt: "Professionals collaborating in a strategy session" },
  ops: { src: withBase("/images/track-strategy.jpg"), alt: "Team working through an operations problem" },
  hr: { src: withBase("/images/track-case.jpg"), alt: "Panel discussion around a table" },
  quiz: { src: withBase("/images/track-campus.jpg"), alt: "Students collaborating over a laptop" },
  gaming: { src: withBase("/images/track-gaming.jpg"), alt: "Players competing in an esports tournament" },
  cultural: { src: withBase("/images/track-cultural.jpg"), alt: "Classical dancer performing on stage" },
  sports: { src: withBase("/images/track-sports.jpg"), alt: "Athletes in action mid-match" },
  workshop: { src: withBase("/images/track-workshop.jpg"), alt: "Hands at work in a creative workshop" },
  informal: { src: withBase("/images/track-campus.jpg"), alt: "Students hanging out on campus" },
};

export const trackImage = (trackId) => TRACK_IMAGES[trackId] || TRACK_IMAGES.informal;

export const HERO_IMAGES = {
  pre: { src: withBase("/images/hero-crowd.jpg"), alt: "Crowd cheering with confetti in the air at a fest night" },
  post: { src: withBase("/images/hero-concert.jpg"), alt: "Band performing on a lit stage to a full crowd" },
  events: { src: withBase("/images/events-hero.jpg"), alt: "Team mid-presentation, screens glowing behind them" },
  partner: { src: withBase("/images/partner-handshake.jpg"), alt: "Two professionals shaking hands on a partnership" },
  proNights: { src: withBase("/images/hero-concert.jpg"), alt: "Band performing on a lit stage to a full crowd" },
  about: { src: withBase("/images/hero-crowd.jpg"), alt: "Crowd cheering with confetti in the air at a fest night" },
};

export const PRO_NIGHT_IMAGES = [
  { src: withBase("/images/pronight-1.jpg"), alt: "Electrifying night concert with dramatic stage lights" },
  { src: withBase("/images/pronight-2.jpg"), alt: "Vibrant concert crowd under dramatic stage lights" },
  { src: withBase("/images/pronight-3.jpg"), alt: "Massive crowd at a music festival under bright stage lights" },
];

export const GALLERY_IMAGES = [
  { src: withBase("/images/hero-crowd.jpg"), alt: "Crowd celebrating with confetti in the air" },
  { src: withBase("/images/pronight-1.jpg"), alt: "Stage lights over the crowd on Pro Night" },
  { src: withBase("/images/track-cultural.jpg"), alt: "Classical dance performance on stage" },
  { src: withBase("/images/track-sports.jpg"), alt: "Action shot from the sports tournament" },
  { src: withBase("/images/track-gaming.jpg"), alt: "Esports tournament in progress" },
  { src: withBase("/images/track-workshop.jpg"), alt: "Hands at work during a creative workshop" },
  { src: withBase("/images/partner-handshake.jpg"), alt: "A partnership sealed on the Central Lawn" },
  { src: withBase("/images/pronight-2.jpg"), alt: "Concert crowd under dramatic stage lights" },
];
