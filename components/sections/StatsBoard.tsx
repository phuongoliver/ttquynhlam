"use client";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatNumber } from "@/lib/utils";
import StatCard from "@/components/ui/StatCard";
import EyebrowLabel from "@/components/ui/EyebrowLabel";
import SectionBand from "@/components/layout/SectionBand";
import type { StatsData } from "@/lib/types";

type RechartsTooltipPayload = {
  active?: boolean;
  payload?: Array<{ payload: { name: string; views?: number; count?: number } }>;
};

type TabId = "tiktok" | "queenlam" | "finding20s" | "uit";

const TABS: { id: TabId; label: string }[] = [
  { id: "tiktok", label: "TikTok @panorama.pvt" },
  { id: "queenlam", label: "Threads @ttqueenlam" },
  { id: "finding20s", label: "Threads @finding20s" },
  { id: "uit", label: "UIT Articles" },
];

const SAGE = "#8FA08A";
const INK_SOFT = "#5C5448";

function ChartTooltip({ active, payload }: RechartsTooltipPayload) {
  if (!active || !payload?.length) return null;
  const { name, views, count } = payload[0].payload;
  const val = views ?? count ?? 0;
  return (
    <div className="bg-card border border-line px-3 py-2 text-sm">
      <p className="text-ink font-medium mb-0.5 max-w-[180px] break-words">{name}</p>
      <p className="stat-number text-sage-deep text-lg">{formatNumber(val)}</p>
    </div>
  );
}

type Props = { stats: StatsData };

export default function StatsBoard({ stats }: Props) {
  const data = stats;
  const [activeTab, setActiveTab] = useState<TabId>("tiktok");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const threadsTopViews = Math.max(
    data.threads_queenlam.topPost.views,
    data.threads_finding20s.topPost.views
  );
  const threadsTopIsFromFinding20s =
    data.threads_finding20s.topPost.views >= data.threads_queenlam.topPost.views;

  const kpis = [
    {
      key: "articles",
      label: "Tổng tin/bài",
      display: `~${data.uit_articles.totalArticles.toLocaleString("vi-VN")}`,
      sublabel: "Đã chấp bút · 2023 – nay",
      viral: false,
    },
    {
      key: "tiktok",
      label: "TikTok top video",
      display: formatNumber(data.tiktok_panorama.topVideo.views),
      sublabel: data.tiktok_panorama.topVideo.title,
      viral: true,
    },
    {
      key: "threads",
      label: "Threads top post",
      display: formatNumber(threadsTopViews),
      sublabel: threadsTopIsFromFinding20s
        ? data.threads_finding20s.topPost.title
        : data.threads_queenlam.topPost.title,
      viral: true,
    },
    {
      key: "newspaper",
      label: "Báo đã đăng",
      display: "1",
      sublabel: "Tuổi Trẻ (in + online)",
      viral: false,
    },
  ];

  const tiktokChartData = data.tiktok_panorama.videos.slice(0, 5).map((v) => ({
    name: v.title.length > 22 ? v.title.slice(0, 20) + "…" : v.title,
    views: v.views,
  }));

  const uitChartData = data.uit_articles.byYear.map((y) => ({
    name: y.year === "2026_ytd" ? "2026 YTD" : y.year,
    count: y.count,
  }));

  return (
    <SectionBand id="stats" tone="paper-deep">
      <EyebrowLabel>By the numbers · 2023–2026</EyebrowLabel>
      <h2 className="font-display text-[clamp(28px,4.5vw,56px)] text-ink mt-5 mb-12 max-w-[20ch]">
        Con số kể chuyện.
      </h2>

      {/* KPI row — transparent blocks with hairline dividers */}
      <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-line border-y border-line">
        {kpis.map((kpi) => (
          <StatCard
            key={kpi.key}
            label={kpi.label}
            display={kpi.display}
            sublabel={kpi.sublabel}
            viral={kpi.viral}
          />
        ))}
      </div>

      {/* Text tabs */}
      <div className="flex gap-6 overflow-x-auto mt-16 mb-8 border-b border-line">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-sm whitespace-nowrap transition-colors -mb-px border-b-2 ${
              activeTab === tab.id
                ? "text-ink border-sage-deep font-medium"
                : "text-ink-soft border-transparent hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {!mounted ? (
          <div className="h-64 bg-card border border-line animate-pulse" />
        ) : activeTab === "tiktok" ? (
          <TikTokTab data={data} chartData={tiktokChartData} />
        ) : activeTab === "queenlam" || activeTab === "finding20s" ? (
          <ThreadsTab channel={activeTab} data={data} />
        ) : (
          <UitTab data={data} chartData={uitChartData} />
        )}
      </div>
    </SectionBand>
  );
}

type ChartItem = { name: string; views?: number; count?: number };

/* ─── TikTok Tab ─────────────────────────────────────────── */

function TikTokTab({ data, chartData }: { data: StatsData; chartData: ChartItem[] }) {
  return (
    <div className="space-y-10">
      <div className="flex gap-10 flex-wrap">
        <Stat label="Tổng video" value={data.tiktok_panorama.totalVideos} />
        <Stat label="Tổng views" value={data.tiktok_panorama.totalViews} format={formatNumber} />
      </div>

      <div>
        <EyebrowLabel>Top 5 video theo views</EyebrowLabel>
        <div className="h-56 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: INK_SOFT }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v: number) => formatNumber(v)} tick={{ fontSize: 11, fill: INK_SOFT }} axisLine={false} tickLine={false} width={48} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(143,160,138,0.12)" }} />
              <Bar dataKey="views" fill={SAGE} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <DataTable
        head={["Video", "Views", "Likes", ""]}
        rows={data.tiktok_panorama.videos.map((v) => [
          v.title,
          formatNumber(v.views),
          formatNumber(v.likes),
          v.url,
        ])}
      />
    </div>
  );
}

/* ─── Threads Tab ────────────────────────────────────────── */

function ThreadsTab({ channel, data }: { channel: "queenlam" | "finding20s"; data: StatsData }) {
  const key = channel === "queenlam" ? "threads_queenlam" : "threads_finding20s";
  const ch = data[key];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-10 items-start">
        <div>
          <EyebrowLabel>Hướng nội dung</EyebrowLabel>
          <p className="text-sm text-ink mt-2">{ch.direction}</p>
        </div>
        <div>
          <EyebrowLabel>Trạng thái</EyebrowLabel>
          <p className="mt-2">
            <span className="text-xs bg-sage-tint text-sage-deep px-2.5 py-1 rounded-full">
              {ch.status === "archived_dec2025" ? "Archived (12/2025)" : ch.status}
            </span>
          </p>
        </div>
      </div>

      <DataTable
        head={["Post", "Views", "Likes", "Cmts", "Reposts", ""]}
        rows={ch.posts.map((p) => [
          p.title,
          formatNumber(p.views),
          formatNumber(p.likes),
          String(p.comments),
          String(p.reposts),
          p.url,
        ])}
      />
    </div>
  );
}

/* ─── UIT Tab ────────────────────────────────────────────── */

function UitTab({ data, chartData }: { data: StatsData; chartData: ChartItem[] }) {
  return (
    <div className="space-y-10">
      <div className="flex gap-10 flex-wrap items-center">
        <Stat label="Tổng bài viết" value={data.uit_articles.totalArticles} />
        <a href={data.uit_articles.url} target="_blank" rel="noopener noreferrer" className="text-xs text-sage-deep link-underline">
          {data.uit_articles.url} ↗
        </a>
      </div>

      <div>
        <EyebrowLabel>Bài viết theo năm</EyebrowLabel>
        <div className="h-56 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: INK_SOFT }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: INK_SOFT }} axisLine={false} tickLine={false} width={40} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(143,160,138,0.12)" }} />
              <Bar dataKey="count" fill={SAGE} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ─── Shared table ───────────────────────────────────────── */

function DataTable({ head, rows }: { head: string[]; rows: string[][] }) {
  const lastIdx = head.length - 1;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line">
            {head.map((h, i) => (
              <th
                key={i}
                className={`py-2.5 text-ink-soft font-medium text-[11px] uppercase tracking-wider ${
                  i === 0 ? "text-left pr-4" : i === lastIdx ? "w-6" : "text-right pr-4"
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-b border-line last:border-0 hover:bg-card/60 transition-colors">
              {row.map((cell, ci) =>
                ci === 0 ? (
                  <td key={ci} className="py-3 pr-4 text-ink">{cell}</td>
                ) : ci === lastIdx ? (
                  <td key={ci} className="py-3 text-right">
                    <a href={cell} target="_blank" rel="noopener noreferrer" className="text-sage-deep hover:text-clay text-xs">↗</a>
                  </td>
                ) : (
                  <td key={ci} className={`py-3 pr-4 text-right ${ci === 1 ? "stat-number text-sage-deep text-base" : "text-ink-soft"}`}>
                    {cell}
                  </td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Inline Stat ────────────────────────────────────────── */

function Stat({ label, value, format }: { label: string; value: number; format?: (v: number) => string }) {
  return (
    <div>
      <p className="eyebrow">{label}</p>
      <span className="stat-number text-3xl text-ink block mt-2">
        {format ? format(value) : value}
      </span>
    </div>
  );
}
