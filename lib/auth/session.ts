import type { AppRole } from "@/lib/auth/roles";

export type MockUser = {
  id: string;
  name: string;
  email: string;
  role: AppRole;
};

export const MOCK_USERS: Record<AppRole, MockUser> = {
  TOURIST: {
    id: "user-tourist",
    name: "Rami Haddad",
    email: "rami.haddad@example.com",
    role: "TOURIST",
  },
  PROVIDER_STAFF: {
    id: "user-staff",
    name: "Hala Karam",
    email: "hala.karam@example.com",
    role: "PROVIDER_STAFF",
  },
  PROVIDER_OWNER: {
    id: "user-owner",
    name: "Samer Qabbani",
    email: "samer.qabbani@example.com",
    role: "PROVIDER_OWNER",
  },
  SUPER_ADMIN: {
    id: "user-admin",
    name: "Lina Nasser",
    email: "lina.nasser@turath.sy",
    role: "SUPER_ADMIN",
  },
};

export const DEFAULT_MOCK_USER: MockUser = MOCK_USERS.SUPER_ADMIN;
