import {
  inviteProviderStaff as inviteProviderStaffMock,
  listProviderStaff as listProviderStaffMock,
  setProviderStaffActive as setProviderStaffActiveMock,
  type ProviderStaffMember,
} from "@/lib/mock/providerStaff";
import type { ProviderStaffInviteValues } from "@/lib/validation/providerStaff";

export async function listProviderStaff(): Promise<ProviderStaffMember[]> {
  return listProviderStaffMock();
}

export async function inviteProviderStaff(
  values: ProviderStaffInviteValues,
): Promise<ProviderStaffMember> {
  return inviteProviderStaffMock(values);
}

export async function setProviderStaffActive(input: {
  id: string;
  active: boolean;
}): Promise<ProviderStaffMember> {
  return setProviderStaffActiveMock(input.id, input.active);
}
