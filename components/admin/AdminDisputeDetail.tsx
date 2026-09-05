"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Scale } from "lucide-react";

import { AdminBookingDetail } from "@/components/admin/AdminBookingDetail";
import { AdminDisputeCase } from "@/components/admin/AdminDisputeCase";
import { AdminDisputeClaims } from "@/components/admin/AdminDisputeClaims";
import { AdminDisputeResolve } from "@/components/admin/AdminDisputeResolve";
import { Drawer } from "@/components/ui/Drawer";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAdminDispute, useResolveAdminDispute } from "@/hooks/useAdminDisputes";
import type { DisputeResolution } from "@/lib/mock/adminDisputes";
import { toast } from "@/store/toastStore";

type AdminDisputeDetailProps = {
  disputeId: string;
};

export function AdminDisputeDetail({ disputeId }: AdminDisputeDetailProps): ReactNode {
  const t = useTranslations("admin.disputes");
  const tBookings = useTranslations("admin.bookings");
  const tUi = useTranslations("ui");
  const { data, isPending, isError, refetch } = useAdminDispute(disputeId);
  const resolveDispute = useResolveAdminDispute();
  const [bookingOpen, setBookingOpen] = useState(false);

  if (isError) {
    return (
      <ErrorState
        title={tUi("errorTitle")}
        description={tUi("errorDescription")}
        retryLabel={tUi("retry")}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  if (isPending) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-52" />
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!data) {
    return (
      <EmptyState
        icon={Scale}
        title={t("detail.notFound")}
        description={t("detail.notFoundDescription")}
      />
    );
  }

  const { dispute, booking, guestId, providerId } = data;

  function onResolve(status: DisputeResolution, notes: { en: string; ar: string }): void {
    resolveDispute.mutate(
      { id: dispute.id, status, notes },
      {
        onSuccess: () => {
          if (status === "resolvedGuest") {
            toast.success(t("detail.resolvedGuestTitle"), t("detail.resolvedGuestBody"));
            return;
          }
          toast.success(t("detail.resolvedProviderTitle"), t("detail.resolvedProviderBody"));
        },
        onError: () => {
          toast.error(tUi("errorTitle"), tUi("errorDescription"));
        },
      },
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-8">
      <AdminDisputeCase
        dispute={dispute}
        guestId={guestId}
        providerId={providerId}
        hasBooking={booking !== null}
        onOpenBooking={() => setBookingOpen(true)}
      />
      <AdminDisputeClaims dispute={dispute} />
      <AdminDisputeResolve
        dispute={dispute}
        pending={resolveDispute.isPending}
        onResolve={onResolve}
      />
      <Drawer
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        title={tBookings("detail.title")}
      >
        {booking ? <AdminBookingDetail booking={booking} /> : null}
      </Drawer>
    </div>
  );
}
