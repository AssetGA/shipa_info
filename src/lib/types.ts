import type { ObjectId } from "mongodb";

export interface InfoPost {
  _id: ObjectId;
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

export type InfoPostPublic = Pick<
  InfoPost,
  "_id" | "title" | "content" | "createdAt" | "updatedAt"
>;
