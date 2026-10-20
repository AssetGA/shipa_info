import { formatDateRu } from "@/lib/format";
import type { InfoPostPublic } from "@/lib/types";

type Props = {
  post: InfoPostPublic | null;
  emptyMessage?: string;
};

export function InfoWindow({ post, emptyMessage }: Props) {
  if (!post) {
    return (
      <section
        className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm sm:p-8"
        aria-label="Информационное окно"
      >
        <p className="text-zinc-500">
          {emptyMessage ??
            "Пока нет опубликованных записей. Добавьте материал через Telegram-бота."}
        </p>
      </section>
    );
  }

  return (
    <section
      className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm sm:p-8"
      aria-label="Информационное окно"
    >
      <header className="mb-4 border-b border-zinc-100 pb-4">
        <p className="text-sm text-zinc-500">{formatDateRu(post.createdAt)}</p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">
          {post.title}
        </h2>
      </header>
      <article className="whitespace-pre-wrap text-base leading-relaxed text-zinc-700">
        {post.content}
      </article>
    </section>
  );
}
