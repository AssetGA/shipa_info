import { cookies } from "next/headers";

export type Locale = "ru" | "kk";

export const LOCALE_COOKIE = "shipa_locale";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return value === "kk" ? "kk" : "ru";
}
