"use client";
import { motion } from "framer-motion";
import content from "@/data/content.json";
import stats from "@/data/stats.json";
import { WorkCard } from "@/components/ui/WorkCard";

const VIEW_COUNTS: Record<string, number> = {
  sw4: stats.tiktok_panorama.topVideo.views,
  sw5: stats.threads_finding20s.topPost.views,
};

export default function SelectedWorks() {
  return (
    <section id="works" className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-10"
        >
          <h2 className="text-[32px] font-semibold text-ink mb-3">
            Selected Works
          </h2>
          <div className="w-12 h-1 bg-momo-deep rounded-full" />
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {content.signatureWorks.map((work, i) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              className="flex"
            >
              <WorkCard
                id={work.id}
                title={work.title}
                type={work.type_vi}
                hook={work.hook_vi}
                viewCount={VIEW_COUNTS[work.id]}
                url={work.url}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
