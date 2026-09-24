import type {
  EventSessionValues,
  GuideOfferingValues,
  HotelRoomValues,
  RestaurantScheduleValues,
  RestaurantTableValues,
  TripOfferingValues,
} from "@/lib/validation/providerInventory";

export const PROVIDER_INVENTORY_CATEGORIES = [
  "hotels",
  "restaurants",
  "trips",
  "events",
  "guides",
] as const;
export type ProviderInventoryCategory = (typeof PROVIDER_INVENTORY_CATEGORIES)[number];

export type HotelRoom = HotelRoomValues & { id: string };
export type RestaurantTable = RestaurantTableValues & { id: string };
export type TripOffering = TripOfferingValues & { id: string };
export type EventSession = EventSessionValues & { id: string };
export type GuideOffering = GuideOfferingValues;

export type ProviderInventory =
  | { category: "hotels"; rooms: HotelRoom[] }
  | { category: "restaurants"; tables: RestaurantTable[]; slots: string[] }
  | { category: "trips"; trips: TripOffering[] }
  | { category: "events"; sessions: EventSession[] }
  | { category: "guides"; guide: GuideOffering };

export type SaveProviderInventoryInput =
  | { category: "hotels"; id?: string; values: HotelRoomValues }
  | { category: "restaurants"; id?: string; values: RestaurantTableValues }
  | { category: "restaurantSchedule"; values: RestaurantScheduleValues }
  | { category: "trips"; id?: string; values: TripOfferingValues }
  | { category: "events"; id?: string; values: EventSessionValues }
  | { category: "guides"; values: GuideOfferingValues };

export type DeleteProviderInventoryInput = {
  category: Exclude<ProviderInventoryCategory, "guides">;
  id: string;
};

let nextId = 20;
const newId = (prefix: string): string => `${prefix}-${nextId++}`;

const inventories: Record<ProviderInventoryCategory, ProviderInventory> = {
  hotels: {
    category: "hotels",
    rooms: [
      { id: "room-1", nameEn: "Double room", nameAr: "غرفة مزدوجة", occupancy: 2, quantity: 8, priceSyp: 240_000, amenities: ["wifi", "ac", "generator"] },
      { id: "room-2", nameEn: "Courtyard suite", nameAr: "جناح مطل على الباحة", occupancy: 4, quantity: 3, priceSyp: 520_000, amenities: ["wifi", "ac", "generator"] },
    ],
  },
  restaurants: {
    category: "restaurants",
    slots: ["13:00", "18:00", "20:30"],
    tables: [
      { id: "table-1", label: "T1", capacity: 4, zone: "indoor" },
      { id: "table-2", label: "Terrace A", capacity: 6, zone: "terrace" },
      { id: "table-3", label: "VIP 1", capacity: 8, zone: "vip" },
    ],
  },
  trips: {
    category: "trips",
    trips: [
      { id: "trip-1", titleEn: "Damascus story walk", titleAr: "جولة حكايات دمشق", date: "2026-10-02", pickupEn: "Bab Touma Square", pickupAr: "ساحة باب توما", capacity: 14, seatsLeft: 6, priceSyp: 180_000, itineraryEn: "Bab Touma, Straight Street, Azem Palace, and the old souq.", itineraryAr: "باب توما والشارع المستقيم وقصر العظم والسوق القديم." },
    ],
  },
  events: {
    category: "events",
    sessions: [
      { id: "event-1", titleEn: "Courtyard music night", titleAr: "ليلة موسيقية في الباحة", date: "2026-10-08", time: "20:00", tier: "standard", capacity: 80, available: 34, maxPerUser: 6, priceSyp: 150_000 },
      { id: "event-2", titleEn: "Courtyard music night", titleAr: "ليلة موسيقية في الباحة", date: "2026-10-08", time: "20:00", tier: "vip", capacity: 20, available: 8, maxPerUser: 4, priceSyp: 280_000 },
    ],
  },
  guides: {
    category: "guides",
    guide: { licenseNumber: "TG-DAM-1842", languages: ["ar", "en", "fr"], hourlySyp: 90_000, fullDaySyp: 480_000, specialtiesEn: "Old Damascus, architecture, food heritage", specialtiesAr: "دمشق القديمة والعمارة وتراث الطعام", blockedDates: "2026-10-04, 2026-10-11" },
  },
};

function cloneInventory(inventory: ProviderInventory): ProviderInventory {
  switch (inventory.category) {
    case "hotels": return { category: "hotels", rooms: inventory.rooms.map((item) => ({ ...item, amenities: [...item.amenities] })) };
    case "restaurants": return { category: "restaurants", tables: inventory.tables.map((item) => ({ ...item })), slots: [...inventory.slots] };
    case "trips": return { category: "trips", trips: inventory.trips.map((item) => ({ ...item })) };
    case "events": return { category: "events", sessions: inventory.sessions.map((item) => ({ ...item })) };
    case "guides": return { category: "guides", guide: { ...inventory.guide, languages: [...inventory.guide.languages] } };
  }
}

export function getProviderInventory(category: ProviderInventoryCategory): ProviderInventory {
  return cloneInventory(inventories[category]);
}

export function saveProviderInventory(input: SaveProviderInventoryInput): ProviderInventory {
  if (input.category === "restaurantSchedule") {
    const current = inventories.restaurants as Extract<ProviderInventory, { category: "restaurants" }>;
    current.slots = input.values.slots.split(",").map((slot) => slot.trim()).filter(Boolean);
    return cloneInventory(current);
  }
  if (input.category === "guides") {
    inventories.guides = { category: "guides", guide: { ...input.values, languages: [...input.values.languages] } };
    return cloneInventory(inventories.guides);
  }
  const current = inventories[input.category];
  if (current.category === "hotels" && input.category === "hotels") {
    const saved = { id: input.id ?? newId("room"), ...input.values };
    current.rooms = input.id ? current.rooms.map((item) => item.id === input.id ? saved : item) : [...current.rooms, saved];
  } else if (current.category === "restaurants" && input.category === "restaurants") {
    const saved = { id: input.id ?? newId("table"), ...input.values };
    current.tables = input.id ? current.tables.map((item) => item.id === input.id ? saved : item) : [...current.tables, saved];
  } else if (current.category === "trips" && input.category === "trips") {
    const saved = { id: input.id ?? newId("trip"), ...input.values };
    current.trips = input.id ? current.trips.map((item) => item.id === input.id ? saved : item) : [...current.trips, saved];
  } else if (current.category === "events" && input.category === "events") {
    const saved = { id: input.id ?? newId("event"), ...input.values };
    current.sessions = input.id ? current.sessions.map((item) => item.id === input.id ? saved : item) : [...current.sessions, saved];
  }
  return cloneInventory(current);
}

export function deleteProviderInventoryItem(input: DeleteProviderInventoryInput): ProviderInventory {
  const current = inventories[input.category];
  if (current.category === "hotels") current.rooms = current.rooms.filter((item) => item.id !== input.id);
  if (current.category === "restaurants") current.tables = current.tables.filter((item) => item.id !== input.id);
  if (current.category === "trips") current.trips = current.trips.filter((item) => item.id !== input.id);
  if (current.category === "events") current.sessions = current.sessions.filter((item) => item.id !== input.id);
  return cloneInventory(current);
}

export function inventoryItemName(item: HotelRoom | RestaurantTable | TripOffering | EventSession, locale: "en" | "ar"): string {
  if ("nameEn" in item) return locale === "ar" ? item.nameAr : item.nameEn;
  if ("titleEn" in item) return locale === "ar" ? item.titleAr : item.titleEn;
  return item.label;
}
