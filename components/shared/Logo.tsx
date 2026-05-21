/**
 * WC26 × ChatGenius hybrid logo.
 *
 * The mark fuses a chat-bubble silhouette (homage to ChatGenius) with a single
 * football-panel pentagon containing the "26" wordmark. Gradient runs cyan →
 * indigo → magenta on a dark navy field, matching the ChatGenius brand palette.
 *
 * Exports:
 * - `<AppLogo />`         — square mark only, sized via the `size` prop (default 32).
 * - `<AppLogoWordmark />` — mark + "WC26" wordmark side-by-side for headers.
 * - `<ChatGeniusBadge />` — small "Powered by ChatGenius" attribution.
 * - `<CreditsBadge />`    — "Built by Freddy Bremseth" attribution with links.
 */

interface AppLogoProps {
  size?: number;
  className?: string;
}

export function AppLogo({ size = 32, className }: AppLogoProps) {
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
        <linearGradient id="wc26-fill" x1="4" y1="4" x2="60" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%"  stopColor="#ff5cc8" />
          <stop offset="55%" stopColor="#7c5cff" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
        <linearGradient id="wc26-rim" x1="4" y1="4" x2="60" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%"  stopColor="#ff8edd" />
          <stop offset="100%" stopColor="#4cf5ff" />
        </linearGradient>
      </defs>

      {/* Chat bubble — single shape, rounded with a small tail */}
      <path
        d="M14 8h36a8 8 0 0 1 8 8v28a8 8 0 0 1 -8 8H28l-10 8v-8h-4a8 8 0 0 1 -8 -8V16a8 8 0 0 1 8 -8Z"
        fill="url(#wc26-fill)"
      />
      <path
        d="M14 8h36a8 8 0 0 1 8 8v28a8 8 0 0 1 -8 8H28l-10 8v-8h-4a8 8 0 0 1 -8 -8V16a8 8 0 0 1 8 -8Z"
        fill="none"
        stroke="url(#wc26-rim)"
        strokeOpacity="0.5"
        strokeWidth="0.8"
      />

      {/* Football panel — single pentagon, off-white so it pops against the gradient */}
      <path
        d="M32 14 L46.7 24.7 L41.1 41.9 L22.9 41.9 L17.3 24.7 Z"
        fill="#f8fbff"
        opacity="0.95"
      />

      {/* "26" mark — bold mono inside the pentagon */}
      <text
        x="32"
        y="36"
        textAnchor="middle"
        fontFamily="ui-monospace, 'JetBrains Mono', monospace"
        fontSize="13"
        fontWeight="800"
        fill="#0b1530"
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
 * Inline reproduction of the ChatGenius bot/chat-bubble mark.
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

/**
 * Author attribution. Small, footer-style. Shown next to the ChatGenius badge.
 */
export function CreditsBadge() {
  return (
    <div className="text-[10px] leading-tight text-pitch-500">
      <div className="uppercase tracking-widest text-[9px] mb-0.5">Built by</div>
      <div className="font-semibold text-pitch-300">Freddy Bremseth</div>
      <div className="flex flex-col mt-1 gap-0.5">
        <a
          href="https://freddybremseth.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-accent-300 transition-colors"
        >
          freddybremseth.com
        </a>
        <a
          href="https://chatgenius.pro"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-accent-300 transition-colors"
        >
          chatgenius.pro
        </a>
      </div>
    </div>
  );
}
