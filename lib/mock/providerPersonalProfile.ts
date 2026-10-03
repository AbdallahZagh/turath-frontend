import type { AppRole } from "@/lib/auth/roles";
import { MOCK_USERS, type MockUser } from "@/lib/auth/session";
import { todayInSyria } from "@/lib/format/datetime";
import {
  listProviderStaff,
  type ProviderStaffRole,
  type ProviderStaffStatus,
} from "@/lib/mock/providerStaff";
import type { ProviderPersonalProfileValues } from "@/lib/validation/providerPersonalProfile";

export type ProviderAccountRole = Extract<AppRole, "PROVIDER_OWNER" | "PROVIDER_STAFF">;

type ProviderPersonalProfileBase = {
  name: string;
  phone: string;
  joinedAt: string;
};

export type ProviderOwnerPersonalProfile = ProviderPersonalProfileBase &
  ProviderPersonalProfileValues & {
    role: "PROVIDER_OWNER";
  };

export type ProviderStaffPersonalProfile = ProviderPersonalProfileBase & {
  role: "PROVIDER_STAFF";
  accessRole: ProviderStaffRole;
  status: ProviderStaffStatus;
};

export type ProviderPersonalProfile =
  | ProviderOwnerPersonalProfile
  | ProviderStaffPersonalProfile;

/** The signed-in business account, as the session holds it (`MockUser`). */
export type ProviderAccount = Pick<MockUser, "id" | "name" | "email" | "phone"> & {
  role: ProviderAccountRole;
};

/** Owner profiles by session account id (`MOCK_USERS`, `MOCK_DINING_OWNER`); sign-up adds one. */
const ownerProfiles = new Map<string, ProviderOwnerPersonalProfile>([
  [
    MOCK_USERS.PROVIDER_OWNER.id,
    {
      role: "PROVIDER_OWNER",
      name: "Samer Qabbani",
      email: "samer.qabbani@example.com",
      phone: "+963 955 367 890",
      nationality: "SY",
      dateOfBirth: "1987-04-18",
      joinedAt: "2026-02-12",
    },
  ],
]);

/** Staff session accounts and their entry in the business's staff list (lib/mock/providerStaff.ts). */
const STAFF_MEMBER_BY_ACCOUNT: Record<string, string> = {
  [MOCK_USERS.PROVIDER_STAFF.id]: "staff-hala",
};

function cloneProfile<T extends ProviderPersonalProfile>(profile: T): T {
  return { ...profile };
}

/**
 * An owner with no stored profile (e.g. the dining test owner) starts from their own session
 * name, email and phone; nationality and date of birth stay blank until they fill them in.
 */
function ownerProfileFromSession(account: ProviderAccount): ProviderOwnerPersonalProfile {
  return {
    role: "PROVIDER_OWNER",
    name: account.name,
    email: account.email,
    phone: account.phone,
    nationality: "",
    dateOfBirth: "",
    joinedAt: todayInSyria(),
  };
}

function staffProfile(account: ProviderAccount): ProviderStaffPersonalProfile {
  const memberId = STAFF_MEMBER_BY_ACCOUNT[account.id];
  const member = memberId ? listProviderStaff().find((item) => item.id === memberId) : undefined;
  if (!member) {
    return {
      role: "PROVIDER_STAFF",
      name: account.name,
      phone: account.phone,
      accessRole: "scanner",
      status: "active",
      joinedAt: todayInSyria(),
    };
  }
  return {
    role: "PROVIDER_STAFF",
    name: member.name,
    phone: member.phone,
    accessRole: member.role,
    status: member.status,
    joinedAt: member.invitedAt,
  };
}

/** The signed-in person's own profile, picked by their session account, never by role alone. */
export function getProviderPersonalProfile(account: ProviderAccount): ProviderPersonalProfile {
  if (account.role === "PROVIDER_STAFF") return staffProfile(account);
  return cloneProfile(ownerProfiles.get(account.id) ?? ownerProfileFromSession(account));
}

export function updateProviderPersonalProfile(
  account: ProviderAccount,
  values: ProviderPersonalProfileValues,
): ProviderOwnerPersonalProfile {
  const current = ownerProfiles.get(account.id) ?? ownerProfileFromSession(account);
  const updated: ProviderOwnerPersonalProfile = { ...current, ...values };
  ownerProfiles.set(account.id, updated);
  return cloneProfile(updated);
}

/** Business sign-up: the new owner signs in as the owner demo account with these details. */
export function setMockProviderOwnerSignupProfile(values: ProviderPersonalProfileValues): void {
  ownerProfiles.set(MOCK_USERS.PROVIDER_OWNER.id, {
    role: "PROVIDER_OWNER",
    ...values,
    joinedAt: todayInSyria(),
  });
}
