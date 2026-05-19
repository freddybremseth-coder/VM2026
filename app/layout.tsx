import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: "WC26 · Stats & Predictions",
  description: "Advanced stats, tactics and AI predictions for the 2026 FIFA World Cup.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${sans.variable} ${mono.variable} min-h-screen bg-pitch-950 text-pitch-50 antialiased selection:bg-accent-500/30 selection:text-accent-200`}
      >
        {children}
      </body>
    </html>
  );
}
