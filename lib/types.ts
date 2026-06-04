/* Shared TypeScript types used by components and Sanity queries */

export type SiteContent = {
  name: string;
  penNames: string[];
  tagline_vi: string;
  profile_vi: string;
  profile_en: string;
  email: string;
  phone: string;
  location: string;
  highlights: string[];
  photo?: any;
};

export type ExperienceItem = {
  _id: string;
  order: number;
  role_vi: string;
  role_en: string;
  org_vi: string;
  org_en: string;
  period: string;
  bullets_vi: string[];
  bullets_en: string[];
  links?: Array<{ label: string; url: string }>;
  logo?: any;
};

export type SignatureWork = {
  _id: string;
  order: number;
  workId: string;
  title: string;
  type_vi: string;
  type_en: string;
  hook_vi: string;
  hook_en: string;
  url: string;
  image?: any;
};

export type Skills = {
  copywriting: string[];
  ai: string[];
  tools: string[];
  languages: string[];
};

export type Education = {
  school_vi: string;
  school_en: string;
  major_vi: string;
  major_en: string;
  period: string;
  gpa: string;
  certs: string[];
};

export type Video = {
  title: string;
  views: number;
  likes: number;
  url: string;
};

export type ThreadsPost = {
  title: string;
  views: number;
  likes: number;
  comments: number;
  reposts: number;
  url: string;
};

export type StatsData = {
  lastUpdated: string;
  tiktok_panorama: {
    handle: string;
    url: string;
    totalVideos: number;
    totalViews: number;
    topVideo: Video;
    videos: Video[];
  };
  threads_queenlam: {
    handle: string;
    displayName: string;
    url: string;
    status: string;
    direction: string;
    topPost: { title: string; views: number; url: string };
    posts: ThreadsPost[];
  };
  threads_finding20s: {
    handle: string;
    displayName: string;
    url: string;
    status: string;
    direction: string;
    topPost: { title: string; views: number; url: string };
    posts: ThreadsPost[];
  };
  uit_articles: {
    platform: string;
    url: string;
    totalArticles: number;
    byYear: Array<{ year: string; count: number }>;
  };
};

export type AllPageData = {
  siteContent: SiteContent;
  experiences: ExperienceItem[];
  works: SignatureWork[];
  skills: Skills;
  stats: StatsData;
};
