import content from "@/data/content.json";
import { isPlaceholder } from "@/lib/utils";

type Lang = "vi" | "en";

type ExpLink = { label: string; url: string };
type ExpItem = (typeof content.experience)[number] & { links?: ExpLink[] };

/* ── Section title ─────────────────────────────────────── */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-3 mt-6 first:mt-0">
      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-momo-deep whitespace-nowrap">
        {children}
      </p>
      <div className="h-px flex-1 bg-line" />
    </div>
  );
}

/* ── Contact chip ──────────────────────────────────────── */
function Contact({ label }: { label: string }) {
  return <span className="text-ink-soft">{label}</span>;
}

/* ── Main CV ───────────────────────────────────────────── */
export default function CVContent({ lang }: { lang: Lang }) {
  const { personal, profile, experience, projects, education, skills, highlights } =
    content;

  const isVi = lang === "vi";

  /* skill groups */
  const skillGroups = [
    {
      title: isVi ? "Copywriting & Báo chí" : "Copywriting & Journalism",
      items: skills.copywriting,
    },
    {
      title: "AI & Innovation",
      items: skills.ai,
    },
    {
      title: isVi ? "Công cụ & Nền tảng" : "Tools & Platforms",
      items: skills.tools,
    },
    {
      title: isVi ? "Ngôn ngữ" : "Languages",
      items: skills.languages,
    },
  ];

  return (
    <div className="text-ink font-sans text-[13px] leading-[1.55]">

      {/* ── HEADER ─────────────────────────────────────────── */}
      <div className="mb-5 cv-no-break">
        <h1 className="text-[26px] font-bold text-momo-deep leading-tight">
          {personal.name}
        </h1>
        <p className="text-sm text-ink-soft mt-0.5">
          {isVi ? personal.major : "Journalism — High-Quality Program"} ·{" "}
          {isVi ? personal.schoolShort : "USSH – VNUHCM"}
        </p>

        {/* Contact row */}
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-2 text-[12px]">
          <Contact label={personal.location} />

          {!isPlaceholder(personal.email) && (
            <Contact label={personal.email} />
          )}
          {!isPlaceholder(personal.phone) && (
            <Contact label={personal.phone} />
          )}
          {!isPlaceholder(personal.linkedin) && (
            <Contact label={personal.linkedin} />
          )}

          {/* Dev-mode placeholder warnings */}
          {process.env.NODE_ENV === "development" && (
            <>
              {isPlaceholder(personal.email) && (
                <span className="text-red-400 text-[11px]">
                  ⚠ {personal.email}
                </span>
              )}
              {isPlaceholder(personal.phone) && (
                <span className="text-red-400 text-[11px]">
                  ⚠ {personal.phone}
                </span>
              )}
            </>
          )}

          {!isPlaceholder(personal.portfolioUrl) && (
            <Contact label={personal.portfolioUrl} />
          )}
        </div>

        {/* Highlight stats */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 pt-3 border-t border-line">
          {highlights.map((h, i) => (
            <span key={i} className="text-[11px] text-ink-soft">
              {h}
            </span>
          ))}
        </div>
      </div>

      {/* ── PROFILE ────────────────────────────────────────── */}
      <div className="cv-no-break">
        <SectionTitle>{isVi ? "Giới thiệu" : "Profile"}</SectionTitle>
        <p className="text-[12.5px] leading-[1.6] text-ink">
          {isVi ? profile.vi : profile.en}
        </p>
      </div>

      {/* ── EXPERIENCE ─────────────────────────────────────── */}
      <div>
        <SectionTitle>{isVi ? "Kinh nghiệm" : "Experience"}</SectionTitle>
        <div className="space-y-4">
          {(content.experience as ExpItem[]).map((exp) => (
            <div key={exp.id} className="cv-no-break">
              {/* Role + period */}
              <div className="flex items-baseline justify-between gap-4 flex-wrap">
                <p className="font-semibold text-ink text-[13px]">
                  {isVi ? exp.role_vi : exp.role_en}
                </p>
                <p className="text-[11px] text-ink-soft shrink-0">{exp.period}</p>
              </div>
              {/* Org */}
              <p className="text-[12px] text-momo-deep font-medium mb-1">
                {isVi ? exp.org_vi : exp.org_en}
              </p>
              {/* Bullets */}
              <ul className="space-y-0.5">
                {(isVi ? exp.bullets_vi : exp.bullets_en).map((b, j) => (
                  <li key={j} className="flex gap-2 text-[12px] text-ink-soft">
                    <span className="text-momo-deep shrink-0 select-none">·</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              {/* Links */}
              {exp.links && exp.links.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-3">
                  {exp.links.map((lk, k) => (
                    <span key={k} className="text-[11px] text-momo-bright">
                      {lk.url}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── PROJECTS / CLB ─────────────────────────────────── */}
      <div className="cv-no-break">
        <SectionTitle>
          {isVi ? "Hoạt động & Dự án" : "Activities & Projects"}
        </SectionTitle>
        <div className="space-y-2">
          {content.projects.map((p) => (
            <div key={p.id} className="flex gap-2">
              <span className="text-momo-deep shrink-0 select-none mt-px">·</span>
              <div>
                <span className="font-medium text-ink text-[12.5px]">
                  {isVi ? p.title_vi : p.title_en}
                </span>
                <span className="text-ink-soft text-[11.5px]"> — {p.org} · {p.period}</span>
                {"desc_vi" in p && p.desc_vi && isVi && (
                  <p className="text-[11.5px] text-ink-soft mt-0.5">{p.desc_vi as string}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── EDUCATION ──────────────────────────────────────── */}
      <div className="cv-no-break">
        <SectionTitle>{isVi ? "Học vấn" : "Education"}</SectionTitle>
        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <p className="font-semibold text-ink text-[13px]">
            {isVi ? education.school_vi : education.school_en}
          </p>
          <p className="text-[11px] text-ink-soft shrink-0">{education.period}</p>
        </div>
        <p className="text-[12px] text-momo-deep font-medium">
          {isVi ? education.major_vi : education.major_en}
        </p>
        <div className="flex flex-wrap gap-3 mt-1">
          <span className="text-[12px] text-ink-soft">
            GPA {education.gpa} ({personal.gpaSemesters}{" "}
            {isVi ? "học kỳ" : "semesters"})
          </span>
          {education.certs.map((c, i) => (
            <span key={i} className="text-[12px] text-ink-soft">
              · {c}
            </span>
          ))}
        </div>
      </div>

      {/* ── SKILLS ─────────────────────────────────────────── */}
      <div className="cv-no-break">
        <SectionTitle>{isVi ? "Kỹ năng" : "Skills"}</SectionTitle>
        <div className="space-y-1.5">
          {skillGroups.map((g) => (
            <div key={g.title} className="flex gap-2 text-[12px]">
              <span className="font-semibold text-ink shrink-0 min-w-[140px]">
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
