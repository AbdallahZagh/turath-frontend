import type { Metadata } from "next";
import type { ReactNode } from "react";

import { RestaurantDetail } from "@/components/restaurants/RestaurantDetail";
import { detailMetadata } from "@/lib/i18n/detailMetadata";
import { getMockRestaurantIds } from "@/lib/mock/restaurants";
import { getRestaurant } from "@/services/restaurants";

export function generateStaticParams(): Array<{ id: string }> { return getMockRestaurantIds().map((id) => ({ id })); }
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> { const { id } = await params; const item = await getRestaurant(id); return detailMetadata(item && { name: item.name, description: item.shortDescription }); }
export default async function RestaurantDetailPage({ params }: { params: Promise<{ id: string }> }): Promise<ReactNode> { const { id } = await params; return <div className="mx-auto max-w-[98rem] px-4 pb-20 pt-28 sm:px-6 sm:pb-24 sm:pt-32 lg:px-8"><RestaurantDetail restaurantId={id} /></div>; }
