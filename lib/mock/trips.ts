import { addDays } from "date-fns";

import { toIsoDate } from "@/lib/format/datetime";
import type { LocalizedName } from "@/lib/i18n/localized";
import type { GovernorateSlug } from "@/lib/mock/landing";

export type TripDurationId = "halfDay" | "fullDay" | "multiDay";
export type TripGearId = "water" | "snacks" | "walkingPoles" | "firstAid" | "transport";
export type TripPriceRange = "under200" | "200to400" | "over400";

export type TripDeparture = {
  date: string;
  seatsLeft: number;
};

export type TripPickupPoint = {
  id: string;
  name: LocalizedName;
  time: string;
};

export type TripItineraryItem = {
  id: string;
  time: string;
  title: LocalizedName;
  description: LocalizedName;
};

export type TripReview = {
  id: string;
  guestName: string;
  rating: number;
  date: string;
  comment: LocalizedName;
};

export type Trip = {
  id: string;
  name: LocalizedName;
  shortDescription: LocalizedName;
  description: LocalizedName;
  providerName: LocalizedName;
  governorate: GovernorateSlug;
  address: LocalizedName;
  coordinates: { latitude: number; longitude: number };
  imageSrc: string;
  gallery: string[];
  rating: number;
  reviewCount: number;
  verified: boolean;
  duration: TripDurationId;
  durationDetail: LocalizedName;
  capacity: number;
  pricePerSeatSyp: number;
  departures: TripDeparture[];
  pickupPoints: TripPickupPoint[];
  gear: TripGearId[];
  itinerary: TripItineraryItem[];
  reviews: TripReview[];
};

export type TripFilters = {
  governorate?: GovernorateSlug;
  date?: string;
  minSeats?: number;
  duration?: TripDurationId;
  priceRange?: TripPriceRange;
};

function futureDate(offset: number): string {
  return toIsoDate(addDays(new Date(), offset));
}

const TRIPS: Trip[] = [
  {
    id: "damascus-hidden-courtyards",
    name: { en: "Hidden Courtyards of Damascus", ar: "باحات دمشق الخفية" },
    shortDescription: { en: "Walk through quiet lanes, private courtyards, and living craft workshops.", ar: "جولة بين الأزقة الهادئة والباحات الخاصة وورش الحرف التقليدية." },
    description: { en: "A small-group walk through the layers of Old Damascus, led by a local storyteller. Meet craftspeople, pause for Damascene coffee, and enter restored homes normally missed on a quick visit.", ar: "جولة ضمن مجموعة صغيرة عبر طبقات دمشق القديمة برفقة راوٍ محلي. قابل الحرفيين، واسترح لتناول القهوة الدمشقية، وادخل بيوتاً مرممة لا يراها الزائر عادةً في الجولات السريعة." },
    providerName: { en: "Damascus Story Walks", ar: "حكايات دمشق للمشي" },
    governorate: "damascus",
    address: { en: "Bab Touma Gate, Old Damascus", ar: "باب توما، دمشق القديمة" },
    coordinates: { latitude: 33.5149, longitude: 36.3157 },
    imageSrc: "/images/landing/hero-damascus.png",
    gallery: ["/images/landing/hero-damascus.png", "/images/hotels/damascus-courtyard.webp", "/images/landing/site-umayyad-mosque.png"],
    rating: 4.9,
    reviewCount: 214,
    verified: true,
    duration: "halfDay",
    durationDetail: { en: "4 hours", ar: "4 ساعات" },
    capacity: 10,
    pricePerSeatSyp: 165000,
    departures: [{ date: futureDate(3), seatsLeft: 4 }, { date: futureDate(7), seatsLeft: 8 }, { date: futureDate(12), seatsLeft: 2 }],
    pickupPoints: [{ id: "bab-touma", name: { en: "Bab Touma Gate", ar: "باب توما" }, time: "09:00" }, { id: "marjeh", name: { en: "Marjeh Square", ar: "ساحة المرجة" }, time: "08:30" }],
    gear: ["water", "snacks", "firstAid"],
    itinerary: [
      { id: "meet", time: "09:00", title: { en: "Meet at Bab Touma", ar: "اللقاء عند باب توما" }, description: { en: "Welcome, route briefing, and a first look at the old city walls.", ar: "ترحيب وشرح للمسار وإطلالة أولى على سور المدينة القديمة." } },
      { id: "craft", time: "10:00", title: { en: "Craft lanes and workshops", ar: "أسواق الحرف والورش" }, description: { en: "Visit wood, mosaic, and textile workshops with time to meet the makers.", ar: "زيارة ورش الخشب والفسيفساء والنسيج مع وقت للقاء الحرفيين." } },
      { id: "courtyard", time: "11:30", title: { en: "Courtyard coffee", ar: "قهوة في باحة دمشقية" }, description: { en: "Enter a restored Damascene home for coffee and stories.", ar: "دخول بيت دمشقي مرمم لتناول القهوة وسماع الحكايات." } },
    ],
    reviews: [{ id: "damascus-trip-review", guestName: "Leila M.", rating: 5, date: "2026-08-18", comment: { en: "The kind of places we would never have found alone, with a thoughtful local guide.", ar: "أماكن لم نكن لنجدها وحدنا، مع دليل محلي رائع ومهتم." } }],
  },
  {
    id: "krak-valley-day",
    name: { en: "Krak and the Orontes Valley", ar: "قلعة الحصن ووادي العاصي" },
    shortDescription: { en: "A full-day journey through Crusader stonework and green valley villages.", ar: "رحلة ليوم كامل بين عمارة القلعة الحجرية وقرى الوادي الخضراء." },
    description: { en: "Travel from Homs to Krak des Chevaliers with a heritage specialist, then continue to a village lunch and panoramic valley walk. Transport and entry coordination are included.", ar: "انطلق من حمص إلى قلعة الحصن برفقة مختص بالتراث، ثم تابع إلى غداء قروي ومشي بإطلالات على الوادي. يشمل البرنامج النقل وتنسيق الدخول." },
    providerName: { en: "Homs Heritage Trails", ar: "مسارات تراث حمص" },
    governorate: "homs",
    address: { en: "Al-Hamidiyah Clock, Homs", ar: "ساعة الحميدية، حمص" },
    coordinates: { latitude: 34.7569, longitude: 36.2957 },
    imageSrc: "/images/landing/site-krak-des-chevaliers.png",
    gallery: ["/images/landing/site-krak-des-chevaliers.png", "/images/hotels/homs-heritage-inn.webp", "/images/landing/pillar-trips.png"],
    rating: 4.8,
    reviewCount: 137,
    verified: true,
    duration: "fullDay",
    durationDetail: { en: "9 hours", ar: "9 ساعات" },
    capacity: 14,
    pricePerSeatSyp: 310000,
    departures: [{ date: futureDate(5), seatsLeft: 6 }, { date: futureDate(10), seatsLeft: 11 }, { date: futureDate(18), seatsLeft: 5 }],
    pickupPoints: [{ id: "hamidiyah", name: { en: "Al-Hamidiyah Clock", ar: "ساعة الحميدية" }, time: "07:30" }, { id: "homs-station", name: { en: "Homs central station", ar: "محطة حمص المركزية" }, time: "07:45" }],
    gear: ["water", "snacks", "firstAid", "transport"],
    itinerary: [
      { id: "drive", time: "07:30", title: { en: "Leave central Homs", ar: "الانطلاق من وسط حمص" }, description: { en: "Comfortable group transfer with a route introduction.", ar: "نقل جماعي مريح مع مقدمة عن مسار الرحلة." } },
      { id: "krak", time: "09:00", title: { en: "Krak des Chevaliers", ar: "قلعة الحصن" }, description: { en: "Guided exploration of the halls, towers, and defensive passages.", ar: "جولة إرشادية في القاعات والأبراج والممرات الدفاعية." } },
      { id: "village", time: "13:00", title: { en: "Village lunch and valley walk", ar: "غداء قروي ومشي في الوادي" }, description: { en: "Seasonal Syrian lunch followed by an easy panoramic walk.", ar: "غداء سوري موسمي يتبعه مسار مشي سهل بإطلالات واسعة." } },
    ],
    reviews: [{ id: "krak-trip-review", guestName: "Omar K.", rating: 5, date: "2026-07-29", comment: { en: "Excellent pacing, clear history, and a beautiful family lunch in the valley.", ar: "تنظيم ممتاز وشرح تاريخي واضح وغداء عائلي جميل في الوادي." } }],
  },
  {
    id: "aleppo-citadel-kitchens",
    name: { en: "Aleppo Citadel and Kitchens", ar: "قلعة حلب ومطابخها" },
    shortDescription: { en: "Pair Aleppo's monumental history with its celebrated food traditions.", ar: "رحلة تجمع تاريخ حلب العريق مع تقاليدها الشهيرة في الطعام." },
    description: { en: "Explore the citadel and surrounding souqs before joining a hands-on Aleppine lunch workshop. Designed for curious travelers who want history with generous local flavor.", ar: "استكشف القلعة والأسواق المحيطة بها قبل الانضمام إلى ورشة غداء حلبي عملية. رحلة لمحبي التاريخ والنكهات المحلية الأصيلة." },
    providerName: { en: "Aleppo Table Tours", ar: "جولات مائدة حلب" },
    governorate: "aleppo",
    address: { en: "Citadel Square, Aleppo", ar: "ساحة القلعة، حلب" },
    coordinates: { latitude: 36.1996, longitude: 37.1629 },
    imageSrc: "/images/landing/site-aleppo-citadel.png",
    gallery: ["/images/landing/site-aleppo-citadel.png", "/images/hotels/aleppo-heritage-room.webp", "/images/landing/pillar-dining.png"],
    rating: 4.8,
    reviewCount: 96,
    verified: true,
    duration: "fullDay",
    durationDetail: { en: "7 hours", ar: "7 ساعات" },
    capacity: 8,
    pricePerSeatSyp: 275000,
    departures: [{ date: futureDate(4), seatsLeft: 3 }, { date: futureDate(9), seatsLeft: 5 }, { date: futureDate(15), seatsLeft: 7 }],
    pickupPoints: [{ id: "citadel-square", name: { en: "Citadel Square", ar: "ساحة القلعة" }, time: "09:30" }, { id: "aziziyah", name: { en: "Al-Aziziyah Square", ar: "ساحة العزيزية" }, time: "09:00" }],
    gear: ["water", "snacks", "firstAid"],
    itinerary: [
      { id: "citadel", time: "09:30", title: { en: "Citadel stories", ar: "حكايات القلعة" }, description: { en: "Walk through the fortified entrance and key restored spaces.", ar: "جولة عبر المدخل المحصن وأهم المساحات المرممة." } },
      { id: "souq", time: "11:30", title: { en: "Old souq tasting", ar: "تذوق في السوق القديم" }, description: { en: "Meet spice and sweet makers while crossing the historic market lanes.", ar: "لقاء صناع التوابل والحلويات بين ممرات السوق التاريخية." } },
      { id: "kitchen", time: "13:30", title: { en: "Aleppine kitchen workshop", ar: "ورشة مطبخ حلبي" }, description: { en: "Prepare and share a generous lunch with a local cook.", ar: "حضّر وتناول غداءً سخياً مع طاهٍ محلي." } },
    ],
    reviews: [],
  },
  {
    id: "coastal-castles-escape",
    name: { en: "Coastal Castles Escape", ar: "رحلة قلاع الساحل" },
    shortDescription: { en: "Two days of mountain castles, forest paths, and Mediterranean sunsets.", ar: "يومان بين قلاع الجبال ومسارات الغابات وغروب البحر المتوسط." },
    description: { en: "An overnight small-group route linking Saladin Castle with forest viewpoints and the Latakia coast. Includes transport, a local guesthouse, breakfast, and guided walks.", ar: "مسار ليلي ضمن مجموعة صغيرة يربط قلعة صلاح الدين بإطلالات الغابات وساحل اللاذقية. يشمل النقل وبيت ضيافة محلياً والفطور وجولات المشي." },
    providerName: { en: "Syrian Coast Outdoors", ar: "مغامرات الساحل السوري" },
    governorate: "latakia",
    address: { en: "Al-Azhari Square, Latakia", ar: "ساحة الأزهري، اللاذقية" },
    coordinates: { latitude: 35.5236, longitude: 35.7901 },
    imageSrc: "/images/landing/site-saladin-castle.png",
    gallery: ["/images/landing/site-saladin-castle.png", "/images/hotels/latakia-sea-terrace.webp", "/images/landing/pillar-trips.png"],
    rating: 4.7,
    reviewCount: 71,
    verified: true,
    duration: "multiDay",
    durationDetail: { en: "2 days / 1 night", ar: "يومان / ليلة واحدة" },
    capacity: 12,
    pricePerSeatSyp: 590000,
    departures: [{ date: futureDate(8), seatsLeft: 7 }, { date: futureDate(21), seatsLeft: 10 }, { date: futureDate(32), seatsLeft: 4 }],
    pickupPoints: [{ id: "azhari", name: { en: "Al-Azhari Square", ar: "ساحة الأزهري" }, time: "07:00" }, { id: "latakia-station", name: { en: "Latakia central station", ar: "محطة اللاذقية المركزية" }, time: "07:20" }],
    gear: ["water", "walkingPoles", "firstAid", "transport"],
    itinerary: [
      { id: "castle", time: "Day 1", title: { en: "Saladin Castle", ar: "قلعة صلاح الدين" }, description: { en: "Guided castle visit followed by a forest picnic and sunset viewpoint.", ar: "زيارة إرشادية للقلعة ثم نزهة غداء في الغابة وإطلالة الغروب." } },
      { id: "guesthouse", time: "Evening", title: { en: "Village guesthouse", ar: "بيت ضيافة قروي" }, description: { en: "Traditional dinner and an overnight stay in the hills.", ar: "عشاء تقليدي وإقامة ليلية بين التلال." } },
      { id: "coast", time: "Day 2", title: { en: "Forest trail to the coast", ar: "مسار الغابة نحو الساحل" }, description: { en: "A moderate morning walk before lunch beside the Mediterranean.", ar: "مشي صباحي متوسط الصعوبة قبل الغداء بجانب البحر المتوسط." } },
    ],
    reviews: [{ id: "coast-trip-review", guestName: "Sami R.", rating: 5, date: "2026-08-06", comment: { en: "A relaxed small group, lovely hosts, and unforgettable sunset views.", ar: "مجموعة صغيرة ومريحة ومضيفون لطفاء وإطلالات غروب لا تنسى." } }],
  },
];

function matchesPrice(trip: Trip, range: TripPriceRange): boolean {
  if (range === "under200") return trip.pricePerSeatSyp < 200000;
  if (range === "200to400") return trip.pricePerSeatSyp >= 200000 && trip.pricePerSeatSyp <= 400000;
  return trip.pricePerSeatSyp > 400000;
}

export function listMockTrips(filters: TripFilters = {}): Trip[] {
  const minSeats = filters.minSeats ?? 1;
  return TRIPS.filter((trip) => {
    if (filters.governorate && trip.governorate !== filters.governorate) return false;
    if (filters.duration && trip.duration !== filters.duration) return false;
    if (filters.priceRange && !matchesPrice(trip, filters.priceRange)) return false;
    return trip.departures.some((departure) => departure.seatsLeft >= minSeats && (!filters.date || departure.date === filters.date));
  });
}

export function getMockTrip(id: string): Trip | undefined {
  return TRIPS.find((trip) => trip.id === id);
}

export function getMockTripIds(): string[] {
  return TRIPS.map((trip) => trip.id);
}
