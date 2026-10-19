import { MongoClient, ObjectId, type Collection } from "mongodb";

export interface InfoPostDoc {
  _id?: ObjectId;
  title: string;
  content: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  source: "telegram";
  telegramMessageId?: number;
  telegramChatId?: number;
  telegramUserId?: number;
}

const dbName = process.env.MONGODB_DB_NAME ?? "shipa_info";
export const POSTS_COLLECTION = "posts";

let client: MongoClient | null = null;

export async function getPostsCollection(): Promise<Collection<InfoPostDoc>> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client.db(dbName).collection<InfoPostDoc>(POSTS_COLLECTION);
}

export function parseTitleAndContent(text: string): {
  title: string;
  content: string;
} {
  const trimmed = text.trim();
  const lines = trimmed.split("\n");
  const first = lines[0]?.trim() ?? "Без названия";
  const rest = lines.slice(1).join("\n").trim();

  if (rest.length > 0) {
    return {
      title: first.slice(0, 200),
      content: rest,
    };
  }

  const title =
    first.length > 80 ? `${first.slice(0, 77)}…` : first || "Обновление";
  return { title, content: trimmed };
}
