"use client";
import { useState } from "react";
import { formatNumber } from "@/lib/utils";
import type { SyncResult, SyncError } from "@/lib/threads";

type ApiResponse = SyncResult | SyncError;

type Status = "idle" | "loading" | "preview" | "error";

type Props = {
  onApply: (result: SyncResult) => void;
};

export default function SyncButton({ onApply }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<SyncResult | null>(null);
  const [errMsg, setErrMsg] = useState("");
  const [hint, setHint] = useState("");

  async function handleSync() {
    setStatus("loading");
    try {
      const res = await fetch("/api/threads-sync");
      const json = (await res.json()) as ApiResponse;

      if (!json.success) {
        setErrMsg((json as SyncError).error);
        setHint((json as SyncError).hint ?? "");
        setStatus("error");
        return;
      }

      setResult(json as SyncResult);
      setStatus("preview");
    } catch {
      setErrMsg("Không kết nối được đến server.");
      setHint("");
      setStatus("error");
    }
  }

  if (status === "idle") {
    return (
      <button
        onClick={handleSync}
        className="text-sm px-4 py-2 rounded-full border border-momo-bright text-momo-bright hover:bg-momo-light transition-colors font-medium"
      >
        ↺ Sync Threads API
      </button>
    );
  }

  if (status === "loading") {
    return (
      <button
        disabled
        className="text-sm px-4 py-2 rounded-full border border-line text-ink-soft font-medium animate-pulse cursor-wait"
      >
        Đang đồng bộ…
      </button>
    );
  }

  if (status === "error") {
    return (
      <div className="flex items-start gap-2 flex-wrap">
        <div className="text-xs bg-red-50 border border-red-200 text-red-600 rounded-xl px-3 py-2 max-w-xs">
          <p className="font-medium">{errMsg}</p>
          {hint && <p className="text-red-400 mt-1">{hint}</p>}
        </div>
        <button
          onClick={() => setStatus("idle")}
          className="text-xs px-3 py-2 rounded-full border border-line text-ink-soft hover:border-ink transition-colors"
        >
          Đóng
        </button>
      </div>
    );
  }

  /* Preview state */
  if (!result) return null;
  return (
    <div className="border border-momo-bright/40 bg-momo-light rounded-2xl p-4 text-sm space-y-3 w-full sm:max-w-sm">
      <div>
        <p className="font-semibold text-ink">
          Threads{" "}
          <span className="text-momo-deep">{result.handle}</span>
          <span className="text-ink-soft font-normal">
            {" "}— {result.posts.length} posts
          </span>
        </p>
        {result.topPost && (
          <p className="text-xs text-ink-soft mt-1">
            Top post:{" "}
            <span className="font-semibold text-momo-deep">
              {formatNumber(result.topPost.views)}
            </span>{" "}
            views · {result.topPost.title}
          </p>
        )}
      </div>

      {/* Post preview list */}
      <ul className="space-y-1 max-h-32 overflow-y-auto">
        {result.posts.slice(0, 5).map((p, i) => (
          <li key={i} className="text-xs text-ink-soft flex gap-2">
            <span className="text-momo-deep font-medium shrink-0">
              {formatNumber(p.views)}
            </span>
            <span className="line-clamp-1">{p.title}</span>
          </li>
        ))}
        {result.posts.length > 5 && (
          <li className="text-xs text-ink-soft pl-0">
            +{result.posts.length - 5} bài khác…
          </li>
        )}
      </ul>

      <div className="flex gap-2">
        <button
          onClick={() => {
            onApply(result);
            setStatus("idle");
          }}
          className="text-xs px-3 py-1.5 rounded-full bg-momo-deep text-white hover:bg-momo-bright transition-colors font-medium"
        >
          Áp dụng
        </button>
        <button
          onClick={() => setStatus("idle")}
          className="text-xs px-3 py-1.5 rounded-full border border-line text-ink-soft hover:border-ink transition-colors"
        >
          Hủy
        </button>
      </div>
    </div>
  );
}
