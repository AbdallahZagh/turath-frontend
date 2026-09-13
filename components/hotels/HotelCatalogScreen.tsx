import type { ReactNode } from "react";

import { HotelCatalog } from "@/components/hotels/HotelCatalog";
import type { HotelFilters, HotelPriceRange, HotelRoomTypeId } from "@/lib/mock/hotels";
import { GOVERNORATES, type GovernorateSlug } from "@/lib/mock/landing";
import { firstSearchValue, type ListingSearchParams } from "@/lib/search/listingParams";

const ROOM_TYPES: HotelRoomTypeId[] = ["single", "double", "suite"];
const PRICE_RANGES: HotelPriceRange[] = ["under150", "150to300", "over300"];

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

export async function HotelCatalogScreen({
  searchParams,
  detailBasePath = "/hotels",
}: {
  searchParams: ListingSearchParams;
  detailBasePath?: string;
}): Promise<ReactNode> {
  const params = await searchParams;
  const governorate = firstSearchValue(params.governorate);
  const roomType = firstSearchValue(params.roomType);
  const priceRange = firstSearchValue(params.priceRange);
  const initialFilters: HotelFilters = {
    governorate: isGovernorate(governorate) ? governorate : undefined,
    roomType: isRoomType(roomType) ? roomType : undefined,
    priceRange: isPriceRange(priceRange) ? priceRange : undefined,
    guests: parseGuests(firstSearchValue(params.guests)),
    amenities: [],
  };

  return (
    <HotelCatalog
      initialFilters={initialFilters}
      checkIn={firstSearchValue(params.checkIn)}
      checkOut={firstSearchValue(params.checkOut)}
      detailBasePath={detailBasePath}
    />
  );
}
