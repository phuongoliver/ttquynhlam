"use client";
import { motion } from "framer-motion";
import type { Skills } from "@/lib/types";
import EyebrowLabel from "@/components/ui/EyebrowLabel";
import SectionBand from "@/components/layout/SectionBand";

type Props = { skills: Skills };

const GROUPS = [
  { key: "copywriting" as const, title: "Copywriting & Journalism", accent: false },
  { key: "ai" as const, title: "AI & Innovation", accent: true },
  { key: "tools" as const, title: "Tools & Platforms", accent: false },
  { key: "languages" as const, title: "Ngôn ngữ", accent: false },
];

export default function Skills({ skills }: Props) {
  return (
    <SectionBand id="skills" tone="paper">
      <EyebrowLabel>Skills & Tooling</EyebrowLabel>
      <h2 className="font-display text-[clamp(28px,4.5vw,56px)] text-ink mt-5 mb-12 max-w-[20ch]">
        Bộ công cụ của một người viết.
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {GROUPS.map((group, i) => (
          <motion.div
            key={group.key}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: i * 0.06, duration: 0.45 }}
          >
            <p className={`eyebrow mb-4 ${group.accent ? "!text-clay" : ""}`}>
              {group.title}
            </p>
            <div className="flex flex-wrap gap-2">
              {skills[group.key].map((skill, j) => (
                <span
                  key={j}
                  className={`text-[13px] leading-snug px-3 py-1.5 rounded-full ${
                    group.accent
                      ? "bg-clay-tint text-ink"
                      : "bg-sage-tint text-ink"
                  }`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </SectionBand>
  );
}
