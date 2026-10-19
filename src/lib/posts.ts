import { ObjectId } from "mongodb";
import { getDb, POSTS_COLLECTION } from "./mongodb";
import type { InfoPost, InfoPostPublic } from "./types";

function toPublic(post: InfoPost): InfoPostPublic {
  return {
    _id: post._id,
    title: post.title,
    content: post.content,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}

export async function getLatestPublishedPost(): Promise<InfoPostPublic | null> {
  const db = await getDb();
  const doc = await db.collection<InfoPost>(POSTS_COLLECTION).findOne(
    { published: true },
    { sort: { createdAt: -1 } },
  );
  return doc ? toPublic(doc) : null;
}

export async function getPublishedPosts(limit = 100): Promise<InfoPostPublic[]> {
  const db = await getDb();
  const docs = await db
    .collection<InfoPost>(POSTS_COLLECTION)
    .find({ published: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
  return docs.map(toPublic);
}

export async function getPublishedPostById(
  id: string,
): Promise<InfoPostPublic | null> {
  if (!ObjectId.isValid(id)) {
    return null;
  }
  const db = await getDb();
  const doc = await db.collection<InfoPost>(POSTS_COLLECTION).findOne({
    _id: new ObjectId(id),
    published: true,
  });
  return doc ? toPublic(doc) : null;
}
