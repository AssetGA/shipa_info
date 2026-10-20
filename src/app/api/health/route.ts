import { connection } from "next/server";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  await connection();

  if (!process.env.MONGODB_URI) {
    return NextResponse.json(
      {
        mongo: "error",
        message: "MONGODB_URI не задан в Environment Variables Vercel",
      },
      { status: 503 },
    );
  }

  try {
    const db = await getDb();
    await db.command({ ping: 1 });
    return NextResponse.json({ mongo: "ok" });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Не удалось подключиться к MongoDB";
    const hints: string[] = [];

    if (/MONGODB_URI is not set/i.test(message)) {
      hints.push(
        "Vercel: Settings → Environment Variables → MONGODB_URI, галочка Production, затем Redeploy.",
      );
    }
    if (/bad auth|Authentication failed|auth failed/i.test(message)) {
      hints.push(
        "Проверьте логин/пароль в URI. Спецсимволы в пароле — URL-encode. Для Atlas — пользователь Database Access, не root.",
      );
    }
    if (
      /timed out|ETIMEDOUT|ECONNREFUSED|Server selection/i.test(message)
    ) {
      hints.push(
        "MongoDB Atlas → Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0). Vercel ходит с разных IP — без этого локально работает, на Vercel нет.",
      );
    }
    if (/SSL|TLS|certificate/i.test(message)) {
      hints.push("Для Atlas используйте строку mongodb+srv://... из Connect → Drivers.");
    }

    return NextResponse.json(
      { mongo: "error", message, hints: hints.length ? hints : undefined },
      { status: 503 },
    );
  }
}
