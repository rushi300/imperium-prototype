"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useEffect, useState, useRef } from "react";
import { useImperium } from "@/context/ImperiumContext";
import { EventCard, AnnouncementItem, NextEventCard, CampusMap } from "@/components/blocks";
import { Button, Section, SectionHead, StatusChip, TrackChip, Reveal, HeroPhoto, SynapseField } from "@/components/ui";
import { eventStart, eventEnd, fmtTime, venueName, trackName, displayStatus, fmtMoney } from "@/lib/derive";
import { HERO_IMAGES, PRO_NIGHT_IMAGES } from "@/lib/media";

export default function Home() {
  const {
    mode, edition, events, announcements, sponsors, proNights,
    now, participant, nextEvent, results, tracks,
  } = useImperium();

  const happeningNow = useMemo(
    () => events.filter((e) => now >= eventStart(e) && now <= eventEnd(e)),
    [events, now]
  );
  const startingSoon = useMemo(() => {
    const limit = new Date(now.getTime() + 180 * 60000);
    return events
      .filter((e) => eventStart(e) > now && eventStart(e) <= limit)
      .sort((a, b) => eventStart(a) - eventStart(b))
      .slice(0, 6);
  }, [events, now]);

  const featured = useMemo(
    () => ["advectius", "marqad", "windfall", "bizczar"].map((s) => events.find((e) => e.slug === s)).filter(Boolean),
    [events]
  );

  const trackCounts = useMemo(() => {
    const m = {};
    events.forEach((e) => { m[e.trackId] = (m[e.trackId] || 0) + 1; });
    return m;
  }, [events]);

  const recentResults = results.slice(0, 4);
  const sorted = [...announcements].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  return (
    <>
      {mode === "live" ? <LiveHero /> : mode === "post" ? <PostHero /> : <PreHero />}

      {/* ---------------- LIVE BLOCK — inserted above, nothing deleted ---------------- */}
      {mode === "live" && (
        <div id="live" className="scroll-mt-20">
          {participant && nextEvent && (
            <Section className="!py-6">
              <NextEventCard event={nextEvent} now={now} />
            </Section>
          )}

          {!participant && (
            <Section className="!py-6">
              <div className="bg-surface border border-line rounded-lg p-5 flex flex-wrap items-center justify-between gap-4">
                <p className="text-[15px] text-ink-2 max-w-prose">
                  Everything below works without signing in. A <span className="text-ink font-semibold">Pass</span> just
                  adds your own schedule and next-event card on top.
                </p>
                <Button as={Link} href="/pass" variant="secondary" size="sm">Get your Pass</Button>
              </div>
            </Section>
          )}

          <Section className="!pt-6 !pb-8">
            <SectionHead
              eyebrow="Right now"
              title="Happening now"
              action={<Button as={Link} href="/schedule" variant="ghost" size="sm">Full schedule →</Button>}
            />
            {happeningNow.length ? (
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
                {happeningNow.map((e) => (
                  <Link
                    key={e.id}
                    href={`/events/${e.slug}`}
                    className="shrink-0 w-[280px] bg-surface border border-live/40 rounded-lg p-5 hover:border-live"
                  >
                    <StatusChip status="live" />
                    <h3 className="font-display text-[19px] font-bold mt-3 mb-1.5 leading-snug">{e.name}</h3>
                    <p className="text-[14px] text-ink-2">{venueName(e.venueId)}</p>
                    <p className="text-[13px] text-ink-3 mt-1">Until {fmtTime(e.endTime)}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-ink-3">Nothing running at this exact moment. Check what starts soon below.</p>
            )}
          </Section>

          <Section className="!py-8">
            <SectionHead eyebrow="Next 3 hours" title="Starting soon" />
            <ul className="divide-y divide-line border-y border-line">
              {startingSoon.map((e) => (
                <li key={e.id}>
                  <Link href={`/events/${e.slug}`} className="flex items-center gap-4 py-4 hover:bg-surface -mx-2 px-2 rounded-sm">
                    <span className="w-[76px] shrink-0 tabular-nums font-semibold">{fmtTime(e.startTime)}</span>
                    <span className="flex-1 min-w-0">
                      <span className="block font-medium truncate">{e.name}</span>
                      <span className="block text-[13px] text-ink-3">{venueName(e.venueId)}</span>
                    </span>
                    {e.changed && <span className="text-[11px] text-closing shrink-0 uppercase tracking-wider font-semibold">Changed</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </Section>

          <Section className="!py-8">
            <SectionHead eyebrow="What changed" title="Announcements" />
            <div className="grid md:grid-cols-2 gap-3">
              {sorted.slice(0, 4).map((a) => <AnnouncementItem key={a.id} announcement={a} />)}
            </div>
          </Section>

          <Section className="!py-8">
            <SectionHead eyebrow="Getting around" title="Campus map" />
            <CampusMap />
          </Section>

          {recentResults.length > 0 && (
            <Section className="!py-8">
              <SectionHead eyebrow="Declared" title="Results out" action={<Button as={Link} href="/results" variant="ghost" size="sm">All results →</Button>} />
              <div className="grid sm:grid-cols-2 gap-3">
                {recentResults.map((r) => {
                  const ev = events.find((e) => e.id === r.eventId);
                  if (!ev || r.position !== 1) return null;
                  return (
                    <Link key={r.id} href={`/events/${ev.slug}`} className="bg-surface border border-line rounded-md p-4 hover:border-line-strong">
                      <StatusChip status="results_out" />
                      <h3 className="font-semibold mt-2.5">{ev.name}</h3>
                      <p className="text-[14px] text-ink-2 mt-1">🏆 {r.winnerName} · {r.winnerInstitution}</p>
                    </Link>
                  );
                })}
              </div>
            </Section>
          )}

          <div className="border-t border-line">
            <Section className="!pb-0 !pt-10">
              <p className="text-[13px] text-ink-3 uppercase tracking-[0.1em] font-semibold">The rest of Imperium</p>
            </Section>
          </div>
        </div>
      )}

      {/* ---------------- POST BLOCK ---------------- */}
      {mode === "post" && (
        <Section>
          <SectionHead eyebrow="Imperium'26" title="Winners" action={<Button as={Link} href="/results" variant="ghost" size="sm">All results →</Button>} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.filter((r) => r.position === 1).map((r) => {
              const ev = events.find((e) => e.id === r.eventId);
              if (!ev) return null;
              return (
                <Link key={r.id} href={`/events/${ev.slug}`} className="bg-surface border border-line rounded-lg p-5 hover:border-line-strong">
                  <TrackChip>{trackName(ev.trackId)}</TrackChip>
                  <h3 className="font-display text-[19px] font-bold mt-3 mb-2">{ev.name}</h3>
                  <p className="text-[15px] text-results font-semibold">🏆 {r.winnerName}</p>
                  <p className="text-[13px] text-ink-3">{r.winnerInstitution}</p>
                </Link>
              );
            })}
          </div>
        </Section>
      )}

      {/* ---------------- Persistent content (all modes) ---------------- */}
      <StatsBand stats={edition.stats} />

      <Section>
        <SectionHead
          eyebrow="Compete"
          title={`${events.length} events. Start with your domain.`}
          action={<Button as={Link} href="/events" variant="ghost" size="sm">See all {events.length} →</Button>}
        />
        <div className="flex flex-wrap gap-2 mb-8">
          {tracks.map((t) => (
            <Link
              key={t.id}
              href="/events"
              className="inline-flex items-center gap-2 h-10 px-4 rounded-xs bg-surface border border-line text-[14px] text-ink-2 hover:border-magenta hover:text-ink transition-colors"
            >
              {t.name}
              <span className="text-ink-3 tabular-nums text-[13px]">{trackCounts[t.id] || 0}</span>
            </Link>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {featured.map((e) => <EventCard key={e.id} event={e} />)}
        </div>
      </Section>

      {mode === "pre" && (
        <Section className="border-t border-line">
          <SectionHead eyebrow="Why come" title="What you get out of it" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              ["₹18L+ prize pool", "Across 54 events spanning management, sports and culture."],
              ["A national peer group", "150+ institutions, including the IIMs, XLRI, SP Jain and the IITs."],
              ["Recruiter-facing work", "Case competitions judged by practising consultants and industry leaders."],
              ["Three nights of it", "Pro nights on the Central Lawn to close out every day."],
            ].map(([h, b], i) => (
              <Reveal key={h} delay={i * 0.05}>
                <h3 className="font-display text-[19px] font-bold mb-2">{h}</h3>
                <p className="text-[15px] text-ink-2 leading-relaxed">{b}</p>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      <Section className="border-t border-line">
        <SectionHead
          eyebrow={mode === "post" ? "That was" : "Pro Nights"}
          title={mode === "post" ? "The nights" : "Three nights on the Central Lawn"}
          action={<Button as={Link} href="/pro-nights" variant="ghost" size="sm">Details →</Button>}
        />
        <div className="grid sm:grid-cols-3 gap-4">
          {proNights.map((p, i) => {
            const img = PRO_NIGHT_IMAGES[i % PRO_NIGHT_IMAGES.length];
            return (
              <Reveal key={p.day} delay={i * 0.06}>
                <div className="group relative rounded-lg overflow-hidden h-[220px] border border-line">
                  <Image src={img.src} alt="" fill sizes="(min-width:640px) 33vw, 100vw" className="object-cover transition-transform duration-500 ease-imp group-hover:scale-[1.06]" />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-bg/10" />
                  <div className="relative h-full flex flex-col justify-end p-6">
                    <div className="text-[11px] uppercase tracking-[0.12em] text-magenta font-bold mb-2">{p.day}</div>
                    <h3 className="font-display text-[24px] font-extrabold mb-1.5 leading-tight">{p.act}</h3>
                    <p className="text-[14px] text-ink-2">{p.type} · {p.time}</p>
                    <p className="text-[13px] text-ink-3 mt-0.5">{p.venue}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <Section className="border-t border-line">
        <SectionHead
          eyebrow="Partners"
          title={mode === "post" ? "Who made it happen" : "Our partners"}
          action={<Button as={Link} href="/partner" variant="ghost" size="sm">Partner with us →</Button>}
        />
        <SponsorWall sponsors={sponsors} />
      </Section>

      {mode === "pre" && (
        <Section className="border-t border-line">
          <div className="bg-surface border border-line rounded-xl p-8 lg:p-12 text-center">
            <h2 className="font-display text-[28px] sm:text-[36px] font-extrabold mb-3 leading-tight">
              Pick your events. Bring your team.
            </h2>
            <p className="text-ink-2 max-w-prose mx-auto mb-7">
              Registration is open across all 54 events. Filter down to the ones that actually fit you in about two taps.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button as={Link} href="/events" size="lg">Explore events</Button>
              <Button as={Link} href="/pass" variant="secondary" size="lg">Get your Pass</Button>
            </div>
          </div>
        </Section>
      )}
    </>
  );
}

/* ------------------------------- Heroes -------------------------------- */
function PreHero() {
  const { edition, events } = useImperium();
  return (
    <div className="relative overflow-hidden border-b border-line min-h-[520px] flex items-center">
      <HeroPhoto {...HERO_IMAGES.pre} tint="magenta" priority />
      <SynapseField className="absolute inset-0 w-full h-full opacity-70" />
      <div className="relative max-w-shell mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-24 lg:py-28 w-full">
        <Reveal>
          <div className="text-[11px] sm:text-[13px] uppercase tracking-[0.18em] text-ink-2 font-semibold mb-5">
            {edition.tagline}
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <h1 className="font-display text-[52px] sm:text-[80px] lg:text-[104px] font-extrabold leading-[0.92] tracking-tight mb-5">
            IMPERIUM
            <span className="text-magenta">&apos;26</span>
          </h1>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="text-[18px] sm:text-[22px] text-ink font-medium mb-2">30 January – 1 February 2026 · MDI Gurgaon</p>
          <p className="text-[16px] text-ink-2 max-w-prose mb-8">
            {edition.theme}. {events.length} events across management, sports and culture.
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <div className="flex flex-wrap gap-3 mb-10">
            <Button as={Link} href="/events" size="lg">Explore Events</Button>
            <Button as={Link} href="/partner" variant="secondary" size="lg">Partner With Us</Button>
          </div>
        </Reveal>
        <Reveal delay={0.24}>
          <Countdown target={edition.startDate} />
        </Reveal>
      </div>
    </div>
  );
}

function LiveHero() {
  const { events, now } = useImperium();
  const live = events.filter((e) => now >= eventStart(e) && now <= eventEnd(e)).length;
  return (
    <div className="border-b border-line bg-surface/50">
      <div className="max-w-shell mx-auto px-4 sm:px-6 lg:px-12 py-5 flex items-center gap-4 flex-wrap">
        <span className="flex items-center gap-2.5">
          <span aria-hidden="true" className="w-2.5 h-2.5 rounded-full bg-magenta animate-pulseDot" />
          <span className="font-display text-[22px] sm:text-[26px] font-extrabold">LIVE NOW</span>
        </span>
        <span className="text-ink-2 text-[15px]">Day 2 of 3 · Saturday 31 January</span>
        <span className="ml-auto text-[13px] text-ink-3 tabular-nums">
          {live} event{live === 1 ? "" : "s"} running · updated just now
        </span>
      </div>
    </div>
  );
}

function PostHero() {
  const { edition } = useImperium();
  return (
    <div className="relative overflow-hidden border-b border-line min-h-[420px] flex items-center">
      <HeroPhoto {...HERO_IMAGES.post} tint="gold" priority />
      <SynapseField className="absolute inset-0 w-full h-full opacity-60" nodeColor="#F5C542" />
      <div className="relative max-w-shell mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-20 w-full">
        <Reveal>
          <div className="text-[11px] uppercase tracking-[0.18em] text-results font-semibold mb-4">That&apos;s a wrap</div>
          <h1 className="font-display text-[40px] sm:text-[64px] font-extrabold leading-[0.95] mb-4">
            Imperium&apos;26 <span className="text-ink-3">is done.</span>
          </h1>
          <p className="text-[17px] text-ink-2 max-w-prose mb-7">
            Three days, {edition.stats[4].value} events and {edition.stats[3].value} institutions. Every result is
            published and stays here permanently.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button as={Link} href="/results" size="lg">View Results</Button>
            <Button as={Link} href="/about#gallery" variant="secondary" size="lg">Gallery</Button>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* ------------------------------ Stats band ----------------------------- */
function StatsBand({ stats }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.isIntersecting && setSeen(true)),
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);

  return (
    <div ref={ref} className="border-y border-line bg-surface/40">
      <div className="max-w-shell mx-auto px-4 sm:px-6 lg:px-12 py-10">
        <dl className="grid grid-cols-2 lg:grid-cols-6 gap-6 lg:gap-4">
          {stats.map((s) => (
            <div key={s.label}>
              <dd className={`font-display text-[30px] sm:text-[36px] font-extrabold tabular-nums leading-none mb-1.5 transition-opacity duration-500 ${seen ? "opacity-100" : "opacity-0"}`}>
                {s.value}
              </dd>
              <dt className="text-[12px] sm:text-[13px] text-ink-3 leading-snug">{s.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

/* ------------------------------- Countdown ----------------------------- */
function Countdown({ target }) {
  const { now } = useImperium();
  const diff = Math.max(0, new Date(target) - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const parts = [[d, "Days"], [h, "Hours"], [m, "Minutes"]];
  return (
    <div className="inline-flex gap-3">
      {parts.map(([v, l]) => (
        <div key={l} className="bg-surface border border-line rounded-md px-5 py-3 min-w-[84px] text-center">
          <div className="font-display text-[28px] font-extrabold tabular-nums leading-none">{String(v).padStart(2, "0")}</div>
          <div className="text-[11px] uppercase tracking-[0.1em] text-ink-3 mt-1.5">{l}</div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------ Sponsor wall --------------------------- */
export function SponsorWall({ sponsors }) {
  const tiers = ["Title Partner", "Powered By", "Associate Partner", "Category Partner", "Event Partner", "In-kind Partner"];
  const sizes = {
    "Title Partner": "text-[26px] sm:text-[32px]",
    "Powered By": "text-[22px] sm:text-[26px]",
    "Associate Partner": "text-[19px] sm:text-[22px]",
    "Category Partner": "text-[17px]",
    "Event Partner": "text-[16px]",
    "In-kind Partner": "text-[15px]",
  };
  return (
    <div className="space-y-8">
      {tiers.map((tier) => {
        const group = sponsors.filter((s) => s.tier === tier);
        if (!group.length) return null;
        return (
          <div key={tier}>
            <div className="text-[11px] uppercase tracking-[0.12em] text-ink-3 font-semibold mb-3">{tier}</div>
            <div className="flex flex-wrap gap-3">
              {group.map((s) => {
                const inner = (
                  <span className={`font-display font-extrabold ${sizes[tier]} text-ink group-hover:text-magenta transition-colors`}>
                    {s.name}
                  </span>
                );
                return s.website ? (
                  <a
                    key={s.id}
                    href={s.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-surface border border-line rounded-md px-6 py-5 hover:border-line-strong flex items-center min-h-[64px]"
                  >
                    {inner}
                  </a>
                ) : (
                  <div key={s.id} className="group bg-surface border border-line rounded-md px-6 py-5 flex items-center min-h-[64px]">
                    {inner}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      <p className="text-[12px] text-ink-dis">
        Partner names are those identifiable on the current Imperium site. Tier assignments are illustrative.
      </p>
    </div>
  );
}
