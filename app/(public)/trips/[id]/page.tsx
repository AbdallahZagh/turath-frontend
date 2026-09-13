import type { Metadata } from "next";
import type { ReactNode } from "react";

import { TripDetail } from "@/components/trips/TripDetail";
import { getMockTripIds } from "@/lib/mock/trips";
import { getTrip } from "@/services/trips";

export function generateStaticParams(): Array<{ id: string }> { return getMockTripIds().map((id) => ({ id })); }
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> { const { id } = await params; const trip = await getTrip(id); return trip ? { title: `${trip.name.en} | Turath`, description: trip.shortDescription.en } : { title: "Trip | Turath" }; }
export default async function TripDetailPage({ params }: { params: Promise<{ id: string }> }): Promise<ReactNode> { const { id } = await params; return <div className="mx-auto max-w-[98rem] px-4 pb-20 pt-28 sm:px-6 sm:pb-24 sm:pt-32 lg:px-8"><TripDetail tripId={id} /></div>; }
