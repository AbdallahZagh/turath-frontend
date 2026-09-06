"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { UserRound } from "lucide-react";

import { AdminReviews } from "@/components/admin/AdminReviews";
import { AdminUserActivity } from "@/components/admin/AdminUserActivity";
import { AdminUserBookings } from "@/components/admin/AdminUserBookings";
import { AdminUserProfile } from "@/components/admin/AdminUserProfile";
import { AdminUserReliability } from "@/components/admin/AdminUserReliability";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAdminSettings } from "@/hooks/useAdminSettings";
import { useAdminUser, useSetAdminUserLocked } from "@/hooks/useAdminUsers";
import { reviewSummary } from "@/lib/mock/adminReviews";
import { DEFAULT_RELIABILITY_CUTOFFS } from "@/lib/mock/adminUsers";
import { toast } from "@/store/toastStore";

type AdminUserDetailProps = {
  userId: string;
};

export function AdminUserDetail({ userId }: AdminUserDetailProps): ReactNode {
  const t = useTranslations("admin.users");
  const tUi = useTranslations("ui");
  const { data, isPending, isError, refetch } = useAdminUser(userId);
  const { data: settings } = useAdminSettings();
  const lockUser = useSetAdminUserLocked();

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
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-52" />
          <Skeleton className="h-52" />
        </div>
        <Skeleton className="h-72" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!data) {
    return (
      <EmptyState
        icon={UserRound}
        title={t("detail.notFound")}
        description={t("detail.notFoundDescription")}
      />
    );
  }

  const { user, bookings, activity, reviews } = data;
  const rating = reviewSummary(reviews);
  const cutoffs = settings
    ? {
        vipAtOrAbove: settings.reliability.vipAtOrAbove,
        standardAtOrAbove: settings.reliability.standardAtOrAbove,
        restrictedAtOrAbove: settings.reliability.restrictedAtOrAbove,
      }
    : DEFAULT_RELIABILITY_CUTOFFS;

  function onToggleLock(): void {
    const nextLocked = !user.locked;
    lockUser.mutate(
      { id: user.id, locked: nextLocked },
      {
        onSuccess: () => {
          if (nextLocked) {
            toast.warn(t("detail.lockedTitle"), t("detail.lockedBody"));
          } else {
            toast.success(t("detail.unlockedTitle"), t("detail.unlockedBody"));
          }
        },
        onError: () => {
          toast.error(tUi("errorTitle"), tUi("errorDescription"));
        },
      },
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-8">
      <div className="grid gap-4 lg:grid-cols-2">
        <AdminUserProfile
          user={user}
          ratingAverage={rating.average}
          ratingCount={rating.count}
          lockPending={lockUser.isPending}
          onToggleLock={onToggleLock}
        />
        <AdminUserReliability user={user} cutoffs={cutoffs} />
      </div>
      <AdminUserBookings bookings={bookings} />
      <AdminReviews
        title={t("detail.reviewsTitle")}
        hint={t("detail.reviewsHint")}
        empty={t("detail.reviewsEmpty")}
        reviews={reviews}
      />
      <AdminUserActivity events={activity} />
    </div>
  );
}
