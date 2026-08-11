"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useImperium } from "@/context/ImperiumContext";
import { Button, Field, Input, Section, EmptyState } from "@/components/ui";
import { trackName, fmtTime, shortDay, venueName, isClashing } from "@/lib/derive";

export default function PassPage() {
  const { events, participant, dispatch, loadDemoParticipant } = useImperium();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", institution: "" });
  const [picked, setPicked] = useState([]);
  const [q, setQ] = useState("");
  const [errors, setErrors] = useState({});

  const registerable = useMemo(
    () => events.filter((e) => e.registrationUrl).sort((a, b) => a.name.localeCompare(b.name)),
    [events]
  );
  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? registerable.filter((e) => e.name.toLowerCase().includes(s)) : registerable;
  }, [registerable, q]);

  const pickedEvents = picked.map((id) => events.find((e) => e.id === id)).filter(Boolean);

  if (participant) {
    return (
      <Section>
        <EmptyState
          icon="◉"
          title={`You already have a Pass, ${participant.name.split(" ")[0]}`}
          body={`Imperium ID ${participant.imperiumId}. Everything you registered for is on your dashboard.`}
          action={
            <div className="flex gap-3 justify-center flex-wrap">
              <Button as={Link} href="/my">Open My Imperium</Button>
              <Button variant="secondary" onClick={() => dispatch({ type: "DROP_PASS" })}>Start over</Button>
            </div>
          }
        />
      </Section>
    );
  }

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "We need a name to put on the Pass.";
    if (!form.email.trim()) e.email = "We need an email to send updates to.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "That doesn't look like an email address.";
    if (!form.institution.trim()) e.institution = "Which college are you coming from?";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    dispatch({
      type: "CLAIM_PASS",
      name: form.name.trim(),
      email: form.email.trim(),
      institution: form.institution.trim(),
      eventIds: picked,
    });
    router.push("/my");
  };

  return (
    <Section>
      <div className="max-w-[640px] mx-auto">
        <div className="text-[11px] uppercase tracking-[0.12em] text-magenta font-semibold mb-2">Imperium Pass</div>
        <h1 className="font-display text-[32px] sm:text-[40px] font-extrabold leading-[1.1] mb-3">
          Right now, Imperium forgets you the moment you register.
        </h1>
        <p className="text-ink-2 leading-relaxed mb-8 max-w-prose">
          The Pass is how it remembers you. It gives you a personal schedule, venue directions and live updates during
          the fest. No password, no verification, about twenty seconds.
        </p>

        <ol className="flex gap-2 mb-8" aria-label="Progress">
          {["Who you are", "What you entered"].map((label, i) => (
            <li key={label} className="flex-1">
              <div className={`h-1 rounded-full mb-2 ${step > i ? "bg-magenta" : "bg-line"}`} />
              <span className={`text-[13px] ${step > i ? "text-ink" : "text-ink-3"}`}>{label}</span>
            </li>
          ))}
        </ol>

        {step === 1 && (
          <div className="space-y-5">
            <Field label="Your name" error={errors.name}>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Riya Menon" autoComplete="name" error={errors.name} />
            </Field>
            <Field label="Email" hint="Used for schedule changes and results. Nothing else." error={errors.email}>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@college.edu" autoComplete="email" error={errors.email} />
            </Field>
            <Field label="Institution" error={errors.institution}>
              <Input value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} placeholder="SIBM Pune" autoComplete="organization" error={errors.institution} />
            </Field>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button onClick={() => validate() && setStep(2)}>Continue</Button>
              <Button variant="ghost" onClick={loadDemoParticipant}>Use the demo participant instead</Button>
            </div>

            <div className="bg-surface border border-line rounded-md p-4 mt-4">
              <p className="text-[14px] text-ink-2 leading-relaxed">
                <span className="text-ink font-semibold">We verify nothing.</span> The Pass isn&apos;t a ticket — it
                grants no entry and pays for nothing, so there is no reason to make you prove anything. Registration and
                payment stay on Unstop, where they belong.
              </p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="font-display text-[22px] font-bold mb-2">Which events did you register for?</h2>
            <p className="text-ink-2 text-[15px] mb-5">
              Pick them here and we&apos;ll build your schedule. You can change this later.
            </p>

            <Field label="Search events">
              <Input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Start typing an event name…" />
            </Field>

            <div className="mt-4 max-h-[340px] overflow-y-auto border border-line rounded-md divide-y divide-line">
              {shown.map((e) => {
                const on = picked.includes(e.id);
                const clash = on && isClashing(e, pickedEvents);
                return (
                  <label
                    key={e.id}
                    className={`flex items-start gap-3 p-3.5 cursor-pointer min-h-[56px] ${on ? "bg-magenta/[0.06]" : "hover:bg-surface"}`}
                  >
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => setPicked((p) => (p.includes(e.id) ? p.filter((x) => x !== e.id) : [...p, e.id]))}
                      className="mt-0.5 w-5 h-5 shrink-0 accent-magenta"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium text-[15px]">{e.name}</span>
                      <span className="block text-[13px] text-ink-3">
                        {trackName(e.trackId)} · {shortDay(e.date)} · {fmtTime(e.startTime)} · {venueName(e.venueId)}
                      </span>
                      {clash && (
                        <span className="block text-[13px] text-closing mt-1">⚠ Overlaps another event you picked</span>
                      )}
                    </span>
                  </label>
                );
              })}
              {!shown.length && <p className="p-6 text-center text-ink-3">No events match that search.</p>}
            </div>

            <p className="mt-3 text-[14px] text-ink-2" aria-live="polite">
              <span className="tabular-nums font-semibold text-ink">{picked.length}</span> event
              {picked.length === 1 ? "" : "s"} selected
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={submit} disabled={!picked.length}>Issue my Pass</Button>
            </div>
            {!picked.length && <p className="mt-2 text-[13px] text-ink-3">Pick at least one event so we have a schedule to build.</p>}
          </div>
        )}
      </div>
    </Section>
  );
}
