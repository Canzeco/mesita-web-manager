import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase/server";
import { CreateUnitForm } from "./CreateUnitForm";

// Route lives at /add. Distinct from /manager/onboard:
// onboard creates the manager_profile (once per person), create_unit
// creates a venue (N times per person — multi-unit operators).
//
// Renders full-screen on purpose: this route sits OUTSIDE manager/(shell),
// so the Sidebar is intentionally absent. Picking a Google profile is a
// one-shot focused action — nav chrome would just compete for attention.
export const dynamic = "force-dynamic";

export default async function CreateUnitPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/sign-in?next=/add");
  }

  return (
    <div className="bg-background min-h-dvh w-full">
      <div className="mx-auto flex max-w-[640px] flex-col px-6 py-8 md:py-10">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1.5 self-start text-[13.5px] transition"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to home
        </Link>
        <header className="mb-6">
          <h1 className="font-display text-[30px] font-semibold tracking-[-0.02em]">
            Add a venue
          </h1>
          <p className="text-muted-foreground mt-2 max-w-[54ch] text-[14.5px] leading-[1.55]">
            Type the venue&apos;s name — we pull the profile straight
            from Google and show its current Mesita status inline.
          </p>
        </header>
        <CreateUnitForm signedInEmail={user.email ?? ""} />
      </div>
    </div>
  );
}
