import { addDays } from "date-fns";

import { toIsoDate } from "@/lib/format/datetime";
import type { LocalizedName } from "@/lib/i18n/localized";
import type { GovernorateSlug } from "@/lib/mock/landing";

export type GuideLanguageId = "arabic" | "english" | "french" | "german";
export type GuideSpecialtyId = "history" | "architecture" | "food" | "photography" | "hiking";
export type GuideDurationId = "hourly" | "halfDay" | "fullDay";
export type GuidePriceRange = "under100" | "100to250" | "over250";

export type TourGuide = {
  id: string;
  name: LocalizedName;
  shortDescription: LocalizedName;
  description: LocalizedName;
  governorate: GovernorateSlug;
  address: LocalizedName;
  coordinates: { latitude: number; longitude: number };
  imageSrc: string;
  gallery: string[];
  rating: number;
  reviewCount: number;
  verified: boolean;
  licenseNumber: string;
  yearsExperience: number;
  languages: GuideLanguageId[];
  specialties: GuideSpecialtyId[];
  rates: Record<GuideDurationId, number>;
  availability: string[];
  reviews: Array<{ id: string; guestName: string; rating: number; date: string; comment: LocalizedName }>;
};

export type GuideFilters = {
  governorate?: GovernorateSlug;
  language?: GuideLanguageId;
  specialty?: GuideSpecialtyId;
  duration?: GuideDurationId;
  priceRange?: GuidePriceRange;
};

const dates = (...offsets: number[]): string[] => offsets.map((offset) => toIsoDate(addDays(new Date(), offset)));

const GUIDES: TourGuide[] = [
  {
    id: "layla-al-hakim",
    name: { en: "Layla Al-Hakim", ar: "ليلى الحكيم" },
    shortDescription: { en: "Damascene historian bringing courtyard houses and old-city stories to life.", ar: "مؤرخة دمشقية تحيي حكايات البيوت العربية والمدينة القديمة." },
    description: { en: "Layla leads thoughtful private walks through Old Damascus, connecting architecture, family histories, and living traditions without rushing the experience.", ar: "تقود ليلى جولات خاصة ومتأنية في دمشق القديمة، وتربط بين العمارة وتاريخ العائلات والتقاليد الحية." },
    governorate: "damascus",
    address: { en: "Bab Touma, Old Damascus", ar: "باب توما، دمشق القديمة" },
    coordinates: { latitude: 33.5152, longitude: 36.3141 },
    imageSrc: "/images/landing/pillar-guides.png",
    gallery: ["/images/landing/pillar-guides.png", "/images/hotels/damascus-courtyard.webp", "/images/landing/hero-damascus.png"],
    rating: 4.9, reviewCount: 184, verified: true, licenseNumber: "DG-1048", yearsExperience: 11,
    languages: ["arabic", "english", "french"], specialties: ["history", "architecture", "photography"],
    rates: { hourly: 85000, halfDay: 260000, fullDay: 460000 }, availability: dates(2, 4, 7, 9, 13),
    reviews: [{ id: "layla-1", guestName: "Mariam K.", rating: 5, date: "2026-08-28", comment: { en: "Warm, precise, and full of stories we would never have found alone.", ar: "دافئة ودقيقة ومليئة بحكايات ما كنا لنكتشفها وحدنا." } }],
  },
  {
    id: "omar-kattan",
    name: { en: "Omar Kattan", ar: "عمر قطان" },
    shortDescription: { en: "Aleppine food and heritage guide focused on markets, kitchens, and craft quarters.", ar: "دليل حلبي متخصص في الطعام والتراث والأسواق والمطابخ والأحياء الحرفية." },
    description: { en: "Omar combines neighborhood history with generous tastings and conversations with local makers across Aleppo's old quarters.", ar: "يجمع عمر بين تاريخ الأحياء والتذوق ولقاء الحرفيين المحليين في أحياء حلب القديمة." },
    governorate: "aleppo", address: { en: "Al-Jdayde Quarter, Aleppo", ar: "حي الجديدة، حلب" },
    coordinates: { latitude: 36.2037, longitude: 37.1576 }, imageSrc: "/images/landing/pillar-dining.png",
    gallery: ["/images/landing/pillar-dining.png", "/images/landing/site-aleppo-citadel.png", "/images/hotels/aleppo-heritage-room.webp"],
    rating: 4.8, reviewCount: 126, verified: true, licenseNumber: "AG-2216", yearsExperience: 8,
    languages: ["arabic", "english"], specialties: ["food", "history", "architecture"],
    rates: { hourly: 70000, halfDay: 220000, fullDay: 390000 }, availability: dates(1, 5, 8, 10, 15), reviews: [],
  },
  {
    id: "rana-masri",
    name: { en: "Rana Masri", ar: "رنا المصري" },
    shortDescription: { en: "Coastal guide for castle trails, village walks, and landscape photography.", ar: "دليلة ساحلية لمسارات القلاع وجولات القرى وتصوير الطبيعة." },
    description: { en: "Rana plans flexible coastal days around walking ability, light, and weather, with a special focus on Saladin Castle and mountain villages.", ar: "تخطط رنا أياماً ساحلية مرنة بحسب القدرة على المشي والضوء والطقس، مع تركيز على قلعة صلاح الدين والقرى الجبلية." },
    governorate: "latakia", address: { en: "Latakia city and northern coast", ar: "مدينة اللاذقية والساحل الشمالي" },
    coordinates: { latitude: 35.5317, longitude: 35.7901 }, imageSrc: "/images/landing/site-saladin-castle.png",
    gallery: ["/images/landing/site-saladin-castle.png", "/images/hotels/latakia-sea-terrace.webp", "/images/landing/pillar-guides.png"],
    rating: 4.7, reviewCount: 91, verified: true, licenseNumber: "LG-0874", yearsExperience: 7,
    languages: ["arabic", "english", "german"], specialties: ["hiking", "photography", "history"],
    rates: { hourly: 75000, halfDay: 235000, fullDay: 410000 }, availability: dates(3, 6, 7, 12, 16), reviews: [],
  },
  {
    id: "sami-al-khoury",
    name: { en: "Sami Al-Khoury", ar: "سامي الخوري" },
    shortDescription: { en: "Archaeology-led visits to Bosra with accessible pacing for families and groups.", ar: "زيارات أثرية إلى بصرى بوتيرة مناسبة للعائلات والمجموعات." },
    description: { en: "Sami turns Bosra's layers into a clear, memorable route from the Roman theatre to the old streets and basalt homes.", ar: "يحوّل سامي طبقات بصرى التاريخية إلى مسار واضح من المسرح الروماني إلى الشوارع القديمة والبيوت البازلتية." },
    governorate: "bosra", address: { en: "Ancient Bosra, Daraa", ar: "بصرى القديمة، درعا" },
    coordinates: { latitude: 32.5191, longitude: 36.4813 }, imageSrc: "/images/landing/site-bosra-amphitheatre.png",
    gallery: ["/images/landing/site-bosra-amphitheatre.png", "/images/landing/pillar-guides.png", "/images/landing/site-palmyra.png"],
    rating: 4.8, reviewCount: 108, verified: true, licenseNumber: "BG-0319", yearsExperience: 13,
    languages: ["arabic", "english", "french"], specialties: ["history", "architecture"],
    rates: { hourly: 65000, halfDay: 205000, fullDay: 360000 }, availability: dates(2, 6, 11, 14, 18), reviews: [],
  },
];

function matchesPrice(guide: TourGuide, duration: GuideDurationId, range: GuidePriceRange): boolean {
  const price = guide.rates[duration];
  if (range === "under100") return price < 100000;
  if (range === "100to250") return price <= 250000;
  return price > 250000;
}

export function listMockGuides(filters: GuideFilters = {}): TourGuide[] {
  const duration = filters.duration ?? "hourly";
  return GUIDES.filter((guide) =>
    (!filters.governorate || guide.governorate === filters.governorate)
    && (!filters.language || guide.languages.includes(filters.language))
    && (!filters.specialty || guide.specialties.includes(filters.specialty))
    && (!filters.priceRange || matchesPrice(guide, duration, filters.priceRange)));
}

export function getMockGuide(id: string): TourGuide | undefined { return GUIDES.find((guide) => guide.id === id); }
export function getMockGuideIds(): string[] { return GUIDES.map((guide) => guide.id); }
