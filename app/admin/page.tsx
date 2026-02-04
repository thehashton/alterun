import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const metadata = {
  title: "Admin | Alterun",
  description: "Admin dashboard for Alterun.",
};

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="font-display text-3xl text-alterun-gold uppercase tracking-widest mb-8">
        Admin
      </h1>
      <p className="text-alterun-muted mb-8">
        Signed in as {user.email}. Use the links below to manage content.
      </p>
      <div className="grid sm:grid-cols-2 gap-6">
        <Link
          href="/admin/blog"
          className="ornament-border rounded-lg p-6 bg-alterun-bg-card hover:border-alterun-gold/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
          <h2 className="font-display text-lg text-alterun-gold uppercase tracking-wider">
            Blog
          </h2>
          <p className="text-alterun-muted text-base mt-1">
            Create and edit blog posts.
          </p>
        </Link>
        <Link
          href="/admin/codex"
          className="ornament-border rounded-lg p-6 bg-alterun-bg-card hover:border-alterun-gold/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
          <h2 className="font-display text-lg text-alterun-gold uppercase tracking-wider">
            Codex
          </h2>
          <p className="text-alterun-muted text-base mt-1">
            Add and edit Codex entries, categories, and images.
          </p>
        </Link>
      </div>
    </div>
  );
}
