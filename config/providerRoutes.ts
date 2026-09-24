export const PROVIDER_PATHS = {
  home: "/provider",
  bookings: "/provider/bookings",
  checkIn: "/provider/check-in",
  reviews: "/provider/reviews",
  profile: "/provider/profile",
  inventory: "/provider/inventory",
  ledger: "/provider/ledger",
  staff: "/provider/staff",
  settings: "/provider/settings",
} as const;

export function providerBookingPath(id: string): string {
  return `${PROVIDER_PATHS.bookings}/${encodeURIComponent(id)}`;
}

export function providerCheckInPath(code: string): string {
  return `${PROVIDER_PATHS.checkIn}?code=${encodeURIComponent(code)}`;
}
