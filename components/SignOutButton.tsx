"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import type { ButtonVariant } from "@/components/Button";

type Props = {
  label?: string;
  className?: string;
  /** e.g. "stoneVines" or "stoneVinesCrown" for image button style */
  variant?: ButtonVariant;
  size?: "default" | "compact";
};

export function SignOutButton({ label = "Sign out", className, variant, size = "default" }: Props) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
    router.push("/admin/login");
  }

  if (variant === "stoneVines" || variant === "stoneVinesCrown") {
    return (
      <Button
        variant={variant}
        size={size}
        onClick={handleSignOut}
        className={className}
      >
        {label}
      </Button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className={className ?? "text-xl uppercase tracking-wider text-alterun-muted hover:text-alterun-gold transition-colors duration-200"}
    >
      {label}
    </button>
  );
}
