"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ADVANCE_PAGE_IMAGES,
  ADVANCE_PDF_URL,
} from "@/lib/advance/document";
import { getAdvanceUi } from "@/lib/advance/slides";
import type { Locale } from "@/lib/i18n/locale";
import { AdvanceSlider } from "@/components/AdvanceSlider";

type Props = {
  locale: Locale;
};

type ViewMode = "presentation" | "pdf" | "text";

export function AdvanceDocumentViewer({ locale }: Props) {
  const ui = getAdvanceUi(locale);
  const pages = ADVANCE_PAGE_IMAGES;
  const [mode, setMode] = useState<ViewMode>("presentation");
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const goPrev = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const goNext = useCallback(() => {
    setIndex((i) => Math.min(pages.length - 1, i + 1));
  }, [pages.length]);

  useEffect(() => {
    if (mode !== "presentation") return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, goNext, goPrev]);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  }

  function onTouchEnd(e: React.TouchEvent) {
    const start = touchStartX.current;
    if (start == null) return;
    const end = e.changedTouches[0]?.clientX ?? start;
    const delta = end - start;
    if (delta > 60) goPrev();
    if (delta < -60) goNext();
    touchStartX.current = null;
  }

  const modeButton = (id: ViewMode, label: string) => (
    <button
      type="button"
      onClick={() => setMode(id)}
      className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
        mode === id
          ? "bg-sky-600 text-white"
          : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-wrap justify-center gap-2 border-b border-zinc-200 bg-white px-4 py-3">
        {modeButton("presentation", ui.modePresentation)}
        {modeButton("pdf", ui.modePdf)}
        {modeButton("text", ui.modeText)}
      </div>

      {mode === "presentation" && (
        <>
          <div
            className="relative flex min-h-0 flex-1 items-center justify-center bg-zinc-900 px-2 py-4 sm:px-4"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div className="relative h-[min(72dvh,820px)] w-full max-w-4xl">
              <Image
                src={pages[index]}
                alt={ui.pageCounter(index + 1, pages.length)}
                fill
                className="object-contain"
                sizes="(max-width: 896px) 100vw, 896px"
                priority={index === 0}
              />
            </div>
          </div>

          <footer className="shrink-0 border-t border-zinc-200 bg-white px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <p className="mb-3 text-center text-sm text-zinc-500">
              {ui.pageCounter(index + 1, pages.length)}
            </p>
            <div className="mx-auto flex max-w-lg gap-3">
              <button
                type="button"
                disabled={index === 0}
                onClick={goPrev}
                className="inline-flex h-12 flex-1 items-center justify-center rounded-xl border border-zinc-200 text-sm font-semibold disabled:opacity-40"
              >
                {ui.prev}
              </button>
              <button
                type="button"
                disabled={index >= pages.length - 1}
                onClick={goNext}
                className="inline-flex h-12 flex-1 items-center justify-center rounded-xl bg-zinc-900 text-sm font-semibold text-white disabled:opacity-40"
              >
                {ui.next}
              </button>
            </div>
            <div className="mt-3 flex justify-center gap-2">
              {pages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={ui.pageCounter(i + 1, pages.length)}
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? "w-6 bg-sky-600" : "w-2 bg-zinc-300"
                  }`}
                />
              ))}
            </div>
          </footer>
        </>
      )}

      {mode === "pdf" && (
        <div className="flex min-h-0 flex-1 flex-col bg-zinc-100">
          <p className="shrink-0 px-4 py-2 text-center text-xs text-zinc-600 sm:text-sm">
            {ui.pdfHint}{" "}
            <a
              href={ADVANCE_PDF_URL}
              download
              className="font-medium text-sky-700 underline"
            >
              {ui.downloadPdf}
            </a>
          </p>
          <iframe
            title={ui.modalTitle}
            src={`${ADVANCE_PDF_URL}#view=FitH`}
            className="min-h-[75dvh] w-full flex-1 border-0 bg-white"
          />
        </div>
      )}

      {mode === "text" && (
        <div className="flex min-h-0 flex-1 flex-col">
          <AdvanceSlider locale={locale} />
        </div>
      )}

      {mode === "presentation" && index >= pages.length - 1 && (
        <div className="border-t border-zinc-200 bg-white px-4 py-3 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-sky-700 hover:text-sky-800"
          >
            {ui.backHome}
          </Link>
        </div>
      )}
    </div>
  );
}
