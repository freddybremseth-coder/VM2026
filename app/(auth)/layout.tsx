import Link from "next/link";
import { AppLogoWordmark, ChatGeniusBadge } from "@/components/shared/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 grid-lines">
      <Link href="/" className="mb-6">
        <AppLogoWordmark size={40} />
      </Link>
      <div className="w-full max-w-sm">{children}</div>
      <div className="mt-8">
        <ChatGeniusBadge />
      </div>
    </div>
  );
}
