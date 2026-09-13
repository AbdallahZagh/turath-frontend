export const USER_PATHS = {
  home: "/user",
  bookings: "/user/bookings",
  reliability: "/user/reliability",
  review: (bookingId: string): string => `/user/bookings/${bookingId}/review`,
  hotels: "/user/hotels",
  restaurants: "/user/restaurants",
  trips: "/user/trips",
  events: "/user/events",
  guides: "/user/guides",
  attractions: "/user/attractions",
} as const;
