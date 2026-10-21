import Link from "next/link";
import { connection } from "next/server";
import { AdvanceNavLink } from "@/components/AdvanceNavLink";
import { InfoWindow } from "@/components/InfoWindow";
import { RefreshButton } from "@/components/RefreshButton";
import { SiteHeader } from "@/components/SiteHeader";
import { getMessages } from "@/lib/i18n/messages";
import { getLocale } from "@/lib/i18n/locale";
import { getLatestPublishedPost } from "@/lib/posts";
import { buildPostBilingualView } from "@/lib/translate/post-view";

export const instant = false;

export default async function Home() {
  await connection();
  const locale = await getLocale();
  const t = getMessages(locale);

  let view = null;
  let loadError = false;

  try {
    const post = await getLatestPublishedPost();
    if (post) {
      view = await buildPostBilingualView(post);
    }
  } catch {
    loadError = true;
  }

  return (
    <>
      <SiteHeader
        locale={locale}
        messages={t}
        brandExtra={<AdvanceNavLink locale={locale} />}
      />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            {t.homeTitle}
          </h1>
          <p className="mt-2 text-zinc-600">{t.homeSubtitle}</p>
        </div>

        {loadError ? (
          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
            {t.loadError}
          </section>
        ) : (
          <InfoWindow view={view} locale={locale} messages={t} />
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <RefreshButton label={t.refresh} loadingLabel={t.refreshing} />
          <Link
            href="/list"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-zinc-900 px-6 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            {t.viewAllList}
          </Link>
        </div>
      </main>
      <footer className="mt-auto border-t border-zinc-200/80 py-6 text-center text-sm text-zinc-500">
        alma-le.com
      </footer>
    </>
  );
}
