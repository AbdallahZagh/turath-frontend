/**
 * Named Home Featured slots (MVP). Hero is not a slot.
 * Shared by Settings toggles, Featured assignments, and Home consumers.
 */

export const FEATURED_SLOT_IDS = [
  "heritage_spotlight",
  "pillar_hotels",
  "pillar_dining",
  "pillar_trips",
  "pillar_events",
  "pillar_guides",
  "home_campaign",
  "persona_rail",
] as const;

export type FeaturedSlotId = (typeof FEATURED_SLOT_IDS)[number];

export const FEATURED_SLOT_CAPACITY: Record<FeaturedSlotId, number> = {
  heritage_spotlight: 6,
  pillar_hotels: 1,
  pillar_dining: 1,
  pillar_trips: 1,
  pillar_events: 1,
  pillar_guides: 1,
  home_campaign: 1,
  persona_rail: 4,
};

export const PILLAR_FEATURED_SLOTS = [
  "pillar_hotels",
  "pillar_dining",
  "pillar_trips",
  "pillar_events",
  "pillar_guides",
] as const;

export type PillarFeaturedSlotId = (typeof PILLAR_FEATURED_SLOTS)[number];

export const PILLAR_ID_BY_SLOT: Record<
  PillarFeaturedSlotId,
  "hotels" | "dining" | "trips" | "events" | "guides"
> = {
  pillar_hotels: "hotels",
  pillar_dining: "dining",
  pillar_trips: "trips",
  pillar_events: "events",
  pillar_guides: "guides",
};

export const SLOT_BY_PILLAR_ID: Record<
  "hotels" | "dining" | "trips" | "events" | "guides",
  PillarFeaturedSlotId
> = {
  hotels: "pillar_hotels",
  dining: "pillar_dining",
  trips: "pillar_trips",
  events: "pillar_events",
  guides: "pillar_guides",
};

export function isFeaturedSlotId(value: string): value is FeaturedSlotId {
  return (FEATURED_SLOT_IDS as readonly string[]).includes(value);
}

export function defaultFeaturedSlotEnables(): Record<FeaturedSlotId, boolean> {
  return {
    heritage_spotlight: true,
    pillar_hotels: true,
    pillar_dining: true,
    pillar_trips: true,
    pillar_events: true,
    pillar_guides: true,
    home_campaign: true,
    persona_rail: true,
  };
}

/** Campaign kind is only valid for `home_campaign`; listing pins use the rest. */
export function slotRequiresCampaign(slot: FeaturedSlotId): boolean {
  return slot === "home_campaign";
}
