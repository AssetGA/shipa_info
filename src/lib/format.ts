import type { Locale } from "@/lib/i18n/locale";

export function formatDate(date: Date, locale: Locale): string {
  const tag = locale === "kk" ? "kk-KZ" : "ru-RU";
  return new Intl.DateTimeFormat(tag, {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}
