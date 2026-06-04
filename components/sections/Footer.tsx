import { isPlaceholder } from "@/lib/utils";
import type { SiteContent, StatsData } from "@/lib/types";

type Props = { content: SiteContent; stats: StatsData };

export default function Footer({ content, stats }: Props) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-paper px-6 sm:px-12 lg:px-20 pt-[72px] lg:pt-[120px] pb-12">
      <div className="max-w-6xl mx-auto">
        {/* Large goodbye signature */}
        <p className="font-display font-serif-italic text-[clamp(48px,9vw,112px)] leading-[0.95] mb-16">
          {content.name}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 border-t border-paper/15 pt-12">
          {/* Contact */}
          <div>
            <p className="eyebrow !text-sage mb-4">Liên hệ</p>
            <ul className="space-y-1.5 text-[15px] text-paper/80">
              {!isPlaceholder(content.email) ? (
                <li>
                  <a href={`mailto:${content.email}`} className="link-underline hover:text-paper">
                    {content.email}
                  </a>
                </li>
              ) : (
                process.env.NODE_ENV === "development" && (
                  <li className="text-clay">⚠ email: {content.email}</li>
                )
              )}
              {!isPlaceholder(content.phone) && <li>{content.phone}</li>}
              {content.location && <li>{content.location}</li>}
            </ul>
          </div>

          {/* Social */}
          <div>
            <p className="eyebrow !text-sage mb-4">Kênh</p>
            <ul className="space-y-1.5 text-[15px] text-paper/80">
              <li>
                <a href={stats.tiktok_panorama.url} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-paper">
                  TikTok {stats.tiktok_panorama.handle}
                </a>
              </li>
              <li>
                <a href={stats.threads_queenlam.url} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-paper">
                  Threads {stats.threads_queenlam.handle}
                </a>
              </li>
              <li>
                <a href={stats.threads_finding20s.url} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-paper">
                  Threads {stats.threads_finding20s.handle}
                </a>
              </li>
            </ul>
          </div>

          {/* Credit */}
          <div>
            <p className="eyebrow !text-sage mb-4">Colophon</p>
            <p className="text-[15px] text-paper/80 leading-relaxed">
              {content.penNames.join(" · ")}
            </p>
            <p className="text-[13px] text-paper/40 mt-4">
              © {year} · Built with care by Oliver
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
