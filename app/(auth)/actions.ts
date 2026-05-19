"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface AuthResult {
  error?: string;
  info?: string;
}

export async function loginAction(_: AuthResult, formData: FormData): Promise<AuthResult> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  redirect("/predictions");
}

export async function registerAction(_: AuthResult, formData: FormData): Promise<AuthResult> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const username = String(formData.get("username") || "").trim();

  if (!email || !password || !username) {
    return { error: "Email, username and password are required." };
  }
  if (username.length < 3 || username.length > 24) {
    return { error: "Username must be 3–24 characters." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });

  if (error) return { error: error.message };

  // If email confirmation is disabled on the project, a session is returned and
  // the user is logged in immediately. Otherwise inform them to check email.
  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/predictions");
  }
  return { info: "Check your email to confirm your account, then sign in." };
}

export async function logoutAction() {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
