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

export type TouristAccount = {
  reliabilityScore: number;
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

export const MOCK_TOURIST_ACCOUNT: TouristAccount = {
  reliabilityScore: 100,
  tier: "VIP",
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
          ar: "ضيف محترم وملتزم بالموعد وسهل التعامل.",
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
          en: "Clear communication and a pleasant guest.",
          ar: "تواصل واضح وضيف لطيف.",
        },
      },
    ],
  },
};
