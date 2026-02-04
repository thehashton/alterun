export const metadata = {
  title: "Blog | Alterun",
  description: "News and updates from the world of Alterun.",
};

export default function BlogPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="font-display text-3xl text-alterun-gold uppercase tracking-widest mb-8">
        Blog
      </h1>
      <p className="text-alterun-muted">
        Posts will appear here. Use the Admin dashboard to create and publish
        blog posts.
      </p>
    </div>
  );
}
