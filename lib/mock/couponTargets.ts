import type { LocalizedName } from "@/lib/i18n/localized";
import { listMockEvents } from "@/lib/mock/events";
import { listMockGuides } from "@/lib/mock/guides";
import { listMockHotels } from "@/lib/mock/hotels";
import type { LandingPillarId } from "@/lib/mock/landing";
import { listMockRestaurants } from "@/lib/mock/restaurants";
import { listMockTrips } from "@/lib/mock/trips";

export const COUPON_BOOKING_TYPES = ["hotel", "restaurant", "trip", "event", "guide"] as const;

export type CouponBookingType = (typeof COUPON_BOOKING_TYPES)[number];

export type CouponTarget = {
  bookingType: CouponBookingType;
  listingId: string;
  listingName: LocalizedName;
  providerId: string;
  providerName: LocalizedName;
  pillar: LandingPillarId;
};

function providerId(bookingType: CouponBookingType, value: string): string {
  return `${bookingType}:${value}`;
}

function slug(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase("en")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function listCouponTargets(): CouponTarget[] {
  return [
    ...listMockHotels().map((hotel): CouponTarget => ({
      bookingType: "hotel",
      listingId: hotel.id,
      listingName: hotel.name,
      providerId: providerId("hotel", hotel.id),
      providerName: hotel.name,
      pillar: "hotels",
    })),
    ...listMockRestaurants().map((restaurant): CouponTarget => ({
      bookingType: "restaurant",
      listingId: restaurant.id,
      listingName: restaurant.name,
      providerId: providerId("restaurant", restaurant.id),
      providerName: restaurant.name,
      pillar: "dining",
    })),
    ...listMockTrips().map((trip): CouponTarget => ({
      bookingType: "trip",
      listingId: trip.id,
      listingName: trip.name,
      providerId: providerId("trip", slug(trip.providerName.en)),
      providerName: trip.providerName,
      pillar: "trips",
    })),
    ...listMockEvents().map((event): CouponTarget => ({
      bookingType: "event",
      listingId: event.id,
      listingName: event.name,
      providerId: providerId("event", slug(event.providerName.en)),
      providerName: event.providerName,
      pillar: "events",
    })),
    ...listMockGuides().map((guide): CouponTarget => ({
      bookingType: "guide",
      listingId: guide.id,
      listingName: guide.name,
      providerId: providerId("guide", guide.id),
      providerName: guide.name,
      pillar: "guides",
    })),
  ];
}

export function getCouponTarget(
  bookingType: CouponBookingType,
  listingId: string,
): CouponTarget | undefined {
  return listCouponTargets().find(
    (target) => target.bookingType === bookingType && target.listingId === listingId,
  );
}

export function listCouponTargetProviders(): Array<{ id: string; name: LocalizedName }> {
  const providers = new Map<string, LocalizedName>();
  for (const target of listCouponTargets()) {
    providers.set(target.providerId, target.providerName);
  }
  return Array.from(providers, ([id, name]) => ({ id, name: { ...name } }));
}
