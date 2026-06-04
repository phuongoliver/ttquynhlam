"use client";

export default function PrintButton({ label = "In / Lưu PDF" }: { label?: string }) {
  return (
    <button
      onClick={() => window.print()}
      className="bg-sage text-card text-sm font-medium px-5 py-2 rounded-full hover:bg-sage-deep transition-colors"
    >
      {label}
    </button>
  );
}
