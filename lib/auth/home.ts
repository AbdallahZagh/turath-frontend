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

/** Business sign-up pages sit under /provider but are open to anyone; the rest is portal. */
const BUSINESS_SIGN_UP_PATHS = [
  "/provider/register",
  PROVIDER_PATHS.onboarding,
  PROVIDER_PATHS.pending,
];

function isPortalPath(path: string): boolean {
  if (BUSINESS_SIGN_UP_PATHS.some((open) => isInside(path, open))) return false;
  return isInside(path, ADMIN_PATHS.home) || isInside(path, PROVIDER_PATHS.home);
}

/**
 * Where sign-in lands. A user goes back to the page they came from when it is public or in
 * `/user` (a business or admin page sends them to `/`). Business and
 * admin accounts go back only when that page is inside their own portal; otherwise they
 * open their portal home.
 */
export function postSignInPath(role: AppRole, returnTo: string | undefined): string {
  const home = homePathForRole(role);
  const safe = safeReturnPath(returnTo);
  if (role === "TOURIST") {
    return safe && !isPortalPath(safe) ? safe : home;
  }
  return safe && isInside(safe, home) ? safe : home;
}
