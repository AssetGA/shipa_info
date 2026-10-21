import Link from "next/link";
import { connection } from "next/server";
import { AdvanceSlider } from "@/components/AdvanceSlider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { getAdvanceUi } from "@/lib/advance/slides";
import { getMessages } from "@/lib/i18n/messages";
import { getLocale } from "@/lib/i18n/locale";

export const instant = false;

export default async function AdvancePage() {
  await connection();
  const locale = await getLocale();
  const t = getMessages(locale);
  const ui = getAdvanceUi(locale);

  return (
    <div className="flex min-h-full flex-col bg-zinc-50">
      <header className="shrink-0 border-b border-zinc-200 bg-white px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-2xl items-start justify-between gap-4">
          <div>
            <Link
              href="/"
              className="text-sm font-medium text-sky-700 hover:text-sky-800"
            >
              {ui.backHome}
            </Link>
            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-sky-700">
              {ui.modalSubtitle}
            </p>
            <h1 className="mt-1 text-xl font-semibold text-zinc-900 sm:text-2xl">
              {ui.modalTitle}
            </h1>
          </div>
          <LanguageSwitcher
            locale={locale}
            labels={{
              langRu: t.langRu,
              langKk: t.langKk,
              langSwitchLabel: t.langSwitchLabel,
            }}
          />
        </div>
      </header>

      <AdvanceSlider locale={locale} />
    </div>
  );
}
