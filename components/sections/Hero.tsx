"use client";
import { motion } from "framer-motion";
import content from "@/data/content.json";
import stats from "@/data/stats.json";
import { isPlaceholder } from "@/lib/utils";

const TAGLINE =
  "Sinh viên Báo chí CLC với ~2.000 bài viết — biến insight thành câu chữ chạm cảm xúc.";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: "easeOut" as const, delay },
});

export default function Hero() {
  const { personal } = content;

  return (
    <section
      id="hero"
      className="min-h-[88vh] flex flex-col items-center justify-center text-center px-6 py-24 bg-white"
    >
      <div className="max-w-2xl mx-auto w-full">
        {/* Name */}
        <motion.h1
          {...fadeUp(0)}
          className="text-[clamp(2rem,8vw,3rem)] font-bold text-momo-deep leading-tight mb-2"
        >
          {personal.name}
        </motion.h1>

        {/* Pen names */}
        <motion.p {...fadeUp(0.1)} className="text-base text-ink-soft italic mb-8">
          {personal.penNames.join(" · ")}
        </motion.p>

        {/* Tagline */}
        <motion.p
          {...fadeUp(0.2)}
          className="text-[16px] text-ink leading-[1.7] max-w-lg mx-auto mb-10"
        >
          {TAGLINE}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          {...fadeUp(0.3)}
          className="flex gap-3 justify-center flex-wrap mb-10"
        >
          <a
            href="/cv"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-momo-deep text-white font-medium px-6 py-3 rounded-full hover:bg-momo-bright transition-colors text-sm"
          >
            Xem CV (Tiếng Việt) ↗
          </a>
          <a
            href="/cv/en"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border-2 border-momo-deep text-momo-deep font-medium px-6 py-3 rounded-full hover:bg-momo-light transition-colors text-sm"
          >
            Xem CV (English) ↗
          </a>
        </motion.div>

        {/* Social links */}
        <motion.div
          {...fadeUp(0.4)}
          className="flex gap-6 justify-center text-sm"
        >
          <a
            href={stats.tiktok_panorama.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-soft hover:text-ink transition-colors"
          >
            TikTok&nbsp;
            <span className="font-medium">{stats.tiktok_panorama.handle}</span>
          </a>
          <span className="text-line select-none">·</span>
          <a
            href={stats.threads_queenlam.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-soft hover:text-ink transition-colors"
          >
            Threads&nbsp;
            <span className="font-medium">{stats.threads_queenlam.handle}</span>
          </a>
        </motion.div>

        {/* Placeholder warnings (dev only) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 space-y-1">
            {(["email", "phone", "linkedin", "portfolioUrl"] as const)
              .filter((k) => isPlaceholder(personal[k]))
              .map((k) => (
                <p key={k} className="text-xs text-red-300">
                  ⚠ {k}: {personal[k]}
                </p>
              ))}
          </div>
        )}
      </div>
    </section>
  );
}
