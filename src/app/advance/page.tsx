import Link from "next/link";
import { connection } from "next/server";
import { AdvanceDocumentViewer } from "@/components/AdvanceDocumentViewer";
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
    <div className="flex min-h-dvh flex-col bg-zinc-50">
      <header className="shrink-0 border-b border-zinc-200 bg-white px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
          <Link
            href="/"
            className="text-sm font-medium text-sky-700 hover:text-sky-800"
          >
            {ui.backHome}
          </Link>
          <p className="truncate text-center text-sm font-semibold text-zinc-900 sm:text-base">
            {ui.modalTitle}
          </p>
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

      <AdvanceDocumentViewer locale={locale} />
    </div>
  );
}
