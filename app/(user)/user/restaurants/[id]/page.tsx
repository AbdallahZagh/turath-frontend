import type { Metadata } from "next";
import type { ReactNode } from "react";

import { RestaurantDetail } from "@/components/restaurants/RestaurantDetail";
import { getMockRestaurantIds } from "@/lib/mock/restaurants";
import { getRestaurant } from "@/services/restaurants";

export function generateStaticParams(): Array<{ id: string }> {
  return getMockRestaurantIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const restaurant = await getRestaurant(id);
  return restaurant ? { title: `${restaurant.name.en} | Turath`, description: restaurant.shortDescription.en } : { title: "Restaurant | Turath" };
}

export default async function UserRestaurantDetailPage({ params }: { params: Promise<{ id: string }> }): Promise<ReactNode> {
  const { id } = await params;
  return <RestaurantDetail restaurantId={id} basePath="/user/restaurants" />;
}
