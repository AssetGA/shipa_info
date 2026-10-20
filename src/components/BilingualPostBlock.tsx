import { formatDate } from "@/lib/format";
import type { Messages } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/locale";
import type { PostBilingualView } from "@/lib/translate/post-view";

type Props = {
  view: PostBilingualView;
  locale: Locale;
  messages: Pick<
    Messages,
    "postLangRu" | "postLangKk" | "translationFailed"
  >;
  compact?: boolean;
};

export function BilingualPostBlock({
  view,
  locale,
  messages,
  compact = false,
}: Props) {
  const date = formatDate(view.createdAt, locale);

  return (
    <article className="flex flex-col gap-4">
      <p className="text-sm text-zinc-500">{date}</p>

      <section aria-labelledby={`post-${view.id}-ru`}>
        <h3
          id={`post-${view.id}-ru`}
          className="text-xs font-semibold uppercase tracking-wide text-zinc-500"
        >
          {messages.postLangRu}
        </h3>
        <h2
          className={`mt-1 font-semibold text-zinc-900 ${compact ? "text-lg" : "text-xl sm:text-2xl"}`}
        >
          {view.ru.title}
        </h2>
        <p
          className={`mt-3 whitespace-pre-wrap text-zinc-700 ${compact ? "line-clamp-6 text-sm leading-relaxed" : "text-base leading-relaxed"}`}
        >
          {view.ru.content}
        </p>
      </section>

      <section
        className="border-t border-zinc-100 pt-4"
        aria-labelledby={`post-${view.id}-kk`}
      >
        <h3
          id={`post-${view.id}-kk`}
          className="text-xs font-semibold uppercase tracking-wide text-sky-800"
        >
          {messages.postLangKk}
        </h3>
        {view.kk.fallback && (
          <p className="mt-1 text-xs text-amber-700">
            {messages.translationFailed}
          </p>
        )}
        <h2
          className={`mt-1 font-semibold text-zinc-900 ${compact ? "text-lg" : "text-xl sm:text-2xl"}`}
        >
          {view.kk.title}
        </h2>
        <p
          className={`mt-3 whitespace-pre-wrap text-zinc-700 ${compact ? "line-clamp-6 text-sm leading-relaxed" : "text-base leading-relaxed"}`}
        >
          {view.kk.content}
        </p>
      </section>
    </article>
  );
}
