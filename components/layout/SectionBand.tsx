"use client";
import { motion } from "framer-motion";

/* DESIGN.md §5 / §8 — alternating paper bands + fade+rise entrance.
   Tone: "paper" | "paper-deep" | "ink" (dark footer closer). */
type Tone = "paper" | "paper-deep" | "ink";

const toneClass: Record<Tone, string> = {
  paper: "bg-paper text-ink",
  "paper-deep": "bg-paper-deep text-ink",
  ink: "bg-ink text-paper",
};

type Props = {
  children: React.ReactNode;
  id?: string;
  tone?: Tone;
  className?: string;
};

export default function SectionBand({
  children,
  id,
  tone = "paper",
  className = "",
}: Props) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`${toneClass[tone]} px-6 sm:px-12 lg:px-20 py-[72px] lg:py-[120px] ${className}`}
    >
      <div className="max-w-6xl mx-auto">{children}</div>
    </motion.section>
  );
}
