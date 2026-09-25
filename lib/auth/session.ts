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
