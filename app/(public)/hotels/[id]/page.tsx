import type { Metadata } from "next";
import type { ReactNode } from "react";

import { HotelDetail } from "@/components/hotels/HotelDetail";
import { detailMetadata } from "@/lib/i18n/detailMetadata";
import { getMockHotelIds } from "@/lib/mock/hotels";
import { getHotel } from "@/services/hotels";

export function generateStaticParams(): Array<{ id: string }> {
  return getMockHotelIds().map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const hotel = await getHotel(id);
  return detailMetadata(hotel && { name: hotel.name, description: hotel.shortDescription });
}

export default async function HotelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<ReactNode> {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-[98rem] px-4 pt-28 pb-20 sm:px-6 sm:pt-32 sm:pb-24 lg:px-8">
      <HotelDetail hotelId={id} />
    </div>
  );
}
