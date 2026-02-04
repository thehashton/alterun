"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }
    setMessage({ type: "success", text: "Signed in. Redirecting…" });
    router.refresh();
    router.push("/admin");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 ornament-border rounded-lg p-8 bg-alterun-bg-card">
      <div>
        <label htmlFor="email" className="block text-base uppercase tracking-wider text-alterun-muted mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 bg-alterun-bg border border-alterun-border rounded text-alterun-muted placeholder-alterun-muted/50 focus:outline-none focus:border-alterun-gold/50"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-base uppercase tracking-wider text-alterun-muted mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 bg-alterun-bg border border-alterun-border rounded text-alterun-muted placeholder-alterun-muted/50 focus:outline-none focus:border-alterun-gold/50"
        />
      </div>
      {message && (
        <p
          className={`text-base ${
            message.type === "error" ? "text-red-400" : "text-alterun-gold-muted"
          }`}
        >
          {message.text}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="btn-hover w-full py-2.5 px-4 bg-alterun-gold/20 border border-alterun-gold/50 text-base text-alterun-gold uppercase tracking-wider rounded hover:bg-alterun-gold/30 hover:border-alterun-gold/60 hover:shadow-md disabled:opacity-50"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
