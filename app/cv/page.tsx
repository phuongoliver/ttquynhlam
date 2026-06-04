import Link from "next/link";
import CVContent from "@/components/cv/CVContent";
import PrintButton from "@/components/ui/PrintButton";

export const metadata = {
  title: "CV — Trịnh Thanh Quỳnh Lam",
  robots: { index: false },
};

export default function CVPageVN() {
  return (
    <>
      {/* Screen-only nav bar */}
      <nav className="no-print sticky top-0 z-40 bg-white border-b border-line px-6 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm text-ink-soft hover:text-sage-deep transition-colors"
        >
          ← Portfolio
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/cv/en"
            className="text-sm text-ink-soft hover:text-sage-deep transition-colors"
          >
            🇬🇧 EN
          </Link>
          <PrintButton label="In / Lưu PDF" />
        </div>
      </nav>

      {/* A4 paper */}
      <main className="py-8 px-4">
        <div className="cv-paper bg-white max-w-[210mm] mx-auto shadow-md rounded-sm p-[15mm]">
          <CVContent lang="vi" />
        </div>
      </main>
    </>
  );
}
