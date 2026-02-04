export const metadata = {
  title: "Blog Admin | Alterun",
  description: "Manage blog posts.",
};

export default function AdminBlogPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="font-display text-3xl text-alterun-gold uppercase tracking-widest mb-8">
        Blog Admin
      </h1>
      <p className="text-alterun-muted">
        Create and edit blog posts. (Database tables and forms coming next.)
      </p>
    </div>
  );
}
