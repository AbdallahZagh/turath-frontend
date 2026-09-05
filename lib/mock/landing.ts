import {
  ArrowLeftRight,
  Compass,
  Hotel,
  PartyPopper,
  QrCode,
  ScanLine,
  ShieldCheck,
  Smartphone,
  UserRound,
  UtensilsCrossed,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type GovernorateSlug =
  | "damascus"
  | "aleppo"
  | "latakia"
  | "tartus"
  | "homs"
  | "hama"
  | "palmyra"
  | "bosra";

export type Governorate = {
  slug: GovernorateSlug;
  /** Stylized position on the abstract map preview, not real geo-coordinates. */
  positionPercent: { x: number; y: number };
};

export const GOVERNORATES: Governorate[] = [
  { slug: "damascus", positionPercent: { x: 52, y: 78 } },
  { slug: "aleppo", positionPercent: { x: 38, y: 14 } },
  { slug: "latakia", positionPercent: { x: 12, y: 30 } },
  { slug: "tartus", positionPercent: { x: 14, y: 48 } },
  { slug: "homs", positionPercent: { x: 40, y: 50 } },
  { slug: "hama", positionPercent: { x: 38, y: 38 } },
  { slug: "palmyra", positionPercent: { x: 65, y: 55 } },
  { slug: "bosra", positionPercent: { x: 55, y: 92 } },
];

export type LandingPillarId = "hotels" | "dining" | "trips" | "events" | "guides";
export type BentoTileSize = "large" | "medium";

export type BentoTagKey =
  | "generator"
  | "wifi"
  | "ac"
  | "rooftop"
  | "liveMusic"
  | "seatsLeft"
  | "guidedTour"
  | "vipTier"
  | "multilingual";

export type BentoPillar = {
  id: LandingPillarId;
  /** Used for the search widget's segmented tab pills. */
  icon: LucideIcon;
  imageSrc: string;
  href: string;
  tagKeys: BentoTagKey[];
  size: BentoTileSize;
};

export const BENTO_PILLARS: BentoPillar[] = [
  {
    id: "hotels",
    icon: Hotel,
    imageSrc: "/images/landing/pillar-hotels.png",
    href: "/hotels",
    tagKeys: ["generator", "wifi", "ac"],
    size: "large",
  },
  {
    id: "dining",
    icon: UtensilsCrossed,
    imageSrc: "/images/landing/pillar-dining.png",
    href: "/restaurants",
    tagKeys: ["rooftop", "liveMusic"],
    size: "medium",
  },
  {
    id: "trips",
    icon: Compass,
    imageSrc: "/images/landing/pillar-trips.png",
    href: "/trips",
    tagKeys: ["seatsLeft", "guidedTour"],
    size: "medium",
  },
  {
    id: "events",
    icon: PartyPopper,
    imageSrc: "/images/landing/pillar-events.png",
    href: "/events",
    tagKeys: ["vipTier"],
    size: "medium",
  },
  {
    id: "guides",
    icon: UserRound,
    imageSrc: "/images/landing/pillar-guides.png",
    href: "/guides",
    tagKeys: ["multilingual"],
    size: "medium",
  },
];

export type PersonaId = "firstTime" | "heritageSeeker" | "foodie" | "family" | "provider";

export type InterestTileKey =
  | "firstTimeOldDamascus"
  | "firstTimeBoutiqueStays"
  | "firstTimeGuidedWalks"
  | "firstTimeCashOnArrival"
  | "heritagePalmyra"
  | "heritageAleppoCitadel"
  | "heritageKrak"
  | "heritageGuides"
  | "foodieRooftopDining"
  | "foodieSoukTrails"
  | "foodieLiveMusic"
  | "foodieReservedTables"
  | "familyStays"
  | "familyDayTrips"
  | "familyFestivals"
  | "familySupport"
  | "providerListBusiness"
  | "providerScannerApp"
  | "providerLedger"
  | "providerDashboard";

export type InterestTile = {
  key: InterestTileKey;
  href: string;
  gradient: string;
};

export const PERSONA_IDS: PersonaId[] = [
  "firstTime",
  "heritageSeeker",
  "foodie",
  "family",
  "provider",
];

export const PERSONA_INTEREST_TILES: Record<PersonaId, InterestTile[]> = {
  firstTime: [
    { key: "firstTimeOldDamascus", href: "/attractions/umayyad-mosque", gradient: "from-primary/75 via-accent/35 to-transparent" },
    { key: "firstTimeBoutiqueStays", href: "/hotels", gradient: "from-accent/70 via-primary/40 to-transparent" },
    { key: "firstTimeGuidedWalks", href: "/guides", gradient: "from-primary/65 via-accent/30 to-transparent" },
    { key: "firstTimeCashOnArrival", href: "#how-it-works", gradient: "from-accent/65 via-primary/35 to-transparent" },
  ],
  heritageSeeker: [
    { key: "heritagePalmyra", href: "/attractions/palmyra-ruins", gradient: "from-primary/70 via-accent/40 to-transparent" },
    { key: "heritageAleppoCitadel", href: "/attractions/aleppo-citadel", gradient: "from-accent/70 via-primary/35 to-transparent" },
    { key: "heritageKrak", href: "/attractions/krak-des-chevaliers", gradient: "from-primary/65 via-accent/35 to-transparent" },
    { key: "heritageGuides", href: "/guides", gradient: "from-accent/60 via-primary/40 to-transparent" },
  ],
  foodie: [
    { key: "foodieRooftopDining", href: "/restaurants", gradient: "from-accent/70 via-primary/35 to-transparent" },
    { key: "foodieSoukTrails", href: "/trips", gradient: "from-primary/70 via-accent/35 to-transparent" },
    { key: "foodieLiveMusic", href: "/events", gradient: "from-accent/65 via-primary/40 to-transparent" },
    { key: "foodieReservedTables", href: "/restaurants", gradient: "from-primary/60 via-accent/40 to-transparent" },
  ],
  family: [
    { key: "familyStays", href: "/hotels", gradient: "from-primary/70 via-accent/35 to-transparent" },
    { key: "familyDayTrips", href: "/trips", gradient: "from-accent/65 via-primary/40 to-transparent" },
    { key: "familyFestivals", href: "/events", gradient: "from-primary/65 via-accent/30 to-transparent" },
    { key: "familySupport", href: "/guides", gradient: "from-accent/60 via-primary/35 to-transparent" },
  ],
  provider: [
    { key: "providerListBusiness", href: "/provider/register", gradient: "from-primary/75 via-accent/35 to-transparent" },
    { key: "providerScannerApp", href: "#grow-with-turath", gradient: "from-accent/70 via-primary/35 to-transparent" },
    { key: "providerLedger", href: "#grow-with-turath", gradient: "from-primary/65 via-accent/40 to-transparent" },
    { key: "providerDashboard", href: "/provider/register", gradient: "from-accent/65 via-primary/30 to-transparent" },
  ],
};

export type TrustBarItemId =
  | "cashOnArrival"
  | "offlineQr"
  | "licensedProviders"
  | "dualCurrency";

export type TrustBarItem = {
  id: TrustBarItemId;
  icon: LucideIcon;
};

export const TRUST_BAR_ITEMS: TrustBarItem[] = [
  { id: "cashOnArrival", icon: Wallet },
  { id: "offlineQr", icon: QrCode },
  { id: "licensedProviders", icon: ShieldCheck },
  { id: "dualCurrency", icon: ArrowLeftRight },
];

export type HeritageSiteKey =
  | "umayyadMosque"
  | "aleppoCitadel"
  | "palmyraRuins"
  | "krakDesChevaliers"
  | "bosraAmphitheatre"
  | "saladinCastle";

export type HeritageSite = {
  slug: string;
  translationKey: HeritageSiteKey;
  governorateSlug: GovernorateSlug;
  imageSrc: string;
  /** Used for the small avatar swatch in the map explorer's nearby-sites list. */
  gradient: string;
};

export const HERITAGE_SITES: HeritageSite[] = [
  {
    slug: "umayyad-mosque",
    translationKey: "umayyadMosque",
    governorateSlug: "damascus",
    imageSrc: "/images/landing/site-umayyad-mosque.png",
    gradient: "from-primary/70 via-accent/35 to-transparent",
  },
  {
    slug: "aleppo-citadel",
    translationKey: "aleppoCitadel",
    governorateSlug: "aleppo",
    imageSrc: "/images/landing/site-aleppo-citadel.png",
    gradient: "from-accent/70 via-primary/35 to-transparent",
  },
  {
    slug: "palmyra-ruins",
    translationKey: "palmyraRuins",
    governorateSlug: "palmyra",
    imageSrc: "/images/landing/site-palmyra.png",
    gradient: "from-primary/60 via-accent/45 to-transparent",
  },
  {
    slug: "krak-des-chevaliers",
    translationKey: "krakDesChevaliers",
    governorateSlug: "homs",
    imageSrc: "/images/landing/site-krak-des-chevaliers.png",
    gradient: "from-accent/60 via-primary/40 to-transparent",
  },
  {
    slug: "bosra-amphitheatre",
    translationKey: "bosraAmphitheatre",
    governorateSlug: "bosra",
    imageSrc: "/images/landing/site-bosra-amphitheatre.png",
    gradient: "from-primary/65 via-accent/30 to-transparent",
  },
  {
    slug: "saladin-castle",
    translationKey: "saladinCastle",
    governorateSlug: "latakia",
    imageSrc: "/images/landing/site-saladin-castle.png",
    gradient: "from-accent/65 via-primary/35 to-transparent",
  },
];

export type HowItWorksStepId = "reserve" | "qrPass" | "checkIn";

export type HowItWorksStep = {
  id: HowItWorksStepId;
  icon: LucideIcon;
};

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  { id: "reserve", icon: Smartphone },
  { id: "qrPass", icon: QrCode },
  { id: "checkIn", icon: ScanLine },
];

export type TestimonialKey = "layla" | "omar" | "sara" | "james" | "nour" | "michael";

export type Testimonial = {
  id: string;
  initials: string;
  translationKey: TestimonialKey;
  rating: 1 | 2 | 3 | 4 | 5;
};

export const TESTIMONIALS: Testimonial[] = [
  { id: "t1", initials: "LM", translationKey: "layla", rating: 5 },
  { id: "t2", initials: "OK", translationKey: "omar", rating: 5 },
  { id: "t3", initials: "SH", translationKey: "sara", rating: 4 },
  { id: "t4", initials: "JD", translationKey: "james", rating: 5 },
  { id: "t5", initials: "NT", translationKey: "nour", rating: 5 },
  { id: "t6", initials: "MK", translationKey: "michael", rating: 4 },
];

export type EmergencyHotlineId = "police" | "ambulance" | "touristPolice" | "fire";

export type EmergencyHotline = {
  id: EmergencyHotlineId;
  phone: string;
};

export const EMERGENCY_HOTLINES: EmergencyHotline[] = [
  { id: "police", phone: "112" },
  { id: "ambulance", phone: "110" },
  { id: "touristPolice", phone: "137" },
  { id: "fire", phone: "113" },
];
