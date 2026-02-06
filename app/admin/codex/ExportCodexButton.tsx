"use client";

import { useState } from "react";
import { exportCodex } from "@/lib/codex/actions";
import { IconDownload } from "@/components/icons";

export function ExportCodexButton() {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const data = await exportCodex();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `codex-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Export failed. Make sure you are logged in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="btn-hover flex items-center gap-2 rounded border border-alterun-border bg-alterun-bg-card px-4 py-2 text-xl text-alterun-muted transition-[border-color,background-color,color] duration-200 hover:border-alterun-gold/50 hover:bg-alterun-gold/10 hover:text-alterun-gold disabled:opacity-60 disabled:hover:border-alterun-border disabled:hover:bg-alterun-bg-card disabled:hover:text-alterun-muted"
    >
      <IconDownload className="h-5 w-5 flex-shrink-0" />
      {loading ? "Exporting…" : "Download database"}
    </button>
  );
}
