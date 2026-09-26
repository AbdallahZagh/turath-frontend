import { ADMIN_PATHS } from "@/config/adminRoutes";
import type { AppRole } from "@/lib/auth/roles";
import { safeReturnPath } from "@/lib/auth/returnTo";

/** Role home routes from docs/PAGES.md §1 / §4. */
function homePathForRole(role: AppRole): string {
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

/**
 * Where sign-in lands: a user goes back to the page they came from (or `/`);
 * business and admin accounts always open their own portal home.
 */
export function postSignInPath(role: AppRole, returnTo: string | undefined): string {
  if (role === "TOURIST") {
    return safeReturnPath(returnTo) ?? homePathForRole(role);
  }
  return homePathForRole(role);
}
