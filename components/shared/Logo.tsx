/**
 * WC26 × ChatGenius hybrid logo.
 *
 * The mark fuses a chat-bubble silhouette (homage to ChatGenius) with a
 * stylised football pentagon centre. Gradient runs cyan → indigo → magenta on
 * a dark navy field, matching the ChatGenius brand palette.
 *
 * - `<AppLogo />`        — square mark only, sized via the `size` prop (default 32).
 * - `<AppLogoWordmark/>` — mark + "WC26" wordmark side-by-side for headers.
 * - `<ChatGeniusBadge/>` — small attribution shown in the sidebar footer.
 */

interface AppLogoProps {
  size?: number;
  className?: string;
}

export function AppLogo({ size = 32, className }: AppLogoProps) {
  const gradId = "wc26-grad";
  const innerGradId = "wc26-inner";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="WC26 logo"
    >
      <defs>
        <linearGradient id={gradId} x1="6" y1="6" x2="58" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ff5cc8" />
          <stop offset="50%" stopColor="#6c5ce7" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
        <linearGradient id={innerGradId} x1="16" y1="16" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0b1530" />
          <stop offset="100%" stopColor="#1a234a" />
        </linearGradient>
      </defs>

      {/* Outer chat-bubble silhouette */}
      <path
        d="M14 8h36a8 8 0 0 1 8 8v24a8 8 0 0 1 -8 8H30l-12 10v-10h-4a8 8 0 0 1 -8 -8V16a8 8 0 0 1 8 -8Z"
        fill={`url(#${gradId})`}
      />

      {/* Inner darker chat-bubble (gives the bubble a thick outline feel) */}
      <path
        d="M16 12h32a6 6 0 0 1 6 6v22a6 6 0 0 1 -6 6H29l-7 6v-6h-6a6 6 0 0 1 -6 -6V18a6 6 0 0 1 6 -6Z"
        fill={`url(#${innerGradId})`}
      />

      {/* Football pentagon (central panel of a classic ball) */}
      <path
        d="M32 18 L40.5 24.2 L37.2 34.4 L26.8 34.4 L23.5 24.2 Z"
        fill={`url(#${gradId})`}
        opacity="0.9"
      />

      {/* "26" mark below the pentagon */}
      <text
        x="32"
        y="46"
        textAnchor="middle"
        fontFamily="ui-monospace, 'JetBrains Mono', monospace"
        fontSize="10"
        fontWeight="800"
        fill="#e2f4ff"
        letterSpacing="0.5"
      >
        26
      </text>
    </svg>
  );
}

interface WordmarkProps {
  size?: number;
  className?: string;
  showTagline?: boolean;
}

export function AppLogoWordmark({ size = 32, className, showTagline = true }: WordmarkProps) {
  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <AppLogo size={size} />
      <div className="leading-tight">
        <div className="text-sm font-bold tracking-tight bg-gradient-to-r from-[#ff5cc8] via-[#a78bfa] to-[#22d3ee] bg-clip-text text-transparent">
          WC26
        </div>
        {showTagline && (
          <div className="text-[10px] uppercase tracking-widest text-pitch-400">
            Stats · Predictions
          </div>
        )}
      </div>
    </div>
  );
}

export function ChatGeniusBadge() {
  return (
    <a
      href="https://chatgenius.pro"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 group"
      aria-label="Powered by ChatGenius"
    >
      <ChatGeniusMark size={20} />
      <div className="leading-tight">
        <div className="text-[9px] uppercase tracking-widest text-pitch-500 group-hover:text-pitch-300 transition-colors">
          Powered by
        </div>
        <div className="text-[11px] font-semibold bg-gradient-to-r from-[#ff5cc8] via-[#a78bfa] to-[#22d3ee] bg-clip-text text-transparent">
          ChatGenius
        </div>
      </div>
    </a>
  );
}

/**
 * Inline reproduction of the ChatGenius bot/chat-bubble mark (the original
 * lives as a PNG asset elsewhere — this SVG version embeds cleanly anywhere
 * and matches the brand palette).
 */
function ChatGeniusMark({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cg-grad" x1="6" y1="6" x2="58" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ff5cc8" />
          <stop offset="50%" stopColor="#6c5ce7" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      {/* Robot side antennas */}
      <rect x="8"  y="26" width="6" height="10" rx="2" fill="url(#cg-grad)" />
      <rect x="50" y="26" width="6" height="10" rx="2" fill="url(#cg-grad)" />
      {/* Chat-bubble body */}
      <path
        d="M16 14h32a6 6 0 0 1 6 6v22a6 6 0 0 1 -6 6H30l-8 8v-8h-6a6 6 0 0 1 -6 -6V20a6 6 0 0 1 6 -6Z"
        fill="url(#cg-grad)"
      />
      {/* Eyes */}
      <circle cx="25" cy="28" r="3" fill="#0b1530" />
      <circle cx="39" cy="28" r="3" fill="#0b1530" />
      <circle cx="25.6" cy="28.6" r="1" fill="#a8f3ff" />
      <circle cx="39.6" cy="28.6" r="1" fill="#a8f3ff" />
      {/* Smile */}
      <path
        d="M25 36 Q32 41 39 36"
        stroke="#0b1530"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
