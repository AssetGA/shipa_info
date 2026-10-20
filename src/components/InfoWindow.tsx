import { BilingualPostBlock } from "@/components/BilingualPostBlock";
import type { Messages } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/locale";
import type { PostBilingualView } from "@/lib/translate/post-view";

type Props = {
  view: PostBilingualView | null;
  locale: Locale;
  messages: Pick<
    Messages,
    | "emptyPost"
    | "postLangRu"
    | "postLangKk"
    | "postStoredNote"
    | "translationFailed"
  >;
};

export function InfoWindow({ view, locale, messages }: Props) {
  if (!view) {
    return (
      <section
        className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm sm:p-8"
        aria-label={messages.postLangRu}
      >
        <p className="text-zinc-500">{messages.emptyPost}</p>
      </section>
    );
  }

  return (
    <section
      className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm sm:p-8"
      aria-label={messages.postLangRu}
    >
      <p className="mb-4 text-xs text-zinc-500">{messages.postStoredNote}</p>
      <BilingualPostBlock
        view={view}
        locale={locale}
        messages={messages}
      />
    </section>
  );
}
