import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Imperium'26 — MDI Gurgaon's Annual Management, Sports & Cultural Fest",
  description:
    "Imperium is MDI Gurgaon's flagship national fest — 54 events across management, sports and culture, 30 Jan – 1 Feb 2026. Explore events, build your schedule and get your Imperium Pass.",
  robots: "index, follow",
  openGraph: {
    title: "Imperium'26 — MDI Gurgaon",
    description: "54 events. 3 days. 150+ institutions. 30 Jan – 1 Feb 2026.",
    type: "website",
  },
};

export const viewport = { width: "device-width", initialScale: 1, themeColor: "#0A0A0F" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[300] focus:top-3 focus:left-3 focus:bg-magenta focus:text-white focus:px-4 focus:py-3 focus:rounded-sm"
        >
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
