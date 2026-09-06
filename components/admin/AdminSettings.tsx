"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";

import { ADMIN_TOOLBAR_HEIGHT } from "@/components/admin/AdminFilterBar";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Input } from "@/components/ui/Input";
import { SegmentSwitch } from "@/components/ui/SegmentSwitch";
import { Skeleton } from "@/components/ui/Skeleton";
import { Switch } from "@/components/ui/Switch";
import { Table, type TableColumn } from "@/components/ui/Table";
import { useAdminSettings, useSaveAdminSettings } from "@/hooks/useAdminSettings";
import type { Locale } from "@/i18n/config";
import { formatSyp } from "@/lib/format/money";
import {
  COMMISSION_TIERS,
  FEATURED_SLOT_IDS,
  OTP_CHANNELS,
  type AdminSettings,
  type CommissionTierId,
  type FeaturedSlotId,
  type OtpChannel,
} from "@/lib/mock/adminSettings";
import { defaultFeaturedSlotEnables } from "@/lib/mock/featuredSlots";
import { toast } from "@/store/toastStore";

type SettingsDraft = {
  ceilings: Record<CommissionTierId, string>;
  vipAtOrAbove: string;
  standardAtOrAbove: string;
  restrictedAtOrAbove: string;
  lockSuspended: boolean;
  otpChannel: OtpChannel;
  featuringEnabled: boolean;
  featuredSlots: Record<FeaturedSlotId, boolean>;
  webCheckIn: boolean;
};

function parseScoreCutoff(value: string): number | undefined {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100) {
    return undefined;
  }
  return Math.round(parsed);
}

function draftFromSettings(data: AdminSettings): SettingsDraft {
  return {
    ceilings: {
      preferred: String(data.creditCeilingsSyp.preferred),
      standard: String(data.creditCeilingsSyp.standard),
      highRisk: String(data.creditCeilingsSyp.highRisk),
    },
    vipAtOrAbove: String(data.reliability.vipAtOrAbove),
    standardAtOrAbove: String(data.reliability.standardAtOrAbove),
    restrictedAtOrAbove: String(data.reliability.restrictedAtOrAbove),
    lockSuspended: data.reliability.lockSuspended,
    otpChannel: data.flags.otpChannel,
    featuringEnabled: data.flags.featuringEnabled,
    featuredSlots: { ...defaultFeaturedSlotEnables(), ...data.flags.featuredSlots },
    webCheckIn: data.flags.webCheckIn,
  };
}

function isOtpChannel(value: string): value is OtpChannel {
  return (OTP_CHANNELS as readonly string[]).includes(value);
}

export function AdminSettings(): ReactNode {
  const t = useTranslations("admin.settings");
  const tUi = useTranslations("ui");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const { data, isPending, isError, refetch } = useAdminSettings();
  const saveSettings = useSaveAdminSettings();

  const [source, setSource] = useState(data);
  const [draft, setDraft] = useState<SettingsDraft | null>(() =>
    data ? draftFromSettings(data) : null,
  );

  if (data !== source) {
    setSource(data);
    if (data) {
      setDraft(draftFromSettings(data));
    }
  }

  function setCeiling(tier: CommissionTierId, value: string): void {
    setDraft((current) =>
      current ? { ...current, ceilings: { ...current.ceilings, [tier]: value } } : current,
    );
  }

  function setSlotEnabled(slot: FeaturedSlotId, enabled: boolean): void {
    setDraft((current) =>
      current
        ? {
            ...current,
            featuredSlots: { ...current.featuredSlots, [slot]: enabled },
          }
        : current,
    );
  }

  function onSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (!draft) {
      return;
    }

    const creditCeilingsSyp = {} as Record<CommissionTierId, number>;
    for (const tier of COMMISSION_TIERS) {
      const amount = Number(draft.ceilings[tier]);
      if (!Number.isFinite(amount) || amount <= 0) {
        toast.error(t("saveFailed"), t("invalidCredit"));
        return;
      }
      creditCeilingsSyp[tier] = Math.round(amount);
    }

    const vipAtOrAbove = parseScoreCutoff(draft.vipAtOrAbove);
    const standardAtOrAbove = parseScoreCutoff(draft.standardAtOrAbove);
    const restrictedAtOrAbove = parseScoreCutoff(draft.restrictedAtOrAbove);
    if (
      vipAtOrAbove === undefined ||
      standardAtOrAbove === undefined ||
      restrictedAtOrAbove === undefined ||
      !(restrictedAtOrAbove < standardAtOrAbove && standardAtOrAbove < vipAtOrAbove)
    ) {
      toast.error(t("saveFailed"), t("invalidReliability"));
      return;
    }

    saveSettings.mutate(
      {
        creditCeilingsSyp,
        reliability: {
          vipAtOrAbove,
          standardAtOrAbove,
          restrictedAtOrAbove,
          lockSuspended: draft.lockSuspended,
        },
        flags: {
          otpChannel: draft.otpChannel,
          featuringEnabled: draft.featuringEnabled,
          featuredSlots: { ...draft.featuredSlots },
          webCheckIn: draft.webCheckIn,
        },
      },
      {
        onSuccess: () => {
          toast.success(t("saved"), t("savedBody"));
        },
        onError: () => {
          toast.error(t("saveFailed"), t("saveFailedBody"));
        },
      },
    );
  }

  const creditRows = COMMISSION_TIERS.map((tier) => ({ tier }));
  const creditColumns: TableColumn<{ tier: CommissionTierId }>[] = [
    {
      id: "tier",
      header: t("credit.columns.tier"),
      cell: (row) => <span className="font-medium">{t(`tiers.${row.tier}`)}</span>,
    },
    {
      id: "ceiling",
      header: t("credit.columns.ceiling"),
      align: "end",
      cell: (row) => {
        const raw = draft?.ceilings[row.tier] ?? "";
        const amount = Number(raw);
        return (
          <div className="ms-auto flex w-56 flex-col items-end gap-1">
            <Input
              variant="glass"
              size="sm"
              type="number"
              min={1}
              step={1000}
              inputMode="numeric"
              value={raw}
              onChange={(event) => setCeiling(row.tier, event.target.value)}
              label={t("credit.columns.ceiling")}
            />
            {Number.isFinite(amount) && amount > 0 ? (
              <span className="text-prose-muted text-xs">{formatSyp(amount, loc)}</span>
            ) : null}
          </div>
        );
      },
    },
  ];

  if (isError) {
    return (
      <ErrorState
        className="flex-1 justify-center"
        title={tUi("errorTitle")}
        description={tUi("errorDescription")}
        retryLabel={tUi("retry")}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  if (isPending || !draft) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-56" />
        <Skeleton className="h-48" />
        <Skeleton className="h-56" />
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      <div className="flex shrink-0">
        <Button
          type="submit"
          size="sm"
          minHeight={ADMIN_TOOLBAR_HEIGHT}
          disabled={saveSettings.isPending}
        >
          {t("save")}
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-prose text-lg font-semibold">{t("credit.title")}</h2>
          <p className="text-prose-muted text-sm leading-relaxed">{t("credit.description")}</p>
        </div>
        <Table
          columns={creditColumns}
          rows={creditRows}
          getRowId={(row) => row.tier}
          caption={t("credit.title")}
          isLoading={false}
        />
      </div>

      <GlassPanel className="flex-none gap-4 p-5">
        <div className="flex flex-col gap-1">
          <h2 className="text-prose text-lg font-semibold">{t("reliability.title")}</h2>
          <p className="text-prose-muted text-sm leading-relaxed">
            {t("reliability.description")}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-prose-muted text-xs font-medium">
              {t("reliability.vipAtOrAbove")}
            </span>
            <Input
              variant="glass"
              size="sm"
              type="number"
              min={0}
              max={100}
              step={1}
              inputMode="numeric"
              value={draft.vipAtOrAbove}
              onChange={(event) =>
                setDraft((current) =>
                  current ? { ...current, vipAtOrAbove: event.target.value } : current,
                )
              }
              label={t("reliability.vipAtOrAbove")}
              className="w-28"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-prose-muted text-xs font-medium">
              {t("reliability.standardAtOrAbove")}
            </span>
            <Input
              variant="glass"
              size="sm"
              type="number"
              min={0}
              max={100}
              step={1}
              inputMode="numeric"
              value={draft.standardAtOrAbove}
              onChange={(event) =>
                setDraft((current) =>
                  current
                    ? { ...current, standardAtOrAbove: event.target.value }
                    : current,
                )
              }
              label={t("reliability.standardAtOrAbove")}
              className="w-28"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-prose-muted text-xs font-medium">
              {t("reliability.restrictedAtOrAbove")}
            </span>
            <Input
              variant="glass"
              size="sm"
              type="number"
              min={0}
              max={100}
              step={1}
              inputMode="numeric"
              value={draft.restrictedAtOrAbove}
              onChange={(event) =>
                setDraft((current) =>
                  current
                    ? { ...current, restrictedAtOrAbove: event.target.value }
                    : current,
                )
              }
              label={t("reliability.restrictedAtOrAbove")}
              className="w-28"
            />
          </label>
        </div>
        <p className="text-prose-muted text-xs">{t("reliability.tierHint")}</p>
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-prose text-sm font-medium">{t("reliability.lock")}</span>
            <span className="text-prose-muted text-xs leading-relaxed">
              {t("reliability.lockHint")}
            </span>
          </div>
          <Switch
            size="sm"
            checked={draft.lockSuspended}
            onChange={(event) =>
              setDraft((current) =>
                current ? { ...current, lockSuspended: event.target.checked } : current,
              )
            }
            aria-label={t("reliability.lock")}
          />
        </div>
      </GlassPanel>

      <GlassPanel className="flex-none gap-4 p-5">
        <div className="flex flex-col gap-1">
          <h2 className="text-prose text-lg font-semibold">{t("flags.title")}</h2>
          <p className="text-prose-muted text-sm leading-relaxed">{t("flags.description")}</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-prose-muted text-xs font-medium">{t("flags.otp")}</span>
          <SegmentSwitch
            variant="glass"
            size="sm"
            minHeight={ADMIN_TOOLBAR_HEIGHT}
            aria-label={t("flags.otp")}
            value={draft.otpChannel}
            onChange={(value) => {
              if (isOtpChannel(value)) {
                setDraft((current) =>
                  current ? { ...current, otpChannel: value } : current,
                );
              }
            }}
            options={[
              { value: "sms", label: t("flags.sms") },
              { value: "whatsapp", label: t("flags.whatsapp") },
            ]}
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-prose text-sm font-medium">{t("flags.featuring")}</span>
            <span className="text-prose-muted text-xs leading-relaxed">
              {t("flags.featuringHint")}
            </span>
          </div>
          <Switch
            size="sm"
            checked={draft.featuringEnabled}
            onChange={(event) =>
              setDraft((current) =>
                current
                  ? { ...current, featuringEnabled: event.target.checked }
                  : current,
              )
            }
            aria-label={t("flags.featuring")}
          />
        </div>
        <div className="border-glass-border flex flex-col gap-3 border-t pt-4">
          <div className="flex flex-col gap-1">
            <span className="text-prose text-sm font-medium">{t("flags.featuringSlots")}</span>
            <span className="text-prose-muted text-xs leading-relaxed">
              {t("flags.featuringSlotsHint")}
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {FEATURED_SLOT_IDS.map((slot) => (
              <div
                key={slot}
                className="flex items-center justify-between gap-3 rounded-xl border border-glass-border/70 px-3 py-2.5"
              >
                <span className="text-prose text-sm">{t(`flags.slots.${slot}`)}</span>
                <Switch
                  size="sm"
                  checked={draft.featuredSlots[slot]}
                  disabled={!draft.featuringEnabled}
                  onChange={(event) => setSlotEnabled(slot, event.target.checked)}
                  aria-label={t(`flags.slots.${slot}`)}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-prose text-sm font-medium">{t("flags.webCheckIn")}</span>
            <span className="text-prose-muted text-xs leading-relaxed">
              {t("flags.webCheckInHint")}
            </span>
          </div>
          <Switch
            size="sm"
            checked={draft.webCheckIn}
            onChange={(event) =>
              setDraft((current) =>
                current ? { ...current, webCheckIn: event.target.checked } : current,
              )
            }
            aria-label={t("flags.webCheckIn")}
          />
        </div>
      </GlassPanel>
    </form>
  );
}
