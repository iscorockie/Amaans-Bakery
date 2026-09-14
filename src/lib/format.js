/**
 * Format a number as Ugandan Shillings, e.g. 85000 -> "UGX 85,000".
 */
export function formatUGX(amount) {
  const rounded = Math.round(Number(amount) || 0);
  return `UGX ${rounded.toLocaleString("en-UG")}`;
}

/** Local ISO date string (yyyy-mm-dd) for `min` attributes & comparisons. */
export function todayISO() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** Tomorrow's ISO date — earliest day we can bake & deliver an order. */
export function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** "2026-09-20" -> "Sun, 20 Sep 2026" (locale-friendly, safe parse). */
export function prettyDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
