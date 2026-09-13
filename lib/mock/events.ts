import { addDays } from "date-fns";

import { toIsoDate } from "@/lib/format/datetime";
import type { LocalizedName } from "@/lib/i18n/localized";
import type { GovernorateSlug } from "@/lib/mock/landing";

export type EventCategoryId = "music" | "heritage" | "food" | "craft";
export type EventTierId = "standard" | "vip";
export type EventFeatureId = "indoor" | "outdoor" | "accessible" | "familyFriendly";
export type EventPriceRange = "under100" | "100to250" | "over250";

export type EventTicketTier = {
  id: EventTierId;
  priceSyp: number;
  remaining: number;
  benefits: LocalizedName[];
};

export type EventSession = {
  id: string;
  date: string;
  startsAt: string;
  endsAt: string;
  tiers: EventTicketTier[];
};

export type EventReview = {
  id: string;
  guestName: string;
  rating: number;
  date: string;
  comment: LocalizedName;
};

export type TourismEvent = {
  id: string;
  name: LocalizedName;
  shortDescription: LocalizedName;
  description: LocalizedName;
  providerName: LocalizedName;
  category: EventCategoryId;
  governorate: GovernorateSlug;
  venue: LocalizedName;
  address: LocalizedName;
  coordinates: { latitude: number; longitude: number };
  imageSrc: string;
  gallery: string[];
  rating: number;
  reviewCount: number;
  verified: boolean;
  features: EventFeatureId[];
  sessions: EventSession[];
  highlights: LocalizedName[];
  reviews: EventReview[];
};

export type EventFilters = {
  governorate?: GovernorateSlug;
  date?: string;
  ticketTier?: EventTierId;
  minTickets?: number;
  priceRange?: EventPriceRange;
};

function futureDate(offset: number): string {
  return toIsoDate(addDays(new Date(), offset));
}

const EVENTS: TourismEvent[] = [
  {
    id: "damascus-oud-evening",
    name: { en: "Oud beneath the Courtyard Stars", ar: "عود تحت نجوم الباحة" },
    shortDescription: { en: "An intimate evening of Syrian maqam inside a restored Damascene house.", ar: "أمسية حميمة من المقام السوري داخل بيت دمشقي مرمم." },
    description: { en: "Hear master oud players and a small takht ensemble perform in an open courtyard. The evening includes a short introduction to Syrian maqam and a traditional welcome drink.", ar: "استمع إلى عازفي عود محترفين وتخت شرقي صغير في باحة مفتوحة. تتضمن الأمسية مقدمة قصيرة عن المقام السوري ومشروب ترحيب تقليدياً." },
    providerName: { en: "Damascus Music House", ar: "دار دمشق للموسيقى" },
    category: "music",
    governorate: "damascus",
    venue: { en: "Beit Al-Qamar", ar: "بيت القمر" },
    address: { en: "Al-Qaymariyah, Old Damascus", ar: "القيمرية، دمشق القديمة" },
    coordinates: { latitude: 33.5118, longitude: 36.3092 },
    imageSrc: "/images/landing/pillar-events.png",
    gallery: ["/images/landing/pillar-events.png", "/images/hotels/damascus-courtyard.webp", "/images/landing/hero-damascus.png"],
    rating: 4.9,
    reviewCount: 168,
    verified: true,
    features: ["outdoor", "accessible", "familyFriendly"],
    sessions: [
      { id: "oud-1", date: futureDate(3), startsAt: "19:30", endsAt: "21:30", tiers: [{ id: "standard", priceSyp: 95000, remaining: 18, benefits: [{ en: "Courtyard seating", ar: "مقعد في الباحة" }] }, { id: "vip", priceSyp: 165000, remaining: 6, benefits: [{ en: "Front-row seating", ar: "مقعد في الصف الأمامي" }, { en: "Meet the musicians", ar: "لقاء مع الموسيقيين" }] }] },
      { id: "oud-2", date: futureDate(10), startsAt: "19:30", endsAt: "21:30", tiers: [{ id: "standard", priceSyp: 95000, remaining: 26, benefits: [{ en: "Courtyard seating", ar: "مقعد في الباحة" }] }, { id: "vip", priceSyp: 165000, remaining: 8, benefits: [{ en: "Front-row seating", ar: "مقعد في الصف الأمامي" }, { en: "Meet the musicians", ar: "لقاء مع الموسيقيين" }] }] },
    ],
    highlights: [{ en: "Live oud and qanun ensemble", ar: "فرقة عود وقانون مباشرة" }, { en: "Introduction to Syrian maqam", ar: "مقدمة عن المقام السوري" }, { en: "Traditional courtyard welcome", ar: "استقبال تقليدي في الباحة" }],
    reviews: [{ id: "oud-review", guestName: "Nadia S.", rating: 5, date: "2026-08-21", comment: { en: "Beautiful acoustics and a warm, unhurried evening.", ar: "صوتيات جميلة وأمسية دافئة وهادئة." } }],
  },
  {
    id: "aleppo-flavors-festival",
    name: { en: "Aleppo Flavors Festival", ar: "مهرجان نكهات حلب" },
    shortDescription: { en: "Meet cooks, bakers, and spice makers celebrating Aleppo's table.", ar: "التقِ بالطهاة والخبازين وصناع التوابل في احتفال بمائدة حلب." },
    description: { en: "A lively day of tastings, cooking demonstrations, and family recipes from across Aleppo. Standard tickets include tasting tokens; VIP adds a reserved workshop and hosted lunch.", ar: "يوم حافل بالتذوق وعروض الطهي والوصفات العائلية من أنحاء حلب. تشمل التذاكر العادية قسائم تذوق، وتضيف تذكرة كبار الزوار ورشة محجوزة وغداءً مستضافاً." },
    providerName: { en: "Aleppo Culinary Collective", ar: "تجمع حلب للطهي" },
    category: "food",
    governorate: "aleppo",
    venue: { en: "Al-Jdayde Cultural Courtyard", ar: "باحة الجديدة الثقافية" },
    address: { en: "Al-Jdayde Quarter, Aleppo", ar: "حي الجديدة، حلب" },
    coordinates: { latitude: 36.2052, longitude: 37.1568 },
    imageSrc: "/images/landing/pillar-dining.png",
    gallery: ["/images/landing/pillar-dining.png", "/images/hotels/aleppo-heritage-room.webp", "/images/landing/site-aleppo-citadel.png"],
    rating: 4.8,
    reviewCount: 102,
    verified: true,
    features: ["indoor", "outdoor", "familyFriendly"],
    sessions: [
      { id: "flavors-1", date: futureDate(6), startsAt: "11:00", endsAt: "18:00", tiers: [{ id: "standard", priceSyp: 140000, remaining: 42, benefits: [{ en: "Festival entry and tasting tokens", ar: "دخول المهرجان وقسائم تذوق" }] }, { id: "vip", priceSyp: 285000, remaining: 9, benefits: [{ en: "Reserved cooking workshop", ar: "ورشة طهي محجوزة" }, { en: "Hosted Aleppine lunch", ar: "غداء حلبي مستضاف" }] }] },
    ],
    highlights: [{ en: "Twenty local food makers", ar: "عشرون صانع طعام محلياً" }, { en: "Live cooking demonstrations", ar: "عروض طهي مباشرة" }, { en: "Family tasting trail", ar: "مسار تذوق للعائلات" }],
    reviews: [{ id: "flavors-review", guestName: "Karim H.", rating: 5, date: "2026-07-17", comment: { en: "Generous tastings and wonderful conversations with the cooks.", ar: "تذوق سخي وأحاديث رائعة مع الطهاة." } }],
  },
  {
    id: "bosra-stone-theatre-night",
    name: { en: "Bosra Stone Theatre Night", ar: "ليلة مسرح بصرى الحجري" },
    shortDescription: { en: "Storytelling and orchestral music in Bosra's monumental Roman theatre.", ar: "حكايات وموسيقى أوركسترالية في مسرح بصرى الروماني المهيب." },
    description: { en: "An evening performance shaped around the history of Bosra, combining projected archival imagery, spoken stories, and a Syrian chamber orchestra.", ar: "عرض مسائي يستلهم تاريخ بصرى ويجمع الصور الأرشيفية المسقطة والحكايات المنطوقة وأوركسترا حجرة سورية." },
    providerName: { en: "Bosra Cultural Nights", ar: "ليالي بصرى الثقافية" },
    category: "heritage",
    governorate: "bosra",
    venue: { en: "Bosra Roman Theatre", ar: "مسرح بصرى الروماني" },
    address: { en: "Ancient Bosra, Daraa", ar: "بصرى القديمة، درعا" },
    coordinates: { latitude: 32.5189, longitude: 36.4814 },
    imageSrc: "/images/landing/site-bosra-amphitheatre.png",
    gallery: ["/images/landing/site-bosra-amphitheatre.png", "/images/landing/pillar-events.png", "/images/landing/site-palmyra.png"],
    rating: 4.7,
    reviewCount: 84,
    verified: true,
    features: ["outdoor", "accessible", "familyFriendly"],
    sessions: [
      { id: "bosra-1", date: futureDate(14), startsAt: "18:30", endsAt: "21:00", tiers: [{ id: "standard", priceSyp: 125000, remaining: 64, benefits: [{ en: "General amphitheatre seating", ar: "مقاعد عامة في المسرح" }] }, { id: "vip", priceSyp: 240000, remaining: 12, benefits: [{ en: "Central reserved seating", ar: "مقاعد محجوزة في الوسط" }, { en: "Program booklet", ar: "كتيب البرنامج" }] }] },
      { id: "bosra-2", date: futureDate(15), startsAt: "18:30", endsAt: "21:00", tiers: [{ id: "standard", priceSyp: 125000, remaining: 51, benefits: [{ en: "General amphitheatre seating", ar: "مقاعد عامة في المسرح" }] }, { id: "vip", priceSyp: 240000, remaining: 10, benefits: [{ en: "Central reserved seating", ar: "مقاعد محجوزة في الوسط" }, { en: "Program booklet", ar: "كتيب البرنامج" }] }] },
    ],
    highlights: [{ en: "Syrian chamber orchestra", ar: "أوركسترا حجرة سورية" }, { en: "Projected archive of Bosra", ar: "أرشيف بصري لبصرى" }, { en: "Bilingual story program", ar: "برنامج حكايات ثنائي اللغة" }],
    reviews: [],
  },
  {
    id: "latakia-craft-weekend",
    name: { en: "Coastal Craft Weekend", ar: "عطلة حرف الساحل" },
    shortDescription: { en: "A weekend market of weaving, woodwork, ceramics, and hands-on workshops.", ar: "سوق عطلة للنسيج والخشب والخزف وورش عملية." },
    description: { en: "Discover makers from Syria's coast in a relaxed garden market. Browse contemporary craft, join short workshops, and hear the stories behind regional materials and techniques.", ar: "اكتشف حرفيي الساحل السوري في سوق حديقة هادئ. تصفح الحرف المعاصرة وشارك في ورش قصيرة واستمع إلى حكايات المواد والتقنيات المحلية." },
    providerName: { en: "Coast Makers Forum", ar: "ملتقى حرفيي الساحل" },
    category: "craft",
    governorate: "latakia",
    venue: { en: "Latakia Heritage Garden", ar: "حديقة اللاذقية التراثية" },
    address: { en: "Northern Corniche, Latakia", ar: "الكورنيش الشمالي، اللاذقية" },
    coordinates: { latitude: 35.5391, longitude: 35.7731 },
    imageSrc: "/images/landing/pillar-guides.png",
    gallery: ["/images/landing/pillar-guides.png", "/images/hotels/latakia-sea-terrace.webp", "/images/landing/site-saladin-castle.png"],
    rating: 4.6,
    reviewCount: 57,
    verified: true,
    features: ["outdoor", "accessible", "familyFriendly"],
    sessions: [
      { id: "craft-1", date: futureDate(9), startsAt: "10:00", endsAt: "19:00", tiers: [{ id: "standard", priceSyp: 65000, remaining: 75, benefits: [{ en: "Market entry", ar: "دخول السوق" }] }, { id: "vip", priceSyp: 180000, remaining: 14, benefits: [{ en: "Reserved hands-on workshop", ar: "ورشة عملية محجوزة" }, { en: "Maker gift set", ar: "هدية من الحرفيين" }] }] },
    ],
    highlights: [{ en: "Forty regional makers", ar: "أربعون حرفياً محلياً" }, { en: "Short family workshops", ar: "ورش قصيرة للعائلات" }, { en: "Sunset folk performance", ar: "عرض شعبي عند الغروب" }],
    reviews: [{ id: "craft-review", guestName: "Maya T.", rating: 4, date: "2026-08-02", comment: { en: "A lovely way to meet makers and bring home something meaningful.", ar: "طريقة جميلة للقاء الحرفيين واقتناء قطع تحمل معنى." } }],
  },
];

function lowestPrice(event: TourismEvent): number {
  return Math.min(...event.sessions.flatMap((session) => session.tiers.map((tier) => tier.priceSyp)));
}

function matchesPrice(event: TourismEvent, range: EventPriceRange): boolean {
  const price = lowestPrice(event);
  if (range === "under100") return price < 100000;
  if (range === "100to250") return price >= 100000 && price <= 250000;
  return price > 250000;
}

export function listMockEvents(filters: EventFilters = {}): TourismEvent[] {
  const minTickets = filters.minTickets ?? 1;
  return EVENTS.filter((event) => {
    if (filters.governorate && event.governorate !== filters.governorate) return false;
    if (filters.priceRange && !matchesPrice(event, filters.priceRange)) return false;
    return event.sessions.some((session) => {
      if (filters.date && session.date !== filters.date) return false;
      return session.tiers.some((tier) => tier.remaining >= minTickets && (!filters.ticketTier || tier.id === filters.ticketTier));
    });
  });
}

export function getMockEvent(id: string): TourismEvent | undefined {
  return EVENTS.find((event) => event.id === id);
}

export function getMockEventIds(): string[] {
  return EVENTS.map((event) => event.id);
}
