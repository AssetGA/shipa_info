import Link from "next/link";
import { connection } from "next/server";
import { BilingualPostBlock } from "@/components/BilingualPostBlock";
import { SiteHeader } from "@/components/SiteHeader";
import { getMessages } from "@/lib/i18n/messages";
import { getLocale } from "@/lib/i18n/locale";
import { getPublishedPosts } from "@/lib/posts";
import { buildPostsBilingualViews } from "@/lib/translate/post-view";

export const instant = false;

export default async function ListPage() {
  await connection();
  const locale = await getLocale();
  const t = getMessages(locale);

  let views: Awaited<ReturnType<typeof buildPostsBilingualViews>> = [];
  let loadError = false;

  try {
    const posts = await getPublishedPosts();
    views = await buildPostsBilingualViews(posts);
  } catch {
    loadError = true;
  }

  return (
    <>
      <SiteHeader locale={locale} messages={t} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <Link
          href="/"
          className="text-sm font-medium text-sky-700 hover:text-sky-800"
        >
          {t.backHome}
        </Link>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
          {t.listTitle}
        </h1>
        <p className="mt-2 text-zinc-600">{t.listSubtitle}</p>
        <p className="mt-1 text-xs text-zinc-500">{t.postStoredNote}</p>

        {loadError && (
          <p className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
            {t.listLoadError}
          </p>
        )}

        {!loadError && views.length === 0 && (
          <p className="mt-8 text-zinc-500">{t.listEmpty}</p>
        )}

        <ul className="mt-8 flex flex-col gap-6">
          {views.map((view) => (
            <li
              key={view.id}
              className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm"
            >
              <BilingualPostBlock
                view={view}
                locale={locale}
                messages={t}
                compact
              />
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
