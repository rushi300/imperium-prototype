"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { STATUS_META } from "@/lib/derive";

/* -------------------------------- Reveal -------------------------------- */
/** Scroll-triggered fade + rise. Wrap any block that should announce itself once, on the way in. */
export function Reveal({ children, delay = 0, y = 18, className = "", as = "div" }) {
  const Comp = motion[as] || motion.div;
  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-64px" }}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </Comp>
  );
}

/* ------------------------------ Hero photo ------------------------------ */
/** Full-bleed photo + scrim, used behind every hero. tint picks the gradient wash. */
export function HeroPhoto({ src, alt, tint = "magenta", priority = false }) {
  const tints = {
    magenta: "from-bg via-bg/70 to-magenta/[0.18]",
    gold: "from-bg via-bg/75 to-results/[0.14]",
    flame: "from-bg via-bg/75 to-flame/[0.16]",
    blue: "from-bg via-bg/75 to-live/[0.16]",
  };
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <Image
        src={src}
        alt={alt || ""}
        fill
        priority={priority}
        sizes="100vw"
        className="hero-photo object-cover opacity-[0.55]"
      />
      <div className={`absolute inset-0 bg-gradient-to-t ${tints[tint] || tints.magenta}`} />
      <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/30 to-transparent" />
    </div>
  );
}

/* ----------------------------- Synapse field ----------------------------- */
/** The fest's signature motif — pulsing nodes on connecting lines, evoking "The Sixth Synapse". */
export function SynapseField({ className = "", nodeColor = "#FF2D77" }) {
  const nodes = [
    [60, 60], [220, 40], [370, 110], [140, 160], [300, 220],
    [470, 60], [430, 200], [40, 240], [200, 280], [500, 260],
  ];
  const edges = [
    [0, 1], [1, 2], [1, 3], [3, 4], [2, 5], [2, 6], [4, 6], [3, 7], [4, 8], [6, 9], [0, 3], [7, 8],
  ];
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 540 320"
      className={`synapse-field ${className}`}
      preserveAspectRatio="xMidYMid slice"
    >
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}
          stroke={nodeColor} strokeOpacity="0.18" strokeWidth="1"
        />
      ))}
      {nodes.map(([x, y], i) => (
        <circle
          key={i}
          cx={x} cy={y} r={i % 3 === 0 ? 3.5 : 2.5}
          fill={nodeColor}
          className="synapse-node"
          style={{ "--syn-min": 0.2, "--syn-max": 0.8, animationDelay: `${(i * 0.37).toFixed(2)}s` }}
        />
      ))}
    </svg>
  );
}

/* ----------------------------- Initials avatar --------------------------- */
const AVATAR_HUES = ["#FF2D77", "#60A5FA", "#F5C542", "#FF8A3D", "#34D399"];
export function InitialsAvatar({ name, size = 44, className = "" }) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  const color = AVATAR_HUES[h % AVATAR_HUES.length];
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center justify-center rounded-full font-display font-extrabold shrink-0 ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.38, background: `${color}26`, color }}
    >
      {initials}
    </span>
  );
}

/* ------------------------------- Button ------------------------------- */
export function Button({ as = "button", variant = "primary", size = "md", className = "", children, ...rest }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-sm font-semibold transition-colors duration-150 ease-imp disabled:cursor-not-allowed select-none";
  const sizes = {
    md: "min-h-[44px] px-6 text-[15px]",
    sm: "min-h-[36px] px-4 text-[13px]",
    lg: "min-h-[52px] px-8 text-base",
  };
  const variants = {
    primary: "bg-magenta text-white hover:bg-magenta-h active:bg-magenta-d disabled:bg-elevated disabled:text-ink-dis",
    secondary:
      "bg-transparent border border-line-strong text-ink hover:border-magenta disabled:text-ink-dis disabled:border-line",
    ghost: "bg-transparent text-ink-2 hover:text-ink hover:bg-elevated",
    tertiary: "bg-transparent text-magenta hover:underline px-0 min-h-[44px]",
    danger: "bg-danger/15 border border-danger/40 text-danger hover:bg-danger/25",
  };
  const Comp = as;
  return (
    <Comp className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </Comp>
  );
}

/* -------------------------------- Chips -------------------------------- */
export function TrackChip({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center h-7 px-3 rounded-xs bg-elevated text-ink-2 text-[11px] font-medium uppercase tracking-[0.04em] ${className}`}
    >
      {children}
    </span>
  );
}

const STATUS_CLASS = {
  open: "bg-open/[0.12] text-open",
  closing: "bg-closing/[0.12] text-closing",
  closed: "bg-closed/[0.14] text-closed",
  live: "bg-live/[0.14] text-live",
  results: "bg-results/[0.12] text-results",
};

export function StatusChip({ status, className = "" }) {
  const meta = STATUS_META[status] || STATUS_META.closed;
  const isLive = status === "live";
  return (
    <span
      className={`inline-flex items-center gap-1.5 h-7 px-3 rounded-xs text-[11px] font-medium uppercase tracking-[0.04em] ${STATUS_CLASS[meta.color]} ${className}`}
    >
      <span
        aria-hidden="true"
        className={`w-1.5 h-1.5 rounded-full bg-current ${isLive ? "animate-pulseDot" : ""}`}
      />
      {meta.label}
    </span>
  );
}

export function FilterChip({ active, onClick, children, onClear }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xs text-[13px] font-medium whitespace-nowrap transition-colors duration-150 border ${
        active
          ? "bg-magenta/[0.12] border-magenta text-magenta"
          : "bg-surface border-line text-ink-2 hover:border-line-strong hover:text-ink"
      }`}
    >
      {children}
      {active && <span aria-hidden="true" className="text-magenta">×</span>}
    </button>
  );
}

/* ------------------------------- Sections ------------------------------ */
export function Section({ children, className = "", id }) {
  return (
    <section id={id} className={`px-4 sm:px-6 lg:px-12 py-12 sm:py-16 lg:py-24 ${className}`}>
      <div className="max-w-shell mx-auto">{children}</div>
    </section>
  );
}

export function SectionHead({ eyebrow, title, action }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6 sm:mb-8">
      <div>
        {eyebrow && (
          <div className="text-[11px] uppercase tracking-[0.12em] text-magenta font-semibold mb-2">{eyebrow}</div>
        )}
        <h2 className="font-display text-[22px] sm:text-[28px] font-bold leading-tight">{title}</h2>
      </div>
      {action}
    </div>
  );
}

/* -------------------------------- Fields ------------------------------- */
export function Field({ label, hint, error, children, id }) {
  const auto = React.useId();
  const fid = id || auto;
  const child = React.isValidElement(children)
    ? React.cloneElement(children, {
        id: fid,
        "aria-invalid": error ? "true" : undefined,
        "aria-describedby": error ? `${fid}-err` : hint ? `${fid}-hint` : undefined,
      })
    : children;
  return (
    <div className="w-full">
      <label htmlFor={fid} className="block text-[13px] text-ink-2 mb-1.5 font-medium">
        {label}
      </label>
      {child}
      {hint && !error && (
        <p id={`${fid}-hint`} className="mt-1.5 text-[13px] text-ink-3">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${fid}-err`} role="alert" className="mt-1.5 text-[13px] text-danger flex items-start gap-1.5">
          <span aria-hidden="true">⚠</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

const inputBase =
  "w-full min-h-[48px] px-3.5 bg-elevated border rounded-sm text-base text-ink placeholder:text-ink-3 transition-colors duration-150 focus:border-magenta";

export function Input({ error, className = "", ...rest }) {
  return <input className={`${inputBase} ${error ? "border-danger" : "border-line"} ${className}`} {...rest} />;
}

export function Select({ error, className = "", children, ...rest }) {
  return (
    <select className={`${inputBase} ${error ? "border-danger" : "border-line"} ${className}`} {...rest}>
      {children}
    </select>
  );
}

export function Textarea({ error, className = "", ...rest }) {
  return (
    <textarea
      className={`${inputBase} py-3 min-h-[96px] ${error ? "border-danger" : "border-line"} ${className}`}
      {...rest}
    />
  );
}

/* -------------------------------- Modal -------------------------------- */
export function Modal({ open, onClose, title, children, footer }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement;
    document.body.style.overflow = "hidden";
    const node = ref.current;
    const focusable = () =>
      node ? node.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])') : [];
    const first = focusable()[0];
    if (first) first.focus();

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const f = Array.from(focusable());
        if (!f.length) return;
        const i = f.indexOf(document.activeElement);
        if (e.shiftKey && (i <= 0)) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      if (prev && prev.focus) prev.focus();
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-bg/85 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full sm:max-w-[520px] bg-elevated border border-line rounded-t-xl sm:rounded-xl shadow-modal max-h-[90vh] overflow-y-auto animate-riseIn"
      >
        <div className="flex items-start justify-between gap-4 p-5 border-b border-line sticky top-0 bg-elevated">
          <h2 className="font-display text-[20px] font-bold leading-tight">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="w-11 h-11 -mr-2 -mt-2 flex items-center justify-center text-ink-3 hover:text-ink text-xl shrink-0"
          >
            ×
          </button>
        </div>
        <div className="p-5">{children}</div>
        {footer && <div className="p-5 pt-0 flex flex-wrap gap-3 justify-end">{footer}</div>}
      </div>
    </div>
  );
}

/* -------------------------------- Toasts ------------------------------- */
export function Toasts({ toasts, onDismiss }) {
  useEffect(() => {
    if (!toasts.length) return;
    const timers = toasts.map((t) => setTimeout(() => onDismiss(t.id), 4000));
    return () => timers.forEach(clearTimeout);
  }, [toasts, onDismiss]);

  if (!toasts.length) return null;
  const shown = toasts.slice(-3);
  return (
    <div
      className="fixed z-[200] bottom-24 sm:bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0 w-[calc(100%-2rem)] sm:w-auto sm:max-w-[380px] flex flex-col gap-2"
      role="status"
      aria-live="polite"
    >
      {shown.map((t) => (
        <div
          key={t.id}
          className="flex items-start gap-3 bg-elevated border border-line-strong rounded-md p-4 shadow-modal animate-riseIn"
        >
          <span className={`w-1 self-stretch rounded-full ${t.kind === "success" ? "bg-open" : t.kind === "error" ? "bg-danger" : "bg-live"}`} />
          <p className="text-[14px] text-ink flex-1">{t.msg}</p>
          <button onClick={() => onDismiss(t.id)} aria-label="Dismiss" className="text-ink-3 hover:text-ink w-6 h-6 shrink-0">
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------ Empty state ---------------------------- */
export function EmptyState({ icon = "○", title, body, action }) {
  return (
    <div className="text-center py-16 px-4">
      <div aria-hidden="true" className="text-[40px] text-ink-3 mb-3 leading-none">{icon}</div>
      <h3 className="font-display text-[20px] font-bold mb-2">{title}</h3>
      {body && <p className="text-ink-2 max-w-prose mx-auto mb-5">{body}</p>}
      {action}
    </div>
  );
}

/* ----------------------------- Illustrative ---------------------------- */
export function DataNote({ children }) {
  return (
    <p className="text-[12px] text-ink-3 leading-relaxed border-l-2 border-line pl-3">
      {children}
    </p>
  );
}
