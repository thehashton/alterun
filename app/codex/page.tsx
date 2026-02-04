export const metadata = {
  title: "Codex | Alterun",
  description: "The Codex of Alterun — people, places, and lore.",
};

export default function CodexPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="font-display text-3xl text-alterun-gold uppercase tracking-widest mb-8">
        The Codex
      </h1>
      <p className="text-alterun-muted mb-8">
        Browse entries by category. Use the Admin dashboard to add and edit
        Codex entries.
      </p>
      <p className="text-alterun-muted text-sm">
        Categories and search will appear here once the Codex is set up.
      </p>
    </div>
  );
}
