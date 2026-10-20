import type { InfoPostPublic } from "@/lib/types";
import { translateRuToKk } from "./ru-to-kk";

export type PostBilingualView = {
  id: string;
  createdAt: Date;
  ru: { title: string; content: string };
  kk: { title: string; content: string; fallback: boolean };
};

export async function buildPostBilingualView(
  post: InfoPostPublic,
): Promise<PostBilingualView> {
  let kkTitle = post.title;
  let kkContent = post.content;
  let fallback = false;

  try {
    [kkTitle, kkContent] = await Promise.all([
      translateRuToKk(post.title),
      translateRuToKk(post.content),
    ]);
  } catch {
    fallback = true;
  }

  return {
    id: post._id.toString(),
    createdAt: post.createdAt,
    ru: { title: post.title, content: post.content },
    kk: { title: kkTitle, content: kkContent, fallback },
  };
}

export async function buildPostsBilingualViews(
  posts: InfoPostPublic[],
): Promise<PostBilingualView[]> {
  return Promise.all(posts.map((post) => buildPostBilingualView(post)));
}
