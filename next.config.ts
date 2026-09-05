import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

import { ADMIN_PATHS } from "./config/adminRoutes";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/admin/users", destination: ADMIN_PATHS.guests, permanent: true },
      { source: "/admin/users/:id", destination: `${ADMIN_PATHS.guests}/:id`, permanent: true },
      { source: "/admin/providers", destination: ADMIN_PATHS.businesses, permanent: true },
      {
        source: "/admin/providers/:id",
        destination: `${ADMIN_PATHS.businesses}/:id`,
        permanent: true,
      },
      { source: "/admin/disputes", destination: ADMIN_PATHS.noShows, permanent: true },
      { source: "/admin/disputes/:id", destination: `${ADMIN_PATHS.noShows}/:id`, permanent: true },
      { source: "/admin/ledger", destination: ADMIN_PATHS.accounts, permanent: true },
      { source: "/admin/ledger/:id", destination: `${ADMIN_PATHS.accounts}/:id`, permanent: true },
      { source: "/admin/attractions", destination: ADMIN_PATHS.heritageSites, permanent: true },
      {
        source: "/admin/attractions/:id",
        destination: `${ADMIN_PATHS.heritageSites}/:id`,
        permanent: true,
      },
      { source: "/admin/taxonomy", destination: ADMIN_PATHS.lists, permanent: true },
      { source: "/admin/commissions", destination: ADMIN_PATHS.fees, permanent: true },
      { source: "/admin/promotions", destination: ADMIN_PATHS.featured, permanent: true },
      { source: "/admin/coupons", destination: ADMIN_PATHS.discountCodes, permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
