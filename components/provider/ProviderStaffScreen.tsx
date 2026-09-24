"use client";

import {
  Eye,
  Pencil,
  QrCode,
  RotateCcw,
  ShieldCheck,
  ShieldLock,
  UserMinus,
  UserPlus,
  UsersRound,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState, type ReactNode } from "react";

import { ProviderStaffModal } from "@/components/provider/ProviderStaffModal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Menu } from "@/components/ui/Menu";
import { Skeleton } from "@/components/ui/Skeleton";
import { Table, type TableColumn } from "@/components/ui/Table";
import { useProviderStaff, useSetProviderStaffActive } from "@/hooks/useProviderStaff";
import type { Locale } from "@/i18n/config";
import { formatMediumDate } from "@/lib/format/datetime";
import { initialsFromName } from "@/lib/format/initials";
import type { ProviderStaffMember } from "@/lib/mock/providerStaff";
import { useAuthStore } from "@/store/authStore";
import { toast } from "@/store/toastStore";

type PendingAccessChange = { member: ProviderStaffMember; active: boolean };

function StaffSkeleton(): ReactNode {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="h-32" />)}
      </div>
      <Skeleton className="h-24" />
      <Skeleton className="h-80" />
    </div>
  );
}

export function ProviderStaffScreen(): ReactNode {
  const t = useTranslations("provider.staff");
  const tUi = useTranslations("ui");
  const rawLocale = useLocale();
  const locale: Locale = rawLocale === "ar" ? "ar" : "en";
  const role = useAuthStore((state) => state.user.role);
  const query = useProviderStaff();
  const changeAccess = useSetProviderStaffActive();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<ProviderStaffMember | null>(null);
  const [pendingChange, setPendingChange] = useState<PendingAccessChange | null>(null);

  const summary = useMemo(() => {
    const staff = query.data ?? [];
    return {
      active: staff.filter((member) => member.status === "active").length,
      invited: staff.filter((member) => member.status === "invited").length,
      scanners: staff.filter((member) => member.role === "scanner" && member.status !== "inactive").length,
    };
  }, [query.data]);

  function confirmAccessChange(): void {
    if (!pendingChange) return;
    changeAccess.mutate(
      { id: pendingChange.member.id, active: pendingChange.active },
      {
        onSuccess: (member) => {
          toast.success(
            pendingChange.active ? t("actions.reactivatedTitle") : t("actions.deactivatedTitle"),
            t(pendingChange.active ? "actions.reactivatedDescription" : "actions.deactivatedDescription", { name: member.name }),
          );
          setPendingChange(null);
        },
        onError: () => toast.error(t("actions.failureTitle"), t("actions.failureDescription")),
      },
    );
  }

  if (role !== "PROVIDER_OWNER") {
    return <EmptyState icon={ShieldLock} title={t("ownerOnly.title")} description={t("ownerOnly.description")} />;
  }

  if (query.isPending) return <StaffSkeleton />;

  if (query.isError) {
    return <ErrorState title={tUi("errorTitle")} description={tUi("errorDescription")} retryLabel={tUi("retry")} onRetry={() => void query.refetch()} />;
  }

  const columns: TableColumn<ProviderStaffMember>[] = [
    {
      id: "member",
      header: t("columns.member"),
      cell: (member) => (
        <div className="flex min-w-56 items-center gap-3">
          <span className="bg-primary/12 text-primary grid size-10 shrink-0 place-items-center rounded-full text-xs font-bold">
            {initialsFromName(member.name)}
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold">{member.name}</p>
            <p className="text-prose-muted mt-0.5 text-xs" dir="ltr">{member.phone}</p>
          </div>
        </div>
      ),
    },
    {
      id: "role",
      header: t("columns.role"),
      cell: (member) => (
        <Badge variant="glass" className="text-primary" icon={member.role === "scanner" ? <QrCode className="size-3.5" aria-hidden /> : <Eye className="size-3.5" aria-hidden />}>
          {t(`roles.${member.role}.title`)}
        </Badge>
      ),
    },
    {
      id: "status",
      header: t("columns.status"),
      cell: (member) => (
        <Badge
          variant={member.status === "active" ? "solid" : "outline"}
          className={member.status === "invited" ? "border-accent text-accent" : undefined}
        >
          {t(`status.${member.status}`)}
        </Badge>
      ),
    },
    {
      id: "invited",
      header: t("columns.invited"),
      cell: (member) => <span className="whitespace-nowrap">{formatMediumDate(member.invitedAt, locale)}</span>,
    },
    {
      id: "lastActive",
      header: t("columns.lastActive"),
      cell: (member) => (
        <span className="text-prose-muted whitespace-nowrap">
          {member.lastActiveAt ? formatMediumDate(member.lastActiveAt, locale) : t("neverActive")}
        </span>
      ),
    },
    {
      id: "actions",
      header: <span className="sr-only">{t("columns.actions")}</span>,
      align: "end",
      cell: (member) => (
        <Menu
          label={t("actions.menu", { name: member.name })}
          disabled={changeAccess.isPending}
          items={[
            {
              id: "edit",
              label: t("actions.edit"),
              icon: <Pencil className="size-4" />,
              onSelect: () => setEditingMember(member),
            },
            member.status === "inactive" ? {
              id: "reactivate",
              label: t("actions.reactivate"),
              icon: <RotateCcw className="size-4" />,
              onSelect: () => setPendingChange({ member, active: true }),
            } : {
              id: "deactivate",
              label: t("actions.deactivate"),
              icon: <UserMinus className="size-4" />,
              tone: "destructive" as const,
              onSelect: () => setPendingChange({ member, active: false }),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { key: "active", value: summary.active, icon: UsersRound, label: t("summary.active") },
          { key: "invited", value: summary.invited, icon: UserPlus, label: t("summary.invited") },
          { key: "scanners", value: summary.scanners, icon: QrCode, label: t("summary.scanners") },
        ].map(({ key, value, icon: Icon, label }) => (
          <GlassPanel key={key} className="flex h-full items-center gap-4 p-5">
            <span className="bg-primary/12 text-primary grid size-11 shrink-0 place-items-center rounded-2xl">
              <Icon className="size-5" aria-hidden />
            </span>
            <div>
              <p className="font-heading text-prose text-3xl font-semibold tabular-nums">{value}</p>
              <p className="text-prose-muted mt-0.5 text-xs font-semibold uppercase tracking-wide">{label}</p>
            </div>
          </GlassPanel>
        ))}
      </div>

      <GlassPanel className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between sm:p-6">
        <div className="flex min-w-0 items-start gap-3">
          <span className="bg-primary/12 text-primary grid size-11 shrink-0 place-items-center rounded-2xl">
            <ShieldCheck className="size-5" aria-hidden />
          </span>
          <div>
            <h2 className="font-heading text-prose text-xl font-semibold">{t("access.title")}</h2>
            <p className="text-prose-muted mt-1 max-w-3xl text-sm leading-relaxed">{t("access.description")}</p>
          </div>
        </div>
        <Button size="sm" className="shrink-0" onClick={() => setInviteOpen(true)}>
          <UserPlus className="size-4" aria-hidden />
          {t("invite.button")}
        </Button>
      </GlassPanel>

      <Table
        columns={columns}
        rows={query.data ?? []}
        getRowId={(member) => member.id}
        caption={t("caption")}
        emptyMessage={t("empty.description")}
      />

      <ProviderStaffModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
      <ProviderStaffModal open={editingMember !== null} member={editingMember} onClose={() => setEditingMember(null)} />
      <ConfirmDialog
        open={pendingChange !== null}
        onClose={() => setPendingChange(null)}
        onConfirm={confirmAccessChange}
        pending={changeAccess.isPending}
        tone={pendingChange?.active ? "neutral" : "destructive"}
        icon={pendingChange?.active ? RotateCcw : UserMinus}
        title={pendingChange?.active ? t("actions.reactivateTitle") : t("actions.deactivateTitle")}
        description={pendingChange?.active ? t("actions.reactivateDescription", { name: pendingChange?.member.name ?? "" }) : t("actions.deactivateDescription", { name: pendingChange?.member.name ?? "" })}
        confirmLabel={pendingChange?.active ? t("actions.reactivate") : t("actions.deactivate")}
        cancelLabel={t("actions.cancel")}
      />
    </div>
  );
}
