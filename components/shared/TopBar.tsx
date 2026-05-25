import { Bell } from "lucide-react";
import { UserMenu } from "./UserMenu";
import { MobileNav } from "./MobileNav";
import { LocaleToggle } from "./LocaleToggle";
import { SongPlayerButton } from "./SongPlayer";
import { GlobalSearch } from "./GlobalSearch";
import { getDictionary, getLocale } from "@/lib/i18n";

export function TopBar() {
  const t = getDictionary();
  const locale = getLocale();

  return (
    <header className="sticky top-0 z-20 flex items-center gap-2 sm:gap-4 border-b border-cream/8 bg-canvas/80 backdrop-blur px-3 sm:px-6 py-3">
      <MobileNav labels={t.nav} />

      <div className="flex-1 max-w-md">
        <GlobalSearch placeholder={t.common.search} />
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
