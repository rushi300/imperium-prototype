import { TRACKS, VENUES } from "@/data/imperium";

export const trackName = (id) => (TRACKS.find((t) => t.id === id) || {}).name || id;
export const venue = (id) => VENUES.find((v) => v.id === id) || null;
export const venueName = (id) => (venue(id) || {}).name || "Venue TBC";

export const DAY_LABELS = {
  "2026-01-30": "Day 1 · Fri 30 Jan",
  "2026-01-31": "Day 2 · Sat 31 Jan",
  "2026-02-01": "Day 3 · Sun 1 Feb",
};
export const DAYS = ["2026-01-30", "2026-01-31", "2026-02-01"];

export function shortDay(date) {
  const d = new Date(date + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function fmtTime(t) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ap = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${String(m).padStart(2, "0")} ${ap}`;
}

export const fmtMoney = (n) =>
  n >= 100000 ? `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L` : `₹${n.toLocaleString("en-IN")}`;

export const eventStart = (e) => new Date(`${e.date}T${e.startTime}:00`);
export const eventEnd = (e) => new Date(`${e.date}T${e.endTime}:00`);

/** The status actually shown to a user, derived from data + the current clock. */
export function displayStatus(e, now, mode, results) {
  if (!e.registrationUrl) return "no_url";
  // Results cannot exist before the fest has happened.
  const hasResult = mode !== "pre" && results && results.some((r) => r.eventId === e.id);
  if (hasResult) return "results_out";
  if (mode === "post") return "closed";
  if (mode === "live") {
    if (now >= eventStart(e) && now <= eventEnd(e)) return "live";
    if (now > eventEnd(e)) return "closed";
    return "running_later";
  }
  return e.status;
}

export const STATUS_META = {
  open: { label: "Registration open", color: "open", cta: "Register", primary: true },
  closing_soon: { label: "Closing soon", color: "closing", cta: "Register", primary: true },
  closed: { label: "Registration closed", color: "closed", cta: "Closed", primary: false },
  live: { label: "Live now", color: "live", cta: "View details", primary: false },
  results_out: { label: "Results out", color: "results", cta: "See results", primary: false },
  no_url: { label: "Opening soon", color: "closed", cta: "Notify me", primary: false },
  running_later: { label: "Later today", color: "closed", cta: "View details", primary: false },
};

/** Filtering — every count in the UI derives from this. */
export function filterEvents(events, f, now, mode, results) {
  const q = (f.q || "").trim().toLowerCase();
  return events.filter((e) => {
    if (f.tracks.length && !f.tracks.includes(e.trackId)) return false;
    if (f.days.length && !f.days.includes(e.date)) return false;
    if (f.formats.length && !f.formats.includes(e.format)) return false;
    if (f.statuses.length) {
      const s = displayStatus(e, now, mode, results);
      if (!f.statuses.includes(s)) return false;
    }
    if (q) {
      const hay = `${e.name} ${trackName(e.trackId)} ${e.shortDescription}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export const emptyFilters = { q: "", tracks: [], days: [], formats: [], statuses: [] };
export const activeFilterCount = (f) =>
  f.tracks.length + f.days.length + f.formats.length + f.statuses.length + (f.q ? 1 : 0);

/** ---- Validation rules. Derived from the live shared data, never hard-coded. ---- */
export function computeAlerts(events, now) {
  const alerts = [];

  const byUrl = {};
  events.forEach((e) => {
    if (!e.registrationUrl) return;
    (byUrl[e.registrationUrl] = byUrl[e.registrationUrl] || []).push(e);
  });
  const dupes = Object.values(byUrl).filter((g) => g.length > 1);
  if (dupes.length) {
    const pairs = [];
    dupes.forEach((g) => g.slice(1).forEach((e) => pairs.push(`${e.name} shares a link with ${g[0].name}`)));
    alerts.push({
      id: "dup-url",
      severity: "error",
      rule: "Rule 1 — a registration URL must be unique within an edition",
      title: `${pairs.length} event${pairs.length > 1 ? "s" : ""} share a registration URL with another event`,
      items: pairs,
    });
  }

  const missing = events.filter((e) => !e.registrationUrl);
  if (missing.length) {
    alerts.push({
      id: "no-url",
      severity: "warn",
      rule: "Rule 2 — an event cannot be Open without a registration URL",
      title: `${missing.length} events have no registration link`,
      items: missing.slice(0, 6).map((e) => e.name).concat(missing.length > 6 ? [`+ ${missing.length - 6} more`] : []),
      note: "These render as “Notify me” to participants, never as a dead link.",
    });
  }

  const incomplete = events.filter(
    (e) => (e.status === "open" || e.status === "closing_soon") && (!e.date || !e.venueId || !e.eligibility)
  );
  if (incomplete.length) {
    alerts.push({
      id: "incomplete",
      severity: "warn",
      rule: "Rule 3 — Open events need date, venue, eligibility and team size",
      title: `${incomplete.length} open events are missing required information`,
      items: incomplete.slice(0, 5).map((e) => e.name),
    });
  }

  const badTime = events.filter((e) => e.startTime >= e.endTime);
  if (badTime.length) {
    alerts.push({
      id: "bad-time",
      severity: "error",
      rule: "Rule 4 — end time must be after start time",
      title: `${badTime.length} events end before they start`,
      items: badTime.map((e) => e.name),
    });
  }

  const clashes = venueClashes(events);
  if (clashes.length) {
    alerts.push({
      id: "venue",
      severity: "warn",
      rule: "Rule 5 — two events cannot occupy one venue at the same time",
      title: `${clashes.length} venue double-booking${clashes.length > 1 ? "s" : ""}`,
      items: clashes.slice(0, 5).map((c) => `${c.a.name} and ${c.b.name} — ${venueName(c.a.venueId)}, ${shortDay(c.a.date)}`),
    });
  }

  const expired = now
    ? events.filter(
        (e) =>
          (e.status === "open" || e.status === "closing_soon") &&
          new Date(e.registrationDeadline + "T23:59:59") < now
      )
    : [];
  if (expired.length) {
    alerts.push({
      id: "expired",
      severity: "warn",
      rule: "Rule 6 — an Open event cannot have a registration deadline in the past",
      title: `${expired.length} events are still marked Open after their deadline`,
      items: expired.slice(0, 5).map((e) => e.name).concat(expired.length > 5 ? [`+ ${expired.length - 5} more`] : []),
      note: "This is exactly the error that left \u201cRegister for Pro-night \u2014 Coming Soon\u201d live on the current site months after the fest.",
    });
  }

  const badPrize = events.filter(
    (e) => e.prizeTotal > 0 && e.prizeBreakdown.reduce((s, p) => s + p.amount, 0) !== e.prizeTotal
  );
  if (badPrize.length) {
    alerts.push({
      id: "prize",
      severity: "warn",
      rule: "Rule 8 — the prize breakdown must sum to the total prize",
      title: `${badPrize.length} events have a prize breakdown that does not add up`,
      items: badPrize.slice(0, 5).map((e) => e.name),
    });
  }

  return alerts;
}

export function venueClashes(events) {
  const out = [];
  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      const a = events[i], b = events[j];
      if (a.venueId !== b.venueId || a.date !== b.date) continue;
      if (a.startTime < b.endTime && b.startTime < a.endTime) out.push({ a, b });
    }
  }
  return out;
}

/** Duplicate check used live inside the event editor. */
export function duplicateUrlOwner(events, url, selfId) {
  if (!url) return null;
  return events.find((e) => e.id !== selfId && e.registrationUrl === url) || null;
}

/** Personal schedule clash detection. */
export function scheduleClashes(myEvents) {
  const pairs = [];
  for (let i = 0; i < myEvents.length; i++) {
    for (let j = i + 1; j < myEvents.length; j++) {
      const a = myEvents[i], b = myEvents[j];
      if (a.date !== b.date) continue;
      if (a.startTime < b.endTime && b.startTime < a.endTime) pairs.push([a, b]);
    }
  }
  return pairs;
}

export function isClashing(e, myEvents) {
  return myEvents.some(
    (o) => o.id !== e.id && o.date === e.date && e.startTime < o.endTime && o.startTime < e.endTime
  );
}

/** ---- Real .ics generation ---- */
function icsStamp(dateStr, timeStr) {
  return `${dateStr.replace(/-/g, "")}T${timeStr.replace(":", "")}00`;
}

export function buildIcs(events) {
  const list = Array.isArray(events) ? events : [events];
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Imperium//MDI Gurgaon//EN",
    "CALSCALE:GREGORIAN",
  ];
  list.forEach((e) => {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${e.id}-imperium26@mdiimperium.com`,
      `DTSTAMP:${icsStamp("2026-01-01", "00:00")}Z`,
      `DTSTART;TZID=Asia/Kolkata:${icsStamp(e.date, e.startTime)}`,
      `DTEND;TZID=Asia/Kolkata:${icsStamp(e.date, e.endTime)}`,
      `SUMMARY:${e.name} — Imperium'26`,
      `LOCATION:${venueName(e.venueId)}, MDI Gurgaon`,
      `DESCRIPTION:${(e.shortDescription || "").replace(/,/g, "\\,")}`,
      "END:VEVENT"
    );
  });
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

export function downloadIcs(events, filename) {
  const blob = new Blob([buildIcs(events)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "imperium.ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
