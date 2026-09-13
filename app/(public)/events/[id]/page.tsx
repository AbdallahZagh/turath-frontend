import type { Metadata } from "next";
import type { ReactNode } from "react";

import { EventDetail } from "@/components/events/EventDetail";
import { getMockEventIds } from "@/lib/mock/events";
import { getEvent } from "@/services/events";

export function generateStaticParams(): Array<{ id: string }> { return getMockEventIds().map((id) => ({ id })); }
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> { const { id } = await params; const event = await getEvent(id); return event ? { title: `${event.name.en} | Turath`, description: event.shortDescription.en } : { title: "Event | Turath" }; }
export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }): Promise<ReactNode> { const { id } = await params; return <div className="mx-auto max-w-[98rem] px-4 pb-20 pt-28 sm:px-6 sm:pb-24 sm:pt-32 lg:px-8"><EventDetail eventId={id} /></div>; }
