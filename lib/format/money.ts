import { getAdminCommissions } from "@/lib/mock/adminCommissions";

export function formatSyp(amountSyp: number, locale: string): string {
  const numberLocale = locale === "ar" ? "ar-SY" : "en-US";
  const syp = new Intl.NumberFormat(numberLocale).format(amountSyp);
  const sypPerUsd = getAdminCommissions().sypPerUsd;
  const usd = new Intl.NumberFormat(numberLocale, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(sypPerUsd > 0 ? amountSyp / sypPerUsd : 0);

  return `${syp} SYP (~${usd})`;
}
