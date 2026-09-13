import type { LocalizedName } from "@/lib/i18n/localized";
import type { GovernorateSlug } from "@/lib/mock/landing";

export type HotelAmenityId =
  | "generator"
  | "wifi"
  | "ac"
  | "breakfast"
  | "airportTransfer"
  | "accessible"
  | "parking"
  | "terrace";

export type HotelRoomTypeId = "single" | "double" | "suite";
export type HotelPriceRange = "under150" | "150to300" | "over300";

export type HotelRoom = {
  id: string;
  type: HotelRoomTypeId;
  maxGuests: number;
  priceSyp: number;
  available: number;
};

export type HotelReview = {
  id: string;
  guestName: string;
  rating: number;
  date: string;
  comment: LocalizedName;
};

export type Hotel = {
  id: string;
  name: LocalizedName;
  description: LocalizedName;
  shortDescription: LocalizedName;
  governorate: GovernorateSlug;
  address: LocalizedName;
  coordinates: { latitude: number; longitude: number };
  imageSrc: string;
  gallery: string[];
  rating: number;
  reviewCount: number;
  verified: boolean;
  amenities: HotelAmenityId[];
  rooms: HotelRoom[];
  checkInTime: string;
  checkOutTime: string;
  generatorHours: LocalizedName;
  reviews: HotelReview[];
};

export type HotelFilters = {
  governorate?: GovernorateSlug;
  roomType?: HotelRoomTypeId;
  guests?: number;
  priceRange?: HotelPriceRange;
  amenities?: HotelAmenityId[];
};

const HOTELS: Hotel[] = [
  {
    id: "dar-al-yasmin",
    name: { en: "Dar Al Yasmin", ar: "دار الياسمين" },
    shortDescription: {
      en: "A quiet courtyard stay shaped by Damascene craft and hospitality.",
      ar: "إقامة هادئة في باحة دمشقية تجمع الحرفة العريقة وكرم الضيافة.",
    },
    description: {
      en: "Set inside a carefully restored Old Damascus house, Dar Al Yasmin brings together carved wood, stone arcades, citrus trees, and calm rooms around a traditional courtyard. The old city's souks and landmarks are within an easy walk.",
      ar: "يقع دار الياسمين في بيت دمشقي قديم جرى ترميمه بعناية، ويجمع بين الخشب المحفور والأقواس الحجرية وأشجار الحمضيات والغرف الهادئة حول باحة تقليدية. أسواق المدينة القديمة ومعالمها على مسافة قريبة سيراً.",
    },
    governorate: "damascus",
    address: { en: "Bab Touma, Old Damascus", ar: "باب توما، دمشق القديمة" },
    coordinates: { latitude: 33.5157, longitude: 36.3159 },
    imageSrc: "/images/hotels/damascus-courtyard.webp",
    gallery: [
      "/images/hotels/damascus-courtyard.webp",
      "/images/hotels/aleppo-heritage-room.webp",
      "/images/landing/site-umayyad-mosque.png",
    ],
    rating: 4.9,
    reviewCount: 128,
    verified: true,
    amenities: ["generator", "wifi", "ac", "breakfast", "airportTransfer", "terrace"],
    rooms: [
      { id: "yasmin-double", type: "double", maxGuests: 2, priceSyp: 240000, available: 4 },
      { id: "yasmin-suite", type: "suite", maxGuests: 3, priceSyp: 390000, available: 2 },
    ],
    checkInTime: "14:00",
    checkOutTime: "11:00",
    generatorHours: { en: "Available during all outage hours", ar: "متاح طوال ساعات انقطاع الكهرباء" },
    reviews: [
      {
        id: "review-yasmin-1",
        guestName: "Lina M.",
        rating: 5,
        date: "2026-08-18",
        comment: {
          en: "A peaceful courtyard and a genuinely warm welcome. We could walk everywhere in the old city.",
          ar: "باحة هادئة واستقبال دافئ فعلاً. تمكّنا من الوصول سيراً إلى كل مكان في المدينة القديمة.",
        },
      },
      {
        id: "review-yasmin-2",
        guestName: "Omar K.",
        rating: 5,
        date: "2026-07-29",
        comment: {
          en: "The room was comfortable, spotless, and full of beautiful local details.",
          ar: "كانت الغرفة مريحة ونظيفة جداً ومليئة بتفاصيل محلية جميلة.",
        },
      },
    ],
  },
  {
    id: "citadel-stone-house",
    name: { en: "Citadel Stone House", ar: "بيت القلعة الحجري" },
    shortDescription: {
      en: "Restored Aleppine rooms with warm stone, carved wood, and old-city views.",
      ar: "غرف حلبية مرممة بحجر دافئ وخشب محفور وإطلالات على المدينة القديمة.",
    },
    description: {
      en: "Citadel Stone House is an intimate heritage stay near Aleppo's historic core. Its arched rooms pair traditional textiles and local stone with the practical comforts needed for an unhurried city visit.",
      ar: "بيت القلعة الحجري إقامة تراثية حميمة قرب قلب حلب التاريخي. تجمع غرفه المقنطرة بين المنسوجات التقليدية والحجر المحلي ووسائل الراحة اللازمة لزيارة هادئة للمدينة.",
    },
    governorate: "aleppo",
    address: { en: "Al-Jdayde Quarter, Aleppo", ar: "حي الجديدة، حلب" },
    coordinates: { latitude: 36.2063, longitude: 37.1574 },
    imageSrc: "/images/hotels/aleppo-heritage-room.webp",
    gallery: [
      "/images/hotels/aleppo-heritage-room.webp",
      "/images/hotels/damascus-courtyard.webp",
      "/images/landing/site-aleppo-citadel.png",
    ],
    rating: 4.7,
    reviewCount: 84,
    verified: true,
    amenities: ["generator", "wifi", "ac", "breakfast", "accessible"],
    rooms: [
      { id: "citadel-single", type: "single", maxGuests: 1, priceSyp: 135000, available: 3 },
      { id: "citadel-double", type: "double", maxGuests: 2, priceSyp: 210000, available: 5 },
    ],
    checkInTime: "15:00",
    checkOutTime: "11:00",
    generatorHours: { en: "06:00–10:00 and 17:00–00:00", ar: "06:00–10:00 و17:00–00:00" },
    reviews: [
      {
        id: "review-citadel-1",
        guestName: "Sara H.",
        rating: 5,
        date: "2026-08-05",
        comment: {
          en: "Thoughtful service and a lovely room close to the old quarter.",
          ar: "خدمة تهتم بالتفاصيل وغرفة جميلة قريبة من الحي القديم.",
        },
      },
    ],
  },
  {
    id: "blue-coast-terrace",
    name: { en: "Blue Coast Terrace", ar: "شرفة الساحل الأزرق" },
    shortDescription: {
      en: "A relaxed Mediterranean stay with shaded terraces and sea views.",
      ar: "إقامة متوسطية هادئة مع شرفات مظللة وإطلالات بحرية.",
    },
    description: {
      en: "Blue Coast Terrace is a small coastal hotel designed around the sea view. Stone arches, shaded outdoor seating, and straightforward rooms make it a comfortable base for exploring Latakia and the nearby coast.",
      ar: "شرفة الساحل الأزرق فندق ساحلي صغير صُمم حول الإطلالة البحرية. تجعل الأقواس الحجرية والجلسات الخارجية المظللة والغرف العملية منه قاعدة مريحة لاستكشاف اللاذقية والساحل القريب.",
    },
    governorate: "latakia",
    address: { en: "Northern Corniche, Latakia", ar: "الكورنيش الشمالي، اللاذقية" },
    coordinates: { latitude: 35.5484, longitude: 35.7731 },
    imageSrc: "/images/hotels/latakia-sea-terrace.webp",
    gallery: [
      "/images/hotels/latakia-sea-terrace.webp",
      "/images/hotels/aleppo-heritage-room.webp",
      "/images/landing/site-saladin-castle.png",
    ],
    rating: 4.6,
    reviewCount: 61,
    verified: true,
    amenities: ["generator", "wifi", "ac", "breakfast", "parking", "terrace"],
    rooms: [
      { id: "coast-double", type: "double", maxGuests: 2, priceSyp: 195000, available: 6 },
      { id: "coast-suite", type: "suite", maxGuests: 4, priceSyp: 330000, available: 2 },
    ],
    checkInTime: "14:00",
    checkOutTime: "12:00",
    generatorHours: { en: "Available during all outage hours", ar: "متاح طوال ساعات انقطاع الكهرباء" },
    reviews: [
      {
        id: "review-coast-1",
        guestName: "James D.",
        rating: 4,
        date: "2026-07-17",
        comment: {
          en: "The terrace at sunset was the highlight, and the room was simple and comfortable.",
          ar: "كانت الشرفة وقت الغروب أجمل ما في الإقامة، والغرفة بسيطة ومريحة.",
        },
      },
    ],
  },
  {
    id: "dar-al-zaytoun",
    name: { en: "Dar Al Zaytoun", ar: "دار الزيتون" },
    shortDescription: {
      en: "A stone-built countryside inn with a lantern-lit olive courtyard.",
      ar: "نُزل ريفي حجري مع باحة زيتون مضاءة بالفوانيس.",
    },
    description: {
      en: "Built from dark basalt and pale limestone, Dar Al Zaytoun offers a restful stop in the Homs countryside. The intimate courtyard, local breakfast, and practical family rooms suit travelers heading toward the region's heritage landmarks.",
      ar: "بُني دار الزيتون من البازلت الداكن والحجر الكلسي الفاتح، ويوفر محطة مريحة في ريف حمص. تناسب باحته الحميمة وفطوره المحلي وغرفه العائلية المسافرين المتجهين إلى معالم المنطقة التراثية.",
    },
    governorate: "homs",
    address: { en: "Al-Husn Road, Homs countryside", ar: "طريق الحصن، ريف حمص" },
    coordinates: { latitude: 34.756, longitude: 36.2964 },
    imageSrc: "/images/hotels/homs-heritage-inn.webp",
    gallery: [
      "/images/hotels/homs-heritage-inn.webp",
      "/images/hotels/damascus-courtyard.webp",
      "/images/landing/site-krak-des-chevaliers.png",
    ],
    rating: 4.8,
    reviewCount: 47,
    verified: true,
    amenities: ["generator", "wifi", "breakfast", "parking", "accessible"],
    rooms: [
      { id: "zaytoun-double", type: "double", maxGuests: 2, priceSyp: 145000, available: 4 },
      { id: "zaytoun-suite", type: "suite", maxGuests: 5, priceSyp: 275000, available: 2 },
    ],
    checkInTime: "14:00",
    checkOutTime: "11:00",
    generatorHours: { en: "17:00–01:00", ar: "17:00–01:00" },
    reviews: [],
  },
];

function matchesPrice(hotel: Hotel, priceRange: HotelPriceRange): boolean {
  const lowestPrice = Math.min(...hotel.rooms.map((room) => room.priceSyp));
  if (priceRange === "under150") return lowestPrice < 150000;
  if (priceRange === "150to300") return lowestPrice >= 150000 && lowestPrice <= 300000;
  return lowestPrice > 300000;
}

export function listMockHotels(filters: HotelFilters = {}): Hotel[] {
  const amenities = filters.amenities ?? [];
  const guests = filters.guests;
  return HOTELS.filter((hotel) => {
    if (filters.governorate && hotel.governorate !== filters.governorate) return false;
    if (filters.priceRange && !matchesPrice(hotel, filters.priceRange)) return false;
    if (filters.roomType && !hotel.rooms.some((room) => room.type === filters.roomType)) return false;
    if (guests && !hotel.rooms.some((room) => room.maxGuests >= guests)) return false;
    return amenities.every((amenity) => hotel.amenities.includes(amenity));
  });
}

export function getMockHotel(id: string): Hotel | undefined {
  return HOTELS.find((hotel) => hotel.id === id);
}

export function getMockHotelIds(): string[] {
  return HOTELS.map((hotel) => hotel.id);
}
