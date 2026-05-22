/**
 * Thin Anthropic SDK wrapper used by the deterministic-or-Claude AI features
 * (match preview, banter report, bracket coach, tip helper).
 *
 * Design:
 *   - If `ANTHROPIC_API_KEY` is missing we return null immediately. The
 *     callers all keep a deterministic template fallback so the app ships
 *     without an LLM dependency.
 *   - If the key is present, we call Claude Sonnet 4.5 with a small max-
 *     tokens budget (LLM output here is at most 4 sentences).
 *   - Errors (rate limit, network, bad response) also return null so the
 *     caller transparently falls back. We log on the server for debugging.
 *
 * Cost discipline: every AI feature uses a system prompt that's
 * static-string-cached so Claude caches it on subsequent calls. Per-call
 * cost is dominated by output tokens.
 */

import Anthropic from "@anthropic-ai/sdk";

type ClaudeOpts = {
  systemPrompt: string;
  userPrompt: string;
  /** Max tokens to generate. AI features here ask for 1-4 sentences. */
  maxTokens?: number;
};

let client: Anthropic | null = null;

function getClient(): Anthropic | null {
  if (client) return client;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  client = new Anthropic({ apiKey });
  return client;
}

export function isClaudeEnabled(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}

/**
 * Call Claude and return the text response, or null if the key is missing
 * or anything throws. Caller is responsible for the fallback.
 */
export async function tryClaudeText(opts: ClaudeOpts): Promise<string | null> {
  const c = getClient();
  if (!c) return null;

  try {
    const res = await c.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: opts.maxTokens ?? 400,
      system: opts.systemPrompt,
      messages: [{ role: "user", content: opts.userPrompt }],
    });

    const first = res.content[0];
    if (first?.type !== "text") return null;
    return first.text.trim();
  } catch (err) {
    // Log on the server, fall back silently for the user.
    console.error("[claude]", (err as Error).message);
    return null;
  }
}
