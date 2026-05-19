import { Search, Bell } from "lucide-react";
import { UserMenu } from "./UserMenu";

export function TopBar() {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-pitch-800 bg-pitch-950/80 backdrop-blur px-6 py-3">
      <div className="flex-1 max-w-md">
        <label className="relative block">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-pitch-500"
          />
          <input
            type="text"
            placeholder="Search teams, players, matches…"
            className="w-full rounded-md bg-pitch-800/70 border border-pitch-700/70 pl-9 pr-3 py-1.5 text-sm placeholder:text-pitch-500 focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500/40"
          />
        </label>
      </div>
      <button
        className="p-1.5 rounded-md text-pitch-300 hover:bg-pitch-800 hover:text-pitch-100"
        aria-label="Notifications"
      >
        <Bell size={16} />
      </button>
      <UserMenu />
    </header>
  );
}
