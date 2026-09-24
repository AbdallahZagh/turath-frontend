"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  BellRing,
  CalendarClock,
  CalendarSync,
  CircleDollarSign,
  Globe2,
  Languages,
  MessageSquareText,
  Save,
  type LucideIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Controller, useForm, useWatch, type Control } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SegmentSwitch } from "@/components/ui/SegmentSwitch";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { useUpdateProviderSettings } from "@/hooks/useProviderSettings";
import { setLocaleCookie } from "@/i18n/set-locale";
import type { ProviderSettings } from "@/lib/mock/providerSettings";
import type { ProviderSettingsValues } from "@/lib/validation/providerSettings";
import { providerSettingsSchema } from "@/lib/validation/providerSettings";
import { toast } from "@/store/toastStore";

type NotificationKey = keyof ProviderSettingsValues["notifications"];

type NotificationPreference = {
  key: NotificationKey;
  icon: LucideIcon;
  title: string;
  description: string;
};

function SectionHeading({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}): ReactNode {
  return (
    <div className="flex items-start gap-3">
      <span className="bg-primary/12 text-primary grid size-11 shrink-0 place-items-center rounded-2xl">
        <Icon className="size-5" aria-hidden />
      </span>
      <div>
        <h2 className="font-heading text-prose text-xl font-semibold">{title}</h2>
        <p className="text-prose-muted mt-1 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function NotificationRows({
  control,
  preferences,
}: {
  control: Control<ProviderSettingsValues>;
  preferences: NotificationPreference[];
}): ReactNode {
  return (
    <div className="divide-border divide-y">
      {preferences.map(({ key, icon: Icon, title, description }) => (
        <Controller
          key={key}
          control={control}
          name={`notifications.${key}`}
          render={({ field }) => (
            <div className="flex items-center justify-between gap-5 py-4 first:pt-0 last:pb-0">
              <div className="flex min-w-0 items-start gap-3">
                <span className="bg-glass-control text-primary grid size-9 shrink-0 place-items-center rounded-xl">
                  <Icon className="size-4" aria-hidden />
                </span>
                <div>
                  <p className="text-prose text-sm font-semibold">{title}</p>
                  <p className="text-prose-muted mt-1 text-xs leading-relaxed">{description}</p>
                </div>
              </div>
              <Switch
                compact
                checked={field.value}
                onChange={(event) => field.onChange(event.target.checked)}
                aria-label={title}
              />
            </div>
          )}
        />
      ))}
    </div>
  );
}

export function ProviderSettingsForm({ settings }: { settings: ProviderSettings }): ReactNode {
  const t = useTranslations("provider.settings");
  const currentLocale = useLocale();
  const router = useRouter();
  const update = useUpdateProviderSettings();
  const form = useForm<ProviderSettingsValues>({
    resolver: zodResolver(providerSettingsSchema),
    defaultValues: settings,
  });
  const currencyDisplay = useWatch({ control: form.control, name: "currencyDisplay" });

  const notificationPreferences: NotificationPreference[] = [
    { key: "newBookings", icon: BellRing, title: t("notifications.items.newBookings.title"), description: t("notifications.items.newBookings.description") },
    { key: "bookingChanges", icon: CalendarSync, title: t("notifications.items.bookingChanges.title"), description: t("notifications.items.bookingChanges.description") },
    { key: "arrivalReminders", icon: CalendarClock, title: t("notifications.items.arrivalReminders.title"), description: t("notifications.items.arrivalReminders.description") },
    { key: "guestReviews", icon: MessageSquareText, title: t("notifications.items.guestReviews.title"), description: t("notifications.items.guestReviews.description") },
    { key: "financeReminders", icon: CircleDollarSign, title: t("notifications.items.financeReminders.title"), description: t("notifications.items.financeReminders.description") },
  ];

  function submit(values: ProviderSettingsValues): void {
    update.mutate(values, {
      onSuccess: (saved) => {
        form.reset(saved);
        toast.success(t("saved.title"), t("saved.description"));
        if (saved.language !== currentLocale) {
          void setLocaleCookie(saved.language).then(() => router.refresh());
        }
      },
      onError: () => toast.error(t("saveError.title"), t("saveError.description")),
    });
  }

  return (
    <form className="flex flex-col gap-5" noValidate onSubmit={form.handleSubmit(submit)}>
      <GlassPanel className="p-5 sm:p-6">
        <SectionHeading icon={BellRing} title={t("notifications.title")} description={t("notifications.description")} />
        <div className="mt-6">
          <NotificationRows control={form.control} preferences={notificationPreferences} />
        </div>
      </GlassPanel>

      <div className="grid items-stretch gap-5 xl:grid-cols-2">
        <GlassPanel className="h-full p-5 sm:p-6">
          <SectionHeading icon={Languages} title={t("language.title")} description={t("language.description")} />
          <Controller
            control={form.control}
            name="language"
            render={({ field }) => (
              <SegmentSwitch
                variant="glass"
                className="mt-6 w-full"
                value={field.value}
                onChange={field.onChange}
                aria-label={t("language.label")}
                options={[
                  { value: "en", label: t("language.english") },
                  { value: "ar", label: t("language.arabic") },
                ]}
              />
            )}
          />
          <p className="text-prose-muted mt-3 text-xs leading-relaxed">{t("language.hint")}</p>
        </GlassPanel>

        <GlassPanel className="h-full p-5 sm:p-6">
          <SectionHeading icon={Globe2} title={t("timezone.title")} description={t("timezone.description")} />
          <Controller
            control={form.control}
            name="timezone"
            render={({ field }) => (
              <Select
                variant="glass"
                className="mt-6 w-full"
                value={field.value}
                onChange={field.onChange}
                label={t("timezone.label")}
                options={[
                  { value: "Asia/Damascus", label: t("timezone.options.damascus") },
                  { value: "Asia/Riyadh", label: t("timezone.options.riyadh") },
                  { value: "UTC", label: t("timezone.options.utc") },
                ]}
              />
            )}
          />
          <p className="text-prose-muted mt-3 text-xs leading-relaxed">{t("timezone.hint")}</p>
        </GlassPanel>
      </div>

      <GlassPanel className="p-5 sm:p-6">
        <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.8fr)]">
          <div>
            <SectionHeading icon={CircleDollarSign} title={t("currency.title")} description={t("currency.description")} />
            <Controller
              control={form.control}
              name="currencyDisplay"
              render={({ field }) => (
                <SegmentSwitch
                  variant="glass"
                  className="mt-6 w-full max-w-xl"
                  value={field.value}
                  onChange={field.onChange}
                  aria-label={t("currency.label")}
                  options={[
                    { value: "sypWithUsd", label: t("currency.options.sypWithUsd") },
                    { value: "sypOnly", label: t("currency.options.sypOnly") },
                  ]}
                />
              )}
            />
          </div>
          <div className="bg-glass-control border-border rounded-2xl border p-5">
            <p className="text-prose-muted text-xs font-semibold uppercase tracking-wide">{t("currency.preview")}</p>
            <p className="font-heading text-prose mt-2 text-2xl font-semibold" dir="ltr">
              {currencyDisplay === "sypWithUsd" ? "240,000 SYP (~$16.80)" : "240,000 SYP"}
            </p>
            <p className="text-prose-muted mt-2 text-xs leading-relaxed">{t("currency.cashHint")}</p>
          </div>
        </div>
      </GlassPanel>

      <div className="flex justify-end">
        <Button type="submit" disabled={!form.formState.isDirty || update.isPending}>
          <Save className="size-4" aria-hidden />
          {update.isPending ? t("saving") : t("save")}
        </Button>
      </div>
    </form>
  );
}
