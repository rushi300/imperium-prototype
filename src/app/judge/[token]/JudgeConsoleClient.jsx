"use client";

import { useState, useMemo } from "react";
import { useImperium } from "@/context/ImperiumContext";
import { Button, Field, Textarea, Modal, EmptyState, StatusChip } from "@/components/ui";
import { venueName, fmtTime, DAY_LABELS, trackName } from "@/lib/derive";

export default function JudgeConsoleClient({ token }) {
  const { judge, judgeTeams, eventById, scorecards, submittedEvents, conflicts, dispatch } = useImperium();
  const [openEventId, setOpenEventId] = useState(null);

  if (token !== judge.token) {
    return (
      <div className="max-w-shell mx-auto px-4 py-20">
        <EmptyState
          icon="⌀"
          title="This judging link isn't valid"
          body="Judging links are single-use and sent by the organising team. Try /judge/demo for the prototype."
        />
      </div>
    );
  }

  if (openEventId) {
    return <Scorecard eventId={openEventId} onBack={() => setOpenEventId(null)} />;
  }

  return (
    <div className="max-w-[760px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="text-[11px] uppercase tracking-[0.12em] text-magenta font-semibold mb-2">Judge console</div>
      <h1 className="font-display text-[30px] sm:text-[36px] font-extrabold leading-tight mb-1">{judge.name}</h1>
      <p className="text-ink-2 mb-2">{judge.organisation}</p>
      <p className="text-[13px] text-ink-3 mb-8">
        You reached this from a link in your email. No account, no password — the link is the access.
      </p>

      <h2 className="font-display text-[22px] font-bold mb-4">Your assignments</h2>
      <div className="space-y-4">
        {judge.assignedEventIds.map((id) => {
          const e = eventById(id);
          if (!e) return null;
          const teams = judgeTeams[id] || [];
          const submitted = submittedEvents.includes(id);
          const conflicted = conflicts.includes(id);
          const card = scorecards[id] || {};
          const scored = Object.keys(card).length;

          return (
            <div key={id} className="bg-surface border border-line rounded-lg p-5">
              <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                <div>
                  <h3 className="font-display text-[21px] font-bold leading-tight">{e.name}</h3>
                  <p className="text-[13px] text-ink-3 mt-0.5">{trackName(e.trackId)}</p>
                </div>
                {submitted ? (
                  <span className="inline-flex items-center h-7 px-3 rounded-xs bg-open/[0.12] text-open text-[11px] font-semibold uppercase tracking-[0.04em]">
                    Submitted
                  </span>
                ) : (
                  <span className="inline-flex items-center h-7 px-3 rounded-xs bg-closing/[0.12] text-closing text-[11px] font-semibold uppercase tracking-[0.04em]">
                    Ready to score
                  </span>
                )}
              </div>

              <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-line mb-4">
                {[
                  ["Day", (DAY_LABELS[e.date] || "").split("·")[1] || e.date],
                  ["Time", fmtTime(e.startTime)],
                  ["Venue", venueName(e.venueId)],
                  ["Teams", teams.length],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-[11px] uppercase tracking-[0.08em] text-ink-3 font-semibold mb-0.5">{k}</dt>
                    <dd className="text-[14px]">{v}</dd>
                  </div>
                ))}
              </dl>

              {e.criteria.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-[13px] font-semibold text-ink-2 mb-2">Judging criteria</h4>
                  <ul className="flex flex-wrap gap-2">
                    {e.criteria.map((c) => (
                      <li key={c.name} className="text-[13px] bg-elevated rounded-xs px-2.5 py-1 text-ink-2">
                        {c.name} <span className="text-ink-3 tabular-nums">{c.weight}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between gap-3 flex-wrap">
                <label className="flex items-center gap-2.5 cursor-pointer min-h-[44px]">
                  <input
                    type="checkbox"
                    checked={conflicted}
                    onChange={() => dispatch({ type: "TOGGLE_CONFLICT", eventId: id })}
                    className="w-5 h-5 accent-magenta"
                  />
                  <span className="text-[14px] text-ink-2">I have a conflict of interest</span>
                </label>

                <Button
                  onClick={() => setOpenEventId(id)}
                  disabled={conflicted}
                  variant={submitted ? "secondary" : "primary"}
                >
                  {submitted ? "View submitted scores" : scored ? `Continue scoring (${scored}/${teams.length})` : "Start scoring"}
                </Button>
              </div>

              {conflicted && (
                <p className="mt-3 text-[13px] text-closing">
                  ⚠ Declared. The organising team has been notified and will reassign this panel.
                </p>
              )}

              <p className="mt-4 pt-4 border-t border-line text-[13px] text-ink-3">
                Organiser: {e.organiser.name} · {e.organiser.phone}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------- Scorecard ----------------------------- */
function Scorecard({ eventId, onBack }) {
  const { eventById, judgeTeams, scorecards, submittedEvents, dispatch } = useImperium();
  const e = eventById(eventId);
  const teams = judgeTeams[eventId] || [];
  const locked = submittedEvents.includes(eventId);

  const [i, setI] = useState(0);
  const [review, setReview] = useState(false);
  const team = teams[i];
  const card = (scorecards[eventId] || {})[team] || { scores: {}, comment: "" };
  const criteria = e.criteria.length ? e.criteria : [{ name: "Overall", weight: 100 }];

  const totalFor = (t) => {
    const c = (scorecards[eventId] || {})[t];
    if (!c) return 0;
    return Math.round(criteria.reduce((s, cr) => s + ((c.scores[cr.name] || 0) * cr.weight) / 100, 0) * 10) / 10;
  };

  const running = totalFor(team);
  const complete = teams.filter((t) => {
    const c = (scorecards[eventId] || {})[t];
    return c && criteria.every((cr) => c.scores[cr.name] != null);
  });
  const allDone = complete.length === teams.length;

  const ranked = useMemo(
    () => teams.map((t) => ({ team: t, total: totalFor(t) })).sort((a, b) => b.total - a.total),
    [teams, scorecards, eventId]
  );

  return (
    <div className="max-w-[760px] mx-auto px-4 sm:px-6 py-8 pb-32">
      <button onClick={onBack} className="text-[14px] text-ink-2 hover:text-ink min-h-[44px] inline-flex items-center gap-1.5">
        ← Assignments
      </button>

      <div className="flex items-start justify-between gap-4 flex-wrap mt-2 mb-6">
        <div>
          <h1 className="font-display text-[26px] sm:text-[32px] font-extrabold leading-tight">{e.name}</h1>
          <p className="text-ink-3 text-[14px]">{venueName(e.venueId)} · {fmtTime(e.startTime)}</p>
        </div>
        {locked && (
          <span className="inline-flex items-center h-8 px-3 rounded-xs bg-open/[0.12] text-open text-[12px] font-semibold uppercase tracking-[0.04em]">
            🔒 Submitted and locked
          </span>
        )}
      </div>

      {/* team pager */}
      <div className="flex items-center justify-between gap-3 bg-surface border border-line rounded-md p-3 mb-5">
        <Button variant="ghost" size="sm" onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0} aria-label="Previous team">
          ←
        </Button>
        <div className="text-center min-w-0">
          <div className="text-[11px] uppercase tracking-[0.08em] text-ink-3">Team {i + 1} of {teams.length}</div>
          <div className="font-semibold truncate">{team}</div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setI(Math.min(teams.length - 1, i + 1))} disabled={i === teams.length - 1} aria-label="Next team">
          →
        </Button>
      </div>

      <div className="space-y-6">
        {criteria.map((c) => {
          const val = card.scores[c.name];
          return (
            <div key={c.name}>
              <div className="flex justify-between items-baseline mb-2">
                <label htmlFor={`c-${c.name}`} className="text-[15px] font-medium">
                  {c.name} <span className="text-ink-3 text-[13px]">({c.weight}%)</span>
                </label>
                <span className="font-display text-[20px] font-extrabold tabular-nums text-magenta">
                  {val != null ? val : "—"}<span className="text-ink-3 text-[13px] font-normal">/10</span>
                </span>
              </div>
              <input
                id={`c-${c.name}`}
                type="range"
                min="0"
                max="10"
                step="1"
                value={val != null ? val : 0}
                disabled={locked}
                onChange={(ev) =>
                  dispatch({ type: "SET_SCORE", eventId, team, criterion: c.name, value: Number(ev.target.value) })
                }
                className="w-full h-11 cursor-pointer disabled:opacity-40"
                aria-valuetext={`${val != null ? val : 0} out of 10`}
              />
              <div className="flex justify-between text-[11px] text-ink-3 -mt-1">
                <span>0</span><span>5</span><span>10</span>
              </div>
            </div>
          );
        })}

        <Field label="Comments for this team">
          <Textarea
            value={card.comment}
            disabled={locked}
            onChange={(ev) => dispatch({ type: "SET_COMMENT", eventId, team, comment: ev.target.value })}
            placeholder="What stood out, and what would have made it stronger."
          />
        </Field>
      </div>

      {/* sticky footer */}
      <div className="fixed bottom-0 inset-x-0 bg-bg/95 backdrop-blur-md border-t border-line p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] z-[70]">
        <div className="max-w-[760px] mx-auto flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-[11px] text-open flex items-center gap-1.5">
              <span aria-hidden="true">●</span> Saved automatically
            </div>
            <div className="text-[14px]">
              Weighted total{" "}
              <span className="font-display text-[19px] font-extrabold tabular-nums text-magenta">{running}</span>
              <span className="text-ink-3 text-[12px]">/10</span>
              <span className="text-ink-3 text-[13px] ml-2 tabular-nums">· {complete.length}/{teams.length} teams done</span>
            </div>
          </div>
          {locked ? (
            <Button variant="secondary" onClick={onBack}>Done</Button>
          ) : (
            <Button onClick={() => setReview(true)} disabled={!allDone}>
              Review &amp; submit
            </Button>
          )}
        </div>
      </div>

      <Modal
        open={review}
        onClose={() => setReview(false)}
        title="Review and submit"
        footer={
          <>
            <Button variant="secondary" onClick={() => setReview(false)}>Keep editing</Button>
            <Button
              onClick={() => {
                dispatch({ type: "SUBMIT_SCORES", eventId });
                setReview(false);
              }}
            >
              Submit and lock
            </Button>
          </>
        }
      >
        <p className="text-ink-2 mb-4">
          Your ranking for <span className="text-ink font-semibold">{e.name}</span>. Once submitted, scores lock and only
          the organising team can reopen them.
        </p>
        <ol className="divide-y divide-line border-y border-line">
          {ranked.map((r, k) => (
            <li key={r.team} className="flex items-center justify-between gap-3 py-3">
              <span className="flex items-center gap-3 min-w-0">
                <span className="font-display text-[18px] font-extrabold text-results w-5 tabular-nums">{k + 1}</span>
                <span className="truncate">{r.team}</span>
              </span>
              <span className="font-semibold tabular-nums">{r.total}</span>
            </li>
          ))}
        </ol>
      </Modal>
    </div>
  );
}
