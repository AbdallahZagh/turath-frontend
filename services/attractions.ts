import { listAdminAttractions } from "@/services/adminAttractions";
import type { AdminAttraction } from "@/lib/mock/adminAttractions";
import type { GovernorateSlug } from "@/lib/mock/landing";

export type AttractionFilters = {
  governorate?: GovernorateSlug;
  openNow?: boolean;
};

export type TouristAttraction = AdminAttraction;

function minutes(time: string): number {
  const [hours = 0, mins = 0] = time.split(":").map(Number);
  return hours * 60 + mins;
}

export function isAttractionOpenAt(attraction: TouristAttraction, date = new Date()): boolean {
  const opens = minutes(attraction.opensAt);
  const closes = minutes(attraction.closesAt);
  const now = date.getHours() * 60 + date.getMinutes();
  if (opens === 0 && closes >= 1439) return true;
  if (closes >= opens) return now >= opens && now <= closes;
  return now >= opens || now <= closes;
}

export async function listAttractions(filters: AttractionFilters = {}): Promise<TouristAttraction[]> {
  const rows = await listAdminAttractions();
  return rows.filter((attraction) => attraction.published
    && (!filters.governorate || attraction.governorate === filters.governorate)
    && (!filters.openNow || isAttractionOpenAt(attraction)));
}

export async function getAttraction(slug: string): Promise<TouristAttraction | null> {
  const rows = await listAttractions();
  return rows.find((attraction) => attraction.slug === slug) ?? null;
}

export async function getAttractionSlugs(): Promise<string[]> {
  return (await listAttractions()).map((attraction) => attraction.slug);
}
