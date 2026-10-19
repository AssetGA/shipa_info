import { connection } from "next/server";
import { NextResponse } from "next/server";
import { getPublishedPosts } from "@/lib/posts";

export async function GET() {
  await connection();
  try {
    const posts = await getPublishedPosts();
    return NextResponse.json({
      posts: posts.map((p) => ({
        id: p._id.toString(),
        title: p.title,
        content: p.content,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      })),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to load posts" },
      { status: 503 },
    );
  }
}
