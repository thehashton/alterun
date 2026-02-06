"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/Button";
import { SignOutButton } from "@/components/SignOutButton";

type Props = {
  initialUser?: User | null;
};

export function HeaderAuth({ initialUser = null }: Props) {
  const [user, setUser] = useState<User | null>(initialUser ?? null);

  useEffect(() => {
    const supabase = createClient();

    void supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (user) {
    return (
      <SignOutButton label="Logout" variant="stoneVines" size="compact" />
    );
  }

  return (
    <Button href="/admin/login" variant="stoneVines" size="compact" imageFilter="darker">
      Login
    </Button>
  );
}
