import { ADMIN_PATHS } from "@/config/adminRoutes";
import { PROVIDER_PATHS } from "@/config/providerRoutes";
import type { AppRole } from "@/lib/auth/roles";
import { safeReturnPath } from "@/lib/auth/returnTo";

/** Role home routes from docs/PAGES.md §1 / §4. */
function homePathForRole(role: AppRole): string {
  switch (role) {
    case "SUPER_ADMIN":
      return ADMIN_PATHS.home;
    case "PROVIDER_OWNER":
    case "PROVIDER_STAFF":
      return PROVIDER_PATHS.home;
    case "TOURIST":
    default:
      return "/";
  }
}

function isInside(path: string, home: string): boolean {
  const pathname = path.split(/[?#]/, 1)[0];
  return pathname === home || pathname.startsWith(`${home}/`);
}

/**
 * Where sign-in lands. A user goes back to the page they came from (or `/`). Business and
 * admin accounts go back only when that page is inside their own portal; otherwise they
 * open their portal home.
 */
export function postSignInPath(role: AppRole, returnTo: string | undefined): string {
  const home = homePathForRole(role);
  const safe = safeReturnPath(returnTo);
  if (role === "TOURIST") {
    return safe ?? home;
  }
  return safe && isInside(safe, home) ? safe : home;
}
