import { config as loadEnv } from "dotenv";
import { resolve } from "path";

loadEnv({ path: resolve(import.meta.dirname, "../../.env") });
loadEnv();
import { Telegraf } from "telegraf";
import { ObjectId } from "mongodb";
import {
  getPostsCollection,
  parseTitleAndContent,
  type InfoPostDoc,
} from "./db.js";

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  throw new Error("TELEGRAM_BOT_TOKEN is not set");
}

const adminIds = new Set(
  (process.env.TELEGRAM_ADMIN_IDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map(Number)
    .filter((n) => !Number.isNaN(n))
);

if (adminIds.size === 0) {
  throw new Error("TELEGRAM_ADMIN_IDS must list at least one Telegram user id");
}

function isAdmin(userId: number | undefined): boolean {
  return userId !== undefined && adminIds.has(userId);
}

const bot = new Telegraf(token);

bot.start(async (ctx) => {
  if (!isAdmin(ctx.from?.id)) {
    await ctx.reply("Бот только для администраторов.");
    return;
  }
  await ctx.reply(
    [
      "Shipa Info — публикация материалов",
      "",
      "• Отправьте текст: первая строка — заголовок, остальное — содержание.",
      "• Если одна строка — она станет и заголовком, и текстом.",
      "• Запись сохраняется как черновик.",
      "",
      "/publish — опубликовать последний черновик",
      "/publish <id> — опубликовать по id",
      "Ответьте /publish на сообщение бота с черновиком",
      "/drafts — список черновиков",
      "/help — эта справка",
    ].join("\n")
  );
});

bot.command("help", async (ctx) => {
  if (!isAdmin(ctx.from?.id)) return;
  await ctx.reply("Используйте /start для инструкции.");
});

bot.command("drafts", async (ctx) => {
  if (!isAdmin(ctx.from?.id)) return;
  const col = await getPostsCollection();
  const drafts = await col
    .find({ published: false })
    .sort({ createdAt: -1 })
    .limit(10)
    .toArray();

  if (drafts.length === 0) {
    await ctx.reply("Черновиков нет.");
    return;
  }

  const lines = drafts.map(
    (d) =>
      `• ${d._id?.toString()} — ${d.title} (${d.createdAt
        .toISOString()
        .slice(0, 10)})`
  );
  await ctx.reply(["Последние черновики:", ...lines].join("\n"));
});

async function publishPost(postId: ObjectId): Promise<InfoPostDoc | null> {
  const col = await getPostsCollection();
  const now = new Date();
  const result = await col.findOneAndUpdate(
    { _id: postId, published: false },
    { $set: { published: true, updatedAt: now } },
    { returnDocument: "after" }
  );
  return result ?? null;
}

bot.command("publish", async (ctx) => {
  if (!isAdmin(ctx.from?.id)) return;

  const reply = ctx.message.reply_to_message;
  const text = "text" in ctx.message ? ctx.message.text : "";
  const arg = text.split(/\s+/).slice(1).join(" ").trim();

  let postId: ObjectId | null = null;

  if (reply && "text" in reply && reply.text) {
    const match = reply.text.match(
      /Черновик сохранён\.\s*ID:\s*([a-f0-9]{24})/i
    );
    if (match?.[1]) {
      postId = new ObjectId(match[1]);
    }
  }

  if (!postId && arg && ObjectId.isValid(arg)) {
    postId = new ObjectId(arg);
  }

  if (!postId) {
    const col = await getPostsCollection();
    const latest = await col.findOne(
      { published: false },
      { sort: { createdAt: -1 } }
    );
    if (latest?._id) {
      postId = latest._id;
    }
  }

  if (!postId) {
    await ctx.reply("Нет черновика для публикации.");
    return;
  }

  const published = await publishPost(postId);
  if (!published) {
    await ctx.reply("Черновик не найден или уже опубликован.");
    return;
  }

  await ctx.reply(
    `Опубликовано: «${published.title}»\nID: ${published._id?.toString()}`
  );
});

bot.on("text", async (ctx) => {
  const userId = ctx.from?.id;
  if (!isAdmin(userId)) {
    await ctx.reply("Доступ запрещён.");
    return;
  }

  const raw = "text" in ctx.message ? ctx.message.text.trim() : "";
  if (!raw || raw.startsWith("/")) {
    return;
  }

  const { title, content } = parseTitleAndContent(raw);
  const now = new Date();
  const doc: InfoPostDoc = {
    title,
    content,
    published: false,
    createdAt: now,
    updatedAt: now,
    source: "telegram",
    telegramMessageId: ctx.message.message_id,
    telegramChatId: ctx.chat.id,
    telegramUserId: userId,
  };

  const col = await getPostsCollection();
  const insert = await col.insertOne(doc);

  await ctx.reply(
    [
      "Черновик сохранён.",
      `ID: ${insert.insertedId.toString()}`,
      `Заголовок: ${title}`,
      "",
      "Команда /publish опубликует запись на сайте.",
    ].join("\n")
  );
});

async function ensureIndexes() {
  const col = await getPostsCollection();
  await col.createIndex({ published: 1, createdAt: -1 });
}

ensureIndexes()
  .then(() => bot.launch())
  .then(() => {
    console.log("Telegram bot started (long polling)");
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
