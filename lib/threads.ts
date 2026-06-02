const BASE = "https://graph.threads.net/v1.0";

/* ─── Public types ──────────────────────────────────────── */

export type ThreadsRawPost = {
  id: string;
  text: string;
  timestamp: string;
  permalink: string;
  views: number;
  likes_count: number;
  replies_count: number;
  reposts_count: number;
};

export type SyncPost = {
  title: string;
  views: number;
  likes: number;
  comments: number;
  reposts: number;
  url: string;
};

export type SyncResult = {
  success: true;
  handle: string;
  posts: SyncPost[];
  topPost: { title: string; views: number; url: string } | null;
  fetchedAt: string;
};

export type SyncError = {
  success: false;
  error: string;
  hint?: string;
};

/* ─── Error class ───────────────────────────────────────── */

export class ThreadsAPIError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "ThreadsAPIError";
  }
}

/* ─── Internal fetch helper ─────────────────────────────── */

async function apiFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = (await res.json()) as {
        error?: { message?: string; code?: number };
      };
      message = body.error?.message ?? message;
    } catch {
      /* ignore parse errors */
    }
    throw new ThreadsAPIError(res.status, message);
  }
  return res.json() as Promise<T>;
}

/* ─── Exported API functions ────────────────────────────── */

export async function fetchUserPosts(
  userId: string,
  token: string
): Promise<ThreadsRawPost[]> {
  const fields =
    "id,text,timestamp,permalink,views,likes_count,replies_count,reposts_count";
  const url = `${BASE}/${userId}/threads?fields=${encodeURIComponent(fields)}&limit=25&access_token=${token}`;
  const data = await apiFetch<{ data: ThreadsRawPost[] }>(url);
  return data.data ?? [];
}

export async function fetchUserProfile(
  userId: string,
  token: string
): Promise<{ username: string }> {
  const url = `${BASE}/${userId}?fields=username&access_token=${token}`;
  return apiFetch<{ username: string }>(url);
}

/**
 * Refresh a long-lived token before it expires (valid 60 days).
 * Call this proactively — Meta requires the token to still be valid.
 */
export async function refreshLongLivedToken(token: string): Promise<{
  access_token: string;
  token_type: string;
  expires_in: number;
}> {
  const url = `${BASE}/refresh_access_token?grant_type=th_refresh_token&access_token=${token}`;
  return apiFetch(url);
}

/* ─── Map raw posts → SyncPost[] ───────────────────────── */

export function mapPosts(raw: ThreadsRawPost[]): SyncPost[] {
  return raw
    .filter((p) => p.text?.trim())
    .map((p) => ({
      title: p.text.length > 60 ? p.text.slice(0, 58) + "…" : p.text,
      views: p.views ?? 0,
      likes: p.likes_count ?? 0,
      comments: p.replies_count ?? 0,
      reposts: p.reposts_count ?? 0,
      url: p.permalink,
    }))
    .sort((a, b) => b.views - a.views);
}
