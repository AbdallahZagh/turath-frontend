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
  const parts = new Intl.NumberFormat(numberLocaleFor(locale), {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).formatToParts(sypPerUsd > 0 ? amountSyp / sypPerUsd : 0);
  // "US$" is Latin inside Arabic digits; isolate it left-to-right so it does not split into "$US".
  return parts
    .map((part) => (part.type === "currency" ? `\u2066${part.value}\u2069` : part.value))
    .join("");
}

/**
 * Unicode first-strong isolate (the text equivalent of `<bdi>`). Keeps "~US$ 16.80" in one
 * piece inside Arabic text, and works in option hints and aria labels where JSX cannot go.
 */
function isolate(text: string): string {
  return `\u2068${text}\u2069`;
}

export function formatSyp(
  amountSyp: number,
  locale: string,
  displayCurrency: DisplayCurrency = "SYP",
): string {
  const syp = formatSypLabel(amountSyp, locale);
  const usd = formatUsdLabel(amountSyp, locale);

  if (displayCurrency === "USD") {
    return `${isolate(usd)} (${isolate(`~${syp}`)})`;
  }

  return `${isolate(syp)} (${isolate(`~${usd}`)})`;
}
