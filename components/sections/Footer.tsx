import content from "@/data/content.json";
import { isPlaceholder } from "@/lib/utils";

export default function Footer() {
  const { personal } = content;
  const year = 2026;

  return (
    <footer className="bg-ink text-white py-16 px-6">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center gap-3">
        {/* Name */}
        <p className="text-xl font-semibold">{personal.name}</p>

        {/* Pen names */}
        <p className="text-sm text-white/50 italic">
          {personal.penNames.join(" · ")}
        </p>

        {/* Email */}
        {!isPlaceholder(personal.email) ? (
          <a
            href={`mailto:${personal.email}`}
            className="text-sm text-momo-bright hover:underline transition-colors"
          >
            {personal.email}
          </a>
        ) : (
          process.env.NODE_ENV === "development" && (
            <p className="text-xs text-red-400">⚠ email: {personal.email}</p>
          )
        )}

        {/* Divider */}
        <div className="w-12 h-px bg-white/10 my-3" />

        {/* Copyright */}
        <p className="text-xs text-white/30">
          © {year} Trịnh Thanh Quỳnh Lam
        </p>
        <p className="text-xs text-white/20">
          Built with care by Oliver
        </p>
      </div>
    </footer>
  );
}
