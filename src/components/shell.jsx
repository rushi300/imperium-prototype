"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useImperium } from "@/context/ImperiumContext";
import { Button, Toasts } from "@/components/ui";
import { AnnouncementItem } from "@/components/blocks";

const NAV_PRE = [
  { href: "/events", label: "Compete" },
  { href: "/schedule", label: "Schedule" },
  { href: "/pro-nights", label: "Pro Nights" },
  { href: "/partner", label: "Partner" },
  { href: "/about", label: "About" },
];
const NAV_POST = [
  { href: "/events", label: "Compete" },
  { href: "/results", label: "Results" },
  { href: "/about#gallery", label: "Gallery" },
  { href: "/partner", label: "Partner" },
  { href: "/about", label: "About" },
];

export function Nav() {
  const { mode, participant } = useImperium();
  const [open, setOpen] = useState(false);
  const path = usePathname();

  const items = mode === "post" ? NAV_POST : NAV_PRE;
  const cta =
    mode === "live"
      ? { href: "/#live", label: "Happening Now" }
      : mode === "post"
      ? { href: "/results", label: "View Results" }
      : { href: "/events", label: "Explore Events" };

  return (
    <>
      <header className="sticky top-0 z-50 bg-bg/85 backdrop-blur-md border-b border-line">
        <div className="max-w-shell mx-auto px-4 sm:px-6 lg:px-12">
          <div className="h-[60px] lg:h-[72px] flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="Imperium home">
              {mode === "live" && (
                <span aria-hidden="true" className="w-2 h-2 rounded-full bg-magenta animate-pulseDot" />
              )}
              <span className="font-display text-[19px] lg:text-[21px] font-extrabold tracking-tight">IMPERIUM</span>
            </Link>

            {mode === "live" && (
              <span className="hidden sm:inline-flex items-center h-6 px-2.5 rounded-xs bg-magenta/[0.12] text-magenta text-[11px] font-semibold uppercase tracking-[0.08em]">
                Live · Day 2 of 3
              </span>
            )}

            <nav className="hidden lg:flex items-center gap-1 ml-auto" aria-label="Primary">
              {items.map((it) => {
                const active = path === it.href || (it.href !== "/" && path.startsWith(it.href.split("#")[0]));
                const emphasised =
                  (mode === "live" && it.href === "/schedule") || (mode === "post" && it.href === "/results");
                return (
                  <Link
                    key={it.href}
                    href={it.href}
                    className={`relative px-3.5 h-11 flex items-center text-[15px] transition-colors duration-150 ${
                      active || emphasised ? "text-ink font-medium" : "text-ink-2 hover:text-ink"
                    }`}
                  >
                    {it.label}
                    {active && <span aria-hidden="true" className="absolute bottom-1.5 left-3.5 right-3.5 h-0.5 bg-magenta rounded-full" />}
                  </Link>
                );
              })}
              <Button as={Link} href={cta.href} size="sm" className="ml-3">
                {cta.label}
              </Button>
            </nav>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="lg:hidden ml-auto w-11 h-11 flex items-center justify-center text-ink"
              aria-label="Open menu"
              aria-expanded={open}
            >
              <span aria-hidden="true" className="text-[22px] leading-none">☰</span>
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[90] bg-bg lg:hidden flex flex-col">
          <div className="h-[60px] px-4 flex items-center justify-between border-b border-line">
            <span className="font-display text-[19px] font-extrabold">IMPERIUM</span>
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="w-11 h-11 flex items-center justify-center text-[24px]">
              ×
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto p-4" aria-label="Mobile">
            {[...items, { href: participant ? "/my" : "/pass", label: participant ? "My Imperium" : "Get your Pass" }].map((it) => (
              <Link
                key={it.href}
                href={it.href}
                onClick={() => setOpen(false)}
                className="flex items-center min-h-[56px] px-2 text-[18px] border-b border-line text-ink"
              >
                {it.label}
              </Link>
            ))}
            <Button as={Link} href={cta.href} onClick={() => setOpen(false)} className="w-full mt-6">
              {cta.label}
            </Button>
          </nav>
        </div>
      )}
    </>
  );
}

/** Bottom tab bar — LIVE mode only, thumb-reachable, one-handed. */
export function LiveTabBar() {
  const { mode, participant } = useImperium();
  const path = usePathname();
  if (mode !== "live") return null;

  const tabs = [
    { href: "/", label: "Home", icon: "⌂" },
    { href: "/events", label: "Events", icon: "☰" },
    { href: "/schedule", label: "Schedule", icon: "◷" },
    participant ? { href: "/my", label: "My Pass", icon: "◉" } : { href: "/pass", label: "Get Pass", icon: "◎" },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-[80] bg-bg/95 backdrop-blur-md border-t border-line pb-[env(safe-area-inset-bottom)]"
      aria-label="Fest-day navigation"
    >
      <ul className="flex">
        {tabs.map((t) => {
          const active = path === t.href;
          return (
            <li key={t.href} className="flex-1">
              <Link
                href={t.href}
                className={`flex flex-col items-center justify-center gap-0.5 min-h-[60px] text-[11px] font-medium ${
                  active ? "text-magenta" : "text-ink-3"
                }`}
              >
                <span aria-hidden="true" className="text-[18px] leading-none">{t.icon}</span>
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Urgent announcement bar, pinned across every page during LIVE. */
export function UrgentBar() {
  const { mode, announcements } = useImperium();
  const [dismissed, setDismissed] = useState([]);
  if (mode !== "live") return null;
  const urgent = announcements.filter((a) => a.priority === "urgent" && !dismissed.includes(a.id));
  if (!urgent.length) return null;
  const a = urgent[0];

  return (
    <div className="bg-danger/[0.12] border-b border-danger/40">
      <div className="max-w-shell mx-auto px-4 sm:px-6 lg:px-12 py-2.5 flex items-start gap-3">
        <span aria-hidden="true" className="text-danger mt-0.5">⚠</span>
        <p className="text-[14px] text-ink flex-1">
          <span className="font-semibold">{a.title}</span>
          <span className="text-ink-2"> — {a.body}</span>
        </p>
        <button
          onClick={() => setDismissed((d) => [...d, a.id])}
          aria-label="Dismiss announcement"
          className="w-8 h-8 shrink-0 text-ink-3 hover:text-ink"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export function Footer() {
  const { edition, mode } = useImperium();
  const cols = [
    { head: "Explore", links: [["/events", "All Events"], ["/schedule", "Schedule"], ["/pro-nights", "Pro Nights"], ["/results", "Results"]] },
    { head: "Participate", links: [["/events", "Register"], ["/pass", "Get your Pass"], ["/faq", "FAQ"], ["/about", "Contact"]] },
    { head: "Partner", links: [["/partner", "Partner With Us"], ["/partner#packages", "Packages"], ["/partner#partners", "Our Partners"], ["/partner#enquiry", "Enquiry"]] },
    { head: "Imperium", links: [["/about", "About"], ["/about#team", "Team"], ["/about#gallery", "Gallery"], ["/about#editions", "Past Editions"]] },
  ];

  return (
    <footer className="border-t border-line mt-8 pb-[calc(env(safe-area-inset-bottom)+72px)] lg:pb-0">
      <div className="max-w-shell mx-auto px-4 sm:px-6 lg:px-12 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {cols.map((c) => (
            <div key={c.head}>
              <h3 className="text-[11px] uppercase tracking-[0.1em] text-ink-3 font-semibold mb-3">{c.head}</h3>
              <ul className="space-y-2">
                {c.links.map(([href, label]) => (
                  <li key={label}>
                    <Link href={href} className="text-[14px] text-ink-2 hover:text-ink inline-flex items-center min-h-[32px]">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-line flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
          <div>
            <div className="font-display text-[18px] font-extrabold mb-1.5">IMPERIUM</div>
            <p className="text-[13px] text-ink-3">{edition.venueName}</p>
            <a href="mailto:imperium@mdi.ac.in" className="text-[13px] text-ink-2 hover:text-ink">
              imperium@mdi.ac.in
            </a>
          </div>
          <div className="flex flex-col gap-2 lg:items-end">
            <div className="flex gap-4">
              <a href="https://www.instagram.com/mdi_imperium/" className="text-[13px] text-ink-2 hover:text-ink">Instagram</a>
              <a href="https://www.linkedin.com/company/imperium-mdi-gurgaon/" className="text-[13px] text-ink-2 hover:text-ink">LinkedIn</a>
              <a href="https://www.facebook.com/MDI.Imperium" className="text-[13px] text-ink-2 hover:text-ink">Facebook</a>
            </div>
            {/* Year and edition both read from the edition record — the "© 2025 under 2026 content" error cannot recur */}
            <p className="text-[13px] text-ink-3 tabular-nums">
              © {edition.year} Imperium · {edition.name} edition · {mode.toUpperCase()} mode
            </p>
          </div>
        </div>

        <p className="mt-8 text-[12px] text-ink-dis leading-relaxed max-w-prose">
          Prototype built for the Nautica recruitment task. Event names, tracks, registration links, sponsor names and
          headline statistics are taken from the live Imperium site. Timings, venues, prizes, rules and judging criteria
          are illustrative and are not verified facts.
        </p>
      </div>
    </footer>
  );
}

/** Deliberately styled as a prototype control, not a product feature. */
export function DemoBar() {
  const { mode, dispatch, participant, loadDemoParticipant } = useImperium();
  const [open, setOpen] = useState(false);
  const modes = [["pre", "Pre-fest"], ["live", "Live"], ["post", "Post-fest"]];

  return (
    <div className="fixed z-[150] right-3 bottom-3 lg:right-5 lg:bottom-5 print:hidden">
      {open ? (
        <div className="w-[268px] bg-elevated border-2 border-dashed border-magenta/60 rounded-md p-4 shadow-modal">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-magenta">Demo mode</span>
            <button onClick={() => setOpen(false)} aria-label="Collapse demo controls" className="w-7 h-7 text-ink-3 hover:text-ink">
              ×
            </button>
          </div>

          <fieldset className="mb-3">
            <legend className="text-[12px] text-ink-3 mb-1.5">Fest state</legend>
            <div className="flex gap-1.5">
              {modes.map(([m, label]) => (
                <button
                  key={m}
                  onClick={() => dispatch({ type: "SET_MODE", mode: m })}
                  aria-pressed={mode === m}
                  className={`flex-1 min-h-[36px] text-[12px] rounded-sm border transition-colors ${
                    mode === m ? "bg-magenta/[0.15] border-magenta text-magenta font-semibold" : "border-line text-ink-2 hover:border-line-strong"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mb-3">
            <div className="text-[12px] text-ink-3 mb-1.5">Imperium Pass</div>
            {participant ? (
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-open flex-1 truncate">✓ {participant.name}</span>
                <button onClick={() => dispatch({ type: "DROP_PASS" })} className="text-[12px] text-ink-3 hover:text-ink underline min-h-[32px]">
                  Clear
                </button>
              </div>
            ) : (
              <button onClick={loadDemoParticipant} className="w-full min-h-[36px] text-[12px] rounded-sm border border-line text-ink-2 hover:border-line-strong">
                Load demo participant
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-1.5 mb-3">
            <a href="/admin" className="min-h-[36px] flex items-center justify-center text-[12px] rounded-sm border border-line text-ink-2 hover:border-line-strong">
              Organiser
            </a>
            <a href="/judge/demo" className="min-h-[36px] flex items-center justify-center text-[12px] rounded-sm border border-line text-ink-2 hover:border-line-strong">
              Judge
            </a>
          </div>

          <button onClick={() => dispatch({ type: "RESET" })} className="w-full min-h-[36px] text-[12px] text-ink-3 hover:text-ink underline">
            Reset all demo data
          </button>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 min-h-[44px] px-4 rounded-full bg-elevated border-2 border-dashed border-magenta/60 text-[12px] font-bold uppercase tracking-[0.1em] text-magenta shadow-modal"
        >
          Demo · {mode}
        </button>
      )}
    </div>
  );
}

export function Shell({ children }) {
  const { toasts, dispatch } = useImperium();
  return (
    <>
      <UrgentBar />
      <Nav />
      <main id="main" className="min-h-[60vh]">{children}</main>
      <Footer />
      <LiveTabBar />
      <DemoBar />
      <Toasts toasts={toasts} onDismiss={(id) => dispatch({ type: "DISMISS_TOAST", id })} />
    </>
  );
}
