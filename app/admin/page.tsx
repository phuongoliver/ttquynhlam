"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import StatsBoard from "@/components/sections/StatsBoard";

const SESSION_KEY = "qlam_admin_v1";

type AuthState = "checking" | "locked" | "unlocked";

export default function AdminPage() {
  const [authState, setAuthState] = useState<AuthState>("checking");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "true") {
      setAuthState("unlocked");
    } else {
      setAuthState("locked");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const secret = process.env.NEXT_PUBLIC_ADMIN_SECRET;

    /* If no secret is configured, allow free access (dev / local use) */
    if (!secret || password === secret) {
      sessionStorage.setItem(SESSION_KEY, "true");
      setAuthState("unlocked");
      setError("");
    } else {
      setError("Mật khẩu không đúng.");
      setPassword("");
      inputRef.current?.focus();
    }
  }

  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthState("locked");
    setPassword("");
  }

  /* ── Loading splash ─────────────────────────────────────── */
  if (authState === "checking") {
    return <div className="min-h-screen bg-surface" />;
  }

  /* ── Password gate ──────────────────────────────────────── */
  if (authState === "locked") {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl border border-line p-8 w-full max-w-sm shadow-sm">
          {/* Header */}
          <div className="mb-6">
            <div className="w-8 h-1 bg-momo-deep rounded-full mb-4" />
            <h1 className="text-xl font-semibold text-ink">Admin Dashboard</h1>
            <p className="text-sm text-ink-soft mt-1">
              Cập nhật số liệu kênh · Quỳnh Lam Portfolio
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              ref={inputRef}
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Mật khẩu"
              className="w-full px-4 py-2.5 rounded-xl border border-line focus:outline-none focus:border-momo-deep text-sm transition-colors"
            />
            {error && (
              <p className="text-xs text-red-500 font-medium">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-momo-deep text-white py-2.5 rounded-xl text-sm font-medium hover:bg-momo-bright transition-colors"
            >
              Đăng nhập
            </button>
          </form>

          {/* Hint */}
          <p className="text-[11px] text-ink-soft mt-5 text-center leading-relaxed">
            Set{" "}
            <code className="bg-surface px-1 rounded">
              NEXT_PUBLIC_ADMIN_SECRET
            </code>{" "}
            trong <code className="bg-surface px-1 rounded">.env.local</code>
            <br />
            Nếu chưa set, để trống và nhấn Đăng nhập.
          </p>

          <div className="mt-5 pt-4 border-t border-line text-center">
            <Link
              href="/"
              className="text-xs text-ink-soft hover:text-momo-deep transition-colors"
            >
              ← Về trang portfolio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Admin dashboard ────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-surface">
      {/* Top bar */}
      <div className="bg-momo-deep text-white px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-4 bg-white/40 rounded-full" />
          <p className="text-sm font-medium">Admin — Quỳnh Lam Portfolio</p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-xs text-white/60 hover:text-white transition-colors"
          >
            Xem portfolio →
          </Link>
          <button
            onClick={handleLogout}
            className="text-xs text-white/60 hover:text-white transition-colors"
          >
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="max-w-5xl mx-auto px-6 pt-8 pb-2">
        <div className="bg-white border border-line rounded-2xl px-5 py-4 text-sm text-ink-soft space-y-1">
          <p className="font-medium text-ink">Hướng dẫn cập nhật số liệu</p>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Sửa trực tiếp các số liệu bên dưới.</li>
            <li>Nhấn <strong className="text-ink">Lưu</strong> → data ghi vào localStorage của trình duyệt này.</li>
            <li>
              Nhấn <strong className="text-ink">Export JSON</strong> → tải file{" "}
              <code className="bg-surface px-1 rounded text-xs">stats-YYYY-MM-DD.json</code>.
            </li>
            <li>
              Copy file đó vào{" "}
              <code className="bg-surface px-1 rounded text-xs">data/stats.json</code>{" "}
              trong repo → commit → push → Vercel tự redeploy.
            </li>
          </ol>
        </div>
      </div>

      {/* StatsBoard in forced edit mode */}
      <StatsBoard forceEditMode />
    </div>
  );
}
