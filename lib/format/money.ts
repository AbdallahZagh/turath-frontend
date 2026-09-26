import { getAdminCommissions } from "@/lib/mock/adminCommissions";

export type DisplayCurrency = "SYP" | "USD";

function numberLocaleFor(locale: string): string {
  return locale === "ar" ? "ar-SY" : "en-US";
}

/** Matches `landing.header.currencySyp` in each locale's messages. */
function sypSymbolFor(locale: string): string {
  return locale === "ar" ? "ل.س" : "SYP";
}

export function formatSypLabel(amountSyp: number, locale: string): string {
  return `${new Intl.NumberFormat(numberLocaleFor(locale)).format(amountSyp)} ${sypSymbolFor(locale)}`;
}

function formatUsdLabel(amountSyp: number, locale: string): string {
  const sypPerUsd = getAdminCommissions().sypPerUsd;
  return new Intl.NumberFormat(numberLocaleFor(locale), {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(sypPerUsd > 0 ? amountSyp / sypPerUsd : 0);
}

export function formatSyp(
  amountSyp: number,
  locale: string,
  displayCurrency: DisplayCurrency = "SYP",
): string {
  const syp = formatSypLabel(amountSyp, locale);
  const usd = formatUsdLabel(amountSyp, locale);

  if (displayCurrency === "USD") {
    return `${usd} (~${syp})`;
  }

  return `${syp} (~${usd})`;
}
