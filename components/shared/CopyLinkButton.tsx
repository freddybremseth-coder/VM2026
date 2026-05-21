"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyLinkButton({
  label = "Copy link",
  className,
}: {
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Fallback for older browsers — silently skip.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={
        className ??
        "rounded-md bg-accent-500 hover:bg-accent-400 text-pitch-950 text-xs font-semibold px-4 py-2 transition-colors flex items-center gap-1.5"
      }
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "Copied!" : label}
    </button>
  );
}
