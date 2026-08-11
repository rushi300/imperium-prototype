"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useImperium } from "@/context/ImperiumContext";
import { PassCard, QrGlyph, NextEventCard, ScheduleList, AnnouncementItem } from "@/components/blocks";
import { Button, Section, EmptyState, Modal, StatusChip, TrackChip } from "@/components/ui";
import {
  DAYS, DAY_LABELS, scheduleClashes, downloadIcs, trackName, displayStatus, fmtTime, venueName,
} from "@/lib/derive";

const TABS = ["Schedule", "Updates", "My events", "Results"];

export default function MyImperium() {
  const { participant, myEvents, nextEvent, now, mode, announcements, results, resultsFor, dispatch } = useImperium();
  const [tab, setTab] = useState("Schedule");
  const [qr, setQr] = useState(false);
  const [day, setDay] = useState(DAYS[1]);

  const clashes = useMemo(() => scheduleClashes(myEvents), [myEvents]);

  const relevant = useMemo(() => {
    if (!participant) return [];
    const ids = participant.eventIds;
    return announcements
      .filter((a) => !a.eventId || ids.includes(a.eventId))
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  }, [announcements, participant]);

  const myResults = useMemo(() => {
    if (!participant) return [];
    return myEvents
      .map((e) => ({ event: e, rows: resultsFor(e.id) }))
      .filter((x) => x.rows.length);
  }, [myEvents, participant, resultsFor]);

  if (!participant) {
    return (
      <Section>
        <EmptyState
          icon="◎"
          title="You don't have an Imperium Pass yet"
          body="The Pass gives you a personal schedule, venue directions and live updates during the fest. It takes about twenty seconds and needs no password."
          action={<Button as={Link} href="/pass">Get your Pass</Button>}
        />
      </Section>
    );
  }

  const dayEvents = myEvents.filter((e) => e.date === day);
  const unread = relevant.filter((a) => !(participant.readAnnouncements || []).includes(a.id)).length;

  return (
    <Section>
      <div className="grid lg:grid-cols-[400px_1fr] gap-8 lg:gap-12 items-start">
        {/* left column */}
        <div className="space-y-4 lg:sticky lg:top-[96px]">
          <PassCard participant={participant} onExpandQr={() => setQr(true)} />

          {nextEvent && mode !== "post" && <NextEventCard event={nextEvent} now={now} />}

          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={() => downloadIcs(myEvents, "my-imperium26.ics")}>
              Add all to calendar
            </Button>
            <Button variant="ghost" onClick={() => dispatch({ type: "DROP_PASS" })}>Sign out</Button>
          </div>

          {clashes.length > 0 && (
            <div className="border border-closing/50 bg-closing/[0.07] rounded-md p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <span aria-hidden="true" className="text-closing">⚠</span>
                <h2 className="font-semibold text-[15px] text-closing">
                  {clashes.length} scheduling clash{clashes.length > 1 ? "es" : ""}
                </h2>
              </div>
              {clashes.map(([a, b], i) => (
                <p key={i} className="text-[14px] text-ink-2 leading-relaxed">
                  <span className="text-ink">{a.name}</span> and <span className="text-ink">{b.name}</span> overlap on{" "}
                  {DAY_LABELS[a.date].split("·")[1].trim()}.
                </p>
              ))}
              <p className="text-[13px] text-ink-3 mt-2">You&apos;ll need to pick one, or arrive late to the second.</p>
            </div>
          )}
        </div>

        {/* right column */}
        <div className="min-w-0">
          <div className="flex gap-1 border-b border-line mb-6 overflow-x-auto no-scrollbar" role="tablist">
            {TABS.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`relative px-4 min-h-[48px] text-[15px] whitespace-nowrap transition-colors ${
                  tab === t ? "text-ink font-medium" : "text-ink-3 hover:text-ink-2"
                }`}
              >
                {t}
                {t === "Updates" && unread > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-magenta text-white text-[11px] font-bold tabular-nums">
                    {unread}
                  </span>
                )}
                {tab === t && <span aria-hidden="true" className="absolute bottom-0 left-3 right-3 h-0.5 bg-magenta rounded-full" />}
              </button>
            ))}
          </div>

          {tab === "Schedule" && (
            <>
              <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar">
                {DAYS.map((d) => {
                  const n = myEvents.filter((e) => e.date === d).length;
                  return (
                    <button
                      key={d}
                      onClick={() => setDay(d)}
                      aria-pressed={day === d}
                      className={`min-h-[44px] px-4 rounded-xs text-[14px] whitespace-nowrap border transition-colors ${
                        day === d ? "bg-magenta/[0.12] border-magenta text-magenta font-medium" : "bg-surface border-line text-ink-2"
                      }`}
                    >
                      {DAY_LABELS[d]} <span className="text-ink-3 tabular-nums">{n}</span>
                    </button>
                  );
                })}
              </div>
              <ScheduleList events={dayEvents} highlightClashes allMine={myEvents} />
            </>
          )}

          {tab === "Updates" && (
            <div className="space-y-3">
              {relevant.length ? (
                relevant.map((a) => (
                  <div key={a.id} onMouseEnter={() => dispatch({ type: "MARK_READ", id: a.id })}>
                    <AnnouncementItem announcement={a} />
                  </div>
                ))
              ) : (
                <EmptyState title="Nothing new right now" body="Announcements that affect your events will show up here." />
              )}
            </div>
          )}

          {tab === "My events" && (
            <div className="space-y-3">
              {myEvents.map((e) => {
                const rows = resultsFor(e.id);
                const mine = rows.find((r) => r.winnerInstitution === participant.institution);
                return (
                  <div key={e.id} className="bg-surface border border-line rounded-md p-4">
                    <div className="flex items-start justify-between gap-3 flex-wrap mb-2.5">
                      <StatusChip status={displayStatus(e, now, mode, results)} />
                      <TrackChip>{trackName(e.trackId)}</TrackChip>
                    </div>
                    <Link href={`/events/${e.slug}`} className="font-display text-[18px] font-bold hover:text-magenta">
                      {e.name}
                    </Link>
                    <p className="text-[13px] text-ink-3 mt-1">
                      {DAY_LABELS[e.date]} · {fmtTime(e.startTime)} · {venueName(e.venueId)}
                    </p>
                    <div className="mt-3 pt-3 border-t border-line flex items-center justify-between gap-3 flex-wrap">
                      <span className="text-[14px] text-ink-2">
                        {mine ? (
                          <span className="text-results font-semibold">🏆 You placed {mine.position === 1 ? "1st" : mine.position === 2 ? "2nd" : "3rd"}</span>
                        ) : rows.length ? (
                          "Results declared"
                        ) : (
                          "Registered"
                        )}
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => dispatch({ type: "TOGGLE_MY_EVENT", id: e.id })}>
                        Remove
                      </Button>
                    </div>
                  </div>
                );
              })}
              {!myEvents.length && (
                <EmptyState title="You haven't added any events yet" action={<Button as={Link} href="/events">Explore events</Button>} />
              )}
            </div>
          )}

          {tab === "Results" && (
            <div className="space-y-4">
              {myResults.length ? (
                myResults.map(({ event, rows }) => (
                  <div key={event.id} className="bg-surface border border-line rounded-md p-4">
                    <h3 className="font-display text-[18px] font-bold mb-3">{event.name}</h3>
                    <ol className="space-y-2">
                      {rows.map((r) => (
                        <li key={r.id} className="flex items-center gap-3 text-[14px]">
                          <span className="font-display font-extrabold text-results w-5 tabular-nums">{r.position}</span>
                          <span className="text-ink">{r.winnerName}</span>
                          <span className="text-ink-3">{r.winnerInstitution}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))
              ) : (
                <EmptyState
                  title="No results yet"
                  body="Results appear here the moment organisers publish them — you won't have to hunt for an Instagram story."
                />
              )}
              <Button as={Link} href="/results" variant="secondary">All Imperium results →</Button>
            </div>
          )}
        </div>
      </div>

      <Modal open={qr} onClose={() => setQr(false)} title="Your Imperium Pass">
        <div className="flex flex-col items-center gap-5 py-2">
          <div className="bg-white p-5 rounded-lg">
            <QrGlyph value={participant.imperiumId} size={240} />
          </div>
          <div className="text-center">
            <div className="font-mono text-[19px] tracking-[0.08em] text-magenta mb-1">{participant.imperiumId}</div>
            <div className="font-semibold">{participant.name}</div>
            <div className="text-[14px] text-ink-3">{participant.institution}</div>
          </div>
          <p className="text-[13px] text-ink-3 text-center max-w-[340px]">
            Show this at venue entry. In production this is scanned for check-in; in the prototype it is a visual
            representation of your Imperium ID.
          </p>
        </div>
      </Modal>
    </Section>
  );
}
