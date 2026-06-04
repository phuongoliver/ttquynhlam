"use client";
import { motion } from "framer-motion";
import type { SignatureWork, StatsData } from "@/lib/types";
import { WorkCard } from "@/components/ui/WorkCard";
import EyebrowLabel from "@/components/ui/EyebrowLabel";
import SectionBand from "@/components/layout/SectionBand";

type Props = { works: SignatureWork[]; stats: StatsData };

export default function SelectedWorks({ works, stats }: Props) {
  const viewCounts: Record<string, number> = {
    sw4: stats.tiktok_panorama.topVideo.views,
    sw5: stats.threads_finding20s.topPost.views,
  };

  return (
    <SectionBand id="works" tone="paper">
      <EyebrowLabel>Selected work · 2024–2026</EyebrowLabel>
      <h2 className="font-display text-[clamp(28px,4.5vw,56px)] text-ink mt-5 mb-12 max-w-[20ch]">
        Những bài đáng để đọc lại.
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {works.map((work, i) => (
          <motion.div
            key={work._id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: (i % 3) * 0.08, duration: 0.5 }}
            className={`flex ${i % 3 === 1 ? "lg:mt-10" : ""}`}
          >
            <WorkCard
              id={work.workId}
              title={work.title}
              type={work.type_vi}
              hook={work.hook_vi}
              viewCount={viewCounts[work.workId]}
              url={work.url}
              image={work.image}
            />
          </motion.div>
        ))}
      </div>
    </SectionBand>
  );
}
