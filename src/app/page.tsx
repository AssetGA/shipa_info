import Link from "next/link";
import { connection } from "next/server";
import { InfoWindow } from "@/components/InfoWindow";
import { SiteHeader } from "@/components/SiteHeader";
import { RefreshButton } from "@/components/RefreshButton";
import { getLatestPublishedPost } from "@/lib/posts";

export const instant = false;

export default async function Home() {
  await connection();
  let post = null;
  let loadError = false;

  try {
    post = await getLatestPublishedPost();
  } catch {
    loadError = true;
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            Шипагер қызметкерлері үшін ақпарат
          </h1>
          <p className="mt-2 text-zinc-600">
            Соңғы жарияланған жазба. Толық мұрағат - төмендегі батырмамен.
          </p>
        </div>

        {loadError ? (
          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
            Деректер қотарылмады. MongoDB қосылымын тексеріңіз.
          </section>
        ) : (
          <InfoWindow post={post} />
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <RefreshButton />
          <Link
            href="/list"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-zinc-900 px-6 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Барлық ақпарат тізімін қарау
          </Link>
        </div>
      </main>
      <footer className="mt-auto border-t border-zinc-200/80 py-6 text-center text-sm text-zinc-500">
        alma-le.com
      </footer>
    </>
  );
}
