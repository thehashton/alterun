export const metadata = {
  title: "Codex Admin | Alterun",
  description: "Manage Codex entries.",
};

export default function AdminCodexPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="font-display text-3xl text-alterun-gold uppercase tracking-widest mb-8">
        Codex Admin
      </h1>
      <p className="text-alterun-muted">
        Add and edit Codex entries, categories, links, and images. (Database and
        forms coming next.)
      </p>
    </div>
  );
}
