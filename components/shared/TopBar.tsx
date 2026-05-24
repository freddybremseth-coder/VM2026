import { Search, Bell } from "lucide-react";
import { UserMenu } from "./UserMenu";
import { MobileNav } from "./MobileNav";
import { LocaleToggle } from "./LocaleToggle";
import { SongPlayerButton } from "./SongPlayer";
import { getDictionary, getLocale } from "@/lib/i18n";

export function TopBar() {
  const t = getDictionary();
  const locale = getLocale();

  return (
    <header className="sticky top-0 z-20 flex items-center gap-2 sm:gap-4 border-b border-cream/8 bg-canvas/80 backdrop-blur px-3 sm:px-6 py-3">
      <MobileNav labels={t.nav} />

      <div className="flex-1 max-w-md">
        <label className="relative block">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/45"
          />
          <input
            type="text"
            placeholder={t.common.search}
            className="w-full bg-paper border border-cream/8 pl-9 pr-3 py-1.5 text-sm text-cream placeholder:text-cream/45 focus:outline-none focus:border-signal/50"
          />
        </label>
      </div>
      <SongPlayerButton />
      <LocaleToggle current={locale} />
      <button
        className="p-1.5 text-cream/55 hover:bg-paper hover:text-cream hidden sm:inline-flex"
        aria-label="Notifications"
      >
        <Bell size={16} />
      </button>
      <UserMenu />
    </header>
  );
}
