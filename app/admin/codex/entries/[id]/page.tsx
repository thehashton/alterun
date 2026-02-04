import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  getCodexCategories,
  getCodexEntries,
  getCodexEntryWithRelationsForAdmin,
} from "@/lib/codex/queries";
import { EntryForm } from "../EntryForm";

export const metadata = {
  title: "Edit Codex Entry | Alterun",
  description: "Edit Codex entry.",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminCodexEditEntryPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const [entry, categories, allEntries] = await Promise.all([
    getCodexEntryWithRelationsForAdmin(id),
    getCodexCategories(),
    getCodexEntries(),
  ]);

  if (!entry) notFound();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <nav className="mb-6">
        <Link
          href="/admin/codex"
          className="text-alterun-gold/80 hover:text-alterun-gold text-sm uppercase tracking-wider"
        >
          ← Codex Admin
        </Link>
      </nav>
      <h1 className="font-display text-3xl text-alterun-gold uppercase tracking-widest mb-8">
        Edit entry
      </h1>
      <EntryForm
        categories={categories}
        allEntries={allEntries}
        entry={entry}
      />
    </div>
  );
}
