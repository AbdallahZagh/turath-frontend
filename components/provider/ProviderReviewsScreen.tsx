"use client";

import { BadgeCheck, Inbox, MessageSquareQuote, Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState, type ReactNode } from "react";

import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { StarRating } from "@/components/ui/StarRating";
import { useProviderReviews } from "@/hooks/useProviderReviews";
import type { Locale } from "@/i18n/config";
import { formatMediumDate } from "@/lib/format/datetime";
import { initialsFromName } from "@/lib/format/initials";
import { formatCount, formatRating } from "@/lib/format/number";
import { localizedName } from "@/lib/i18n/localized";
import type { ReviewStars } from "@/lib/mock/adminReviews";
import type { ProviderReview } from "@/lib/mock/providerReviews";

const ALL_RATINGS = "all";
const RATINGS: ReviewStars[] = [5, 4, 3, 2, 1];

function ReviewsSkeleton(): ReactNode {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid items-stretch gap-5 lg:grid-cols-2">
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-56" />
        ))}
      </div>
    </div>
  );
}

function ReviewCard({ review, locale }: { review: ProviderReview; locale: Locale }): ReactNode {
  const t = useTranslations("provider.reviews");
  const tUi = useTranslations("ui");
  const guestName = localizedName(review.guestName, locale);

  return (
    <GlassPanel className="h-full p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="bg-primary text-primary-foreground grid size-11 shrink-0 place-items-center rounded-full text-xs font-bold">
            {initialsFromName(guestName)}
          </span>
          <div className="min-w-0">
            <p className="text-prose truncate font-semibold">{guestName}</p>
            <p className="text-prose-muted mt-0.5 text-xs">
              {localizedName(review.roomName, locale)}
            </p>
          </div>
        </div>
        <Badge
          variant="glass"
          className="text-primary"
          icon={<BadgeCheck className="size-3.5" aria-hidden />}
        >
          {t("verified")}
        </Badge>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <StarRating
          value={review.stars}
          size="md"
          label={tUi("ratingOutOf", { value: formatCount(review.stars, locale) })}
        />
        <time className="text-prose-muted text-xs" dateTime={review.submittedAt}>
          {formatMediumDate(review.submittedAt, locale)}
        </time>
      </div>

      <blockquote className="text-prose mt-4 text-sm leading-7">
        “{localizedName(review.comment, locale)}”
      </blockquote>

      <div className="border-border mt-auto flex flex-wrap items-center justify-between gap-2 border-t pt-4 text-xs">
        <span className="text-prose-muted">
          {t("stayed", { date: formatMediumDate(review.stayedAt, locale) })}
        </span>
        <span className="text-prose font-mono font-semibold tracking-wide">
          {review.bookingReference}
        </span>
      </div>
    </GlassPanel>
  );
}

export function ProviderReviewsScreen(): ReactNode {
  const t = useTranslations("provider.reviews");
  const tUi = useTranslations("ui");
  const rawLocale = useLocale();
  const locale: Locale = rawLocale === "ar" ? "ar" : "en";
  const query = useProviderReviews();
  const [rating, setRating] = useState(ALL_RATINGS);

  const summary = useMemo(() => {
    const reviews = query.data ?? [];
    const total = reviews.reduce((sum, review) => sum + review.stars, 0);
    return {
      average: reviews.length > 0 ? total / reviews.length : 0,
      count: reviews.length,
      distribution: RATINGS.map((stars) => ({
        stars,
        count: reviews.filter((review) => review.stars === stars).length,
      })),
    };
  }, [query.data]);

  const filtered = useMemo(() => {
    if (rating === ALL_RATINGS) return query.data ?? [];
    return (query.data ?? []).filter((review) => String(review.stars) === rating);
  }, [query.data, rating]);

  if (query.isPending) return <ReviewsSkeleton />;

  if (query.isError) {
    return (
      <ErrorState
        title={tUi("errorTitle")}
        description={tUi("errorDescription")}
        retryLabel={tUi("retry")}
        onRetry={() => void query.refetch()}
      />
    );
  }

  if (!query.data?.length) {
    return (
      <EmptyState
        icon={MessageSquareQuote}
        title={t("empty.title")}
        description={t("empty.description")}
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid items-stretch gap-5 lg:grid-cols-2">
        <GlassPanel className="flex h-full flex-col items-center justify-center px-6 py-8 text-center">
          <span className="bg-primary/12 text-primary grid size-12 place-items-center rounded-2xl">
            <Star className="size-6 fill-current" aria-hidden />
          </span>
          <p className="font-heading text-prose mt-4 text-5xl font-semibold tabular-nums">
            {formatRating(summary.average, locale)}
          </p>
          <StarRating
            value={summary.average}
            size="md"
            className="mt-3"
            label={tUi("ratingOutOf", { value: formatRating(summary.average, locale) })}
          />
          <p className="text-prose-muted mt-3 text-sm">
            {t("summary.count", { count: summary.count })}
          </p>
          <Badge variant="glass" className="text-primary mt-4" icon={<BadgeCheck className="size-3.5" aria-hidden />}>
            {t("summary.verifiedOnly")}
          </Badge>
        </GlassPanel>

        <GlassPanel className="h-full p-5 sm:p-6">
          <h2 className="font-heading text-prose text-xl font-semibold">{t("breakdown.title")}</h2>
          <p className="text-prose-muted mt-1 text-sm">{t("breakdown.description")}</p>
          <div className="mt-6 space-y-3">
            {summary.distribution.map((item) => {
              const ratio = summary.count > 0 ? item.count / summary.count : 0;
              return (
                <div key={item.stars} className="grid grid-cols-[3rem_minmax(0,1fr)_2.5rem] items-center gap-3">
                  <span className="text-prose flex items-center gap-1 text-sm font-semibold tabular-nums">
                    {formatCount(item.stars, locale)}
                    <Star className="text-accent size-3.5 fill-current" aria-hidden />
                  </span>
                  <div
                    className="bg-glass-control h-2 overflow-hidden rounded-full"
                    role="progressbar"
                    aria-label={t("breakdown.rowLabel", { stars: item.stars })}
                    aria-valuemin={0}
                    aria-valuemax={summary.count}
                    aria-valuenow={item.count}
                  >
                    <div className="bg-primary h-full rounded-full" style={{ width: `${ratio * 100}%` }} />
                  </div>
                  <span className="text-prose-muted text-end text-xs tabular-nums">
                    {formatCount(item.count, locale)}
                  </span>
                </div>
              );
            })}
          </div>
        </GlassPanel>
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-heading text-prose text-2xl font-semibold">{t("list.title")}</h2>
            <p className="text-prose-muted mt-1 text-sm">{t("list.description")}</p>
          </div>
          <Select
            variant="glass"
            compact
            label={t("filter.label")}
            value={rating}
            onChange={setRating}
            options={[
              { value: ALL_RATINGS, label: t("filter.all") },
              ...RATINGS.map((stars) => ({
                value: String(stars),
                label: t("filter.stars", { count: stars }),
              })),
            ]}
          />
        </div>

        {filtered.length > 0 ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {filtered.map((review) => (
              <ReviewCard key={review.id} review={review} locale={locale} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Inbox}
            title={t("empty.filteredTitle")}
            description={t("empty.filteredDescription")}
          />
        )}
      </section>
    </div>
  );
}
