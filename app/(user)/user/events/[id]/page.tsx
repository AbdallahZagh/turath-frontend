import type { Metadata } from "next";
import type { ReactNode } from "react";

import { EventDetail } from "@/components/events/EventDetail";
import { detailMetadata } from "@/lib/i18n/detailMetadata";
import { getMockEventIds } from "@/lib/mock/events";
import { getEvent } from "@/services/events";

export function generateStaticParams(): Array<{ id: string }> { return getMockEventIds().map((id) => ({ id })); }
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> { const { id } = await params; const event = await getEvent(id); return detailMetadata(event && { name: event.name, description: event.shortDescription }); }
export default async function UserEventDetailPage({ params }: { params: Promise<{ id: string }> }): Promise<ReactNode> { const { id } = await params; return <EventDetail eventId={id} basePath="/user/events" />; }
