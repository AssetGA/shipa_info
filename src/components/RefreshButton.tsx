"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type Props = {
  label: string;
  loadingLabel: string;
};

export function RefreshButton({ label, loadingLabel }: Props) {
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
      className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-6 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 disabled:opacity-60"
    >
      <span
        className={`inline-block text-base ${loading ? "animate-spin" : ""}`}
        aria-hidden
      >
        ↻
      </span>
      {loading ? loadingLabel : label}
    </button>
  );
}
