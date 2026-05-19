import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 grid-lines">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center gap-2 mb-6 justify-center">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-accent-400 to-accent-600 accent-glow flex items-center justify-center">
            <span className="font-mono font-bold text-pitch-950 text-sm">26</span>
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold tracking-tight">WC26</div>
            <div className="text-[10px] uppercase tracking-widest text-pitch-400">
              Stats · Predictions
            </div>
          </div>
        </Link>
        {children}
      </div>
    </div>
  );
}
