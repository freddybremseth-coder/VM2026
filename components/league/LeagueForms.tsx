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
    <form action={formAction} className="surface p-5">
      <div className="flex items-center gap-2 mb-4">
        <Plus size={14} className="text-signal" />
        <h2 className="text-[10px] uppercase tracking-kicker font-mono font-semibold text-cream/85">
          Lag en mini-liga
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        <Field name="name" label="Liga-navn" placeholder="Kontortipping" required />
        <Field
          name="description"
          label="Beskrivelse (valgfritt)"
          placeholder="Vennskapelig tipping blant kolleger"
        />
        <label className="flex items-center gap-2 text-xs text-cream/70">
          <input
            type="checkbox"
            name="isPrivate"
            defaultChecked
            className="border-cream/14 bg-canvas accent-signal"
          />
          Privat — bare folk med invitasjonskoden kan bli med
        </label>
        {state.error && (
          <div className="text-xs text-loss bg-loss/10 border border-loss/30 px-3 py-2 font-mono">
            {state.error}
          </div>
        )}
        <Submit label="Opprett liga" />
      </div>
    </form>
  );
}

export function JoinLeagueForm() {
  const [state, formAction] = useFormState<LeagueResult, FormData>(joinLeagueAction, {});

  return (
    <form action={formAction} className="surface p-5">
      <div className="flex items-center gap-2 mb-4">
        <Hash size={14} className="text-amber" />
        <h2 className="text-[10px] uppercase tracking-kicker font-mono font-semibold text-cream/85">
          Bli med via invitasjonskode
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        <Field
          name="inviteCode"
          label="Invitasjonskode"
          placeholder="f.eks. a1b2c3d4"
          required
        />
        {state.error && (
          <div className="text-xs text-loss bg-loss/10 border border-loss/30 px-3 py-2 font-mono">
            {state.error}
          </div>
        )}
        <Submit label="Bli med" tone="amber" />
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
      <span className="text-[10px] uppercase tracking-kicker text-cream/55 font-mono">
        {label}
      </span>
      <input
        name={name}
        className="mt-1 w-full bg-canvas border border-cream/8 px-3 py-2 text-sm text-cream placeholder:text-cream/45 focus:outline-none focus:border-signal/50"
        {...rest}
      />
    </label>
  );
}

function Submit({ label, tone = "signal" }: { label: string; tone?: "signal" | "amber" }) {
  const { pending } = useFormStatus();
  const bg =
    tone === "signal"
      ? "bg-signal hover:bg-signalD text-cream"
      : "bg-amber hover:bg-amber/85 text-canvas";
  return (
    <button
      type="submit"
      disabled={pending}
      className={`${bg} disabled:bg-paper disabled:text-cream/35 text-xs font-semibold px-4 py-2 mt-1 transition-colors`}
    >
      {pending ? "…" : label}
    </button>
  );
}
