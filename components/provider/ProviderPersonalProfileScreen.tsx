"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  BadgeCheck,
  CalendarDays,
  Edit3,
  Flag,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  ShieldLock,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { useForm, type FieldError } from "react-hook-form";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  useProviderPersonalProfile,
  useUpdateProviderPersonalProfile,
} from "@/hooks/useProviderPersonalProfile";
import type { Locale } from "@/i18n/config";
import { formatMediumDate } from "@/lib/format/datetime";
import { initialsFromName } from "@/lib/format/initials";
import { countryName } from "@/lib/geo/countries";
import type {
  ProviderAccountRole,
  ProviderOwnerPersonalProfile,
  ProviderPersonalProfile,
  ProviderStaffPersonalProfile,
} from "@/lib/mock/providerPersonalProfile";
import {
  providerPersonalProfileSchema,
  type ProviderPersonalProfileValues,
} from "@/lib/validation/providerPersonalProfile";
import { useAuthStore } from "@/store/authStore";
import { toast } from "@/store/toastStore";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: FieldError;
  children: ReactNode;
}): ReactNode {
  const t = useTranslations("provider.personalProfile.errors");
  return (
    <label className="block min-w-0">
      <span className="text-prose-muted mb-1.5 block text-xs font-semibold">{label}</span>
      {children}
      {error?.message ? (
        <span className="text-destructive mt-1.5 block text-xs">
          {t(error.message as "name" | "email" | "phone" | "nationality" | "dateOfBirth")}
        </span>
      ) : null}
    </label>
  );
}

function ProfileSummary({ profile }: { profile: ProviderPersonalProfile }): ReactNode {
  const t = useTranslations("provider.personalProfile");
  const rawLocale = useLocale();
  const locale: Locale = rawLocale === "ar" ? "ar" : "en";

  return (
    <GlassPanel className="h-full p-6 sm:p-7">
      <div className="flex flex-col items-center text-center">
        <span className="bg-primary text-primary-foreground grid size-20 place-items-center rounded-3xl text-2xl font-bold">
          {initialsFromName(profile.name)}
        </span>
        <h2 className="font-heading text-prose mt-4 text-2xl font-semibold">{profile.name}</h2>
        <Badge
          variant="glass"
          className="text-primary mt-3"
          icon={profile.role === "PROVIDER_OWNER" ? <BadgeCheck className="size-3.5" aria-hidden /> : <ShieldCheck className="size-3.5" aria-hidden />}
        >
          {t(`roles.${profile.role}`)}
        </Badge>
      </div>
      <dl className="border-border mt-6 space-y-4 border-t pt-6 text-sm">
        {profile.role === "PROVIDER_OWNER" ? <ProfileDetail icon={Mail} label={t("fields.email")} value={profile.email} ltr /> : null}
        <ProfileDetail icon={Phone} label={t("fields.phone")} value={profile.phone} ltr />
        {profile.role === "PROVIDER_OWNER" ? <ProfileDetail icon={Flag} label={t("fields.nationality")} value={countryName(profile.nationality, locale)} /> : null}
        {profile.role === "PROVIDER_STAFF" ? <ProfileDetail icon={ShieldCheck} label={t("fields.accessRole")} value={t(`accessRoles.${profile.accessRole}`)} /> : null}
        <ProfileDetail icon={CalendarDays} label={t("joined")} value={formatMediumDate(profile.joinedAt, locale)} />
      </dl>
    </GlassPanel>
  );
}

function ProfileDetail({
  icon: Icon,
  label,
  value,
  ltr = false,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  ltr?: boolean;
}): ReactNode {
  return (
    <div className="flex items-start gap-3">
      <Icon className="text-primary mt-0.5 size-4 shrink-0" aria-hidden />
      <div className="min-w-0">
        <dt className="text-prose-muted text-xs">{label}</dt>
        <dd className="text-prose mt-1 break-words font-medium" dir={ltr ? "ltr" : undefined}>{value}</dd>
      </div>
    </div>
  );
}

function OwnerProfileEditor({ profile }: { profile: ProviderOwnerPersonalProfile }): ReactNode {
  const t = useTranslations("provider.personalProfile");
  const update = useUpdateProviderPersonalProfile();
  const updateCurrentUser = useAuthStore((state) => state.updateCurrentUser);
  const form = useForm<ProviderPersonalProfileValues>({
    resolver: zodResolver(providerPersonalProfileSchema),
    defaultValues: {
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      nationality: profile.nationality,
      dateOfBirth: profile.dateOfBirth,
    },
  });

  function submit(values: ProviderPersonalProfileValues): void {
    update.mutate(
      { values },
      {
        onSuccess: (saved) => {
          form.reset(saved);
          updateCurrentUser({ name: saved.name, email: saved.email, phone: saved.phone });
          toast.success(t("saved.title"), t("saved.description"));
        },
        onError: () => toast.error(t("saveError.title"), t("saveError.description")),
      },
    );
  }

  return (
    <GlassPanel className="p-6 sm:p-7">
      <div className="flex items-start gap-3">
        <span className="bg-primary/12 text-primary grid size-11 shrink-0 place-items-center rounded-2xl">
          <Edit3 className="size-5" aria-hidden />
        </span>
        <div>
          <h2 className="font-heading text-prose text-xl font-semibold">{t("edit.title")}</h2>
          <p className="text-prose-muted mt-1 text-sm leading-relaxed">{t("edit.description")}</p>
        </div>
      </div>
      <form className="mt-6 space-y-5" noValidate onSubmit={form.handleSubmit(submit)}>
        <Field label={t("fields.name")} error={form.formState.errors.name}>
          <Input variant="glass" autoComplete="name" {...form.register("name")} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t("fields.email")} error={form.formState.errors.email}>
            <Input variant="glass" type="email" dir="ltr" autoComplete="email" {...form.register("email")} />
          </Field>
          <Field label={t("fields.phone")} error={form.formState.errors.phone}>
            <Input variant="glass" type="tel" dir="ltr" autoComplete="tel" {...form.register("phone")} />
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t("fields.nationality")} error={form.formState.errors.nationality}>
            <Input variant="glass" autoComplete="country-name" {...form.register("nationality")} />
          </Field>
          <Field label={t("fields.dateOfBirth")} error={form.formState.errors.dateOfBirth}>
            <Input variant="glass" type="date" autoComplete="bday" {...form.register("dateOfBirth")} />
          </Field>
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={!form.formState.isDirty || update.isPending}>
            <Save className="size-4" aria-hidden />
            {update.isPending ? t("saving") : t("save")}
          </Button>
        </div>
      </form>
    </GlassPanel>
  );
}

function StaffReadOnlyProfile({ profile }: { profile: ProviderStaffPersonalProfile }): ReactNode {
  const t = useTranslations("provider.personalProfile");
  const details = [
    { label: t("fields.name"), value: profile.name, icon: UserRound },
    { label: t("fields.phone"), value: profile.phone, icon: Phone, ltr: true },
    { label: t("fields.accessRole"), value: t(`accessRoles.${profile.accessRole}`), icon: ShieldCheck },
  ];

  return (
    <GlassPanel className="p-6 sm:p-7">
      <div className="flex items-start gap-3">
        <span className="bg-primary/12 text-primary grid size-11 shrink-0 place-items-center rounded-2xl">
          <ShieldLock className="size-5" aria-hidden />
        </span>
        <div>
          <h2 className="font-heading text-prose text-xl font-semibold">{t("readOnly.title")}</h2>
          <p className="text-prose-muted mt-1 text-sm leading-relaxed">{t("readOnly.description")}</p>
        </div>
      </div>
      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        {details.map(({ label, value, icon: Icon, ltr }) => (
          <div key={label} className="bg-glass-control border-border rounded-2xl border p-4">
            <Icon className="text-primary size-4" aria-hidden />
            <dt className="text-prose-muted mt-3 text-xs">{label}</dt>
            <dd className="text-prose mt-1 break-words text-sm font-semibold" dir={ltr ? "ltr" : undefined}>{value}</dd>
          </div>
        ))}
      </dl>
    </GlassPanel>
  );
}

export function ProviderPersonalProfileScreen(): ReactNode {
  const t = useTranslations("provider.personalProfile");
  const tUi = useTranslations("ui");
  const role = useAuthStore((state) => state.user.role);
  const providerRole: ProviderAccountRole = role === "PROVIDER_OWNER" ? "PROVIDER_OWNER" : "PROVIDER_STAFF";
  const query = useProviderPersonalProfile(providerRole);

  if (query.isPending) {
    return <div className="grid items-start gap-5 xl:grid-cols-[22rem_minmax(0,1fr)]"><Skeleton className="h-[30rem]" /><Skeleton className="h-[30rem]" /></div>;
  }

  if (query.isError) {
    return <ErrorState title={tUi("errorTitle")} description={tUi("errorDescription")} retryLabel={tUi("retry")} onRetry={() => void query.refetch()} />;
  }

  if (!query.data) {
    return <EmptyState icon={UserRound} title={t("empty.title")} description={t("empty.description")} />;
  }

  return (
    <div className="grid items-start gap-5 xl:grid-cols-[22rem_minmax(0,1fr)]">
      <ProfileSummary profile={query.data} />
      {query.data.role === "PROVIDER_OWNER" ? <OwnerProfileEditor profile={query.data} /> : <StaffReadOnlyProfile profile={query.data} />}
    </div>
  );
}
