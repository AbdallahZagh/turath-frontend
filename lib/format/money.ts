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

/**
 * SYP → whole US cents, rounded to the nearest cent (half a cent rounds up). The relative
 * epsilon keeps a float like 1004.9999999 from landing a cent low.
 */
export function sypToUsdCents(amountSyp: number, sypPerUsd: number): number {
  if (sypPerUsd <= 0) {
    return 0;
  }
  return Math.round(((amountSyp * 100) / sypPerUsd) * (1 + Number.EPSILON));
}

/**
 * USD part next to SYP. `approx` adds the leading "~". In Arabic the whole part is one
 * left-to-right isolate — "~US$ ١٦٫٨٠" — so the tilde stays at its start and "US$" never
 * splits from the number or flips when the line wraps.
 */
export function formatUsdLabel(
  amountSyp: number,
  locale: string,
  approx: boolean,
  sypPerUsd: number = getAdminCommissions().sypPerUsd,
): string {
  const usd = sypToUsdCents(amountSyp, sypPerUsd) / 100;
  const tilde = approx ? "~" : "";
  if (locale === "ar") {
    const amount = new Intl.NumberFormat(numberLocaleFor(locale), {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(usd);
    return `\u2066${tilde}US$ ${amount}\u2069`;
  }
  const amount = new Intl.NumberFormat(numberLocaleFor(locale), {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(usd);
  return `${tilde}${amount}`;
}

/**
 * Unicode first-strong isolate (the text equivalent of `<bdi>`). Keeps "~US$ 16.80" in one
 * piece inside Arabic text, and works in option hints and aria labels where JSX cannot go.
 */
function isolate(text: string): string {
  return `\u2068${text}\u2069`;
}

/**
 * The two halves of a price, each already isolated: `primary` in the display currency and
 * `secondary` as the approximate other currency in parentheses. Tables stack them on two lines.
 */
export function formatSypParts(
  amountSyp: number,
  locale: string,
  displayCurrency: DisplayCurrency = "SYP",
): { primary: string; secondary: string } {
  const syp = formatSypLabel(amountSyp, locale);
  if (displayCurrency === "USD") {
    return {
      primary: isolate(formatUsdLabel(amountSyp, locale, false)),
      secondary: `(${isolate(`~${syp}`)})`,
    };
  }
  return {
    primary: isolate(syp),
    secondary: `(${isolate(formatUsdLabel(amountSyp, locale, true))})`,
  };
}

export function formatSyp(
  amountSyp: number,
  locale: string,
  displayCurrency: DisplayCurrency = "SYP",
): string {
  const { primary, secondary } = formatSypParts(amountSyp, locale, displayCurrency);
  return `${primary} ${secondary}`;
}
