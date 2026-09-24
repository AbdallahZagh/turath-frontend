/**
 * Shared page titles for admin, provider, and tourist shells.
 * Add a row here when a route gets a real screen — pages do not hardcode headers.
 */
import { ADMIN_PATHS, isAdminDetailPath } from "@/config/adminRoutes";
import { PROVIDER_PATHS } from "@/config/providerRoutes";

export type PageHeaderNamespace = "admin.headers" | "provider.headers" | "hotels.headers" | "restaurants.headers" | "trips.headers" | "events.headers" | "guides.headers" | "attractions.headers" | "discovery.headers" | "account.headers" | "legal.headers";

export type AdminHeaderPage =
  | "overview"
  | "users"
  | "userDetail"
  | "providers"
  | "providerDetail"
  | "bookings"
  | "disputes"
  | "disputeDetail"
  | "ledger"
  | "ledgerDetail"
  | "attractions"
  | "attractionDetail"
  | "commissions"
  | "taxonomy"
  | "promotions"
  | "coupons"
  | "reviews"
  | "auditLogs"
  | "settings";

export type PageHeaderActionKind = "add";

export type PageHeaderActionLabelNs =
  | "admin.attractions"
  | "admin.taxonomy"
  | "admin.promotions"
  | "admin.coupons";

export type PageHeaderActionSpec = {
  id: string;
  kind: PageHeaderActionKind;
  /** Message namespace for the button label — same source as the page copy. */
  labelNs: PageHeaderActionLabelNs;
  labelKey: "add";
};

export type PageHeaderSpec = {
  namespace: PageHeaderNamespace;
  page: AdminHeaderPage | "index" | "dashboard" | "bookingDetail" | "profile" | "myProfile" | "inventory" | "checkIn" | "staff" | "reliability" | "explore" | "search" | "terms" | "privacy" | "providerLicensing";
  /** Pin the header and let the page body fill leftover viewport height. */
  fillViewport?: boolean;
  actions?: PageHeaderActionSpec[];
};

const PAGE_HEADERS: Record<string, PageHeaderSpec> = {
  "/provider": { namespace: "provider.headers", page: "dashboard" },
  "/provider/bookings": { namespace: "provider.headers", page: "bookings" },
  providerBookingDetail: { namespace: "provider.headers", page: "bookingDetail" },
  "/provider/check-in": { namespace: "provider.headers", page: "checkIn" },
  "/provider/reviews": { namespace: "provider.headers", page: "reviews" },
  "/provider/my-profile": { namespace: "provider.headers", page: "myProfile" },
  "/provider/profile": { namespace: "provider.headers", page: "profile" },
  "/provider/inventory": { namespace: "provider.headers", page: "inventory" },
  "/provider/ledger": { namespace: "provider.headers", page: "ledger" },
  "/provider/staff": { namespace: "provider.headers", page: "staff" },
  "/provider/settings": { namespace: "provider.headers", page: "settings" },
  "/hotels": { namespace: "hotels.headers", page: "index" },
  "/restaurants": { namespace: "restaurants.headers", page: "index" },
  "/trips": { namespace: "trips.headers", page: "index" },
  "/events": { namespace: "events.headers", page: "index" },
  "/guides": { namespace: "guides.headers", page: "index" },
  "/attractions": { namespace: "attractions.headers", page: "index" },
  "/explore": { namespace: "discovery.headers", page: "explore" },
  "/search": { namespace: "discovery.headers", page: "search" },
  "/legal/terms": { namespace: "legal.headers", page: "terms" },
  "/legal/privacy": { namespace: "legal.headers", page: "privacy" },
  "/legal/provider-licensing": { namespace: "legal.headers", page: "providerLicensing" },
  "/user": { namespace: "account.headers", page: "dashboard" },
  "/user/profile": { namespace: "account.headers", page: "profile" },
  "/user/hotels": { namespace: "hotels.headers", page: "index" },
  "/user/restaurants": { namespace: "restaurants.headers", page: "index" },
  "/user/trips": { namespace: "trips.headers", page: "index" },
  "/user/events": { namespace: "events.headers", page: "index" },
  "/user/guides": { namespace: "guides.headers", page: "index" },
  "/user/attractions": { namespace: "attractions.headers", page: "index" },
  "/user/bookings": { namespace: "account.headers", page: "bookings" },
  "/user/reliability": { namespace: "account.headers", page: "reliability" },
  [ADMIN_PATHS.home]: { namespace: "admin.headers", page: "overview" },
  [ADMIN_PATHS.guests]: { namespace: "admin.headers", page: "users", fillViewport: true },
  guestDetail: { namespace: "admin.headers", page: "userDetail" },
  [ADMIN_PATHS.businesses]: {
    namespace: "admin.headers",
    page: "providers",
    fillViewport: true,
  },
  businessDetail: { namespace: "admin.headers", page: "providerDetail" },
  [ADMIN_PATHS.bookings]: {
    namespace: "admin.headers",
    page: "bookings",
    fillViewport: true,
  },
  [ADMIN_PATHS.noShows]: {
    namespace: "admin.headers",
    page: "disputes",
    fillViewport: true,
  },
  noShowDetail: { namespace: "admin.headers", page: "disputeDetail" },
  [ADMIN_PATHS.accounts]: {
    namespace: "admin.headers",
    page: "ledger",
    fillViewport: true,
  },
  accountDetail: { namespace: "admin.headers", page: "ledgerDetail" },
  [ADMIN_PATHS.heritageSites]: {
    namespace: "admin.headers",
    page: "attractions",
    fillViewport: true,
    actions: [
      {
        id: "add",
        kind: "add",
        labelNs: "admin.attractions",
        labelKey: "add",
      },
    ],
  },
  heritageSiteDetail: { namespace: "admin.headers", page: "attractionDetail" },
  [ADMIN_PATHS.fees]: {
    namespace: "admin.headers",
    page: "commissions",
    fillViewport: true,
  },
  [ADMIN_PATHS.lists]: {
    namespace: "admin.headers",
    page: "taxonomy",
    fillViewport: true,
    actions: [
      {
        id: "add",
        kind: "add",
        labelNs: "admin.taxonomy",
        labelKey: "add",
      },
    ],
  },
  [ADMIN_PATHS.featured]: {
    namespace: "admin.headers",
    page: "promotions",
    fillViewport: true,
    actions: [
      {
        id: "add",
        kind: "add",
        labelNs: "admin.promotions",
        labelKey: "add",
      },
    ],
  },
  [ADMIN_PATHS.discountCodes]: {
    namespace: "admin.headers",
    page: "coupons",
    fillViewport: true,
    actions: [
      {
        id: "add",
        kind: "add",
        labelNs: "admin.coupons",
        labelKey: "add",
      },
    ],
  },
  [ADMIN_PATHS.reviews]: {
    namespace: "admin.headers",
    page: "reviews",
    fillViewport: true,
  },
  [ADMIN_PATHS.auditLogs]: {
    namespace: "admin.headers",
    page: "auditLogs",
    fillViewport: true,
  },
  [ADMIN_PATHS.settings]: {
    namespace: "admin.headers",
    page: "settings",
  },
};

export function getPageHeader(pathname: string): PageHeaderSpec | undefined {
  const exact = PAGE_HEADERS[pathname];
  if (exact) {
    return exact;
  }
  if (isAdminDetailPath(pathname, ADMIN_PATHS.guests)) {
    return PAGE_HEADERS.guestDetail;
  }
  if (isAdminDetailPath(pathname, ADMIN_PATHS.businesses)) {
    return PAGE_HEADERS.businessDetail;
  }
  if (isAdminDetailPath(pathname, ADMIN_PATHS.noShows)) {
    return PAGE_HEADERS.noShowDetail;
  }
  if (isAdminDetailPath(pathname, ADMIN_PATHS.accounts)) {
    return PAGE_HEADERS.accountDetail;
  }
  if (isAdminDetailPath(pathname, ADMIN_PATHS.heritageSites)) {
    return PAGE_HEADERS.heritageSiteDetail;
  }
  if (pathname.startsWith(`${PROVIDER_PATHS.bookings}/`)) {
    return PAGE_HEADERS.providerBookingDetail;
  }
  return undefined;
}
