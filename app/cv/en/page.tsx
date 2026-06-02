import Link from "next/link";
import CVContent from "@/components/cv/CVContent";
import PrintButton from "@/components/ui/PrintButton";

export const metadata = {
  title: "CV (EN) — Trịnh Thanh Quỳnh Lam",
  robots: { index: false },
};

export default function CVPageEN() {
  return (
    <>
      {/* Screen-only nav bar */}
      <nav className="no-print sticky top-0 z-40 bg-white border-b border-line px-6 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm text-ink-soft hover:text-momo-deep transition-colors"
        >
          ← Portfolio
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/cv"
            className="text-sm text-ink-soft hover:text-momo-deep transition-colors"
          >
            🇻🇳 VN
          </Link>
          <PrintButton label="Print / Save PDF" />
        </div>
      </nav>

      {/* A4 paper */}
      <main className="py-8 px-4">
        <div className="cv-paper bg-white max-w-[210mm] mx-auto shadow-md rounded-sm p-[15mm]">
          <CVContent lang="en" />
        </div>
      </main>
    </>
  );
}
