"use client";
import { motion } from "framer-motion";
import content from "@/data/content.json";

const GROUPS = [
  {
    key: "copywriting" as const,
    title: "Copywriting & Journalism",
    accent: false,
  },
  {
    key: "ai" as const,
    title: "AI & Innovation",
    accent: true,
  },
  {
    key: "tools" as const,
    title: "Tools & Platforms",
    accent: false,
  },
  {
    key: "languages" as const,
    title: "Ngôn ngữ",
    accent: false,
  },
];

export default function Skills() {
  const { skills } = content;

  return (
    <section id="skills" className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-10"
        >
          <h2 className="text-[32px] font-semibold text-ink mb-3">Skills</h2>
          <div className="w-12 h-1 bg-momo-deep rounded-full" />
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {GROUPS.map((group, i) => (
            <motion.div
              key={group.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className={`rounded-2xl border p-6 ${
                group.accent
                  ? "bg-momo-light border-momo-bright/30"
                  : "bg-white border-line"
              }`}
            >
              {/* Group title */}
              <div className="flex items-center gap-2 mb-4">
                <div
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    group.accent ? "bg-momo-deep" : "bg-line"
                  }`}
                />
                <h3
                  className={`text-sm font-semibold uppercase tracking-widest ${
                    group.accent ? "text-momo-deep" : "text-ink-soft"
                  }`}
                >
                  {group.title}
                </h3>
                {group.accent && (
                  <span className="ml-auto text-[10px] font-medium bg-momo-deep text-white px-2 py-0.5 rounded-full">
                    Điểm nhấn
                  </span>
                )}
              </div>

              {/* Skill list */}
              <ul className="space-y-2.5">
                {skills[group.key].map((skill, j) => (
                  <li key={j} className="flex gap-2 leading-[1.6]">
                    <span
                      className={`shrink-0 select-none mt-0.5 ${
                        group.accent ? "text-momo-deep" : "text-momo-bright"
                      }`}
                    >
                      ·
                    </span>
                    <span
                      className={`text-sm ${
                        group.accent ? "text-ink" : "text-ink-soft"
                      }`}
                    >
                      {skill}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
