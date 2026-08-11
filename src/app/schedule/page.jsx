"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useImperium } from "@/context/ImperiumContext";
import { ScheduleList, CampusMap } from "@/components/blocks";
import { Button, Section, SectionHead, FilterChip } from "@/components/ui";
import { DAYS, DAY_LABELS, eventStart, downloadIcs } from "@/lib/derive";

export default function SchedulePage() {
  const { events, mode, now, participant, myEvents, tracks, venues } = useImperium();
  const [day, setDay] = useState(mode === "live" ? "2026-01-31" : DAYS[0]);
  const [track, setTrack] = useState([]);
  const [venueF, setVenueF] = useState([]);
  const [mineOnly, setMineOnly] = useState(false);

  const list = useMemo(() => {
    let l = events.filter((e) => e.date === day);
    if (track.length) l = l.filter((e) => track.includes(e.trackId));
    if (venueF.length) l = l.filter((e) => venueF.includes(e.venueId));
    if (mineOnly && participant) l = l.filter((e) => participant.eventIds.includes(e.id));
    return l.sort((a, b) => eventStart(a) - eventStart(b));
  }, [events, day, track, venueF, mineOnly, participant]);

  const toggle = (setter, arr, v) => setter(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  return (
    <Section>
      <SectionHead
        eyebrow="Schedule"
        title="Three days, all of it in one place"
        action={
          participant ? (
            <Button variant="secondary" size="sm" onClick={() => downloadIcs(myEvents, "my-imperium26.ics")}>
              Add my events to calendar
            </Button>
          ) : null
        }
      />

      <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar">
        {DAYS.map((d) => (
          <button
            key={d}
            onClick={() => setDay(d)}
            aria-pressed={day === d}
            className={`min-h-[48px] px-5 rounded-xs text-[15px] whitespace-nowrap border transition-colors ${
              day === d ? "bg-magenta/[0.12] border-magenta text-magenta font-medium" : "bg-surface border-line text-ink-2 hover:border-line-strong"
            }`}
          >
            {DAY_LABELS[d]}
            <span className="ml-2 text-ink-3 tabular-nums text-[13px]">
              {events.filter((e) => e.date === d).length}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {participant && (
            <FilterChip active={mineOnly} onClick={() => setMineOnly(!mineOnly)}>Only my events</FilterChip>
          )}
          {tracks.map((t) => (
            <FilterChip key={t.id} active={track.includes(t.id)} onClick={() => toggle(setTrack, track, t.id)}>
              {t.name}
            </FilterChip>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {venues.map((v) => (
            <FilterChip key={v.id} active={venueF.includes(v.id)} onClick={() => toggle(setVenueF, venueF, v.id)}>
              {v.name}
            </FilterChip>
          ))}
        </div>
      </div>

      <p className="text-[14px] text-ink-2 mb-4" aria-live="polite">
        <span className="text-ink font-semibold tabular-nums">{list.length}</span> events on this day
      </p>

      <ScheduleList events={list} highlightClashes={mineOnly} allMine={myEvents} />

      <div className="mt-12">
        <SectionHead eyebrow="Where things are" title="Campus map" />
        <CampusMap />
      </div>
    </Section>
  );
}
