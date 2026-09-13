/** PAGES.md: checkout warns when the guest score is below this. */
export const RELIABILITY_PROVIDER_ACCEPTANCE_BELOW = 50;

export type ReliabilityTier = "VIP" | "STANDARD" | "RESTRICTED" | "SUSPENDED";

export type ReliabilityEvent = {
  id: string;
  kind: "CHECK_IN" | "NO_SHOW";
  date: string;
  points: number;
};

export type TouristAccount = {
  reliabilityScore: number;
  tier: ReliabilityTier;
  completedCheckIns: number;
  noShows: number;
  concurrentBookingCap: number;
  instantBooking: boolean;
  history: ReliabilityEvent[];
};

export const MOCK_TOURIST_ACCOUNT: TouristAccount = {
  reliabilityScore: 86,
  tier: "VIP",
  completedCheckIns: 7,
  noShows: 0,
  concurrentBookingCap: 5,
  instantBooking: true,
  history: [
    { id: "rel-1", kind: "CHECK_IN", date: "2026-08-24", points: 0 },
    { id: "rel-2", kind: "CHECK_IN", date: "2026-07-11", points: 0 },
    { id: "rel-3", kind: "CHECK_IN", date: "2026-05-03", points: 0 },
  ],
};
