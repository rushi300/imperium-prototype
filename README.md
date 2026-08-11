# Imperium — Working Prototype

A functional Next.js website built to the locked build specification. Not a set of mockups: every screen reads from
one shared data module through React Context, so an organiser edit visibly changes the participant experience.

**Thesis:** *One entry. Every surface. Every year.*

---

## Run it

```bash
npm install
npm run dev
```

Open **http://localhost:3000**.

Production build:

```bash
npm run build && npm start
```

Requires Node 18+. No database, no API keys, no environment variables, no accounts.

---

## Routes

| Route | What it is |
|---|---|
| `/` | Homepage — transforms between Pre-fest / Live / Post-fest |
| `/live` | Permanent redirect (→ `/` during the fest, → `/schedule` otherwise) |
| `/events` | Event discovery — 54 events, 5 working filters, search |
| `/events/[slug]` | Event detail — e.g. `/events/advectius`, `/events/hunger-games` |
| `/schedule` | Full 3-day schedule with track/venue filters and campus map |
| `/results` | All published results, filterable by track |
| `/pro-nights` | Pro night line-up and entry |
| `/partner` | Partner With Imperium — the sponsor-facing page |
| `/pass` | Claim the Imperium Pass |
| `/my` | My Imperium — pass, schedule, updates, events, results |
| `/admin` | Organiser console |
| `/judge/demo` | Judge console (token route; any other token is rejected) |
| `/about`, `/faq` | Standard pages |

`/admin`, `/judge` and the sponsor routes are deliberately **not** in the public navigation.

---

## Demo control

Bottom-right, styled as a dashed prototype control so it never reads as a product feature. It switches fest state
(Pre / Live / Post), loads or clears the demo participant, jumps to the organiser and judge consoles, and resets all
data.

---

## The 3-minute demo

**1. The problem (20s)**
`/events`. 54 events, real names from the live site. Note that 23 read "Opening soon" — on the real site those tiles
are dead links.

**2. Discovery — the core fix (30s)**
Filter Track = *Marketing*, Format = *Team*, Status = *Registration open*. The count drops from 54 live. Open
**MarQAd**. Every question answered on the page. Then open `/events/hunger-games` — no registration link, so it shows
**Notify me**, never a dead button.

**3. The Pass (30s)**
On any open event, hit **Register on Unstop** to see the handoff interstitial — we keep the journey, Unstop keeps the
transaction. Then Demo control → **Load demo participant**, or claim one yourself at `/pass` (three fields, no
password, no verification). Go to `/my`: Imperium ID, QR, next event, schedule. Note the **clash warning** — MarQAd and
Windfall overlap on 31 Jan.

**4. Live mode + propagation — the money shot (40s)**
Demo control → **Live**. The homepage transforms additively: Happening Now, Starting Soon, announcements, campus map.
Nothing was deleted — the normal homepage is still below. Note it works with no Pass at all.

Now open `/admin` → **Events** → search *Advectius* → **Edit** → change Venue to **Main Auditorium** and start time to
**11:30** → **Save**.

Go back to `/` and `/my`. Without any second edit:
- an announcement was auto-generated and pinned to the top
- the next-event card updated
- the schedule moved it
- the event card carries a "Changed" badge
- `/events/advectius` shows the new venue and time

**5. Scale and handover (25s)**
`/admin` → **Overview**. The alerts panel is computed live from the data and reports the real audit findings:
*6 events share a registration URL* (Product Charades ↔ Beyond 180; Zumba, VR, Dog Therapy and Silent Dance Therapy all
↔ Elemental NFT), *23 events have no registration link*, plus venue double-bookings. Open any event editor and paste a
URL another event already uses — it blocks the save and names the conflict.

Then the **edition switcher** (top right). Imperium'25 and '24 are archived and permanently readable.

**6. The other two stakeholders (20s)**
`/judge/demo` → **Advectius** → **Start scoring**. Score a team across the weighted criteria, watch the running total,
page between teams, **Review & submit** — it locks. Then `/admin` → **Results** → the judge tally is there, "Use this
ranking", **Publish**. (Switch demo mode to Live or Post first; results are hidden pre-fest because the fest has not
happened.)

`/partner` — what we can prove is separated from what we want to measure next year.

**7. Close (15s)**
Five things fixable on the live site today: remove `noindex`, fix the 6 misrouted links, resolve the 23 dead tiles,
remove the stale "Register for Pro-night — Coming Soon", correct the 2025 copyright.

---

## Architecture

```
src/data/imperium.js          single source of truth — 54 events, 10 venues, 8 sponsors, judge, results
src/context/ImperiumContext.jsx   React Context + reducer. All mutations and propagation live here
src/lib/derive.js             derived views: status, filtering, validation rules, .ics generation
src/components/               ui.jsx (primitives) · blocks.jsx (domain) · shell.jsx (nav, footer, demo bar)
src/app/                      routes
```

No backend, no database, no browser storage. State is in memory and resets on reload — deliberate for a prototype.

---

## What genuinely works

- Filters combine correctly and the count derives from the filtered array
- Search across name, track and description
- All 54 events route to their own detail page
- Unstop handoff interstitial; "Notify me" for events without a link
- **Real `.ics` download** — single event and whole schedule
- Pass claim → Imperium ID → schedule → clash detection
- Pre / Live / Post transformation across every surface
- Organiser edit → auto-announcement → propagation to five surfaces
- Duplicate-URL validation blocking a save, computed from live data
- Venue conflict warning; rule 6 fires in Live mode
- Judge scoring, weighted totals, review, submit, lock
- Result publishing → event page, `/results`, participant dashboard, card status
- Modal focus trap, Esc to close, focus restore; skip link; `prefers-reduced-motion`

## Honest limitations

1. **State is in memory.** A page reload resets everything. Persistence was out of scope and would need a backend.
2. **The QR is a deterministic glyph, not a scannable QR code.** It represents the Imperium ID visually. Adding a real
   QR library was avoidable weight for a prototype where nothing scans it.
3. **No authentication anywhere.** `/admin` and `/judge/demo` are open. Production uses magic links and a shared team
   credential.
4. **The campus map is illustrative**, not a real MDI floor plan. Static SVG is a deliberate choice — offline, instant,
   no permissions.
5. **Only 5 events have full descriptions and judging criteria** (Advectius, BizCzar, Windfall, MarQAd, AetherQuest).
   The other 49 carry track-level descriptions.
6. **Gallery images are placeholders.** No photography is reproduced.
7. **Fonts load from Google Fonts.** Offline, the display face falls back to a system sans.
8. **The demo participant's institution is fictional.** The "you placed 2nd" state on the dashboard depends on matching
   institution names, so it appears for seeded results only.

## Data provenance

**From the live site (verified):** all 54 event names, tracks and registration URLs — including the 6 genuinely
duplicated URLs and the 23 missing ones; the 8 identifiable sponsor names; the six headline statistics; team names;
past performers; contact details.

**Illustrative (not verified):** timings, venues, prize amounts and breakdowns, eligibility, rules, judging criteria,
sponsor tiers, judge and team names, results, the pro-night line-up.

This split is stated in the site footer and on the event detail sidebar. No sponsor statistic is invented.
