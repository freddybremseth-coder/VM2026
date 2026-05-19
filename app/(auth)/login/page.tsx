import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function LoginPage() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/predictions");
  return <AuthForm mode="login" />;
}
