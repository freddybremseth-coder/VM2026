"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { loginAction, registerAction, type AuthResult } from "@/app/(auth)/actions";

interface Props {
  mode: "login" | "register";
}

export function AuthForm({ mode }: Props) {
  const action = mode === "login" ? loginAction : registerAction;
  const [state, formAction] = useFormState<AuthResult, FormData>(action, {});

  return (
    <div className="card-panel p-6">
      <h1 className="text-lg font-semibold mb-1">
        {mode === "login" ? "Sign in" : "Create account"}
      </h1>
      <p className="text-xs text-pitch-400 mb-5">
        {mode === "login"
          ? "Sign in to save your predictions and join mini-leagues."
          : "Pick a username, then save tips and join mini-leagues."}
      </p>

      <form action={formAction} className="flex flex-col gap-3">
        {mode === "register" && (
          <Field name="username" label="Username" placeholder="haaland9" autoComplete="username" />
        )}
        <Field
          name="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        <Field
          name="password"
          label="Password"
          type="password"
          placeholder={mode === "login" ? "••••••••" : "Min 8 characters"}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          required
        />

        {state.error && (
          <div className="text-xs text-loss bg-loss/10 border border-loss/30 rounded-md px-3 py-2">
            {state.error}
          </div>
        )}
        {state.info && (
          <div className="text-xs text-accent-300 bg-accent-500/10 border border-accent-500/30 rounded-md px-3 py-2">
            {state.info}
          </div>
        )}

        <SubmitButton label={mode === "login" ? "Sign in" : "Create account"} />
      </form>

      <div className="mt-5 pt-4 border-t border-pitch-700/60 text-center text-xs text-pitch-400">
        {mode === "login" ? (
          <>
            No account?{" "}
            <Link href="/register" className="text-accent-300 hover:text-accent-200">
              Register
            </Link>
          </>
        ) : (
          <>
            Already have one?{" "}
            <Link href="/login" className="text-accent-300 hover:text-accent-200">
              Sign in
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { name: string; label: string }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-widest text-pitch-400 font-mono">
        {label}
      </span>
      <input
        name={name}
        type={type}
        className="mt-1 w-full rounded-md bg-pitch-900/80 border border-pitch-700 px-3 py-2 text-sm placeholder:text-pitch-500 focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500/40"
        {...rest}
      />
    </label>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 w-full rounded-md bg-accent-500 hover:bg-accent-400 disabled:bg-pitch-700 disabled:text-pitch-500 text-pitch-950 text-sm font-semibold py-2 transition-colors"
    >
      {pending ? "…" : label}
    </button>
  );
}
