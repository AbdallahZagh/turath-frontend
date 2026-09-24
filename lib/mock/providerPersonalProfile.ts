import type { AppRole } from "@/lib/auth/roles";
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

let ownerProfile: ProviderOwnerPersonalProfile = {
  role: "PROVIDER_OWNER",
  name: "Samer Qabbani",
  email: "samer.qabbani@example.com",
  phone: "+963 955 367 890",
  nationality: "SY",
  dateOfBirth: "1987-04-18",
  joinedAt: "2026-02-12",
};

function cloneProfile<T extends ProviderPersonalProfile>(profile: T): T {
  return { ...profile };
}

export function getProviderPersonalProfile(role: ProviderAccountRole): ProviderPersonalProfile {
  if (role === "PROVIDER_OWNER") return cloneProfile(ownerProfile);

  const staffMember = listProviderStaff().find((member) => member.id === "staff-hala");
  if (!staffMember) throw new Error("Provider staff profile not found");
  return {
    role: "PROVIDER_STAFF",
    name: staffMember.name,
    phone: staffMember.phone,
    accessRole: staffMember.role,
    status: staffMember.status,
    joinedAt: staffMember.invitedAt,
  };
}

export function updateProviderPersonalProfile(
  values: ProviderPersonalProfileValues,
): ProviderOwnerPersonalProfile {
  ownerProfile = { ...ownerProfile, ...values };
  return cloneProfile(ownerProfile);
}

export function setMockProviderOwnerSignupProfile(
  values: ProviderPersonalProfileValues,
): void {
  ownerProfile = { ...ownerProfile, ...values };
}
