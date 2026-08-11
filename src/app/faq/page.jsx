"use client";

import { useState } from "react";
import Link from "next/link";
import { Section, SectionHead, Input, Field, EmptyState } from "@/components/ui";

const FAQS = [
  ["Registration", "How do I register for an event?", "Open the event page and use the Register button. Registration is handled on Unstop, which manages accounts, teams, submissions and payments. We link straight to the right listing."],
  ["Registration", "Why does registration happen on Unstop?", "Because Unstop already does it well and most students already have an account. Rebuilding registration and payments would add real liability and take months. We own everything either side of the transaction instead."],
  ["Registration", "An event says “Opening soon” — what does that mean?", "Its registration link is not live yet. Rather than show you a button that goes nowhere, we let you ask to be notified when it opens."],
  ["Registration", "Is there a fee?", "No. Imperium events are free to enter."],
  ["Pass", "What is the Imperium Pass?", "A personal schedule with an ID on it. It shows your next event, venue directions, live updates and your results. It takes about twenty seconds to claim and needs no password."],
  ["Pass", "Do I need a Pass to attend?", "No. The Pass is a convenience, never a ticket. Every part of this site — including everything on fest days — works without one."],
  ["Pass", "Do you verify my registration?", "No. The Pass grants no entry and pays for nothing, so there is nothing to verify. Registration itself lives on Unstop."],
  ["At the fest", "How do I know if an event is running late?", "During the fest the homepage becomes a live surface showing what is running, what starts soon, and any changes. Coordinators update status from their phones."],
  ["At the fest", "Where do I find venues?", "Every event page names its venue with a walking note, and the schedule page carries a campus map with numbered pins."],
  ["At the fest", "What happens if a venue changes?", "The organiser changes it once. Your schedule, your next-event card and the announcement feed all update, and an announcement is published automatically."],
  ["Eligibility", "Who can participate?", "Most events are open to all college students with a valid ID. Case and finance competitions are usually restricted to postgraduate students — the eligibility line on each event page is definitive."],
  ["Eligibility", "Can my team be from different colleges?", "For most team events, yes. Check the individual event page."],
];

export default function FAQPage() {
  const [q, setQ] = useState("");
  const s = q.trim().toLowerCase();
  const list = s ? FAQS.filter(([c, a, b]) => (a + b + c).toLowerCase().includes(s)) : FAQS;
  const cats = Array.from(new Set(list.map((f) => f[0])));

  return (
    <Section>
      <SectionHead eyebrow="Help" title="Questions people actually ask" />
      <div className="max-w-[420px] mb-8">
        <Field label="Search">
          <Input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. Unstop, venue, Pass" />
        </Field>
      </div>

      {cats.length ? (
        cats.map((cat) => (
          <div key={cat} className="mb-10">
            <h2 className="text-[11px] uppercase tracking-[0.12em] text-magenta font-semibold mb-3">{cat}</h2>
            <div className="divide-y divide-line border-y border-line">
              {list.filter((f) => f[0] === cat).map(([, question, answer]) => (
                <details key={question} className="group py-4">
                  <summary className="flex justify-between items-start gap-4 cursor-pointer list-none min-h-[32px] font-medium text-[16px]">
                    {question}
                    <span aria-hidden="true" className="text-ink-3 group-open:rotate-45 transition-transform shrink-0">+</span>
                  </summary>
                  <p className="mt-3 text-[15px] text-ink-2 leading-relaxed max-w-prose">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        ))
      ) : (
        <EmptyState title="Nothing matches that search" body="Try a shorter word, or email imperium@mdi.ac.in." />
      )}
    </Section>
  );
}
