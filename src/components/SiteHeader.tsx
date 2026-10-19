import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-zinc-200/80 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-lg font-semibold text-zinc-900">
          Shipa Info
        </Link>
        <nav>
          <Link
            href="/list"
            className="text-sm font-medium text-sky-700 hover:text-sky-800"
          >
            Весь список
          </Link>
        </nav>
      </div>
    </header>
  );
}
