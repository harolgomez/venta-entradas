import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export async function AuthGuard({ children, redirectTo }: AuthGuardProps) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = redirectTo
      ? `/auth/login?redirect=${encodeURIComponent(redirectTo)}`
      : "/auth/login";
    redirect(loginUrl);
  }

  return <>{children}</>;
}
