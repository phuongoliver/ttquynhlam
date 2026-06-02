import { NextResponse } from "next/server";
import {
  fetchUserPosts,
  fetchUserProfile,
  mapPosts,
  ThreadsAPIError,
  type SyncResult,
  type SyncError,
} from "@/lib/threads";

export async function GET() {
  const token = process.env.THREADS_ACCESS_TOKEN;
  const userId = process.env.THREADS_USER_ID;

  if (!token || !userId) {
    return NextResponse.json(
      {
        success: false,
        error: "Threads API chưa được cấu hình.",
        hint: "Thêm THREADS_ACCESS_TOKEN và THREADS_USER_ID vào .env.local rồi restart server.",
      } satisfies SyncError,
      { status: 503 }
    );
  }

  try {
    const [rawPosts, profile] = await Promise.all([
      fetchUserPosts(userId, token),
      fetchUserProfile(userId, token),
    ]);

    const posts = mapPosts(rawPosts);
    const topPost = posts[0]
      ? { title: posts[0].title, views: posts[0].views, url: posts[0].url }
      : null;

    return NextResponse.json({
      success: true,
      handle: `@${profile.username}`,
      posts,
      topPost,
      fetchedAt: new Date().toISOString(),
    } satisfies SyncResult);
  } catch (err) {
    if (err instanceof ThreadsAPIError) {
      /* Expired / invalid token */
      if (err.status === 401 || err.status === 400 || err.status === 190) {
        return NextResponse.json(
          {
            success: false,
            error: "Token đã hết hạn hoặc không hợp lệ.",
            hint: "Vào Meta Developer Console → Threads → Refresh long-lived token, rồi cập nhật THREADS_ACCESS_TOKEN trong .env.local.",
          } satisfies SyncError,
          { status: 401 }
        );
      }
      return NextResponse.json(
        { success: false, error: err.message } satisfies SyncError,
        { status: err.status >= 400 && err.status < 600 ? err.status : 500 }
      );
    }

    const message =
      err instanceof Error ? err.message : "Lỗi không xác định.";
    return NextResponse.json(
      { success: false, error: message } satisfies SyncError,
      { status: 500 }
    );
  }
}
