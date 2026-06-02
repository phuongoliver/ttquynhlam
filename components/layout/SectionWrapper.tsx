"use client";
import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  id?: string;
  className?: string;
};

export default function SectionWrapper({ children, id, className = "" }: Props) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
