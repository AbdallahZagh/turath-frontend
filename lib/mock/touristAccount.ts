import { getAdminSettings } from "@/lib/mock/adminSettings";
import {
  reliabilityTier,
  type ReliabilityTier as AdminReliabilityTier,
} from "@/lib/mock/adminUsers";

/** PAGES.md: checkout warns when the guest score is below this. */
export const RELIABILITY_PROVIDER_ACCEPTANCE_BELOW = 50;

export type ReliabilityTier = "VIP" | "STANDARD" | "RESTRICTED" | "SUSPENDED";

export type ReliabilityEvent = {
  id: string;
  kind: "CHECK_IN" | "NO_SHOW";
  date: string;
  points: number;
};

export type ProviderGuestReview = {
  id: string;
  providerName: { en: string; ar: string };
  date: string;
  rating: number;
  comment: { en: string; ar: string };
};

export type TouristSignupProfile = {
  name: string;
  dateOfBirth: string;
  nationality: string;
  phone: string;
  phoneCountry: string;
  email: string;
};

type StoredTouristAccount = Omit<TouristAccount, "tier">;

export type TouristAccount = {
  profile: TouristSignupProfile;
  reliabilityScore: number;
  /** Derived from the score and the admin reliability cutoffs (Settings), never stored. */
  tier: ReliabilityTier;
  completedCheckIns: number;
  noShows: number;
  concurrentBookingCap: number;
  instantBooking: boolean;
  history: ReliabilityEvent[];
  providerRating: {
    average: number;
    count: number;
    reviews: ProviderGuestReview[];
  };
};

const MOCK_TOURIST_ACCOUNT: StoredTouristAccount = {
  profile: {
    name: "Rami Haddad",
    dateOfBirth: "1992-06-14",
    nationality: "SY",
    phone: "+963 944 123 456",
    phoneCountry: "SY",
    email: "rami.haddad@example.com",
  },
  reliabilityScore: 100,
  completedCheckIns: 7,
  noShows: 0,
  concurrentBookingCap: 4,
  instantBooking: true,
  history: [
    { id: "rel-1", kind: "CHECK_IN", date: "2026-08-24", points: 0 },
    { id: "rel-2", kind: "CHECK_IN", date: "2026-07-11", points: 0 },
    { id: "rel-3", kind: "CHECK_IN", date: "2026-05-03", points: 0 },
  ],
  providerRating: {
    average: 4.8,
    count: 3,
    reviews: [
      {
        id: "provider-review-1",
        providerName: { en: "Citadel Stone House", ar: "دار حجر القلعة" },
        date: "2026-08-24",
        rating: 5,
        comment: {
          en: "Respectful, punctual, and easy to welcome.",
          ar: "محترم وملتزم بالموعد وسهل التعامل.",
        },
      },
      {
        id: "provider-review-2",
        providerName: { en: "Damascus Story Walks", ar: "حكايات دمشق للمشي" },
        date: "2026-07-11",
        rating: 5,
        comment: {
          en: "Arrived prepared and treated the group with care.",
          ar: "وصل مستعداً وتعامل مع المجموعة باهتمام.",
        },
      },
      {
        id: "provider-review-3",
        providerName: { en: "Beit Sitti", ar: "بيت ستي" },
        date: "2026-05-03",
        rating: 4,
        comment: {
          en: "Clear communication and arrived on time.",
          ar: "تواصل واضح ووصول في الموعد.",
        },
      },
    ],
  },
};

const TOURIST_TIER: Record<AdminReliabilityTier, ReliabilityTier> = {
  vip: "VIP",
  standard: "STANDARD",
  restricted: "RESTRICTED",
  suspended: "SUSPENDED",
};

export function getMockTouristAccount(): TouristAccount {
  const cutoffs = getAdminSettings().reliability;
  return {
    ...MOCK_TOURIST_ACCOUNT,
    tier: TOURIST_TIER[reliabilityTier(MOCK_TOURIST_ACCOUNT.reliabilityScore, cutoffs)],
    profile: { ...MOCK_TOURIST_ACCOUNT.profile },
    history: MOCK_TOURIST_ACCOUNT.history.map((event) => ({ ...event })),
    providerRating: {
      ...MOCK_TOURIST_ACCOUNT.providerRating,
      reviews: MOCK_TOURIST_ACCOUNT.providerRating.reviews.map((review) => ({
        ...review,
        providerName: { ...review.providerName },
        comment: { ...review.comment },
      })),
    },
  };
}

export function setMockTouristSignupProfile(profile: TouristSignupProfile): void {
  MOCK_TOURIST_ACCOUNT.profile = { ...profile };
}
