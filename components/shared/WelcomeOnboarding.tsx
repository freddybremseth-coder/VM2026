"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Target, Trophy, Flag, ArrowRight } from "lucide-react";
import { AppLogo } from "./Logo";

/**
 * One-time welcome modal shown on the dashboard for first-time visitors.
 * Dismissed (forever) via cookie `wc26.onboarded.v1`. We use `localStorage`
 * for simplicity — no server roundtrip, instant feedback.
 */
const STORAGE_KEY = "wc26.onboarded.v1";

export function WelcomeOnboarding() {
  const [open, setOpen] = useState(false);

  // Show only after hydration, and only if the user hasn't dismissed it before.
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const seen = window.localStorage.getItem(STORAGE_KEY);
      if (!seen) {
        // Small delay so it doesn't pop in during initial paint.
        const t = setTimeout(() => setOpen(true), 500);
        return () => clearTimeout(t);
      }
    } catch {
      // localStorage unavailable (private mode / cookie-blocked) — show once.
      setOpen(true);
    }
  }, []);

  function dismiss() {
    setOpen(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    } catch {
      // ignore
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-3 sm:p-6">
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss welcome"
        className="absolute inset-0 bg-pitch-950/85 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-lg card-panel p-6 sm:p-7 ring-1 ring-accent-500/30 shadow-2xl">
        <button
          type="button"
          onClick={dismiss}
          className="absolute top-3 right-3 p-1.5 rounded-md text-pitch-300 hover:bg-pitch-800 hover:text-white"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <AppLogo size={44} />
          <div>
            <div className="text-[10px] uppercase tracking-widest text-accent-400 font-semibold">
              Welcome to WC26
            </div>
            <div className="text-lg sm:text-xl font-bold tracking-tight">
              The AI-powered World Cup prediction game
            </div>
          </div>
        </div>

        <p className="text-sm text-pitch-200 leading-relaxed mb-5">
          Tip the 104 matches, build private leagues with friends, and let
          ChatGenius coach your bracket. Three things to try first:
        </p>

        <ol className="space-y-3 mb-6">
          <Step
            icon={<Target size={16} className="text-accent-400" />}
            num={1}
            title="Tip the opener"
            body="3 free guest tips before you need an account."
            href="/predictions"
            cta="Tip now"
          />
          <Step
            icon={<Trophy size={16} className="text-draw" />}
            num={2}
            title="Create a mini-league"
            body="Share an invite link. Weekly AI banter report keeps it spicy."
            href="/leagues"
            cta="Create league"
          />
          <Step
            icon={<Flag size={16} className="text-accent-300" />}
            num={3}
            title="Follow your team"
            body="Norway-mode has countdown, key-player tracker, scenarios."
            href="/norge"
            cta="Open Norway"
          />
        </ol>

        <button
          type="button"
          onClick={dismiss}
          className="w-full rounded-md bg-accent-500 hover:bg-accent-400 text-pitch-950 text-sm font-semibold py-2.5 transition-colors"
        >
          Got it — let me browse
        </button>
      </div>
    </div>
  );
}

function Step({
  icon,
  num,
  title,
  body,
  href,
  cta,
}: {
  icon: React.ReactNode;
  num: number;
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <div className="h-8 w-8 rounded-md bg-pitch-800 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-pitch-400 font-mono">
            Step {num}
          </span>
          <span className="text-sm font-semibold">{title}</span>
        </div>
        <p className="text-xs text-pitch-400 mt-0.5">{body}</p>
      </div>
      <Link
        href={href}
        className="rounded-md bg-pitch-800 hover:bg-pitch-700 text-pitch-100 text-[11px] font-semibold px-2.5 py-1.5 transition-colors flex items-center gap-1 shrink-0"
      >
        {cta} <ArrowRight size={10} />
      </Link>
    </li>
  );
}
