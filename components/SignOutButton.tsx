"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Props = {
  label?: string;
  className?: string;
};

export function SignOutButton({ label = "Sign out", className }: Props) {
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
      className={className ?? "text-base uppercase tracking-wider text-alterun-muted hover:text-alterun-gold transition-colors duration-200"}
    >
      {label}
    </button>
  );
}
