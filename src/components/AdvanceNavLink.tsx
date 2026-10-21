import Link from "next/link";
import { getAdvanceUi } from "@/lib/advance/slides";
import type { Locale } from "@/lib/i18n/locale";

type Props = {
  locale: Locale;
};

export function AdvanceNavLink({ locale }: Props) {
  const ui = getAdvanceUi(locale);

  return (
    <Link
      href="/advance"
      className="rounded-lg bg-sky-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
      aria-label={ui.openHint}
    >
      {ui.button}
    </Link>
  );
}
