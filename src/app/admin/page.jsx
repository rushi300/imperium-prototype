"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useImperium } from "@/context/ImperiumContext";
import { Button, Field, Input, Select, Textarea, Modal, StatusChip, EmptyState } from "@/components/ui";
import {
  computeAlerts, duplicateUrlOwner, trackName, venueName, fmtTime, shortDay,
  DAYS, DAY_LABELS, displayStatus,
} from "@/lib/derive";

const TABS = ["Overview", "Events", "Announcements", "Results"];

export default function AdminConsole() {
  const { events, editions, editionId, dispatch, tracks, venues, announcements, results, now, mode, judgeTeams } = useImperium();
  const [tab, setTab] = useState("Overview");
  const [editing, setEditing] = useState(null);
  const [q, setQ] = useState("");

  const alerts = useMemo(() => computeAlerts(events, now), [events, now]);
  const counts = useMemo(() => {
    const c = { open: 0, closing_soon: 0, closed: 0, no_url: 0 };
    events.forEach((e) => { c[e.status] = (c[e.status] || 0) + 1; });
    return c;
  }, [events]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? events.filter((e) => e.name.toLowerCase().includes(s)) : events;
  }, [events, q]);

  const isArchived = editionId !== "imp26";

  return (
    <div className="max-w-shell mx-auto px-4 sm:px-6 lg:px-12 py-8">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
        <div>
          <div className="text-[11px] uppercase tracking-[0.12em] text-magenta font-semibold mb-1.5">Organiser console</div>
          <h1 className="font-display text-[28px] sm:text-[34px] font-extrabold leading-tight">Imperium operations</h1>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="edition" className="text-[13px] text-ink-3">Edition</label>
          <Select
            id="edition"
            value={editionId}
            onChange={(e) => dispatch({ type: "SET_EDITION", editionId: e.target.value })}
            className="!min-h-[44px] w-[180px]"
          >
            {editions.map((ed) => (
              <option key={ed.id} value={ed.id}>
                {ed.name} {ed.status === "archived" ? "(archived)" : ""}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <p className="text-ink-3 text-[14px] mb-6">
        Prototype console — no authentication. In production this sits behind a single shared team credential.
      </p>

      {isArchived && (
        <div className="mb-6 border border-line bg-surface rounded-md p-4">
          <p className="text-[15px] text-ink-2">
            <span className="text-ink font-semibold">Imperium&apos;{editionId.slice(-2)} is archived.</span> Archived
            editions are permanently readable and never deleted. Switch back to Imperium&apos;26 to make changes — this
            is what makes a new edition a clone rather than a rebuild.
          </p>
        </div>
      )}

      <div className="flex gap-1 border-b border-line mb-6 overflow-x-auto no-scrollbar" role="tablist">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`relative px-4 min-h-[48px] text-[15px] whitespace-nowrap ${tab === t ? "text-ink font-medium" : "text-ink-3 hover:text-ink-2"}`}
          >
            {t}
            {tab === t && <span aria-hidden="true" className="absolute bottom-0 left-3 right-3 h-0.5 bg-magenta rounded-full" />}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {[
              ["Total events", events.length],
              ["Registration open", counts.open + counts.closing_soon],
              ["No registration link", counts.no_url],
              ["Registrations", events.reduce((s, e) => s + e.registrationCount, 0).toLocaleString("en-IN")],
            ].map(([l, v]) => (
              <div key={l} className="bg-surface border border-line rounded-md p-4">
                <div className="font-display text-[28px] font-extrabold tabular-nums leading-none mb-1.5">{v}</div>
                <div className="text-[13px] text-ink-3">{l}</div>
              </div>
            ))}
          </div>

          <h2 className="font-display text-[22px] font-bold mb-1">Validation alerts</h2>
          <p className="text-ink-3 text-[14px] mb-4">
            Derived live from the event data. These are the actual problems on the current Imperium site — the platform
            catches what a human editing 54 pages by hand missed.
          </p>
          <div className="space-y-3">
            {alerts.length ? alerts.map((a) => <AlertCard key={a.id} alert={a} />) : (
              <div className="border border-open/40 bg-open/[0.07] rounded-md p-4 text-[15px] text-open">
                ✓ No validation problems in this edition.
              </div>
            )}
          </div>
        </>
      )}

      {tab === "Events" && (
        <>
          <div className="mb-4 max-w-[400px]">
            <Field label="Search events">
              <Input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. Advectius" />
            </Field>
          </div>

          {/* desktop table */}
          <div className="hidden md:block border border-line rounded-md overflow-hidden">
            <table className="w-full">
              <caption className="sr-only">All events in this edition</caption>
              <thead>
                <tr className="bg-surface text-left">
                  {["Event", "Day", "Time", "Venue", "Status", ""].map((h) => (
                    <th key={h} scope="col" className="px-4 py-3 text-[11px] uppercase tracking-[0.08em] text-ink-3 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((e) => (
                  <tr key={e.id} className="hover:bg-elevated">
                    <td className="px-4 py-3">
                      <span className="font-medium">{e.name}</span>
                      <span className="block text-[12px] text-ink-3">{trackName(e.trackId)}</span>
                    </td>
                    <td className="px-4 py-3 text-[14px] text-ink-2 whitespace-nowrap">{shortDay(e.date)}</td>
                    <td className="px-4 py-3 text-[14px] text-ink-2 tabular-nums whitespace-nowrap">{fmtTime(e.startTime)}</td>
                    <td className="px-4 py-3 text-[14px] text-ink-2">{venueName(e.venueId)}</td>
                    <td className="px-4 py-3">
                      <Select
                        aria-label={`Status for ${e.name}`}
                        value={e.status}
                        onChange={(ev) => dispatch({ type: "UPDATE_EVENT", id: e.id, patch: { status: ev.target.value } })}
                        className="!min-h-[38px] !text-[13px] w-[150px]"
                      >
                        <option value="open">Open</option>
                        <option value="closing_soon">Closing soon</option>
                        <option value="closed">Closed</option>
                        <option value="no_url">Opening soon</option>
                      </Select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button size="sm" variant="secondary" onClick={() => setEditing(e)}>Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* mobile: stacked cards, never a horizontal scroll */}
          <div className="md:hidden space-y-3">
            {filtered.map((e) => (
              <div key={e.id} className="bg-surface border border-line rounded-md p-4">
                <div className="font-medium mb-1">{e.name}</div>
                <div className="text-[13px] text-ink-3 mb-3">
                  {trackName(e.trackId)} · {shortDay(e.date)} · {fmtTime(e.startTime)} · {venueName(e.venueId)}
                </div>
                <div className="flex gap-2">
                  <Select
                    aria-label={`Status for ${e.name}`}
                    value={e.status}
                    onChange={(ev) => dispatch({ type: "UPDATE_EVENT", id: e.id, patch: { status: ev.target.value } })}
                    className="!min-h-[44px] !text-[13px] flex-1"
                  >
                    <option value="open">Open</option>
                    <option value="closing_soon">Closing soon</option>
                    <option value="closed">Closed</option>
                    <option value="no_url">Opening soon</option>
                  </Select>
                  <Button size="sm" variant="secondary" onClick={() => setEditing(e)}>Edit</Button>
                </div>
              </div>
            ))}
          </div>
          {!filtered.length && <EmptyState title="No events match that search" />}
        </>
      )}

      {tab === "Announcements" && <AnnouncementComposer />}
      {tab === "Results" && <ResultsPublisher />}

      {editing && <EventEditor event={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

/* ------------------------------ Alert card ----------------------------- */
function AlertCard({ alert }) {
  const err = alert.severity === "error";
  return (
    <div className={`border rounded-md p-4 ${err ? "border-danger/50 bg-danger/[0.07]" : "border-closing/40 bg-closing/[0.06]"}`}>
      <div className="flex items-start gap-3">
        <span aria-hidden="true" className={err ? "text-danger" : "text-closing"}>⚠</span>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-[15px] mb-1">{alert.title}</h3>
          <p className="text-[12px] text-ink-3 mb-2.5">{alert.rule}</p>
          <ul className="space-y-1">
            {alert.items.map((i, k) => (
              <li key={k} className="text-[14px] text-ink-2">· {i}</li>
            ))}
          </ul>
          {alert.note && <p className="text-[13px] text-ink-3 mt-2.5">{alert.note}</p>}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- Event editor ---------------------------- */
function EventEditor({ event, onClose }) {
  const { events, venues, tracks, dispatch } = useImperium();
  const [f, setF] = useState({
    name: event.name,
    trackId: event.trackId,
    date: event.date,
    startTime: event.startTime,
    endTime: event.endTime,
    venueId: event.venueId,
    registrationUrl: event.registrationUrl || "",
    status: event.status,
    eligibility: event.eligibility,
  });

  const dupOwner = duplicateUrlOwner(events, f.registrationUrl.trim(), event.id);
  const timeBad = f.startTime >= f.endTime;
  const needsUrl = (f.status === "open" || f.status === "closing_soon") && !f.registrationUrl.trim();

  const venueBusy = events.find(
    (o) => o.id !== event.id && o.venueId === f.venueId && o.date === f.date &&
      f.startTime < o.endTime && o.startTime < f.endTime
  );

  const blocked = !!dupOwner || timeBad || needsUrl;

  const save = () => {
    if (blocked) return;
    dispatch({
      type: "UPDATE_EVENT",
      id: event.id,
      patch: { ...f, registrationUrl: f.registrationUrl.trim() || null },
    });
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={`Edit — ${event.name}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={save} disabled={blocked}>Save changes</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Event name">
          <Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Track">
            <Select value={f.trackId} onChange={(e) => setF({ ...f, trackId: e.target.value })}>
              {tracks.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </Select>
          </Field>
          <Field label="Day">
            <Select value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })}>
              {DAYS.map((d) => <option key={d} value={d}>{DAY_LABELS[d]}</option>)}
            </Select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Start time" error={timeBad ? "Must be before the end time." : null}>
            <Input type="time" value={f.startTime} onChange={(e) => setF({ ...f, startTime: e.target.value })} error={timeBad} />
          </Field>
          <Field label="End time">
            <Input type="time" value={f.endTime} onChange={(e) => setF({ ...f, endTime: e.target.value })} error={timeBad} />
          </Field>
        </div>

        <Field
          label="Venue"
          hint={venueBusy ? undefined : "Changing venue or time publishes an announcement automatically."}
          error={venueBusy ? `Warning — ${venueBusy.name} is already in ${venueName(f.venueId)} at this time.` : null}
        >
          <Select value={f.venueId} onChange={(e) => setF({ ...f, venueId: e.target.value })}>
            {venues.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
          </Select>
        </Field>

        <Field
          label="Registration URL"
          hint="Must be unique across the edition. Leave blank to show participants a Notify me action."
          error={
            dupOwner
              ? `This link is already used by "${dupOwner.name}". Two events cannot share a registration URL.`
              : needsUrl
              ? "An event cannot be Open without a registration URL."
              : null
          }
        >
          <Input
            value={f.registrationUrl}
            onChange={(e) => setF({ ...f, registrationUrl: e.target.value })}
            placeholder="https://unstop.com/…"
            error={!!dupOwner || needsUrl}
          />
        </Field>

        <Field label="Status">
          <Select value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })}>
            <option value="open">Open</option>
            <option value="closing_soon">Closing soon</option>
            <option value="closed">Closed</option>
            <option value="no_url">Opening soon</option>
          </Select>
        </Field>

        <Field label="Eligibility">
          <Textarea value={f.eligibility} onChange={(e) => setF({ ...f, eligibility: e.target.value })} />
        </Field>

        <div className="bg-magenta/[0.07] border border-magenta/30 rounded-md p-3.5">
          <p className="text-[13px] text-ink-2 leading-relaxed">
            <span className="text-ink font-semibold">One entry, every surface.</span> Saving a venue or time change
            updates the event page, the schedule, every Pass-holder&apos;s next-event card, and publishes an
            announcement to the live homepage — with no second edit anywhere.
          </p>
        </div>
      </div>
    </Modal>
  );
}

/* -------------------------- Announcement composer ---------------------- */
function AnnouncementComposer() {
  const { announcements, events, dispatch, editionId } = useImperium();
  const [f, setF] = useState({ title: "", body: "", priority: "info", eventId: "" });
  const [err, setErr] = useState({});

  const publish = () => {
    const e = {};
    if (!f.title.trim()) e.title = "Give the announcement a title.";
    if (!f.body.trim()) e.body = "Say what changed.";
    setErr(e);
    if (Object.keys(e).length) return;
    dispatch({
      type: "ADD_ANNOUNCEMENT",
      announcement: {
        editionId,
        title: f.title.trim(),
        body: f.body.trim(),
        priority: f.priority,
        eventId: f.eventId || null,
        publishedAt: new Date().toISOString(),
        autoGenerated: false,
      },
    });
    setF({ title: "", body: "", priority: "info", eventId: "" });
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div>
        <h2 className="font-display text-[22px] font-bold mb-4">Publish an announcement</h2>
        <div className="space-y-4">
          <Field label="Title" error={err.title}>
            <Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="Venue change for Colosseum" error={err.title} />
          </Field>
          <Field label="Message" error={err.body}>
            <Textarea value={f.body} onChange={(e) => setF({ ...f, body: e.target.value })} placeholder="What changed and what people should do about it." error={err.body} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Priority" hint="Urgent pins to the top of every page.">
              <Select value={f.priority} onChange={(e) => setF({ ...f, priority: e.target.value })}>
                <option value="info">Info</option>
                <option value="important">Important</option>
                <option value="urgent">Urgent</option>
              </Select>
            </Field>
            <Field label="Related event (optional)">
              <Select value={f.eventId} onChange={(e) => setF({ ...f, eventId: e.target.value })}>
                <option value="">None — fest-wide</option>
                {events.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
              </Select>
            </Field>
          </div>
          <Button onClick={publish}>Publish announcement</Button>
          <p className="text-[13px] text-ink-3">
            Publishes to the live homepage, to every relevant Pass-holder&apos;s Updates tab, and to the related event
            page.
          </p>
        </div>
      </div>

      <div>
        <h2 className="font-display text-[22px] font-bold mb-4">Published ({announcements.length})</h2>
        <ul className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
          {announcements.map((a) => (
            <li key={a.id} className="bg-surface border border-line rounded-md p-3.5">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className={`text-[10px] font-semibold uppercase tracking-[0.08em] ${a.priority === "urgent" ? "text-danger" : a.priority === "important" ? "text-closing" : "text-ink-3"}`}>
                  {a.priority}
                </span>
                {a.autoGenerated && (
                  <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-magenta border border-magenta/40 rounded-xs px-1.5">
                    Auto
                  </span>
                )}
              </div>
              <div className="font-medium text-[14px]">{a.title}</div>
              <p className="text-[13px] text-ink-3">{a.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------------------------- Results publisher ------------------------ */
function ResultsPublisher() {
  const { events, allResults, dispatch, judgeTeams, submittedEvents, scorecards, eventById, mode } = useImperium();
  const [eventId, setEventId] = useState("e7");
  const [rows, setRows] = useState([
    { position: 1, winnerName: "", winnerInstitution: "" },
    { position: 2, winnerName: "", winnerInstitution: "" },
    { position: 3, winnerName: "", winnerInstitution: "" },
  ]);

  const ev = eventById(eventId);
  const judged = submittedEvents.includes(eventId);

  const tally = useMemo(() => {
    const card = scorecards[eventId];
    if (!card) return [];
    return Object.entries(card)
      .map(([team, v]) => {
        const crit = (ev && ev.criteria.length ? ev.criteria : []);
        const total = crit.reduce((s, c) => s + ((v.scores[c.name] || 0) * c.weight) / 100, 0);
        return { team, total: Math.round(total * 10) / 10 };
      })
      .sort((a, b) => b.total - a.total);
  }, [scorecards, eventId, ev]);

  const publish = () => {
    const clean = rows.filter((r) => r.winnerName.trim());
    if (!clean.length) return;
    dispatch({ type: "PUBLISH_RESULTS", eventId, rows: clean });
  };

  const fillFromTally = () => {
    setRows(
      tally.slice(0, 3).map((t, i) => {
        const [name, inst] = t.team.split(" — ");
        return { position: i + 1, winnerName: name, winnerInstitution: inst || "" };
      })
    );
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div>
        <h2 className="font-display text-[22px] font-bold mb-4">Publish results</h2>
        <Field label="Event">
          <Select value={eventId} onChange={(e) => setEventId(e.target.value)}>
            {events.filter((e) => e.registrationUrl).map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
          </Select>
        </Field>

        {judged && tally.length > 0 && (
          <div className="mt-4 border border-open/40 bg-open/[0.07] rounded-md p-4">
            <p className="text-[14px] text-open font-semibold mb-2">✓ Judge scores submitted</p>
            <ol className="space-y-1 mb-3">
              {tally.map((t, i) => (
                <li key={t.team} className="text-[14px] text-ink-2 flex justify-between gap-3">
                  <span>{i + 1}. {t.team}</span>
                  <span className="tabular-nums text-ink">{t.total}</span>
                </li>
              ))}
            </ol>
            <Button size="sm" variant="secondary" onClick={fillFromTally}>Use this ranking</Button>
          </div>
        )}

        <div className="space-y-3 mt-5">
          {rows.map((r, i) => (
            <div key={i} className="grid grid-cols-[52px_1fr_1fr] gap-2 items-end">
              <div className="font-display text-[20px] font-extrabold text-results pb-3 text-center">{r.position}</div>
              <Field label={i === 0 ? "Team" : ""}>
                <Input
                  value={r.winnerName}
                  aria-label={`Team name for position ${r.position}`}
                  onChange={(e) => setRows(rows.map((x, k) => (k === i ? { ...x, winnerName: e.target.value } : x)))}
                />
              </Field>
              <Field label={i === 0 ? "Institution" : ""}>
                <Input
                  value={r.winnerInstitution}
                  aria-label={`Institution for position ${r.position}`}
                  onChange={(e) => setRows(rows.map((x, k) => (k === i ? { ...x, winnerInstitution: e.target.value } : x)))}
                />
              </Field>
            </div>
          ))}
        </div>

        <Button className="mt-5" onClick={publish}>Publish results</Button>
        {mode === "pre" && (
          <p className="text-[13px] text-closing mt-2.5">
            Demo note — the site is in Pre-fest mode, where results are hidden because the fest has not happened yet.
            Switch the demo control to Live or Post to see published results appear on participant surfaces.
          </p>
        )}
        <p className="text-[13px] text-ink-3 mt-2.5">
          Publishing updates the event page, the results page, every affected Pass-holder&apos;s dashboard, and sets the
          card status to Results out — in one action.
        </p>
      </div>

      <div>
        <h2 className="font-display text-[22px] font-bold mb-4">Published results</h2>
        <ul className="space-y-2.5">
          {events
            .filter((e) => allResults.some((r) => r.eventId === e.id))
            .map((e) => (
              <li key={e.id} className="bg-surface border border-line rounded-md p-4">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <Link href={`/events/${e.slug}`} className="font-medium hover:text-magenta">{e.name}</Link>
                  <StatusChip status="results_out" />
                </div>
                <ol className="space-y-1">
                  {allResults.filter((r) => r.eventId === e.id).sort((a, b) => a.position - b.position).map((r) => (
                    <li key={r.id} className="text-[13px] text-ink-2">
                      {r.position}. {r.winnerName} — {r.winnerInstitution}
                    </li>
                  ))}
                </ol>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
