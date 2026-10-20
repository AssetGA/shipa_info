import { createHash } from "crypto";
import { unstable_cache } from "next/cache";

const CHUNK_SIZE = 450;

async function translateChunkRuKk(text: string): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return text;

  const url = new URL("https://api.mymemory.translated.net/get");
  url.searchParams.set("q", trimmed);
  url.searchParams.set("langpair", "ru|kk");

  const res = await fetch(url.toString(), {
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) {
    throw new Error(`Translate HTTP ${res.status}`);
  }

  const data = (await res.json()) as {
    responseStatus?: number;
    responseData?: { translatedText?: string };
  };

  if (
    data.responseStatus === 200 &&
    typeof data.responseData?.translatedText === "string"
  ) {
    return data.responseData.translatedText;
  }

  throw new Error("Translate API error");
}

function splitForTranslation(text: string): string[] {
  if (text.length <= CHUNK_SIZE) {
    return [text];
  }

  const chunks: string[] = [];
  let rest = text;

  while (rest.length > CHUNK_SIZE) {
    let cut = rest.lastIndexOf("\n", CHUNK_SIZE);
    if (cut < CHUNK_SIZE / 2) {
      cut = rest.lastIndexOf(" ", CHUNK_SIZE);
    }
    if (cut < CHUNK_SIZE / 2) {
      cut = CHUNK_SIZE;
    }
    chunks.push(rest.slice(0, cut));
    rest = rest.slice(cut);
  }
  if (rest) chunks.push(rest);
  return chunks;
}

async function translateRuToKkUncached(text: string): Promise<string> {
  const parts = splitForTranslation(text);
  const translated: string[] = [];
  for (const part of parts) {
    translated.push(await translateChunkRuKk(part));
  }
  return translated.join("");
}

function cacheKey(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

/** Перевод для отображения; в MongoDB ничего не пишется. Кэш Next.js ~30 дней. */
export async function translateRuToKk(text: string): Promise<string> {
  if (!text.trim()) return text;

  return unstable_cache(
    () => translateRuToKkUncached(text),
    ["translate-ru-kk", cacheKey(text)],
    { revalidate: 60 * 60 * 24 * 30 },
  )();
}
