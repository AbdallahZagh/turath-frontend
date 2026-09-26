import type { Metadata } from "next";
import type { ReactNode } from "react";

import { HotelDetail } from "@/components/hotels/HotelDetail";
import { detailMetadata } from "@/lib/i18n/detailMetadata";
import { getMockHotelIds } from "@/lib/mock/hotels";
import { getHotel } from "@/services/hotels";

export function generateStaticParams(): Array<{ id: string }> {
  return getMockHotelIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const hotel = await getHotel(id);
  return detailMetadata(hotel && { name: hotel.name, description: hotel.shortDescription });
}

export default async function UserHotelDetailPage({ params }: { params: Promise<{ id: string }> }): Promise<ReactNode> {
  const { id } = await params;
  return <HotelDetail hotelId={id} basePath="/user/hotels" />;
}
