import Link from "next/link";
import { connection } from "next/server";
import { SiteHeader } from "@/components/SiteHeader";
import { formatDateRu } from "@/lib/format";
import { getPublishedPosts } from "@/lib/posts";

export const instant = false;

export default async function ListPage() {
  await connection();
  let posts: Awaited<ReturnType<typeof getPublishedPosts>> = [];
  let loadError = false;

  try {
    posts = await getPublishedPosts();
  } catch {
    loadError = true;
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <Link
          href="/"
          className="text-sm font-medium text-sky-700 hover:text-sky-800"
        >
          ← Басты
        </Link>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
          Бүкіл ақпарат тізімі
        </h1>
        <p className="mt-2 text-zinc-600">
          Барлық жарияланған жазбалар, жаңадан ескіге.
        </p>

        {loadError && (
          <p className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
            Тізім қотарылмады. MongoDB бағдарламасын тексеріңіз.
          </p>
        )}

        {!loadError && posts.length === 0 && (
          <p className="mt-8 text-zinc-500">Жазбалар әлі жоқ.</p>
        )}

        <ul className="mt-8 flex flex-col gap-6">
          {posts.map((post) => (
            <li
              key={post._id.toString()}
              className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm"
            >
              <p className="text-sm text-zinc-500">
                {formatDateRu(post.createdAt)}
              </p>
              <h2 className="mt-1 text-lg font-semibold text-zinc-900">
                {post.title}
              </h2>
              <p className="mt-3 whitespace-pre-wrap text-zinc-700 line-clamp-6">
                {post.content}
              </p>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
