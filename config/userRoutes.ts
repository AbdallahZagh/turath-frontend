export const USER_PATHS = {
  home: "/user",
  bookings: "/user/bookings",
  reliability: "/user/reliability",
  review: (bookingId: string): string => `/user/bookings/${bookingId}/review`,
  hotels: "/hotels",
  restaurants: "/restaurants",
  trips: "/trips",
  events: "/events",
  guides: "/guides",
  attractions: "/attractions",
} as const;
