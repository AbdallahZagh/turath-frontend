/**
 * Admin URLs. Nav, page headers, and in-app links use these — do not hardcode
 * `/admin/...` slugs elsewhere. Message keys may still use older domain names.
 */
export const ADMIN_PATHS = {
  home: "/admin",
  guests: "/admin/guests",
  guest: (id: string): string => `/admin/guests/${id}`,
  businesses: "/admin/businesses",
  business: (id: string): string => `/admin/businesses/${id}`,
  bookings: "/admin/bookings",
  noShows: "/admin/no-shows",
  noShow: (id: string): string => `/admin/no-shows/${id}`,
  accounts: "/admin/accounts",
  account: (id: string): string => `/admin/accounts/${id}`,
  heritageSites: "/admin/heritage-sites",
  heritageSite: (id: string): string => `/admin/heritage-sites/${id}`,
  lists: "/admin/lists",
  fees: "/admin/fees",
  featured: "/admin/featured",
  discountCodes: "/admin/discount-codes",
  reviews: "/admin/reviews",
  auditLogs: "/admin/audit-logs",
  settings: "/admin/settings",
} as const;

export function isAdminDetailPath(pathname: string, listPath: string): boolean {
  const prefix = `${listPath}/`;
  if (!pathname.startsWith(prefix)) {
    return false;
  }
  const rest = pathname.slice(prefix.length);
  return rest.length > 0 && !rest.includes("/");
}
