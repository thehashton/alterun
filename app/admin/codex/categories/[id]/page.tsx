import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCodexCategories } from "@/lib/codex/queries";
import { EditCategoryForm } from "./EditCategoryForm";

export const metadata = {
  title: "Edit Category | Alterun",
  description: "Edit Codex category.",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminCodexCategoryEditPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const categories = await getCodexCategories();
  const category = categories.find((c) => c.id === id);
  if (!category) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <nav className="mb-6">
        <Link
          href="/admin/codex/categories"
          className="text-alterun-gold/80 hover:text-alterun-gold text-sm uppercase tracking-wider"
        >
          ← Categories
        </Link>
      </nav>
      <h1 className="font-display text-3xl text-alterun-gold uppercase tracking-widest mb-8">
        Edit category
      </h1>
      <EditCategoryForm category={category} />
    </div>
  );
}
