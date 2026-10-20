"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function RefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [clicked, setClicked] = useState(false);

  function handleRefresh() {
    setClicked(true);
    startTransition(() => {
      router.refresh();
      setClicked(false);
    });
  }

  const loading = isPending || clicked;

  return (
    <button
      type="button"
      onClick={handleRefresh}
      disabled={loading}
      aria-label="Жаңарту — соңғы жазбаны MongoDB-тен қайта жүктеу"
      className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-6 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 disabled:opacity-60"
    >
      <span
        className={`inline-block text-base ${loading ? "animate-spin" : ""}`}
        aria-hidden
      >
        ↻
      </span>
      {loading ? "Жүктелуде..." : "Жаңарту"}
    </button>
  );
}
