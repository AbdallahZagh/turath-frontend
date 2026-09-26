import type { Metadata } from "next";
import type { ReactNode } from "react";

import { TripDetail } from "@/components/trips/TripDetail";
import { detailMetadata } from "@/lib/i18n/detailMetadata";
import { getMockTripIds } from "@/lib/mock/trips";
import { getTrip } from "@/services/trips";

export function generateStaticParams(): Array<{ id: string }> { return getMockTripIds().map((id) => ({ id })); }
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> { const { id } = await params; const trip = await getTrip(id); return detailMetadata(trip && { name: trip.name, description: trip.shortDescription }); }
export default async function UserTripDetailPage({ params }: { params: Promise<{ id: string }> }): Promise<ReactNode> { const { id } = await params; return <TripDetail tripId={id} basePath="/user/trips" />; }
