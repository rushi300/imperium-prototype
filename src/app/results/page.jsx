"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useImperium } from "@/context/ImperiumContext";
import { Section, SectionHead, FilterChip, EmptyState, TrackChip, Button } from "@/components/ui";
import { trackName, DAY_LABELS } from "@/lib/derive";

export default function ResultsPage() {
  const { events, results, tracks, editions, editionId } = useImperium();
  const [track, setTrack] = useState([]);

  const grouped = useMemo(() => {
    const ids = Array.from(new Set(results.map((r) => r.eventId)));
    return ids
      .map((id) => ({
        event: events.find((e) => e.id === id),
        rows: results.filter((r) => r.eventId === id).sort((a, b) => a.position - b.position),
      }))
      .filter((g) => g.event && (!track.length || track.includes(g.event.trackId)));
  }, [results, events, track]);

  return (
    <Section>
      <SectionHead eyebrow="Results" title="Every declared result, kept permanently" />
      <p className="text-ink-2 max-w-prose mb-8">
        Results are published from the event record, so they appear here, on the event page and in every participant&apos;s
        dashboard at the same moment. They stay in the archive after the edition closes.
      </p>

      <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-1">
        {tracks.map((t) => (
          <FilterChip
            key={t.id}
            active={track.includes(t.id)}
            onClick={() => setTrack(track.includes(t.id) ? track.filter((x) => x !== t.id) : [...track, t.id])}
          >
            {t.name}
          </FilterChip>
        ))}
      </div>

      {grouped.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {grouped.map(({ event, rows }) => (
            <div key={event.id} className="bg-surface border border-line rounded-lg p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <Link href={`/events/${event.slug}`} className="font-display text-[20px] font-bold hover:text-magenta leading-tight">
                  {event.name}
                </Link>
                <TrackChip>{trackName(event.trackId)}</TrackChip>
              </div>
              <ol className="divide-y divide-line border-t border-line">
                {rows.map((r) => (
                  <li key={r.id} className="flex items-center gap-4 py-3">
                    <span className="font-display text-[20px] font-extrabold text-results w-6 tabular-nums">{r.position}</span>
                    <span className="min-w-0">
                      <span className="block font-medium truncate">{r.winnerName}</span>
                      <span className="block text-[13px] text-ink-3">{r.winnerInstitution}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No results published yet"
          body="Results appear the moment organisers publish them from the console."
          action={<Button as={Link} href="/admin">Open the organiser console</Button>}
        />
      )}

      <div className="mt-12 pt-8 border-t border-line">
        <h2 className="font-display text-[20px] font-bold mb-3">Past editions</h2>
        <div className="flex gap-2 flex-wrap">
          {editions.map((ed) => (
            <span
              key={ed.id}
              className={`inline-flex items-center h-10 px-4 rounded-xs border text-[14px] ${
                ed.id === editionId ? "border-magenta text-magenta bg-magenta/[0.08]" : "border-line text-ink-3"
              }`}
            >
              {ed.name}
              {ed.status === "archived" && <span className="ml-2 text-[12px]">archived</span>}
            </span>
          ))}
        </div>
        <p className="text-[13px] text-ink-3 mt-3 max-w-prose">
          Every edition stays readable at its own URL. A new edition clones the structure and starts with empty content —
          nothing is ever deleted, and nothing is ever rebuilt.
        </p>
      </div>
    </Section>
  );
}
