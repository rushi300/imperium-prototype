"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useImperium } from "@/context/ImperiumContext";

/**
 * /live is a permanent redirect, never a page.
 * During the fest it goes to the homepage (which is in LIVE mode).
 * Outside the fest it goes to the schedule. One printable URL, zero duplication.
 */
export default function LiveRedirect() {
  const { mode } = useImperium();
  const router = useRouter();

  useEffect(() => {
    router.replace(mode === "live" ? "/" : "/schedule");
  }, [mode, router]);

  return (
    <div className="max-w-shell mx-auto px-4 py-24 text-center">
      <p className="text-ink-2">Taking you to {mode === "live" ? "Happening Now" : "the schedule"}…</p>
    </div>
  );
}
