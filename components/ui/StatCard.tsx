/* DESIGN.md §6.2 — "by the numbers" editorial stat block.
   Transparent (no card fill); the parent draws hairline dividers.
   Viral stats get a clay underline beneath the number. */
type StatCardProps = {
  label: string;
  display: string;
  sublabel?: string;
  viral?: boolean;
};

export default function StatCard({ label, display, sublabel, viral = false }: StatCardProps) {
  return (
    <div className="flex flex-col gap-2.5 px-3 sm:px-4 xl:px-6 py-6 sm:py-8">
      <p className="eyebrow">{label}</p>
      <p className="stat-number text-[clamp(32px,3.8vw,64px)] text-ink">
        <span className={viral ? "clay-under" : undefined}>
          {display}
        </span>
      </p>
      {sublabel && (
        <p className="text-[13px] text-ink-soft leading-snug line-clamp-2">{sublabel}</p>
      )}
    </div>
  );
}
