"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
    router.push("/admin/login");
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="text-sm uppercase tracking-wider text-alterun-muted hover:text-alterun-gold transition-colors"
    >
      Sign out
    </button>
  );
}
