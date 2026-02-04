import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "@/components/LoginForm";

export const metadata = {
  title: "Admin Login | Alterun",
  description: "Sign in to the Alterun admin dashboard.",
};

export default async function AdminLoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/admin");
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <h1 className="font-display text-2xl text-alterun-gold uppercase tracking-widest mb-2 text-center">
        Admin Login
      </h1>
      <p className="text-alterun-muted text-sm text-center mb-8">
        Sign in with your email to manage Alterun.
      </p>
      <LoginForm />
    </div>
  );
}
