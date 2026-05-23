import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Fraunces } from "next/font/google";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

// ─── NEW: Fraunces serif display ─────────────────────────────
// Editorial headlines, scores, team names in cinematic contexts.
// Optical-size axis lets the same font render tight headlines
// and elegant body italics from one weight-set.
const serif = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  axes: ["opsz"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "VM2026 · Stats & Predictions",
  description: "Advanced stats, tactics and AI predictions for the 2026 FIFA World Cup.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nb" className="dark" suppressHydrationWarning>
      <body
        className={`${sans.variable} ${mono.variable} ${serif.variable} min-h-screen bg-canvas text-cream antialiased selection:bg-signal/30 selection:text-cream`}
      >
        {children}
      </body>
    </html>
  );
}
