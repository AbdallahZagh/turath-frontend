import type { LocalizedName } from "@/lib/i18n/localized";
import type { GovernorateSlug } from "@/lib/mock/landing";

export type RestaurantZoneId = "indoor" | "terrace" | "vip" | "smoking";
export type RestaurantAmenityId = "generator" | "wifi" | "ac" | "accessible";
export type RestaurantPriceRange = "under75" | "75to150" | "over150";

export type RestaurantZone = {
  id: RestaurantZoneId;
  capacity: number;
  pricePerGuestSyp: number;
};

export type RestaurantReview = {
  id: string;
  guestName: string;
  rating: number;
  date: string;
  comment: LocalizedName;
};

export type Restaurant = {
  id: string;
  name: LocalizedName;
  shortDescription: LocalizedName;
  description: LocalizedName;
  cuisine: LocalizedName;
  governorate: GovernorateSlug;
  address: LocalizedName;
  coordinates: { latitude: number; longitude: number };
  imageSrc: string;
  gallery: string[];
  rating: number;
  reviewCount: number;
  verified: boolean;
  openingHours: LocalizedName;
  amenities: RestaurantAmenityId[];
  zones: RestaurantZone[];
  timeSlots: string[];
  menuHighlights: LocalizedName[];
  reviews: RestaurantReview[];
};

export type RestaurantFilters = {
  governorate?: GovernorateSlug;
  zone?: RestaurantZoneId;
  partySize?: number;
  priceRange?: RestaurantPriceRange;
  amenities?: RestaurantAmenityId[];
};

const RESTAURANTS: Restaurant[] = [
  {
    id: "beit-sitti",
    name: { en: "Beit Sitti", ar: "بيت ستي" },
    shortDescription: { en: "Damascene family recipes served around a leafy courtyard.", ar: "وصفات دمشقية عائلية تُقدّم حول باحة خضراء." },
    description: { en: "A warm Old Damascus table centered on seasonal mezze, charcoal grills, and recipes passed through generations. Choose the vaulted dining room or the courtyard terrace.", ar: "مائدة دمشقية دافئة في قلب المدينة القديمة، تقدم المازة الموسمية والمشاوي ووصفات متوارثة عبر الأجيال. اختر القاعة المقببة أو شرفة الباحة." },
    cuisine: { en: "Damascene", ar: "مطبخ دمشقي" },
    governorate: "damascus",
    address: { en: "Bab Touma, Old Damascus", ar: "باب توما، دمشق القديمة" },
    coordinates: { latitude: 33.5152, longitude: 36.3164 },
    imageSrc: "/images/landing/pillar-dining.png",
    gallery: ["/images/landing/pillar-dining.png", "/images/hotels/damascus-courtyard.webp", "/images/landing/hero-damascus.png"],
    rating: 4.9,
    reviewCount: 186,
    verified: true,
    openingHours: { en: "Daily, 12:00–23:30", ar: "يومياً، 12:00–23:30" },
    amenities: ["generator", "wifi", "ac", "accessible"],
    zones: [
      { id: "indoor", capacity: 8, pricePerGuestSyp: 85000 },
      { id: "terrace", capacity: 6, pricePerGuestSyp: 95000 },
      { id: "vip", capacity: 10, pricePerGuestSyp: 140000 },
    ],
    timeSlots: ["12:30", "14:30", "18:00", "20:00", "22:00"],
    menuHighlights: [{ en: "Damascene tasting mezze", ar: "مازة دمشقية للتذوق" }, { en: "Cherry kebab", ar: "كباب بالكرز" }, { en: "Pistachio ice cream", ar: "بوظة بالفستق" }],
    reviews: [{ id: "beit-review-1", guestName: "Nour A.", rating: 5, date: "2026-08-22", comment: { en: "The courtyard felt intimate and every dish was explained with care.", ar: "كانت الباحة حميمة وتم شرح كل طبق بعناية." } }],
  },
  {
    id: "khan-al-wazir",
    name: { en: "Khan Al Wazir", ar: "خان الوزير" },
    shortDescription: { en: "Aleppine plates in a restored stone caravanserai.", ar: "أطباق حلبية في خان حجري مرمم." },
    description: { en: "Traditional Aleppine cooking, from rich muhammara to cherry kebab, served beneath stone arches with a calm evening atmosphere.", ar: "مطبخ حلبي تقليدي، من المحمرة الغنية إلى الكباب بالكرز، يُقدّم تحت الأقواس الحجرية في أجواء مسائية هادئة." },
    cuisine: { en: "Aleppine", ar: "مطبخ حلبي" },
    governorate: "aleppo",
    address: { en: "Al-Jdayde Quarter, Aleppo", ar: "حي الجديدة، حلب" },
    coordinates: { latitude: 36.2058, longitude: 37.1571 },
    imageSrc: "/images/hotels/aleppo-heritage-room.webp",
    gallery: ["/images/hotels/aleppo-heritage-room.webp", "/images/landing/pillar-dining.png", "/images/landing/site-aleppo-citadel.png"],
    rating: 4.8,
    reviewCount: 124,
    verified: true,
    openingHours: { en: "Saturday–Thursday, 13:00–23:00", ar: "السبت–الخميس، 13:00–23:00" },
    amenities: ["generator", "wifi", "ac"],
    zones: [{ id: "indoor", capacity: 12, pricePerGuestSyp: 78000 }, { id: "vip", capacity: 8, pricePerGuestSyp: 125000 }, { id: "smoking", capacity: 6, pricePerGuestSyp: 82000 }],
    timeSlots: ["13:00", "15:00", "19:00", "21:00"],
    menuHighlights: [{ en: "Muhammara and kibbeh", ar: "محمرة وكبة" }, { en: "Cherry kebab", ar: "كباب بالكرز" }, { en: "Aleppo-style maamoul", ar: "معمول حلبي" }],
    reviews: [{ id: "khan-review-1", guestName: "Rami K.", rating: 5, date: "2026-07-30", comment: { en: "Excellent Aleppine flavors in a beautiful historic room.", ar: "نكهات حلبية ممتازة في قاعة تاريخية جميلة." } }],
  },
  {
    id: "marsa-terrace",
    name: { en: "Marsa Terrace", ar: "شرفة المرسى" },
    shortDescription: { en: "Fresh coastal plates and sunset tables above the Mediterranean.", ar: "أطباق ساحلية طازجة وطاولات غروب مطلة على المتوسط." },
    description: { en: "A relaxed seafood kitchen pairing the day's catch with Syrian coastal salads and a wide sunset terrace.", ar: "مطبخ بحري هادئ يجمع صيد اليوم مع السلطات الساحلية السورية وشرفة واسعة لمشاهدة الغروب." },
    cuisine: { en: "Syrian coastal", ar: "مطبخ ساحلي سوري" },
    governorate: "latakia",
    address: { en: "Northern Corniche, Latakia", ar: "الكورنيش الشمالي، اللاذقية" },
    coordinates: { latitude: 35.548, longitude: 35.7726 },
    imageSrc: "/images/hotels/latakia-sea-terrace.webp",
    gallery: ["/images/hotels/latakia-sea-terrace.webp", "/images/landing/pillar-dining.png", "/images/landing/site-saladin-castle.png"],
    rating: 4.7,
    reviewCount: 93,
    verified: true,
    openingHours: { en: "Daily, 11:30–00:00", ar: "يومياً، 11:30–00:00" },
    amenities: ["generator", "wifi", "accessible"],
    zones: [{ id: "indoor", capacity: 10, pricePerGuestSyp: 72000 }, { id: "terrace", capacity: 8, pricePerGuestSyp: 90000 }, { id: "smoking", capacity: 6, pricePerGuestSyp: 76000 }],
    timeSlots: ["12:00", "14:00", "18:30", "20:30", "22:30"],
    menuHighlights: [{ en: "Grilled catch of the day", ar: "صيد اليوم المشوي" }, { en: "Coastal fattoush", ar: "فتوش ساحلي" }, { en: "Citrus knafeh", ar: "كنافة بالحمضيات" }],
    reviews: [],
  },
  {
    id: "qasr-al-zaytoun",
    name: { en: "Qasr Al Zaytoun", ar: "قصر الزيتون" },
    shortDescription: { en: "A generous countryside table near Homs' heritage road.", ar: "مائدة ريفية سخية قرب طريق المعالم التراثية في حمص." },
    description: { en: "Family-style Syrian cooking with oven breads, slow-cooked lamb, and produce from nearby farms.", ar: "مطبخ سوري عائلي يقدم خبز التنور والضأن المطهو ببطء ومحاصيل المزارع القريبة." },
    cuisine: { en: "Syrian countryside", ar: "مطبخ ريفي سوري" },
    governorate: "homs",
    address: { en: "Al-Husn Road, Homs countryside", ar: "طريق الحصن، ريف حمص" },
    coordinates: { latitude: 34.7556, longitude: 36.296 },
    imageSrc: "/images/hotels/homs-heritage-inn.webp",
    gallery: ["/images/hotels/homs-heritage-inn.webp", "/images/landing/pillar-dining.png", "/images/landing/site-krak-des-chevaliers.png"],
    rating: 4.6,
    reviewCount: 58,
    verified: true,
    openingHours: { en: "Daily, 10:00–22:30", ar: "يومياً، 10:00–22:30" },
    amenities: ["generator", "accessible"],
    zones: [{ id: "indoor", capacity: 14, pricePerGuestSyp: 58000 }, { id: "terrace", capacity: 12, pricePerGuestSyp: 65000 }],
    timeSlots: ["11:00", "13:00", "17:00", "19:00", "21:00"],
    menuHighlights: [{ en: "Clay-pot lamb", ar: "لحم بالفخار" }, { en: "Fresh tannour bread", ar: "خبز تنور طازج" }, { en: "Olive harvest mezze", ar: "مازة موسم الزيتون" }],
    reviews: [{ id: "qasr-review-1", guestName: "Maya S.", rating: 4, date: "2026-08-03", comment: { en: "Generous portions, welcoming staff, and an easy stop for families.", ar: "حصص سخية وفريق مرحّب ومحطة مريحة للعائلات." } }],
  },
];

function lowestPrice(restaurant: Restaurant): number {
  return Math.min(...restaurant.zones.map((zone) => zone.pricePerGuestSyp));
}

function matchesPrice(restaurant: Restaurant, range: RestaurantPriceRange): boolean {
  const price = lowestPrice(restaurant);
  if (range === "under75") return price < 75000;
  if (range === "75to150") return price >= 75000 && price <= 150000;
  return price > 150000;
}

export function listMockRestaurants(filters: RestaurantFilters = {}): Restaurant[] {
  const amenities = filters.amenities ?? [];
  const partySize = filters.partySize;
  return RESTAURANTS.filter((restaurant) => {
    if (filters.governorate && restaurant.governorate !== filters.governorate) return false;
    if (filters.priceRange && !matchesPrice(restaurant, filters.priceRange)) return false;
    if (filters.zone && !restaurant.zones.some((zone) => zone.id === filters.zone)) return false;
    if (partySize && !restaurant.zones.some((zone) => zone.capacity >= partySize)) return false;
    return amenities.every((amenity) => restaurant.amenities.includes(amenity));
  });
}

export function getMockRestaurant(id: string): Restaurant | undefined {
  return RESTAURANTS.find((restaurant) => restaurant.id === id);
}

export function getMockRestaurantIds(): string[] {
  return RESTAURANTS.map((restaurant) => restaurant.id);
}
