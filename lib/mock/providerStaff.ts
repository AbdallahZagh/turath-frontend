import {
  PROVIDER_STAFF_ROLES,
  type ProviderStaffInviteValues,
  type ProviderStaffUpdateValues,
} from "@/lib/validation/providerStaff";
import { MOCK_USERS } from "@/lib/auth/session";

export type ProviderStaffRole = (typeof PROVIDER_STAFF_ROLES)[number];
export type ProviderStaffStatus = "active" | "invited" | "inactive";

export type ProviderStaffMember = {
  id: string;
  name: string;
  phone: string;
  role: ProviderStaffRole;
  status: ProviderStaffStatus;
  invitedAt: string;
  lastActiveAt: string | null;
};

const staff: ProviderStaffMember[] = [
  {
    id: "staff-hala",
    name: "Hala Karam",
    phone: "+963 933 245 678",
    role: "scanner",
    status: "active",
    invitedAt: "2026-04-12T10:00:00+03:00",
    lastActiveAt: "2026-09-23T08:42:00+03:00",
  },
  {
    id: "staff-nabil",
    name: "Nabil Khouri",
    phone: "+963 944 670 215",
    role: "readOnly",
    status: "active",
    invitedAt: "2026-05-03T14:15:00+03:00",
    lastActiveAt: "2026-09-22T19:10:00+03:00",
  },
  {
    id: "staff-rana",
    name: "Rana Masri",
    phone: "+963 955 184 302",
    role: "scanner",
    status: "invited",
    invitedAt: "2026-09-22T12:30:00+03:00",
    lastActiveAt: null,
  },
  {
    id: "staff-omar",
    name: "Omar Sabbagh",
    phone: "+963 988 731 440",
    role: "readOnly",
    status: "inactive",
    invitedAt: "2026-03-18T09:20:00+03:00",
    lastActiveAt: "2026-08-31T17:25:00+03:00",
  },
];

function cloneMember(member: ProviderStaffMember): ProviderStaffMember {
  return { ...member };
}

export function listProviderStaff(): ProviderStaffMember[] {
  return staff.map(cloneMember);
}

export function inviteProviderStaff(values: ProviderStaffInviteValues): ProviderStaffMember {
  const duplicate = staff.some(
    (member) => member.phone.replace(/\s|-/g, "") === values.phone.replace(/\s|-/g, ""),
  );
  if (duplicate) throw new Error("duplicatePhone");

  const member: ProviderStaffMember = {
    id: `staff-${Date.now().toString(36)}`,
    name: values.name,
    phone: values.phone,
    role: values.role,
    status: "invited",
    invitedAt: new Date().toISOString(),
    lastActiveAt: null,
  };
  staff.unshift(member);
  return cloneMember(member);
}

export function setProviderStaffActive(id: string, active: boolean): ProviderStaffMember {
  const index = staff.findIndex((member) => member.id === id);
  const current = staff[index];
  if (index < 0 || !current) throw new Error(`Unknown provider staff member: ${id}`);

  const updated: ProviderStaffMember = {
    ...current,
    status: active ? "active" : "inactive",
  };
  staff[index] = updated;
  return cloneMember(updated);
}

export function updateProviderStaff(
  id: string,
  values: ProviderStaffUpdateValues,
): ProviderStaffMember {
  const index = staff.findIndex((member) => member.id === id);
  const current = staff[index];
  if (index < 0 || !current) throw new Error(`Unknown provider staff member: ${id}`);

  const duplicate = staff.some(
    (member) => member.id !== id && member.phone.replace(/\s|-/g, "") === values.phone.replace(/\s|-/g, ""),
  );
  if (duplicate) throw new Error("duplicatePhone");

  const updated: ProviderStaffMember = { ...current, ...values };
  staff[index] = updated;
  if (id === "staff-hala") {
    MOCK_USERS.PROVIDER_STAFF = {
      ...MOCK_USERS.PROVIDER_STAFF,
      name: updated.name,
      phone: updated.phone,
    };
  }
  return cloneMember(updated);
}
