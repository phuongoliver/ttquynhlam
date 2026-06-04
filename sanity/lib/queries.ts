import { client, isSanityConfigured } from "./client";
import type { SiteContent, ExperienceItem, SignatureWork, Skills, StatsData, AllPageData } from "@/lib/types";
import defaultContent from "@/data/content.json";
import defaultStats from "@/data/stats.json";

/* ── GROQ Queries ─────────────────────────────────────────── */

export const SITE_CONTENT_QUERY = `*[_type == "siteContent"][0]{
  name, penNames, tagline_vi, profile_vi, profile_en,
  email, phone, location, highlights, photo
}`;

export const EXPERIENCE_QUERY = `*[_type == "experience"] | order(order asc){
  _id, order, role_vi, role_en, org_vi, org_en, period,
  bullets_vi, bullets_en,
  links[]{ label, url },
  logo
}`;

export const WORKS_QUERY = `*[_type == "signatureWork"] | order(order asc){
  _id, order, workId, title, type_vi, type_en, hook_vi, hook_en, url, image
}`;

export const SKILLS_QUERY = `*[_type == "skills"][0]{
  copywriting, ai, tools, languages
}`;

export const STATS_QUERY = `*[_type == "channelStats"][0]{
  lastUpdated,
  "tiktok_panorama": {
    "handle": tiktok.handle,
    "url": tiktok.url,
    "totalVideos": tiktok.totalVideos,
    "totalViews": tiktok.totalViews,
    "topVideo": tiktok.videos | order(views desc)[0]{ title, views, likes, url },
    "videos": tiktok.videos[]{ title, views, likes, url }
  },
  "threads_queenlam": {
    "handle": threads_queenlam.handle,
    "displayName": threads_queenlam.displayName,
    "url": threads_queenlam.url,
    "status": threads_queenlam.status,
    "direction": threads_queenlam.direction,
    "topPost": threads_queenlam.posts | order(views desc)[0]{ title, views, url },
    "posts": threads_queenlam.posts[]{ title, views, likes, comments, reposts, url }
  },
  "threads_finding20s": {
    "handle": threads_finding20s.handle,
    "displayName": threads_finding20s.displayName,
    "url": threads_finding20s.url,
    "status": threads_finding20s.status,
    "direction": threads_finding20s.direction,
    "topPost": threads_finding20s.posts | order(views desc)[0]{ title, views, url },
    "posts": threads_finding20s.posts[]{ title, views, likes, comments, reposts, url }
  },
  "uit_articles": {
    "platform": uit.platform,
    "url": uit.url,
    "totalArticles": uit.totalArticles,
    "byYear": uit.byYear[]{ year, count }
  }
}`;

/* ── Fallback data (JSON files) used when Sanity not configured ── */

function fallbackSiteContent(): SiteContent {
  const p = defaultContent.personal;
  return {
    name: p.name,
    penNames: p.penNames,
    tagline_vi: "Sinh viên Báo chí CLC với ~2.000 bài viết — biến insight thành câu chữ chạm cảm xúc.",
    profile_vi: defaultContent.profile.vi,
    profile_en: defaultContent.profile.en,
    email: p.email,
    phone: p.phone,
    location: p.location,
    highlights: defaultContent.highlights,
  };
}

function fallbackExperiences(): ExperienceItem[] {
  return defaultContent.experience.map((e, i) => ({
    _id: e.id,
    order: i,
    role_vi: e.role_vi,
    role_en: e.role_en,
    org_vi: e.org_vi,
    org_en: e.org_en,
    period: e.period,
    bullets_vi: e.bullets_vi,
    bullets_en: e.bullets_en,
    links: "links" in e ? (e.links as Array<{ label: string; url: string }>) : undefined,
  }));
}

function fallbackWorks(): SignatureWork[] {
  return defaultContent.signatureWorks.map((w, i) => ({
    _id: w.id,
    order: i,
    workId: w.id,
    title: w.title,
    type_vi: w.type_vi,
    type_en: w.type_en,
    hook_vi: w.hook_vi,
    hook_en: w.hook_en,
    url: w.url,
  }));
}

function fallbackSkills(): Skills {
  return defaultContent.skills as Skills;
}

function fallbackStats(): StatsData {
  const s = defaultStats;
  return {
    lastUpdated: s.lastUpdated,
    tiktok_panorama: {
      handle: s.tiktok_panorama.handle,
      url: s.tiktok_panorama.url,
      totalVideos: s.tiktok_panorama.totalVideos,
      totalViews: s.tiktok_panorama.totalViews,
      topVideo: s.tiktok_panorama.topVideo,
      videos: s.tiktok_panorama.videos,
    },
    threads_queenlam: {
      handle: s.threads_queenlam.handle,
      displayName: s.threads_queenlam.displayName,
      url: s.threads_queenlam.url,
      status: s.threads_queenlam.status,
      direction: s.threads_queenlam.direction,
      topPost: s.threads_queenlam.topPost,
      posts: s.threads_queenlam.posts,
    },
    threads_finding20s: {
      handle: s.threads_finding20s.handle,
      displayName: s.threads_finding20s.displayName,
      url: s.threads_finding20s.url,
      status: s.threads_finding20s.status,
      direction: s.threads_finding20s.direction,
      topPost: s.threads_finding20s.topPost,
      posts: s.threads_finding20s.posts,
    },
    uit_articles: {
      platform: s.uit_articles.platform,
      url: s.uit_articles.url,
      totalArticles: s.uit_articles.totalArticles,
      byYear: Object.entries(s.uit_articles.byYear).map(([year, count]) => ({ year, count })),
    },
  };
}

/* ── Fetch all page data (Sanity → fallback to JSON) ─────── */

export async function fetchAllPageData(): Promise<AllPageData> {
  if (!isSanityConfigured) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[Sanity] NEXT_PUBLIC_SANITY_PROJECT_ID not set — using data/*.json fallback");
    }
    return {
      siteContent: fallbackSiteContent(),
      experiences: fallbackExperiences(),
      works: fallbackWorks(),
      skills: fallbackSkills(),
      stats: fallbackStats(),
    };
  }

  const [siteContent, experiences, works, skills, stats] = await Promise.all([
    client.fetch<SiteContent | null>(SITE_CONTENT_QUERY, {}, { next: { revalidate: 60 } }),
    client.fetch<ExperienceItem[] | null>(EXPERIENCE_QUERY, {}, { next: { revalidate: 60 } }),
    client.fetch<SignatureWork[] | null>(WORKS_QUERY, {}, { next: { revalidate: 60 } }),
    client.fetch<Skills | null>(SKILLS_QUERY, {}, { next: { revalidate: 60 } }),
    client.fetch<StatsData | null>(STATS_QUERY, {}, { next: { revalidate: 60 } }),
  ]);

  return {
    siteContent: siteContent ?? fallbackSiteContent(),
    experiences: (experiences && experiences.length > 0) ? experiences : fallbackExperiences(),
    works: (works && works.length > 0) ? works : fallbackWorks(),
    skills: skills ?? fallbackSkills(),
    stats: stats ?? fallbackStats(),
  };
}
