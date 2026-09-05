import type { AppRole } from "@/lib/auth/roles";

/** Role home routes from docs/PAGES.md §1 / §4. */
export function homePathForRole(role: AppRole): string {
  switch (role) {
    case "SUPER_ADMIN":
      return "/admin";
    case "PROVIDER_OWNER":
    case "PROVIDER_STAFF":
      return "/provider";
    case "TOURIST":
    default:
      return "/";
  }
}
