import type { AppRole } from "@/lib/auth/roles";

export type MockUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: AppRole;
};

export const MOCK_USERS: Record<AppRole, MockUser> = {
  TOURIST: {
    id: "user-tourist",
    name: "Rami Haddad",
    email: "rami.haddad@example.com",
    phone: "+963 944 123 456",
    role: "TOURIST",
  },
  PROVIDER_STAFF: {
    id: "user-staff",
    name: "Hala Karam",
    email: "hala.karam@example.com",
    phone: "+963 933 245 678",
    role: "PROVIDER_STAFF",
  },
  PROVIDER_OWNER: {
    id: "user-owner",
    name: "Samer Qabbani",
    email: "samer.qabbani@example.com",
    phone: "+963 955 367 890",
    role: "PROVIDER_OWNER",
  },
  SUPER_ADMIN: {
    id: "user-admin",
    name: "Lina Nasser",
    email: "lina.nasser@turath.sy",
    phone: "+963 966 481 203",
    role: "SUPER_ADMIN",
  },
};

/** Signed-out placeholder. Never a privileged role; portals also check `isAuthenticated`. */
export const DEFAULT_MOCK_USER: MockUser = MOCK_USERS.TOURIST;

function phoneDigits(value: string): string {
  // Compare the national number so "+963 955 367 890", "0955367890" and "955367890" all match.
  return value.replace(/\D/g, "").slice(-9);
}

/**
 * Mock sign-in: the demo account whose email or phone matches signs in with its own role
 * (business owner, staff, admin). Any other destination signs in as a user.
 */
export function mockRoleForSignIn(channel: "phone" | "email", destination: string): AppRole {
  const value = destination.trim();
  const match = Object.values(MOCK_USERS).find((user) =>
    channel === "email"
      ? user.email.toLowerCase() === value.toLowerCase()
      : value.length > 0 && phoneDigits(user.phone) === phoneDigits(value),
  );
  return match?.role ?? "TOURIST";
}
