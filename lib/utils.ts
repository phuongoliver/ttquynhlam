/**
 * Format a raw number into a compact Vietnamese-style display string.
 *
 * Rules:
 *   ≥ 1 000 000  → "1.2M"
 *   ≥ 1 000      → "311.4K"  (1 decimal, trailing zero dropped)
 *   < 1 000      → "847"
 *
 * Special prefix: pass approximate=true to prepend "~" (e.g. "~2.000" for article counts).
 * Vietnamese thousands separator uses "." (e.g. 2000 → "~2.000" when approx=true).
 */
export function formatNumber(n: number, options?: { approximate?: boolean }): string {
  const approx = options?.approximate ?? false;

  if (n >= 1_000_000) {
    const val = (n / 1_000_000).toFixed(1).replace(/\.0$/, "");
    return `${approx ? "~" : ""}${val}M`;
  }

  if (n >= 1_000) {
    const val = (n / 1_000).toFixed(1).replace(/\.0$/, "");
    return `${approx ? "~" : ""}${val}K`;
  }

  // For approximate small numbers use Vietnamese dot-separator
  if (approx) {
    return "~" + n.toLocaleString("vi-VN");
  }

  return String(n);
}

/** Format a date string (ISO or "YYYY-MM-DD") into "DD/MM/YYYY". */
export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

/** Returns true if a string is a PLACEHOLDER_* value from content.json. */
export function isPlaceholder(value: string | undefined | null): boolean {
  return typeof value === "string" && value.startsWith("PLACEHOLDER_");
}
