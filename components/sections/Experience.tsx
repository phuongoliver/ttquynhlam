"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import type { ExperienceItem } from "@/lib/types";
import EyebrowLabel from "@/components/ui/EyebrowLabel";
import { urlFor } from "@/sanity/lib/image";
import SectionBand from "@/components/layout/SectionBand";

type Props = { experiences: ExperienceItem[] };

const DEFAULT_VISIBLE = 4;

export default function Experience({ experiences }: Props) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? experiences : experiences.slice(0, DEFAULT_VISIBLE);
  const hasMore = experiences.length > DEFAULT_VISIBLE;

  return (
    <SectionBand id="experience" tone="paper-deep">
      <EyebrowLabel>Experience</EyebrowLabel>
      <h2 className="font-display text-[clamp(28px,4.5vw,56px)] text-ink mt-5 mb-12 max-w-[20ch]">
        Nơi câu chữ được rèn.
      </h2>

      {/* Vertical sage hairline timeline */}
      <div className="relative max-w-3xl">
        <div className="absolute left-[3px] top-2 bottom-2 w-px bg-sage" />

        {visible.map((exp, i) => (
          <motion.div
            key={exp._id}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: i * 0.06, duration: 0.45 }}
            className="relative pl-8 pb-10 last:pb-0"
          >
            {/* Logo or Square node */}
            {exp.logo ? (
              <div className="absolute left-[-9px] top-1 w-6 h-6 bg-card border border-line flex items-center justify-center overflow-hidden">
                <img
                  src={urlFor(exp.logo).url()}
                  alt={exp.org_vi}
                  className="w-full h-full object-contain warm-img"
                />
              </div>
            ) : (
              <div className="absolute left-0 top-1.5 w-[7px] h-[7px] bg-sage-deep" />
            )}

            <p className="eyebrow mb-2">{exp.period}</p>
            <h3 className="text-[18px] font-semibold text-ink leading-snug">
              {exp.role_vi}
            </h3>
            <p className="font-serif-italic text-[16px] text-ink-soft mt-0.5 mb-3">
              {exp.org_vi}
            </p>

            <ul className="space-y-2">
              {exp.bullets_vi.map((bullet, j) => (
                <li key={j} className="text-[15px] text-ink-soft flex gap-2 leading-[1.65]">
                  <span className="text-sage shrink-0 select-none mt-1">▪</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            {exp.links && exp.links.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-4">
                {exp.links.map((link, k) => (
                  <a
                    key={k}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] text-sage-deep link-underline"
                  >
                    {link.label} →
                  </a>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-8 ml-8 text-[13px] tracking-[0.08em] uppercase text-sage-deep border border-line hover:border-sage-deep px-5 py-2.5 rounded-full transition-colors"
        >
          {expanded ? "Thu gọn" : `Xem thêm (${experiences.length - DEFAULT_VISIBLE})`}
        </button>
      )}
    </SectionBand>
  );
}
