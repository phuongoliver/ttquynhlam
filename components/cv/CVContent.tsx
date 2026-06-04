import { readFileSync } from "fs";
import { join } from "path";
import { isPlaceholder } from "@/lib/utils";
import type contentSchema from "@/data/content.json";

type ContentData = typeof contentSchema;
type Lang = "vi" | "en";
type ExpLink = { label: string; url: string };
type ExpItem = ContentData["experience"][number] & { links?: ExpLink[] };
type Project = ContentData["projects"][number] & { desc_vi?: string };

/* Read fresh from disk on every dev request (avoids static-import cache) */
function getContent(): ContentData {
  return JSON.parse(
    readFileSync(join(process.cwd(), "data/content.json"), "utf-8")
  ) as ContentData;
}

/* ── Section title ──────────────────────────────────────── */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-3 mt-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-sage-deep whitespace-nowrap">
        {children}
      </p>
      <div className="h-px flex-1 bg-line" />
    </div>
  );
}

/* ── Main CV ────────────────────────────────────────────── */
export default function CVContent({ lang }: { lang: Lang }) {
  const content = getContent();
  const { personal, profile, experience, projects, education, skills, highlights } =
    content;

  const isVi = lang === "vi";

  const skillGroups = [
    {
      title: isVi ? "Copywriting & Báo chí" : "Copywriting & Journalism",
      items: skills.copywriting,
    },
    { title: "AI & Innovation", items: skills.ai },
    {
      title: isVi ? "Công cụ & Nền tảng" : "Tools & Platforms",
      items: skills.tools,
    },
    { title: isVi ? "Ngôn ngữ" : "Languages", items: skills.languages },
  ];

  return (
    <div className="text-ink font-sans text-[13px] leading-[1.55]">

      {/* ── HEADER ──────────────────────────────────────────── */}
      <div className="mb-5 cv-no-break">
        <h1 className="text-[26px] font-bold text-sage-deep leading-tight">
          {personal.name}
        </h1>
        <p className="text-sm text-ink-soft mt-0.5">
          {isVi ? personal.major : "Journalism — High-Quality Program"} ·{" "}
          {isVi ? personal.schoolShort : "USSH – VNUHCM"}
        </p>

        {/* Contact row */}
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-2 text-[12px]">
          <span className="text-ink-soft">{personal.location}</span>

          {personal.email && (
            <a href={`mailto:${personal.email}`} className="text-ink-soft hover:text-sage-deep transition-colors">
              {personal.email}
            </a>
          )}
          {personal.phone && (
            <span className="text-ink-soft">{personal.phone}</span>
          )}

        </div>

        {/* Highlight stats */}
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-3 pt-3 border-t border-line">
          {highlights.map((h, i) => (
            <span key={i} className="text-[11px] text-ink-soft">{h}</span>
          ))}
        </div>
      </div>

      {/* ── PROFILE ─────────────────────────────────────────── */}
      <div className="cv-no-break">
        <SectionTitle>{isVi ? "Giới thiệu" : "Profile"}</SectionTitle>
        <p className="text-[12.5px] leading-[1.6] text-ink">
          {isVi ? profile.vi : profile.en}
        </p>
      </div>

      {/* ── EXPERIENCE ──────────────────────────────────────── */}
      <div>
        <SectionTitle>{isVi ? "Kinh nghiệm" : "Experience"}</SectionTitle>
        <div className="space-y-4">
          {(experience as ExpItem[]).map((exp) => (
            <div key={exp.id} className="cv-no-break">
              <div className="flex items-baseline justify-between gap-4 flex-wrap">
                <p className="font-semibold text-ink text-[13px]">
                  {isVi ? exp.role_vi : exp.role_en}
                </p>
                <p className="text-[11px] text-ink-soft shrink-0">{exp.period}</p>
              </div>
              <p className="text-[12px] text-sage-deep font-medium mb-1">
                {isVi ? exp.org_vi : exp.org_en}
              </p>
              <ul className="space-y-0.5">
                {(isVi ? exp.bullets_vi : exp.bullets_en).map((b, j) => (
                  <li key={j} className="flex gap-2 text-[12px] text-ink-soft">
                    <span className="text-sage-deep shrink-0 select-none">·</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              {/* Article / work links — hyperlinked with label text */}
              {exp.links && exp.links.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5">
                  {exp.links.map((lk, k) => (
                    <a
                      key={k}
                      href={lk.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cv-link text-[11px] text-sage-deep hover:underline"
                    >
                      {lk.label} ↗
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── PROJECTS / CLB ──────────────────────────────────── */}
      <div className="cv-no-break">
        <SectionTitle>
          {isVi ? "Hoạt động & Dự án" : "Activities & Projects"}
        </SectionTitle>
        <div className="space-y-2">
          {(projects as Project[]).map((p) => (
            <div key={p.id} className="flex gap-2">
              <span className="text-sage-deep shrink-0 select-none mt-px">·</span>
              <div>
                <span className="font-medium text-ink text-[12.5px]">
                  {isVi ? p.title_vi : p.title_en}
                </span>
                <span className="text-ink-soft text-[11.5px]">
                  {" "}— {p.org} · {p.period}
                </span>
                {p.desc_vi && isVi && (
                  <p className="text-[11.5px] text-ink-soft mt-0.5">{p.desc_vi}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── EDUCATION ───────────────────────────────────────── */}
      <div className="cv-no-break">
        <SectionTitle>{isVi ? "Học vấn" : "Education"}</SectionTitle>
        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <p className="font-semibold text-ink text-[13px]">
            {isVi ? education.school_vi : education.school_en}
          </p>
          <p className="text-[11px] text-ink-soft shrink-0">{education.period}</p>
        </div>
        <p className="text-[12px] text-sage-deep font-medium">
          {isVi ? education.major_vi : education.major_en}
        </p>
        <div className="flex flex-wrap gap-x-3 mt-1">
          <span className="text-[12px] text-ink-soft">
            GPA {education.gpa} ({personal.gpaSemesters}{" "}
            {isVi ? "học kỳ" : "semesters"})
          </span>
          {education.certs.map((c, i) => (
            <span key={i} className="text-[12px] text-ink-soft">· {c}</span>
          ))}
        </div>
      </div>

      {/* ── SKILLS ──────────────────────────────────────────── */}
      <div className="cv-no-break">
        <SectionTitle>{isVi ? "Kỹ năng" : "Skills"}</SectionTitle>
        <div className="space-y-1.5">
          {skillGroups.map((g) => (
            <div key={g.title} className="flex gap-2 text-[12px]">
              <span className="font-semibold text-ink shrink-0 min-w-[148px]">
                {g.title}:
              </span>
              <span className="text-ink-soft">{g.items.join(" · ")}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
