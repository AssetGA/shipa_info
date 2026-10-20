import Link from "next/link";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import type { Messages } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/locale";

type Props = {
  locale: Locale;
  messages: Pick<
    Messages,
    "siteName" | "navList" | "langRu" | "langKk" | "langSwitchLabel"
  >;
};

export function SiteHeader({ locale, messages }: Props) {
  return (
    <header className="border-b border-zinc-200/80 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="text-lg font-semibold text-zinc-900">
          {messages.siteName}
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            href="/list"
            className="text-sm font-medium text-sky-700 hover:text-sky-800"
          >
            {messages.navList}
          </Link>
          <LanguageSwitcher
            locale={locale}
            labels={{
              langRu: messages.langRu,
              langKk: messages.langKk,
              langSwitchLabel: messages.langSwitchLabel,
            }}
          />
        </nav>
      </div>
    </header>
  );
}
