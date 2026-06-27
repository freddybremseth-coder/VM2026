import { Sidebar } from "@/components/shared/Sidebar";
import { TopBar } from "@/components/shared/TopBar";
import { LiveStatusBar } from "@/components/shared/LiveStatusBar";
import { SongPlayerProvider } from "@/components/shared/SongPlayer";
import { NewSongBanner } from "@/components/shared/NewSongBanner";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getDictionary } from "@/lib/i18n";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = getDictionary();
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <SongPlayerProvider>
      <div className="flex min-h-screen">
        <Sidebar labels={t.nav} />
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />
          <LiveStatusBar />
          {/* New-song news banner — shown on every page to logged-in users
              until dismissed. */}
          {user && <NewSongBanner />}
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </SongPlayerProvider>
  );
}
