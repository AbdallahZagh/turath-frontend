export function formatCount(value: number, locale: string): string {
  const numberLocale = locale === "ar" ? "ar-SY" : "en-US";
  return new Intl.NumberFormat(numberLocale).format(value);
}

/** `ratio` is 0–1 (e.g. 0.062 → 6.2%). */
export function formatPercent(ratio: number, locale: string, digits = 1): string {
  const numberLocale = locale === "ar" ? "ar-SY" : "en-US";
  return new Intl.NumberFormat(numberLocale, {
    style: "percent",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(ratio);
}

/** Star average 0–5, always one decimal (e.g. 4.6). */
export function formatRating(value: number, locale: string): string {
  const numberLocale = locale === "ar" ? "ar-SY" : "en-US";
  return new Intl.NumberFormat(numberLocale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

/** Reliability score 0–100 (Architecture / SRS). Not a 0–1 ratio. */
export function formatReliabilityScore(score: number, locale: string): string {
  const numberLocale = locale === "ar" ? "ar-SY" : "en-US";
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  return new Intl.NumberFormat(numberLocale, {
    maximumFractionDigits: 0,
  }).format(clamped);
}

