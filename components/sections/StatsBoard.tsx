"use client";
import { useState, useEffect, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type RechartsTooltipPayload = {
  active?: boolean;
  payload?: Array<{ payload: { name: string; views?: number; count?: number } }>;
};
import statsDefault from "@/data/stats.json";
import { formatNumber } from "@/lib/utils";
import StatCard from "@/components/ui/StatCard";
import EditableNumber from "@/components/ui/EditableNumber";
import SyncButton from "@/components/ui/SyncButton";
import type { SyncResult } from "@/lib/threads";

/* ─── Types ──────────────────────────────────────────────── */

type StatsData = typeof statsDefault;
type TabId = "tiktok" | "queenlam" | "finding20s" | "uit";

const TABS: { id: TabId; label: string }[] = [
  { id: "tiktok", label: "TikTok @panorama.pvt" },
  { id: "queenlam", label: "Threads @ttqueenlam" },
  { id: "finding20s", label: "Threads @finding20s" },
  { id: "uit", label: "UIT Articles" },
];

const MOMO_DEEP = "#A50064";
const MOMO_LIGHT = "#FCE4F3";

/* ─── Helpers ────────────────────────────────────────────── */

function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

function updateAt(
  obj: unknown,
  path: Array<string | number>,
  value: unknown
): unknown {
  if (path.length === 0) return value;
  const [key, ...rest] = path;
  if (Array.isArray(obj)) {
    return (obj as unknown[]).map((item, i) =>
      i === key ? updateAt(item, rest, value) : item
    );
  }
  const o = obj as Record<string | number, unknown>;
  return { ...o, [key]: updateAt(o[key], rest, value) };
}

/* ─── Custom Tooltip ─────────────────────────────────────── */

function ChartTooltip({ active, payload }: RechartsTooltipPayload) {
  if (!active || !payload?.length) return null;
  const { name, views, count } = payload[0].payload as {
    name: string;
    views?: number;
    count?: number;
  };
  const val = views ?? count ?? 0;
  return (
    <div className="bg-white border border-line rounded-xl px-3 py-2 shadow-sm text-sm">
      <p className="text-ink font-medium mb-0.5 max-w-[180px] break-words">{name}</p>
      <p className="text-momo-deep font-bold">{formatNumber(val)}</p>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────── */

type StatsBoardProps = {
  forceEditMode?: boolean;
};

export default function StatsBoard({ forceEditMode = false }: StatsBoardProps) {
  const [data, setData] = useState<StatsData>(() => deepClone(statsDefault));
  const [activeTab, setActiveTab] = useState<TabId>("tiktok");
  const [isEditMode, setIsEditMode] = useState(forceEditMode);
  const [saveFlash, setSaveFlash] = useState(false);
  const [mounted, setMounted] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);

  /* On mount: set mounted flag, load localStorage, detect edit mode */
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("qlam_stats");
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch {
        /* ignore corrupt data */
      }
    }
    if (!forceEditMode) {
      const params = new URLSearchParams(window.location.search);
      if (params.get("edit") === "true") setIsEditMode(true);
    }
  }, [forceEditMode]);

  /* Generic nested-path updater */
  function update(path: Array<string | number>, value: number) {
    setData((prev) => updateAt(prev, path, value) as StatsData);
  }

  function save() {
    localStorage.setItem("qlam_stats", JSON.stringify(data));
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 1500);
  }

  function exportJson() {
    const dateStr = new Date().toISOString().slice(0, 10);
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stats-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function importJson(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string) as StatsData;
        setData(parsed);
        localStorage.setItem("qlam_stats", JSON.stringify(parsed));
      } catch {
        alert("File JSON không hợp lệ.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function handleSyncApply(result: SyncResult) {
    setData((prev) => {
      const next = deepClone(prev);
      if (result.handle === next.threads_queenlam.handle) {
        next.threads_queenlam.posts = result.posts;
        if (result.topPost) next.threads_queenlam.topPost = result.topPost;
      } else if (result.handle === next.threads_finding20s.handle) {
        next.threads_finding20s.posts = result.posts;
        if (result.topPost) next.threads_finding20s.topPost = result.topPost;
      }
      return next;
    });
  }

  /* KPI card definitions */
  const threadsTopViews = Math.max(
    data.threads_queenlam.topPost.views,
    data.threads_finding20s.topPost.views
  );
  const threadsTopIsFromFinding20s =
    data.threads_finding20s.topPost.views >= data.threads_queenlam.topPost.views;

  const kpis = [
    {
      key: "articles",
      label: "Tin/bài đã đăng",
      display: `~${data.uit_articles.totalArticles.toLocaleString("vi-VN")}`,
      rawValue: data.uit_articles.totalArticles,
      sublabel: "2023 – nay",
      editPath: ["uit_articles", "totalArticles"] as Array<string | number>,
    },
    {
      key: "tiktok",
      label: "TikTok top video",
      display: formatNumber(data.tiktok_panorama.topVideo.views),
      rawValue: data.tiktok_panorama.topVideo.views,
      sublabel: data.tiktok_panorama.topVideo.title,
      editPath: ["tiktok_panorama", "topVideo", "views"] as Array<
        string | number
      >,
    },
    {
      key: "threads",
      label: "Threads top post",
      display: formatNumber(threadsTopViews),
      rawValue: threadsTopViews,
      sublabel: threadsTopIsFromFinding20s
        ? data.threads_finding20s.topPost.title
        : data.threads_queenlam.topPost.title,
      editPath: (
        threadsTopIsFromFinding20s
          ? ["threads_finding20s", "topPost", "views"]
          : ["threads_queenlam", "topPost", "views"]
      ) as Array<string | number>,
    },
    {
      key: "newspaper",
      label: "Báo đã đăng",
      display: "1",
      rawValue: 1,
      sublabel: "Tuổi Trẻ (in + online)",
      editPath: null,
    },
  ];

  /* Chart data */
  const tiktokChartData = data.tiktok_panorama.videos.slice(0, 5).map((v) => ({
    name: v.title.length > 22 ? v.title.slice(0, 20) + "…" : v.title,
    fullTitle: v.title,
    views: v.views,
  }));

  const uitChartData = [
    { name: "2023", count: data.uit_articles.byYear["2023"] },
    { name: "2024", count: data.uit_articles.byYear["2024"] },
    { name: "2025", count: data.uit_articles.byYear["2025"] },
    { name: "2026 YTD", count: data.uit_articles.byYear["2026_ytd"] },
  ];

  return (
    <section id="stats" className="py-20 px-6 bg-surface">
      <div className="max-w-5xl mx-auto">
        {/* Header row */}
        <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
          <div>
            <h2 className="text-[32px] font-semibold text-ink mb-3">
              Content Stats
            </h2>
            <div className="w-12 h-1 bg-momo-deep rounded-full" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {isEditMode ? (
              <>
                <button
                  onClick={save}
                  className={`text-sm px-4 py-2 rounded-full font-medium transition-colors ${
                    saveFlash
                      ? "bg-green-500 text-white"
                      : "bg-momo-deep text-white hover:bg-momo-bright"
                  }`}
                >
                  {saveFlash ? "✓ Đã lưu" : "Lưu"}
                </button>
                <button
                  onClick={exportJson}
                  className="text-sm px-4 py-2 rounded-full border border-momo-deep text-momo-deep hover:bg-momo-light transition-colors font-medium"
                >
                  Export JSON
                </button>
                <button
                  onClick={() => importRef.current?.click()}
                  className="text-sm px-4 py-2 rounded-full border border-line text-ink-soft hover:border-momo-deep hover:text-momo-deep transition-colors font-medium"
                >
                  Import JSON
                </button>
                <input
                  ref={importRef}
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={importJson}
                />
                {!forceEditMode && (
                  <button
                    onClick={() => setIsEditMode(false)}
                    className="text-sm px-4 py-2 rounded-full border border-line text-ink-soft hover:border-ink transition-colors font-medium"
                  >
                    Xong
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={() => setIsEditMode(true)}
                className="text-xs px-3 py-1.5 rounded-full border border-line text-ink-soft hover:border-momo-deep hover:text-momo-deep transition-colors opacity-0 hover:opacity-100 focus:opacity-100"
                aria-label="Chỉnh sửa stats"
              >
                ✎ Chỉnh sửa
              </button>
            )}
          </div>
        </div>

        {/* Edit mode banner + Sync button */}
        {isEditMode && (
          <div className="mb-6 space-y-3">
            <p className="text-xs text-ink-soft bg-momo-light border border-momo-bright/30 rounded-xl px-4 py-2.5">
              ✏️ Dữ liệu lưu trong trình duyệt.{" "}
              <strong>Export → commit vào repo</strong> để mọi người xem được.
            </p>
            <SyncButton onApply={handleSyncApply} />
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {kpis.map((kpi) => (
            <StatCard
              key={kpi.key}
              label={kpi.label}
              display={kpi.display}
              rawValue={kpi.rawValue}
              sublabel={kpi.sublabel}
              isEditing={isEditMode && kpi.editPath !== null}
              onValueChange={
                kpi.editPath
                  ? (v) => update(kpi.editPath!, v)
                  : undefined
              }
            />
          ))}
        </div>

        {/* Tab Nav */}
        <div className="flex border-b border-line overflow-x-auto mb-8 -mx-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors mx-1 ${
                activeTab === tab.id
                  ? "text-momo-deep border-b-2 border-momo-deep -mb-px"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content — only render after mount to avoid Recharts SSR hydration mismatch */}
        <div>
          {!mounted ? (
            <div className="h-64 rounded-2xl bg-white animate-pulse" />
          ) : activeTab === "tiktok" ? (
            <TikTokTab
              data={data}
              isEditing={isEditMode}
              update={update}
              chartData={tiktokChartData}
            />
          ) : activeTab === "queenlam" || activeTab === "finding20s" ? (
            <ThreadsTab
              channel={activeTab}
              data={data}
              isEditing={isEditMode}
              update={update}
            />
          ) : (
            <UitTab
              data={data}
              isEditing={isEditMode}
              update={update}
              chartData={uitChartData}
            />
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── TikTok Tab ─────────────────────────────────────────── */

type ChartItem = { name: string; views?: number; count?: number };

function TikTokTab({
  data,
  isEditing,
  update,
  chartData,
}: {
  data: StatsData;
  isEditing: boolean;
  update: (path: Array<string | number>, v: number) => void;
  chartData: ChartItem[];
}) {
  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="flex gap-6 flex-wrap">
        <Stat
          label="Tổng video"
          value={data.tiktok_panorama.totalVideos}
          isEditing={isEditing}
          onChange={(v) => update(["tiktok_panorama", "totalVideos"], v)}
        />
        <Stat
          label="Tổng views"
          value={data.tiktok_panorama.totalViews}
          isEditing={isEditing}
          onChange={(v) => update(["tiktok_panorama", "totalViews"], v)}
          format={formatNumber}
        />
      </div>

      {/* Bar chart - top 5 */}
      <div>
        <p className="text-xs text-ink-soft uppercase tracking-wide font-medium mb-3">
          Top 5 video theo views
        </p>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#4A4A4A" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v: number) => formatNumber(v)}
                tick={{ fontSize: 11, fill: "#4A4A4A" }}
                axisLine={false}
                tickLine={false}
                width={48}
              />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="views" radius={[4, 4, 0, 0]}>
                {chartData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={i === 0 ? MOMO_DEEP : MOMO_LIGHT}
                    stroke="none"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Full table */}
      <div>
        <p className="text-xs text-ink-soft uppercase tracking-wide font-medium mb-3">
          Tất cả videos
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="text-left py-2 text-ink-soft font-medium pr-4">
                  Video
                </th>
                <th className="text-right py-2 text-ink-soft font-medium pr-4">
                  Views
                </th>
                <th className="text-right py-2 text-ink-soft font-medium pr-4">
                  Likes
                </th>
                <th className="w-6" />
              </tr>
            </thead>
            <tbody>
              {data.tiktok_panorama.videos.map((v, i) => (
                <tr
                  key={i}
                  className="border-b border-line last:border-0 hover:bg-white transition-colors"
                >
                  <td className="py-2.5 pr-4 text-ink">{v.title}</td>
                  <td className="py-2.5 pr-4 text-right">
                    <EditableNumber
                      value={v.views}
                      isEditing={isEditing}
                      onChange={(val) =>
                        update(["tiktok_panorama", "videos", i, "views"], val)
                      }
                      format={formatNumber}
                      className="font-semibold text-momo-deep"
                    />
                  </td>
                  <td className="py-2.5 pr-4 text-right">
                    <EditableNumber
                      value={v.likes}
                      isEditing={isEditing}
                      onChange={(val) =>
                        update(["tiktok_panorama", "videos", i, "likes"], val)
                      }
                      format={formatNumber}
                      className="text-ink-soft"
                    />
                  </td>
                  <td className="py-2.5 text-right">
                    <a
                      href={v.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-momo-bright hover:underline text-xs"
                    >
                      ↗
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Threads Tab ────────────────────────────────────────── */

function ThreadsTab({
  channel,
  data,
  isEditing,
  update,
}: {
  channel: "queenlam" | "finding20s";
  data: StatsData;
  isEditing: boolean;
  update: (path: Array<string | number>, v: number) => void;
}) {
  const key =
    channel === "queenlam" ? "threads_queenlam" : "threads_finding20s";
  const ch = data[key];

  return (
    <div className="space-y-6">
      {/* Channel meta */}
      <div className="flex flex-wrap gap-4 items-start">
        <div>
          <p className="text-xs text-ink-soft uppercase tracking-wide font-medium mb-1">
            Hướng nội dung
          </p>
          <p className="text-sm text-ink">{ch.direction}</p>
        </div>
        <div>
          <p className="text-xs text-ink-soft uppercase tracking-wide font-medium mb-1">
            Trạng thái
          </p>
          <span className="text-xs bg-momo-light text-momo-deep px-2 py-0.5 rounded-full">
            {ch.status === "archived_dec2025"
              ? "Archived (12/2025)"
              : ch.status}
          </span>
        </div>
      </div>

      {/* Posts table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line">
              <th className="text-left py-2 text-ink-soft font-medium pr-3">
                Post
              </th>
              <th className="text-right py-2 text-ink-soft font-medium pr-3">
                Views
              </th>
              <th className="text-right py-2 text-ink-soft font-medium pr-3">
                Likes
              </th>
              <th className="text-right py-2 text-ink-soft font-medium pr-3">
                Cmts
              </th>
              <th className="text-right py-2 text-ink-soft font-medium pr-3">
                Reposts
              </th>
              <th className="w-6" />
            </tr>
          </thead>
          <tbody>
            {ch.posts.map((p, i) => (
              <tr
                key={i}
                className="border-b border-line last:border-0 hover:bg-white transition-colors"
              >
                <td className="py-2.5 pr-3 text-ink">{p.title}</td>
                <td className="py-2.5 pr-3 text-right">
                  <EditableNumber
                    value={p.views}
                    isEditing={isEditing}
                    onChange={(v) => update([key, "posts", i, "views"], v)}
                    format={formatNumber}
                    className="font-semibold text-momo-deep"
                  />
                </td>
                <td className="py-2.5 pr-3 text-right">
                  <EditableNumber
                    value={p.likes}
                    isEditing={isEditing}
                    onChange={(v) => update([key, "posts", i, "likes"], v)}
                    format={formatNumber}
                    className="text-ink-soft"
                  />
                </td>
                <td className="py-2.5 pr-3 text-right">
                  <EditableNumber
                    value={p.comments}
                    isEditing={isEditing}
                    onChange={(v) => update([key, "posts", i, "comments"], v)}
                    className="text-ink-soft"
                  />
                </td>
                <td className="py-2.5 pr-3 text-right">
                  <EditableNumber
                    value={p.reposts}
                    isEditing={isEditing}
                    onChange={(v) => update([key, "posts", i, "reposts"], v)}
                    className="text-ink-soft"
                  />
                </td>
                <td className="py-2.5 text-right">
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-momo-bright hover:underline text-xs"
                  >
                    ↗
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── UIT Tab ────────────────────────────────────────────── */

function UitTab({
  data,
  isEditing,
  update,
  chartData,
}: {
  data: StatsData;
  isEditing: boolean;
  update: (path: Array<string | number>, v: number) => void;
  chartData: ChartItem[];
}) {
  const yearKeys: Record<string, Array<string | number>> = {
    "2023": ["uit_articles", "byYear", "2023"],
    "2024": ["uit_articles", "byYear", "2024"],
    "2025": ["uit_articles", "byYear", "2025"],
    "2026 YTD": ["uit_articles", "byYear", "2026_ytd"],
  };

  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="flex gap-6 flex-wrap items-center">
        <Stat
          label="Tổng bài viết"
          value={data.uit_articles.totalArticles}
          isEditing={isEditing}
          onChange={(v) => update(["uit_articles", "totalArticles"], v)}
        />
        <a
          href={data.uit_articles.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-momo-bright hover:underline"
        >
          {data.uit_articles.url} ↗
        </a>
      </div>

      {/* Bar chart */}
      <div>
        <p className="text-xs text-ink-soft uppercase tracking-wide font-medium mb-3">
          Bài viết theo năm
        </p>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 4, right: 8, bottom: 4, left: 0 }}
            >
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: "#4A4A4A" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#4A4A4A" }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="count" fill={MOMO_DEEP} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Year breakdown table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line">
              <th className="text-left py-2 text-ink-soft font-medium">Năm</th>
              <th className="text-right py-2 text-ink-soft font-medium">
                Số bài
              </th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((row) => (
              <tr
                key={row.name}
                className="border-b border-line last:border-0 hover:bg-white transition-colors"
              >
                <td className="py-2.5 text-ink">{row.name}</td>
                <td className="py-2.5 text-right">
                  <EditableNumber
                    value={row.count ?? 0}
                    isEditing={isEditing}
                    onChange={(v) => update(yearKeys[row.name], v)}
                    className="font-semibold text-momo-deep"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Inline Stat ─────────────────────────────────────────── */

function Stat({
  label,
  value,
  isEditing,
  onChange,
  format,
}: {
  label: string;
  value: number;
  isEditing: boolean;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) {
  return (
    <div>
      <p className="text-xs text-ink-soft mb-0.5">{label}</p>
      <EditableNumber
        value={value}
        isEditing={isEditing}
        onChange={onChange}
        format={format}
        className="text-xl font-bold text-ink"
      />
    </div>
  );
}
