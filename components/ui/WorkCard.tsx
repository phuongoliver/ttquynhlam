import { formatNumber } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";

type WorkCardProps = {
  id: string;
  title: string;
  type: string;
  hook: string;
  viewCount?: number;
  url: string;
  image?: any;
};

/* design-system.html §3 — Work card: chip + image placeholder + Fraunces title + hook + meta.
   Hover: lift 4px, hairline thickens to ink. No box shadow, no border-radius. */
export function WorkCard({ title, type, hook, viewCount, url, image }: WorkCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col bg-card border border-line hover:border-ink overflow-hidden h-full transition-[transform,border-color] duration-200 hover:-translate-y-1"
    >
      {/* Image area — image from Sanity or hatched pattern placeholder per design system */}
      <div
        className="aspect-[16/10] overflow-hidden flex items-center justify-center border-b border-line bg-paper"
      >
        {image ? (
          <img
            src={urlFor(image).url()}
            alt={title}
            className="w-full h-full object-cover warm-img transition-transform duration-[400ms] group-hover:scale-[1.02]"
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: "repeating-linear-gradient(45deg, var(--color-paper-deep) 0 8px, var(--color-paper) 8px 16px)",
            }}
          >
            <span className="font-mono text-[11px] text-ink-soft tracking-[0.04em] transition-transform duration-[400ms] group-hover:scale-[1.02]">
              article hero · 16:10
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5 pt-5 pb-6 px-6">
        <span className="inline-block self-start bg-sage-tint text-sage-deep text-[10px] font-medium uppercase tracking-[0.16em] px-2.5 py-1 mb-3">
          {type}
        </span>

        <h3 className="font-display text-[22px] leading-[1.2] tracking-[-0.01em] text-ink mb-2 line-clamp-2 flex-1" style={{ textWrap: "balance" }}>
          {title}
        </h3>

        <p className="text-[14px] text-ink-soft leading-[1.55] mb-3.5 line-clamp-2">{hook}</p>

        <div className="flex items-center justify-between mt-auto">
          {viewCount != null ? (
            <span className="stat-number text-ink text-base">
              {formatNumber(viewCount)}
              <span className="font-sans not-italic text-[11px] text-ink-soft ml-1 tracking-wide">views</span>
            </span>
          ) : (
            <span />
          )}
          <span className="text-[13px] text-ink border-b border-sage pb-px transition-colors group-hover:text-sage-deep">
            Đọc bài →
          </span>
        </div>
      </div>
    </a>
  );
}

