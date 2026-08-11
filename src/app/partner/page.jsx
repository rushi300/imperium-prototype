"use client";

import { useState } from "react";
import { useImperium } from "@/context/ImperiumContext";
import { SponsorWall } from "@/app/page";
import { Button, Section, SectionHead, Field, Input, Select, Textarea, Reveal, HeroPhoto, SynapseField } from "@/components/ui";
import { fmtMoney, trackName } from "@/lib/derive";
import { HERO_IMAGES } from "@/lib/media";

const PROVEN = [
  ["11,000+", "footfall across three days"],
  ["5,000+", "registrations via Unstop"],
  ["150+", "participating institutions"],
  ["₹18L+", "prize pool"],
  ["60+", "events across three domains"],
  ["25+", "partner brands last edition"],
];

const ASPIRATIONAL = [
  "Institution mix and city-level spread of attendees",
  "Footfall per sponsored event, from QR check-in",
  "Dwell time at activation zones",
  "Attributable social impressions per partner",
  "Post-fest brand recall survey",
];

const OPPORTUNITIES = [
  ["Windfall · Elements of Delta", "finance", "Financial services, broking, fintech"],
  ["Aether · Start-up Mafia", "strategy", "Startups, VC, product companies"],
  ["MarQAd · MarQWitty", "marketing", "Consumer brands, agencies, D2C"],
  ["Advectius · BizCzar", "case", "Consulting, professional services, recruiters"],
  ["Esports: BGMI · Legends of the Worlds", "gaming", "Gaming, devices, energy drinks"],
  ["Pro Nights", "cultural", "Mass-market consumer, telecom, beverages"],
];

export default function PartnerPage() {
  const { sponsors, sponsorPackages, events } = useImperium();
  const [form, setForm] = useState({ company: "", contact: "", email: "", budget: "", interest: "", message: "" });
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState({});
  const [kit, setKit] = useState(false);

  const submit = (ev) => {
    ev.preventDefault();
    const e = {};
    if (!form.company.trim()) e.company = "We need a company name.";
    if (!form.contact.trim()) e.contact = "Who should we get back to?";
    if (!form.email.trim()) e.email = "We need an email to reply to.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "That doesn't look like an email address.";
    setErr(e);
    if (Object.keys(e).length) return;
    setSent(true);
  };

  return (
    <>
      <div className="relative overflow-hidden border-b border-line min-h-[440px] flex items-center">
        <HeroPhoto {...HERO_IMAGES.partner} tint="magenta" priority />
        <SynapseField className="absolute inset-0 w-full h-full opacity-45" />
        <div className="relative max-w-shell mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-20 w-full">
          <Reveal>
            <div className="text-[11px] uppercase tracking-[0.14em] text-magenta font-semibold mb-4">Partner with Imperium</div>
            <h1 className="font-display text-[36px] sm:text-[52px] font-extrabold leading-[1.05] mb-5 max-w-3xl">
              Not the biggest campus audience in India. The best-qualified one.
            </h1>
            <p className="text-[17px] text-ink-2 max-w-prose mb-8">
              Imperium reaches postgraduate management students from 150+ institutions, concentrated in the NCR corridor,
              entering corporate careers within twelve months. For a recruiter, a fintech or a premium consumer brand,
              that is a materially better-targeted audience than a hundred thousand undergraduates.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button as="a" href="#enquiry" size="lg">Start a conversation</Button>
              <Button variant="secondary" size="lg" onClick={() => setKit(true)}>Download the media kit</Button>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ---- What we can prove ---- */}
      <Section>
        <SectionHead eyebrow="Verified" title="What we can prove" />
        <p className="text-ink-2 max-w-prose mb-8">
          Every number below is published on Imperium&apos;s own site and drawn from the last edition. We do not inflate
          figures — a partner who catches one invented statistic is right to disregard the rest.
        </p>
        <dl className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {PROVEN.map(([v, l]) => (
            <div key={l} className="border-l-2 border-magenta pl-4">
              <dd className="font-display text-[32px] sm:text-[38px] font-extrabold tabular-nums leading-none mb-1.5">{v}</dd>
              <dt className="text-[14px] text-ink-2">{l}</dt>
            </div>
          ))}
        </dl>
        <p className="mt-8 text-[14px] text-ink-3 max-w-prose">
          Also available on request: Instagram and LinkedIn reach, website traffic, and per-event registration counts
          from Unstop.
        </p>
      </Section>

      {/* ---- What we intend to measure ---- */}
      <Section className="border-t border-line">
        <div className="bg-surface border border-line rounded-lg p-6 sm:p-8">
          <div className="text-[11px] uppercase tracking-[0.12em] text-ink-3 font-semibold mb-3">
            Not yet measured — building for Imperium&apos;27
          </div>
          <h2 className="font-display text-[24px] font-bold mb-3">What we want to be able to show you next year</h2>
          <p className="text-ink-2 max-w-prose mb-5">
            We are deliberately listing what we <em>cannot</em> currently prove. These become measurable once check-in
            and analytics are live on the platform.
          </p>
          <ul className="grid sm:grid-cols-2 gap-2.5">
            {ASPIRATIONAL.map((a) => (
              <li key={a} className="flex gap-2.5 text-[15px] text-ink-2">
                <span aria-hidden="true" className="text-ink-dis">○</span>
                {a}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ---- Packages ---- */}
      <Section id="packages" className="border-t border-line scroll-mt-20">
        <SectionHead eyebrow="Packages" title="What you can buy" />
        <p className="text-ink-2 max-w-prose mb-8">
          Inclusions are published openly. Investment is discussed on enquiry so we can build something that fits the
          brief rather than a fixed tier.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sponsorPackages.map((p, i) => (
            <div
              key={p.tier}
              className={`rounded-lg p-6 border ${i === 0 ? "bg-magenta/[0.06] border-magenta/40" : "bg-surface border-line"}`}
            >
              <h3 className="font-display text-[21px] font-bold mb-1">{p.tier}</h3>
              <p className="text-[13px] text-ink-3 mb-4">
                {p.eventAssociation ? "Includes event association" : "Fest-wide presence"}
              </p>
              <ul className="space-y-2.5">
                {p.inclusions.map((inc) => (
                  <li key={inc} className="flex gap-2.5 text-[14px] text-ink-2">
                    <span aria-hidden="true" className="text-magenta shrink-0">✓</span>
                    {inc}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Event-level opportunities ---- */}
      <Section className="border-t border-line">
        <SectionHead eyebrow="Event level" title="Buy a fit, not a logo" />
        <p className="text-ink-2 max-w-prose mb-6">
          Individual events reach specific audiences. Associating with the right one puts your brand in front of people
          already thinking about your category.
        </p>
        <div className="border border-line rounded-md overflow-hidden">
          <table className="w-full text-left">
            <caption className="sr-only">Event-level sponsorship opportunities by audience fit</caption>
            <thead>
              <tr className="bg-surface">
                {["Events", "Track", "Audience fit"].map((h) => (
                  <th key={h} scope="col" className="px-4 py-3 text-[11px] uppercase tracking-[0.08em] text-ink-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {OPPORTUNITIES.map(([names, track, fit]) => (
                <tr key={names}>
                  <td className="px-4 py-3.5 text-[14px] font-medium">{names}</td>
                  <td className="px-4 py-3.5 text-[14px] text-ink-2 whitespace-nowrap">{trackName(track)}</td>
                  <td className="px-4 py-3.5 text-[14px] text-ink-2">{fit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ---- Partners ---- */}
      <Section id="partners" className="border-t border-line scroll-mt-20">
        <SectionHead eyebrow="Track record" title="Who has partnered with us" />
        <SponsorWall sponsors={sponsors} />
      </Section>

      {/* ---- Activations ---- */}
      <Section className="border-t border-line">
        <SectionHead eyebrow="Formats" title="How brands actually show up" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            ["Sampling and stalls", "Activation zones on the Central Lawn across all three days, where footfall concentrates between events."],
            ["A branded competition", "Your brief becomes the case. Participants spend hours solving a problem you actually care about."],
            ["Judge or prize presenter", "Your leadership on stage in front of the full auditorium at the moment results are announced."],
            ["Campus branding", "Standees, backdrops and venue signage across the academic block and open-air venues."],
            ["Pro-night presence", "Stage and screen presence during the highest-attendance moments of each day."],
            ["Digital", "Named presence on the event page, in the schedule and in the post-fest results archive — permanently."],
          ].map(([h, b]) => (
            <div key={h} className="bg-surface border border-line rounded-md p-5">
              <h3 className="font-display text-[18px] font-bold mb-2">{h}</h3>
              <p className="text-[14px] text-ink-2 leading-relaxed">{b}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Enquiry ---- */}
      <Section id="enquiry" className="border-t border-line scroll-mt-20">
        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <SectionHead eyebrow="Talk to us" title="Sponsorship enquiry" />
            {sent ? (
              <div className="border border-open/40 bg-open/[0.07] rounded-md p-6">
                <h3 className="font-display text-[20px] font-bold text-open mb-2">Thanks — that&apos;s with the team</h3>
                <p className="text-ink-2 mb-4">
                  Soumya Sharma, who runs sponsorships for Imperium&apos;26, will come back to you within two working
                  days.
                </p>
                <Button variant="secondary" onClick={() => { setSent(false); setForm({ company: "", contact: "", email: "", budget: "", interest: "", message: "" }); }}>
                  Send another enquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4" noValidate>
                <Field label="Company" error={err.company}>
                  <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} error={err.company} />
                </Field>
                <Field label="Your name" error={err.contact}>
                  <Input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} error={err.contact} autoComplete="name" />
                </Field>
                <Field label="Work email" error={err.email}>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={err.email} autoComplete="email" />
                </Field>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Indicative budget">
                    <Select value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })}>
                      <option value="">Prefer not to say</option>
                      <option>Under ₹2L</option>
                      <option>₹2L – ₹5L</option>
                      <option>₹5L – ₹15L</option>
                      <option>₹15L+</option>
                      <option>In-kind</option>
                    </Select>
                  </Field>
                  <Field label="Area of interest">
                    <Select value={form.interest} onChange={(e) => setForm({ ...form, interest: e.target.value })}>
                      <option value="">Not sure yet</option>
                      <option>Title / Powered by</option>
                      <option>Event association</option>
                      <option>On-campus activation</option>
                      <option>Pro nights</option>
                      <option>Recruitment access</option>
                    </Select>
                  </Field>
                </div>
                <Field label="Anything else" hint="What are you trying to achieve? We'll build the proposal around it.">
                  <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                </Field>
                <Button type="submit">Send enquiry</Button>
              </form>
            )}
          </div>

          <div>
            <div className="bg-surface border border-line rounded-lg p-6">
              <h3 className="font-display text-[20px] font-bold mb-1">Or just call</h3>
              <p className="text-[14px] text-ink-3 mb-5">A named person, not a generic inbox.</p>
              <div className="space-y-4">
                <div>
                  <div className="font-semibold">Soumya Sharma</div>
                  <div className="text-[13px] text-ink-3 mb-1">Sponsorships, Imperium&apos;26</div>
                  <a href="mailto:imperium@mdi.ac.in" className="text-[14px] text-magenta hover:underline">imperium@mdi.ac.in</a>
                </div>
                <div className="pt-4 border-t border-line">
                  <div className="font-semibold">Anushka Arora</div>
                  <div className="text-[13px] text-ink-3 mb-1">Joint Secretary</div>
                  <a href="tel:+919654330572" className="text-[14px] text-magenta hover:underline">+91 96543 30572</a>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-surface border border-line rounded-lg p-6">
              <h3 className="font-display text-[20px] font-bold mb-2">Media kit</h3>
              <p className="text-[14px] text-ink-2 mb-4">
                Audience data, packages, past activations and event-level opportunities in one PDF.
              </p>
              <Button variant="secondary" onClick={() => setKit(true)}>Download media kit</Button>
            </div>
          </div>
        </div>
      </Section>

      {kit && <MediaKitModal onClose={() => setKit(false)} />}
    </>
  );
}

function MediaKitModal({ onClose }) {
  const [done, setDone] = useState(false);
  const [f, setF] = useState({ name: "", email: "", company: "" });
  const ok = f.name.trim() && /^\S+@\S+\.\S+$/.test(f.email) && f.company.trim();

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-bg/85 backdrop-blur-sm" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label="Download the media kit" className="relative w-full sm:max-w-[480px] bg-elevated border border-line rounded-t-xl sm:rounded-xl shadow-modal p-6">
        <button onClick={onClose} aria-label="Close" className="absolute top-3 right-3 w-11 h-11 text-ink-3 hover:text-ink text-xl">×</button>
        {done ? (
          <div className="text-center py-4">
            <h2 className="font-display text-[22px] font-bold mb-2">Media kit on its way</h2>
            <p className="text-ink-2 text-[15px] mb-5">
              In production this delivers a PDF and creates a lead for the sponsorship vertical. In the prototype, the
              capture is the point — the page becomes a lead-generation asset instead of a poster wall.
            </p>
            <Button onClick={onClose}>Close</Button>
          </div>
        ) : (
          <>
            <h2 className="font-display text-[22px] font-bold mb-1">Download the media kit</h2>
            <p className="text-ink-2 text-[14px] mb-5">Three fields, so we know who to follow up with.</p>
            <div className="space-y-4">
              <Field label="Your name"><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
              <Field label="Work email"><Input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></Field>
              <Field label="Company"><Input value={f.company} onChange={(e) => setF({ ...f, company: e.target.value })} /></Field>
              <Button className="w-full" disabled={!ok} onClick={() => setDone(true)}>Get the media kit</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
