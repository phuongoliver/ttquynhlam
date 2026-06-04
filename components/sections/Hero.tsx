"use client";
import { motion } from "framer-motion";
import type { SiteContent, StatsData } from "@/lib/types";
import EyebrowLabel from "@/components/ui/EyebrowLabel";
import { urlFor } from "@/sanity/lib/image";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" as const, delay },
});

const NAV = [
  { href: "#stats", label: "Số liệu" },
  { href: "#works", label: "Tác phẩm" },
  { href: "#experience", label: "Kinh nghiệm" },
  { href: "#skills", label: "Kỹ năng" },
];

type Props = { content: SiteContent; stats: StatsData };

export default function Hero({ content, stats }: Props) {
  /* Split name so the final 2 tokens sit on their own italic, sage-underlined line */
  const tokens = content.name.trim().split(/\s+/);
  const lastLine = tokens.slice(-2).join(" ");
  const firstLine = tokens.slice(0, -2).join(" ");

  return (
    <header className="bg-paper">
      {/* Top nav — DESIGN.md §6.1 */}
      <nav className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-20 pt-14 flex items-center justify-between gap-4 flex-wrap">
        <span className="font-display text-lg text-ink">QL.</span>
        <div className="flex items-center gap-2 text-[12px] tracking-[0.16em] uppercase text-ink-soft">
          {NAV.map((item, i) => (
            <span key={item.href} className="flex items-center gap-2">
              {i > 0 && <span className="select-none text-line">·</span>}
              <a href={item.href} className="link-underline hover:text-sage-deep transition-colors">
                {item.label}
              </a>
            </span>
          ))}
        </div>
      </nav>

      {/* Hero — asymmetric 60/40 */}
      <section
        id="hero"
        className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-20 pt-16 lg:pt-24 pb-[72px] lg:pb-[120px] grid lg:grid-cols-[3fr_2fr] gap-12 lg:gap-16 items-center"
      >
        {/* Left column */}
        <div>
          <motion.div {...fadeUp(0)}>
            <EyebrowLabel>Creative Copywriter · Journalist</EyebrowLabel>
          </motion.div>

          <motion.h1
            {...fadeUp(0.08)}
            className="font-display text-[clamp(48px,9vw,112px)] text-ink mt-6 mb-6"
          >
            {firstLine && <span className="block">{firstLine}</span>}
            <span className="font-serif-italic inline-block border-b-2 border-sage pb-1">
              {lastLine}
            </span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.16)}
            className="text-[clamp(17px,1.4vw,20px)] text-ink-soft leading-[1.6] max-w-[52ch] mb-9"
          >
            {content.tagline_vi}
          </motion.p>

          {/* CTAs */}
          <motion.div {...fadeUp(0.24)} className="flex gap-3 flex-wrap mb-10">
            <a
              href="/cv"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-sage text-card font-medium text-[12px] tracking-[0.16em] uppercase px-7 py-3.5 rounded-full hover:bg-sage-deep transition-colors"
            >
              Tải CV (VN)
            </a>
            <a
              href="/cv/en"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-ink text-ink font-medium text-[12px] tracking-[0.16em] uppercase px-7 py-3.5 rounded-full hover:bg-ink hover:text-paper transition-colors"
            >
              CV (EN)
            </a>
          </motion.div>

          {/* Social */}
          <motion.div {...fadeUp(0.32)} className="flex gap-5 text-[13px] text-ink-soft tracking-[0.02em]">
            <a href={stats.tiktok_panorama.url} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-sage-deep transition-colors">
              TikTok <span className="text-ink">{stats.tiktok_panorama.handle}</span>
            </a>
            <span className="select-none text-line">·</span>
            <a href={stats.threads_queenlam.url} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-sage-deep transition-colors">
              Threads <span className="text-ink">{stats.threads_queenlam.handle}</span>
            </a>
          </motion.div>
        </div>

        {/* Right column — polaroid portrait frame (uploaded image or placeholder) */}
        <motion.div
          {...fadeUp(0.2)}
          className="hidden lg:block"
        >
          <div className="bg-paper p-1.5 border border-line shadow-none">
            <div className="aspect-[4/5] bg-paper-deep border border-line flex items-center justify-center relative overflow-hidden">
              {content.photo ? (
                <img
                  src={urlFor(content.photo).url()}
                  alt={content.name}
                  className="w-full h-full object-cover warm-img"
                  loading="eager"
                />
              ) : (
                <span className="font-mono text-[11px] text-ink-soft tracking-wide">
                  portrait · 4:5
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Scroll cue */}
      <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-20 pb-10 -mt-6">
        <motion.a
          href="#stats"
          aria-label="Cuộn xuống"
          className="inline-flex items-center gap-2 text-ink-soft font-serif-italic text-sm"
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          scroll <span aria-hidden>↓</span>
        </motion.a>
      </div>
    </header>
  );
}
