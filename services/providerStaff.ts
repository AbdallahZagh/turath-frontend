import {
  inviteProviderStaff as inviteProviderStaffMock,
  listProviderStaff as listProviderStaffMock,
  setProviderStaffActive as setProviderStaffActiveMock,
  updateProviderStaff as updateProviderStaffMock,
  type ProviderStaffMember,
} from "@/lib/mock/providerStaff";
import type {
  ProviderStaffInviteValues,
  ProviderStaffUpdateValues,
} from "@/lib/validation/providerStaff";

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

export async function updateProviderStaff(input: {
  id: string;
  values: ProviderStaffUpdateValues;
}): Promise<ProviderStaffMember> {
  return updateProviderStaffMock(input.id, input.values);
}
