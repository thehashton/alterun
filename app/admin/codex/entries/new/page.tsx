import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCodexCategories, getCodexEntries } from "@/lib/codex/queries";
import { EntryForm } from "../EntryForm";

export const metadata = {
  title: "New Codex Entry | Alterun",
  description: "Create a Codex entry.",
};

export default async function AdminCodexNewEntryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const [categories, entries] = await Promise.all([
    getCodexCategories(),
    getCodexEntries(),
  ]);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12 text-xl">
      <nav className="mb-6">
        <Link
          href="/admin/codex"
          className="text-alterun-gold/80 hover:text-alterun-gold text-xl uppercase tracking-wider"
        >
          ← Codex Admin
        </Link>
      </nav>
      <h1 className="font-display text-3xl text-alterun-gold uppercase tracking-widest mb-8">
        New entry
      </h1>
      <EntryForm categories={categories} allEntries={entries} />
    </div>
  );
}
