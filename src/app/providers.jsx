"use client";

import { ImperiumProvider } from "@/context/ImperiumContext";
import { Shell } from "@/components/shell";

export default function Providers({ children }) {
  return (
    <ImperiumProvider>
      <Shell>{children}</Shell>
    </ImperiumProvider>
  );
}
