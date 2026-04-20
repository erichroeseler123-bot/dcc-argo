export function formatMoney(amount: number | null, currency = "USD") {
  if (amount === null || !Number.isFinite(amount)) return "Check live pricing";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatRating(rating: number | null, reviewCount: number | null) {
  if (rating === null) return "Live rating on Viator";
  if (reviewCount && reviewCount > 0) return `${rating.toFixed(1)} / 5 (${reviewCount.toLocaleString()} reviews)`;
  return `${rating.toFixed(1)} / 5`;
}

export function toSentenceCase(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function excerpt(value: string | null | undefined, fallback: string, max = 190) {
  const clean = stripHtml(String(value || "")).trim();
  if (!clean) return fallback;
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trim()}…`;
}

export function durationLabel(minutes: number | null) {
  if (minutes === null || minutes <= 0) return "Length varies";
  if (minutes < 60) return `${minutes} min`;
  const hours = minutes / 60;
  if (Number.isInteger(hours)) return `${hours} hr`;
  return `${hours.toFixed(1)} hr`;
}
