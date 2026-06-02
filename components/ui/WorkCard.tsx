import { formatNumber } from "@/lib/utils";

type WorkCardProps = {
  id: string;
  title: string;
  type: string;
  hook: string;
  viewCount?: number;
  url: string;
};

export function WorkCard({ title, type, hook, viewCount, url }: WorkCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col bg-white rounded-2xl border border-line p-6 hover:border-momo-bright hover:shadow-sm transition-all h-full"
    >
      <span className="inline-block self-start bg-momo-light text-momo-deep text-[11px] font-medium uppercase tracking-widest px-2.5 py-1 rounded-full mb-3">
        {type}
      </span>
      <h3 className="font-semibold text-ink text-base leading-snug mb-2 group-hover:text-momo-deep transition-colors line-clamp-3 flex-1">
        {title}
      </h3>
      <p className="text-sm text-ink-soft leading-relaxed mb-4 line-clamp-2">{hook}</p>
      <div className="flex items-center justify-between mt-auto">
        {viewCount != null ? (
          <span className="text-xs text-ink-soft">{formatNumber(viewCount)} views</span>
        ) : (
          <span />
        )}
        <span className="text-sm text-momo-bright font-medium group-hover:underline">
          Đọc / Xem →
        </span>
      </div>
    </a>
  );
}
