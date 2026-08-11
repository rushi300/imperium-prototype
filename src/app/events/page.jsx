"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useImperium } from "@/context/ImperiumContext";
import { EventCardGrid } from "@/components/blocks";
import { Button, FilterChip, Input, EmptyState, Modal, Reveal, HeroPhoto, SynapseField } from "@/components/ui";
import { filterEvents, emptyFilters, activeFilterCount, trackName, DAYS, DAY_LABELS } from "@/lib/derive";
import { HERO_IMAGES } from "@/lib/media";

const STATUS_OPTIONS = [
  ["open", "Registration open"],
  ["closing_soon", "Closing soon"],
  ["no_url", "Opening soon"],
  ["live", "Live now"],
  ["results_out", "Results out"],
];

export default function EventsPage() {
  const { events, tracks, now, mode, results } = useImperium();
  const [f, setF] = useState(emptyFilters);
  const [sheet, setSheet] = useState(false);

  const filtered = useMemo(
    () => filterEvents(events, f, now, mode, results),
    [events, f, now, mode, results]
  );

  const toggle = (key, value) =>
    setF((p) => ({
      ...p,
      [key]: p[key].includes(value) ? p[key].filter((x) => x !== value) : [...p[key], value],
    }));

  const count = activeFilterCount(f);
  const clear = () => setF(emptyFilters);

  const trackCounts = useMemo(() => {
    const m = {};
    events.forEach((e) => { m[e.trackId] = (m[e.trackId] || 0) + 1; });
    return m;
  }, [events]);

  const Filters = ({ stacked }) => (
    <div className={stacked ? "space-y-6" : "space-y-4"}>
      <FilterGroup label="Track" stacked={stacked}>
        {tracks.map((t) => (
          <FilterChip key={t.id} active={f.tracks.includes(t.id)} onClick={() => toggle("tracks", t.id)}>
            {t.name} <span className="text-ink-3 tabular-nums">{trackCounts[t.id] || 0}</span>
          </FilterChip>
        ))}
      </FilterGroup>

      <FilterGroup label="Day" stacked={stacked}>
        {DAYS.map((d) => (
          <FilterChip key={d} active={f.days.includes(d)} onClick={() => toggle("days", d)}>
            {DAY_LABELS[d]}
          </FilterChip>
        ))}
      </FilterGroup>

      <FilterGroup label="Format" stacked={stacked}>
        <FilterChip active={f.formats.includes("individual")} onClick={() => toggle("formats", "individual")}>
          Individual
        </FilterChip>
        <FilterChip active={f.formats.includes("team")} onClick={() => toggle("formats", "team")}>
          Team
        </FilterChip>
      </FilterGroup>

      <FilterGroup label="Status" stacked={stacked}>
        {STATUS_OPTIONS.map(([v, l]) => (
          <FilterChip key={v} active={f.statuses.includes(v)} onClick={() => toggle("statuses", v)}>
            {l}
          </FilterChip>
        ))}
      </FilterGroup>
    </div>
  );

  return (
    <>
      <div className="relative overflow-hidden border-b border-line">
        <HeroPhoto {...HERO_IMAGES.events} tint="magenta" priority />
        <SynapseField className="absolute inset-0 w-full h-full opacity-40" />
        <div className="relative px-4 sm:px-6 lg:px-12 pt-14 pb-10">
          <div className="max-w-shell mx-auto">
            <Reveal>
              <div className="text-[11px] uppercase tracking-[0.12em] text-magenta font-semibold mb-2">Compete</div>
              <h1 className="font-display text-[32px] sm:text-[40px] font-extrabold leading-[1.1] mb-3">
                {events.length} events. Find the {filtered.length === events.length ? "few" : filtered.length} that are yours.
              </h1>
              <p className="text-ink-2 max-w-prose">
                Filter by what you actually care about — your domain, the day you can travel, whether you have a team, and
                whether you can still enter.
              </p>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Sticky filter bar */}
      <div className="sticky top-[60px] lg:top-[72px] z-40 bg-bg/95 backdrop-blur-md border-y border-line">
        <div className="max-w-shell mx-auto px-4 sm:px-6 lg:px-12 py-3">
          <div className="flex gap-2 items-center">
            <div className="flex-1 min-w-0">
              <label htmlFor="event-search" className="sr-only">Search events by name</label>
              <Input
                id="event-search"
                type="search"
                placeholder="Search events…"
                value={f.q}
                onChange={(e) => setF((p) => ({ ...p, q: e.target.value }))}
                className="min-h-[44px]"
              />
            </div>
            <Button variant="secondary" size="md" className="lg:hidden shrink-0" onClick={() => setSheet(true)}>
              Filters{count ? ` (${count})` : ""}
            </Button>
          </div>

          <div className="hidden lg:block mt-3">
            <Filters />
          </div>

          <div className="flex items-center gap-3 mt-3 flex-wrap">
            <p className="text-[14px] text-ink-2" aria-live="polite">
              Showing <span className="text-ink font-semibold tabular-nums">{filtered.length}</span> of{" "}
              <span className="tabular-nums">{events.length}</span> events
            </p>
            {count > 0 && (
              <button onClick={clear} className="text-[14px] text-magenta hover:underline min-h-[44px] lg:min-h-0">
                Clear all filters
              </button>
            )}
          </div>

          {count > 0 && (
            <div className="flex gap-1.5 flex-wrap mt-2 lg:hidden">
              {f.tracks.map((t) => (
                <FilterChip key={t} active onClick={() => toggle("tracks", t)}>{trackName(t)}</FilterChip>
              ))}
              {f.days.map((d) => (
                <FilterChip key={d} active onClick={() => toggle("days", d)}>{DAY_LABELS[d]}</FilterChip>
              ))}
              {f.formats.map((v) => (
                <FilterChip key={v} active onClick={() => toggle("formats", v)}>{v === "team" ? "Team" : "Individual"}</FilterChip>
              ))}
              {f.statuses.map((v) => (
                <FilterChip key={v} active onClick={() => toggle("statuses", v)}>
                  {(STATUS_OPTIONS.find((s) => s[0] === v) || [, v])[1]}
                </FilterChip>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-12 py-8">
        <div className="max-w-shell mx-auto">
          <EventCardGrid
            events={filtered}
            empty={
              <EmptyState
                icon="⌕"
                title="No events match these filters"
                body="Try removing a filter — the day and format filters are the most restrictive."
                action={<Button onClick={clear}>Clear filters</Button>}
              />
            }
          />

          <p className="mt-10 text-[12px] text-ink-dis max-w-prose leading-relaxed">
            All 54 event names and tracks are taken from the live Imperium site. 23 of them have no registration link
            there — here they show as “Opening soon” with a Notify me action instead of a dead link.{" "}
            <Link href="/admin" className="text-ink-3 underline">See the organiser console</Link> for the full validation report.
          </p>
        </div>
      </div>

      <Modal open={sheet} onClose={() => setSheet(false)} title="Filter events"
        footer={
          <>
            <Button variant="secondary" onClick={clear}>Clear all</Button>
            <Button onClick={() => setSheet(false)}>Show {filtered.length} events</Button>
          </>
        }
      >
        <Filters stacked />
      </Modal>
    </>
  );
}

function FilterGroup({ label, children, stacked }) {
  return (
    <div>
      <div className={`text-[11px] uppercase tracking-[0.1em] text-ink-3 font-semibold mb-2 ${stacked ? "" : "sr-only lg:not-sr-only lg:mb-1.5"}`}>
        {label}
      </div>
      <div className={stacked ? "flex flex-wrap gap-2" : "flex gap-2 overflow-x-auto no-scrollbar pb-1"}>{children}</div>
    </div>
  );
}
