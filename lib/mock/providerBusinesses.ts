import type { LucideIcon } from "lucide-react";
import { BedDouble, CalendarDays, Languages, MapPinned, Utensils } from "lucide-react";

import type { LocalizedName } from "@/lib/i18n/localized";
import type { ProviderCategory } from "@/lib/validation/auth";
import type { ProviderInventoryCategory } from "@/lib/mock/providerInventory";

export type ProviderBusinessPreview = {
  id: string;
  category: ProviderCategory;
  name: LocalizedName;
  location: LocalizedName;
  icon: LucideIcon;
};

export const PROVIDER_BUSINESSES: readonly ProviderBusinessPreview[] = [
  { id: "dar-al-yasmin", category: "hotels", name: { en: "Dar Al Yasmin", ar: "دار الياسمين" }, location: { en: "Old Damascus", ar: "دمشق القديمة" }, icon: BedDouble },
  { id: "beit-al-zaytoun", category: "dining", name: { en: "Beit Al Zaytoun", ar: "بيت الزيتون" }, location: { en: "Bab Touma, Damascus", ar: "باب توما، دمشق" }, icon: Utensils },
  { id: "sham-trails", category: "trips", name: { en: "Sham Trails", ar: "دروب الشام" }, location: { en: "Damascus", ar: "دمشق" }, icon: MapPinned },
  { id: "diwan-events", category: "events", name: { en: "Diwan Events", ar: "فعاليات الديوان" }, location: { en: "Aleppo", ar: "حلب" }, icon: CalendarDays },
  { id: "layla-al-hakim", category: "guides", name: { en: "Layla Al-Hakim", ar: "ليلى الحكيم" }, location: { en: "Damascus", ar: "دمشق" }, icon: Languages },
] as const;

export const PROVIDER_CATEGORY_TO_INVENTORY: Record<ProviderCategory, ProviderInventoryCategory> = {
  hotels: "hotels",
  dining: "restaurants",
  trips: "trips",
  events: "events",
  guides: "guides",
};

export function getProviderBusiness(category: ProviderCategory): ProviderBusinessPreview {
  return PROVIDER_BUSINESSES.find((business) => business.category === category) ?? PROVIDER_BUSINESSES[0];
}
