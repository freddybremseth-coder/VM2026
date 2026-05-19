"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Plus, Hash } from "lucide-react";
import {
  createLeagueAction,
  joinLeagueAction,
  type LeagueResult,
} from "@/app/(app)/leagues/actions";

export function CreateLeagueForm() {
  const [state, formAction] = useFormState<LeagueResult, FormData>(
    createLeagueAction,
    {},
  );

  return (
    <form action={formAction} className="card-panel p-5">
      <div className="flex items-center gap-2 mb-4">
        <Plus size={14} className="text-accent-400" />
        <h2 className="text-sm font-semibold">Create a mini-league</h2>
      </div>

      <div className="flex flex-col gap-3">
        <Field name="name" label="League name" placeholder="Office Predictions" required />
        <Field
          name="description"
          label="Description (optional)"
          placeholder="Friendly tipping among colleagues"
        />
        <label className="flex items-center gap-2 text-xs text-pitch-300">
          <input
            type="checkbox"
            name="isPrivate"
            defaultChecked
            className="rounded border-pitch-600 bg-pitch-900 accent-accent-500"
          />
          Private — only people with the invite code can join
        </label>
        {state.error && (
          <div className="text-xs text-loss bg-loss/10 border border-loss/30 rounded-md px-3 py-2">
            {state.error}
          </div>
        )}
        <Submit label="Create league" />
      </div>
    </form>
  );
}

export function JoinLeagueForm() {
  const [state, formAction] = useFormState<LeagueResult, FormData>(joinLeagueAction, {});

  return (
    <form action={formAction} className="card-panel p-5">
      <div className="flex items-center gap-2 mb-4">
        <Hash size={14} className="text-data-400" />
        <h2 className="text-sm font-semibold">Join with invite code</h2>
      </div>

      <div className="flex flex-col gap-3">
        <Field
          name="inviteCode"
          label="Invite code"
          placeholder="e.g. a1b2c3d4"
          required
        />
        {state.error && (
          <div className="text-xs text-loss bg-loss/10 border border-loss/30 rounded-md px-3 py-2">
            {state.error}
          </div>
        )}
        <Submit label="Join league" tone="data" />
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { name: string; label: string }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-widest text-pitch-400 font-mono">
        {label}
      </span>
      <input
        name={name}
        className="mt-1 w-full rounded-md bg-pitch-900/80 border border-pitch-700 px-3 py-2 text-sm placeholder:text-pitch-500 focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500/40"
        {...rest}
      />
    </label>
  );
}

function Submit({ label, tone = "accent" }: { label: string; tone?: "accent" | "data" }) {
  const { pending } = useFormStatus();
  const bg = tone === "accent" ? "bg-accent-500 hover:bg-accent-400" : "bg-data-500 hover:bg-data-400";
  return (
    <button
      type="submit"
      disabled={pending}
      className={`${bg} disabled:bg-pitch-700 disabled:text-pitch-500 text-pitch-950 text-xs font-semibold px-4 py-2 rounded-md mt-1 transition-colors`}
    >
      {pending ? "…" : label}
    </button>
  );
}
