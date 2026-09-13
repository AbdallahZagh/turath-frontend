import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { HotelCatalog } from "@/components/hotels/HotelCatalog";
import { PageHeader } from "@/components/ui/PageHeader";
import type {
  HotelFilters,
  HotelPriceRange,
  HotelRoomTypeId,
} from "@/lib/mock/hotels";
import { GOVERNORATES, type GovernorateSlug } from "@/lib/mock/landing";

type HotelSearchParams = Promise<Record<string, string | string[] | undefined>>;

const ROOM_TYPES: HotelRoomTypeId[] = ["single", "double", "suite"];
const PRICE_RANGES: HotelPriceRange[] = ["under150", "150to300", "over300"];

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseGuests(value: string | undefined): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 1 && parsed <= 8 ? parsed : 1;
}

function isGovernorate(value: string | undefined): value is GovernorateSlug {
  return value !== undefined && GOVERNORATES.some((item) => item.slug === value);
}

function isRoomType(value: string | undefined): value is HotelRoomTypeId {
  return value !== undefined && ROOM_TYPES.includes(value as HotelRoomTypeId);
}

function isPriceRange(value: string | undefined): value is HotelPriceRange {
  return value !== undefined && PRICE_RANGES.includes(value as HotelPriceRange);
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("hotels.headers.index");
  return {
    title: `${t("title")} | Turath`,
    description: t("description"),
  };
}

export default async function HotelsPage({
  searchParams,
}: {
  searchParams: HotelSearchParams;
}): Promise<ReactNode> {
  const params = await searchParams;
  const governorate = firstValue(params.governorate);
  const roomType = firstValue(params.roomType);
  const priceRange = firstValue(params.priceRange);
  const guests = firstValue(params.guests);
  const initialFilters: HotelFilters = {
    governorate: isGovernorate(governorate) ? governorate : undefined,
    roomType: isRoomType(roomType) ? roomType : undefined,
    priceRange: isPriceRange(priceRange) ? priceRange : undefined,
    guests: parseGuests(guests),
    amenities: [],
  };

  return (
    <div className="mx-auto max-w-[98rem] px-4 pt-28 pb-20 sm:px-6 sm:pt-32 sm:pb-24 lg:px-8">
      <PageHeader />
      <HotelCatalog
        initialFilters={initialFilters}
        checkIn={firstValue(params.checkIn)}
        checkOut={firstValue(params.checkOut)}
      />
    </div>
  );
}
