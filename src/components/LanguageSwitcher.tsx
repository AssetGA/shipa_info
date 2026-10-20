"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setLocale } from "@/app/actions/set-locale";
import type { Locale } from "@/lib/i18n/locale";
import type { Messages } from "@/lib/i18n/messages";

type Props = {
  locale: Locale;
  labels: Pick<Messages, "langRu" | "langKk" | "langSwitchLabel">;
};

export function LanguageSwitcher({ locale, labels }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function switchTo(next: Locale) {
    if (next === locale) return;
    startTransition(async () => {
      await setLocale(next);
      router.refresh();
    });
  }

  const base =
    "rounded-lg px-2.5 py-1 text-sm font-medium transition disabled:opacity-50";
  const active = "bg-zinc-900 text-white";
  const idle = "text-zinc-600 hover:bg-zinc-100";

  return (
    <div
      className="flex items-center gap-1 rounded-xl border border-zinc-200 bg-white p-1"
      role="group"
      aria-label={labels.langSwitchLabel}
    >
      <button
        type="button"
        disabled={isPending}
        className={`${base} ${locale === "ru" ? active : idle}`}
        onClick={() => switchTo("ru")}
      >
        {labels.langRu}
      </button>
      <button
        type="button"
        disabled={isPending}
        className={`${base} ${locale === "kk" ? active : idle}`}
        onClick={() => switchTo("kk")}
      >
        {labels.langKk}
      </button>
    </div>
  );
}
