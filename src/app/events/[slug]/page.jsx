"use client";

import { useState } from "react";
import Link from "next/link";
import { useImperium } from "@/context/ImperiumContext";
import { EventCard } from "@/components/blocks";
import { Button, StatusChip, TrackChip, Modal, EmptyState, Section, SectionHead, HeroPhoto, Reveal } from "@/components/ui";
import { trackImage } from "@/lib/media";
import {
  displayStatus, STATUS_META, trackName, venue, venueName, fmtTime, fmtMoney,
  shortDay, DAY_LABELS, downloadIcs,
} from "@/lib/derive";

export default function EventDetail({ params }) {
  const { eventBySlug, eventById, now, mode, results, resultsFor, participant, dispatch, notified, notifyMe } = useImperium();
  const [handoff, setHandoff] = useState(false);
  const [shared, setShared] = useState(false);

  const e = eventBySlug(params.slug);

  if (!e) {
    return (
      <EmptyState
        icon="⌀"
        title="This event doesn't exist"
        body="The link may be out of date."
        action={<Button as={Link} href="/events">Browse all events</Button>}
      />
    );
  }

  const status = displayStatus(e, now, mode, results);
  const meta = STATUS_META[status];
  const v = venue(e.venueId);
  const eventResults = resultsFor(e.id);
  const inMySchedule = participant && participant.eventIds.includes(e.id);
  const isNotified = notified.includes(e.id);

  const facts = [
    ["Date", DAY_LABELS[e.date] || shortDay(e.date)],
    ["Time", `${fmtTime(e.startTime)} – ${fmtTime(e.endTime)}`],
    ["Venue", venueName(e.venueId)],
    ["Format", e.format === "team" ? `Teams of ${e.teamSizeMin}–${e.teamSizeMax}` : "Individual entry"],
    ["Prize pool", e.prizeTotal > 0 ? fmtMoney(e.prizeTotal) : "Participation event"],
    ["Eligibility", e.eligibility],
  ];

  const share = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) navigator.share({ title: `${e.name} — Imperium'26`, url }).catch(() => {});
    else if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  const CTA = ({ full }) => {
    if (!e.registrationUrl) {
      return (
        <Button
          variant={isNotified ? "secondary" : "primary"}
          className={full ? "w-full" : ""}
          onClick={() => { notifyMe(e.id); dispatch({ type: "TOAST", kind: "success", msg: `We'll tell you when ${e.name} opens` }); }}
          disabled={isNotified}
        >
          {isNotified ? "✓ We'll notify you" : "Notify me when this opens"}
        </Button>
      );
    }
    if (status === "closed") return <Button variant="secondary" className={full ? "w-full" : ""} disabled>Registration closed</Button>;
    if (status === "results_out")
      return <Button as="a" href="#results" variant="secondary" className={full ? "w-full" : ""}>See results</Button>;
    if (status === "live") return <Button variant="secondary" className={full ? "w-full" : ""} disabled>Happening now</Button>;
    return <Button className={full ? "w-full" : ""} onClick={() => setHandoff(true)}>Register on Unstop →</Button>;
  };

  return (
    <>
      {/* Header */}
      <div className="relative border-b border-line overflow-hidden min-h-[280px] flex items-end">
        <HeroPhoto {...trackImage(e.trackId)} tint="magenta" priority />
        <div className="relative max-w-shell mx-auto px-4 sm:px-6 lg:px-12 py-8 lg:py-12 w-full">
          <Link href="/events" className="inline-flex items-center gap-1.5 text-[14px] text-ink-2 hover:text-ink min-h-[44px]">
            ← All events
          </Link>
          <Reveal delay={0.05}>
            <div className="flex flex-wrap items-center gap-2.5 mt-2 mb-4">
              <StatusChip status={status} />
              <TrackChip>{trackName(e.trackId)}</TrackChip>
              {e.changed && (
                <span className="inline-flex items-center h-7 px-3 rounded-xs bg-closing/[0.15] text-closing text-[11px] font-semibold uppercase tracking-[0.04em]">
                  Recently updated
                </span>
              )}
            </div>
            <h1 className="font-display text-[34px] sm:text-[44px] lg:text-[52px] font-extrabold leading-[1.05] mb-3 max-w-4xl">
              {e.name}
            </h1>
            <p className="text-[17px] text-ink-2 max-w-prose">{e.shortDescription}</p>
          </Reveal>
        </div>
      </div>

      <div className="max-w-shell mx-auto px-4 sm:px-6 lg:px-12 py-8 lg:py-12 grid lg:grid-cols-[1fr_340px] gap-10 lg:gap-14">
        {/* ---------- main column ---------- */}
        <div className="min-w-0">
          {/* key facts */}
          <dl className="grid grid-cols-2 gap-x-4 gap-y-5 pb-8 border-b border-line">
            {facts.map(([k, val]) => (
              <div key={k} className={k === "Eligibility" ? "col-span-2" : ""}>
                <dt className="text-[11px] uppercase tracking-[0.1em] text-ink-3 font-semibold mb-1">{k}</dt>
                <dd className="text-[15px] text-ink leading-snug">{val}</dd>
              </div>
            ))}
          </dl>

          {v && (
            <p className="mt-4 text-[13px] text-ink-3">
              <span className="text-ink-2">Getting there:</span> {v.building}, {v.floor} floor — {v.note}
            </p>
          )}

          {e.fullDescription && (
            <section className="mt-10">
              <h2 className="font-display text-[24px] font-bold mb-3">About this event</h2>
              <p className="text-ink-2 leading-relaxed max-w-prose">{e.fullDescription}</p>
            </section>
          )}

          <section className="mt-10">
            <h2 className="font-display text-[24px] font-bold mb-4">Format</h2>
            <ol className="space-y-3">
              {e.rounds.map((r, i) => (
                <li key={i} className="flex gap-4">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-elevated border border-line flex items-center justify-center text-[13px] font-bold text-ink-2">
                    {i + 1}
                  </span>
                  <div>
                    <div className="font-semibold text-[15px]">{r.name}</div>
                    <p className="text-[14px] text-ink-3">{r.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-[24px] font-bold mb-4">Rules</h2>
            <ul className="space-y-2.5">
              {e.rules.map((r, i) => (
                <li key={i} className="flex gap-3 text-[15px] text-ink-2">
                  <span aria-hidden="true" className="text-magenta mt-0.5">·</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </section>

          {e.criteria.length > 0 && (
            <section className="mt-10">
              <h2 className="font-display text-[24px] font-bold mb-2">Judging criteria</h2>
              <p className="text-[14px] text-ink-3 mb-5">Published in advance — you should know how you are being scored.</p>
              <div className="space-y-3.5">
                {e.criteria.map((c) => (
                  <div key={c.name}>
                    <div className="flex justify-between text-[14px] mb-1.5">
                      <span className="text-ink">{c.name}</span>
                      <span className="text-ink-3 tabular-nums">{c.weight}%</span>
                    </div>
                    <div className="h-1.5 bg-elevated rounded-full overflow-hidden">
                      <div className="h-full bg-magenta rounded-full" style={{ width: `${c.weight}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {e.prizeBreakdown.length > 0 && (
            <section className="mt-10">
              <h2 className="font-display text-[24px] font-bold mb-4">Prizes</h2>
              <ul className="divide-y divide-line border-y border-line">
                {e.prizeBreakdown.map((p) => (
                  <li key={p.position} className="flex justify-between py-3.5">
                    <span className="text-ink-2">{p.position} place</span>
                    <span className="font-semibold tabular-nums">{fmtMoney(p.amount)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {eventResults.length > 0 && (
            <section id="results" className="mt-10 scroll-mt-24">
              <h2 className="font-display text-[24px] font-bold mb-4">Results</h2>
              <ol className="space-y-2.5">
                {eventResults.map((r) => (
                  <li key={r.id} className="flex items-center gap-4 bg-surface border border-line rounded-md p-4">
                    <span className="font-display text-[22px] font-extrabold text-results w-9 shrink-0 tabular-nums">
                      {r.position}
                    </span>
                    <span>
                      <span className="block font-semibold">{r.winnerName}</span>
                      <span className="block text-[13px] text-ink-3">{r.winnerInstitution}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <section className="mt-10">
            <h2 className="font-display text-[24px] font-bold mb-4">Questions</h2>
            <div className="divide-y divide-line border-y border-line">
              {e.faqs.map((f, i) => (
                <details key={i} className="group py-4">
                  <summary className="flex justify-between items-start gap-4 cursor-pointer list-none min-h-[32px] font-medium text-[15px]">
                    {f.q}
                    <span aria-hidden="true" className="text-ink-3 group-open:rotate-45 transition-transform duration-150 shrink-0">+</span>
                  </summary>
                  <p className="mt-2.5 text-[14px] text-ink-2 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-[24px] font-bold mb-1">Who to ask</h2>
            <p className="text-[14px] text-ink-3 mb-4">Contact the person running this event, not a generic form.</p>
            <div className="bg-surface border border-line rounded-md p-4">
              <div className="font-semibold">{e.organiser.name}</div>
              <div className="text-[13px] text-ink-3 mb-2">Event coordinator</div>
              <a href={`tel:${e.organiser.phone.replace(/\s/g, "")}`} className="text-[14px] text-magenta hover:underline">
                {e.organiser.phone}
              </a>
            </div>
          </section>
        </div>

        {/* ---------- sidebar ---------- */}
        <aside className="lg:sticky lg:top-[96px] lg:self-start space-y-4">
          <div className="hidden lg:block bg-surface border border-line rounded-lg p-5">
            <CTA full />
            {e.registrationUrl && (
              <p className="mt-3 text-[13px] text-ink-3 leading-relaxed">
                Registration is handled on Unstop. You&apos;ll need an Unstop account — it takes about a minute.
              </p>
            )}
            {!e.registrationUrl && (
              <p className="mt-3 text-[13px] text-ink-3 leading-relaxed">
                This event doesn&apos;t have a registration link yet. Rather than show you a dead button, we&apos;ll tell you
                when it opens.
              </p>
            )}

            <div className="mt-4 pt-4 border-t border-line space-y-2">
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => downloadIcs(e, `${e.slug}-imperium26.ics`)}
              >
                Add to calendar
              </Button>
              <Button variant="ghost" className="w-full" onClick={share}>
                {shared ? "✓ Link copied" : "Share"}
              </Button>
              {participant && (
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => dispatch({ type: "TOGGLE_MY_EVENT", id: e.id })}
                >
                  {inMySchedule ? "− Remove from My Imperium" : "+ Add to My Imperium"}
                </Button>
              )}
            </div>
          </div>

          <div className="hidden lg:block text-[12px] text-ink-dis leading-relaxed border-l-2 border-line pl-3">
            Name, track and registration link are from the live Imperium site. Timing, venue, prize, rules and criteria
            are illustrative for this prototype.
          </div>
        </aside>
      </div>

      {/* related */}
      {e.relatedIds.length > 0 && (
        <Section className="border-t border-line">
          <SectionHead eyebrow="Keep looking" title={`More in ${trackName(e.trackId)}`} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            {e.relatedIds.map((id) => {
              const r = eventById(id);
              return r ? <EventCard key={id} event={r} /> : null;
            })}
          </div>
        </Section>
      )}

      {/* mobile sticky CTA */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-[70] bg-bg/95 backdrop-blur-md border-t border-line p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <div className="flex gap-2">
          <div className="flex-1"><CTA full /></div>
          <Button variant="secondary" onClick={() => downloadIcs(e, `${e.slug}-imperium26.ics`)} aria-label="Add to calendar">
            ⊕
          </Button>
        </div>
      </div>
      <div className="lg:hidden h-24" aria-hidden="true" />

      {/* Unstop handoff interstitial */}
      <Modal
        open={handoff}
        onClose={() => setHandoff(false)}
        title="You're heading to Unstop"
        footer={
          <>
            <Button variant="secondary" onClick={() => setHandoff(false)}>Stay here</Button>
            <Button as="a" href={e.registrationUrl} target="_blank" rel="noopener noreferrer" onClick={() => setHandoff(false)}>
              Continue to Unstop →
            </Button>
          </>
        }
      >
        <p className="text-ink-2 leading-relaxed mb-4">
          Registration for <span className="text-ink font-semibold">{e.name}</span> is handled on Unstop, which manages
          accounts, teams and submissions. We don&apos;t rebuild that.
        </p>
        <ul className="space-y-2.5 text-[14px] text-ink-2 mb-5">
          <li className="flex gap-2.5"><span className="text-magenta">1.</span> Create or sign in to your Unstop account</li>
          <li className="flex gap-2.5"><span className="text-magenta">2.</span> Register your team for this event</li>
          <li className="flex gap-2.5"><span className="text-magenta">3.</span> Come back and claim your Imperium Pass</li>
        </ul>
        <div className="bg-magenta/[0.08] border border-magenta/30 rounded-md p-4">
          <p className="text-[14px] text-ink">
            <span className="font-semibold">Why come back?</span> Your Pass gives you a personal schedule, venue
            directions and live updates during the fest. It takes about 20 seconds and needs no password.
          </p>
        </div>
      </Modal>
    </>
  );
}
