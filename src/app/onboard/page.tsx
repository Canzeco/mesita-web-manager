import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { apiGetManagerProfile } from "@/lib/api/manager";
import { AuthCard, AuthShell, SignedInChip } from "@/components/auth/AuthShell";
import { ManagerOnboardForm } from "./ManagerOnboardForm";

// Manager onboarding — captures the manager's name after signup.
// Distinct from venue creation; this is about the *person*, the venue
// gets its own wizard step at /add.
//
// Server-gated:
//   - signed out         → /sign-in (with next=/onboard)
//   - already onboarded  → /add (skip past us)
//   - signed in, no name → render the form
export const dynamic = "force-dynamic";

export default async function ManagerOnboardPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/onboard");

  try {
    const profile = await apiGetManagerProfile(supabase);
    if (profile.full_name) redirect("/add");
  } catch (err) {
    console.error("[manager/onboard] manager-get-profile:", err);
  }

  return (
    <AuthShell>
      <AuthCard
        title="Welcome to Mesita"
        subtitle="Tell us who you are. You can add your venue right after."
        chip={
          user.email ? (
            <SignedInChip>Signed in as {user.email}</SignedInChip>
          ) : null
        }
      >
        <ManagerOnboardForm />
      </AuthCard>
    </AuthShell>
  );
}
