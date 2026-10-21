"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getAdvanceSlides,
  getAdvanceUi,
  type AdvanceSlide,
} from "@/lib/advance/slides";
import type { Locale } from "@/lib/i18n/locale";

type Props = {
  locale: Locale;
};

const sectionStyles: Record<
  AdvanceSlide["section"],
  { badge: string; ring: string }
> = {
  intro: {
    badge: "bg-sky-100 text-sky-900",
    ring: "ring-sky-200",
  },
  how: {
    badge: "bg-emerald-100 text-emerald-900",
    ring: "ring-emerald-200",
  },
  confirm: {
    badge: "bg-violet-100 text-violet-900",
    ring: "ring-violet-200",
  },
  limits: {
    badge: "bg-amber-100 text-amber-900",
    ring: "ring-amber-200",
  },
};

export function AdvanceSlider({ locale }: Props) {
  const [index, setIndex] = useState(0);
  const ui = getAdvanceUi(locale);
  const allSlides = getAdvanceSlides(locale);
  const intro = allSlides[0];
  const steps = allSlides.slice(1);
  const slide = steps[index] ?? steps[0];
  const styles = sectionStyles[slide.section];

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") {
        setIndex((i) => Math.min(i + 1, steps.length - 1));
      }
      if (e.key === "ArrowLeft") {
        setIndex((i) => Math.max(i - 1, 0));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [steps.length]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 px-4 py-6 sm:px-6">
        <div className="mx-auto flex max-w-2xl flex-col gap-6">
          <section className="rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-white p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl">
              {intro.title}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-zinc-800">
              {intro.body}
            </p>
            {intro.hint && (
              <p className="mt-3 rounded-lg bg-white/80 p-3 text-sm leading-relaxed text-sky-950/90">
                {intro.hint}
              </p>
            )}
          </section>

          <section
            className={`rounded-2xl border bg-white p-6 shadow-sm ring-1 sm:p-8 ${styles.ring}`}
            aria-live="polite"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${styles.badge}`}
              >
                {slide.sectionLabel}
              </span>
              <span className="text-sm font-medium text-zinc-500">
                {ui.stepCounter(index + 1, steps.length)}
              </span>
            </div>

            <h3 className="mt-4 text-2xl font-semibold leading-snug text-zinc-900 sm:text-3xl">
              {slide.title}
            </h3>

            <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-zinc-700 sm:text-lg">
              {slide.body}
            </p>

            {slide.hint && (
              <p className="mt-4 rounded-xl bg-zinc-50 p-4 text-sm leading-relaxed text-zinc-600">
                {slide.hint}
              </p>
            )}
          </section>

          <div
            className="flex flex-wrap justify-center gap-2 py-1"
            role="tablist"
            aria-label={ui.stepCounter(index + 1, steps.length)}
          >
            {steps.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={ui.stepCounter(i + 1, steps.length)}
                onClick={() => setIndex(i)}
                className={`h-2.5 rounded-full transition-all ${
                  i === index
                    ? "w-8 bg-sky-600"
                    : "w-2.5 bg-zinc-300 hover:bg-zinc-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <footer className="shrink-0 border-t border-zinc-200 bg-white px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
        <div className="mx-auto flex max-w-2xl gap-3">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            className="inline-flex h-12 flex-1 items-center justify-center rounded-xl border border-zinc-200 bg-white text-sm font-semibold text-zinc-800 disabled:opacity-40 sm:flex-none sm:px-8"
          >
            {ui.prev}
          </button>
          {index >= steps.length - 1 ? (
            <Link
              href="/"
              className="inline-flex h-12 flex-1 items-center justify-center rounded-xl bg-zinc-900 text-sm font-semibold text-white hover:bg-zinc-800 sm:flex-none sm:px-8"
            >
              {ui.backHome}
            </Link>
          ) : (
            <button
              type="button"
              onClick={() =>
                setIndex((i) => Math.min(steps.length - 1, i + 1))
              }
              className="inline-flex h-12 flex-1 items-center justify-center rounded-xl bg-zinc-900 text-sm font-semibold text-white hover:bg-zinc-800 sm:flex-none sm:px-8"
            >
              {ui.next}
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
