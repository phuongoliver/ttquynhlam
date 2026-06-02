"use client";
import { motion } from "framer-motion";
import content from "@/data/content.json";

type ExpLink = { label: string; url: string };
type ExpItem = (typeof content.experience)[number] & { links?: ExpLink[] };

export default function Experience() {
  return (
    <section id="experience" className="py-20 px-6 bg-surface">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-10"
        >
          <h2 className="text-[32px] font-semibold text-ink mb-3">
            Kinh nghiệm
          </h2>
          <div className="w-12 h-1 bg-momo-deep rounded-full" />
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-line" />

          {(content.experience as ExpItem[]).map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="relative pl-8 pb-10 last:pb-0"
            >
              {/* Dot */}
              <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-momo-deep border-2 border-white shadow-sm" />

              {/* Content */}
              <div>
                <p className="font-semibold text-ink text-[16px] leading-snug">
                  {exp.role_vi}
                </p>
                <p className="text-sm text-momo-deep font-medium mt-0.5">
                  {exp.org_vi}
                </p>
                <p className="text-xs text-ink-soft mt-0.5 mb-3">{exp.period}</p>

                <ul className="space-y-2">
                  {exp.bullets_vi.map((bullet, j) => (
                    <li
                      key={j}
                      className="text-sm text-ink-soft flex gap-2 leading-[1.7]"
                    >
                      <span className="text-momo-deep shrink-0 select-none">·</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                {exp.links && exp.links.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-3">
                    {exp.links.map((link, k) => (
                      <a
                        key={k}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-momo-bright hover:underline"
                      >
                        {link.label} →
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
