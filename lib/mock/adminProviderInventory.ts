import type { LocalizedName } from "@/lib/i18n/localized";
import type { LandingPillarId } from "@/lib/mock/landing";

export const ROOM_AMENITIES = ["generator", "wifi", "ac"] as const;
export type RoomAmenity = (typeof ROOM_AMENITIES)[number];

export const DINING_ZONES = ["indoor", "terrace", "vip", "smoking"] as const;
export type DiningZone = (typeof DINING_ZONES)[number];

export const GUIDE_LANGUAGES = ["ar", "en", "fr"] as const;
export type GuideLanguage = (typeof GUIDE_LANGUAGES)[number];

export type HotelRoomType = {
  id: string;
  name: LocalizedName;
  occupancy: number;
  quantity: number;
  priceSyp: number;
  amenities: RoomAmenity[];
};

export type DiningTable = {
  id: string;
  label: string;
  capacity: number;
  zone: DiningZone;
};

export type TripListing = {
  title: LocalizedName;
  dates: string[];
  pickup: LocalizedName;
  capacity: number;
  seatsLeft: number;
  itinerary: LocalizedName;
  priceSyp: number;
};

export type EventSession = {
  id: string;
  at: string;
  time?: string;
  tier: LocalizedName;
  capacity: number;
  priceSyp: number;
  maxPerUser: number;
};

export type GuideListing = {
  licenseNumber: string;
  languages: GuideLanguage[];
  hourlySyp: number;
  fullDaySyp: number;
  specialties: LocalizedName[];
};

export type ProviderInventory =
  | { kind: "hotels"; rooms: HotelRoomType[] }
  | { kind: "dining"; tables: DiningTable[]; slots: string[] }
  | { kind: "trips"; trip: TripListing }
  | { kind: "events"; sessions: EventSession[] }
  | { kind: "guides"; guide: GuideListing };

type InventorySeed = {
  id: string;
  name: LocalizedName;
  category: LandingPillarId;
};

function loc(en: string, ar: string): LocalizedName {
  return { en, ar };
}

function hotelRooms(seed: InventorySeed): HotelRoomType[] {
  const prefix = seed.id;
  if (seed.id === "prv_09") {
    return [
      {
        id: `${prefix}_rm1`,
        name: loc("Courtyard queen", "غرفة ملكية على الصحن"),
        occupancy: 2,
        quantity: 8,
        priceSyp: 450_000,
        amenities: ["wifi", "ac", "generator"],
      },
      {
        id: `${prefix}_rm2`,
        name: loc("Family suite", "جناح عائلي"),
        occupancy: 4,
        quantity: 3,
        priceSyp: 820_000,
        amenities: ["wifi", "ac", "generator"],
      },
    ];
  }
  return [
    {
      id: `${prefix}_rm1`,
      name: loc("Standard twin", "غرفة توأم"),
      occupancy: 2,
      quantity: 6,
      priceSyp: 320_000,
      amenities: ["wifi", "ac"],
    },
    {
      id: `${prefix}_rm2`,
      name: loc("Garden double", "غرفة مزدوجة على الحديقة"),
      occupancy: 2,
      quantity: 4,
      priceSyp: 380_000,
      amenities: ["wifi", "ac", "generator"],
    },
  ];
}

function diningInventory(seed: InventorySeed): Extract<ProviderInventory, { kind: "dining" }> {
  const prefix = seed.id;
  return {
    kind: "dining",
    slots: seed.id === "prv_10" ? ["13:00", "20:30"] : ["12:30", "19:00"],
    tables: [
      { id: `${prefix}_t1`, label: "T1", capacity: 4, zone: "indoor" },
      { id: `${prefix}_t2`, label: "T2", capacity: 6, zone: "indoor" },
      { id: `${prefix}_t3`, label: "Terrace A", capacity: 4, zone: "terrace" },
      { id: `${prefix}_t4`, label: "VIP", capacity: 8, zone: "vip" },
    ],
  };
}

function tripListing(seed: InventorySeed): TripListing {
  if (seed.id === "prv_03") {
    return {
      title: seed.name,
      dates: ["2026-09-12", "2026-09-19", "2026-09-26"],
      pickup: loc("Palmyra museum gate", "بوابة متحف تدمر"),
      capacity: 16,
      seatsLeft: 5,
      itinerary: loc(
        "Dawn walk through the colonnade, Temple of Bel, and the valley of tombs.",
        "مشوار فجر عبر الرواق المعمد، ومعبد بل، ووادي القبور.",
      ),
      priceSyp: 640_000,
    };
  }
  return {
    title: seed.name,
    dates: ["2026-09-08", "2026-09-15"],
    pickup: loc("Hotel lobby pickup", "انطلاق من بهو الفندق"),
    capacity: 12,
    seatsLeft: 7,
    itinerary: loc(
      "Half-day outing with a licensed operator, lunch included.",
      "جولة نصف يوم مع مشغّل مرخّص، والغداء مشمول.",
    ),
    priceSyp: 480_000,
  };
}

function eventSessions(seed: InventorySeed): EventSession[] {
  const prefix = seed.id;
  const maxPerUser = 6;
  if (seed.id === "prv_13") {
    return [
      {
        id: `${prefix}_s1`,
        at: "2026-09-05",
        time: "19:00",
        tier: loc("General", "عام"),
        capacity: 120,
        priceSyp: 95_000,
        maxPerUser,
      },
      {
        id: `${prefix}_s2`,
        at: "2026-09-05",
        time: "19:00",
        tier: loc("VIP terrace", "تراس VIP"),
        capacity: 24,
        priceSyp: 180_000,
        maxPerUser,
      },
    ];
  }
  return [
    {
      id: `${prefix}_s1`,
      at: "2026-09-12",
      time: "21:00",
      tier: loc("General admission", "دخول عام"),
      capacity: 80,
      priceSyp: 150_000,
      maxPerUser,
    },
  ];
}

function guideListing(seed: InventorySeed): GuideListing {
  if (seed.id === "prv_11") {
    return {
      licenseNumber: "TG-ALP-2204",
      languages: ["ar", "en", "fr"],
      hourlySyp: 85_000,
      fullDaySyp: 420_000,
      specialties: [
        loc("Citadel and old souqs", "القلعة والأسواق القديمة"),
        loc("Ottoman houses", "البيوت العثمانية"),
      ],
    };
  }
  return {
    licenseNumber: `TG-${seed.id.slice(-2).toUpperCase()}-1108`,
    languages: ["ar", "en"],
    hourlySyp: 70_000,
    fullDaySyp: 380_000,
    specialties: [
      loc("Old city walking", "مشاوير المدينة القديمة"),
      loc("Heritage sites", "المواقع التراثية"),
    ],
  };
}

export function inventoryFor(seed: InventorySeed): ProviderInventory {
  switch (seed.category) {
    case "hotels":
      return { kind: "hotels", rooms: hotelRooms(seed) };
    case "dining":
      return diningInventory(seed);
    case "trips":
      return { kind: "trips", trip: tripListing(seed) };
    case "events":
      return { kind: "events", sessions: eventSessions(seed) };
    case "guides":
      return { kind: "guides", guide: guideListing(seed) };
  }
}

export function cloneInventory(inventory: ProviderInventory): ProviderInventory {
  switch (inventory.kind) {
    case "hotels":
      return {
        kind: "hotels",
        rooms: inventory.rooms.map((room) => ({
          ...room,
          name: { ...room.name },
          amenities: [...room.amenities],
        })),
      };
    case "dining":
      return {
        kind: "dining",
        slots: [...inventory.slots],
        tables: inventory.tables.map((table) => ({ ...table })),
      };
    case "trips":
      return {
        kind: "trips",
        trip: {
          ...inventory.trip,
          title: { ...inventory.trip.title },
          dates: [...inventory.trip.dates],
          pickup: { ...inventory.trip.pickup },
          itinerary: { ...inventory.trip.itinerary },
        },
      };
    case "events":
      return {
        kind: "events",
        sessions: inventory.sessions.map((session) => ({
          ...session,
          tier: { ...session.tier },
        })),
      };
    case "guides":
      return {
        kind: "guides",
        guide: {
          ...inventory.guide,
          languages: [...inventory.guide.languages],
          specialties: inventory.guide.specialties.map((item) => ({ ...item })),
        },
      };
  }
}
