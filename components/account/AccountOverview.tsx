"use client";

import { CalendarDays, Mail, Phone, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { useTouristAccount } from "@/hooks/useTouristAccount";
import { initialsFromName } from "@/lib/format/initials";
import { useAuthStore } from "@/store/authStore";
import { isCurrency, useCurrencyStore } from "@/store/currencyStore";

export function AccountOverview(): ReactNode {
  const t = useTranslations("account");
  const user = useAuthStore((state) => state.user);
  const currency = useCurrencyStore((state) => state.currency);
  const setCurrency = useCurrencyStore((state) => state.setCurrency);
  const accountQuery = useTouristAccount();

  if (accountQuery.isPending) return <Skeleton className="h-96" />;
  if (accountQuery.isError) {
    return <ErrorState title={t("states.errorTitle")} description={t("states.errorBody")} retryLabel={t("states.retry")} onRetry={() => void accountQuery.refetch()} />;
  }

  const account = accountQuery.data;
  const currencyOptions: SelectOption[] = [
    { value: "SYP", label: t("preferences.syp") },
    { value: "USD", label: t("preferences.usd") },
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.75fr)]">
      <div className="space-y-6">
        <GlassPanel className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <span className="bg-primary text-primary-foreground grid size-20 shrink-0 place-items-center rounded-3xl text-2xl font-bold">
              {initialsFromName(user.name)}
            </span>
            <div className="min-w-0">
              <p className="text-primary text-xs font-bold uppercase tracking-[0.15em]">{t("profile.guest")}</p>
              <h2 className="font-heading text-prose mt-1 text-3xl font-semibold">{user.name}</h2>
              <div className="text-prose-muted mt-3 flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:gap-x-5">
                <span className="inline-flex items-center gap-2"><Mail className="size-4" aria-hidden />{user.email}</span>
                <span className="inline-flex items-center gap-2"><Phone className="size-4" aria-hidden />{user.phone}</span>
              </div>
            </div>
          </div>
        </GlassPanel>

        <GlassPanel className="p-6 sm:p-8">
          <h2 className="font-heading text-prose text-2xl font-semibold">{t("preferences.title")}</h2>
          <p className="text-prose-muted mt-1 text-sm">{t("preferences.description")}</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-prose mb-2 text-sm font-semibold">{t("preferences.language")}</p>
              <LocaleSwitcher className="w-full" />
            </div>
            <div>
              <p className="text-prose mb-2 text-sm font-semibold">{t("preferences.currency")}</p>
              <Select
                variant="plain"
                options={currencyOptions}
                value={currency}
                onChange={(value) => { if (isCurrency(value)) setCurrency(value); }}
                label={t("preferences.currency")}
              />
            </div>
          </div>
        </GlassPanel>
      </div>

      <div className="space-y-6">
        <GlassPanel className="p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div><p className="text-prose-muted text-sm">{t("reliability.score")}</p><p className="font-heading text-prose mt-1 text-5xl font-semibold">{account.reliabilityScore}<span className="text-prose-muted text-xl">/100</span></p></div>
            <span className="bg-primary/12 text-primary rounded-full px-3 py-1 text-xs font-bold">{t(`reliability.tiers.${account.tier}`)}</span>
          </div>
          <div className="bg-border mt-5 h-2 overflow-hidden rounded-full"><div className="bg-primary h-full rounded-full" style={{ width: `${account.reliabilityScore}%` }} /></div>
          <p className="text-prose-muted mt-4 text-sm leading-relaxed">{t("reliability.summary")}</p>
          <Button href="/user/reliability" variant="outline" className="mt-5 w-full"><ShieldCheck className="size-4" aria-hidden />{t("reliability.open")}</Button>
        </GlassPanel>

        <GlassPanel className="p-6 sm:p-7">
          <span className="bg-primary/12 text-primary grid size-11 place-items-center rounded-2xl"><CalendarDays className="size-5" aria-hidden /></span>
          <h2 className="font-heading text-prose mt-4 text-xl font-semibold">{t("bookingsCard.title")}</h2>
          <p className="text-prose-muted mt-2 text-sm leading-relaxed">{t("bookingsCard.description")}</p>
          <Button href="/user/bookings" className="mt-5 w-full">{t("bookingsCard.open")}</Button>
        </GlassPanel>
      </div>
    </div>
  );
}
