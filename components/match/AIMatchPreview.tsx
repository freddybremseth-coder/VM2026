import { Sparkles, Cpu } from "lucide-react";
import type { MatchPreview } from "@/lib/ai-preview";

interface Props {
  preview: MatchPreview;
}

/**
 * Three-line scouting brief shown on the match-center pre-match overview.
 * Renders the deterministic preview from lib/ai-preview today, will become a
 * cached Claude response in v1.1.
 */
export function AIMatchPreview({ preview }: Props) {
  return (
    <div className="card-panel p-5 ring-1 ring-accent-500/20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04] grid-lines pointer-events-none" />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-accent-500/15 flex items-center justify-center">
              <Cpu size={14} className="text-accent-400" />
            </div>
            <div>
              <div className="text-xs font-semibold">AI match preview</div>
              <div className="text-[10px] uppercase tracking-widest text-pitch-500 font-mono">
                ChatGenius · {preview.model}
              </div>
            </div>
          </div>
          <Sparkles size={14} className="text-accent-400" />
        </div>

        <div className="space-y-3 text-sm text-pitch-200 leading-relaxed">
          <p>
            <span className="text-accent-400 font-mono text-xs mr-1.5">›</span>
            {preview.hook}
          </p>
          <p>
            <span className="text-accent-400 font-mono text-xs mr-1.5">›</span>
            {preview.read}
          </p>
          <p>
            <span className="text-accent-400 font-mono text-xs mr-1.5">›</span>
            <span className="font-semibold">{preview.recommendation}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
