import { Sidebar } from "@/components/shared/Sidebar";
import { TopBar } from "@/components/shared/TopBar";
import { getDictionary } from "@/lib/i18n";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const t = getDictionary();
  return (
    <div className="flex min-h-screen">
      <Sidebar labels={t.nav} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
