"use client";

export default function PrintButton({ label = "In / Lưu PDF" }: { label?: string }) {
  return (
    <button
      onClick={() => window.print()}
      className="bg-momo-deep text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-momo-bright transition-colors"
    >
      {label}
    </button>
  );
}
