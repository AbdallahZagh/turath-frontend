import { ADMIN_PATHS } from "@/config/adminRoutes";
import type { AppRole } from "@/lib/auth/roles";

/** Role home routes from docs/PAGES.md §1 / §4. */
export function homePathForRole(role: AppRole): string {
  switch (role) {
    case "SUPER_ADMIN":
      return ADMIN_PATHS.home;
    case "PROVIDER_OWNER":
    case "PROVIDER_STAFF":
      return "/provider";
    case "TOURIST":
    default:
      return "/";
  }
}
