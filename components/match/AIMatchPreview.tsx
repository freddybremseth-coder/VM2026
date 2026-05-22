import { Sparkles, Cpu, Zap } from "lucide-react";
import type { MatchPreview } from "@/lib/ai-preview";

interface Props {
  preview: MatchPreview;
}

/** True when the preview was written by Claude rather than the deterministic template. */
function isClaudeModel(model: string) {
  return model.startsWith("claude");
}

/**
 * Three-line scouting brief shown on the match-center pre-match overview.
 * Shows a clear "Claude Live" vs "Template" badge so users know whether
 * the copy is AI-generated or deterministic.
 */
export function AIMatchPreview({ preview }: Props) {
  const liveAI = isClaudeModel(preview.model);

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
          {liveAI ? (
            <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest bg-win/10 text-win px-2 py-1 rounded-md">
              <Zap size={10} /> Claude live
            </span>
          ) : (
            <span
              className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest bg-pitch-800 text-pitch-400 px-2 py-1 rounded-md"
              title="Set ANTHROPIC_API_KEY to activate live AI previews"
            >
              <Sparkles size={10} /> Mal
            </span>
          )}
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

        {!liveAI && (
          <p className="mt-3 text-[11px] text-pitch-600 italic">
            Forhåndsvisning er basert på FIFA-rang og lagdata.
            Sett <code className="text-pitch-500 font-mono">ANTHROPIC_API_KEY</code> for Claude-generert innhold.
          </p>
        )}
      </div>
    </div>
  );
}
