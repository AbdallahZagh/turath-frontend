/** Platform example rate from the product spec: 150,000 SYP ≈ $10.50. */
const USD_PER_SYP = 10.5 / 150_000;

export function formatSyp(amountSyp: number, locale: string): string {
  const numberLocale = locale === "ar" ? "ar-SY" : "en-US";
  const syp = new Intl.NumberFormat(numberLocale).format(amountSyp);
  const usd = new Intl.NumberFormat(numberLocale, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amountSyp * USD_PER_SYP);

  return `${syp} SYP (~${usd})`;
}
