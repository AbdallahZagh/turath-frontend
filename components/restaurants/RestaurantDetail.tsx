"use client";

import { ArrowLeft, CalendarCheck, Clock3, MapPin, Navigation, ShieldCheck, UtensilsCrossed, UsersRound } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { ListingGallery } from "@/components/listings/ListingGallery";
import { ListingLocationMap } from "@/components/maps/ListingLocationMap";
import { RestaurantAmenityList } from "@/components/restaurants/RestaurantAmenityList";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Skeleton } from "@/components/ui/Skeleton";
import { StarRating } from "@/components/ui/StarRating";
import { useRestaurant } from "@/hooks/useRestaurants";
import type { Locale } from "@/i18n/config";
import { formatSyp } from "@/lib/format/money";
import { localizedName } from "@/lib/i18n/localized";

export function RestaurantDetail({ restaurantId, basePath = "/restaurants" }: { restaurantId: string; basePath?: string }): ReactNode {
  const t = useTranslations("restaurants");
  const td = useTranslations("restaurants.detail");
  const tz = useTranslations("restaurants.zones");
  const tGov = useTranslations("landing.governorates");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const query = useRestaurant(restaurantId);

  if (query.isPending) return <div className="space-y-6"><Skeleton className="aspect-[16/7]" /><div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]"><Skeleton className="h-96" /><Skeleton className="h-80" /></div></div>;
  if (query.isError) return <ErrorState title={t("states.detailErrorTitle")} description={t("states.errorDescription")} retryLabel={t("states.retry")} onRetry={() => void query.refetch()} />;
  if (!query.data) return <EmptyState icon={UtensilsCrossed} title={t("states.notFoundTitle")} description={t("states.notFoundDescription")} action={<Button href={basePath} variant="outline" size="sm">{td("back")}</Button>} />;

  const restaurant = query.data;
  const name = localizedName(restaurant.name, loc);
  const lowestPrice = Math.min(...restaurant.zones.map((zone) => zone.pricePerGuestSyp));
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${restaurant.coordinates.latitude},${restaurant.coordinates.longitude}`;
  return (
    <>
      <Button href={basePath} variant="glass" size="sm" className="mb-5 w-fit"><ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />{td("back")}</Button>
      <ListingGallery images={restaurant.gallery} imageAlt={td("galleryImage", { restaurant: name })} openImageLabel={(number) => td("openImage", { number })} />
      <div className="mt-7 grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-7">
          <section><div className="flex flex-wrap items-center gap-2">{restaurant.verified ? <Badge variant="solid" icon={<ShieldCheck className="size-3.5" aria-hidden />}>{t("verified")}</Badge> : null}<Badge icon={<MapPin className="size-3.5" aria-hidden />}>{tGov(restaurant.governorate)}</Badge><Badge>{localizedName(restaurant.cuisine, loc)}</Badge></div><h1 className="font-heading text-prose mt-4 text-3xl font-semibold sm:text-4xl lg:text-5xl">{name}</h1><div className="mt-3 flex flex-wrap items-center gap-2 text-sm"><StarRating value={restaurant.rating} size="md" label={t("ratingLabel", { rating: restaurant.rating })} /><span className="text-prose font-semibold">{restaurant.rating.toFixed(1)}</span><span className="text-prose-muted">{t("reviewsCount", { count: restaurant.reviewCount })}</span><span className="text-prose-muted" aria-hidden>·</span><span className="text-prose-muted">{localizedName(restaurant.address, loc)}</span></div></section>
          <GlassPanel className="p-6 sm:p-7"><h2 className="font-heading text-prose text-2xl font-semibold">{td("about")}</h2><p className="text-prose-muted mt-3 leading-7">{localizedName(restaurant.description, loc)}</p></GlassPanel>
          <div className="grid gap-7 md:grid-cols-2">
            <GlassPanel className="p-6"><h2 className="font-heading text-prose text-xl font-semibold">{td("amenities")}</h2><div className="mt-4"><RestaurantAmenityList amenities={restaurant.amenities} /></div></GlassPanel>
            <GlassPanel className="p-6"><h2 className="font-heading text-prose text-xl font-semibold">{td("hours")}</h2><p className="text-prose-muted mt-4 flex items-center gap-2 text-sm"><Clock3 className="text-accent size-4" aria-hidden />{localizedName(restaurant.openingHours, loc)}</p><h3 className="text-prose mt-6 font-semibold">{td("menuHighlights")}</h3><ul className="text-prose-muted mt-3 grid gap-2 text-sm">{restaurant.menuHighlights.map((item) => <li key={item.en}>• {localizedName(item, loc)}</li>)}</ul></GlassPanel>
          </div>
          <GlassPanel className="p-6 sm:p-7"><h2 className="font-heading text-prose text-2xl font-semibold">{td("seating")}</h2><div className="mt-5 grid gap-4 sm:grid-cols-2">{restaurant.zones.map((zone) => <div key={zone.id} className="bg-glass-control rounded-2xl p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="text-prose font-semibold">{tz(zone.id)}</h3><p className="text-prose-muted mt-1 flex items-center gap-1.5 text-sm"><UsersRound className="size-4" aria-hidden />{td("zoneCapacity", { count: zone.capacity })}</p></div><div className="text-end"><p className="text-prose font-semibold">{formatSyp(zone.pricePerGuestSyp, loc)}</p><p className="text-prose-muted text-xs">{t("perGuest")}</p></div></div></div>)}</div></GlassPanel>
          <div className="grid gap-7 md:grid-cols-2"><GlassPanel className="p-6"><h2 className="font-heading text-prose text-xl font-semibold">{td("availableTimes")}</h2><div className="mt-4 flex flex-wrap gap-2">{restaurant.timeSlots.map((slot) => <Badge key={slot} icon={<Clock3 className="size-3.5" aria-hidden />}>{slot}</Badge>)}</div></GlassPanel><GlassPanel className="p-6"><h2 className="font-heading text-prose text-xl font-semibold">{td("location")}</h2><ListingLocationMap latitude={restaurant.coordinates.latitude} longitude={restaurant.coordinates.longitude} label={`${td("location")}: ${name}`} /><p className="text-prose-muted mt-3 text-sm">{localizedName(restaurant.address, loc)}</p><a href={mapHref} target="_blank" rel="noreferrer" className="text-primary mt-3 inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"><Navigation className="size-4" aria-hidden />{td("navigate")}</a></GlassPanel></div>
          <GlassPanel className="p-6 sm:p-7"><h2 className="font-heading text-prose text-2xl font-semibold">{td("reviews")}</h2>{restaurant.reviews.length ? <div className="mt-5 grid gap-4 sm:grid-cols-2">{restaurant.reviews.map((review) => <article key={review.id} className="bg-glass-control rounded-2xl p-4"><div className="flex items-center justify-between gap-3"><p className="text-prose font-semibold">{review.guestName}</p><StarRating value={review.rating} label={t("ratingLabel", { rating: review.rating })} /></div><p className="text-prose-muted mt-3 text-sm leading-relaxed">{localizedName(review.comment, loc)}</p><time dateTime={review.date} className="text-prose-muted mt-3 block text-xs">{review.date}</time></article>)}</div> : <p className="text-prose-muted mt-3 text-sm">{td("noReviews")}</p>}</GlassPanel>
        </div>
        <GlassPanel className="p-6 lg:sticky lg:top-28"><p className="text-prose-muted text-sm">{t("from")}</p><p className="text-prose mt-1 text-xl font-semibold">{formatSyp(lowestPrice, loc)}</p><p className="text-prose-muted text-xs">{t("perGuest")}</p><div className="border-border my-5 border-t" /><p className="text-prose-muted text-sm leading-relaxed">{td("cashOnArrival")}</p><Button href={`/bookings/new?type=restaurant&id=${restaurant.id}`} className="mt-5 w-full"><CalendarCheck className="size-5" aria-hidden />{td("book")}</Button></GlassPanel>
      </div>
    </>
  );
}
